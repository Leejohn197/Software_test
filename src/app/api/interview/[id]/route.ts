import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.interviewQuestion.findUnique({
    where: { id: Number(id) },
    include: { knowledge: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const current = await prisma.interviewQuestion.findUnique({ where: { id: Number(id) } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const VALID_TRANSITIONS: Record<string, string[]> = {
    NOT_STARTED: ["IN_PROGRESS", "MASTERED", "NOT_KNOW", "FUZZY"],
    IN_PROGRESS: ["NOT_STARTED", "NOT_KNOW", "FUZZY", "MASTERED"],
    NOT_KNOW: ["NOT_STARTED", "IN_PROGRESS", "FUZZY", "MASTERED"],
    FUZZY: ["NOT_STARTED", "IN_PROGRESS", "NOT_KNOW", "MASTERED"],
    MASTERED: ["NOT_STARTED", "REVIEWED", "NOT_KNOW", "FUZZY"],
    REVIEWED: ["NOT_STARTED", "NOT_KNOW", "FUZZY", "MASTERED"],
  };

  const allowed = VALID_TRANSITIONS[current.status] || [];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: `非法状态转换: ${current.status} -> ${body.status}` }, { status: 400 });
  }

  const item = await prisma.interviewQuestion.update({
    where: { id: Number(id) },
    data: { status: body.status },
  });
  return NextResponse.json(item);
}
