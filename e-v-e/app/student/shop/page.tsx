"use client";

import React, { useState } from "react";
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
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentShopPage() {
  const { currentUser, profile } = useAuthAdapter();
  const uid = currentUser?.uid || profile?.uid || "usr_student";
  const [coins, setCoins] = useState(currentUser?.coins ?? profile?.coins ?? 250);
  const [ownedItems, setOwnedItems] = useState<string[]>([
    "frame_supernova_gold",
    "badge_cosmic_legend",
  ]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

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

  const handleBuy = async (item: typeof shopItems[0]) => {
    if (coins < item.price) {
      alert("Bạn không đủ Coins để đổi vật phẩm này. Hãy hoàn thành thêm các bài học!");
      return;
    }

    const newCoins = coins - item.price;
    setCoins(newCoins);
    setOwnedItems((prev) => [...prev, item.id]);

    try {
      if (uid) {
        await updateDoc(doc(db, "users", uid), {
          coins: newCoins,
          profileDecorations: arrayUnion(item.id),
        });
      }
    } catch {}

    setActionMsg(`Chúc mừng! Bạn đã đổi thành công "${item.name}". Hãy vào trang Hồ Sơ để trang bị!`);
    setTimeout(() => setActionMsg(null), 4000);
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

        <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
          <Coins className="w-5 h-5 text-red-600" />
          <span className="font-mono font-bold text-base text-red-700">{coins} Coins</span>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-zinc-500 hover:text-zinc-900"></button>
        </div>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shopItems.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-base text-zinc-900 mt-0.5">{item.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-1.5 font-bold text-red-600 text-sm">
                  <Coins className="w-4 h-4" />
                  {item.price} Coins
                </div>

                {isOwned ? (
                  <span className="px-3.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Đã Sở Hữu
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Mua Ngay
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
