import Link from "next/link";

interface GameTileProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function GameTile({
  title,
  description,
  icon,
  href,
}: GameTileProps) {
  return (
    <Link href={href} className="group block">
<div className="aspect-square rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 hover-card-lift transition-all p-5 flex flex-col justify-between space-y-4">
  {/* Game Icon */}
  <div className="flex h-full flex-col items-center justify-center text-center">
    <img
      src={icon}
      alt={title}
      className="h-24 w-24 object-contain"
    />

    <h2 className="text-lg font-extrabold text-[#e1e2ec]">
      {title}
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      {description}
    </p>
  </div>
</div>
    </Link>
  );
}
