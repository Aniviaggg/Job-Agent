const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://aniviaguo_db_user:p17nDBj9mmsxcUsB@cluster0.kjslc3s.mongodb.net/interview-agent?retryWrites=true&w=majority&authSource=admin';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB 连接成功！');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败:', err.message);
    process.exit(1);
  });
