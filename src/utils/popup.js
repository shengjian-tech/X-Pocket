import { setStorage } from '@/utils/setStorage'
import {
  transaction,
  signTranstion,
  encryptCrypto,
  decryptCrypto,
  social,
  invokeContract,
} from '@/utils/transaction'
import { signMessage } from './solana'
import router from '@/router'
import { getPrivateKey } from './decryptKey'
import { ec as EC } from 'elliptic'

const { ethers } = require('ethers')
let PopupToBackgroundPort = chrome.runtime.connect({
  name: 'POCKET-popup-background',
})
let _handlers = {}

export function sendAccont(method, data, type) {
  console.log('popupp-method-data-type=',method, data, type)
  chrome.runtime.sendMessage({
    method,
    data,
    type,
  })
  if(method == 'getAccounts_info') return
  if (type == 'xuper') {
    setStorage('baiduAddress', data)
  } else {
    setStorage('address', data)
  }
}

export function setOpen(val) {
  chrome.runtime.sendMessage({
    method:'changePopupOpen',
    data:val,
  })
}
export async function getTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
      },
      function (tabs) {
        console.log(tabs)
        // const host = tab.url?.match(/^https?:\/\/[^\/]+/)?.[0];
        resolve(tabs[0])
      }
    )
  })
}

// 接受bg传来的不弹窗签名消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // console.log(message, '---签名的message-----')
  // 处理接收到的消息
  console.log('Received custom message:', message)
  if (message.type == 'personal_sign') {
    signConnect(message.data.params)
  }
})

function getAccounts (type) {
  let connectList = JSON.parse(localStorage.getItem('connectList')) || []
  let banlance = localStorage.getItem('banlance') || 0 // 余额
  let version = process.env.VUE_APP_POCKET_INT_VERSION // 钱包版本号
  let infoObj = {
    version,
    banlance,
  }

  getTab().then((res) => {
    let ifFast = connectList.find((item) => {
      return item.url == res.url
    })
    if (JSON.stringify(_handlers) != '{}') {
      if (ifFast) {
        ifFast.accountList.forEach((item) => {
          console.log('--popup-getLocalAccont=', item)
          if (item.type == 'xuper') {
            if (type == 'requestAccounts') {
              sendAccont('eth_requestAccounts', [item.address], 'baidu')
            }
            if (type == 'getAccounts_info') {
              sendAccont('getAccounts_info', infoObj, 'baidu')
            }
          }
          if(item.type=='eth') {
            if (type == 'eth_requestAccounts') {
              sendAccont('eth_requestAccounts', [item.address],'eth')
            }
            if (type == 'getAccounts_info') {
              sendAccont('getAccounts_info', infoObj,'eth')
            }
            if(type == 'eth_requestAccounts_publicKey') {
              sendAccont('eth_requestAccounts_publicKey', [item.publicKey],'eth')
            }
          }
          if(item.type == 'solana') {
            if (type == 'requestAccounts') {
              sendAccont('eth_requestAccounts', [item.address],'solana')
            }
            if (type == 'getAccounts_info') {
              sendAccont('getAccounts_info', infoObj, 'solana')
            }
          }
        })
      } else {
        router.push('/connect')
      }
    }
  })

}

