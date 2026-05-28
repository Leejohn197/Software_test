-- CreateTable
CREATE TABLE "module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "knowledge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "module_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT,
    "example" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "knowledge_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "author" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "knowledge_source" (
    "knowledge_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("knowledge_id", "source_id"),
    CONSTRAINT "knowledge_source_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "knowledge_source_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interview_question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "knowledge_id" INTEGER,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "reference_answer" TEXT,
    "my_answer" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "interview_question_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "practice_task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "knowledge_id" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "reference_answer" TEXT,
    "my_answer" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "practice_task_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "learning_log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "knowledge_id" INTEGER NOT NULL,
    "old_status" TEXT,
    "new_status" TEXT,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "learning_log_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "knowledge_tag" (
    "knowledge_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("knowledge_id", "tag_id"),
    CONSTRAINT "knowledge_tag_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "knowledge_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "module_name_key" ON "module"("name");

-- CreateIndex
CREATE INDEX "knowledge_category_idx" ON "knowledge"("category");

-- CreateIndex
CREATE INDEX "knowledge_status_idx" ON "knowledge"("status");

-- CreateIndex
CREATE INDEX "knowledge_module_id_idx" ON "knowledge"("module_id");

-- CreateIndex
CREATE INDEX "interview_question_category_idx" ON "interview_question"("category");

-- CreateIndex
CREATE INDEX "interview_question_status_idx" ON "interview_question"("status");

-- CreateIndex
CREATE INDEX "practice_task_status_idx" ON "practice_task"("status");

-- CreateIndex
CREATE INDEX "learning_log_knowledge_id_idx" ON "learning_log"("knowledge_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");
