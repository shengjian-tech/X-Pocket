<template>
  <div>
    <div class="container" style="width: 300px; margin: auto">
      <div class="header">
        <span class="nav-title">{{ $t('sign.title') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="intro-txt">
          {{ $t('sign.intro') }}
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
          <div class="msg-cont">{{ message[0] }}</div>
          <div class="line"></div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ $t('comm.refuse') }}</div>
        <div class="btn" @click="addUrl">{{ $t('comm.confirm') }}</div>
      </div>

      <!-- <confirm-popup
        ref="confirm"
        @confirm="sure"
        @cancel="handleCancel"
        :title="$t('comm.tips')"
        >{{ $t('sign.trustinfo') }}</confirm-popup
      > -->
    </div>

    <div class="connect" style="display: none">
      <div class="connectBox">
        <div class="connectTit">签名请求</div>
        <div>
          <img :src="favIconUrl" />
          <div>{{ url }}</div>
        </div>
        <div class="conten">
          只有在您完全理解内容并信任请求网站的情况下，才能签署此消息。
          您正在签名:
        </div>
        <div class="conten">
          <div class="listType">
            <span style="color: #1e832a">当前</span>
          </div>
          <div class="listAddress">{{ plusXing(currentAccont.address) }}</div>
        </div>
        <div class="conten accList">
          <div>消息：</div>
          <div>{{ message[0] }}</div>
        </div>
      </div>
      <div class="btnBox">
        <el-button class="width110" round @click="closeWindow">拒绝</el-button>
        <el-button
          class="width110 color7657b1"
          type="primary"
          round
          @click="addUrl"
          >签名</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { sendSignHash, sendBaiduSignHash, sendExit } from '@/utils/transaction'
import { ec as EC } from 'elliptic'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import BN from 'bn.js'

const { ethers } = require('ethers')
export default {
  data() {
    return {
      favIconUrl: '',
      url: '',
      color: ['#744f68', '#788890', '#ebd40a', '#1e832a', '#abb7bc'],
      connect: null,
      activeItem: [],
      message: this.$route.query,
    }
  },
  components: { ConfirmPopup },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem('acc'))
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem('currentAccont'))
    },
  },
  mounted() {
    console.log('sign参数')
    console.log(this.$route.query)
    this.getTap()

    // let isTrust = localStorage.getItem('isTrust')
    // if (!isTrust) {
    //   this.$refs.confirm.showConfirm()
    // }
    // console.log(this.accountAllList);
  },
  methods: {
    getTap() {
      getTab().then((res) => {
        console.log(res)
        this.connect = res
        this.favIconUrl = res.favIconUrl
        this.url = res.url
        // this.getActiveItem()
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
      let account = JSON.parse(localStorage.getItem('currentAccont'))
      if (account.type == 'eth') {
        let privateKey = await getPrivateKey()
        console.log('当前账号是 eth--page')
        console.log(that.message, '---that.message----')
        // const privateKey = account.privateKey // 用你自己的私钥替换
        const wallet = new ethers.Wallet(privateKey)
        //const provider = new ethers.providers.JsonRpcProvider(net); // 使用你自己的 Infura 项目 ID 替换
        const messageBytes = ethers.utils.toUtf8Bytes(that.message[0])
        const signature = await wallet.signMessage(messageBytes)
        sendSignHash('personal_sign', signature)
        // this.$router.push('/Home')
        // window.close()
      } else {
        let privateKey1 = await getPrivateKey()
        console.log('当前账号是 xuper--page')
        console.log(that.message, '---that.message----')
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
        console.log(signtext, '---signtext---')
        // 为了使签名都统一写法
        sendSignHash('personal_sign', signtext)
        // sendBaiduSignHash('xuper_sign', signtext, 'baidu') // 这个是原来写法
      }
    },

    // sure() {publicKey
    //   localStorage.setItem('isTrust', 1)
    // },
    // handleCancel() {
    //   localStorage.removeItem('isTrust')
    // },
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
