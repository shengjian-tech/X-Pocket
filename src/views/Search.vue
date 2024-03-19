<template>
  <div>
    <div class="container">
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('handle.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('handle.currentNet') }}</span>
            </div>
            <div class="current-net">
              <img :src="netObj[currentNet.type]" class="logo-img" />
              <div class="flex1">{{ currentNet.netName }}</div>
            </div>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('handle.name') }}</span>
            </div>
            <!-- <textarea
              v-model="addForm.name"
              :placeholder="$t('comm.placeholder')"
            ></textarea> -->
            <div class="radio-box">
              <div class="comm-radio" @click="choseContractType(0)">
                <img src="../assets/img-checked.png" v-if="chosedConVal == 0" />
                <img src="../assets/img-check.png" v-else />
                evm
              </div>
              <div class="comm-radio" @click="choseContractType(1)">
                <img src="../assets/img-checked.png" v-if="chosedConVal == 1" />
                <img src="../assets/img-check.png" v-else />
                wasm
              </div>
            </div>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('handle.type') }}</span>
            </div>
            <div class="radio-box">
              <div class="comm-radio" @click="choseType(0)">
                <img src="../assets/img-checked.png" v-if="chosedVal == 0" />
                <img src="../assets/img-check.png" v-else />
                {{ $t('handle.deal') }}
              </div>
              <div class="comm-radio" @click="choseType(1)">
                <img src="../assets/img-checked.png" v-if="chosedVal == 1" />
                <img src="../assets/img-check.png" v-else />
                {{ $t('handle.query') }}
              </div>
            </div>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('handle.name2') }}</span>
            </div>
            <textarea
              v-model="addForm.contractName"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('handle.name3') }}</span>
            </div>
            <textarea
              v-model="addForm.methodName"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <div class="add-arg">
          <div class="add-title" @click="addParams">
            <img src="../assets/img-add.png" />{{ $t('handle.name4') }}
          </div>
          <ul v-if="addForm.formValue.length > 0">
            <li v-for="(item, index) in addForm.formValue" :key="index">
              <div>
                <p>{{ $t('handle.arg') }}</p>
                <input
                  v-model="item.label"
                  :placeholder="$t('comm.placeholder')"
                  type="text"
                />
              </div>
              <div>
                <p>{{ $t('handle.argVal') }}</p>
                <input
                  v-model="item.value"
                  :placeholder="$t('comm.placeholder')"
                  type="text"
                />
              </div>
              <img
                class="close-img"
                src="../assets/img-close.png"
                @click="removeDomain(item)"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="submit('addForm')">
          {{ $t('comm.execute') }}
        </div>
        <div class="btn" @click="cancelHandle">{{ $t('comm.cancel') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup ref="confirm" :title="$t('comm.tips')" @confirm="sure">
        <ul class="handle-ul">
          <li>
            <span>Hash:</span>
            <div class="flex1">{{ doalogContent.txid || '' }}</div>
          </li>
        </ul>
      </confirm-popup>
    </div>

    <div class="setSearch" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>首页/操作
      </div>
      <div class="form formsearch">
        <el-form
          style="text-align: left"
          label-position="top"
          :model="addForm"
          ref="addForm"
          label-width="100px"
        >
          <el-form-item label="操作名称" prop="name">
            <el-input
              v-model="addForm.name"
              placeholder="请输入您要添加的操作名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="操作类型" prop="type">
            <el-radio-group v-model="addForm.type">
              <el-radio label="transaction">交易</el-radio>
              <el-radio label="query">查询</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合约名" prop="contractName">
            <el-input
              v-model="addForm.contractName"
              placeholder="请输入合约名"
            ></el-input>
          </el-form-item>
          <el-form-item label="方法名" prop="methodName">
            <el-input
              v-model="addForm.methodName"
              placeholder="请输入方法名"
            ></el-input>
          </el-form-item>
          <div>
            <a class="addParams" @click="addParams">添加操作参数</a>

            <el-row
              :gutter="20"
              v-for="(item, index) in addForm.formValue"
              :key="index"
            >
              <el-col :span="10">
                <el-form-item label="参数">
                  <el-input
                    v-model="item.label"
                    placeholder="请输入您要添加的参数"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="参数值">
                  <el-input
                    v-model="item.value"
                    placeholder="请输入您要添加的参数值"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <i
                  @click.prevent="removeDomain(item)"
                  style="font-size: 24px; margin-top: 35%; cursor: pointer"
                  class="el-icon-remove-outline"
                ></i>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible = false">取 消</el-button>
          <el-button
            size="small"
            class="submitSearch"
            type="primary"
            @click="submit('addForm')"
            >确 定</el-button
          >
        </span>
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
import PromptPopup from '@/components/PromptPopup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { XchainAddrToEvm, EvmToXchainAddr } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { ethers } from 'ethers'
export default {
  name: 'Netlist',
  data() {
    return {
      dialogVisible: false,
      doalogContent: '',
      form: {
        netName: '',
        type: '',
        chain: '',
        node: '',
        chainid: '',
        symbol: '',
        bwUrl: '',
      },
      addForm: {
        name: '',
        type: 'transaction',
        contractName: '',
        methodName: '',
        formValue: [],
      },
      netObj: {
        xuper: require('../assets/img-x.png'),
        eth: require('../assets/img-eth.png'),
        polygon: require('../assets/img-polygon.png'),
      },
      netList: JSON.parse(localStorage.getItem('netList')),
      chosedVal: 0,
      chosedConVal: 0,
      contractType: 'evm',
      currentNet: null,
    }
  },
  components: { PromptPopup, ConfirmPopup },
  mounted() {
    this.currentNet = localStorage.getItem('currentNet')
      ? JSON.parse(localStorage.getItem('currentNet'))
      : null
  },
  methods: {
    cancelHandle() {
      this.$router.go(-1)
    },
    choseContractType(i) {
      this.chosedConVal = i
      if (this.chosedConVal == 0) {
        this.contractType = 'evm'
      } else {
        this.contractType = 'wasm'
      }
    },
    choseType(i) {
      this.chosedVal = i
      if (this.chosedVal == 0) {
        this.addForm.type = 'transaction'
      } else {
        this.addForm.type = 'query'
      }
    },
    //新增操作
    submit(formName) {
      let netWork = JSON.parse(localStorage.getItem('currentNet')) //判断当前网络类型

      if (!this.addForm.contractName) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg19'),
          'error',
          2500
        )
      }
      if (!this.addForm.methodName) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg20'),
          'error',
          2500
        )
      }

      if (netWork.type == 'xuper') {
        this.publicMethod(this.addForm)
      } else if (netWork.type == 'eth') {
        this.etnPublicMethod(this.addForm)
      }

      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     console.log(valid)
      //     console.log(this.addForm)
      //     if (netWork.type == 'xuper') {
      //       this.publicMethod(this.addForm)
      //     } else if (netWork.type == 'eth') {
      //       this.etnPublicMethod(this.addForm)
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    //通用方法
    async publicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))

      console.log(formName)

      let contractName = formName.contractName
      let methodName = formName.methodName
      let setType = formName.type

      const node = currentNet.node
      const chain = currentNet.chain
      const acc = currentAccont
      acc.privateKey = JSON.parse(await getPrivateKey())
      delete acc.rString

      const params = {
        server: node, // ip, port
        fee: '400', // fee
        endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
        endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
      }
      let xsdk
      if (setType == 'query') {
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
      const commonFunc = async (contractName, methodName, args) => {
        try {
          const objects = Object.fromEntries(
            args.map((item) => [item.label, item.value])
          )
          args = objects

          if (args.from) {
            args.from = XchainAddrToEvm(args.from)
          }
          if (args.to) {
            args.to = XchainAddrToEvm(args.to)
          }

          if (args.txId) {
            const demo = await xsdk.queryTransaction(
              Buffer.from(args.txId, 'hex').toString('base64')
            )
            let txid = xsdk.transactionIdToHex(demo.transaction.txid)
            let obj = {
              txid,
            }
            this.doalogContent = obj
            this.$refs.confirm.showConfirm()
          } else {
            console.log(this.contractType, '----contractType----')
            const demo = await xsdk.invokeSolidityContarct(
              contractName,
              methodName,
              this.contractType,
              args,
              '0',
              acc
            )
            let txid = xsdk.transactionIdToHex(demo.transaction.txid)
            let obj = {
              txid,
            }
            this.doalogContent = obj
            this.$refs.confirm.showConfirm()
          }
        } catch (err) {
          if (err) {
            console.log(err)
            this.$refs.prompt.showToast(
              this.$t('toastMsg.msg21'),
              'error',
              2500
            )
          } else {
            this.$refs.prompt.showToast(
              this.$t('toastMsg.msg31'),
              'success',
              2500
            )
          }
        }
      }
      if (JSON.stringify(this.ruleForm) == '{}') {
        this.ruleForm = { '': '1' }
      }
      commonFunc(contractName, methodName, formName.formValue)
    },

    //
    async etnPublicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      console.log(formName)
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
      let from = formName.formValue
      const objects = Object.fromEntries(
        from.map((item) => [item.label, item.value])
      )
      from = objects
      console.log(from)
      if (formName.methodName == 'getBlance') {
        let address = currentAccont.address
        provider.getBalance(address).then((balance) => {
          // 余额是 BigNumber (in wei); 格式化为 ether 字符串
          let etherString = ethers.utils.formatEther(balance)
          console.log('Balance: ' + etherString)
          this.doalogContent = `Balance: ${etherString}`
          this.dialogVisible = true
        })
      } else if (formName.methodName == 'addrContract') {
        //地址解析
        const { ens_abi } = require('../utils/ENSRegistry.json')
        const ensRegistryAddr = from.ensRegistryAddr
        const ensRegistry = new ethers.Contract(
          ensRegistryAddr,
          ens_abi,
          provider
        )
        const nodeHash = ethers.utils.namehash(from.url)
        const resolverAddr = await ensRegistry.resolver(nodeHash)
        this.doalogContent = `域名解析地址: ${resolverAddr}`
        this.dialogVisible = true
      } else if (
        formName.type == 'transaction' &&
        formName.methodName == 'transfer'
      ) {
        //地址转账
        let privateKey = from.privateKey
        let wallet = new ethers.Wallet(privateKey, provider)
        let gasPrice = await provider.getGasPrice()
        let tx = await wallet.sendTransaction({
          gasLimit: 21000,
          gasPrice: gasPrice,
          to: from.toaddress,
          value: ethers.utils.parseUnits(from.value),
        })
        this.doalogContent = `交易哈希: ${tx.hash}`
        this.dialogVisible = true
      }
    },

    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: '', label: '' })
    },
    removeDomain(item) {
      var index = this.addForm.formValue.indexOf(item)
      if (index !== -1) {
        this.addForm.formValue.splice(index, 1)
      }
    },
    goHome() {
      this.$router.push('/Home')
    },
    addNetList() {
      console.log(this.form)
      if (!this.form.type) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg14'), 'warning', 2500)
      } else if (
        this.form.type == 'xuper' &&
        (this.form.netName == '' ||
          this.form.chain == '' ||
          this.form.node == '')
      ) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg14'), 'warning', 2500)
      } else if (
        this.form.type == 'eth' &&
        (this.form.netName == '' ||
          this.form.node == '' ||
          this.form.chainid == '' ||
          this.form.symbol == '')
      ) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg14'), 'warning', 2500)
      } else {
        //操作
        let netList = this.netList
        netList.push(this.form)
        localStorage.setItem('netList', JSON.stringify(netList))
        this.$router.push('/Netlist')
        window.location.reload()
      }
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
      .current-net {
        display: flex;
        align-items: center;
        .logo-img {
          width: 26px;
          height: 26px;
        }
        .flex1 {
          flex: 1;
          font-size: 12px;
          color: white;
          padding-left: 10px;
        }
      }
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
  .add-arg {
    .add-title {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      img {
        width: 12px;
        height: 12px;
        position: relative;
        top: 1px;
        margin-right: 8px;
      }
    }
    ul {
      margin-top: 14px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        div {
          p {
            font-size: 12px;
            font-family: Arial-Regular, Arial;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.5);
          }
          input {
            width: 80px;
            color: white;
            font-size: 12px;
            font-family: Arial-Bold, Arial;
            font-weight: bold;
            margin-top: 3px;
            height: 20px;
          }
        }
        .close-img {
          width: 17px;
          height: 17px;
          cursor: pointer;
        }
      }
    }
  }
}
.btn-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 25px;
  padding: 0 15px;
  .btn {
    width: 100px;
    height: 30px;
    background: linear-gradient(270deg, #0078e5 0%, #00e5c4 100%);
    border-radius: 30px;
    line-height: 30px;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
  }
  .btn:last-child {
    background: #414146;
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
.handle-ul {
  li {
    display: flex;
    align-items: flex-start;
    span {
      font-weight: bold;
    }
    .flex1 {
      flex: 1;
      padding-left: 5px;
      word-break: break-all;
      text-align: left;
    }
  }
}
</style>
