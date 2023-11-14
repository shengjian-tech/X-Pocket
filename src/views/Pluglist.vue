<template>
  <div>
    <div class="container">
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ setName }}</span>
      </div>
      <div class="content">
        <div
          class="pwd-set"
          v-for="(item, index) in formData"
          :label="item.label"
          :key="index"
        >
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ item.label }}</span>
            </div>
            <input
              v-model="form[item.value]"
              :placeholder="$t('plug.name1') + item.label"
            />
          </div>
        </div>
        <div class="btn-wrapper">
          <div class="btn" @click="goAdd()">{{ $t('comm.confirm') }}</div>
        </div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup ref="confirm" :title="$t('plug.tips')">
        <div style="max-height: 260px; overflow-y: auto">
          <pre class="preStyle">{{ doalogContent }}</pre>
        </div>
      </confirm-popup>
    </div>

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>{{ setName }}
      </div>
      <div class="form plugForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item
            v-for="(item, index) in formData"
            :label="item.label"
            :key="index"
          >
            <el-input
              v-model="form[item.value]"
              :placeholder="$t('plug.name1') + item.label"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="addNetBtnlist"
              type="primary"
              round
              @click="goAdd()"
              >确认</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-dialog title="详细" :visible.sync="dialogVisible" width="30%">
        <pre class="preStyle">{{ doalogContent }}</pre>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { XchainAddrToEvm, EvmToXchainAddr } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { ethers } from 'ethers'
