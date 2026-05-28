"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, Target, PenTool, XCircle, TrendingUp, Link as LinkIcon, Search, FlaskConical, Briefcase, Compass } from "lucide-react";

const navItems = [
  { href: "/", label: "仪表盘", icon: LayoutDashboard },
  { href: "/knowledge", label: "知识点", icon: Library },
  { href: "/interview", label: "面试题库", icon: Target },
  { href: "/practice", label: "练习任务", icon: PenTool },
  { href: "/review", label: "错题本", icon: XCircle },
  { href: "/progress", label: "学习进度", icon: TrendingUp },
  { href: "/sources", label: "内容来源", icon: LinkIcon },
  { href: "/jobs", label: "招聘信息", icon: Briefcase },
  { href: "/links", label: "学习导航", icon: Compass },
  { href: "/search", label: "搜索", icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-sky-100 flex flex-col shadow-[2px_0_8px_rgba(0,0,0,0.02)] z-10">
      <div className="p-6 border-b border-sky-50 flex items-center gap-3">
        <div className="bg-sky-100 p-2 rounded-xl text-sky-600 shadow-sm">
          <FlaskConical size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">测试学习站</h1>
          <p className="text-[11px] text-sky-600 font-medium uppercase tracking-wider mt-0.5">Training Camp</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? "bg-sky-100 text-sky-700 shadow-sm shadow-sky-100/50" 
                  : "text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:translate-x-1"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-sky-600" : "text-slate-400"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sky-50 text-[11px] text-slate-400 text-center font-medium bg-white/50">
        MVP v1.0 · SQLite
      </div>
    </aside>
  );
}
