import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/Pagination";
import { XCircle, Plus, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ page?: string, pageSize?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "20");
  const skip = (page - 1) * pageSize;

  const [mistakes, total] = await Promise.all([
    prisma.mistake.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.mistake.count()
  ]);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-600 shadow-sm">
            <XCircle size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">错题本 / 复盘队列</h1>
            <p className="text-sm text-slate-500 mt-1">独立记录错题与难点，支持富文本排版</p>
          </div>
        </div>
        <Link href="/review/new" className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md shadow-rose-200 transition-all text-sm font-semibold">
          <Plus size={18} /> 新增错题
        </Link>
      </div>

      {total === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-lg text-gray-600 mb-2">暂无错题，继续努力！</p>
          <Link href="/review/new" className="text-rose-600 hover:underline text-sm inline-block">去创建第一道错题</Link>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {mistakes.map((m) => (
            <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-xs font-medium">
                      {m.category === "OTHER" ? "其他" : m.category}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      m.status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {m.status === "RESOLVED" ? "已解决" : "复盘中"}
                    </span>
                    <span className="text-xs text-slate-400">更新于 {formatDate(m.updatedAt)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{m.title}</h3>
                  {m.content && (
                    <div className="text-sm text-slate-600 line-clamp-3 prose prose-sm max-w-none" 
                      dangerouslySetInnerHTML={{ __html: m.content }} />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/review/${m.id}/edit`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    <Edit size={14} /> 编辑
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination total={total} pageSize={pageSize} currentPage={page} />
    </div>
  );
}
