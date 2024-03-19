<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('transfer.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('transfer.name1') }}</span>
            </div>
            <textarea
              v-model="form.address"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('transfer.name2') }}</span>
            </div>
            <input
              type="number"
              v-model="form.value"
              :placeholder="$t('comm.placeholder')"
            />
          </div>
        </div>
        <div v-if="balanceMoney" class="balanceMoneytext">
          {{ $t('transfer.current') }}:{{ balanceMoney }}
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="confirmHandle">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup
        ref="confirm"
        :title="$t('transfer.tips')"
        @confirm="confirmBtn"
      >
        <ul class="confirm-ul">
          <li>{{ $t('transfer.name3') }}{{ dialogContent.to }}</li>
          <li>{{ $t('transfer.name4') }}{{ dialogContent.value }}</li>
          <li>{{ $t('transfer.name5') }}{{ dialogContent.gas }}</li>
        </ul>
      </confirm-popup>
    </div>

    <div
      class="setTrans setLeft"
      v-loading.fullscreen.lock="fullscreenLoading"
      style="display: none"
    >
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>首页/转移
      </div>
      <div class="form transferForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <span class="inputlabel">接收方地址</span>
            <el-input
              v-model="form.address"
              placeholder="请输入接收方地址"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <span class="inputlabel">转移金额</span>
            <el-input
              v-model="form.value"
              placeholder="请输入转移金额"
            ></el-input>
          </el-form-item>
          <div v-if="balanceMoney" class="balanceMoneytext">
            当前余额:{{ balanceMoney }}
          </div>

          <el-form-item class="addNetBtnFath">
            <el-button
              class="addNetBtn"
              type="primary"
              round
              @click="addNetList()"
              >确认</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        title="确认转账"
        :visible.sync="dialogVisible"
        width="50%"
        class="transferDio"
      >
        <div>
          <span class="disotatle">转入方地址：</span>
          {{ dialogContent.to }}
        </div>
        <div>
          <span class="disotatle">转移金额：</span>{{ dialogContent.value }}
        </div>
        <div>
          <span class="disotatle">消耗Gas：</span>{{ dialogContent.gas }}
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'
import { getPrivateKey } from '@/utils/decryptKey'
import { ethers } from 'ethers'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { sendHash } from '@/utils/transaction'
export default {
  name: 'Transfer',
  data() {
    return {
      form: {
        address: '',
        value: '',
      },
      balanceMoney: '',
      dialogVisible: false,
      netList: JSON.parse(localStorage.getItem('netList')),
      dialogContent: {},
      fullscreenLoading: false,
    }
  },
  components: { Header, ConfirmPopup, PromptPopup },
  mounted() {
    this.ethBalance()
    if (this.$route.query) {
      this.form.address = this.$route.query[0]?.to || ''
      this.form.value = this.$route.query[0]?.value || ''
    }
  },
  methods: {
    goHome() {
      this.$router.push('/Home')
    },

    confirmHandle() {
      if (!this.form.address) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg22'),
          'warning',
          2500
        )
      }
      if (!this.form.value) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg23'),
          'warning',
          2500
        )
      }
      if (this.balanceMoney == 0) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg24'),
          'warning',
          2500
        )
      }
      this.$refs.confirm.showConfirm()
    },

    //eth查询余额
    async ethBalance() {
      console.log()
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      if (currentNet.type == 'eth') {
        let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
        let heightBlock = await provider.getBlockNumber()
        console.log(heightBlock)
        let address = currentAccont.address
        provider.getBalance(address).then((balance) => {
          // 余额是 BigNumber (in wei); 格式化为 ether 字符串
          let etherString = ethers.utils.formatEther(balance)
          console.log('Balance: ' + etherString)
          this.balanceMoney = etherString
        })
      }
    },
    async addNetList() {
      console.log(this.form)
      let that = this

      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))

      if (currentNet.type == 'xuper') {
        const node = 'https://xuper.baidu.com/nodeapi'
        const chain = 'xuper'
        const params = {
          server: 'https://xuper.baidu.com/nodeapi', // ip, port
          fee: '400', // fee
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
        }
        const xsdk = new XuperSDK({
          node,
          chain,
          plugins: [
            Endorsement({
              transfer: params,
              makeTransaction: params,
            }),
          ],
        })
        // const xuperPassword = localStorage.getItem('xuperPassword')
        // const xuperKey = localStorage.getItem('xuperKey')
        // const acc = xsdk.import(xuperPassword, xuperKey, true)
        // console.log(acc)
        const tx = await xsdk.transfer({
          to: this.form.address,
          amount: this.form.value,
          fee: '0.1',
        })
        // console.log(tx)
        await xsdk.postTransaction(tx)
        sendHash('eth_sendTransaction', tx.hash)
        this.$notify({
          title: '交易成功',
          dangerouslyUseHTMLString: true,
          message: `交易哈希: ${tx.hash}`,
          type: 'success',
          duration: 0,
        })
        // this.$message.error("请切换网络使用");
        // return false;
      } else if (currentAccont.type == 'eth') {
        //地址转账
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
        that.fullscreenLoading = true

        let privateKey = await getPrivateKey()
        // let privateKey = currentAccont.privateKey

        let wallet = new ethers.Wallet(privateKey, provider)
        let gasPrice = await provider.getGasPrice()

        console.log(ethers.utils.formatUnits(gasPrice))
        let object = {
          to: that.form.address,
          value: that.form.value,
          gas: ethers.utils.formatUnits(gasPrice),
        }
        that.dialogContent = object
        that.fullscreenLoading = false
        that.dialogVisible = true
      }
    },

    async confirmBtn() {
      let that = this
      that.fullscreenLoading = true
      that.dialogVisible = false
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node)

      let privateKey = await getPrivateKey()
      // let privateKey = currentAccont.privateKey

      let wallet = new ethers.Wallet(privateKey, provider)
      let gasPrice = await provider.getGasPrice()
      // sendHash("eth_sendTransaction",'aaaaa')
      let tx = await wallet.sendTransaction({
        gasLimit: 21000,
        gasPrice: gasPrice,
        to: that.form.address,
        value: ethers.utils.parseUnits(that.form.value),
      })
      that.fullscreenLoading = false
      sendHash('eth_sendTransaction', tx.hash)
      this.$notify({
        title: '交易成功',
        dangerouslyUseHTMLString: true,
        message: `交易哈希: ${tx.hash}`,
        type: 'success',
        duration: 0,
      })
    },
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
