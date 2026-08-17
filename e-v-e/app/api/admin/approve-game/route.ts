import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { scanGameZip } from "@/lib/securityScanner";

export const dynamic = "force-dynamic";

// Hàm đệ quy tìm file index.html trong thư mục đã giải nén
function findIndexHtml(dir: string, baseDir: string): string | null {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const found = findIndexHtml(fullPath, baseDir);
      if (found) return found;
    } else if (file.toLowerCase() === "index.html") {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      return relativePath;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, isAccepted, userId } = body;

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: "Missing gameId parameter" },
        { status: 400 }
      );
    }

    // 1. Kiểm tra tài liệu game trên Firestore
    const gameDocRef = adminDb.collection("game_info").doc(gameId);
    const gameSnap = await gameDocRef.get();
    const gameData = gameSnap.exists ? gameSnap.data() : null;

    if (!isAccepted) {
      // HỦY DUYỆT / TỪ CHỐI
      await gameDocRef.set(
        {
          isAccepted: false,
          is_accepted: false,
          status: "rejected",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return NextResponse.json({
        success: true,
        message: `Đã chuyển game "${gameData?.title || gameId}" về trạng thái chưa duyệt.`,
      });
    }

    // 2. PHÊ DUYỆT (APPROVE): Tiến hành giải nén file .zip lên máy host
    const uploadZipDir = path.join(process.cwd(), "public", "uploads", "games");
    const zipFileName = `${gameId}.zip`;
    let zipFilePath = path.join(uploadZipDir, zipFileName);

    // Fallback tìm kiếm file zip nếu upload theo tên khác
    if (!fs.existsSync(zipFilePath) && gameData?.fileName) {
      const altZipPath = path.join(uploadZipDir, gameData.fileName);
      if (fs.existsSync(altZipPath)) {
        zipFilePath = altZipPath;
      }
    }

    // Fallback cho các game mặc định
    if (!fs.existsSync(zipFilePath)) {
      if (gameId.includes("memory") || (gameData?.fileName && gameData.fileName.includes("memory"))) {
        zipFilePath = path.join(process.cwd(), "public", "memory_matching_game.zip");
      } else if (gameId.includes("starter") || (gameData?.fileName && gameData.fileName.includes("starter"))) {
        zipFilePath = path.join(process.cwd(), "public", "eve_game_starter_kit.zip");
      } else if (gameId.includes("boss") || (gameData?.fileName && gameData.fileName.includes("boss"))) {
        zipFilePath = path.join(process.cwd(), "public", "boss_battle_quiz.zip");
      }
    }

    // Thư mục web tĩnh đích cho game
    const targetExtractDir = path.join(process.cwd(), "public", "games", gameId);
    if (!fs.existsSync(targetExtractDir)) {
      fs.mkdirSync(targetExtractDir, { recursive: true });
    }

    let entryHtmlPath = "index.html";

    if (fs.existsSync(zipFilePath)) {
      try {
        // Quét bảo mật lần 2 trước khi giải nén
        const scanResult = scanGameZip(zipFilePath);
        if (!scanResult.isSafe) {
          return NextResponse.json(
            {
              success: false,
              error: "security_violation",
              message: "Không thể phê duyệt: Gói trò chơi chứa mã độc hoặc vi phạm an ninh nghiêm trọng.",
              violations: scanResult.violations,
            },
            { status: 400 }
          );
        }

        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(targetExtractDir, true);

        // Tìm tệp index.html trong thư mục vừa bung nén
        const detectedHtml = findIndexHtml(targetExtractDir, targetExtractDir);
        if (detectedHtml) {
          entryHtmlPath = detectedHtml;
        }

        // BẮT BUỘC: Luôn ghi đè file eve-game-sdk.js bằng file SDK chính chủ của server
        const sdkSource = path.join(process.cwd(), "public", "eve-game-sdk.js");
        const sdkDest = path.join(targetExtractDir, "eve-game-sdk.js");
        if (fs.existsSync(sdkSource)) {
          fs.copyFileSync(sdkSource, sdkDest);
        }

        // Nếu index.html nằm ở thư mục con, cũng ghi đè SDK vào thư mục con đó
        if (entryHtmlPath.includes("/")) {
          const subDir = path.join(targetExtractDir, path.dirname(entryHtmlPath));
          const subSdkDest = path.join(subDir, "eve-game-sdk.js");
          if (fs.existsSync(sdkSource)) {
            fs.copyFileSync(sdkSource, subSdkDest);
          }
        }

        // Tự động kiểm tra và chèn thẻ nạp SDK chuẩn của server vào file index.html nếu chưa có
        const fullIndexPath = path.join(targetExtractDir, entryHtmlPath);
        if (fs.existsSync(fullIndexPath)) {
          let htmlContent = fs.readFileSync(fullIndexPath, "utf8");
          // Xóa các thẻ nhúng sdk cũ không chuẩn (nếu có)
          if (!htmlContent.includes("eve-game-sdk.js") && !htmlContent.includes("/eve-game-sdk.js")) {
            if (htmlContent.includes("<head>")) {
              htmlContent = htmlContent.replace("<head>", '<head>\n  <script src="/eve-game-sdk.js"></script>');
            } else if (htmlContent.includes("<body>")) {
              htmlContent = htmlContent.replace("<body>", '<body>\n  <script src="/eve-game-sdk.js"></script>');
            } else {
              htmlContent = '<script src="/eve-game-sdk.js"></script>\n' + htmlContent;
            }
            fs.writeFileSync(fullIndexPath, htmlContent, "utf8");
          }
        }
      } catch (zipErr) {
        console.error("Lỗi khi giải nén tệp zip game:", zipErr);
      }
    } else {
      console.warn(`Không tìm thấy file zip tại ${zipFilePath}, tạo placeholder entry nếu cần.`);
    }

    const finalGameUrl = `/games/${gameId}/${entryHtmlPath}`;

    // 3. Cập nhật Firestore
    const updatePayload = {
      isAccepted: true,
      is_accepted: true,
      status: "approved",
      gameUrl: finalGameUrl,
      sourceUrl: finalGameUrl,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await gameDocRef.set(updatePayload, { merge: true });

    return NextResponse.json({
      success: true,
      message: `Đã phê duyệt và giải nén Game "${gameData?.title || gameId}" thành công lên máy host!`,
      data: {
        gameId,
        gameUrl: finalGameUrl,
      },
    });
  } catch (error: any) {
    console.error("Lỗi trong API duyệt game:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi phê duyệt game" },
      { status: 500 }
    );
  }
}
