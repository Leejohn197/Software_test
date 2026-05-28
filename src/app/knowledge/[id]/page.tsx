import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getCategoryName } from "@/lib/utils";
import StatusForm from "./StatusForm";

export default async function KnowledgeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.knowledge.findUnique({
    where: { id: Number(id) },
    include: {
      module: true,
      tags: { include: { tag: true } },
      sources: { include: { source: true } },
      interviewQuestions: true,
      practiceTasks: true,
      learningLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!item) notFound();

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <StatusBadge status={item.status} />
          </div>
          <div className="text-sm text-gray-500">
            {getCategoryName(item.category)} · 优先级 {item.priority} · 更新于 {formatDate(item.updatedAt)}
          </div>
        </div>
        <Link href={`/knowledge/${item.id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
          ✏️ 编辑
        </Link>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex gap-2 mb-4">
          {item.tags.map((t) => (
            <span key={t.tagId} className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">
              {t.tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">📖 概念说明</h2>
        {item.content ? (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">{item.content}</div>
        ) : (
          <p className="text-gray-400">暂无内容</p>
        )}
      </div>

      {/* Example */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">💡 示例</h2>
        {item.example ? (
          <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono text-gray-700">{item.example}</pre>
        ) : (
          <p className="text-gray-400">暂无示例</p>
        )}
      </div>

      {/* Sources */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">🔗 内容来源</h2>
        {item.sources.length > 0 ? (
          <div className="space-y-2">
            {item.sources.map((ks) => (
              <div key={ks.sourceId} className="flex items-center gap-2 text-sm">
                <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">{ks.source.type}</span>
                {ks.source.url ? (
                  <a href={ks.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {ks.source.title || ks.source.url}
                  </a>
                ) : (
                  <span className="text-gray-600">{ks.source.title || "来源未知"}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">暂无来源（个人原创/待补充）</p>
        )}
      </div>

      {/* Related Interview Questions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">🎯 关联面试题</h2>
        {item.interviewQuestions.length > 0 ? (
          <div className="space-y-2">
            {item.interviewQuestions.map((q) => (
              <Link key={q.id} href={`/interview/${q.id}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm">
                <StatusBadge status={q.status} />
                <span className="ml-2 text-gray-700">{q.question.slice(0, 100)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">暂无关联面试题</p>
        )}
      </div>

      {/* Related Practice Tasks */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">✏️ 关联练习</h2>
        {item.practiceTasks.length > 0 ? (
          <div className="space-y-2">
            {item.practiceTasks.map((p) => (
              <Link key={p.id} href={`/practice/${p.id}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm">
                <span className="font-medium text-gray-700">{p.title}</span>
                <span className="ml-2 text-xs text-gray-500">难度 {p.difficulty}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">暂无关联练习</p>
        )}
      </div>

      {/* Status change */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">🔄 变更状态</h2>
        <StatusForm currentStatus={item.status} knowledgeId={item.id} />
      </div>

      {/* Learning Logs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-3">📝 状态变更记录</h2>
        {item.learningLogs.length > 0 ? (
          <div className="space-y-2">
            {item.learningLogs.map((log) => (
              <div key={log.id} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                <span>{log.oldStatus || "新建"}</span>
                <span>→</span>
                <span className="font-medium">{log.newStatus}</span>
                {log.note && <span className="text-gray-400">({log.note})</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">暂无变更记录</p>
        )}
      </div>
    </div>
  );
}
