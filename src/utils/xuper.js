// const { keccak256 } = require("@ethersproject/keccak256");
// const { toUtf8Bytes } = require("@ethersproject/strings");
// const { concat } = require("@ethersproject/bytes");
// const { ecrecover, pubToAddress } = require('ethereumjs-util');

// function verifySignature(message, signatureHex) {
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

//   // 恢复公钥
//   const pubKey = ecrecover(msgHash, v, r, s);
//   const recoveredAddress = pubToAddress(pubKey).toString('hex');
  
//   console.log("Recovered public key address: ", recoveredAddress);

//   // 这里你需要提供正确的地址来进行验证
//   const expectedAddress = "正确的地址";  // 这个是你预期的公钥地址
  
//   const isValid = recoveredAddress === expectedAddress;
//   console.log('验签结果:', isValid);
//   return isValid;
// }

// // 示例
// const message = '666';
// const signature = "630a7e37074c1c84c2ded465424ad9ae1bd88bf88f2da47f912423d4b572dbcf59ce1e84134efe8d9f8bfe3ced4284f31a8a059a6beab5626a2e7c80cbd63bc256";  // 由 `getSign()` 生成的 65 字节 hex

// verifySignature(message, signature);


const EC = require('elliptic').ec;
const BN = require('bn.js');
const { createHash } = require('crypto');

// 使用 P-256 椭圆曲线
const ec = new EC('p256');

// 你签名后的结果（r, s, v）
const signatureHex = '01e149299d1dc7ace999e23c2565124423f63e62d95ad83685d7ae654ecaf508b4ca29bdbcecdcb8ba4bec7dd622bc59a38d20d615423288ea3792b91bd98e921c';  // 替换为你的签名

const signature = Buffer.from(signatureHex, 'hex');
const r = signature.slice(0, 32);
const s = signature.slice(32, 64);
const v = signature[64] - 27;  // 根据 v 值恢复参数，通常为 27 或 28

// 签名时使用的消息（包括前缀）
const messagePrefix = "\x86XuperChain Signed Message:\n"; // 添加前缀
const msg = '666';
const msgBytes = Buffer.from(msg, 'utf-8');

// 计算消息哈希时加上前缀
const msgHash = createHash('sha256')
  .update(messagePrefix)
  .update(Buffer.from(String(msgBytes.length)))  // 消息长度
  .update(msgBytes)  // 原始消息
  .digest();  // 使用 sha256 计算消息哈希

// 恢复公钥
const recoveredKey = ec.recoverPubKey(msgHash, { r, s }, v);
const pubKeyHex = recoveredKey.encode('hex');

console.log('Recovered Public Key:', pubKeyHex);

// 提取公钥 X, Y
const x = new BN(pubKeyHex.slice(2, 66), 16).toString(10);  // 16 进制转 BigInt
const y = new BN(pubKeyHex.slice(66, 130), 16).toString(10);  // 16 进制转 BigInt

console.log('Recovered X:', x);
console.log('Recovered Y:', y);
