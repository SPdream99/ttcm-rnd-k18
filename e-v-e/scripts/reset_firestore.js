import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.slice(0, equalsIdx).trim();
        let val = trimmed.slice(equalsIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnvLocal();

const serviceAccountRaw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
if (!serviceAccountRaw) {
  console.error("Khong tim thay FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (err) {
  console.error("Loi parse FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY:", err.message);
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore("default");

const COLLECTIONS = [
  "users",
  "teachers",
  "classes",
  "class_members",
  "assignments",
  "submissions",
  "lectures",
  "courses",
  "learning_path",
  "student_learning_path",
  "game_info",
  "game_results",
  "shop_items",
  "announcements",
];

// ─── Complete Realistic Seed Data ─────────────────────────────────────────────

const SEED_DATA = {
  users: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      name: "Nguyen Thanh Dat",
      displayName: "Nguyen Thanh Dat",
      email: "dat@gmail.com",
      role: "student",
      status: "active",
      coins: 450,
      profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
      bio: "Hoc vien chuyen nganh Cong nghe Phan mem tai E-V-E.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: false,
    },
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "ThS. Nguyen Thanh Dat",
      displayName: "ThS. Nguyen Thanh Dat",
      email: "dat1@gmail.com",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
      bio: "Giang vien chuyen nganh Khoa hoc May tinh & Lap trinh Game Giao duc tai E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: false,
    },
    {
      id: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      name: "Quan Tri Vien Dat",
      displayName: "Quan Tri Vien Dat",
      email: "dat2@gmail.com",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
      bio: "Quan tri vien he thong E-V-E Learning Hub.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: false,
    },
  ],

  teachers: [
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "ThS. Nguyen Thanh Dat",
      fullName: "ThS. Nguyen Thanh Dat",
      email: "dat1@gmail.com",
      specialty: "Lap Trinh Web, AI & Game Giao Duc",
      bio: "Chuyen gia thiet ke tro choi hoc tap va giao dien nguoi dung E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      totalStudents: 128,
    },
    {
      id: "teacher_nhatanh_01",
      name: "GS. Nguyen Nhat Anh",
      fullName: "GS. Nguyen Nhat Anh",
      email: "nhatanh@eve.edu.vn",
      specialty: "Tri Tue Nhan Tao & Kien Truc He Thong",
      bio: "Truong ban hoc thuat E-V-E, chuyen gia ve AI Agents va Machine Learning.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      totalStudents: 240,
    },
  ],

  classes: [
    {
      id: "cls_web_dev_k18",
      name: "Lap Trinh Web Chuyen Nghiep K18",
      code: "WD-K18-01",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      teacher_name: "ThS. Nguyen Thanh Dat",
      subject: "Phat Trien Web Fullstack",
      room: "Phong Lab 402 / Online Google Meet",
      schedule: "Thu 2 - Thu 4: 19h30 - 21h30",
      total_students: 24,
      status: "active",
      description: "Dao tao chuyen sau Next.js, React, Node.js, Firebase va Kien truc phan mem hien dai.",
    },
    {
      id: "cls_ai_ml_2026",
      name: "Nen Tang Tri Tue Nhan Tao & Machine Learning",
      code: "AI-2026-02",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      teacher_name: "ThS. Nguyen Thanh Dat",
      subject: "Tri Tue Nhan Tao",
      room: "Phong Lab 501 / Online",
      schedule: "Thu 3 - Thu 6: 18h00 - 20h00",
      total_students: 30,
      status: "active",
      description: "Kham pha mo hinh ngon ngu lon LLM, Computer Vision va Xay dung Ung dung AI thuc te.",
    },
  ],

  class_members: [
    {
      id: "cls_web_dev_k18_f89rGIGZVlQoA5J82jqavzWEvIs2",
      class_id: "cls_web_dev_k18",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyen Thanh Dat",
      student_email: "dat@gmail.com",
      role: "Student",
      attendance_rate: 96,
    },
    {
      id: "cls_web_dev_k18_YMdybMQPIYWQVlUmb346L92P3z53",
      class_id: "cls_web_dev_k18",
      student_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      student_name: "ThS. Nguyen Thanh Dat",
      student_email: "dat1@gmail.com",
      role: "Teacher",
      attendance_rate: 100,
    },
    {
      id: "cls_ai_ml_2026_f89rGIGZVlQoA5J82jqavzWEvIs2",
      class_id: "cls_ai_ml_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyen Thanh Dat",
      student_email: "dat@gmail.com",
      role: "Student",
      attendance_rate: 100,
    },
  ],

  assignments: [
    {
      id: "asm_react_components_01",
      class_id: "cls_web_dev_k18",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Xay Dung Component Dashboard React Co Ban",
      description: "Thiet ke component Dashboard voi Tailwind CSS va quan ly state voi React Hook.",
      subject: "Phat Trien Web Fullstack",
      dueDate: "2026-08-25",
      max_score: 100,
      score: "100 Diem",
      status: "pending",
    },
    {
      id: "asm_nextjs_api_02",
      class_id: "cls_web_dev_k18",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Tich Hop REST API & Xac Thuc Firebase Auth",
      description: "Xay dung Router Handler Next.js ket noi Firestore va kiem tra token xac thuc.",
      subject: "Phat Trien Web Fullstack",
      dueDate: "2026-08-30",
      max_score: 100,
      score: "100 Diem",
      status: "submitted",
    },
    {
      id: "asm_python_matrix_01",
      class_id: "cls_ai_ml_2026",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Xu Ly Ma Tran Du Lieu Voi NumPy & Pandas",
      description: "Doc tap du lieu CSV, chuan hoa du lieu va tinh toan ma tran tuong quan.",
      subject: "Tri Tue Nhan Tao",
      dueDate: "2026-09-05",
      max_score: 100,
      score: "100 Diem",
      status: "pending",
    },
  ],

  submissions: [
    {
      id: "asm_nextjs_api_02_f89rGIGZVlQoA5J82jqavzWEvIs2",
      assignment_id: "asm_nextjs_api_02",
      class_id: "cls_web_dev_k18",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyen Thanh Dat",
      file_url: "https://github.com/SPdream99/ttcm-rnd-k18",
      status: "submitted",
      score: 95,
      feedback: "Code rat sach, cau truc component va API chuan Clean Architecture.",
    },
  ],

  lectures: [
    {
      id: "lec_web_arch_01",
      class_id: "cls_web_dev_k18",
      title: "Bai 1: Tong Quan Kien Truc Fullstack Next.js & Firebase",
      description: "Tim hieu Server Components, Client Components va co che Hydration.",
      document_url: "https://nextjs.org/docs",
      order: 1,
      date: "2026-08-10",
    },
    {
      id: "lec_web_state_02",
      class_id: "cls_web_dev_k18",
      title: "Bai 2: Quan Ly State Nang Cao & Tich Hop Clean Architecture",
      description: "Ung dung Ports & Adapters trong he thong React TypeScript.",
      document_url: "https://react.dev",
      order: 2,
      date: "2026-08-14",
    },
  ],

  courses: [
    {
      id: "crs_coding_basics",
      title: "Bai 1: Nhap Mon Tu Duy Lap Trinh & Thuat Toan",
      description: "Nam vung cac khai niem nen tang: Bien so, Kieu du lieu, Cau truc re nhanh IF-ELSE, Vong lap va Tu duy giai thuat.",
      category: "Khoa hoc Lap trinh",
      difficulty: "Beginner",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyen Thanh Dat",
      is_accepted: true,
      estimated_hours: 12,
      pairs: [
        {
          id: "cb1",
          title: "Bien so (Variable) trong lap trinh dung de lam gi?",
          description: "Dung de luu tru gia tri du lieu va co the thay doi trong qua trinh chay chuong trinh.",
          explanation: "Bien so la o nho trong bo nho RAM duoc dat ten de luu tru cac gia tri (so, chuoi, boolean) va co the tai su dung hoac cap nhat gia tri trong suot qua trinh thuc thi.",
          distractions: ["Dung de tat may tinh", "Dung de in ra giay", "Dung de xoa ma nguon"],
        },
        {
          id: "cb2",
          title: "Cau truc dieu kien IF - ELSE co chuc nang gi?",
          description: "Kiem tra dieu kien dung/sai de quyet dinh luong re nhanh thuc thi cua thuat toan.",
          explanation: "Cau truc re nhanh IF - ELSE cho phep chuong trinh dua ra quyet dinh thuc thi khoi lenh A neu dieu kien thoa man (True), nguoc lai thuc thi khoi lenh B (False).",
          distractions: ["Lap lai vo tan cau lenh", "Khai bao ham moi", "Luu tru du lieu vao o cung"],
        },
        {
          id: "cb3",
          title: "Vong lap (Loop) sinh ra de giai quyet bai toan nao?",
          description: "Tu dong hoa viec lap di lap lai mot khoi lenh nhieu lan ma khong can viet lai ma.",
          explanation: "Vong lap (For, While) giup toi uu ma nguon, giam trung lap bang cach tu dong thuc hien lai mot nhom lenh cho den khi thoa man dieu kien dung.",
          distractions: ["Thay doi do phan giai man hinh", "Nang cap phan cung", "Tang toc do mang"],
        },
        {
          id: "cb4",
          title: "Thuat toan (Algorithm) la gi?",
          description: "Tap hop cac buoc chi dan tuan tu, ro rang nham giai quyet mot van de cu the.",
          explanation: "Thuat toan la quy trinh huu han cac buoc logic, co dau vao (Input) va dau ra (Output) xac dinh nham giai quyet mot bai toan cu the.",
          distractions: ["Ten cua mot loai may tinh", "Bo nho tam thoi RAM", "Trinh duyet web"],
        },
      ],
    },
    {
      id: "crs_computer_hardware",
      title: "Bai 2: Kham Pha Phan Cung & Kien Truc May Tinh 3D",
      description: "Tim hieu chuc nang va nguyen ly hoat dong cua CPU, RAM, GPU, Bo mach chu va O cung SSD.",
      category: "Kien truc May tinh",
      difficulty: "Beginner",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyen Thanh Dat",
      is_accepted: true,
      estimated_hours: 15,
      pairs: [
        {
          id: "hw1",
          title: "CPU (Central Processing Unit)",
          description: "Bo vi xu ly trung tam, dong vai tro bo nao thuc thi cac lenh va tinh toan so hoc/logic cua he thong.",
          explanation: "CPU la linh kien quan trong nhat cua may tinh, dieu khien moi hoat dong, giai ma lenh va thuc hien cac phep toan so hoc ALU.",
          distractions: ["Bo nho tam thoi RAM", "Card hien thi do hoa GPU", "Khoi nguon PSU"],
        },
        {
          id: "hw2",
          title: "GPU (Graphics Processing Unit)",
          description: "Bo xu ly do hoa chuyen dung voi hang ngan loi song song de ket xuat hinh anh 3D va tinh toan AI.",
          explanation: "GPU duoc thiet ke kien truc song song khong lo, chuyen dung cho viec xu ly ma tran diem anh 3D, dung hinh do hoa va huan luyen mo hinh AI.",
          distractions: ["O cung the ran SSD", "Bo mach chu Motherboard", "Quat tan nhiet"],
        },
        {
          id: "hw3",
          title: "RAM (Random Access Memory)",
          description: "Bo nho truy xuat ngau nhien toc do cao, luu tru du lieu tam thoi khi cac ung dung dang chay.",
          explanation: "RAM la bo nho bay hoi (volatile memory) co toc do truy xuat cuc nhanh, chua du lieu lam viec cua he dieu hanh va phan mem dang mo.",
          distractions: ["Luu tru vinh vien ROM", "Cong ket noi USB", "Chipset ban cau nam"],
        },
        {
          id: "hw4",
          title: "SSD M.2 NVMe",
          description: "O luu tru the ran chuan giao tiep PCIe sieu toc, luu tru he dieu hanh va file du lieu khong bi mat khi tat nguon.",
          explanation: "SSD su dung chip nho flash NAND non-volatile voi giao thuc NVMe qua lan PCIe, cho toc do doc ghi len toi hang nghin MB/s.",
          distractions: ["Bo nho dem L3 Cache", "Thanh RAM DDR5", "Khoi nguon PSU"],
        },
      ],
    },
    {
      id: "crs_python_foundation",
      title: "Bai 3: Lap Trinh Python Co Ban & Cau Truc Du Lieu",
      description: "Lam quen voi ngon ngu lap trinh Python, cu phap hien dai, kieu du lieu va ham xu ly.",
      category: "Khoa hoc Lap trinh",
      difficulty: "Beginner",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyen Thanh Dat",
      is_accepted: true,
      estimated_hours: 18,
      pairs: [
        {
          id: "py1",
          title: "Ham print() trong Python co tac dung gi?",
          description: "Xuat du lieu hoac chuoi thong bao ra man hinh console.",
          explanation: "Ham print() la ham tich hop san trong Python dung de in cac doi tuong, chuoi van ban ra luong xuat chuan stdout.",
          distractions: ["Nhap du lieu tu ban phim", "Xoa bien so", "Dong chuong trinh"],
        },
        {
          id: "py2",
          title: "Kieu du lieu Boolean trong Python nhan nhung gia tri nao?",
          description: "True hoac False",
          explanation: "Kieu Boolean (bool) trong Python la kieu logic chi co 2 gia tri phan biet duoc viet hoa chu cai dau la True va False.",
          distractions: ["1 hoac 0", "Yes hoac No", "Chuoi van ban"],
        },
        {
          id: "py3",
          title: "Danh sach (List) trong Python la gi?",
          description: "Cau truc du lieu co thu tu, co the thay doi va chua nhieu kieu phan tu.",
          explanation: "List trong Python duoc dinh nghia bang cap ngoac vuong [] va cho phep lap chi muc tu 0.",
          distractions: ["Hang so bat bien", "Ham goi de quy", "File luu tru o cung"],
        },
      ],
    },
    {
      id: "crs_generative_ai_projects",
      title: "Bai 4: Thiet Ke Ung Dung Tri Tue Nhan Tao Voi LLMs",
      description: "Ung dung cac mo hinh tri tue nhan tao sinh (Generative AI), Prompt Engineering va xay dung AI Agents.",
      category: "Tri Tue Nhan Tao",
      difficulty: "Advanced",
      author_id: "teacher_nhatanh_01",
      author_name: "GS. Nguyen Nhat Anh",
      is_accepted: true,
      estimated_hours: 24,
      pairs: [
        {
          id: "ai1",
          title: "Prompt Engineering trong Generative AI dong vai tro gi?",
          description: "Toi uu hoa cau lenh dau vao de huong dan mo hinh AI sinh ra ket qua chinh xac nhat.",
          explanation: "Prompt Engineering la ky thuat thiet ke, tinh chinh chi thi dau vao giup mo hinh ngon ngu lon hieu ro boi canh va tra ve ket qua mong muon.",
          distractions: ["Cai dat phan cung GPU", "Giai ma mang LAN", "Sua loi syntax code"],
        },
        {
          id: "ai2",
          title: "AI Agent khac gi so voi mo hinh Chatbot truyen thong?",
          description: "Co kha nang tu len ke hoach, su dung Tools va thuc thi hanh dong tu chu de dat muc tieu.",
          explanation: "AI Agents vuot troi hon chatbot nho kha nang suy luan nhieu buoc, goi API / Tools ben ngoai va tu kiem tra ket qua thuc thi.",
          distractions: ["Chi tra loi theo kich ban san", "Khong the ket noi Internet", "Chi chay tren dien thoai"],
        },
      ],
    },
  ],

  learning_path: [
    {
      id: "lp_fullstack_2026",
      title: "Lo Trinh Chuyen Gia Lap Trinh Fullstack & Gamification 2026",
      description: "Lo trinh dao tao toan dien tu tu duy giai thuat, phan cung may tinh den lap trinh ung dung va tich hop game giao duc tuong tac.",
      category: "Lap Trinh Web & Game",
      difficulty: "Beginner",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      is_accepted: true,
      courses: ["crs_coding_basics", "crs_computer_hardware", "crs_python_foundation"],
      learning_objectives: [
        "Thanh thao tu duy lap trinh va thuat toan giai quyet van de",
        "Hieu ro kien truc phan cung va luong du lieu trong may tinh",
        "Xay dung thanh thao ung dung Python va tich hop Game SDK",
      ],
      estimated_hours: 45,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "lp_ai_mastery_2026",
      title: "Lo Trinh Chuyen Gia Tri Tue Nhan Tao & Generative AI 2026",
      description: "Chinh phuc tu duy lap trinh Python nang cao, hieu ro nguyen ly mo hinh ngon ngu lon va xay dung AI Agents thong minh.",
      category: "Tri Tue Nhan Tao",
      difficulty: "Intermediate",
      author_id: "teacher_nhatanh_01",
      is_accepted: true,
      courses: ["crs_python_foundation", "crs_generative_ai_projects"],
      learning_objectives: [
        "Nam vung lap trinh Python va xu ly du lieu nang cao",
        "Xay dung ung dung tich hop LLM API va Prompt Engineering",
        "Thiet ke he thong AI Agents tu dong hoa tac vu phuc tap",
      ],
      estimated_hours: 42,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
    },
  ],

  student_learning_path: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2_lp_fullstack_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      learning_path_id: "lp_fullstack_2026",
      progress: 66,
      status: "active",
      current_course_index: 1,
    },
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2_lp_ai_mastery_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      learning_path_id: "lp_ai_mastery_2026",
      progress: 50,
      status: "active",
      current_course_index: 0,
    },
  ],

  game_info: [
    {
      id: "game_card_match_vr",
      title: "Memory Matching Game (Lat The Tri Nho)",
      subtitle: "Ren luyen tri nho va khac sau dinh nghia thuat ngu",
      genre: "Game Tri Nho 3D",
      category: "memory",
      description: "Lat va ghep dung cac cap thuat ngu lap trinh va giai thich trich xuat truc tiep tu khoa hoc.",
      author: "E-V-E Studio",
      difficulty: "Trung Binh",
      rewardCoins: 50,
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      badge: "NOI BAT",
      rating: 4.9,
      playsCount: 1420,
      isAccepted: true,
    },
    {
      id: "boss_battle_quiz",
      title: "Boss Slayer Marathon Quiz",
      subtitle: "Dau trum trac nghiem phan xa kien thuc",
      genre: "Trac Nghiem Phan Xa",
      category: "boss",
      description: "Moi cau tra loi dung se giang mot don chi mang vao Boss quai vat. Ho tro moi khoa hoc!",
      author: "E-V-E Dev Team",
      difficulty: "Thu Thach",
      rewardCoins: 60,
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      badge: "HOT",
      rating: 4.8,
      playsCount: 2350,
      isAccepted: true,
    },
    {
      id: "game_space_quiz_3d",
      title: "Quiz Runner 3D - Trac Nghiem Toc Do",
      subtitle: "Thu Thach Phan Xa & Kiem Tra Kien Thuc",
      genre: "Action Quiz 3D",
      category: "quiz",
      description: "Tro choi trac nghiem toc do: Doc ky cau hoi trich xuat tu bai hoc va chon dap an chinh xac nhat.",
      author: "Ban Hoc Thuat E-V-E",
      difficulty: "Co Ban",
      rewardCoins: 50,
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      badge: "MOI",
      rating: 4.7,
      playsCount: 980,
      isAccepted: true,
    },
    {
      id: "game_hardware_3d_lab",
      title: "Phong Thi Nghiem Lap Rap May Tinh 3D",
      subtitle: "Mo Phong Kien Truc Phan Cung Truc Quan",
      genre: "3D Hardware Assembly",
      category: "simulation",
      description: "Kham pha cau tao ben trong thung may PC: Chon cac linh kien quan trong va lap rap vao bo mach chu.",
      author: "ThS. Pham Hoang Nam",
      difficulty: "Thuc Hanh",
      rewardCoins: 80,
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
      badge: "THUC HANH",
      rating: 4.9,
      playsCount: 1680,
      isAccepted: true,
    },
  ],

  game_results: [
    {
      id: "res_001",
      game_id: "game_card_match_vr",
      course_id: "crs_coding_basics",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      user_name: "Nguyen Thanh Dat",
      score: 180,
      accuracy_percent: 100,
      play_time_seconds: 38,
      coins_earned: 90,
      date: "2026-08-15",
    },
    {
      id: "res_002",
      game_id: "boss_battle_quiz",
      course_id: "crs_coding_basics",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      user_name: "Nguyen Thanh Dat",
      score: 220,
      accuracy_percent: 95,
      play_time_seconds: 45,
      coins_earned: 110,
      date: "2026-08-15",
    },
  ],

  shop_items: [
    {
      id: "item_frame_cosmic_01",
      name: "Khung Vu Tru Lap Lanh",
      price: 100,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/cosmic_glow.png",
    },
    {
      id: "item_frame_gold",
      name: "Khung Hoang Gia Vang",
      price: 300,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/royal_gold.png",
    },
    {
      id: "item_title_explorer",
      name: "Danh hieu: Nha Kham Pha Vu Tru",
      price: 50,
      type: "title_tag",
      image_url: "/assets/shop/titles/explorer.png",
    },
    {
      id: "item_title_admin",
      name: "Danh hieu: Admin",
      price: 0,
      type: "title_tag",
      image_url: "/assets/shop/titles/admin.png",
    },
    {
      id: "item_title_master",
      name: "Danh hieu: Bac Thay Luong Tu",
      price: 200,
      type: "title_tag",
      image_url: "/assets/shop/titles/master.png",
    },
  ],

  announcements: [
    {
      id: "ann_001",
      title: "Chao Don Hoc Ky E-V-E 2026",
      content: "Chao mung toan the Hoc vien va Giang vien tham gia he thong E-V-E Learning Hub.",
      category: "system",
      date: "2026-08-01",
    },
  ],
};

// ─── Execution Routine ────────────────────────────────────────────────────────

async function clearCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  Da xoa ${snapshot.size} document cu trong '${collectionName}'`);
}

async function run() {
  console.log("Khoi dong Reset & Seed Toan Dien Firestore Database Schema...\n");

  for (const col of COLLECTIONS) {
    await clearCollection(col);
  }

  console.log("\nNap du lieu moi day du chuan E-V-E Schema...\n");

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    for (const item of docs) {
      const { id, ...data } = item;
      const docRef = db.collection(colName).doc(id);
      await docRef.set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    console.log(`  '${colName}': ${docs.length} document duoc tao thanh cong`);
  }

  console.log("\nRESET & SEED FIRESTORE HOAN TAT XUAT SAC!");
}

run().catch((err) => {
  console.error("Loi:", err);
  process.exit(1);
});
