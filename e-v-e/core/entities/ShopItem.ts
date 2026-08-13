export type ShopItemType = "avatar_frame" | "title_tag" | "profile_theme";

export interface ShopItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  type: ShopItemType;
  imageUrl: string;
}
