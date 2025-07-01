// 导入椭圆曲线库
const EC = require('elliptic').ec;
const BN = require('bn.js');
const { createHash } = require('crypto');
const { keccak256 } = require("@ethersproject/keccak256");
const { toUtf8Bytes } = require("@ethersproject/strings");
const { concat } = require("@ethersproject/bytes");

// 使用 P-256 椭圆曲线
const ec = new EC('p256');
// 提供的私钥（D）
const privateKey = "9447330272725306539331652131084098319474694438660775126441356961833359192076";
// 将私钥转为 ECDSA 密钥对象
const bnD = new BN(privateKey);
const privKey = ec.keyFromPrivate(bnD.toArray());

// 你要签名的消息
const messagePrefix = "\x86XuperChain Signed Message:\n"; // 添加前缀
const message = '666';
// const msgBytes = Buffer.from(message, 'utf-8'); // sha256方式处理消息
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
console.log('msgHash:', msgHashBuffer);

// 使用私钥对消息进行签名
const sign = privKey.sign(msgHashBuffer);

const r = Buffer.from(sign.r.toArray('be', 32));
const s = Buffer.from(sign.s.toArray('be', 32));

// 计算恢复参数 v
const recoveryParam = sign.recoveryParam;  // 0 或 1
console.log('- recoveryParam =', recoveryParam);
const v = recoveryParam + 27;  // ECDSA 中 v 通常是 27 或 28

// 合并签名
const signatureStr = Buffer.concat([r, s, Buffer.from([v])]);
console.log('Signature:', signatureStr.toString('hex'));
console.log("Signature Length:", signatureStr.length);  // 应该输出 65

// 返回签名字符串
return signatureStr.toString('hex');







