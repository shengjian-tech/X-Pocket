<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ $t('decypt.title') }}</span>
      </div>
      <div class="content">
        <p class="url-txt">{{ url }}</p>
        <p class="intro-txt">
          {{ $t('decypt.intro') }}
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
        <div class="btn" @click="addUrl">{{ $t('comm.confirm') }}</div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>
    </div>

    <div class="connect" style="display: none">
      <div class="connectBox">
        <div class="connectTit">解密信息</div>
        <div>
          <img :src="favIconUrl" />
          <div>{{ url }}</div>
        </div>
        <div class="conten">
          只有在您完全理解内容并信任请求网站的情况下，才能进行信息解密。
          您正在进行解密:
        </div>
        <div class="conten">
          <div class="listType">
            <span style="color: #1e832a">当前</span>
          </div>
          <div class="listAddress">{{ plusXing(currentAccont.address) }}</div>
        </div>
        <div class="conten accList">
          <div>消息：</div>
          <div style="word-break: break-all">{{ message }}</div>
        </div>
      </div>
      <div class="btnBox">
        <el-button class="width110" round @click="closeWindow">拒绝</el-button>
        <el-button
          class="width110 color7657b1"
          type="primary"
          round
          @click="addUrl"
          >解密</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { sendDecryptHash, sendExit } from '@/utils/transaction'
import { getPrivateKey } from '@/utils/decryptKey'
import PromptPopup from '@/components/PromptPopup.vue'
const { ethers } = require('ethers')
const {
  encryptWithPublicKey,
  decryptWithPrivateKey,
  cipher,
} = require('eth-crypto')
export default {
  data() {
    return {
      favIconUrl: '',
      url: '',
      color: ['#744f68', '#788890', '#ebd40a', '#1e832a', '#abb7bc'],
      connect: null,
      activeItem: [],
      message: this.$route.query[0].message,
    }
  },
  components: {
    PromptPopup,
  },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem('acc'))
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem('currentAccont'))
    },
  },
  mounted() {
    this.getTap()
    // console.log(this.accountAllList);
  },
  methods: {
    getTap() {
      getTab().then((res) => {
        console.log(res)
        this.connect = res
        this.favIconUrl = res.favIconUrl
        this.url = res.url
        this.getActiveItem()
      })
    },
    plusXing(val) {
      return plusXing(val, 5, 10)
    },
    closeWindow() {
      sendExit()
    },

    async addUrl() {
      let that = this
      console.log(JSON.parse(localStorage.getItem('currentAccont')))
      let account = JSON.parse(localStorage.getItem('currentAccont'))

      const privateKey = await getPrivateKey()
      // const privateKey = account.privateKey

      if ((account.type = 'eth')) {
        const encryptedData = that.message
        const decryptData = await decryptWithPrivateKey(
          privateKey,
          encryptedData
        )
        sendDecryptHash('decryptCrypto_sign', decryptData)
      } else {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg26'), 'warning', 2500)
      }
    },
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
