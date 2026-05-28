import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.knowledge.findUnique({
    where: { id: Number(id) },
    include: {
      module: true,
      tags: { include: { tag: true } },
      sources: { include: { source: true } },
      interviewQuestions: true,
      practiceTasks: true,
      learningLogs: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.knowledge.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      category: body.category,
      content: body.content,
      example: body.example,
      priority: body.priority,
    },
  });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const current = await prisma.knowledge.findUnique({ where: { id: Number(id) } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Validate status transition
  const VALID_TRANSITIONS: Record<string, string[]> = {
    NOT_STARTED: ["IN_PROGRESS"],
    IN_PROGRESS: ["NOT_KNOW", "FUZZY", "MASTERED"],
    NOT_KNOW: ["IN_PROGRESS", "FUZZY"],
    FUZZY: ["IN_PROGRESS", "NOT_KNOW", "MASTERED"],
    MASTERED: ["REVIEWED", "NOT_KNOW", "FUZZY"],
    REVIEWED: ["NOT_KNOW", "FUZZY"],
  };

  const allowed = VALID_TRANSITIONS[current.status] || [];
  if (!allowed.includes(body.status)) {
    return NextResponse.json(
      { error: `非法状态转换: ${current.status} -> ${body.status}` },
      { status: 400 }
    );
  }

  const item = await prisma.knowledge.update({
    where: { id: Number(id) },
    data: { status: body.status },
  });

  // Log the change
  await prisma.learningLog.create({
    data: {
      knowledgeId: Number(id),
      oldStatus: current.status,
      newStatus: body.status,
      note: body.note || null,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.knowledge.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
