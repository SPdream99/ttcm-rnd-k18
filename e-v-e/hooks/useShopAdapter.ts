import { useState, useEffect, useMemo, useCallback } from "react";
import { ShopItem } from "@/core/entities/ShopItem";
import { FirestoreShopRepo } from "@/infrastructure/repositories/FirestoreShopRepo";
import { MockShopRepo } from "@/infrastructure/repositories/MockShopRepo";
import {
  GetShopItemsUseCase,
  BuyShopItemUseCase,
  GetUserDecorationsUseCase,
} from "@/core/use-cases/ShopUseCases";

export function useShopAdapter(uid?: string) {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userDecorations, setUserDecorations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = useMemo(() => {
    return process.env.NEXT_PUBLIC_USE_MOCK === "true"
      ? new MockShopRepo()
      : new FirestoreShopRepo();
  }, []);

  const getItemsUseCase = useMemo(() => new GetShopItemsUseCase(repo), [repo]);
  const buyItemUseCase = useMemo(() => new BuyShopItemUseCase(repo), [repo]);
  const getDecorationsUseCase = useMemo(() => new GetUserDecorationsUseCase(repo), [repo]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getItemsUseCase.execute();
      setShopItems(items);

      if (uid) {
        const decs = await getDecorationsUseCase.execute(uid);
        setUserDecorations(decs);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách cửa hàng.");
    } finally {
      setLoading(false);
    }
  }, [uid, getItemsUseCase, getDecorationsUseCase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const buyItem = async (itemId: string, price: number) => {
    if (!uid) {
      return { success: false, error: "Vui lòng đăng nhập để mua vật phẩm." };
    }
    setLoading(true);
    try {
      const res = await buyItemUseCase.execute(uid, itemId, price);
      if (res.success) {
        setUserDecorations((prev) => [...prev, itemId]);
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    shopItems,
    userDecorations,
    loading,
    error,
    refresh: fetchData,
    buyItem,
  };
}
