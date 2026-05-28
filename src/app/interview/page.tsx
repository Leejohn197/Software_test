import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import { getCategoryName, formatDate } from "@/lib/utils";
import { CATEGORIES, DIFFICULTY_LABELS } from "@/lib/constants";
import InterviewStatusForm from "./InterviewStatusForm";
import Pagination from "@/components/Pagination";
import { Target, Filter } from "lucide-react";

export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string; pageSize?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "20");
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (category) where.category = category;

  const [questions, total] = await Promise.all([
    prisma.interviewQuestion.findMany({
      where,
      include: { knowledge: true },
      orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.interviewQuestion.count({ where })
  ]);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-600 shadow-sm">
          <Target size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">面试题库</h1>
          <p className="text-sm text-slate-500 mt-1">沉淀真题，助力通关</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap items-center bg-white/60 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-sky-100">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm mr-2">
          <Filter size={16} />
          <span>分类:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/interview" className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${!params.category ? "bg-sky-500 text-white shadow-sm shadow-sky-200" : "bg-sky-50/50 text-slate-600 hover:bg-sky-100"}`}>全部</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.code} href={`/interview?category=${c.code}`}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${params.category === c.code ? "bg-sky-500 text-white shadow-sm shadow-sky-200" : "bg-sky-50/50 text-slate-600 hover:bg-sky-100"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>暂无面试题</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">{getCategoryName(q.category)}</span>
                    <span className="bg-yellow-50 text-yellow-700 rounded px-2 py-0.5 text-xs">
                      {DIFFICULTY_LABELS[q.difficulty] || `难度${q.difficulty}`}
                    </span>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="text-gray-800 mb-2">{q.question}</p>
                  {q.myAnswer && (
                    <div className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">我的回答:</span> {q.myAnswer.slice(0, 200)}
                    </div>
                  )}
                  {q.referenceAnswer && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">查看参考答案</summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">{q.referenceAnswer}</div>
                    </details>
                  )}
                  {q.knowledge && (
                    <Link href={`/knowledge/${q.knowledgeId}`} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                      关联知识点: {q.knowledge.title}
                    </Link>
                  )}
                </div>
                <InterviewStatusForm questionId={q.id} currentStatus={q.status} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Pagination total={total} pageSize={pageSize} currentPage={page} />
    </div>
  );
}
