# Wish You, Yield Happiness

WY 和 YYH 的私密恋爱记录网站。项目使用 Next.js App Router、TypeScript、Tailwind CSS、Supabase Auth、Supabase Postgres、Supabase Storage 和 RLS，适配 Vercel 部署。

## 功能

- WY / YYH 使用 Supabase Auth 登录。
- WY / YYH 可以查看、新增、编辑、删除全部恋爱记录、相册、纪念日、愿望和留言。
- 所有内容默认 `private`，可以手动切换为 `public`。
- 访客必须先提交访问申请，WY 或 YYH 在设置页审核通过后生成访问 token。
- 访客只能通过 `/guest/access?token=...` 查看公开内容，不能直接查询 Supabase 表，也没有编辑入口。
- 图片上传到 Supabase Storage，数据库只保存 `image_url` 和 `storage_path`。
- `SUPABASE_SERVICE_ROLE_KEY` 只在服务端 Route Handler / Server Action 使用。

## 环境变量配置

本项目需要连接 Supabase，请先在项目根目录创建 `.env.local` 文件。

你可以复制模板文件：

```bash
cp .env.local.template .env.local
```

然后打开 `.env.local`，按下面说明填写。

### 1. NEXT_PUBLIC_SUPABASE_URL

填写 Supabase Project URL。

获取位置：

```text
Supabase Dashboard -> Project Settings -> API -> Project URL
```

格式示例：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

填写 Supabase 可发布密钥。

获取位置：

```text
Supabase Dashboard -> Project Settings -> API -> 可发布密钥
```

新版 Supabase 可能显示为：

```text
sb_publishable_xxxxxxxxxxxxxxxxx
```

这个密钥可以在浏览器前端使用。

格式示例：

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

### 3. SUPABASE_SERVICE_ROLE_KEY

填写 Supabase 秘密密钥。

获取位置：

```text
Supabase Dashboard -> Project Settings -> API -> 秘密密钥
```

新版 Supabase 可能显示为：

```text
sb_secret_xxxxxxxxxxxxxxxxx
```

这个密钥权限很高，只能在服务端使用。

注意：

- 不要发给别人
- 不要提交到 GitHub
- 不要写在前端组件里
- 不要放进任何 `NEXT_PUBLIC_` 开头的变量
- 只能在 Next.js Route Handler、Server Action、Server Component 的服务端逻辑中使用

格式示例：

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxxxxxxx
```

### 4. NEXT_PUBLIC_SITE_URL

本地开发时填写：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

正式上线后改成你的域名，例如：

```env
NEXT_PUBLIC_SITE_URL=https://wyyyh.online
```

这个变量用于生成游客访问链接、登录跳转地址和站点基础链接。

## 本地运行

```bash
npm install
cp .env.local.template .env.local
npm run dev
```

本地打开：

```text
http://localhost:3000/login
```

## Supabase 初始化

1. 在 Supabase 创建新项目。
2. 打开 SQL Editor。
3. 执行 `supabase/schema.sql`。
4. 执行 `supabase/seed.sql`。
5. 在 Supabase Auth 创建两个用户：WY 的邮箱账号、YYH 的邮箱账号。
6. 在 `profiles` 表插入两条记录，`id` 使用 Auth 用户 id：

```sql
insert into profiles (id, role, display_name)
values
  ('WY_AUTH_USER_ID', 'WY', 'WY'),
  ('YYH_AUTH_USER_ID', 'YYH', 'YYH');
```

7. `schema.sql` 会自动创建 public Storage bucket：`love-house`。如果没有创建成功，可以在 Storage 页面手动新建同名 bucket。
8. 本地和 Vercel 都要配置相同环境变量。

## 部署到 Vercel

1. 推送代码到 GitHub。
2. 在 Vercel 导入项目。
3. 在 Vercel 的 Environment Variables 填写：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://wyyyh.online`
4. 在 Vercel 添加域名 `wyyyh.online`。
5. 到阿里云 DNS 按 Vercel 提示配置解析。
6. 部署后用 WY / YYH 账号登录。

## 安全提醒

- 任何以 `NEXT_PUBLIC_` 开头的变量都可能被浏览器看到。
- `SUPABASE_SERVICE_ROLE_KEY` 绝对不能以 `NEXT_PUBLIC_` 开头。
- `SUPABASE_SERVICE_ROLE_KEY` 不能出现在客户端组件中。
- `.env.local` 必须在 `.gitignore` 中，不能提交到 GitHub。
- `.env.example` 和 `.env.local.template` 可以提交到 GitHub，它们不包含真实密钥。
- 如果环境变量缺失，项目会抛出清晰错误提示，例如 `Missing NEXT_PUBLIC_SUPABASE_URL`。
