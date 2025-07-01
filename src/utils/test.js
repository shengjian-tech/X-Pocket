// const EC = require('elliptic').ec;
// const BN = require('bn.js');
// const { keccak256 } = require("@ethersproject/keccak256");
// const { toUtf8Bytes } = require("@ethersproject/strings");
// const { concat } = require("@ethersproject/bytes");

// const ec = new EC('p256')

// function verifySignature(message, signatureHex, publicKey) {
//   const messagePrefix = "\x86XuperChain Signed Message:\n";
//   // 计算消息哈希
//   const msgBytes = toUtf8Bytes(message);
//   const msgHash = keccak256(concat([
//     toUtf8Bytes(messagePrefix),
//     toUtf8Bytes(String(msgBytes.length)),
//     msgBytes
//   ]));

//   // 解析签名
//   const signature = Buffer.from(signatureHex, 'hex');
//   const r = signature.slice(0, 32);
//   const s = signature.slice(32, 64);
//   let v = signature[64];

//   // 通过公钥验签
//   const key = ec.keyFromPublic({
//     x: new BN(publicKey.X).toString(16), // 确保是 hex
//     y: new BN(publicKey.Y).toString(16)
//   }, 'hex');

//   const isValid = key.verify(msgHash, { r, s });
//   console.log('验签结果:', isValid);
//   return isValid;
// }

// // 示例
// const message = '666';
// const signature = "630a7e37074c1c84c2ded465424ad9ae1bd88bf88f2da47f912423d4b572dbcf59ce1e84134efe8d9f8bfe3ced4284f31a8a059a6beab5626a2e7c80cbd63bc256";  // 由 `getSign()` 生成的 65 字节 hex
// const publicKey = {
//   "X": "100538936017931908509443644273898653242069754011208415636340325157858840267359",
//   "Y": "83811150946900949208673078544258016266196632323760915368755719935821734510797"
// };

// verifySignature(message, signature, publicKey);

const EC = require('elliptic').ec;
const { keccak256 } = require('@ethersproject/keccak256');
const { toUtf8Bytes } = require('@ethersproject/strings');
const { concat } = require('@ethersproject/bytes');
const BN = require('bn.js');

// 使用P-256曲线
const ec = new EC('p256');

// 获取公钥（假设你已经有了公钥）
const publicKey = {
  "X": "100538936017931908509443644273898653242069754011208415636340325157858840267359",
  "Y": "83811150946900949208673078544258016266196632323760915368755719935821734510797"
};
// 签名字符串
const signatureStr = '630a7e37074c1c84c2ded465424ad9ae1bd88bf88f2da47f912423d4b572dbcf59ce1e84134efe8d9f8bfe3ced4284f31a8a059a6beab5626a2e7c80cbd63bc256';

// 准备消息
let msg = '666'; // 假设你传入的消息
const msgBytes = toUtf8Bytes(msg);

// 消息哈希
const msgHash = keccak256(concat([
  toUtf8Bytes("\x86XuperChain Signed Message:\n"),  // 使用XuperChain的前缀
  toUtf8Bytes(String(msgBytes.length)),
  msgBytes
]));

// 将签名字符串转换为 Buffer
const signature = Buffer.from(signatureStr, 'hex');
const rBuffer = signature.slice(0, 32);
const sBuffer = signature.slice(32, 64);

// 恢复签名对象
const signRecovered = {
  r: new BN(rBuffer),
  s: new BN(sBuffer)
};

// 使用公钥验证签名
const publicKeyParams = {
  x: new BN(publicKey.X).toString(16), // 确保是以十六进制传递
  y: new BN(publicKey.Y).toString(16)
};

const publicKeyPair = ec.keyFromPublic(publicKeyParams, 'hex');

// 验证签名
const isValid = publicKeyPair.verify(msgHash, signRecovered);

console.log('验签结果:', isValid); // 如果是有效签名则为 true，否则为 false




