# 部署到 Railway 平台

## 方法一：通过 GitHub 部署（推荐）

### 1. 准备 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub

```bash
# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 3. 在 Railway 部署

1. 访问 [Railway.app](https://railway.app/)
2. 点击 "Start a New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway 会自动检测并部署

### 4. 配置环境变量

在 Railway 项目设置中添加：
- `BASE_URL`: 你的 Railway 应用 URL（例如：https://your-app.railway.app）

### 5. 获取公网地址

部署完成后，Railway 会提供一个公网地址，例如：
- https://your-app.railway.app

访问：
- 表单页面: https://your-app.railway.app/form.html
- 后台管理: https://your-app.railway.app/admin/index.html

---

## 方法二：通过 Railway CLI 部署

### 1. 安装 Railway CLI

```bash
npm install -g @railway/cli
```

### 2. 登录 Railway

```bash
railway login
```

### 3. 初始化项目

```bash
railway init
```

### 4. 部署

```bash
railway up
```

### 5. 设置环境变量

```bash
railway variables set BASE_URL=https://your-app.railway.app
```

---

## 部署后配置

### 更新 BASE_URL

部署完成后，需要在 Railway 控制台设置环境变量：

1. 进入项目设置
2. 点击 "Variables"
3. 添加变量：
   - Key: `BASE_URL`
   - Value: 你的 Railway 应用完整 URL

### 重新部署

设置环境变量后，点击 "Redeploy" 使配置生效。

---

## 注意事项

1. **数据持久化**: 当前使用内存存储，重启后数据会丢失。生产环境建议使用数据库（MongoDB、PostgreSQL 等）

2. **管理员密码**: 记得修改默认管理员密码（在 backend/server.js 中）

3. **HTTPS**: Railway 自动提供 HTTPS，二维码会使用 HTTPS 地址

4. **自定义域名**: 可以在 Railway 设置中绑定自定义域名

---

## 其他部署平台

### Vercel
需要将后端改为 Serverless Functions

### Heroku
类似 Railway，需要添加 Procfile：
```
web: node backend/server.js
```

### Render
直接连接 GitHub 仓库即可部署
