import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopItem } from "@/core/entities/ShopItem";
import { ShopPort } from "@/core/ports/ShopPort";

const COLLECTION_NAME = "shop_items";

export class FirestoreShopRepo implements ShopPort {
  private mapDocToShopItem(id: string, data: any): ShopItem {
    return {
      id,
      itemId: id,
      name: data.name || "",
      price: Number(data.price) || 0,
      type: data.type || "avatar_frame",
      imageUrl: data.image_url || "",
    };
  }

  async getShopItems(): Promise<ShopItem[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      return snap.docs.map((d) => this.mapDocToShopItem(d.id, d.data()));
    } catch (error) {
      console.error("Error getting shop items:", error);
      return [];
    }
  }

  async buyShopItem(
    uid: string,
    itemId: string,
    price: number
  ): Promise<{ success: boolean; newCoins?: number; error?: string }> {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, error: "Tài khoản không tồn tại." };
      }

      const userData = userSnap.data();
      const currentCoins = Number(userData.coins) || 0;
      const decorations = Array.isArray(userData.profile_decorations)
        ? userData.profile_decorations
        : [];

      if (decorations.includes(itemId)) {
        return { success: false, error: "Bạn đã sở hữu vật phẩm này rồi." };
      }

      if (currentCoins < price) {
        return { success: false, error: "Không đủ Coin để mua vật phẩm này." };
      }

      await updateDoc(userRef, {
        coins: increment(-price),
        profile_decorations: arrayUnion(itemId),
      });

      return { success: true, newCoins: currentCoins - price };
    } catch (error: any) {
      console.error("Error buying shop item:", error);
      return { success: false, error: error.message || "Lỗi giao dịch mua đồ." };
    }
  }

  async getUserDecorations(uid: string): Promise<string[]> {
    try {
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        return Array.isArray(data.profile_decorations) ? data.profile_decorations : [];
      }
      return [];
    } catch (error) {
      console.error("Error getting user decorations:", error);
      return [];
    }
  }
}
