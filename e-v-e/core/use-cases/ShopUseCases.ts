import { ShopItem } from "../entities/ShopItem";
import { ShopPort } from "../ports/ShopPort";

export class GetShopItemsUseCase {
  constructor(private repo: ShopPort) {}

  async execute(): Promise<ShopItem[]> {
    return this.repo.getShopItems();
  }
}

export class BuyShopItemUseCase {
  constructor(private repo: ShopPort) {}

  async execute(
    uid: string,
    itemId: string,
    price: number
  ): Promise<{ success: boolean; newCoins?: number; error?: string }> {
    if (!uid || !itemId) {
      throw new Error("Thiếu thông tin người dùng hoặc vật phẩm.");
    }
    return this.repo.buyShopItem(uid, itemId, price);
  }
}

export class GetUserDecorationsUseCase {
  constructor(private repo: ShopPort) {}

  async execute(uid: string): Promise<string[]> {
    return this.repo.getUserDecorations(uid);
  }
}
