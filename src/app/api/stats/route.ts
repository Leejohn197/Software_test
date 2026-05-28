import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalKnowledge, totalQuestions, totalPractice, statusCounts] = await Promise.all([
    prisma.knowledge.count(),
    prisma.interviewQuestion.count(),
    prisma.practiceTask.count(),
    prisma.knowledge.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const statusMap: Record<string, number> = {};
  statusCounts.forEach((s) => { statusMap[s.status] = s._count.id; });

  return NextResponse.json({
    totalKnowledge,
    totalQuestions,
    totalPractice,
    statusMap,
  });
}
