"use client";
import { Home, Bell, Clock, User, Wallet2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { id: 1, icon: Home, link: "/dashboard" },
  { id: 2, icon: Wallet2, link: "/dashboard/wallet" },
  { id: 3, icon: Clock, link: "/dashboard/history" },
  { id: 4, icon: User, link: "/dashboard/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-10 py-4 rounded-full shadow-lg flex justify-between gap-x-8 items-center border border-gray-200 w-[90%] max-w-[400px]">
      {navItems.map((nav) => {
        const isActive = pathname === nav.link;

        return (
          <Link
            key={nav.id}
            href={nav.link}
            className={`p-2 transition-colors flex flex-col items-center ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`}
          >
            <nav.icon size={26} />
          </Link>
        );
      })}
    </div>
  );
}
