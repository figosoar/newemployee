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

// 日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 静态文件服务 - 使用绝对路径
const frontendPath = path.join(__dirname, '../frontend');
const adminPath = path.join(__dirname, '../admin');

console.log('Frontend path:', frontendPath);
console.log('Admin path:', adminPath);

app.use(express.static(frontendPath));
app.use('/admin', express.static(adminPath));

// 根路径重定向到表单页面
app.get('/', (req, res) => {
  res.redirect('/form.html');
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    baseUrl: BASE_URL,
    frontendPath: frontendPath,
    adminPath: adminPath
  });
});

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
    // 使用请求的 host 来生成 URL，确保在任何环境下都能正确工作
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const formUrl = BASE_URL !== `http://localhost:${PORT}` 
      ? `${BASE_URL}/form.html` 
      : `${protocol}://${host}/form.html`;
    
    console.log('生成二维码 URL:', formUrl);
    
    const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M'
    });
    res.json({ qrcode: qrCodeDataUrl, url: formUrl });
  } catch (error) {
    console.error('生成二维码失败:', error);
    res.status(500).json({ error: '生成二维码失败' });
  }
});

// 提交表单数据
app.post('/api/submit', (req, res) => {
  const { name, phone, department, idCard, carPlate, needFaceRecord } = req.body;
  
  if (!name || !phone || !department || !idCard || !carPlate) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }
  
  const submission = {
    id: nextId++,
    name,
    phone,
    department,
    idCard,
    carPlate,
    needFaceRecord: needFaceRecord || false,
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