export async function createdMessage() {
  localStorage.setItem('isTrust', 1)
  chrome.runtime.sendMessage({
    method:'postPopup',
    data:'',
  })
  PopupToBackgroundPort.onMessage.addListener((message) => {
    console.log('popup-createdMessage=',message)
    if (message.request) {
      getAccounts(message.request.method)
      routerPush()
      switch (message.request.method) {
        case 'eth_requestAccounts':
          postMessage(message.request.method)
          break
        case 'eth_requestAccounts_publicKey':
          postMessage(message.request.method)
        case 'requestAccounts':
          postMessage(message.request.method)
          break
        case 'eth_sendTransaction':
          transaction(message)
          postMessage(message.request.method)
          break
        case 'personal_sign':
          signTranstion(message)
          postMessage(message.request.method)
          break
        case 'encryptCrypto_sign':
          encryptCrypto(message)
          postMessage(message.request.method)
          break
        case 'decryptCrypto_sign':
          decryptCrypto(message)
          postMessage(message.request.method)
          break
        case 'social_sign':
          social(message)
          postMessage(message.request.method)
          break
        case 'invoke_contract':
          invokeContract(message)
          postMessage(message.request.method)
          break
        case 'getAccounts_info':
          postMessage(message.request.method)
          break

        default:
          break
      }
    }
  })
}
export async function routerPush() {
  let connectList = JSON.parse(localStorage.getItem('connectList'))
  let acc = JSON.parse(localStorage.getItem('currentAccont'))
  if (JSON.stringify(_handlers) != '{}') {
    if (acc) {
      if (_handlers?.request?.method == 'personal_sign') {
        router.push('/signconnect')
      } else if (_handlers?.request?.method == 'encryptCrypto_sign') {
        router.push('/encrypt')
      } else if (_handlers?.request?.method == 'decryptCrypto_sign') {
        router.push('/decrypt')
      } else if (_handlers?.request?.method == 'social_sign') {
        router.push('/social')
      } else if (_handlers?.request?.method == 'invoke_contract') {
        router.push('/invokecontract')
      } else {
        if (!connectList || connectList.length == 0) {
          router.push('/connect')
        } else {
          getTab().then((res) => {
            let ifFast = connectList.find((item) => {
              return item.url == res.url
            })
            if (!ifFast) {
              router.push('/connect')
            }
          })
        }
      }
    } else {
      router.push('/Login')
    }
  }
}
export function postMessage(method) {
  return new Promise((resolve, reject) => {
    _handlers[method] = {
      reject,
      resolve,
    }
  })
}

// 签名
async function signConnect(msg) {
  let account = JSON.parse(localStorage.getItem('currentAccont'))
  console.log(account)
  if (account.type == 'eth') {
    let privateKey = await getPrivateKey()
    console.log('当前账号是 eth')
    // console.log(privateKey, '当前私钥')
    const wallet = new ethers.Wallet(privateKey)
    console.log(wallet, 'wallet')
    const messageBytes = ethers.utils.toUtf8Bytes(msg[0])
    const signature = await wallet.signMessage(messageBytes)
    // sendSignHash('personal_sign', signature)
    console.log(signature, '**************signature*************')
    // background.getPopupTransferHash('personal_sign', signature)
    chrome.runtime.sendMessage({
      method:'personal_sign',
      data:signature,
    })
    // background.getPopupExit('personal_sign', signature)
    // this.$router.push('/Home')
    // window.close()
  }
  if (account.type == 'xuper') {
    let privateKey1 = await getPrivateKey()
    console.log('当前账号是 xuper')
    // console.log(privateKey1, '当前私钥')
    let privateKey = JSON.parse(privateKey1)
    const ec = new EC('p256')
    // const privKey = ec.keyFromPrivate(privateKey.D, 'hex')  //原来写法不对
    // https://github.com/xuperchain/xuper-sdk-js/blob/master/src/transaction.ts#L309   签名信息
    const bnD = new BN(privateKey.D)
    const privKey = ec.keyFromPrivate(bnD.toArray())
    const utf8Data = Buffer.from(that.message[0], 'utf-8')
    const sign = privKey.sign(utf8Data)
    const r = Buffer.from(sign.r.toArray('be', 32))
    const s = Buffer.from(sign.s.toArray('be', 32))
    const x = Buffer.from(privKey.getPublic().getX().toArray('be', 32))
    const y = Buffer.from(privKey.getPublic().getY().toArray('be', 32))
    const signatureStr = Buffer.concat([r, s, x, y, utf8Data])
    const signtext = signatureStr.toString('hex') // 签名字符串
    // sendBaiduSignHash('xuper_sign', signtext, 'baidu')
    console.log(signtext, '**************signtext*************')
    // background.getPopupBaiduData('xuper_sign', signtext, 'baidu') // 这个是原来写法
    //background.getPopupTransferHash('personal_sign', signtext) //这个是和签名弹窗里面的发送签名写法统一（新的）
    chrome.runtime.sendMessage({
      method:'personal_sign',
      data:signtext,
    })
  }
  if (account.type == 'solana') {
    console.log('当前账号是 solana')
    let privateKey = await getPrivateKey()
    const signature = signMessage(privateKey, message.value[0])
    chrome.runtime.sendMessage({
      method:'personal_sign',
      data:signature,
    })
  }
}

