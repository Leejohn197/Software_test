# 🧪 软件测试学习站

个人软件测试学习、练习与面试训练系统。

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **数据库**: SQLite (via Prisma ORM + libsql adapter)
- **部署**: 本地 Node.js

## 快速开始

```bash
# 安装依赖
npm install

# 初始化数据库 + 种子数据
npx prisma migrate dev --name init
sqlite3 dev.db < prisma/seed.sql

# 启动开发服务器
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

## 数据库切换到 MySQL

1. 修改 `.env`:
   ```
   DATABASE_URL="mysql://root:password@localhost:3306/software_test_learning"
   ```

2. 修改 `prisma/schema.prisma`:
   ```
   datasource db {
     provider = "mysql"
   }
   ```

3. 修改 `src/lib/prisma.ts` 使用 MySQL adapter

4. 重新迁移:
   ```bash
   npx prisma migrate dev --name init-mysql
   sqlite3 dev.db < prisma/seed.sql  # 或用 MySQL 导入
   ```

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

## 依赖统计

根据 `package.json` 和底层的依赖树统计：

- **直接依赖 (Direct Dependencies)**：共计 **23** 个（其中 `dependencies` 14 个，`devDependencies` 9 个）。包括了核心的 React 19、Next.js 16.2.6、Prisma、TailwindCSS 4 以及 `react-quill` 等。
- **总依赖树 (Total Packages)**：包含所有子依赖在内，共计约 **1350** 个 npm 模块包。
