"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Coins,
  Check,
  Crown,
  Sparkles,
  Flame,
  Award,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useToast } from "@/components/Toast";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function StudentShopPage() {
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const uid = auth.currentUser?.uid || currentUser?.uid || profile?.uid;
  const [coins, setCoins] = useState(currentUser?.coins ?? profile?.coins ?? 0);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const shopItems = [
    {
      id: "frame_supernova_gold",
      name: "Khung Avatar Đỏ Danh Dự",
      category: "Khung Avatar",
      price: 150,
      icon: Crown,
      description: "Hiệu ứng viền đỏ sang trọng quanh ảnh đại diện của bạn.",
    },
    {
      id: "frame_quantum_neon",
      name: "Khung Avatar Đen Sang Trọng",
      category: "Khung Avatar",
      price: 120,
      icon: Sparkles,
      description: "Viền đen tối giản phong cách hiện đại.",
    },
    {
      id: "badge_cosmic_legend",
      name: "Huy Hiệu Thủ Khoa Xuất Sắc",
      category: "Huy Hiệu",
      price: 200,
      icon: Award,
      description: "Huy hiệu gắn bên cạnh tên người dùng trên toàn hệ thống.",
    },
    {
      id: "badge_flame_streak",
      name: "Huy Hiệu Chuyên Cần & Bứt Phá",
      category: "Huy Hiệu",
      price: 80,
      icon: Flame,
      description: "Dành cho học viên duy trì chuỗi học tập liên tục hàng ngày.",
    },
  ];

  useEffect(() => {
    async function loadUserInventory() {
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const uSnap = await getDoc(doc(db, "users", uid));
        if (uSnap.exists()) {
          const data = uSnap.data();
          if (data.coins !== undefined) {
            setCoins(Number(data.coins) || 0);
          }
          const decs: string[] =
            data.profile_decorations ||
            data.profileDecorations ||
            data.inventory ||
            [];
          setOwnedItems(decs);
        }
      } catch (err) {
        console.warn("Could not load user inventory:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserInventory();
  }, [uid]);

  const handleBuy = async (item: typeof shopItems[0]) => {
    if (!uid) {
      toast.error("Vui lòng đăng nhập để thực hiện đổi thưởng!", "Cửa Hàng");
      return;
    }

    if (ownedItems.includes(item.id)) {
      toast.error("Bạn đã sở hữu vật phẩm này rồi, không thể mua lại!", "Cửa Hàng");
      return;
    }

    if (coins < item.price) {
      toast.error("Bạn không đủ Coins để đổi vật phẩm này. Hãy hoàn thành thêm các bài học!", "Cửa Hàng");
      return;
    }

    const newCoins = coins - item.price;
    setCoins(newCoins);
    setOwnedItems((prev) => [...prev, item.id]);

    try {
      await updateDoc(doc(db, "users", uid), {
        coins: newCoins,
        profile_decorations: arrayUnion(item.id),
        profileDecorations: arrayUnion(item.id),
        inventory: arrayUnion(item.id),
      });
      toast.success(`Chúc mừng! Bạn đã đổi thành công "${item.name}". Hãy vào trang Hồ Sơ để trang bị!`, "Cửa Hàng");
    } catch (err) {
      console.error("Lỗi khi cập nhật mua vật phẩm:", err);
      toast.error("Không thể hoàn tất giao dịch. Vui lòng thử lại!", "Cửa Hàng");
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-red-600" /> Cửa Hàng Đổi Thưởng E-V-E
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Đổi số Coins tích lũy từ các bài học & minigame để sở hữu Khung Avatar và Huy hiệu độc quyền.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 self-start sm:self-auto">
          <Coins className="w-5 h-5 text-red-600" />
          <span className="font-mono font-bold text-base text-red-700">{coins.toLocaleString()} Coins</span>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shopItems.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-5 shadow-xs ${
                isOwned
                  ? "border-zinc-200 opacity-80"
                  : "border-zinc-200 hover:border-red-600 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl shrink-0 ${isOwned ? "bg-zinc-100 text-zinc-500" : "bg-red-50 border border-red-200 text-red-600"}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200">
                      {item.category}
                    </span>
                    {isOwned && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Đã Mua
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 mt-2">{item.name}</h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-1.5 font-mono font-bold text-red-700 text-base">
                  <Coins className="w-4 h-4 text-red-600" /> {item.price} Coins
                </div>

                {isOwned ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold flex items-center gap-1.5 border border-zinc-200 cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 text-emerald-600" /> Đã Sở Hữu
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Đổi Ngay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
