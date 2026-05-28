"use client";
import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { getCategoryName } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🔍 全局搜索</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="搜索知识点、面试题..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <button onClick={doSearch} disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "搜索中..." : "搜索"}
        </button>
      </div>

      {results && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            找到 {results.knowledge?.length || 0} 个知识点, {results.questions?.length || 0} 道面试题, {results.practice?.length || 0} 个练习
          </p>

          {results.knowledge?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">📚 知识点</h2>
              <div className="space-y-2">
                {results.knowledge.map((k: any) => (
                  <Link key={k.id} href={`/knowledge/${k.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{k.title}</span>
                      <StatusBadge status={k.status} />
                      <span className="text-xs text-gray-500">{getCategoryName(k.category)}</span>
                    </div>
                    {k.content && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{k.content.slice(0, 150)}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.questions?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">🎯 面试题</h2>
              <div className="space-y-2">
                {results.questions.map((q: any) => (
                  <Link key={q.id} href={`/interview/${q.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={q.status} />
                      <span className="text-gray-800">{q.question.slice(0, 100)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.practice?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">✏️ 练习任务</h2>
              <div className="space-y-2">
                {results.practice.map((p: any) => (
                  <Link key={p.id} href={`/practice/${p.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                    <span className="text-gray-800">{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!results.knowledge?.length && !results.questions?.length && !results.practice?.length && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>未找到匹配结果</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
