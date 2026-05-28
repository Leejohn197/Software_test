import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.source.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.source.update({
    where: { id: Number(id) },
    data: {
      type: body.type,
      url: body.url,
      title: body.title,
      author: body.author,
      description: body.description,
    },
  });
  return NextResponse.json(item);
}
