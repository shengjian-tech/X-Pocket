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
            <p>{{ plusXing(currentAccont.address,5,5) }}</p>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { sendBaiduInvokeContract, sendExit } from '@/utils/transaction'
import PromptPopup from '@/components/PromptPopup.vue'
import { i18n } from '@/main';

export default {
  components: { PromptPopup },
  setup() {
    const route = useRoute()
    const favIconUrl = ref('')
    const url = ref('')
    const message = ref(route.query)
    const prompt = ref(null)

    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    const currentAccont = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })

    onMounted(() => {
      console.log(route.query, '--invoke参数--')
      getTap()
    })

    const getTap = async () => {
      const res = await getTab()
      console.log(res)
      favIconUrl.value = res.favIconUrl
      url.value = res.url
    }

    const closeWindow = () => {
      const resObj = {
        message: 'refused',
      }
      sendBaiduInvokeContract('xuper_invokeContarct', resObj, 'baidu')
    }

    const sureInvokeContract = async () => {
      const account = JSON.parse(localStorage.getItem('currentAccont'))

      if (account.type === 'eth') {
        console.log('当前账号是 eth')
      } else {
        console.log('当前是合约页面-xuper')
        const currentNet = JSON.parse(localStorage.getItem('currentNet'))
        const currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
        const node = currentNet.node
        const chain = currentNet.chain
        const acc = { ...currentAccont }
        acc.privateKey = JSON.parse(await getPrivateKey())
        delete acc.rString

        const contractName = 'fuwen'
        const methodName = 'savekey'
        const params = {
          server: node,
          fee: '400',
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
        }

        const nodeStatus = node === 'https://xuper.baidu.com/nodeapi' ? [Endorsement(params)] : []

        const xsdk = new XuperSDK({
          node,
          chain,
          env: {
            node: {
              disableGRPC: true,
            },
          },
          plugins: nodeStatus,
        })

        const obj = message.value[0].message
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
        const desc2 = JSON.stringify(desc)

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
          const txId = xsdk.transactionIdToHex(demo.transaction.txid)
          const res = await xsdk.postTransaction(demo.transaction, acc)
          console.log(res, '----res----')
          const resObj = {
            txid: txId,
          }
          sendBaiduInvokeContract('xuper_invokeContarct', resObj, 'baidu')
        } catch (err) {
          if (err) {
            console.log(err, '---invokeContarct err--')
            prompt.value.showToast(i18n.global.t('toastMsg.msg21'), 'error', 2500)
          }
        }
      }
    }

    return {
      favIconUrl,
      url,
      message,
      prompt,
      accountAllList,
      currentAccont,
      getTap,
      plusXing,
      closeWindow,
      sureInvokeContract,
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
