import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.mistake.findUnique({
    where: { id: Number(id) }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.mistake.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      category: body.category,
      content: body.content,
      status: body.status,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.mistake.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
