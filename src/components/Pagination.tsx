"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
}

export default function Pagination({ total, pageSize, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(total / pageSize) || 1;

  function updateParams(page: number, newPageSize?: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (newPageSize) params.set("pageSize", newPageSize.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and adjacent pages
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100">
      <div className="text-sm text-slate-500">
        共 <span className="font-bold text-slate-800">{total}</span> 条记录
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={pageSize}
          onChange={(e) => updateParams(1, Number(e.target.value))}
          className="px-2 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="10">10 / 页</option>
          <option value="20">20 / 页</option>
          <option value="50">50 / 页</option>
          <option value="100">100 / 页</option>
        </select>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage <= 1}
            onClick={() => updateParams(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
          </button>
          
          {pages.map((p, idx) => (
            <button
              key={idx}
              disabled={p === "..."}
              onClick={() => typeof p === "number" && updateParams(p)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                p === currentPage 
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200" 
                  : p === "..." 
                    ? "text-slate-400 cursor-default" 
                    : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => updateParams(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
