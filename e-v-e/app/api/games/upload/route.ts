import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
import fs from "fs";
import path from "path";
import { scanGameZip } from "@/lib/securityScanner";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const gameId = (formData.get("gameId") as string) || `game_${Date.now()}`;
    const title = (formData.get("title") as string) || "Trò chơi mới";
    const description = (formData.get("description") as string) || "";
    const rules = (formData.get("rules") as string) || "";
    const rewardCoins = Math.max(0, Math.min(500, Math.floor(Number(formData.get("rewardCoins")) || 0)));
    const authorId = (formData.get("authorId") as string) || "anonymous";
    const authorName = (formData.get("authorName") as string) || "Giáo viên";
    const visibility = (formData.get("visibility") as string) || "public";
    const needExtraData = formData.get("needExtraData") !== "false";
    // Chỉ tiêu tối thiểu (passRule): mọi game bắt buộc có ít nhất 1 chỉ tiêu. Mặc định: chiến thắng.
    let passRule: any = { type: "win" };
    const passRuleRaw = formData.get("passRule") as string;
    if (passRuleRaw) {
      try {
        const parsed = JSON.parse(passRuleRaw);
        if (parsed && typeof parsed === "object" && parsed.type) {
          passRule = parsed;
        }
      } catch {
        passRule = { type: "win" };
      }
    }
    const coursesAllowedRaw = formData.get("coursesAllowed") as string;
    let coursesAllowed: any = "all";
    if (coursesAllowedRaw) {
      try {
        coursesAllowed = JSON.parse(coursesAllowedRaw);
      } catch {
        coursesAllowed = coursesAllowedRaw;
      }
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn file nén (.zip) của trò chơi để tải lên." },
        { status: 400 }
      );
    }

    // 1. Tạo thư mục lưu trữ file nén thô trên máy host
    const uploadDir = path.join(process.cwd(), "public", "uploads", "games");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const zipFileName = `${gameId}.zip`;
    const zipFilePath = path.join(uploadDir, zipFileName);

    // 2. Quét bảo mật toàn diện file zip (Tìm mã độc, cấm file thực thi, chống Zip Slip & lệnh shell nguy hiểm)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const scanResult = scanGameZip(buffer);

    if (!scanResult.isSafe) {
      return NextResponse.json(
        {
          success: false,
          error: "security_violation",
          message: "Tệp game bị từ chối do vi phạm tiêu chuẩn bảo mật hệ thống E-V-E.",
          violations: scanResult.violations,
        },
        { status: 400 }
      );
    }

    fs.writeFileSync(zipFilePath, buffer);

    const fileSizeFormatted = `${(file.size / 1024).toFixed(1)} KB`;
    const zipRelPath = `/uploads/games/${zipFileName}`;

    const combinedDescription = [
      description.trim() ? `Mô tả: ${description.trim()}` : "",
      rules.trim() ? `Luật chơi: ${rules.trim()}` : "",
    ].filter(Boolean).join("\n\n") || description.trim() || "Trò chơi tương tác học tập tích hợp E-V-E Game SDK.";

    // 3. Đăng ký metadata vào Firestore (ở trạng thái CHỜ DUYỆT, CHƯA GIẢI NÉN)
    const payload = {
      id: gameId,
      gameId: gameId,
      title,
      description: combinedDescription,
      rules: rules.trim(),
      rewardCoins,
      summary: description.trim(),
      authorId,
      author_id: authorId,
      uploaderId: authorId,
      uploader_id: authorId,
      authorName,
      authors: [authorName],
      visibility,
      needExtraData,
      need_extra_data: needExtraData,
      coursesAllowed,
      courses_allowed: coursesAllowed,
      coursesBlocked: [],
      courses_blocked: [],
      passRule,
      pass_rule: passRule,
      zipPath: zipRelPath,
      fileName: file.name,
      file_name: file.name,
      fileSize: fileSizeFormatted,
      downloadUrl: zipRelPath,
      download_url: zipRelPath,
      downloadSourceUrl: zipRelPath,
      download_source_url: zipRelPath,
      gameUrl: "", // Chỉ được gán sau khi Admin phê duyệt và giải nén
      sourceUrl: "",
      isAccepted: false,
      is_accepted: false,
      status: "pending",
      playsCount: 0,
      plays_count: 0,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    try {
      await adminDb.collection("game_info").doc(gameId).set(payload, { merge: true });
    } catch (dbErr) {
      console.warn("Firestore save warning in game upload route:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Đã tải lên game "${title}" thành công. Tệp .zip đã được lưu an toàn trên máy host và chuyển tới hàng đợi Admin phê duyệt!`,
      data: payload,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải lên game .zip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi xử lý file .zip" },
      { status: 500 }
    );
  }
}
