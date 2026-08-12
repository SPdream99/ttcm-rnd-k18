/**
 * SCRIPT KHỞI TẠO DATABASE AN TOÀN (SAFE DATABASE INITIALIZER)
 *
 * Nguyên tắc:
 * 1. GIỮ NGUYÊN HOÀN TOÀN tất cả các Document và Collection đã có sẵn.
 * 2. Chỉ tạo thêm các Document/Collection mới nếu chưa có dữ liệu.
 * 3. Chạy trên Firestore Database ID: 'default'
 *
 * Cách chạy:
 *   node --env-file=.env.local scripts/initDatabase.mjs
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Read .env.local
const serviceAccountKey = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error('❌ THẤT BẠI: Chưa có FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);
const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id })
  : getApps()[0];

// Kết nối tới database 'default'
const db = getFirestore(app, 'default');
db.settings({ ignoreUndefinedProperties: true });

async function initDatabaseSafely() {
  console.log('🚀 Đang kiểm tra và khởi tạo Database Firestore (Database ID: "default")...\n');

  let addedCount = 0;
  let skippedCount = 0;

  // 1. DỮ LIỆU MẪU KHÓA HỌC (Nếu collection courses trống hoặc chưa có course-001)
  const coursesRef = db.collection('courses');
  const courseDoc = await coursesRef.doc('course-001').get();

  if (!courseDoc.exists) {
    console.log('📦 Thêm khóa học mẫu ID "course-001"...');
    const defaultCourse = {
      title: 'Lập Trình Python AI & Machine Learning',
      japaneseTitle: 'コース概要',
      subtitle: 'Hệ Sinh Thái E-V-E Cosmic Knowledge Class',
      description: 'Chinh phục trí tuệ nhân tạo từ nền tảng Python với sự hỗ trợ 24/7 từ Trợ Lý E-V-E Mentor. Lộ trình cá nhân hóa 100%.',
      instructorId: 'user-002',
      isPublished: true,
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
      tags: ['python', 'ai', 'lập trình', 'machine learning'],
      totalDuration: '24 Giờ 30 Phút',
      studentsCount: 128,
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await coursesRef.doc('course-001').set(defaultCourse);
    addedCount++;
    console.log('   ✅ Đã tạo khóa học mẫu ID: "course-001"');

    // Thêm lessons subcollection cho course-001
    const lessonsRef = coursesRef.doc('course-001').collection('lessons');
    await lessonsRef.doc('lesson-1').set({
      title: 'Bài 1: Giới Thiệu Cú Pháp Python & Môi Trường E-V-E',
      description: 'Tổng quan ngôn ngữ Python, cài đặt môi trường và tương tác với AI Assistant.',
      type: 'video',
      duration: 1800,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await lessonsRef.doc('lesson-2').set({
      title: 'Bài 2: Kiểu Dữ Liệu & Biến Trong Python',
      description: 'Khái niệm về String, Integer, List, Dictionary và cách quản lý bộ nhớ.',
      type: 'video',
      duration: 2400,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await lessonsRef.doc('lesson-3').set({
      title: 'Bài 3: Cấu Trúc Điều Kiện & Vòng Lặp Advanced',
      description: 'Luyện tập tư duy thuật toán với If-Else, For, While và List Comprehension.',
      type: 'quiz',
      duration: 1200,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('   ✅ Đã tạo 3 bài học mẫu trong subcollection /courses/course-001/lessons');
  } else {
    console.log('ℹ️ Document "course-001" đã tồn tại → Giữ nguyên!');
  }

  // 2. COLLECTION ANNOUNCEMENTS (Thông báo lớp học)
  const annSnap = await db.collection('announcements').get();
  if (annSnap.empty) {
    console.log('📦 Collection "announcements" chưa có dữ liệu → Khởi tạo thông báo mẫu...');
    await db.collection('announcements').doc('ann-001').set({
      courseId: 'course-001',
      authorId: 'user-002',
      authorName: 'Giảng Viên Trần Thị Bình',
      authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk-pfjflS3EjBlEHovdjkW8RWvgU2ppYjzoRvk3Jb0mpvJafHbIkF0VXpcWaL3eNFMpKFgoOSs-LMLQc5IvOWPTFe61WV5OuV7ssu_Nj4qlGeF1Ljw0_Wc6aNlmdUfsDvaS1ohv8d5oMsTY6H2DiIdurwMhWZrRYf6LbVdVPvcfRUlmelLwIMjczzRt-BFKmTKSwIs78CvH8ApQBIs64hQK_kGY9GhYeEg5ivYq2XqE9VJB6GXUT-3',
      title: '🚀 Lịch Live Coding & Q&A Tuần Này Với E-V-E AI Mentor',
      content: 'Chào cả lớp! Tối thứ 5 tuần này lúc 20:00 chúng ta sẽ có buổi giải đáp thắc mắc về Vòng lặp & Thuật toán Python. Hãy chuẩn bị câu hỏi gửi cho E-V-E AI Mentor trước nhé!',
      isImportant: true,
      createdAt: new Date(),
    });
    addedCount++;
    console.log('   ✅ Đã tạo thông báo mẫu ID: "ann-001"');
  } else {
    console.log(`ℹ️ Collection "announcements" đã có ${annSnap.size} thông báo → Giữ nguyên!`);
  }

  // 3. COLLECTION RESOURCES (Tài liệu bài giảng & Press Kit)
  const resSnap = await db.collection('resources').get();
  if (resSnap.empty) {
    console.log('📦 Collection "resources" chưa có dữ liệu → Khởi tạo tài liệu mẫu...');
    const resourcesSample = [
      {
        id: 'res-001',
        courseId: 'course-001',
        title: 'Giáo Trình Python Cơ Bản 到 Nâng Cao (Full PDF)',
        description: 'Tài liệu chuẩn mực hệ thống E-V-E biên soạn.',
        fileUrl: '#',
        fileType: 'pdf',
        fileSize: '15.4 MB',
        downloadCount: 342,
        uploadedAt: new Date(),
      },
      {
        id: 'res-002',
        courseId: 'course-001',
        title: 'Bộ Source Code Mẫu Thuật Toán Python (ZIP)',
        description: 'Bao gồm 50 bài tập kèm đáp án giải chi tiết.',
        fileUrl: '#',
        fileType: 'zip',
        fileSize: '8.2 MB',
        downloadCount: 189,
        uploadedAt: new Date(),
      },
      {
        id: 'res-003',
        courseId: 'course-001',
        title: 'E-V-E Press Kit & Slide Bài Giảng',
        description: 'Hình ảnh, biểu đồ tư duy và slide tổng hợp kiến thức.',
        fileUrl: '#',
        fileType: 'code',
        fileSize: '22.0 MB',
        downloadCount: 520,
        uploadedAt: new Date(),
      },
    ];

    for (const res of resourcesSample) {
      await db.collection('resources').doc(res.id).set(res);
      addedCount++;
    }
    console.log('   ✅ Đã tạo 3 tài liệu mẫu trong collection "resources"');
  } else {
    console.log(`ℹ️ Collection "resources" đã có ${resSnap.size} tài liệu → Giữ nguyên!`);
  }

  // 4. COLLECTION DISCUSSIONS (Thảo luận / Hỏi đáp)
  const discSnap = await db.collection('discussions').get();
  if (discSnap.empty) {
    console.log('📦 Collection "discussions" chưa có dữ liệu → Khởi tạo thảo luận mẫu...');
    await db.collection('discussions').doc('disc-001').set({
      courseId: 'course-001',
      lessonId: 'lesson-2',
      authorId: 'user-001',
      authorName: 'Nguyễn Văn An',
      authorRole: 'student',
      title: 'Thắc mắc về List Comprehension trong Bài 2?',
      content: 'Thầy và E-V-E Mentor cho em hỏi làm sao để lồng nhiều điều kiện if-else vào một dòng List Comprehension ạ?',
      replyCount: 3,
      isResolved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    addedCount++;
    console.log('   ✅ Đã tạo thảo luận mẫu ID: "disc-001"');
  } else {
    console.log(`ℹ️ Collection "discussions" đã có ${discSnap.size} thảo luận → Giữ nguyên!`);
  }

  console.log('\n==================================================');
  console.log(`🎉 HOÀN THÀNH QUY TRÌNH KHỞI TẠO DATABASE!`);
  console.log(`   - Số tài liệu tạo mới: ${addedCount}`);
  console.log(`   - Dữ liệu cũ được giữ nguyên: 100%`);
  console.log('==================================================\n');
}

initDatabaseSafely().catch((err) => {
  console.error('💥 Lỗi khi khởi tạo database:', err);
  process.exit(1);
});
