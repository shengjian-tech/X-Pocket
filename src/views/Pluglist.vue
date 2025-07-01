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
          <div class="btn" @click="goAdd">{{ $t('comm.confirm') }}</div>
        </div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup ref="confirm" :title="$t('plug.tips')">
        <div style="max-height: 260px; overflow-y: auto">
          <pre class="preStyle">{{ doalogContent }}</pre>
        </div>
      </confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { getPrivateKey } from '@/utils/decryptKey'
import { ethers } from 'ethers'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'

export default {
  components: { ConfirmPopup, PromptPopup },
  setup() {
    const router = useRouter()
    const form = ref({})
    const netList = ref(JSON.parse(localStorage.getItem('netList')))
    const netType = ref('')
    const pluginsList = ref([])
    const tabsSetList = ref([])
    const index = ref(router.currentRoute.value.query.index)
    const setName = ref('')
    const formData = ref([])
    const doalogContent = ref('')
    const prompt = ref(null)
    const confirm = ref(null)

    const findKey = (data, field) => {
      let finding = ''
      for (const key in data) {
        if (key === field) {
          finding = data[key]
        }
        if (finding) {
          return finding
        }
      }
      return null
    }

    const goHome = () => {
      router.push('/Home')
    }

    const getFromData = () => {
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      const addList = currentPlug.addList[index.value]
      setName.value = addList.name
      formData.value = addList.formValue

      const obj = Object.fromEntries(
        addList.formValue.map((item) => [item.value, ''])
      )
      form.value = obj
    }

    const goAdd = () => {
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))

      if (currentNet.type === 'xuper' && currentPlug.type === 'xuper') {
        publicMethod('form')
      } else if (currentNet.type === 'eth' && currentPlug.type === 'eth') {
        publicETHers('form')
      } else {
        prompt.value.showToast('请切换到对应网络', 'warning', 2500)
      }
    }

    const publicETHers = async (formName) => {
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const addList = currentPlug.addList[index.value]
      const valid2 = Object.keys(form.value).every(
        (key) => key === 'from' || key === 'to' || form.value[key]
      )

      if (valid2) {
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node)

        if (addList.methodName === 'getBlance') {
          const address = form.value.address
          provider.getBalance(address).then((balance) => {
            const etherString = ethers.utils.formatEther(balance)
            doalogContent.value = `Balance: ${etherString}`
            confirm.value.showConfirm()
          })
        } else if (addList.methodName === 'addrContract') {
          const { ens_abi } = require('../utils/ENSRegistry.json')
          const ensRegistryAddr = form.value.ensRegistryAddr
          const ensRegistry = new ethers.Contract(
            ensRegistryAddr,
            ens_abi,
            provider
          )
          const nodeHash = ethers.utils.namehash(form.value.url)
          const resolverAddr = await ensRegistry.resolver(nodeHash)
          doalogContent.value = `域名解析地址: ${resolverAddr}`
          confirm.value.showConfirm()
        } else if (addList.methodName === 'transfer') {
          const privateKey = await getPrivateKey()
          const wallet = new ethers.Wallet(privateKey, provider)
          const gasPrice = await provider.getGasPrice()
          const tx = await wallet.sendTransaction({
            gasLimit: 21000,
            gasPrice: gasPrice,
            to: form.value.toaddress,
            value: ethers.utils.parseUnits(form.value.value),
          })
          doalogContent.value = `交易哈希: ${tx.hash}`
          confirm.value.showConfirm()
        }
      } else {
        prompt.value.showToast('请填写完整相关信息', 'warning', 2500)
      }
    }

    const publicMethod = async (formName) => {
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      const addList = currentPlug.addList[index.value]
      const valid2 = Object.keys(form.value).every(
        (key) => key === 'from' || key === 'to' || form.value[key]
      )

      if (valid2) {
        const node = currentNet.node
        const chain = currentNet.chain
        const acc = { ...currentAccont }
        acc.privateKey = await getPrivateKey()

        const params = {
          server: node,
          fee: '400',
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
        }

        let xsdk
        if (addList.type === 'query') {
          xsdk = new XuperSDK({ node, chain })
        } else {
          xsdk = new XuperSDK({
            node,
            chain,
            plugins: [Endorsement(params)],
          })
        }

        const commonFunc = async (type, contractName, methodName, args) => {
          try {
            if (addList.txType === 0) {
              if (addList.txName === 'queryTransaction') {
                const demo = await xsdk.queryTransaction(
                  Buffer.from(args[formData.value[0].value], 'hex').toString(
                    'base64'
                  )
                )
                const txReqJson = JSON.parse(
                  Buffer.from(
                    demo.tx.contract_requests[1].args.input,
                    'base64'
                  ).toString()
                )
                doalogContent.value = findKey(demo, addList.search)
                confirm.value.showConfirm()
              }
            } else if (addList.txType === 1) {
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
              doalogContent.value = demo
              confirm.value.showConfirm()
            }
          } catch (err) {
            console.error(err)
            prompt.value.showToast('执行失败', 'error', 2500)
          }
        }

        commonFunc(addList.type, addList.contractName, addList.methodName, form.value)
      } else {
        prompt.value.showToast('请填写完整相关信息', 'warning', 2500)
      }
    }

    onMounted(() => {
      getFromData()
    })

    return {
      form,
      netList,
      netType,
      pluginsList,
      tabsSetList,
      index,
      setName,
      formData,
      doalogContent,
      prompt,
      confirm,
      findKey,
      goHome,
      getFromData,
      goAdd,
      publicETHers,
      publicMethod,
    }
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
