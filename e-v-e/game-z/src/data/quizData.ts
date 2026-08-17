import { Category, Question, Stage } from '../types/quiz';

export const CATEGORIES: Category[] = [
  {
    id: 'science',
    name: 'Khoa học & Tự nhiên',
    icon: '🔬',
    color: '#06b6d4', // cyan-500
    description: 'Khám phá bí ẩn vũ trụ, vật lý, hóa học và sinh học quanh ta'
  },
  {
    id: 'tech',
    name: 'Công nghệ & AI',
    icon: '💻',
    color: '#8b5cf6', // violet-500
    description: 'Tìm hiểu về lập trình, Internet, trí tuệ nhân tạo và tương lai số'
  },
  {
    id: 'history',
    name: 'Lịch sử & Văn hóa',
    icon: '📜',
    color: '#f59e0b', // amber-500
    description: 'Hành trình ngược thời gian về các mốc lịch sử và di sản hào hùng'
  },
  {
    id: 'geography',
    name: 'Địa lý & Thế giới',
    icon: '🌍',
    color: '#10b981', // emerald-500
    description: 'Chinh phục danh lam thắng cảnh, đại dương và các quốc gia trên thế giới'
  }
];

export const QUESTIONS: Question[] = [
  // --- KHOA HỌC & TỰ NHIÊN ---
  {
    id: 'sci-1',
    categoryId: 'science',
    question: 'Hành tinh nào được gọi là "Hành tinh Đỏ" trong Hệ Mặt Trời?',
    options: ['Sao Kim', 'Sao Hỏa', 'Sao Thủy', 'Sao Mộc'],
    correctIndex: 1,
    explanation: 'Sao Hỏa (Mars) có bề mặt chứa nhiều Sắt(III) oxit (gỉ sắt), làm cho bề mặt của nó có màu đỏ da cam đặc trưng khi quan sát.',
    hint: 'Tên hành tinh này trùng với tên thần chiến tranh Mars trong thần thoại La Mã.',
    difficulty: 'easy'
  },
  {
    id: 'sci-2',
    categoryId: 'science',
    question: 'Nước hóa hơi ở nhiệt độ bao nhiêu độ C (ở áp suất khí quyển tiêu chuẩn)?',
    options: ['80°C', '90°C', '100°C', '120°C'],
    correctIndex: 2,
    explanation: 'Ở áp suất khí quyển chuẩn (1 atm), nước tinh khiết sôi và chuyển từ trạng thái lỏng sang trạng thái khí ở 100°C.',
    hint: 'Đây là mốc nhiệt độ chuẩn trong thang đo Celsius.',
    difficulty: 'easy'
  },
  {
    id: 'sci-3',
    categoryId: 'science',
    question: 'Nguyên tố hóa học nào phổ biến nhất trong Vũ trụ?',
    options: ['Oxi', 'Cacbon', 'Heli', 'Hydro'],
    correctIndex: 3,
    explanation: 'Hydro là nguyên tố đơn giản nhất và chiếm khoảng 75% tổng khối lượng nguyên tố trong vũ trụ quan sát được.',
    hint: 'Nguyên tố này có ký hiệu hóa học là H và số hiệu nguyên tử là 1.',
    difficulty: 'medium'
  },
  {
    id: 'sci-4',
    categoryId: 'science',
    question: 'Bào quan nào được ví như "nhà máy năng lượng" của tế bào nhân thực?',
    options: ['Ty thể (Mitochondria)', 'Nhân tế bào', 'Lưới nội chất', 'Thể Golgi'],
    correctIndex: 0,
    explanation: 'Ty thể thực hiện quá trình hô hấp tế bào để chuyển hóa chất dinh dưỡng thành ATP - nguồn năng lượng chính cho hoạt động của tế bào.',
    hint: 'Tên gọi tiếng Anh bắt đầu bằng chữ M (Mito...).',
    difficulty: 'medium'
  },
  {
    id: 'sci-5',
    categoryId: 'science',
    question: 'Vận tốc ánh sáng trong chân không gần bằng bao nhiêu?',
    options: ['300.000 km/s', '150.000 km/s', '30.000 km/s', '1.000.000 km/s'],
    correctIndex: 0,
    explanation: 'Vận tốc ánh sáng trong chân không chính xác là 299.792.458 m/s, xấp xỉ 300.000 km/s.',
    hint: 'Ánh sáng từ Mặt Trời mất khoảng 8 phút 20 giây để đến Trái Đất với tốc độ này.',
    difficulty: 'hard'
  },

  // --- CÔNG NGHỆ & AI ---
  {
    id: 'tech-1',
    categoryId: 'tech',
    question: 'Ngôn ngữ lập trình nào phổ biến nhất để thiết kế giao diện trang web (Client-side)?',
    options: ['Python', 'JavaScript', 'C++', 'Java'],
    correctIndex: 1,
    explanation: 'JavaScript là ngôn ngữ chuẩn duy nhất chạy trực tiếp trên tất cả các trình duyệt web hiện đại để tạo tính tương tác.',
    hint: 'Ngôn ngữ này thường đi cùng với HTML và CSS.',
    difficulty: 'easy'
  },
  {
    id: 'tech-2',
    categoryId: 'tech',
    question: 'Khái niệm "CPU" trong máy tính là viết tắt của từ gì?',
    options: [
      'Central Processing Unit',
      'Computer Power Utility',
      'Control Performance Unit',
      'Core Programming User'
    ],
    correctIndex: 0,
    explanation: 'CPU (Central Processing Unit - Bộ xử lý trung tâm) là bộ não của máy tính, đảm nhận việc thực thi các lệnh chương trình.',
    hint: 'Có nghĩa là đơn vị xử lý trung tâm.',
    difficulty: 'easy'
  },
  {
    id: 'tech-3',
    categoryId: 'tech',
    question: 'Mô hình ngôn ngữ lớn (LLM) như GPT hay Claude hoạt động dựa trên kiến trúc mạng nơ-ron nào?',
    options: ['Convolutional Neural Network (CNN)', 'Transformer', 'Recurrent Neural Network (RNN)', 'Decision Tree'],
    correctIndex: 1,
    explanation: 'Kiến trúc Transformer (được Google giới thiệu năm 2017 với cơ chế Attention) là nền tảng cho sự bứt phá của AI sáng tạo hiện đại.',
    hint: 'Tên kiến trúc này trùng với tên bộ phim robot biến hình nổi tiếng.',
    difficulty: 'medium'
  },
  {
    id: 'tech-4',
    categoryId: 'tech',
    question: 'Thư viện/Framework nào do Facebook (Meta) phát triển để xây dựng giao diện người dùng dựa trên Component?',
    options: ['Vue.js', 'Angular', 'React', 'Svelte'],
    correctIndex: 2,
    explanation: 'React được Facebook ra mắt năm 2013 và hiện là một trong những thư viện UI phổ biến nhất thế giới.',
    hint: 'Tên thư viện này bắt đầu bằng chữ "R" và là nền tảng của Next.js.',
    difficulty: 'medium'
  },
  {
    id: 'tech-5',
    categoryId: 'tech',
    question: 'Giao thức bảo mật mã hóa truy cập trang web an toàn sử dụng chứng chỉ SSL/TLS là gì?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctIndex: 1,
    explanation: 'HTTPS (Hypertext Transfer Protocol Secure) sử dụng mã hóa SSL/TLS để bảo vệ dữ liệu truyền giữa trình duyệt và máy chủ.',
    hint: 'Có thêm chữ "S" đại diện cho Secure ở cuối.',
    difficulty: 'hard'
  },

  // --- LỊCH SỬ & VĂN HÓA ---
  {
    id: 'his-1',
    categoryId: 'history',
    question: 'Chiến thắng lịch sử Điện Biên Phủ diễn ra vào năm nào?',
    options: ['1945', '1954', '1975', '1968'],
    correctIndex: 1,
    explanation: 'Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào ngày 7 tháng 5 năm 1954, "lừng lẫy năm châu, chấn động địa cầu".',
    hint: 'Năm này ký kết Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh ở Đông Dương.',
    difficulty: 'easy'
  },
  {
    id: 'his-2',
    categoryId: 'history',
    question: 'Vị vua nào đã ban "Chiếu dời đô" chuyển kinh đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay)?',
    options: ['Lý Thái Tổ (Lý Công Uẩn)', 'Lý Thường Kiệt', 'Đinh Tiên Hoàng', 'Lê Lợi'],
    correctIndex: 0,
    explanation: 'Vua Lý Thái Tổ đã ban Chiếu dời đô vào năm 1010, mở ra thời kỳ phát triển rực rỡ của kinh thành Thăng Long.',
    hint: 'Vị vua sáng lập ra nhà Lý trong lịch sử Việt Nam.',
    difficulty: 'easy'
  },
  {
    id: 'his-3',
    categoryId: 'history',
    question: 'Trận chiến nào trên sông Bạch Đằng năm 938 đã chấm dứt hơn 1000 năm Bắc thuộc?',
    options: ['Trận Bạch Đằng của Ngô Quyền', 'Trận Bạch Đằng của Trần Hưng Đạo', 'Trận Chi Lăng', 'Trận Ngọc Hồi - Đống Đa'],
    correctIndex: 0,
    explanation: 'Ngô Quyền đã dùng cọc gỗ bọc sắt cắm xuống lòng sông Bạch Đằng để đánh tan quân Nam Hán năm 938, xưng vương mở đầu kỷ nguyên độc lập.',
    hint: 'Người chỉ huy trận đánh này sau đó lên làm vua (Ngô Vua/Ngô Quyền).',
    difficulty: 'medium'
  },
  {
    id: 'his-4',
    categoryId: 'history',
    question: 'Kỳ quan thế giới cổ đại nào duy nhất còn tồn tại tương đối nguyên vẹn đến ngày nay?',
    options: ['Vườn treo Babylon', 'Kim tự tháp Giza (Ai Cập)', 'Tượng thần Mặt Trời ở Rhodes', 'Hải đăng Alexandria'],
    correctIndex: 1,
    explanation: 'Đại kim tự tháp Giza ở Ai Cập được xây dựng cách đây hơn 4.500 năm và là kỳ quan cổ đại duy nhất còn đứng vững.',
    hint: 'Nằm ở đất nước của các Pharaon.',
    difficulty: 'medium'
  },
  {
    id: 'his-5',
    categoryId: 'history',
    question: 'Bộ luật thành văn đầu tiên của Việt Nam dưới thời nhà Lý có tên là gì?',
    options: ['Luật Hồng Đức', 'Hình thư', 'Quốc triều hình luật', 'Luật Gia Long'],
    correctIndex: 1,
    explanation: 'Bộ luật "Hình thư" được ban hành năm 1042 dưới thời vua Lý Thái Tông là bộ luật thành văn đầu tiên của nước ta.',
    hint: 'Tên gồm 2 từ, trong đó từ đầu tiên có nghĩa là hình phạt/pháp luật.',
    difficulty: 'hard'
  },

  // --- ĐỊA LÝ & THẾ GIỚI ---
  {
    id: 'geo-1',
    categoryId: 'geography',
    question: 'Đỉnh núi nào cao nhất thế giới so với mực nước biển?',
    options: ['Đỉnh K2', 'Đỉnh Fansipan', 'Đỉnh Everest', 'Đỉnh Kilimanjaro'],
    correctIndex: 2,
    explanation: 'Đỉnh Everest thuộc dãy Himalaya (nằm giữa Nepal và Trung Quốc) cao 8.848,86m so với mực nước biển.',
    hint: 'Còn được gọi là nóc nhà thế giới.',
    difficulty: 'easy'
  },
  {
    id: 'geo-2',
    categoryId: 'geography',
    question: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?',
    options: ['Trung Quốc', 'Hoa Kỳ', 'Canada', 'Nga'],
    correctIndex: 3,
    explanation: 'Nga có diện tích hơn 17 triệu km², trải dài trên cả 2 châu lục là Châu Âu và Châu Á.',
    hint: 'Quốc gia này sở hữu Quảng trường Đỏ nổi tiếng.',
    difficulty: 'easy'
  },
  {
    id: 'geo-3',
    categoryId: 'geography',
    question: 'Con sông nào dài nhất thế giới?',
    options: ['Sông Mê Kông', 'Sông Amazon', 'Sông Níl (Nile)', 'Sông Dương Tử'],
    correctIndex: 2,
    explanation: 'Sông Níl ở Châu Phi với chiều dài khoảng 6.650 km được công nhận là con sông dài nhất thế giới.',
    hint: 'Con sông chảy qua đất nước Ai Cập.',
    difficulty: 'medium'
  },
  {
    id: 'geo-4',
    categoryId: 'geography',
    question: 'Thành phố nào là thủ đô của đất nước Nhật Bản?',
    options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
    correctIndex: 2,
    explanation: 'Tokyo trở thành thủ đô của Nhật Bản từ năm 1868 khi Thiên hoàng Minh Trị chuyển kinh đô từ Kyoto về đây.',
    hint: 'Đô thị đông dân nhất thế giới hiện nay.',
    difficulty: 'medium'
  },
  {
    id: 'geo-5',
    categoryId: 'geography',
    question: 'Sa mạc nào là sa mạc NÓNG lớn nhất thế giới?',
    options: ['Sa mạc Gobi', 'Sa mạc Sahara', 'Sa mạc Atacama', 'Sa mạc Kalahari'],
    correctIndex: 1,
    explanation: 'Sa mạc Sahara ở Bắc Phi có diện tích hơn 9 triệu km², là sa mạc nóng lớn nhất thế giới (chỉ sau 2 sa mạc lạnh Nam Cực & Bắc Cực).',
    hint: 'Tên sa mạc này trong tiếng Ả Rập có nghĩa là "Sa mạc lớn".',
    difficulty: 'hard'
  }
];

