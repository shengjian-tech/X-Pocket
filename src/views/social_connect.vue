<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ t('publish.title') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="intro-txt">
          {{ t('publish.intro') }}
        </p>
        <div class="current-box">
          <div class="img-circle">
            <img
              src="../assets/img-eth.png"
              v-if="currentAccount.type === 'eth'"
            />
            <img src="../assets/img-x.png" v-else />
          </div>
          <div class="flex1">
            <span>{{ t('comm.current') }}</span>
            <p>{{ plusXing(currentAccount.address,5,5) }}</p>
          </div>
        </div>
        <div class="msg-box">
          <p>{{ t('comm.msg') }}</p>
          <div class="msg-cont">{{ message }}</div>
          <div class="line"></div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ t('comm.refuse') }}</div>
        <div class="btn" @click="getLogin">{{ t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { KJUR, KEYUTIL, hextob64 } from 'jsrsasign'
import { sendSocialHash, sendExit } from '@/utils/transaction'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import PromptPopup from '@/components/PromptPopup.vue'

export default {
  name: 'SocialPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()

    // 响应式数据
    const favIconUrl = ref('')
    const url = ref('')
    const message = ref(route.query[0]?.message || '')
    const signatureString = ref(route.query[0]?.signatureString || '')
    const algorithm = ref(route.query[0]?.algorithm || '')
    const prompt = ref(null)

    // 计算属性
    const currentAccount = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })
    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    // 工具函数：加星号显示地址
    const plusXing = (val) => {
      return plusXing(val, 5, 10)
    }

    // 关闭窗口
    const closeWindow = () => {
      sendExit()
    }

    // 获取登录信息并签名
    const getLogin = async () => {
      const account = JSON.parse(localStorage.getItem('currentAccont'))

      if (algorithm.value === 'rsa-sha256') {
        const privateKeyPem = localStorage.getItem('privateKeyPem')
        if (privateKeyPem) {
          const privateKey = KEYUTIL.getKey(privateKeyPem.replace(/\\n/g, '\n'))
          const signatureData = signWithPrivateKey(signatureString.value, privateKey)
          sendSocialHash('social_sign', signatureData)
        } else {
          prompt.value.showToast(t('toastMsg.msg25'), 'error', 2500)
          router.push('/setrsa')
        }
      } else if (algorithm.value === 'secp256k1') {
        const privateKey = await getPrivateKey()
        const wallet = new ethers.Wallet(privateKey)
        const messageBytes = ethers.utils.toUtf8Bytes(signatureString.value)
        const signature = await wallet.signMessage(messageBytes)
        sendSocialHash('social_sign', signature)
      }
    }

    // 使用私钥签名
    const signWithPrivateKey = (signingString, privateKey) => {
      const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' })
      sig.init(privateKey)
      sig.updateString(signingString)
      const signature = sig.sign()
      return hextob64(signature)
    }

    return {
      favIconUrl,
      url,
      message,
      signatureString,
      algorithm,
      currentAccount,
      accountAllList,
      plusXing,
      closeWindow,
      getLogin,
      prompt,
      t,
    }
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 25px;
  text-align: left;
  .link-http {
    text-align: center;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 10px;
    margin-bottom: 32px;
    word-break: break-all;
  }
  .url-txt {
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    line-height: 14px;
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
