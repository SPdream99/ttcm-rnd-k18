import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Game } from "@/core/entities/Game";
import { GamePort, CreateGameInput } from "@/core/ports/GamePort";

const COLLECTION_NAME = "game_info";

export class FirestoreGameRepo implements GamePort {
  private mapDocToGame(id: string, data: any): Game {
    return {
      id,
      gameId: data.id || id,
      authors: Array.isArray(data.authors) ? data.authors : [],
      title: data.title || "",
      description: data.description || "",
      isAccepted: Boolean(data.is_accepted),
      coursesAllowed: Array.isArray(data.courses_allowed) ? data.courses_allowed : [],
      coursesBlocked: Array.isArray(data.courses_blocked) ? data.courses_blocked : [],
      needExtraData: Boolean(data.need_extra_data),
      sourceUrl: data.source_url || "",
      uploaderId: data.uploader_id || "",
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  async getGameById(gameId: string): Promise<Game | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, gameId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return this.mapDocToGame(snap.id, snap.data());
    } catch (error) {
      console.error("Error getting game by ID:", error);
      return null;
    }
  }

  async getAllGames(): Promise<Game[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      return snap.docs.map((d) => this.mapDocToGame(d.id, d.data()));
    } catch (error) {
      console.error("Error getting all games:", error);
      return [];
    }
  }

  async getAcceptedGames(): Promise<Game[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("is_accepted", "==", true)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToGame(d.id, d.data()));
    } catch (error) {
      console.error("Error getting accepted games:", error);
      return [];
    }
  }

  async getGamesByUploader(uploaderId: string): Promise<Game[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("uploader_id", "==", uploaderId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToGame(d.id, d.data()));
    } catch (error) {
      console.error("Error getting games by uploader:", error);
      return [];
    }
  }

  async createGame(input: CreateGameInput): Promise<Game> {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    const gameId = newDocRef.id;

    const payload = {
      id: gameId,
      authors: input.authors,
      title: input.title,
      description: input.description,
      is_accepted: false,
      courses_allowed: input.coursesAllowed,
      courses_blocked: input.coursesBlocked || [],
      need_extra_data: input.needExtraData,
      source_url: input.sourceUrl,
      uploader_id: input.uploaderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(newDocRef, payload);

    return this.mapDocToGame(gameId, payload);
  }

  async updateGame(gameId: string, data: Partial<Game>): Promise<Game> {
    const docRef = doc(db, COLLECTION_NAME, gameId);

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.authors !== undefined) updatePayload.authors = data.authors;
    if (data.isAccepted !== undefined) updatePayload.is_accepted = data.isAccepted;
    if (data.coursesAllowed !== undefined) updatePayload.courses_allowed = data.coursesAllowed;
    if (data.coursesBlocked !== undefined) updatePayload.courses_blocked = data.coursesBlocked;
    if (data.needExtraData !== undefined) updatePayload.need_extra_data = data.needExtraData;
    if (data.sourceUrl !== undefined) updatePayload.source_url = data.sourceUrl;

    await updateDoc(docRef, updatePayload);

    const updatedSnap = await getDoc(docRef);
    return this.mapDocToGame(updatedSnap.id, updatedSnap.data());
  }

  async approveGame(gameId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, gameId);
      await updateDoc(docRef, {
        is_accepted: true,
        updated_at: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error approving game:", error);
      return false;
    }
  }

  async deleteGame(gameId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, gameId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting game:", error);
      return false;
    }
  }
}
