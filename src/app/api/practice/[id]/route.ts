import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.practiceTask.findUnique({
    where: { id: Number(id) },
    include: { knowledge: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.myAnswer !== undefined) data.myAnswer = body.myAnswer;
  if (body.status) {
    data.status = body.status;
    if (body.status === "COMPLETED") data.completedAt = new Date();
  }
  const item = await prisma.practiceTask.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(item);
}
