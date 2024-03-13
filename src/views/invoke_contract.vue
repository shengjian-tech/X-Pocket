<template>
  <div>
    <div class="container" style="width: 300px; margin: auto">
      <div class="header">
        <span class="nav-title">{{ $t('sign.invokeTitle') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="intro-txt">
          {{ $t('sign.invokeIntro') }}
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
          <div class="msg-cont">
            <ul>
              <li>
                <span>{{ $t('sign.type') }}:</span>
                <div class="flex1">{{ message[0].message.tick }}</div>
              </li>
              <li>
                <span>{{ $t('sign.amount') }}:</span>
                <div class="flex1">1</div>
              </li>
              <li>
                <span>From:</span>
                <div class="flex1">{{ message[0].message.from }}</div>
              </li>
              <li>
                <span>To:</span>
                <div class="flex1">{{ message[0].message.to }}</div>
              </li>
            </ul>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ $t('comm.refuse') }}</div>
        <div class="btn" @click="sureInvokeContract">
          {{ $t('comm.confirm') }}
        </div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
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
          @click="sureInvokeContract"
          >签名</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { XchainAddrToEvm, EvmToXchainAddr } from '../assets/js/index'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { sendBaiduInvokeContract, sendExit } from '@/utils/transaction'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'

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
  components: { ConfirmPopup, PromptPopup },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem('acc'))
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem('currentAccont'))
    },
  },
  mounted() {
    console.log(this.$route.query, '--invoke参数--')
    this.getTap()
  },
  methods: {
    getTap() {
      getTab().then((res) => {
        console.log(res)
        this.connect = res
        this.favIconUrl = res.favIconUrl
        this.url = res.url
      })
    },
    plusXing(val) {
      return plusXing(val, 5, 10)
    },
    closeWindow() {
      let resObj = {
        message: 'refused',
      }
      sendBaiduInvokeContract('xuper_invokeContarct', resObj, 'baidu')
      // sendExit()
    },

    async sureInvokeContract() {
      let account = JSON.parse(localStorage.getItem('currentAccont'))

      if (account.type == 'eth') {
        console.log('当前账号是 eth')
      } else {
        console.log('当前是合约页面-xuper')
        let currentNet = JSON.parse(localStorage.getItem('currentNet'))
        let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
        // const node = 'http://192.168.1.121:37301'
        const node = currentNet.node // 'https://xuper.baidu.com/nodeapi'(开放网络)
        const chain = currentNet.chain // 'xuper'
        const acc = currentAccont // 这个账户对象里面必须只包含（address，chain，privateKey，publicKey，type）
        acc.privateKey = JSON.parse(await getPrivateKey()) // 因为私钥加密过所以解密后必须要转成对象
        delete acc.rString // 登陆后缓存账户里面加了加密的随机数字符串，调用合约要删除无用的key
        const contractName = 'fuwen' // 合约名称
        const methodName = 'savekey' // 合约方法
        const params = {
          server: node,
          fee: '400', // 服务费
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
        }

        let nodeStatus = []
        if (node === 'https://xuper.baidu.com/nodeapi') {
          nodeStatus = [
            Endorsement({
              transfer: params,
              makeTransaction: params,
            }),
          ]
        } else {
          nodeStatus = []
        }

        let xsdk = new XuperSDK({
          node,
          chain,
          env: {
            node: {
              disableGRPC: true,
            },
          },
          plugins: nodeStatus,
        })
        let obj = this.message[0].message
        const args = {
          key: obj.transactionId,
        }
        const desc = {
          p: obj.p,
          tick: obj.tick,
          nonce: obj.nonce,
          op: 'transfer',
          amt: 1,
          from: obj.from,
          to: obj.to,
          data: obj.data,
        }
        let desc2 = JSON.stringify(desc)
        // console.log(args, '--args--')
        // console.log(desc, '--desc--')
        // console.log(desc2, '--desc2--')
        try {
          const demo = await xsdk.invokeContarct(
            contractName,
            methodName,
            'wasm',
            args,
            '0',
            acc,
            desc2
          )
          // console.log(demo, '--demo--')
          let txId = xsdk.transactionIdToHex(demo.transaction.txid) // 解析txid
          // console.log(txId, '--txId--')
          // console.log(demo.transaction.desc, '--demo.transaction.desc--')
          const res = await xsdk.postTransaction(demo.transaction, acc)
          console.log(res, '----res----')
          let resObj = {
            txid: txId,
          }

          sendBaiduInvokeContract('xuper_invokeContarct', resObj, 'baidu')
        } catch (err) {
          // err 是空 证明调用成功，不是 就是执行失败。
          if (err) {
            console.log(err, '---invokeContarct err--')
            this.$refs.prompt.showToast(
              this.$t('toastMsg.msg21'),
              'error',
              2500
            )
          }
        }
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
      ul {
        li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 5px;
          span {
            flex-shrink: 0;
            width: 32px;
          }
          .flex1 {
            flex: 1;
            padding-left: 5px;
          }
        }
      }
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
