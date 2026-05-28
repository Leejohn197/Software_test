"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_TRANSITIONS, STATUS_MAP } from "@/lib/constants";

export default function StatusForm({ currentStatus, knowledgeId }: { currentStatus: string; knowledgeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const transitions = STATUS_TRANSITIONS[currentStatus] || [];

  async function changeStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/${knowledgeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
      else alert("状态更新失败: " + (await res.text()));
    } finally {
      setLoading(false);
    }
  }

  if (transitions.length === 0) return <p className="text-sm text-gray-400">当前状态无可用转换</p>;

  return (
    <div className="flex gap-2 flex-wrap">
      {transitions.map((s) => (
        <button key={s} onClick={() => changeStatus(s)} disabled={loading}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50">
          {STATUS_MAP[s]?.label || s}
        </button>
      ))}
    </div>
  );
}
