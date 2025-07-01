<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ t('transfer.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ t('transfer.name1') }}</span>
            </div>
            <textarea
              v-model="reciverAddress"
              :placeholder="t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ t('transfer.name2') }}</span>
            </div>
            <input
              type="number"
              v-model="transferAmount"
              :placeholder="t('comm.placeholder')"
            />
          </div>
        </div>
        <div class="balanceMoneytext">
          {{ t('transfer.current') }}: {{ balanceMoney }}
        </div>
      </div>
      <div class="btn-wrapper" v-loading="loading" element-loading-background="transparent">
        <div class="btn" @click="confirmHandle">{{ t('comm.confirm') }}</div>
      </div>
      <!-- 引入的组件 -->
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup
        ref="confirm"
        :title="t('transfer.tips')"
        @confirm="confirmBtn"
      >
        <ul class="confirm-ul">
          <li>{{ t('transfer.name3') }}{{ plusXing(reciverAddress, 5, 5) }}</li>
          <li>{{ t('transfer.name4') }}{{ transferAmount }}</li>
        </ul>
      </confirm-popup>
      <confirm-popup
        ref="confirm2"
        :title="t('transfer.tips')"
      >
        <p>{{ t("nftDetails.name2") }}:{{ txId }}</p>
      </confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { sendHash } from '@/utils/transaction'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { transferSol,getSolanaBalance } from '@/utils/solana'
import { solanaNetwork } from '@/utils/network'
import PromptPopup from '@/components/PromptPopup.vue' // 引入 PromptPopup 组件
import ConfirmPopup from '@/components/ConfirmPopup.vue' // 引入 ConfirmPopup 组件

export default {
  name: 'TransferPage',
  components: {
    PromptPopup, // 注册 PromptPopup 组件
    ConfirmPopup, // 注册 ConfirmPopup 组件
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const reciverAddress = ref('')
    const transferAmount = ref('')
    const balanceMoney = ref('0.00')
    const prompt = ref(null)
    const confirm = ref(null)
    const confirm2 = ref(null)
    const isExit = ref(false)
    const txId = ref('')
    const loading = ref(false)

    // 初始化
    onMounted(() => {
      getCurrentBalance()
      const query = route.query
      if(!query.params) return
      const params = JSON.parse(query.params)
      if (params && params.length > 0) {
        isExit.value = true
        reciverAddress.value = params[0].to || ''
        transferAmount.value = params[0].value || ''
      } else {
        isExit.value = false
      }
    })

    // 返回首页
    const goHome = () => {
      router.push('/Home')
    }

    // 确认转账
    const confirmHandle = () => {
      if (!reciverAddress.value) {
        return prompt.value.showToast(t('toastMsg.msg22'), 'warning', 2500)
      }
      if (!transferAmount.value) {
        return prompt.value.showToast(t('toastMsg.msg23'), 'warning', 2500)
      }
      if (balanceMoney.value == 0) {
        return prompt.value.showToast(t('toastMsg.msg24'), 'warning', 2500)
      }
      confirm.value.showConfirm()
    }

    // 查询余额
    const getCurrentBalance = async () => {
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const currentAccount = JSON.parse(localStorage.getItem('currentAccont'))

      if (currentNet.type === 'eth') {
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
        const balance = await provider.getBalance(currentAccount.address)
        balanceMoney.value = ethers.utils.formatEther(balance)
      } else if (currentNet.type === 'xuper') {
        const xsdk = await initXuperSDK()
        const balance = await xsdk.getBalance(currentAccount.address)
        balanceMoney.value = (balance.bcs[0].balance / 100000).toFixed(3) || 0
      } else if (currentAccount.type === 'solana') {
        const solanaInfo = await getSolanaBalance(currentAccount.address)
        if (solanaInfo && solanaInfo.success) {
          balanceMoney.value = solanaInfo.balance
        } else {
          balanceMoney.value = 0
        }
      }
    }

    // 初始化 XuperSDK
    const initXuperSDK = async () => {
      const node = 'https://xuper.baidu.com/nodeapi'
      const chain = 'xuper'
      const params = {
        server: 'https://xuper.baidu.com/nodeapi',
        fee: '400',
        endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
        endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
      }
      return new XuperSDK({
        node,
        chain,
        plugins: [Endorsement({ transfer: params, makeTransaction: params })],
      })
    }

    // 确认转账按钮
    const confirmBtn = async () => {
      loading.value = true
      const currentAccount = JSON.parse(localStorage.getItem('currentAccont'))
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))

      if (currentNet.type === 'xuper') {
        const xsdk = await initXuperSDK()
        const tx = await xsdk.transfer({
          to: reciverAddress.value,
          amount: transferAmount.value,
          fee: '0.1',
        })
        await xsdk.postTransaction(tx)
        txId.value = tx.hash
        sendHash('eth_sendTransaction', tx.hash)
        notifySuccess(tx.hash)
        loading.value = false
      } else if (currentAccount.type === 'eth') {
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
        const privateKey = await getPrivateKey()
        const wallet = new ethers.Wallet(privateKey, provider)
        const gasPrice = await provider.getGasPrice()
        const tx = await wallet.sendTransaction({
          gasLimit: 21000,
          gasPrice,
          to: reciverAddress.value,
          value: ethers.utils.parseUnits(transferAmount.value, 'ether'),
        })
        txId.value = tx.hash
        sendHash('eth_sendTransaction', tx.hash)
        notifySuccess(tx.hash)
        loading.value = false
      } else if (currentAccount.type === 'solana') {
        const privateKey = await getPrivateKey()
        const netWork = solanaNetwork
        transferSol(privateKey, reciverAddress.value, transferAmount.value, netWork).then((tx) => {
          console.log('-solana-tx=', tx)
          txId.value = tx
          if(isExit.value){
            sendHash('eth_sendTransaction', tx)
          } else {
            notifySuccess()
          }
          loading.value = false
        }).catch((err) => {
          txId.value = err
          notifySuccess()
          loading.value = false
        })
      }
    }

    // 通知成功
    const notifySuccess = () => {
      confirm2.value.showConfirm()
    }

    return {
      reciverAddress,
      transferAmount,
      balanceMoney,
      prompt,
      confirm,
      confirm2,
      goHome,
      confirmHandle,
      confirmBtn,
      isExit,
      t,
      loading,
      txId,
      plusXing,
    }
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 38px 25px;
  text-align: left;
  .pwd-set {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 8px;
    overflow: hidden;
    padding: 0 15px;
    .set-box {
      padding-bottom: 10px;
    }
    .pwd-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      span {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        position: relative;
        padding-left: 8px;
      }
      span::after {
        content: '*';
        position: absolute;
        font-size: 12px;
        color: #ff0000;
        left: 0;
        top: 3px;
      }
    }
    textarea {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      outline: none;
      margin-top: 8px;
    }
    input {
      height: 45px;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      width: 100%;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }
    input::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .balanceMoneytext {
    padding: 14px 15px;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: #ffffff;
  }
}
.btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 38px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 38px;
  .btn {
    width: 255px;
    height: 45px;
    line-height: 45px;
    font-size: 15px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    border-radius: 30px;
  }
}
.confirm-ul {
  text-align: left;
  li {
    padding: 8px 0;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
  }
  li:nth-child(2) {
    font-family: Arial-Bold, Arial;
    font-weight: bold;
  }
}
</style>
