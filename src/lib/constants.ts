export const CATEGORIES = [
  { code: "FT", name: "功能测试", icon: "clipboard-check" },
  { code: "MYSQL", name: "MySQL", icon: "database" },
  { code: "LINUX", name: "Linux", icon: "terminal" },
  { code: "PW", name: "Playwright", icon: "playwright" },
  { code: "API", name: "接口测试", icon: "api" },
  { code: "INTV", name: "面试题", icon: "interview" },
  { code: "PROJ", name: "项目实战", icon: "project" },
] as const;

export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  NOT_STARTED: { label: "未学习", color: "bg-gray-100 text-gray-600" },
  IN_PROGRESS: { label: "学习中", color: "bg-blue-100 text-blue-700" },
  NOT_KNOW: { label: "不会", color: "bg-red-100 text-red-700" },
  FUZZY: { label: "模糊", color: "bg-yellow-100 text-yellow-700" },
  MASTERED: { label: "掌握", color: "bg-green-100 text-green-700" },
  REVIEWED: { label: "已复盘", color: "bg-purple-100 text-purple-700" },
};

export const PRACTICE_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "未开始", color: "bg-gray-100 text-gray-600" },
  IN_PROGRESS: { label: "进行中", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "已完成", color: "bg-green-100 text-green-700" },
  SKIPPED: { label: "已跳过", color: "bg-orange-100 text-orange-700" },
};

export const STATUS_TRANSITIONS: Record<string, string[]> = {
  NOT_STARTED: ["IN_PROGRESS", "MASTERED", "NOT_KNOW", "FUZZY"],
  IN_PROGRESS: ["NOT_STARTED", "NOT_KNOW", "FUZZY", "MASTERED"],
  NOT_KNOW: ["NOT_STARTED", "IN_PROGRESS", "FUZZY", "MASTERED"],
  FUZZY: ["NOT_STARTED", "IN_PROGRESS", "NOT_KNOW", "MASTERED"],
  MASTERED: ["NOT_STARTED", "REVIEWED", "NOT_KNOW", "FUZZY"],
  REVIEWED: ["NOT_STARTED", "NOT_KNOW", "FUZZY", "MASTERED"],
};

export const DIFFICULTY_LABELS = ["", "简单", "中等", "偏难", "困难", "极难"];
