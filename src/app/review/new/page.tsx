"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function NewMistakePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return alert("请输入错题标题");
    
    setLoading(true);
    try {
      const res = await fetch("/api/mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content }),
      });
      if (res.ok) {
        router.push("/review");
        router.refresh();
      } else {
        alert("保存失败");
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <Link href="/review" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg mb-6 hover:bg-sky-100 transition-colors">
        <ArrowLeft size={16} /> 返回错题本
      </Link>
      
      <h1 className="text-2xl font-bold mb-6 text-slate-800">✨ 记录新错题</h1>
      
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-sky-100 rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">错题/难点标题</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors"
              placeholder="例如：登录接口 Token 鉴权失败问题复盘"
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
            disabled={loading}
            className="px-8 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-200 transition-all disabled:opacity-50"
          >
            {loading ? "保存中..." : "保存错题"}
          </button>
        </div>
      </form>
    </div>
  );
}
