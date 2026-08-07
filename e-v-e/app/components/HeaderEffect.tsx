"use client";

import { useEffect } from "react";

export default function HeaderEffect() {
  useEffect(() => {
    const header = document.getElementById("main-header");

    const handleScroll = () => {
      if (!header) return;

      if (window.scrollY > 50) {
        header.classList.add("shadow-lg", "bg-surface-glass/90");
        header.classList.remove("bg-surface-glass");
      } else {
        header.classList.remove("shadow-lg", "bg-surface-glass/90");
        header.classList.add("bg-surface-glass");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null; // Component này không hiển thị gì
}