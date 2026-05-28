import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getCategoryName } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import Pagination from "@/components/Pagination";
import { Library, Filter, Plus } from "lucide-react";

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ category?: string, page?: string, pageSize?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "20");
  const skip = (page - 1) * pageSize;

  const where = category ? { category } : {};
  
  const [items, total] = await Promise.all([
    prisma.knowledge.findMany({
      where,
      include: { module: true, tags: { include: { tag: true } } },
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.knowledge.count({ where })
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600 shadow-sm">
            <Library size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">知识点列表 {category ? `· ${getCategoryName(category)}` : ""}</h1>
            <p className="text-sm text-slate-500 mt-1">体系化学习，稳扎稳打</p>
          </div>
        </div>
        <Link href="/knowledge/new" className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow-md shadow-sky-200 transition-all text-sm font-semibold">
          <Plus size={18} /> 新增知识点
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-4 mb-8 flex-wrap items-center bg-white/60 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-sky-100">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm mr-2">
          <Filter size={16} />
          <span>分类:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/knowledge" className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${!category ? "bg-sky-500 text-white shadow-sm shadow-sky-200" : "bg-sky-50/50 text-slate-600 hover:bg-sky-100"}`}>
            全部
          </Link>
          {CATEGORIES.filter(c => c.code !== "INTV").map((c) => (
            <Link key={c.code} href={`/knowledge?category=${c.code}`}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${category === c.code ? "bg-sky-500 text-white shadow-sm shadow-sky-200" : "bg-sky-50/50 text-slate-600 hover:bg-sky-100"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>暂无知识点</p>
          <Link href="/knowledge/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            去创建第一个知识点
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((k) => (
            <Link key={k.id} href={`/knowledge/${k.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{k.title}</h3>
                    <StatusBadge status={k.status} />
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{getCategoryName(k.category)}</span>
                    <span className="mx-2">·</span>
                    <span>更新于 {formatDate(k.updatedAt)}</span>
                    {k.tags.length > 0 && (
                      <>
                        <span className="mx-2">·</span>
                        {k.tags.map((t) => (
                          <span key={t.tagId} className="inline-block bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-xs mr-1">
                            {t.tag.name}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  {k.content && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{k.content.slice(0, 200)}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <Pagination total={total} pageSize={pageSize} currentPage={page} />
    </div>
  );
}
