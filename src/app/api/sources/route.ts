import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.source.findMany({
      include: { knowledgeSources: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.source.count(),
  ]);
  
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Validate URL format if provided
  if (body.url) {
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json({ error: "URL格式不正确" }, { status: 400 });
    }
  }

  const item = await prisma.source.create({
    data: {
      type: body.type || "URL",
      url: body.url || null,
      title: body.title || null,
      author: body.author || null,
      description: body.description || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
