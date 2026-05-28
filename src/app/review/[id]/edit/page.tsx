"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditMistakePage() {
  const router = useRouter();
  const params = useParams();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [status, setStatus] = useState("REVIEWING");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/mistakes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || "");
        setCategory(data.category || "OTHER");
        setStatus(data.status || "REVIEWING");
        setContent(data.content || "");
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return alert("请输入错题标题");
    
    setSaving(true);
    try {
      const res = await fetch(`/api/mistakes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, status, content }),
      });
      if (res.ok) {
        router.push("/review");
        router.refresh();
      } else {
        alert("保存失败");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定要删除这条错题记录吗？删除后无法恢复。")) return;
    setSaving(true);
    const res = await fetch(`/api/mistakes/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/review");
      router.refresh();
    } else {
      setSaving(false);
      alert("删除失败");
    }
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ],
  };

  if (loading) return <div className="text-center py-20 text-slate-400">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <Link href="/review" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg mb-6 hover:bg-sky-100 transition-colors">
        <ArrowLeft size={16} /> 返回错题本
      </Link>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">📝 编辑错题</h1>
        <button onClick={handleDelete} className="text-sm font-semibold text-rose-500 hover:text-rose-700">
          删除此记录
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-sky-100 rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">错题/难点标题</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">归属分类</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors"
            >
              <option value="FT">功能测试</option>
              <option value="MYSQL">MySQL</option>
              <option value="LINUX">Linux</option>
              <option value="PW">Playwright</option>
              <option value="API">接口测试</option>
              <option value="INTV">面试题</option>
              <option value="PROJ">项目实战</option>
              <option value="OTHER">其他</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">状态</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors"
            >
              <option value="REVIEWING">复盘中</option>
              <option value="RESOLVED">已解决</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">复盘笔记 (支持富文本)</label>
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-64"
            />
          </div>
        </div>

        <div className="pt-10 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存修改"}
          </button>
        </div>
      </form>
    </div>
  );
}
