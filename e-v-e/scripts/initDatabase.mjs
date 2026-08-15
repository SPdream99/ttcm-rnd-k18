/**
 * SCRIPT KHỞI TẠO DATABASE AN TOÀN (SAFE DATABASE INITIALIZER)
 *
 * Nguyên tắc:
 * 1. GIỮ NGUYÊN HOÀN TOÀN tất cả các Document và Collection đã có sẵn.
 * 2. Chỉ tạo thêm các Document/Collection mới nếu chưa có dữ liệu hoặc bổ sung các mục còn thiếu.
 * 3. Chạy trên Firestore Database ID: 'default'
 *
 * Cách chạy:
 *   node --env-file=.env.local scripts/initDatabase.mjs
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const serviceAccountKey = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error(' THẤT BẠI: Chưa có FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);
const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id })
  : getApps()[0];

const db = getFirestore(app, 'default');
db.settings({ ignoreUndefinedProperties: true });

async function initDatabaseSafely() {
  console.log(' Đang kiểm tra và khởi tạo Database Firestore (Database ID: "default")...\n');

  let addedCount = 0;

  // 1. TEACHERS COLLECTION
  const teachersRef = db.collection('teachers');
  const teachersList = [
    {
      id: 'teacher_nhatanh_01',
      name: 'GS. Nguyễn Nhật Anh',
      fullName: 'GS. Nguyễn Nhật Anh',
      email: 'nhatanh@eve.edu.vn',
      specialty: 'Trí Tuệ Nhân Tạo & Kiến Trúc Hệ Thống',
      bio: 'Trưởng ban học thuật E-V-E, chuyên gia về AI Agents và Machine Learning.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'teacher_dat_01',
      name: 'ThS. Nguyễn Thành Đạt',
      fullName: 'ThS. Nguyễn Thành Đạt',
      email: 'dat1@gmail.com',
      specialty: 'Phát Triển Web & Gamification',
      bio: 'Chuyên gia thiết kế trò chơi học tập và giao diện người dùng E-V-E.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  for (const t of teachersList) {
    const doc = await teachersRef.doc(t.id).get();
    if (!doc.exists) {
      await teachersRef.doc(t.id).set(t);
      addedCount++;
      console.log(`    Đã tạo Giảng viên: "${t.name}" (ID: ${t.id})`);
    }
  }

  // 2. COURSES COLLECTION
  const coursesRef = db.collection('courses');
  const coursesList = [
    {
      id: 'crs_python_foundation',
      title: 'Chặng 1: Nền Tảng Lập Trình Python & Tư Duy Thuật Toán',
      subtitle: 'Làm chủ cú pháp, kiểu dữ liệu, hàm và lập trình hướng đối tượng (OOP)',
      description: 'Khóa học cung cấp nền móng vững chắc về ngôn ngữ Python, rèn luyện tư duy giải quyết vấn đề bằng code và chuẩn bị sẵn sàng cho các bài toán xử lý dữ liệu phức tạp.',
      category: 'Lập Trình Cơ Bản',
      difficulty: 'Beginner',
      estimated_hours: 8,
      authorName: 'GS. Nguyễn Nhật Anh',
      author_id: 'teacher_nhatanh_01',
      totalLessons: 12,
      rewardCoins: 80,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
      tags: ['python', 'programming', 'basics', 'algorithms'],
    },
    {
      id: 'crs_data_structure_algorithms',
      title: 'Chặng 2: Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
      subtitle: 'Tối ưu độ phức tạp không gian và thời gian O(N) trong xử lý dữ liệu lớn',
      description: 'Tìm hiểu sâu về Array, Linked List, Stack, Queue, Tree, Graph và các thuật toán tìm kiếm/sắp xếp cốt lõi, áp dụng trực tiếp qua các minigame đối kháng kiến thức.',
      category: 'Cấu Trúc Dữ Liệu',
      difficulty: 'Intermediate',
      estimated_hours: 10,
      authorName: 'GS. Nguyễn Nhật Anh',
      author_id: 'teacher_nhatanh_01',
      totalLessons: 14,
      rewardCoins: 120,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
      tags: ['dsa', 'algorithms', 'data-structures', 'optimization'],
    },
    {
      id: 'crs_machine_learning_core',
      title: 'Chặng 3: Học Máy Thực Chiến & Phân Tích Dữ Liệu Lớn',
      subtitle: 'Xây dựng mô hình dự đoán với hồi quy, phân loại và học không giám sát',
      description: 'Thực hành huấn luyện mô hình Machine Learning với Scikit-Learn, tiền xử lý dữ liệu với Pandas/NumPy và trực quan hóa các chỉ số đánh giá độ chính xác (Precision, Recall, F1-Score).',
      category: 'Machine Learning',
      difficulty: 'Intermediate',
      estimated_hours: 10,
      authorName: 'GS. Nguyễn Nhật Anh',
      author_id: 'teacher_nhatanh_01',
      totalLessons: 15,
      rewardCoins: 150,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      tags: ['machine-learning', 'numpy', 'pandas', 'scikit-learn'],
    },
    {
      id: 'crs_generative_ai_projects',
      title: 'Chặng 4: Phát Triển Ứng Dụng Generative AI & AI Agent',
      subtitle: 'Tích hợp LLM APIs, Prompt Engineering, RAG và xây dựng AI Assistant',
      description: 'Chặng đồ án thực tế: Tự tay phát triển các AI Agent thông minh có khả năng truy xuất cơ sở dữ liệu (RAG), sinh mã nguồn tự động và giải quyết các bài toán thực tiễn.',
      category: 'Generative AI',
      difficulty: 'Advanced',
      estimated_hours: 12,
      authorName: 'GS. Nguyễn Nhật Anh',
      author_id: 'teacher_nhatanh_01',
      totalLessons: 16,
      rewardCoins: 200,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      tags: ['generative-ai', 'llm', 'rag', 'ai-agent', 'gemini'],
    },
  ];

  for (const c of coursesList) {
    const doc = await coursesRef.doc(c.id).get();
    if (!doc.exists) {
      await coursesRef.doc(c.id).set(c);
      addedCount++;
      console.log(`    Đã tạo Khóa học: "${c.title}" (ID: ${c.id})`);
    }
  }

  // 3. LEARNING PATH COLLECTION
  const pathRef = db.collection('learning_path');
  const pathList = [
    {
      id: 'lp_ai_mastery_2026',
      title: 'Chuyên Gia Trí Tuệ Nhân Tạo & Generative AI 2026 ',
      subtitle: 'Lộ trình 4 chặng toàn diện từ Python đến xây dựng AI Agent thực tế',
      description: 'Chương trình đào tạo chuyên sâu được thiết kế bài bản qua 4 chặng học tập: Khởi đầu từ nền tảng Python vững chắc, làm chủ Cấu trúc Dữ liệu & Thuật toán, huấn luyện mô hình Machine Learning thực tế, và chinh phục Generative AI với công nghệ RAG & AI Agent đa tác vụ.',
      author_id: 'teacher_nhatanh_01',
      authorName: 'GS. Nguyễn Nhật Anh',
      teacherName: 'GS. Nguyễn Nhật Anh (Ban Học Thuật E-V-E)',
      courses: [
        'crs_python_foundation',
        'crs_data_structure_algorithms',
        'crs_machine_learning_core',
        'crs_generative_ai_projects',
      ],
      difficulty: 'Intermediate',
      category: 'Trí Tuệ Nhân Tạo',
      estimated_hours: 40,
      is_accepted: true,
      isPublished: true,
      rewardCoins: 550,
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      bannerGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      learning_objectives: [
        'Làm chủ cú pháp và tư duy lập trình Python hiện đại (OOP, Function, Memory)',
        'Tối ưu hóa hiệu năng chương trình với Cấu trúc Dữ liệu & Giải thuật nâng cao',
        'Huấn luyện, tinh chỉnh và đánh giá mô hình Học máy (Machine Learning Pipeline)',
        'Tích hợp Google Gemini LLM API, triển khai RAG và phát triển hệ thống AI Agent',
      ],
    },
  ];

  for (const p of pathList) {
    const doc = await pathRef.doc(p.id).get();
    if (!doc.exists) {
      await pathRef.doc(p.id).set(p);
      addedCount++;
      console.log(`    Đã tạo Lộ Trình: "${p.title}" (ID: ${p.id})`);
    }
  }

  // 4. GAME_INFO COLLECTION (Approved Games)
  const gameRef = db.collection('game_info');
  const gameDoc = await gameRef.doc('game_card_match_vr').get();
  if (!gameDoc.exists) {
    await gameRef.doc('game_card_match_vr').set({
      id: 'game_card_match_vr',
      authors: ['ThS. Nguyễn Thành Đạt', 'Ban Học Thuật E-V-E'],
      title: 'Memory Matching Game (Lật Thẻ Trí Nhớ)',
      subtitle: 'Ghép Đôi Khái Niệm & Rèn Luyện Trí Nhớ 3D',
      genre: 'Memory Card Matrix',
      category: 'memory',
      description: 'Minigame lật thẻ bài giáo dục tương tác: Tìm các cặp thẻ tương ứng để ghi điểm combo và nhận Coins thưởng.',
      is_accepted: true,
      is_approved: true,
      need_extra_data: false,
      courses_allowed: 'all',
      source_url: '/memory_matching_game/index.html',
      thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      uploader_id: 'YMdybMQPIYWQVlUmb346L92P3z53',
      plays_count: 86,
    });
    addedCount++;
    console.log(`    Đã tạo Game Info: "Memory Matching Game" (ID: game_card_match_vr)`);
  }

  console.log('\n==================================================');
  console.log(` HOÀN THÀNH KHỞI TẠO DATABASE AN TOÀN!`);
  console.log(`   - Số tài liệu mới được tạo: ${addedCount}`);
  console.log(`   - Toàn bộ dữ liệu cũ được bảo lưu 100%`);
  console.log('==================================================\n');
}

initDatabaseSafely().catch((err) => {
  console.error(' Lỗi khi khởi tạo database:', err);
  process.exit(1);
});
