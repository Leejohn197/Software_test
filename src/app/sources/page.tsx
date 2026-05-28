"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Pagination from "@/components/Pagination";

const SOURCE_TYPES = ["URL", "DOC", "VIDEO", "BOOK", "NOTE", "COURSE"];

function SourcesContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const [sources, setSources] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ type: "URL", url: "", title: "", author: "", description: "" });

  useEffect(() => {
    fetchSources();
  }, [page, pageSize]);

  async function fetchSources() {
    setLoading(true);
    const res = await fetch(`/api/sources?page=${page}&pageSize=${pageSize}`);
    const { data, total: t } = await res.json();
    setSources(data || []);
    setTotal(t || 0);
    setLoading(false);
  }

  function startEdit(source: any) {
    setEditingId(source.id);
    setForm({
      type: source.type || "URL",
      url: source.url || "",
      title: source.title || "",
      author: source.author || "",
      description: source.description || "",
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ type: "URL", url: "", title: "", author: "", description: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/sources/${editingId}` : "/api/sources";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
      cancelForm();
      fetchSources();
    } else {
      alert("保存失败");
    }
  }

  async function deleteSource(id: number) {
    if (!confirm("确认删除该来源？")) return;
    const res = await fetch(`/api/sources/${id}`, { method: "DELETE" });
    if (res.ok) fetchSources();
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🔗 内容来源管理</h1>
        <button onClick={() => { cancelForm(); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + 新增来源
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-3 shadow-md">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">类型 *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {SOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">标题</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">作者</label>
            <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">描述</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">保存</button>
            <button type="button" onClick={cancelForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">取消</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-10">加载中...</p>
      ) : sources.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>暂无内容来源</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {sources.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">{s.type}</span>
                    <span className="font-medium text-gray-800">{s.title || "无标题"}</span>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{s.url}</a>
                  )}
                  {s.author && <span className="text-xs text-gray-500 ml-2">作者: {s.author}</span>}
                  {s.description && <p className="text-sm text-gray-600 mt-1">{s.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">创建于 {formatDate(s.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => startEdit(s)} className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                  <button onClick={() => deleteSource(s.id)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
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

export default function SourcesPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">加载中...</div>}>
      <SourcesContent />
    </Suspense>
  );
}
