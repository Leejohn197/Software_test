import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getPracticeStatusLabel, getPracticeStatusColor, getCategoryName } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "@/lib/constants";

import Pagination from "@/components/Pagination";

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ status?: string, page?: string, pageSize?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "20");
  const skip = (page - 1) * pageSize;

  const where = params.status ? { status: params.status } : {};
  
  const [tasks, total] = await Promise.all([
    prisma.practiceTask.findMany({
      where,
      include: { knowledge: true },
      orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.practiceTask.count({ where })
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">✏️ 练习任务</h1>

      <div className="flex gap-2 mb-6">
        {["", "PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <Link key={s} href={`/practice${s ? `?status=${s}` : ""}`}
            className={`px-3 py-1.5 rounded-full text-sm border ${params.status === s || (!params.status && !s) ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`}>
            {s ? getPracticeStatusLabel(s) : "全部"}
          </Link>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>暂无练习任务</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Link key={t.id} href={`/practice/${t.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800">{t.title}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPracticeStatusColor(t.status)}`}>
                  {getPracticeStatusLabel(t.status)}
                </span>
                <span className="bg-yellow-50 text-yellow-700 rounded px-2 py-0.5 text-xs">
                  {DIFFICULTY_LABELS[t.difficulty] || `难度${t.difficulty}`}
                </span>
              </div>
              {t.content && <p className="text-sm text-gray-600 line-clamp-2">{t.content.slice(0, 200)}</p>}
              {t.knowledge && (
                <span className="text-xs text-blue-600 mt-1 inline-block">关联: {t.knowledge.title}</span>
              )}
            </Link>
          ))}
        </div>
      )}
      <Pagination total={total} pageSize={pageSize} currentPage={page} />
    </div>
  );
}