export const STAGES: Stage[] = [
  {
    id: 1,
    categoryId: 'science',
    title: 'Màn 1: Nhập Môn Khoa Học',
    description: 'Tìm hiểu những khái niệm cơ bản về Trái Đất và tự nhiên',
    requiredStars: 0,
    questionIds: ['sci-1', 'sci-2', 'sci-3'],
    timeLimitSeconds: 20
  },
  {
    id: 2,
    categoryId: 'science',
    title: 'Màn 2: Bí Ẩn Tế Bào & Vũ Trụ',
    description: 'Chinh phục các câu hỏi nâng cao về sinh học và vật lý vũ trụ',
    requiredStars: 2,
    questionIds: ['sci-3', 'sci-4', 'sci-5'],
    timeLimitSeconds: 15
  },
  {
    id: 3,
    categoryId: 'tech',
    title: 'Màn 3: Thế Giới Lập Trình',
    description: 'Khám phá kiến thức tin học, phần cứng và ngôn ngữ web',
    requiredStars: 4,
    questionIds: ['tech-1', 'tech-2', 'tech-4'],
    timeLimitSeconds: 20
  },
  {
    id: 4,
    categoryId: 'tech',
    title: 'Màn 4: Kỷ Nguyên AI & Bảo Mật',
    description: 'Thử thách hiểu biết về trí tuệ nhân tạo và an toàn mạng',
    requiredStars: 6,
    questionIds: ['tech-3', 'tech-4', 'tech-5'],
    timeLimitSeconds: 15
  },
  {
    id: 5,
    categoryId: 'history',
    title: 'Màn 5: Hào Hùng Sử Việt',
    description: 'Ngược dòng thời gian tìm hiểu các mốc lịch sử dân tộc',
    requiredStars: 8,
    questionIds: ['his-1', 'his-2', 'his-3'],
    timeLimitSeconds: 20
  },
  {
    id: 6,
    categoryId: 'history',
    title: 'Màn 6: Kỳ Quan & Cổ Đại',
    description: 'Khám phá di sản văn hóa thế giới và những bộ luật cổ',
    requiredStars: 10,
    questionIds: ['his-3', 'his-4', 'his-5'],
    timeLimitSeconds: 15
  },
  {
    id: 7,
    categoryId: 'geography',
    title: 'Màn 7: Khám Phá Trái Đất',
    description: 'Hành trình vượt qua đỉnh cao và các quốc gia lớn',
    requiredStars: 12,
    questionIds: ['geo-1', 'geo-2', 'geo-4'],
    timeLimitSeconds: 20
  },
  {
    id: 8,
    categoryId: 'geography',
    title: 'Màn 8: Chinh Phục Đại Dương & Sa Mạc',
    description: 'Thử thách tột cùng về địa lý thế giới',
    requiredStars: 14,
    questionIds: ['geo-3', 'geo-4', 'geo-5'],
    timeLimitSeconds: 15
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'Khởi Đầu Hứa Hẹn',
    description: 'Hoàn thành màn chơi đầu tiên',
    icon: '🌱'
  },
  {
    id: 'combo_master',
    title: 'Thánh Combo',
    description: 'Đạt chuỗi trả lời đúng liên tiếp 5 câu (5x Streak)',
    icon: '🔥'
  },
  {
    id: 'perfect_stage',
    title: 'Tuyệt Đối 100%',
    description: 'Hoàn thành một màn chơi đạt tối đa 3 Sao',
    icon: '⭐'
  },
  {
    id: 'speed_demon',
    title: 'Thần Tốc',
    description: 'Trả lời đúng câu hỏi trong dưới 3 giây',
    icon: '⚡'
  },
  {
    id: 'all_stages',
    title: 'Bậc Thầy Tri Thức',
    description: 'Mở khóa toàn bộ 8 Màn Thám hiểm',
    icon: '👑'
  }
];
