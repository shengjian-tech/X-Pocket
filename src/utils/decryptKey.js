import CryptoJS, { enc, AES } from 'crypto-js'
// 解密私钥
export function getPrivateKey() {
  let account = JSON.parse(localStorage.getItem('currentAccont'))
  // 先解密私钥
  let pri_key = ''
  let strR = account.rString
  if (strR) {
    // 如果有字符串那就先解密AES字符串
    const decryptedString = AES.decrypt(strR, account.address)
    // console.log(decryptedString, '//解密后的字符串')
    let decryptedBytes = []
    for (let i = 0; i < decryptedString.sigBytes; i += 4) {
      let word = decryptedString.words[i >>> 2]
      for (let j = 3; j >= 0; j--) {
        decryptedBytes.push((word >>> (j * 8)) & 0xff)
      }
    }
    // 将字节数组转换为字符串（假设使用UTF-8编码）
    let originalString = new TextDecoder().decode(
      Uint8Array.from(decryptedBytes)
    )
    // console.log(originalString, '//解密后的字符串originalString')
    // 解密私钥(用随机字符串)
    pri_key = AES.decrypt(account.privateKey, originalString).toString(enc.Utf8)
    // console.log(pri_key, '//解密后的pri_key')
  } else {
    // 解密私钥（用address，因为没有设置密码直接用address加密私钥的）
    // pri_key = AES.decrypt(account.privateKey, account.address).toString(
    //   enc.Utf8
    // )
  }
  return new Promise((resolve) => resolve(pri_key))
}
