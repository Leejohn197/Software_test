import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ClipboardList, Database, Terminal, PlaySquare, Workflow, Target, Rocket, Activity, Library, FileQuestion, PenTool, XCircle, Search, Plus } from "lucide-react";
import CalendarWidget from "@/components/CalendarWidget";

const MODULES = [
  { code: "FT", name: "功能测试", icon: ClipboardList, color: "bg-blue-50/50 border-blue-100 text-blue-600 hover:border-blue-300 shadow-sm hover:shadow-md" },
  { code: "MYSQL", name: "MySQL", icon: Database, color: "bg-sky-50/50 border-sky-100 text-sky-600 hover:border-sky-300 shadow-sm hover:shadow-md" },
  { code: "LINUX", name: "Linux", icon: Terminal, color: "bg-indigo-50/50 border-indigo-100 text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow-md" },
  { code: "PW", name: "Playwright", icon: PlaySquare, color: "bg-violet-50/50 border-violet-100 text-violet-600 hover:border-violet-300 shadow-sm hover:shadow-md" },
  { code: "API", name: "接口测试", icon: Workflow, color: "bg-cyan-50/50 border-cyan-100 text-cyan-600 hover:border-cyan-300 shadow-sm hover:shadow-md" },
  { code: "INTV", name: "面试题", icon: Target, color: "bg-rose-50/50 border-rose-100 text-rose-600 hover:border-rose-300 shadow-sm hover:shadow-md" },
  { code: "PROJ", name: "项目实战", icon: Rocket, color: "bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:border-emerald-300 shadow-sm hover:shadow-md" },
];

export default async function Dashboard() {
  const [totalKnowledge, totalQuestions, totalPractice, reviewCount, moduleStats] = await Promise.all([
    prisma.knowledge.count(),
    prisma.interviewQuestion.count(),
    prisma.practiceTask.count(),
    prisma.knowledge.count({ where: { status: { in: ["NOT_KNOW", "FUZZY"] } } }),
    prisma.knowledge.groupBy({ by: ["category"], _count: { id: true }, where: { status: "MASTERED" } }),
  ]);

  const masteredMap: Record<string, number> = {};
  moduleStats.forEach((s) => { masteredMap[s.category] = s._count.id; });

  const categoryCounts = await prisma.knowledge.groupBy({ by: ["category"], _count: { id: true } });
  const countMap: Record<string, number> = {};
  categoryCounts.forEach((c) => { countMap[c.category] = c._count.id; });

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600 shadow-sm">
          <Activity size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">学习仪表盘</h1>
          <p className="text-sm text-slate-500 mt-1">记录你的每一步成长</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Summary cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl font-black text-sky-600 tracking-tighter">{totalKnowledge}</div>
                <div className="bg-sky-50 p-2 rounded-xl text-sky-500"><Library size={20} /></div>
              </div>
              <div className="text-sm font-medium text-slate-500">知识点总数</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl font-black text-indigo-600 tracking-tighter">{totalQuestions}</div>
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500"><FileQuestion size={20} /></div>
              </div>
              <div className="text-sm font-medium text-slate-500">面试题总数</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-violet-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl font-black text-violet-600 tracking-tighter">{totalPractice}</div>
                <div className="bg-violet-50 p-2 rounded-xl text-violet-500"><PenTool size={20} /></div>
              </div>
              <div className="text-sm font-medium text-slate-500">练习任务</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl font-black text-rose-500 tracking-tighter">{reviewCount}</div>
                <div className="bg-rose-50 p-2 rounded-xl text-rose-500"><XCircle size={20} /></div>
              </div>
              <div className="text-sm font-medium text-slate-500">待复盘错题</div>
            </div>
          </div>

          {/* Module cards */}
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-sky-500 rounded-full inline-block"></span>
            学习模块
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {MODULES.map((m) => {
              const total = countMap[m.code] || 0;
              const mastered = masteredMap[m.code] || 0;
              const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
              const Icon = m.icon;
              return (
                <Link
                  key={m.code}
                  href={`/knowledge?category=${m.code}`}
                  className={`${m.color} border rounded-2xl p-6 transition-all duration-300 group`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-white/60 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div className="bg-white/60 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {total} 篇
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 text-lg mb-1">{m.name}</div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium mb-2 opacity-80">
                      <span>已掌握 {mastered}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-current h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-10 flex gap-4">
            <Link href="/knowledge/new" className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow-md shadow-sky-200 transition-all text-sm font-semibold hover:-translate-y-0.5">
              <Plus size={18} /> 新增知识点
            </Link>
            <Link href="/review" className="flex items-center gap-2 px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 shadow-sm transition-all text-sm font-semibold hover:-translate-y-0.5">
              <XCircle size={18} /> 进入错题复盘
            </Link>
            <Link href="/search" className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all text-sm font-semibold hover:-translate-y-0.5">
              <Search size={18} /> 全局搜索
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
