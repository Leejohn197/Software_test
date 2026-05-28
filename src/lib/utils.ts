import { STATUS_MAP, PRACTICE_STATUS_MAP } from "./constants";

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getStatusLabel(status: string) {
  return STATUS_MAP[status]?.label ?? status;
}

export function getStatusColor(status: string) {
  return STATUS_MAP[status]?.color ?? "bg-gray-100 text-gray-600";
}

export function getPracticeStatusLabel(status: string) {
  return PRACTICE_STATUS_MAP[status]?.label ?? status;
}

export function getPracticeStatusColor(status: string) {
  return PRACTICE_STATUS_MAP[status]?.color ?? "bg-gray-100 text-gray-600";
}

export function getCategoryName(code: string) {
  const map: Record<string, string> = {
    FT: "功能测试", MYSQL: "MySQL", LINUX: "Linux",
    PW: "Playwright", API: "接口测试", INTV: "面试题", PROJ: "项目实战",
  };
  return map[code] ?? code;
}
