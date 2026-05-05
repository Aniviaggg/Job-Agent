require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

console.log('🔍 详细诊断信息:');
console.log('════════════════════════════════');

const uri = process.env.MONGODB_URI;
console.log('\n1️⃣  连接字符串:');
console.log('   ', uri.substring(0, 50) + '...[密码已隐藏]...');

console.log('\n2️⃣  解析连接字符串:');
const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (match) {
  console.log('   用户名:', match[1]);
  console.log('   密码长度:', match[2].length, '字符');
  console.log('   集群:', match[3]);
  console.log('   数据库:', match[4]);
}

console.log('\n3️⃣  尝试连接 (带详细错误):');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  retryWrites: true,
})
.then(() => {
  console.log('✅ 连接成功！');
  console.log('\n集群信息:');
  console.log('   连接状态:', mongoose.connection.readyState);
  console.log('   数据库:', mongoose.connection.name);
  mongoose.disconnect();
  process.exit(0);
})
.catch(err => {
  console.error('❌ 连接失败');
  console.error('\n错误信息:');
  console.error(err.message);
  console.error('\n错误代码:', err.code);
  console.error('\n可能原因:');
  if (err.message.includes('authentication')) {
    console.error('   • 用户名或密码错误');
    console.error('   • 请检查 MongoDB Atlas 中的用户名和密码是否正确');
  } else if (err.message.includes('ENOTFOUND')) {
    console.error('   • DNS 解析失败');
    console.error('   • 检查互联网连接');
  } else if (err.message.includes('whitelist')) {
    console.error('   • IP 白名单配置不正确');
    console.error('   • 已添加 0.0.0.0/0，但可能还在生效中');
  } else {
    console.error('   • SSL/TLS 证书问题');
    console.error('   • 网络连接问题');
  }
  process.exit(1);
});
