"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Check,
  Crown,
  Shield,
  Palette,
  Flame,
  Award,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentShopPage() {
  const { currentUser, profile } = useAuthAdapter();
  const uid = currentUser?.uid || profile?.uid || "usr_student";
  const [coins, setCoins] = useState(currentUser?.coins ?? profile?.coins ?? 250);
  const [ownedItems, setOwnedItems] = useState<string[]>([
    "frame_cosmic_cyan",
    "frame_neon_blue",
    "badge_logic_expert",
  ]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const shopItems = [
    {
      id: "frame_supernova_gold",
      name: "Khung Avatar Hoàng Kim (Gold Edition)",
      category: "Khung Avatar",
      price: 150,
      icon: Crown,
      color: "from-amber-400 to-yellow-600",
      description: "Hiệu ứng viền vàng lấp lánh tỏa sáng quanh ảnh đại diện của bạn.",
    },
    {
      id: "frame_quantum_neon",
      name: "Khung Avatar Công Nghệ (Neon Blue)",
      category: "Khung Avatar",
      price: 120,
      icon: Sparkles,
      color: "from-cyan-400 to-blue-600",
      description: "Viền xanh neon phong cách công nghệ hiện đại.",
    },
    {
      id: "badge_cosmic_legend",
      name: "Huy Hiệu Thủ Khoa Xuất Sắc",
      category: "Huy Hiệu",
      price: 200,
      icon: Award,
      color: "from-purple-500 to-indigo-600",
      description: "Huy hiệu quý hiếm gắn bên cạnh tên người dùng trên toàn hệ thống.",
    },
    {
      id: "badge_flame_streak",
      name: "Huy Hiệu Chuyên Cần & Bứt Phá",
      category: "Huy Hiệu",
      price: 80,
      icon: Flame,
      color: "from-rose-500 to-orange-500",
      description: "Dành cho học sinh duy trì chuỗi học tập liên tục hàng ngày.",
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

    setActionMsg(`🎉 Chúc mừng! Bạn đã đổi thành công "${item.name}". Hãy vào trang Hồ Sơ để trang bị!`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-amber-400" /> Cửa Hàng Quà Tặng & Vật Phẩm E-V-E
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Đổi số Coins tích lũy từ các bài học & minigame để sở hữu Khung Avatar và Huy hiệu độc quyền.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="font-mono font-bold text-base text-amber-300">{coins} Coins</span>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white">✕</button>
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
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} p-[2px] shrink-0 shadow-md`}
                >
                  <div className="w-full h-full bg-[#0a0e1a] rounded-[14px] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase text-amber-400/90 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-base text-white mt-0.5">{item.name}</h3>
                  <p className="text-xs text-[#8e9bb4] mt-1">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold text-sm">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {item.price} Coins
                </div>

                {isOwned ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Đã Sở Hữu
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
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
