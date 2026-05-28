"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const today = new Date();
  const isToday = (d: number) => 
    today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  // Render exactly 6 rows (42 days) to keep height consistent
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day <= 0 || day > daysInMonth) return null;
    return day;
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <CalendarIcon size={20} className="text-sky-500" />
          <span>{year}年 {monthNames[month]}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-sky-50 rounded-lg text-slate-400 hover:text-sky-600 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-sky-50 rounded-lg text-slate-400 hover:text-sky-600 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(w => (
          <div key={w} className="text-[11px] font-semibold text-slate-400 py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <div key={i} className="aspect-square flex items-center justify-center p-0.5">
            {d && (
              <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isToday(d) 
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200" 
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-600 cursor-pointer"
              }`}>
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
