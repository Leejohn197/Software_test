import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ knowledge: [], questions: [], practice: [] });

  const [knowledge, questions, practice] = await Promise.all([
    prisma.knowledge.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { example: { contains: q } },
        ],
      },
      take: 50,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.interviewQuestion.findMany({
      where: {
        OR: [
          { question: { contains: q } },
          { referenceAnswer: { contains: q } },
        ],
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    }),
    prisma.practiceTask.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ knowledge, questions, practice });
}
