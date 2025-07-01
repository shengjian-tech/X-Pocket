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
            <div class="radio-box">
              <div class="comm-radio" @click="choseContractType(0)">
                <img src="../assets/img-checked.png" v-if="chosedConVal === 0" />
                <img src="../assets/img-check.png" v-else />
                evm
              </div>
              <div class="comm-radio" @click="choseContractType(1)">
                <img src="../assets/img-checked.png" v-if="chosedConVal === 1" />
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
                <img src="../assets/img-checked.png" v-if="chosedVal === 0" />
                <img src="../assets/img-check.png" v-else />
                {{ $t('handle.deal') }}
              </div>
              <div class="comm-radio" @click="choseType(1)">
                <img src="../assets/img-checked.png" v-if="chosedVal === 1" />
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { XchainAddrToEvm, EvmToXchainAddr } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import { ethers } from 'ethers'
import PromptPopup from '@/components/PromptPopup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import { i18n } from '@/main';

export default {
  components: { PromptPopup, ConfirmPopup },
  setup() {
    const router = useRouter()
    const dialogVisible = ref(false)
    const doalogContent = ref('')
    const addForm = ref({
      name: '',
      type: 'transaction',
      contractName: '',
      methodName: '',
      formValue: [],
    })
    const netObj = ref({
      xuper: require('../assets/img-x.png'),
      eth: require('../assets/img-eth.png'),
      polygon: require('../assets/img-polygon.png'),
      solana: require('../assets/img-solana.png'),
    })
    const netList = ref(JSON.parse(localStorage.getItem('netList')))
    const chosedVal = ref(0)
    const chosedConVal = ref(0)
    const contractType = ref('evm')
    const currentNet = ref(
      localStorage.getItem('currentNet')
        ? JSON.parse(localStorage.getItem('currentNet'))
        : null
    )
    const prompt = ref(null)
    const confirm = ref(null)

    const cancelHandle = () => {
      router.go(-1)
    }

    const choseContractType = (i) => {
      chosedConVal.value = i
      contractType.value = i === 0 ? 'evm' : 'wasm'
    }

    const choseType = (i) => {
      chosedVal.value = i
      addForm.value.type = i === 0 ? 'transaction' : 'query'
    }

    const submit = (formName) => {
      const netWork = JSON.parse(localStorage.getItem('currentNet'))

      if (!addForm.value.contractName) {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg19'), 'error', 2500)
      }
      if (!addForm.value.methodName) {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg20'), 'error', 2500)
      }

      if (netWork.type === 'xuper') {
        publicMethod(addForm.value)
      } else if (netWork.type === 'eth') {
        etnPublicMethod(addForm.value)
      }
    }

    const publicMethod = async (formName) => {
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const currentAccont = JSON.parse(localStorage.getItem('currentAccont'))

      const contractName = formName.contractName
      const methodName = formName.methodName
      const setType = formName.type

      const node = currentNet.node
      const chain = currentNet.chain
      const acc = { ...currentAccont }
      acc.privateKey = JSON.parse(await getPrivateKey())
      delete acc.rString

      const params = {
        server: node,
        fee: '400',
        endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
        endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
      }

      let xsdk
      if (setType === 'query') {
        xsdk = new XuperSDK({ node, chain })
      } else {
        xsdk = new XuperSDK({
          node,
          chain,
          plugins: [Endorsement(params)],
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
            const txid = xsdk.transactionIdToHex(demo.transaction.txid)
            doalogContent.value = { txid }
            confirm.value.showConfirm()
          } else {
            const demo = await xsdk.invokeSolidityContarct(
              contractName,
              methodName,
              contractType.value,
              args,
              '0',
              acc
            )
            const txid = xsdk.transactionIdToHex(demo.transaction.txid)
            doalogContent.value = { txid }
            confirm.value.showConfirm()
          }
        } catch (err) {
          console.error(err)
          prompt.value.showToast(i18n.global.t('toastMsg.msg21'), 'error', 2500)
        }
      }

      commonFunc(contractName, methodName, formName.formValue)
    }

    const etnPublicMethod = async (formName) => {
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
      const from = Object.fromEntries(
        formName.formValue.map((item) => [item.label, item.value])
      )

      if (formName.methodName === 'getBlance') {
        const address = currentAccont.address
        provider.getBalance(address).then((balance) => {
          const etherString = ethers.utils.formatEther(balance)
          doalogContent.value = `Balance: ${etherString}`
          dialogVisible.value = true
        })
      } else if (formName.methodName === 'addrContract') {
        const { ens_abi } = require('../utils/ENSRegistry.json')
        const ensRegistryAddr = from.ensRegistryAddr
        const ensRegistry = new ethers.Contract(
          ensRegistryAddr,
          ens_abi,
          provider
        )
        const nodeHash = ethers.utils.namehash(from.url)
        const resolverAddr = await ensRegistry.resolver(nodeHash)
        doalogContent.value = `域名解析地址: ${resolverAddr}`
        dialogVisible.value = true
      } else if (
        formName.type === 'transaction' &&
        formName.methodName === 'transfer'
      ) {
        const privateKey = from.privateKey
        const wallet = new ethers.Wallet(privateKey, provider)
        const gasPrice = await provider.getGasPrice()
        const tx = await wallet.sendTransaction({
          gasLimit: 21000,
          gasPrice: gasPrice,
          to: from.toaddress,
          value: ethers.utils.parseUnits(from.value),
        })
        doalogContent.value = `交易哈希: ${tx.hash}`
        dialogVisible.value = true
      }
    }

    const addParams = () => {
      addForm.value.formValue.push({ value: '', label: '' })
    }

    const removeDomain = (item) => {
      const index = addForm.value.formValue.indexOf(item)
      if (index !== -1) {
        addForm.value.formValue.splice(index, 1)
      }
    }

    const goHome = () => {
      router.push('/Home')
    }

    onMounted(() => {
      currentNet.value = localStorage.getItem('currentNet')
        ? JSON.parse(localStorage.getItem('currentNet'))
        : null
    })

    return {
      dialogVisible,
      doalogContent,
      addForm,
      netObj,
      netList,
      chosedVal,
      chosedConVal,
      contractType,
      currentNet,
      prompt,
      confirm,
      cancelHandle,
      choseContractType,
      choseType,
      submit,
      publicMethod,
      etnPublicMethod,
      addParams,
      removeDomain,
      goHome,
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
