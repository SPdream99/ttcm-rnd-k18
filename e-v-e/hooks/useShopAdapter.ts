import { useMemo, useState, useEffect } from "react";
import { FirestoreShopRepo } from "@/infrastructure/repositories/FirestoreShopRepo";
import { GetShopItemsUseCase, BuyShopItemUseCase, GetUserDecorationsUseCase } from "@/core/use-cases/ShopUseCases";
import { ShopItem } from "@/core/entities/ShopItem";

export function useShopAdapter(uid?: string) {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const shopRepo = useMemo(() => new FirestoreShopRepo(), []);

  const getShopItemsUseCase = useMemo(
    () => new GetShopItemsUseCase(shopRepo),
    [shopRepo]
  );
  const buyShopItemUseCase = useMemo(
    () => new BuyShopItemUseCase(shopRepo),
    [shopRepo]
  );
  const getUserDecorationsUseCase = useMemo(
    () => new GetUserDecorationsUseCase(shopRepo),
    [shopRepo]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await getShopItemsUseCase.execute();
      setShopItems(items);

      if (uid) {
        const userDecos = await getUserDecorationsUseCase.execute(uid);
        setDecorations(userDecos);
      }
    } catch (err) {
      console.error("Error loading shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [uid]);

  const buyItem = async (itemId: string, price: number) => {
    if (!uid) return { success: false, error: "Chưa đăng nhập." };
    const res = await buyShopItemUseCase.execute(uid, itemId, price);
    if (res.success) {
      setDecorations((prev) => [...prev, itemId]);
    }
    return res;
  };

  return {
    shopItems,
    decorations,
    loading,
    buyItem,
    reload: loadData,
  };
}
