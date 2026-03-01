"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartBar,
  FaDollarSign,
  FaBullhorn,
  FaEnvelope,
  FaUser,
  FaMoneyBill,
} from "react-icons/fa";

// 🔴 メニュー名を日本語に変更
const menu = [
  { name: "ダッシュボード", href: "/", icon: FaChartBar },
  { name: "売上管理", href: "/sales", icon: FaDollarSign },
  { name: "経費管理", href: "/expenses", icon: FaMoneyBill },
  { name: "社内連絡", href: "/announcements", icon: FaBullhorn },
  { name: "お問い合わせ", href: "/inquiry", icon: FaEnvelope },
  { name: "社員名簿", href: "/profile", icon: FaUser },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      {/* 🔴 パネル名を日本語に変更 */}
      <div className="p-6 text-xl font-bold border-b border-slate-700 tracking-wider">
        社内システム
      </div>

      <nav className="mt-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition ${
                active ? "bg-slate-800 border-l-4 border-blue-500" : ""
              }`}
            >
              <Icon />
              <span className={active ? "text-blue-400 font-bold" : ""}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}