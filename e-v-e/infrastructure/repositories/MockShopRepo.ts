import { ShopItem } from "@/core/entities/ShopItem";
import { ShopPort } from "@/core/ports/ShopPort";

export class MockShopRepo implements ShopPort {
  private mockItems: ShopItem[] = [
    {
      id: "item_frame_cosmic_01",
      itemId: "item_frame_cosmic_01",
      name: "Khung Vũ Trụ Lấp Lánh",
      price: 100,
      type: "avatar_frame",
      imageUrl: "/assets/shop/frames/cosmic_glow.png",
    },
    {
      id: "item_frame_gold",
      itemId: "item_frame_gold",
      name: "Khung Hoàng Gia Vàng",
      price: 300,
      type: "avatar_frame",
      imageUrl: "/assets/shop/frames/royal_gold.png",
    },
    {
      id: "item_title_explorer",
      itemId: "item_title_explorer",
      name: "Danh hiệu: Nhà Khám Phá Vũ Trụ",
      price: 50,
      type: "title_tag",
      imageUrl: "/assets/shop/titles/explorer.png",
    },
    {
      id: "item_title_master",
      itemId: "item_title_master",
      name: "Danh hiệu: Bậc Thầy Lượng Tử",
      price: 200,
      type: "title_tag",
      imageUrl: "/assets/shop/titles/master.png",
    },
  ];

  private mockUserDecorations: Record<string, string[]> = {
    usr_student_001: ["item_frame_cosmic_01", "item_title_explorer"],
  };

  async getShopItems(): Promise<ShopItem[]> {
    return [...this.mockItems];
  }

  async buyShopItem(
    uid: string,
    itemId: string,
    price: number
  ): Promise<{ success: boolean; newCoins?: number; error?: string }> {
    const item = this.mockItems.find((i) => i.itemId === itemId || i.id === itemId);
    if (!item) {
      return { success: false, error: "Vật phẩm không tồn tại." };
    }

    if (!this.mockUserDecorations[uid]) {
      this.mockUserDecorations[uid] = [];
    }

    if (this.mockUserDecorations[uid].includes(itemId)) {
      return { success: false, error: "Bạn đã sở hữu vật phẩm này rồi." };
    }

    this.mockUserDecorations[uid].push(itemId);
    return { success: true, newCoins: 150 };
  }

  async getUserDecorations(uid: string): Promise<string[]> {
    return this.mockUserDecorations[uid] ? [...this.mockUserDecorations[uid]] : [];
  }
}
