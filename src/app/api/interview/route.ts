import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const status = req.nextUrl.searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (status) where.status = status;
  
  const items = await prisma.interviewQuestion.findMany({
    where,
    include: { knowledge: true },
    orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.interviewQuestion.create({
    data: {
      question: body.question,
      category: body.category,
      referenceAnswer: body.referenceAnswer || null,
      myAnswer: body.myAnswer || null,
      difficulty: body.difficulty || 1,
      knowledgeId: body.knowledgeId || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
