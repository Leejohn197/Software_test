import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.mistake.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.mistake.count(),
  ]);
  
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.mistake.create({
    data: {
      title: body.title,
      category: body.category || "OTHER",
      content: body.content || null,
      status: body.status || "REVIEWING",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
