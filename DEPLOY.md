# 2026 FIFA World Cup - 部署指南

## 前置条件

- Node.js >= 18
- npm >= 9
- Cloudflare 账号（[注册](https://dash.cloudflare.com/sign-up)）
- 完成 `npx wrangler login` 授权

---

## 1. 本地开发

```bash
# 安装依赖
npm install

# 初始化本地 D1 数据库（仅首次）
npx wrangler d1 migrations apply fifa-db --local

# 启动开发服务器
npx wrangler dev
```

开发服务器默认运行在 `http://127.0.0.1:8788`。

### wrangler.toml 说明

```toml
name = "fifa-world-cup-2026"          # Worker 名称（部署后即为子域名）
main = "app/index.tsx"                # 入口文件
compatibility_date = "2025-04-01"     # 兼容性日期
assets = { directory = "./public" }   # 静态资源目录

[[d1_databases]]
binding = "DB"
database_name = "fifa-db"             # D1 数据库名
database_id = "local-dev"             # 本地用 "local-dev"，生产替换为真实 ID
```

---

## 2. 部署到生产

### 2.1 创建远程 D1 数据库

```bash
# 创建远程数据库
npx wrangler d1 create fifa-db

# 输出示例：
# ✅ Created D1 database 'fifa-db'
# [[d1_databases]]
# binding = "DB"
# database_name = "fifa-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2.2 更新 wrangler.toml

将输出的 `database_id` 填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "fifa-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2.3 运行数据库迁移

```bash
npx wrangler d1 migrations apply fifa-db --remote
```

### 2.4 创建 KV 命名空间（可选，用于缓存）

```bash
npx wrangler kv:namespace create "KV"
```

将输出的 `id` 填入 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "KV"
id = "xxxxxxxx"
```

### 2.5 部署 Worker

```bash
npx wrangler deploy
```

部署成功后访问：`https://fifa-world-cup-2026.<你的子域名>.workers.dev`

### 2.6 更新比赛比分（比赛结束后）

世界杯比赛结束后，手动更新比分：

```sql
-- 更新比赛比分和状态
UPDATE matches SET home_score = 3, away_score = 1, status = 'finished' WHERE id = 'mc1';

-- 触发所有用户的竞猜计分
-- 访问 URL（需管理员调用）：
-- GET https://fifa2026.workers.dev/api/score/mc1
```

计分 URL 会自动计算所有预测该场比赛用户的得分，并检查成就发放。

---

### 2.7 重置数据库（重新部署前）

如果需要清除所有数据重新开始：

```bash
# 删除远程数据库
npx wrangler d1 delete fifa-db

# 重新创建
npx wrangler d1 create fifa-db

# 重新配置 database_id（注意更新 wrangler.toml）

# 重新执行迁移
npx wrangler d1 migrations apply fifa-db --remote
```

### 2.8 自定义域名（可选）

```bash
# Cloudflare Dashboard → Workers & Pages → 选择 Worker → Triggers → Custom Domains
# 添加你的自定义域名
```

---

## 3. 环境变量（无需 .env）

所有配置通过 `wrangler.toml` 完成。无需 `.env` 文件。

如需环境变量，在 `wrangler.toml` 中添加：

```toml
[vars]
JWT_SECRET = "your-secret-key"
```

---

## 3.5 数据说明

默认种子数据包含：
- **48 支球队**按 12 组分档排列（基于 FIFA 排名和地理分布）
- **104 场比赛**（72 场小组赛 + 32 场淘汰赛）
- **所有比赛状态为 `scheduled`**，无虚构比分
- **用户数据为空**（需要注册后产生）

**所有比分需要在比赛真实结束后手动更新。** 建议在比赛结束后：
1. 通过 `wrangler d1 execute` 执行 UPDATE 语句更新比分
2. 调用计分 API 计算用户竞猜得分

---

## 4. 免费计划配额说明

| 资源 | 免费额度 | 本项目预估用量 |
|------|---------|--------------|
| **Worker 请求** | 100,000/天 | 小团队 < 1,000/天 ✅ |
| **Worker CPU 时间** | 10ms/调用 | SSR 渲染 ~2-5ms ✅ |
| **D1 行读取** | 500万/天 | 远低于限制 ✅ |
| **D1 存储** | 5 GB | < 100 MB ✅ |
| **D1 行写入** | 10万/天 | 用户注册/竞猜 ~1,000/天 ✅ |
| **KV 读取** | 10万/天 | 可选启用 ✅ |
| **静态资源** | 无限 | ✅ |

> 如果世界杯期间流量激增，建议升级到 Workers Paid（$5/月）。
> Paid 计划：10M 请求/月、30s CPU 时间/调用、25 亿 D1 行读取/月。

---

## 5. 常见问题

### 5.1 D1 数据库需要手动创建吗？

是的。在 `wrangler deploy` 之前必须：
1. `npx wrangler d1 create fifa-db` — 创建远程数据库
2. `npx wrangler d1 migrations apply fifa-db --remote` — 执行建表迁移

### 5.2 如何重置本地数据库？

```bash
# 删除本地 D1 状态目录
rm -rf .wrangler/state/v3/d1
# 重新执行迁移
npx wrangler d1 migrations apply fifa-db --local
```

### 5.3 如何查看日志？

```bash
# 生产日志
npx wrangler tail

# 本地开发日志直接在终端输出
```

### 5.4 如何更新 Worker？

```bash
# 重新部署
npx wrangler deploy
```

### 5.5 如何回滚？

```bash
# 查看版本列表
npx wrangler rollback --list

# 回滚到指定版本
npx wrangler rollback --version <version-id>
```

---

## 6. i18n 多语言说明

当前支持 8 种语言，通过 URL 路径前缀切换：

| 前缀 | 语言 |
|------|------|
| `/en` | English |
| `/zh` | 中文 |
| `/fr` | Français |
| `/es` | Español |
| `/ru` | Русский |
| `/ja` | 日本語 |
| `/ko` | 한국어 |
| `/hi` | हिन्दी |

- 未指定语言时自动根据 `Accept-Language` 头检测
- 语言偏好存储在 Cookie 中

---

## 7. 目录结构

```
fifa-world-cup-2026/
├── app/
│   ├── index.tsx              # Worker 入口
│   ├── components/
│   │   └── Layout.tsx         # 全局布局 + Header/Footer/Theme/Lang
│   ├── routes/
│   │   └── index.tsx          # 所有路由处理
│   └── lib/
│       ├── auth.ts            # JWT 认证中间件
│       └── i18n.ts            # 多语言引擎 + 翻译 + 中间件
├── migrations/
│   └── 001_schema.sql         # D1 数据库建表
├── public/
│   ├── favicon.svg
│   └── styles/
│       └── app.css            # 全局样式
├── wrangler.toml              # Cloudflare Workers 配置
├── tsconfig.json
└── package.json
```

---

## 8. 注意事项

1. **JWT 密钥**：当前硬编码为 `"secret-key"`，上线前请改为强随机密钥
2. **密码存储**：当前为明文比较，生产环境应使用 bcrypt 或其他哈希
3. **CORS**：已全局允许，生产环境建议根据实际域名限制
4. **Rate Limit**：免费计划无内置限流，高流量场景建议自行实现或升级 Paid 计划
