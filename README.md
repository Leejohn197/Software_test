# 🧪 软件测试学习站

个人软件测试学习、练习与面试训练系统。

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **数据库**: PostgreSQL (Neon 云数据库 via Prisma ORM)
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Leejohn197/Software_test.git
cd Software_test
npm install
```

### 2. 配置数据库连接

在项目根目录创建 `.env` 文件，填入 Neon 数据库连接字符串：

```env
DATABASE_URL="postgresql://用户名:密码@xxx.neon.tech/数据库名?sslmode=require"
```

> 连接字符串从 [Neon 控制台](https://console.neon.tech) → Dashboard → Connection Details 获取。
> 选择 "Pooled connection" 模式即可。

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移（建表）
npx prisma migrate deploy

# 导入种子数据
psql "你的DATABASE_URL" -f prisma/seed.sql
```

> 也可以在 Neon 控制台的 SQL Editor 中直接粘贴 `prisma/seed.sql` 内容执行。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 仪表盘 | `/` | 模块卡片 + 学习进度概览 |
| 知识点 | `/knowledge` | 按分类浏览、新建、编辑、详情查看 |
| 面试题库 | `/interview` | 按分类/难度筛选、状态标记、参考答案 |
| 练习任务 | `/practice` | 练习列表、保存草稿、标记完成 |
| 错题本 | `/review` | 自动收集"不会"和"模糊"的题目 |
| 学习进度 | `/progress` | 各模块掌握统计 |
| 内容来源 | `/sources` | 来源管理(CRUD) |
| 搜索 | `/search` | 跨知识点/面试题/练习全文搜索 |

## 掌握状态流转

```
未学习 → 学习中 → 不会/模糊/掌握 → 已复盘
                 ↑___________↓ (支持回退)
```

系统会拒绝非法状态转换（如未学习→直接掌握）。

## 部署

项目通过 Vercel 自动部署，推送代码到 `main` 分支即触发构建。

**环境变量配置**（Vercel 项目 Settings → Environment Variables）：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Neon PostgreSQL 连接字符串 |

**构建流程**（自动执行）：
1. `prisma generate` — 生成 Prisma Client
2. `prisma migrate deploy` — 执行数据库迁移
3. `next build` — 构建 Next.js 应用

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 仪表盘
│   ├── knowledge/            # 知识点 CRUD
│   ├── interview/            # 面试题库
│   ├── practice/             # 练习任务
│   ├── review/               # 错题本
│   ├── progress/             # 学习进度
│   ├── sources/              # 内容来源
│   ├── search/               # 搜索
│   └── api/                  # API 路由
├── components/               # 共享组件
└── lib/                      # 工具函数 + Prisma 客户端
prisma/
├── schema.prisma             # 数据模型
├── migrations/               # 数据库迁移
└── seed.sql                  # 种子数据
```
