# 中式古建筑数字化平台（road）

一个围绕中国传统建筑文化的课程设计项目，包含**后端服务**与**前端站点**两部分。

---

## 一、目录结构

```
road/
├── 后端项目/                  # Spring Boot 后端（Java 17）
│   ├── src/main/java/com/example/buildingplatform/
│   │   ├── controller/         # 接口：文章发布 / 列表，用户登录验证码
│   │   ├── service/            # 业务逻辑
│   │   ├── mapper/             # MyBatis Mapper
│   │   ├── entity/ dto/ utils/ # 实体、传输对象、工具类
│   │   └── config/             # 跨域等配置
│   ├── src/main/resources/application.yml   # 本地配置（不入库，见下方说明）
│   ├── application-example.yml                # 配置模板
│   └── pom.xml
│
└── 前端项目/                  # 前端（静态页 + Flask + Node）
    ├── 丝绸之路/               # Flask 站点（端口 5000）
    │   ├── app.py             # 静态托管 + /api/sites 接口（SQLite）
    │   └── silkroad.db
    ├── 数据大屏/               # 数据可视化大屏（纯静态）
    ├── chatAI/                # Vue3 + Vite 智能问答前端（端口 5173）
    │   └── chat-backend/      # Express 服务（端口 3000，对接 DeepSeek）
    ├── 发布/                   # 文章发布模块（静态页）
    └── chat/                  # chatAI 的构建产物，由 Node 以 /chat/ 托管
```

---

## 二、环境要求

| 组件 | 版本 |
| --- | --- |
| JDK | **17**（必须；JDK 23+ 会默认关闭注解处理，导致 Lombok 失效） |
| Maven | 3.9+ |
| Node.js | ^20.19 或 >=22.12 |
| Python | 3.10+（Flask 3.x） |
| MySQL / Redis | 8.x / 7.x（后端依赖） |

---

## 三、启动方式

### 1. 后端（端口 8087）

```bash
cd 后端项目
# Windows 上务必用 JDK 17 构建
mvn clean package -DskipTests
java -jar target/building-platform-0.0.1-SNAPSHOT.jar
```

> **首次运行前**：把 `application-example.yml` 复制为 `src/main/resources/application.yml`，
> 填入你自己的 MySQL / Redis 连接信息（该文件已被 `.gitignore` 排除）。

### 2. 前端 · 丝绸之路站点（端口 5000）

```bash
cd 前端项目/丝绸之路
python app.py
```

启动后访问 <http://localhost:5000/>，会自动跳转到数据大屏首页。
`/api/sites` 为站点数据接口（SQLite，开箱即用）。

### 3. 前端 · 论坛 + AI 问答服务（端口 3000）

```bash
cd 前端项目/chatAI/chat-backend
npm install
node app.js
```

启动后访问 <http://localhost:3000/>。

> AI 问答需要 DeepSeek API Key：复制 `.env.example` 为 `.env`，
> 填写 `DEEPSEEK_API_KEY=sk-你的Key`，保存后重启服务。
> `.env` 已被 `.gitignore` 排除，不会提交。

### 4. 前端 · Vue 开发模式（端口 5173，可选）

```bash
cd 前端项目/chatAI
npm install
npm run dev        # 开发调试，/api 自动代理到 3000
npm run build      # 构建产物输出到 前端项目/chat/，由 Node 托管
```

### 一键启动

在仓库根目录双击 `启动所有服务.bat`，会依次拉起后端(8087)、Flask(5000)、Node(3000)。

---

## 四、端口一览

| 服务 | 端口 | 说明 |
| --- | --- | --- |
| Spring Boot 后端 | 8087 | `/api/articles/*`、`/user/*` |
| Flask 丝绸之路 | 5000 | 静态站点总入口 + `/api/sites` |
| Express 论坛/AI | 3000 | 静态托管 + `/api/chat` |
| Vite 开发服务器 | 5173 | 仅开发时使用 |

---

## 五、接口速览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/articles/list` | 文章列表（依赖 MySQL） |
| POST | `/api/articles/publish` | 发布文章（multipart，依赖 MySQL） |
| GET | `/api/articles/cover/{id}` | 文章封面图 |
| POST | `/user/code` | 获取登录验证码（控制台打印） |
| POST | `/user/login` | 验证码登录 |
| GET | `/api/sites` | 遗产站点数据（Flask，SQLite） |
| POST | `/api/chat` | AI 问答（Node，需 DeepSeek Key） |

---

## 六、安全说明

以下内容**不会**被提交到仓库（见 `.gitignore`）：

- `后端项目/src/main/resources/application.yml`（数据库/Redis 账号密码）
- 任意 `.env`（DeepSeek API Key）
- `node_modules/`、`target/`、`.idea/` 等依赖与构建产物

请勿手动把这些文件 `git add -f` 进仓库。
