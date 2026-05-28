INSERT INTO module (name, icon, sort_order) VALUES ('功能测试', 'clipboard-check', 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('MySQL', 'database', 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('Linux', 'terminal', 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('Playwright', 'playwright', 4) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('接口测试', 'api', 5) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('面试题', 'interview', 6) ON CONFLICT (name) DO NOTHING;
INSERT INTO module (name, icon, sort_order) VALUES ('项目实战', 'project', 7) ON CONFLICT (name) DO NOTHING;

INSERT INTO source (type, title, url, author, created_at) VALUES ('DOC', 'MySQL 官方文档', 'https://dev.mysql.com/doc/', 'Oracle', NOW());
INSERT INTO source (type, title, url, author, created_at) VALUES ('DOC', 'Playwright 官方文档', 'https://playwright.dev/docs/intro', 'Microsoft', NOW());
INSERT INTO source (type, title, author, created_at) VALUES ('NOTE', '个人学习笔记', 'self', NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (2, 'MySQL 索引基础', 'MYSQL', '索引是数据库中用于加速查询的数据结构。MySQL 使用 B+ 树作为默认索引结构。

常见索引类型：
- 主键索引 (PRIMARY KEY)
- 唯一索引 (UNIQUE)
- 普通索引 (INDEX)
- 全文索引 (FULLTEXT)
- 组合索引', '-- 创建索引
CREATE INDEX idx_name ON users(name);
-- 创建组合索引
CREATE INDEX idx_name_age ON users(name, age);
-- 查看索引
SHOW INDEX FROM users;', 'NOT_STARTED', 2, NOW(), NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (2, 'SQL JOIN 类型', 'MYSQL', 'JOIN 用于根据两个或多个表之间的关联字段组合数据。

主要类型：
- INNER JOIN: 返回两表中匹配的行
- LEFT JOIN: 返回左表所有行，右表匹配的行
- RIGHT JOIN: 返回右表所有行，左表匹配的行
- CROSS JOIN: 返回笛卡尔积', '-- INNER JOIN
SELECT o.id, u.name FROM orders o INNER JOIN users u ON o.user_id = u.id;
-- LEFT JOIN
SELECT u.name, o.id FROM users u LEFT JOIN orders o ON u.id = o.user_id;', 'NOT_STARTED', 2, NOW(), NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (3, 'Linux 文件权限管理', 'LINUX', 'Linux 使用 rwx 模型管理文件权限，分为所有者(u)、组(g)、其他(o) 三级。

权限含义：
- r (4): 读取
- w (2): 写入
- x (1): 执行', 'ls -la
chmod 755 script.sh
chmod u+x script.sh
chown user:group file.txt', 'NOT_STARTED', 1, NOW(), NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (1, '等价类划分法', 'FT', '等价类划分是黑盒测试的基本方法，将输入数据划分为若干等价类，从每个类中选取代表值作为测试用例。

等价类类型：
- 有效等价类: 符合需求的合理输入
- 无效等价类: 不符合需求的不合理输入', '场景：年龄输入框，要求 1-150 的整数

有效等价类：[1, 150] 内的整数 (如 25)
无效等价类：负数、0、小数、超范围值、非数字、空值', 'NOT_STARTED', 2, NOW(), NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (4, 'Playwright 定位器基础', 'PW', 'Playwright 推荐使用语义化定位器而非 CSS/XPath，更稳定且可读性更好。

推荐定位器优先级：
1. getByRole() - 基于 ARIA 角色
2. getByLabel() - 基于表单标签
3. getByPlaceholder() - 基于占位符
4. getByText() - 基于文本内容
5. getByTestId() - 基于 data-testid', 'await page.getByRole(''button'', { name: ''提交'' }).click();
await page.getByLabel(''用户名'').fill(''admin'');', 'NOT_STARTED', 2, NOW(), NOW());

INSERT INTO knowledge (module_id, title, category, content, example, status, priority, created_at, updated_at) VALUES (5, 'RESTful API 设计规范', 'API', 'REST (Representational State Transfer) 是一种 API 设计风格。

核心原则：
- 使用 HTTP 方法表示操作 (GET/POST/PUT/DELETE)
- URL 表示资源路径
- 无状态通信
- 统一的数据格式 (JSON)', 'GET    /api/users          # 获取用户列表
GET    /api/users/1        # 获取用户详情
POST   /api/users          # 创建用户
PUT    /api/users/1        # 更新用户
DELETE /api/users/1        # 删除用户', 'NOT_STARTED', 1, NOW(), NOW());

INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (1, 'NOT_STARTED', '种子数据', NOW());
INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (2, 'NOT_STARTED', '种子数据', NOW());
INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (3, 'NOT_STARTED', '种子数据', NOW());
INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (4, 'NOT_STARTED', '种子数据', NOW());
INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (5, 'NOT_STARTED', '种子数据', NOW());
INSERT INTO learning_log (knowledge_id, new_status, note, created_at) VALUES (6, 'NOT_STARTED', '种子数据', NOW());

INSERT INTO interview_question (category, question, reference_answer, difficulty, status, created_at, updated_at) VALUES ('MYSQL', 'MySQL 中 INNER JOIN 和 LEFT JOIN 的区别是什么？', 'INNER JOIN 只返回两表中匹配的行；LEFT JOIN 返回左表所有行，右表无匹配时返回 NULL。', 2, 'NOT_STARTED', NOW(), NOW());
INSERT INTO interview_question (category, question, reference_answer, difficulty, status, created_at, updated_at) VALUES ('MYSQL', '什么是索引？为什么能加速查询？', '索引是数据库中用于加速查询的数据结构，类似书的目录。MySQL 默认使用 B+ 树索引。', 2, 'NOT_STARTED', NOW(), NOW());
INSERT INTO interview_question (category, question, reference_answer, difficulty, status, created_at, updated_at) VALUES ('FT', '什么是等价类划分法？请举例说明。', '等价类划分是将输入数据划分为若干等价类，从每个类中选取代表值作为测试用例。', 1, 'NOT_STARTED', NOW(), NOW());
INSERT INTO interview_question (category, question, reference_answer, difficulty, status, created_at, updated_at) VALUES ('PW', 'Playwright 中推荐的定位器优先级是什么？', 'getByRole > getByLabel > getByPlaceholder > getByText > getByTestId', 2, 'NOT_STARTED', NOW(), NOW());
INSERT INTO interview_question (category, question, reference_answer, difficulty, status, created_at, updated_at) VALUES ('API', 'HTTP 状态码 200、201、400、404、500 分别代表什么？', '200 成功, 201 创建成功, 400 请求错误, 404 未找到, 500 服务器错误', 1, 'NOT_STARTED', NOW(), NOW());

INSERT INTO practice_task (title, content, difficulty, status, created_at, updated_at) VALUES ('编写 SQL 查询：获取每个部门薪资最高的员工', '假设有 employees 表和 departments 表，查询每个部门薪资最高的员工', 3, 'PENDING', NOW(), NOW());
INSERT INTO practice_task (title, content, difficulty, status, created_at, updated_at) VALUES ('Linux 命令：查找并清理大文件', '查找 /var/log 下大于 100MB 的文件并清理 30 天前的日志', 2, 'PENDING', NOW(), NOW());
INSERT INTO practice_task (title, content, difficulty, status, created_at, updated_at) VALUES ('Playwright 练习：编写登录页面自动化测试', '为登录页面编写测试用例：正确登录、错误密码、空用户名', 2, 'PENDING', NOW(), NOW());
