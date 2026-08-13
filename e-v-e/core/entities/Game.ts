export interface Game {
  id: string;
  gameId: string;
  authors: string[];
  title: string;
  description: string;
  isAccepted: boolean;
  coursesAllowed: string[];
  coursesBlocked: string[];
  needExtraData: boolean;
  sourceUrl: string;
  uploaderId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
