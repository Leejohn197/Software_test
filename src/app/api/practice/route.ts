import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where = status ? { status } : {};
  const items = await prisma.practiceTask.findMany({
    where,
    include: { knowledge: true },
    orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.practiceTask.create({
    data: {
      title: body.title,
      content: body.content || null,
      referenceAnswer: body.referenceAnswer || null,
      difficulty: body.difficulty || 1,
      knowledgeId: body.knowledgeId || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
