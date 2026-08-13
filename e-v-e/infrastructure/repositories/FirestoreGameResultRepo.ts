import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GameResult, StudentLeaderboardItem } from "@/core/entities/GameResult";
import {
  GameResultPort,
  SubmitGameResultInput,
} from "@/core/ports/GameResultPort";

const COLLECTION_NAME = "game_results";

export class FirestoreGameResultRepo implements GameResultPort {
  private mapDocToGameResult(id: string, data: any): GameResult {
    return {
      id,
      uid: data.uid || "",
      cid: data.cid || "",
      gid: data.gid || "",
      result: data.result !== undefined ? data.result : 0,
      reward: Number(data.reward) || 0,
      playedAt: data.played_at ? new Date(data.played_at) : new Date(),
    };
  }

  async submitGameResult(input: SubmitGameResultInput): Promise<GameResult> {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    const resultId = newDocRef.id;
    const playedAtStr = new Date().toISOString();

    const payload = {
      id: resultId,
      _id: resultId,
      uid: input.uid,
      cid: input.cid,
      gid: input.gid,
      result: input.result,
      reward: input.reward,
      played_at: playedAtStr,
    };

    await setDoc(newDocRef, payload);

    if (input.reward > 0) {
      try {
        const userRef = doc(db, "users", input.uid);
        await updateDoc(userRef, {
          coins: increment(input.reward),
        });
      } catch (err) {
        console.error("Error updating user coins reward:", err);
      }
    }

    return this.mapDocToGameResult(resultId, payload);
  }

  async getResultsByUser(uid: string): Promise<GameResult[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("uid", "==", uid)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToGameResult(d.id, d.data()));
    } catch (error) {
      console.error("Error getting game results by user:", error);
      return [];
    }
  }

  async getResultsByCourse(cid: string): Promise<GameResult[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("cid", "==", cid)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToGameResult(d.id, d.data()));
    } catch (error) {
      console.error("Error getting game results by course:", error);
      return [];
    }
  }

  async getResultsByGame(gid: string): Promise<GameResult[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("gid", "==", gid)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToGameResult(d.id, d.data()));
    } catch (error) {
      console.error("Error getting game results by game:", error);
      return [];
    }
  }

  async getTopMonthlyStudents(limitCount = 10): Promise<StudentLeaderboardItem[]> {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const q = query(
        collection(db, COLLECTION_NAME),
        where("played_at", ">=", firstDayOfMonth)
      );
      const snap = await getDocs(q);

      const userStatsMap: Record<string, { totalScore: number; totalCoins: number; gamesPlayed: number }> = {};

      snap.docs.forEach((d) => {
        const data = d.data();
        const uid = data.uid;
        const score = typeof data.result === "number" ? data.result : 0;
        const reward = Number(data.reward) || 0;

        if (!userStatsMap[uid]) {
          userStatsMap[uid] = { totalScore: 0, totalCoins: 0, gamesPlayed: 0 };
        }
        userStatsMap[uid].totalScore += score;
        userStatsMap[uid].totalCoins += reward;
        userStatsMap[uid].gamesPlayed += 1;
      });

      const leaderboards: StudentLeaderboardItem[] = [];
      const userIds = Object.keys(userStatsMap);

      for (const uid of userIds) {
        let name = "Học sinh";
        let email = "";
        try {
          const uSnap = await getDocs(query(collection(db, "users"), where("id", "==", uid)));
          if (!uSnap.empty) {
            const uData = uSnap.docs[0].data();
            name = uData.name || uData.fullName || name;
            email = uData.email || email;
          } else {
            const uSnap2 = await getDocs(query(collection(db, "users"), where("_id", "==", uid)));
            if (!uSnap2.empty) {
              const uData2 = uSnap2.docs[0].data();
              name = uData2.name || uData2.fullName || name;
              email = uData2.email || email;
            }
          }
        } catch (_) {}

        leaderboards.push({
          uid,
          name,
          email,
          totalScore: userStatsMap[uid].totalScore,
          totalCoins: userStatsMap[uid].totalCoins,
          gamesPlayed: userStatsMap[uid].gamesPlayed,
          rank: 0,
        });
      }

      leaderboards.sort((a, b) => b.totalScore - a.totalScore);
      leaderboards.forEach((item, idx) => {
        item.rank = idx + 1;
      });

      return leaderboards.slice(0, limitCount);
    } catch (error) {
      console.error("Error calculating top monthly students:", error);
      return [];
    }
  }
}
