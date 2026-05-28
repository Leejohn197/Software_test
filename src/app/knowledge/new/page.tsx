"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export default function NewKnowledge() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", category: "FT", content: "", example: "", priority: 0,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/knowledge/${data.id}`);
      } else {
        alert("创建失败");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">📝 新增知识点</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input type="text" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.filter(c => c.code !== "INTV").map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">概念说明 *</label>
          <textarea required rows={8} value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="支持 Markdown 格式..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">示例代码</label>
          <textarea rows={6} value={form.example}
            onChange={(e) => setForm({ ...form, example: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="SQL、命令、脚本等示例..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value={0}>普通</option>
            <option value={1}>重要</option>
            <option value={2}>必须掌握</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? "创建中..." : "创建知识点"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">取消</button>
        </div>
      </form>
    </div>
  );
}
