import { ec as EC } from 'elliptic'
import { BN } from 'bn.js'

const ec = new EC('p256')

// 验签函数，从签名字符串中恢复出公钥并进行验签操作
export function verifySignature(signatureStr) {
  //从字符串转成16进制数组
  const signature = Buffer.from(signatureStr, 'hex')
  //console.log('signature len :',signature.byteLength);
  const rBuffer = signature.slice(0, 32)
  const sBuffer = signature.slice(32, 64)
  const publicKeyX = signature.slice(64, 96)
  const publicKeyY = signature.slice(96, 128)
  const data = signature.slice(128)
  const dataStr = Buffer.from(data, 'hex').toString('utf-8')
  console.log('dataStr:', dataStr)
  const signRecovered = { r: new BN(rBuffer), s: new BN(sBuffer) }

  // Convert the public key (X and Y) back to point coordinates
  const publicKeyParams = {
    x: publicKeyX.toString('hex'),
    y: publicKeyY.toString('hex'),
  }

  // Use the reconstructed public key to create a public key object
  const publicKeyPair = ec.keyFromPublic(publicKeyParams, 'hex')
  return new Promise((resolve) =>
    resolve(publicKeyPair.verify(data, signRecovered))
  )
  // return publicKeyPair.verify(data, signRecovered)
  //return publicKey.verify(data, signRecovered);
}
