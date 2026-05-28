"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPracticeStatusLabel, getPracticeStatusColor, formatDate } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "@/lib/constants";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PracticeDetail() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [myAnswer, setMyAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/practice/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTask(data);
        setMyAnswer(data.myAnswer || "");
        setLoading(false);
      });
  }, [params.id]);

  async function saveAnswer() {
    setSaving(true);
    try {
      const res = await fetch(`/api/practice/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myAnswer, status: "IN_PROGRESS" }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function markComplete() {
    setSaving(true);
    try {
      const res = await fetch(`/api/practice/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (!task) return <div className="text-center py-20 text-gray-400">未找到</div>;

  return (
    <div className="max-w-3xl pb-12 animate-in fade-in duration-500">
      <Link href="/practice" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg mb-6 hover:bg-sky-100 transition-colors">
        <ArrowLeft size={16} /> 返回练习列表
      </Link>
      
      <h1 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight">{task.title}</h1>

      <div className="flex gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPracticeStatusColor(task.status)}`}>
          {getPracticeStatusLabel(task.status)}
        </span>
        <span className="bg-yellow-50 text-yellow-700 rounded px-2 py-0.5 text-xs">
          {DIFFICULTY_LABELS[task.difficulty] || `难度${task.difficulty}`}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">📋 练习内容</h2>
        <div className="whitespace-pre-wrap text-gray-700">{task.content || "暂无描述"}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">✏️ 我的回答</h2>
        <textarea rows={8} value={myAnswer}
          onChange={(e) => setMyAnswer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="在此输入你的答案..." />
        <button onClick={saveAnswer} disabled={saving}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
          {saving ? "保存中..." : "保存草稿"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">✅ 参考答案</h2>
        <details>
          <summary className="text-sm text-blue-600 cursor-pointer">点击查看参考答案</summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
            {task.referenceAnswer || "暂无参考答案"}
          </div>
        </details>
      </div>

      {task.status !== "COMPLETED" && (
        <button onClick={markComplete} disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          ✅ 标记为已完成
        </button>
      )}
      {task.status === "COMPLETED" && task.completedAt && (
        <p className="text-sm text-green-600">✅ 完成于 {formatDate(task.completedAt)}</p>
      )}
    </div>
  );
}