import { async } from 'q'
export default {
  name: 'Netlist',
  data() {
    return {
      form: {},
      netList: JSON.parse(localStorage.getItem('netList')),
      netType: '',
      pluginsList: [],
      tabsSetList: [],
      index: this.$route.query.index,
      setName: '',
      formData: [],
      currentMethod: '', //当前操作的方法集合
      dialogVisible: false,
      doalogContent: '',
    }
  },
  components: { Header, ConfirmPopup, PromptPopup },
  mounted() {
    console.log(this.index)
    this.getFromData()
  },
  methods: {
    //取值
    findKey(data, field) {
      let finding = ''
      let that = this
      for (const key in data) {
        if (key === field) {
          finding = data[key]
        }
        // if (typeof data[key] === "object") {
        //   finding = that.findKey(data[key], field);
        // }else{

        // }
        if (finding) {
          return finding
        }
      }
      return null
    },
    goHome() {
      this.$router.push('/Home')
    },
    onSubmit() {
      console.log('submit!')
    },
    getFromData() {
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      let that = this
      console.log(currentPlug)
      let addList = currentPlug.addList
      addList[this.index]
      this.setName = addList[this.index].name
      this.formData = addList[this.index].formValue
      // console.log(that.formData, '***formData***')

      const obj = Object.fromEntries(
        addList[this.index].formValue.map((item) => [item.value, ''])
      )
      that.form = obj
      // console.log(that.form, '***form***')
    },
    goAdd() {
      console.log(this.form)
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      if (currentNet.type == 'xuper' && currentPlug.type == 'xuper') {
        //开放网络
        this.publicMethod('form')
      } else if (currentNet.type == 'eth' && currentPlug.type == 'eth') {
        //以太通用方法
        this.publicETHers('form')
      } else {
        this.$refs.prompt.showToast('请切换到对应网络', 'warning', 2500)
      }
    },
    //以太坊通用方法
    async publicETHers(formName) {
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      let addList = currentPlug.addList[this.index]
      let that = this
      let valid2 = true
      for (let key in this.form) {
        if (key != 'from' || key != 'to') {
          if (!this.form[key]) {
            valid2 = false
          }
        }
      }

      if (valid2) {
        // console.log(addList, '*addList*')
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
        if (addList.methodName == 'getBlance') {
          let address = that.form.address
          provider.getBalance(address).then((balance) => {
            // 余额是 BigNumber (in wei); 格式化为 ether 字符串
            let etherString = ethers.utils.formatEther(balance)
            console.log('Balance: ' + etherString)
            this.doalogContent = `Balance: ${etherString}`
            // this.dialogVisible = true
            this.$refs.confirm.showConfirm()
          })
        } else if (addList.methodName == 'addrContract') {
          //地址解析
          const { ens_abi } = require('../utils/ENSRegistry.json')
          const ensRegistryAddr = that.form.ensRegistryAddr
          const ensRegistry = new ethers.Contract(
            ensRegistryAddr,
            ens_abi,
            provider
          )
          const nodeHash = ethers.utils.namehash(that.form.url)
          const resolverAddr = await ensRegistry.resolver(nodeHash)
          this.doalogContent = `域名解析地址: ${resolverAddr}`
          // this.dialogVisible = true
          this.$refs.confirm.showConfirm()
        } else if (addList.methodName == 'transfer') {
          //地址转账
          let privateKey = await getPrivateKey()
          // let privateKey = currentAccont.privateKey
          let wallet = new ethers.Wallet(privateKey, provider)
          let gasPrice = await provider.getGasPrice()
          let tx = await wallet.sendTransaction({
            gasLimit: 21000,
            gasPrice: gasPrice,
            to: that.form.toaddress,
            value: ethers.utils.parseUnits(that.form.value),
          })
          this.doalogContent = `交易哈希: ${tx.hash}`
          // this.dialogVisible = true
          this.$refs.confirm.showConfirm()
        }
      } else {
        this.$refs.prompt.showToast('请填写完整相关信息', 'warning', 2500)
      }

      // this.$refs[formName].validate(async (valid) => {
      //   console.log(valid, '****valid****')

      // })
    },

    //通用方法
    async publicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      let addList = currentPlug.addList[this.index]
      let valid2 = true

      for (let key in this.form) {
        if (key != 'from' || key != 'to') {
          if (!this.form[key]) {
            valid2 = false
          }
        }
      }
      // console.log(valid2, '**valid2**')
      if (valid2) {
        const node = currentNet.node
        const chain = currentNet.chain
        const acc = currentAccont
        acc.privateKey = await getPrivateKey()

        const params = {
          server: node, // ip, port
          fee: '400', // fee
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
        }
        let xsdk
        if (addList.type == 'query') {
          //查询操作
          xsdk = new XuperSDK({ node, chain })
        } else {
          xsdk = new XuperSDK({
            node,
            chain,
            plugins: [
              Endorsement({
                transfer: params,
                makeTransaction: params,
              }),
            ],
          })
        }
        const commonFunc = async (type, contractName, methodName, args) => {
          try {
            if (addList.txType == 0) {
              //api方法，无需调用合约
              if (addList.txName && addList.txName == 'queryTransaction') {
                //查询交易
                const demo = await xsdk.queryTransaction(
                  Buffer.from(
                    this.form[this.formData[0].value],
                    'hex'
                  ).toString('base64')
                )
                var txReqJson = JSON.parse(
                  Buffer.from(
                    demo.tx.contract_requests[1].args.input,
                    'base64'
                  ).toString()
                )
                console.log(addList.search)
                console.log(this.findKey(demo, addList.search))
                this.doalogContent = this.findKey(demo, addList.search)
                // this.dialogVisible = true
                this.$refs.confirm.showConfirm()
                // this.$alert(txReqJson, "详细内容", {
                //   confirmButtonText: "确定",
                // });
              }
            } else if (addList.txType == 1) {
              //需要调用到合约
              console.log(args)
              if (args.from) {
                args.from = XchainAddrToEvm(args.from)
              }
              if (args.to) {
                args.to = XchainAddrToEvm(args.to)
              }
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                'evm',
                args,
                '0',
                acc
              )
              this.doalogContent = demo
              // this.dialogVisible = true
              this.$refs.confirm.showConfirm()
            }
          } catch (err) {
            if (err) {
              console.log(err)
              this.$refs.prompt.showToast('执行失败', 'error', 2500)
            } else {
              this.$refs.prompt.showToast('执行成功', 'success', 2500)
            }
          }
        }
        if (JSON.stringify(this.ruleForm) == '{}') {
          this.ruleForm = { '': '1' }
        }
        commonFunc(
          addList.type,
          addList.contractName,
          addList.methodName,
          this.form
        )
      } else {
        this.$refs.prompt.showToast('请填写完整相关信息', 'warning', 2500)
        return false
      }

      // this.$refs[formName].validate((valid) => {
      //   console.log(valid, '****valid****')

      // })
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 23px 25px;
}
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
      color: #ffffff;
      position: relative;
    }
    // span::after {
    //   content: '*';
    //   position: absolute;
    //   font-size: 12px;
    //   color: #ff0000;
    //   left: 0;
    //   top: 3px;
    // }
  }
  .radio-box {
    display: flex;
    align-items: center;
    .comm-radio {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      margin-right: 40px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
    }
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
.btn-wrapper {
  margin: 50px 0;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  .btn {
    width: 225px;
    height: 45px;
    line-height: 45px;
    font-size: 15px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    border-radius: 30px;
  }
}
</style>
