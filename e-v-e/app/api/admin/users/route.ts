import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/infrastructure/firebase/firebaseAdmin";

/**
 * GET /api/admin/users
 * Lấy danh sách toàn bộ người dùng, tự động kiểm tra và xóa các User Document mồ côi
 * (tồn tại trong Firestore collection 'users' nhưng KHÔNG tồn tại trong Firebase Authentication).
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Lấy toàn bộ người dùng từ Firebase Authentication
    let authUsersMap = new Map<string, { uid: string; email?: string }>();
    try {
      const listUsersResult = await adminAuth.listUsers(1000);
      listUsersResult.users.forEach((u) => {
        authUsersMap.set(u.uid, { uid: u.uid, email: u.email?.toLowerCase() });
      });
    } catch (authErr) {
      console.warn("Could not fetch Auth users list via Admin SDK:", authErr);
    }

    // 2. Lấy toàn bộ documents trong collection 'users'
    const usersSnap = await adminDb.collection("users").get();
    const cleanUsers: any[] = [];
    const deletedOrphanIds: string[] = [];

    const authUids = new Set(authUsersMap.keys());
    const authEmails = new Set(
      Array.from(authUsersMap.values())
        .map((u) => u.email)
        .filter(Boolean)
    );

    for (const docSnap of usersSnap.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;
      const userUid = data.uid || docId;
      const userEmail = (data.email || "").toLowerCase().trim();

      // Kiểm tra xem User có tồn tại trong Firebase Authentication hay không
      const existsInAuth =
        authUids.has(docId) ||
        authUids.has(userUid) ||
        (userEmail && authEmails.has(userEmail));

      // Nếu có danh sách Auth và user KHÔNG tồn tại trong Auth -> Tự động xóa khỏi Firestore
      if (authUsersMap.size > 0 && !existsInAuth) {
        try {
          await adminDb.collection("users").doc(docId).delete();
          // Nếu là teacher, dọn dẹp collection teachers tương ứng nếu có
          if (data.role === "teacher") {
            await adminDb.collection("teachers").doc(docId).delete().catch(() => {});
          }
          deletedOrphanIds.push(docId);
          console.log(`[Auto-Clean] Đã xóa User mồ côi khỏi Firestore: ${docId} (${userEmail})`);
        } catch (delErr) {
          console.warn(`Lỗi khi xóa user mồ côi ${docId}:`, delErr);
        }
      } else {
        cleanUsers.push({
          id: docId,
          uid: userUid,
          name: data.name || data.fullName || "Người dùng E-V-E",
          fullName: data.fullName || data.name || "Người dùng E-V-E",
          email: data.email || "",
          role: data.role || "student",
          status: data.status || "active",
          departmentOrClass: data.departmentOrClass || (data.schoolCode ? `Mã trường: ${data.schoolCode}` : ""),
          coins: Number(data.coins) || 0,
          createdAt: data.createdAt || "2026",
          phone: data.phone || "",
          twoFactorEnabled: Boolean(data.twoFactorEnabled),
        });
      }
    }

    return NextResponse.json({
      success: true,
      users: cleanUsers,
      totalUsers: cleanUsers.length,
      deletedOrphanCount: deletedOrphanIds.length,
      deletedOrphanIds,
    });
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Cập nhật trạng thái duyệt/khóa người dùng
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, status, role } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (role) updates.role = role;

    await adminDb.collection("users").doc(userId).update(updates);

    return NextResponse.json({ success: true, message: "Cập nhật người dùng thành công" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Xóa người dùng cả trong Authentication lẫn Firestore
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    // Xóa trong Firestore
    await adminDb.collection("users").doc(userId).delete();
    await adminDb.collection("teachers").doc(userId).delete().catch(() => {});

    // Xóa trong Firebase Auth nếu tồn tại
    try {
      await adminAuth.deleteUser(userId);
    } catch (authErr) {
      console.warn("User already not in Auth or delete failed:", authErr);
    }

    return NextResponse.json({ success: true, message: "Đã xóa người dùng thành công" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
