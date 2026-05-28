import { prisma } from "@/lib/prisma";
import ProgressBar from "@/components/ProgressBar";
import { getCategoryName } from "@/lib/utils";
import { CATEGORIES, STATUS_MAP } from "@/lib/constants";

export default async function ProgressPage() {
  const categories = CATEGORIES.filter(c => c.code !== "INTV");

  const results = await Promise.all(
    categories.map(async (cat) => {
      const total = await prisma.knowledge.count({ where: { category: cat.code } });
      const statuses = await prisma.knowledge.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { category: cat.code },
      });
      const statusMap: Record<string, number> = {};
      statuses.forEach((s) => { statusMap[s.status] = s._count.id; });
      return { ...cat, total, statusMap };
    })
  );

  const interviewTotal = await prisma.interviewQuestion.count();
  const interviewStatuses = await prisma.interviewQuestion.groupBy({ by: ["status"], _count: { id: true } });
  const interviewMap: Record<string, number> = {};
  interviewStatuses.forEach((s) => { interviewMap[s.status] = s._count.id; });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📈 学习进度</h1>

      {/* Knowledge modules */}
      <div className="space-y-4 mb-8">
        {results.map((r) => (
          <div key={r.code} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">{r.name}</h2>
              <span className="text-sm text-gray-500">{r.total} 个知识点</span>
            </div>
            {r.total > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(STATUS_MAP).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-gray-800">{r.statusMap[key] || 0}</div>
                    <div className="text-xs text-gray-500">{val.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">暂无数据</p>
            )}
            <div className="mt-3">
              <ProgressBar value={r.statusMap["MASTERED"] || 0} max={r.total} color="bg-green-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Interview questions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">🎯 面试题库</h2>
          <span className="text-sm text-gray-500">{interviewTotal} 道题</span>
        </div>
        {interviewTotal > 0 ? (
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-gray-800">{interviewMap[key] || 0}</div>
                <div className="text-xs text-gray-500">{val.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">暂无数据</p>
        )}
        <div className="mt-3">
          <ProgressBar value={interviewMap["MASTERED"] || 0} max={interviewTotal} color="bg-green-500" />
        </div>
      </div>
    </div>
  );
}
