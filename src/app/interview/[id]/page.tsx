import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { getCategoryName, formatDate } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import InterviewStatusForm from "../InterviewStatusForm";

export default async function InterviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await prisma.interviewQuestion.findUnique({
    where: { id: Number(id) },
    include: { knowledge: true },
  });
  if (!q) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">面试题详情</h1>
        <StatusBadge status={q.status} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex gap-2 mb-3">
          <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">{getCategoryName(q.category)}</span>
          <span className="bg-yellow-50 text-yellow-700 rounded px-2 py-0.5 text-xs">{DIFFICULTY_LABELS[q.difficulty] || `难度${q.difficulty}`}</span>
        </div>
        <p className="text-lg text-gray-800 whitespace-pre-wrap">{q.question}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">我的回答</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{q.myAnswer || "暂无回答"}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">参考答案</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{q.referenceAnswer || "暂无参考答案"}</p>
      </div>

      {q.knowledge && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm">
          关联知识点: <a href={`/knowledge/${q.knowledgeId}`} className="text-blue-600 hover:underline">{q.knowledge.title}</a>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-3">🔄 变更状态</h2>
        <InterviewStatusForm questionId={q.id} currentStatus={q.status} />
      </div>
    </div>
  );
}
