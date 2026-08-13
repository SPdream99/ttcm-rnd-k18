export interface GameResult {
  id: string;
  uid: string; // Student UID
  cid: string; // Course ID
  gid: string; // Game ID
  result: number | Record<string, any>; // Score or detailed results
  reward: number; // Coins earned from this game session
  playedAt: Date;
}

export interface StudentLeaderboardItem {
  uid: string;
  name: string;
  email: string;
  totalScore: number;
  totalCoins: number;
  gamesPlayed: number;
  rank: number;
}
