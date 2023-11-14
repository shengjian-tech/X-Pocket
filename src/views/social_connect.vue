<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ $t('publish.title') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="intro-txt">
          {{ $t('publish.intro') }}
        </p>
        <div class="current-box">
          <div class="img-circle">
            <img
              src="../assets/img-eth.png"
              v-if="currentAccont.type == 'eth'"
            />
            <img src="../assets/img-x.png" v-else />
          </div>
          <div class="flex1">
            <span>{{ $t('comm.current') }}</span>
            <p>{{ plusXing(currentAccont.address) }}</p>
          </div>
        </div>
        <div class="msg-box">
          <p>{{ $t('comm.msg') }}</p>
          <div class="msg-cont">{{ message }}</div>
          <div class="line"></div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ $t('comm.refuse') }}</div>
        <div class="btn" @click="getLogin">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>

    <div class="connect" style="display: none">
      <div class="connectBox">
        <div class="connectTit">发布信息</div>
        <div>
          <img :src="favIconUrl" />
          <div>{{ url }}</div>
        </div>
        <div class="conten">
          只有在您完全理解内容并信任请求网站的情况下，才能进行信息发布。
          您正在进行信息发布:
        </div>
        <div class="conten">
          <div class="listType">
            <span style="color: #1e832a">当前</span>
          </div>
          <div class="listAddress">{{ plusXing(currentAccont.address) }}</div>
        </div>
        <div class="conten accList">
          <div>消息：</div>
          <div>{{ message }}</div>
        </div>
      </div>
      <div class="btnBox">
        <el-button class="width110" round @click="closeWindow">拒绝</el-button>
        <el-button
          class="width110 color7657b1"
          type="primary"
          round
          @click="getLogin"
          >确认</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import Header from '../components/Header'
import PromptPopup from '@/components/PromptPopup.vue'
import { ethers } from 'ethers'
import moment from 'moment'
import { KJUR, KEYUTIL, RSAKey, hextob64 } from 'jsrsasign'
import { sendSocialHash, sendExit } from '@/utils/transaction'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
export default {
  name: 'social',
  data() {
    return {
      state: this.$route.query.state,
      password: '',
      favIconUrl: '',
      url: '',
      color: ['#744f68', '#788890', '#ebd40a', '#1e832a', '#abb7bc'],
      connect: null,
      activeItem: [],
      message: this.$route.query[0].message,
      signatureString: this.$route.query[0].signatureString,
      algorithm: this.$route.query[0].algorithm,
    }
  },
  components: { Header, PromptPopup },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem('acc'))
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem('currentAccont'))
    },
  },
  mounted() {},
  methods: {
    plusXing(val) {
      return plusXing(val, 5, 10)
    },
    closeWindow() {
      sendExit()
    },
    //开放网络
    async getLogin() {
      let that = this
      let account = JSON.parse(localStorage.getItem('currentAccont'))

      if (that.algorithm == 'rsa-sha256') {
        if (localStorage.getItem('privateKeyPem')) {
          const privateKeyPem = localStorage
            .getItem('privateKeyPem')
            .replace(/\\n/g, '\n')
          const privateKey = KEYUTIL.getKey(privateKeyPem)
          const signature_data = that.signWithPrivateKey(
            that.signatureString,
            privateKey
          )
          sendSocialHash('social_sign', signature_data)
        } else {
          this.$refs.prompt.showToast(this.$t('toastMsg.msg25'), 'error', 2500)
          this.$router.push('/setrsa')
        }
      } else if (that.algorithm == 'secp256k1') {
        const privateKey = await getPrivateKey()

        // const privateKey = account.privateKey // 用你自己的私钥替换
        const wallet = new ethers.Wallet(privateKey)
        const messageBytes = ethers.utils.toUtf8Bytes(that.signatureString)
        const signature = await wallet.signMessage(messageBytes)
        sendSocialHash('social_sign', signature)
      }
    },
    signWithPrivateKey(signingString, privateKey) {
      const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' })
      sig.init(privateKey)
      sig.updateString(signingString)
      const signature = sig.sign()
      // 将签名结果进行 Base64 编码
      const signatureBase64 = hextob64(signature)
      return signatureBase64
    },
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
