const EC = require('elliptic').ec;
const BN = require('bn.js');
const { createHash } = require('crypto');
const { keccak256 } = require("@ethersproject/keccak256");
const { toUtf8Bytes } = require("@ethersproject/strings");
const { concat } = require("@ethersproject/bytes");

// 使用 P-256 椭圆曲线
const ec = new EC('p256');

// 你签名后的结果（r, s, v）
const signatureHex = 'a664efd7bfeaabb91eeeecba7381877eba1532e87b7559b347c80e1892b8a8dfc4892477862049c51d6b4f742b58f34fb26306593b45eea7a7c185ecc748aa161b';  // 替换为你的签名

const signature = Buffer.from(signatureHex, 'hex');
const r = signature.slice(0, 32);
const s = signature.slice(32, 64);
const v = signature[64] - 27;  // 根据 v 值恢复参数，通常为 27 或 28
console.log('v:', v);

// 签名时使用的消息（包括前缀）
const messagePrefix = "\x86XuperChain Signed Message:\n"; // 添加前缀
const message = '666';
// const msgBytes = Buffer.from(message, 'utf-8');// sha256方式处理消息
const msgBytes = toUtf8Bytes(message) // keccak256方式处理消息

// sha256
// const msgHash = createHash('sha256')
//   .update(messagePrefix)
//   .update(Buffer.from(String(msgBytes.length)))  // 消息长度
//   .update(msgBytes)  // 原始消息
//   .digest();  // 使用 sha256 计算消息哈希

// keccak256
const msgHash = keccak256(concat([
  toUtf8Bytes(messagePrefix),
  toUtf8Bytes(String(msgBytes.length)),
  msgBytes
]))

const msgHashBuffer = Buffer.from(msgHash.slice(2), 'hex'); // 转 Buffer

// 恢复公钥
const recoveredKey = ec.recoverPubKey(msgHashBuffer, { r, s }, v);
const pubKeyHex = recoveredKey.encode('hex');

// 提取公钥 X, Y
const x = new BN(pubKeyHex.slice(2, 66), 16).toString(10);  // 16 进制转 BigInt
const y = new BN(pubKeyHex.slice(66, 130), 16).toString(10);  // 16 进制转 BigInt

console.log('Recovered X:', x);
console.log('Recovered Y:', y);
