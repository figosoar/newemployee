# Railway 部署完整指南

## 问题诊断

如果部署后页面显示不正确（只显示文字而不是完整页面），请按以下步骤排查：

## 部署步骤

### 1. 确保代码已提交到 Git

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. 在 Railway 创建项目

1. 访问 https://railway.app/
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway 会自动开始部署

### 3. 等待首次部署完成

Railway 会自动：
- 检测 Node.js 项目
- 安装依赖 (`npm install`)
- 启动服务器 (`node backend/server.js`)

### 4. 获取部署 URL

部署完成后，Railway 会分配一个域名，例如：
- `https://your-app-production.up.railway.app`

### 5. 配置环境变量（关键步骤！）

在 Railway 项目中：
1. 点击项目
2. 进入 "Variables" 标签
3. 点击 "New Variable"
4. 添加：
   - **Variable**: `BASE_URL`
   - **Value**: `https://your-app-production.up.railway.app`（替换为你的实际域名，不要加尾部斜杠）

5. 点击 "Add"

### 6. 重新部署

添加环境变量后：
1. 进入 "Deployments" 标签
2. 点击最新部署右侧的三个点
3. 选择 "Redeploy"

### 7. 测试部署

访问以下 URL 测试（替换为你的域名）：

1. **健康检查**（查看配置信息）:
   ```
   https://your-app-production.up.railway.app/health
   ```
   应该返回 JSON，包含 status、baseUrl 等信息

2. **测试页面**:
   ```
   https://your-app-production.up.railway.app/test.html
   ```
   应该显示"静态文件服务正常工作！"

3. **表单页面**:
   ```
   https://your-app-production.up.railway.app/form.html
   ```
   应该显示完整的表单界面

4. **后台管理**:
   ```
   https://your-app-production.up.railway.app/admin/index.html
   ```
   应该显示登录界面

## 常见问题

### 问题 1: 页面只显示文字，没有样式

**原因**: 静态文件路径配置问题或 BASE_URL 未设置

**解决方案**:
1. 确认 `BASE_URL` 环境变量已正确设置
2. 访问 `/health` 端点检查配置
3. 查看 Railway 日志，确认没有错误
4. 重新部署

### 问题 2: 二维码生成失败

**原因**: BASE_URL 未设置或设置错误

**解决方案**:
1. 确保 `BASE_URL` 使用完整的 HTTPS URL
2. 不要在 URL 末尾添加斜杠
3. 重新部署后刷新页面

### 问题 3: API 请求失败（CORS 错误）

**原因**: 前端使用了错误的 API 地址

**解决方案**:
- 前端已配置为使用相对路径（`window.location.origin`），应该自动工作
- 检查浏览器控制台的网络请求

### 问题 4: 服务器无法启动

**原因**: 端口配置或依赖问题

**解决方案**:
1. 查看 Railway 日志
2. 确认 `package.json` 中的依赖正确
3. 确认 Node.js 版本兼容（需要 >= 18.0.0）

## 查看日志

在 Railway 项目中：
1. 点击 "Deployments"
2. 点击最新的部署
3. 查看 "Deploy Logs" 和 "Build Logs"

日志应该显示：
```
Frontend path: /app/frontend
Admin path: /app/admin
服务器运行在 https://your-app-production.up.railway.app
表单页面: https://your-app-production.up.railway.app/form.html
后台管理: https://your-app-production.up.railway.app/admin/index.html
```

## 自定义域名（可选）

1. 在 Railway 项目设置中
2. 进入 "Settings" 标签
3. 找到 "Domains" 部分
4. 点击 "Add Domain"
5. 输入你的域名
6. 按照提示配置 DNS

配置自定义域名后，记得更新 `BASE_URL` 环境变量！

## 数据持久化建议

当前应用使用内存存储，重启后数据会丢失。生产环境建议：

1. **使用 Railway 的 PostgreSQL 插件**:
   - 在项目中点击 "New"
   - 选择 "Database" → "PostgreSQL"
   - 连接数据库

2. **使用 MongoDB Atlas**:
   - 注册 MongoDB Atlas 免费账号
   - 创建集群
   - 获取连接字符串
   - 添加到 Railway 环境变量

## 安全建议

部署到生产环境后：

1. **修改管理员密码**:
   在 Railway 环境变量中添加：
   - `ADMIN_USERNAME`: 你的用户名
   - `ADMIN_PASSWORD`: 你的密码

2. **使用 HTTPS**: Railway 自动提供

3. **添加速率限制**: 防止 API 滥用

4. **使用真实的 JWT**: 替换简单的 token 生成

## 需要帮助？

如果遇到问题：
1. 检查 Railway 日志
2. 访问 `/health` 端点查看配置
3. 确认所有环境变量正确设置
4. 尝试重新部署
