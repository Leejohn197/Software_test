"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_TRANSITIONS, STATUS_MAP } from "@/lib/constants";

export default function ReviewStatusForm({ itemId, itemType, currentStatus }: { itemId: number; itemType: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const transitions = STATUS_TRANSITIONS[currentStatus] || [];

  async function changeStatus(newStatus: string) {
    setLoading(true);
    const url = itemType === "knowledge" ? `/api/knowledge/${itemId}` : `/api/interview/${itemId}`;
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
      else alert("更新失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1">
      {transitions.map((s) => (
        <button key={s} onClick={() => changeStatus(s)} disabled={loading}
          className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-green-50 hover:border-green-300 disabled:opacity-50 whitespace-nowrap">
          → {STATUS_MAP[s]?.label || s}
        </button>
      ))}
    </div>
  );
}
