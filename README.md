# 二维码表单系统

一个完整的二维码表单系统，包含移动端表单页面和后台管理界面。

## 功能特点

- ✅ 移动端友好的表单页面
- ✅ 自动生成二维码
- ✅ 实时数据展示
- ✅ 后台管理界面
- ✅ 数据增删查改

## 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
npm start
```

3. 访问页面：
   - 表单页面: http://localhost:3000/form.html
   - 后台管理: http://localhost:3000/admin/index.html

## 使用说明

1. 打开后台管理页面，会自动生成二维码
2. 使用手机扫描二维码，打开表单页面
3. 填写姓名、手机号、部门、车牌号等信息
4. 提交后，数据会实时显示在后台管理界面

## 技术栈

- 后端: Node.js + Express
- 前端: 原生 HTML/CSS/JavaScript
- 二维码: qrcode 库

## 部署到公网

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解如何部署到 Railway、Vercel、Heroku 等平台。

## 注意事项

- 当前使用内存存储数据，重启服务器后数据会丢失
- 生产环境建议使用数据库（如 MongoDB、MySQL）
- 默认管理员账号：admin / admin123（部署后请修改）
