const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入明文密码: ', async (password) => {
  const hash = await bcrypt.hash(password, 10); // cost 10
  console.log('bcrypt hash:', hash);
  rl.close();
});
