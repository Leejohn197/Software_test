import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const where = category ? { category } : {};
  const items = await prisma.knowledge.findMany({
    where,
    include: { module: true, tags: { include: { tag: true } } },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Find or create module
  let module = await prisma.module.findFirst({ where: { name: getCategoryName(body.category) } });
  if (!module) {
    module = await prisma.module.create({
      data: { name: getCategoryName(body.category), icon: body.category.toLowerCase() },
    });
  }

  const item = await prisma.knowledge.create({
    data: {
      title: body.title,
      category: body.category,
      content: body.content || "",
      example: body.example || null,
      priority: body.priority || 0,
      moduleId: module.id,
      status: "NOT_STARTED",
    },
  });

  // Create learning log
  await prisma.learningLog.create({
    data: { knowledgeId: item.id, newStatus: "NOT_STARTED", note: "新建知识点" },
  });

  return NextResponse.json(item, { status: 201 });
}

function getCategoryName(code: string) {
  const map: Record<string, string> = {
    FT: "功能测试", MYSQL: "MySQL", LINUX: "Linux",
    PW: "Playwright", API: "接口测试", INTV: "面试题", PROJ: "项目实战",
  };
  return map[code] || code;
}
