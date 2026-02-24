const express = require('express');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// 存储提交的数据（实际项目中应使用数据库）
let submissions = [];
let nextId = 1;

// 管理员账号（实际项目中应使用数据库和加密）
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
app.use('/admin', express.static('admin'));

// 管理员登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // 生成简单的token（实际项目中应使用JWT）
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: '用户名或密码错误' });
  }
});

// 获取表单页面URL的二维码
app.get('/api/qrcode', async (req, res) => {
  try {
    const formUrl = `${BASE_URL}/form.html`;
    const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
      width: 300,
      margin: 2
    });
    res.json({ qrcode: qrCodeDataUrl, url: formUrl });
  } catch (error) {
    res.status(500).json({ error: '生成二维码失败' });
  }
});

// 提交表单数据
app.post('/api/submit', (req, res) => {
  const { name, phone, department, carPlate } = req.body;
  
  if (!name || !phone || !department || !carPlate) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }
  
  const submission = {
    id: nextId++,
    name,
    phone,
    department,
    carPlate,
    submitTime: new Date().toLocaleString('zh-CN')
  };
  
  submissions.push(submission);
  res.json({ success: true, message: '提交成功' });
});

// 获取所有提交的数据
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// 删除提交记录
app.delete('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  submissions = submissions.filter(s => s.id !== id);
  res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 ${BASE_URL}`);
  console.log(`表单页面: ${BASE_URL}/form.html`);
  console.log(`后台管理: ${BASE_URL}/admin/index.html`);
});
