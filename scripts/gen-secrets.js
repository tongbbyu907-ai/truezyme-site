// 사용법: node scripts/gen-secrets.js 내가정할비번
// 이 스크립트는 .env.local에 들어갈 ADMIN_PASSWORD_HASH와 SESSION_SECRET 값을 생성합니다.

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const password = process.argv[2];
if (!password) {
  console.log("");
  console.log("사용법: node scripts/gen-secrets.js <비밀번호>");
  console.log("예시:   node scripts/gen-secrets.js mySafe1234!");
  console.log("");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const secret = crypto.randomBytes(48).toString("hex");

console.log("");
console.log("✅ 생성 완료. 아래 두 줄을 .env.local에 붙여넣으세요:");
console.log("");
console.log("ADMIN_PASSWORD_HASH=" + hash);
console.log("SESSION_SECRET=" + secret);
console.log("");
