// lib/aiSkillService.ts
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  limit as firestoreLimit,
} from "firebase/firestore";

/**
 * Service thực thi các Agent Skills truy xuất dữ liệu công khai trên hệ thống E-V-E.
 * Đảm bảo dữ liệu nhạy cảm (mật khẩu, email riêng tư, token) bị loại bỏ 100%.
 */
export async function executeEveSkill(
  toolName: string,
  args: Record<string, any> = {}
): Promise<any> {
  try {
    switch (toolName) {
      case "search_games": {
        const q = query(
          collection(db, "game_info"),
          where("is_accepted", "==", true)
        );
        let snap = await getDocs(q);
        // Fallback if no is_accepted yet
        if (snap.empty) {
          snap = await getDocs(collection(db, "game_info"));
        }

        let games = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || data.name || "Trò chơi E-V-E",
            description: data.description || "Trò chơi thực hành rèn luyện tư duy.",
            authors: Array.isArray(data.authors) ? data.authors : [],
            coursesAllowed: data.courses_allowed || data.coursesAllowed || [],
            sourceUrl: data.source_url || `/student/games`,
          };
        });

        if (args.keyword) {
          const kw = String(args.keyword).toLowerCase().trim();
          games = games.filter(
            (g) =>
              g.title.toLowerCase().includes(kw) ||
              g.description.toLowerCase().includes(kw)
          );
        }

        return {
          total: games.length,
          games: games.slice(0, 6),
        };
      }

      case "get_learning_paths": {
        const q = query(
          collection(db, "learning_path"),
          where("is_accepted", "==", true)
        );
        let snap = await getDocs(q);
        if (snap.empty) {
          snap = await getDocs(collection(db, "learning_path"));
        }

        let paths = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "Lộ trình học tập",
            description: data.description || "Lộ trình đào tạo toàn diện.",
            totalCourses: Array.isArray(data.courses) ? data.courses.length : 0,
          };
        });

        if (args.keyword) {
          const kw = String(args.keyword).toLowerCase().trim();
          paths = paths.filter(
            (p) =>
              p.title.toLowerCase().includes(kw) ||
              p.description.toLowerCase().includes(kw)
          );
        }

        return {
          total: paths.length,
          learningPaths: paths.slice(0, 5),
        };
      }

      case "search_courses": {
        const q = query(
          collection(db, "courses"),
          where("is_accepted", "==", true),
          firestoreLimit(15)
        );
        let snap = await getDocs(q);
        if (snap.empty) {
          snap = await getDocs(query(collection(db, "courses"), firestoreLimit(15)));
        }

        let courses = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "Khóa học E-V-E",
            subtitle: data.subtitle || "",
            description: data.description || "Nội dung đào tạo thực chiến.",
            tags: Array.isArray(data.tags) ? data.tags : [],
            totalDuration: data.total_duration || "Linh hoạt",
            studentsCount: data.students_count || 0,
          };
        });

        if (args.keyword) {
          const kw = String(args.keyword).toLowerCase().trim();
          courses = courses.filter(
            (c) =>
              c.title.toLowerCase().includes(kw) ||
              c.description.toLowerCase().includes(kw) ||
              c.tags.some((t: string) => t.toLowerCase().includes(kw))
          );
        }

        return {
          total: courses.length,
          courses: courses.slice(0, 6),
        };
      }

      case "get_public_teachers": {
        const q = query(
          collection(db, "users"),
          where("role", "==", "teacher"),
          firestoreLimit(10)
        );
        const snap = await getDocs(q);

        let teachers = snap.docs.map((d) => {
          const data = d.data();
          return {
            name: data.displayName || data.name || data.fullName || "Giáo viên E-V-E",
            bio: data.bio || "Giảng viên giảng dạy lập trình và khoa học công nghệ.",
            subjects: data.subjects || ["Lập trình Python", "Tư duy Thuật toán"],
          };
        });

        if (args.keyword) {
          const kw = String(args.keyword).toLowerCase().trim();
          teachers = teachers.filter(
            (t) =>
              t.name.toLowerCase().includes(kw) ||
              t.bio.toLowerCase().includes(kw) ||
              t.subjects.some((s: string) => s.toLowerCase().includes(kw))
          );
        }

        return {
          total: teachers.length,
          teachers: teachers.slice(0, 5),
        };
      }

      case "get_public_student_profile": {
        const nameQuery = String(args.studentName || "").toLowerCase().trim();
        const snap = await getDocs(collection(db, "users"));
        const students = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as any))
          .filter((u) => u.role === "student" || !u.role);

        const matched = students.find((s) => {
          const name = (s.displayName || s.name || s.fullName || "").toLowerCase();
          return name.includes(nameQuery);
        });

        if (!matched) {
          return {
            found: false,
            message: `Không tìm thấy hồ sơ học sinh nào có tên '${args.studentName}'.`,
          };
        }

        return {
          found: true,
          profile: {
            name: matched.displayName || matched.name || matched.fullName || "Học sinh",
            coins: matched.coins || 0,
            level: matched.level || Math.floor((matched.coins || 0) / 100) + 1,
            rankTitle: matched.rankTitle || "Học viên E-V-E",
            badges: Array.isArray(matched.badges) ? matched.badges : [],
          },
        };
      }

      case "get_leaderboard": {
        const limitCount = Number(args.limit) || 10;
        const snap = await getDocs(collection(db, "game_results"));
        const userStats: Record<string, { totalScore: number; totalCoins: number; gamesPlayed: number }> = {};

        snap.docs.forEach((d) => {
          const data = d.data();
          const uid = data.uid;
          if (!uid) return;
          const score = typeof data.result === "number" ? data.result : 0;
          const reward = Number(data.reward) || 0;

          if (!userStats[uid]) {
            userStats[uid] = { totalScore: 0, totalCoins: 0, gamesPlayed: 0 };
          }
          userStats[uid].totalScore += score;
          userStats[uid].totalCoins += reward;
          userStats[uid].gamesPlayed += 1;
        });

        const userDocsSnap = await getDocs(collection(db, "users"));
        const userMap = new Map<string, any>();
        userDocsSnap.docs.forEach((d) => {
          userMap.set(d.id, d.data());
          const data = d.data();
          if (data.id) userMap.set(data.id, data);
          if (data._id) userMap.set(data._id, data);
        });

        const list = Object.entries(userStats).map(([uid, stats]) => {
          const userData = userMap.get(uid) || {};
          const name = userData.displayName || userData.name || userData.fullName || "Học sinh";
          return {
            name,
            totalScore: stats.totalScore,
            totalCoins: stats.totalCoins,
            gamesPlayed: stats.gamesPlayed,
          };
        });

        list.sort((a, b) => b.totalScore - a.totalScore);
        const topList = list.slice(0, limitCount).map((item, idx) => ({
          rank: idx + 1,
          ...item,
        }));

        return {
          totalContenders: list.length,
          leaderboard: topList,
        };
      }

      default:
        return { error: `Tool ${toolName} không được hỗ trợ.` };
    }
  } catch (err: any) {
    console.error(`Lỗi thực thi tool ${toolName}:`, err);
    return { error: `Lỗi truy xuất hệ thống: ${err.message}` };
  }
}
