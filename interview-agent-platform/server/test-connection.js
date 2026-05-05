require('dotenv').config({ path: '../.env' });

console.log('🔍 环境变量检查:');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✓ 已设置' : '✗ 未设置');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✓ 已设置' : '✗ 未设置');
console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ 已设置' : '✗ 未设置');
console.log('  PORT:', process.env.PORT || 5000);

const mongoose = require('mongoose');
console.log('\n🔄 测试 MongoDB 连接...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  ssl: false,
  retryWrites: false,
})
.then(() => {
  console.log('✅ MongoDB 连接成功！');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB 连接失败:', err.message);
  process.exit(1);
});
