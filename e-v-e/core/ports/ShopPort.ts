import { ShopItem } from "../entities/ShopItem";

export interface ShopPort {
  getShopItems(): Promise<ShopItem[]>;
  buyShopItem(uid: string, itemId: string, price: number): Promise<{ success: boolean; newCoins?: number; error?: string }>;
  getUserDecorations(uid: string): Promise<string[]>;
}
