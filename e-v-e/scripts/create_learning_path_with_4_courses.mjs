/**
 * SCRIPT TẠO LỘ TRÌNH HỌC TẬP CÓ 4 KHÓA HỌC (COURSES) LÊN FIRESTORE
 *
 * Cách chạy:
 *   node --env-file=.env.local scripts/create_learning_path_with_4_courses.mjs
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

async function createLearningPathWith4Courses() {
  console.log(' Bắt đầu tạo 4 khóa học và 1 Lộ Trình Học Tập lên Firestore...\n');

  // 1. TẠO 4 KHÓA HỌC (COURSES)
  const courses = [
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
  ];

  for (const c of courses) {
    const { id, ...data } = c;
    await db.collection('courses').doc(id).set(data, { merge: true });
    console.log(`    Đã tạo/cập nhật Khóa học: "${c.title}" (ID: ${id})`);
  }

  // 2. TẠO 1 LỘ TRÌNH HỌC TẬP (LEARNING PATH) CHỨA 4 KHÓA HỌC TRÊN
  const learningPathId = 'lp_ai_mastery_2026';
  const learningPathData = {
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
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await db.collection('learning_path').doc(learningPathId).set(learningPathData, { merge: true });
  console.log(`\n ĐÃ TẠO THÀNH CÔNG LỘ TRÌNH HỌC TẬP LÊN FIRESTORE!`);
  console.log(`    Document ID: "${learningPathId}"`);
  console.log(`    Tên lộ trình: "${learningPathData.title}"`);
  console.log(`    Số khóa học liên kết: ${learningPathData.courses.length} courses`);
  console.log(`    Độ khó: ${learningPathData.difficulty} | Danh mục: ${learningPathData.category}`);
}

createLearningPathWith4Courses()
  .then(() => {
    console.log('\n Hoàn tất 100%!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(' Lỗi khi tạo dữ liệu:', err);
    process.exit(1);
  });
