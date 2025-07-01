<template>
  <div>
    <div class="container" style="width: 300px; margin: auto">
      <div class="header">
        <span class="nav-title">{{ t('sign.title') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="intro-txt">
          {{ t('sign.intro') }}
        </p>
        <div class="current-box">
          <div class="img-circle">
            <img src="../assets/img-eth.png" v-if="currentAccount.type === 'eth'" />
            <img src="../assets/img-x.png" v-if="currentAccount.type === 'xuper'" />
            <img src="../assets/img-solana.png" v-if="currentAccount.type === 'solana'" />
          </div>
          <div class="flex1">
            <span>{{ t('comm.current') }}</span>
            <p>{{ plusXing(currentAccount.address,5,5) }}</p>
          </div>
        </div>
        <div class="msg-box">
          <p>{{ t('comm.msg') }}</p>
          <div class="msg-cont">{{ message[0] }}</div>
          <div class="line"></div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ t('comm.refuse') }}</div>
        <div class="btn" @click="addUrl">{{ t('comm.confirm') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { sendSignHash, sendExit } from '@/utils/transaction'
import { signMessage } from '@/utils/solana'
import { ec as EC } from 'elliptic'
import BN from 'bn.js'
import { ethers } from 'ethers'
import { Bytes, concat } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

export default {
  name: 'SignPage',
  setup() {
    const route = useRoute()
    const { t } = useI18n()

    // 响应式数据
    const favIconUrl = ref('')
    const url = ref('')
    const message = ref(route.query)
    const currentAccount = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })
    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    // 获取当前标签页信息
    const getTap = async () => {
      const res = await getTab()
      favIconUrl.value = res.favIconUrl
      url.value = res.url
    }

    // 关闭窗口
    const closeWindow = () => {
      sendExit()
    }

    // 添加 URL 并签名
    const addUrl = async () => {
      const account = JSON.parse(localStorage.getItem('currentAccont'))
      if (account.type === 'eth') {
        const privateKey = await getPrivateKey()
        const wallet = new ethers.Wallet(privateKey)
        const messageBytes = ethers.utils.toUtf8Bytes(message.value[0])
        const signature = await wallet.signMessage(messageBytes)
        sendSignHash('personal_sign', signature)
      }
      if (account.type === 'xuper') {
        const messagePrefix = "\x86XuperChain Signed Message:\n";
        const privateKey1 = await getPrivateKey()
        const privateKey = JSON.parse(privateKey1)
        const ec = new EC('p256')
        const bnD = new BN(privateKey.D)
        const privKey = ec.keyFromPrivate(bnD.toArray())
        let msg = message.value[0]
        const msgBytes = toUtf8Bytes(msg)

        // 计算消息哈希时加上前缀
        const msgHash = keccak256(concat([
          toUtf8Bytes(messagePrefix),
          toUtf8Bytes(String(msgBytes.length)),
          msgBytes
        ]))

        const msgHashBuffer = Buffer.from(msgHash.slice(2), 'hex'); // 转 Buffer

        // 使用私钥对消息进行签名
        const sign = privKey.sign(msgHashBuffer);

        const r = Buffer.from(sign.r.toArray('be', 32));
        const s = Buffer.from(sign.s.toArray('be', 32));

        // 计算恢复参数 v
        const recoveryParam = sign.recoveryParam;  // 0 或 1
        const v = recoveryParam + 27;  // ECDSA 中 v 通常是 27 或 28

        // 合并签名
        const signatureStr = Buffer.concat([r, s, Buffer.from([v])]);
        const signtext = signatureStr.toString('hex');
        console.log('-signtext=-',signtext);
        sendSignHash('personal_sign', signtext)
      }
      if(account.type === 'solana'){
        const privateKey = await getPrivateKey()
        const signature = signMessage(privateKey, message.value[0])
        sendSignHash('personal_sign', signature)
      }
    }

    // 初始化
    onMounted(() => {
      getTap()
    })

    return {
      favIconUrl,
      url,
      message,
      currentAccount,
      accountAllList,
      plusXing,
      closeWindow,
      addUrl,
      t,
    }
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 25px;
  text-align: left;
  .url-txt {
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-top: 15px;
  }
  .intro-txt {
    font-size: 14px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    margin-top: 10px;
    text-align: center;
  }
  .current-box {
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-top: 30px;
    padding: 0 15px;
    .img-circle {
      width: 32px;
      height: 32px;
      background: #262636;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .flex1 {
      flex: 1;
      overflow: hidden;
      padding-left: 8px;
      text-align: left;
      span {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: #00e5c4;
      }
      p {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 5px;
      }
    }
  }
  .msg-box {
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    height: 165px;
    overflow: hidden;
    padding: 0 15px;
    p {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      margin: 10px 0;
    }
    .msg-cont {
      flex: 1;
      overflow-y: auto;
      word-break: break-all;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      line-height: 14px;
    }
    .line {
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin: 10px 0;
    }
  }
}
.btn-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 38px 25px 38px;
  .btn {
    width: 102px;
    height: 31px;
    background: #414147;
    border-radius: 25px;
    text-align: center;
    line-height: 31px;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
  }
  .btn:last-child {
    background: linear-gradient(270deg, #0078e5 0%, #00e5c4 100%);
  }
}
</style>
