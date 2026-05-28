export default function ProgressBar({ 
  value, max, color = "bg-blue-500" 
}: { 
  value: number; max: number; color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{value}/{max}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
