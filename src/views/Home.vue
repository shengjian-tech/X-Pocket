<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="content">
        <home-header @transfer="getAccound"></home-header>
        <div class="title">{{ $t('home.title') }}</div>
        <div class="key-txt">
          {{ addressInfo }}
          <img
            src="../assets/img-copy.png"
            class="copycont"
            :data-clipboard-text="address"
            @click="copy"
          />
        </div>
        <div class="balance-box">
          <span>{{ $t('home.balance') }}：&nbsp;</span>
          <div>{{ balanceMoney }}</div>
        </div>
        <div class="tab-box">
          <div class="tab-list" @click="goSearchFun()">
            <div class="list-circle">
              <img src="../assets/img-cx.png" />
            </div>
            <div class="tab-name">{{ $t('home.menu1') }}</div>
          </div>
          <div class="tab-list" @click="goTransFun()">
            <div class="list-circle">
              <img src="../assets/img-zy.png" />
            </div>
            <div class="tab-name">{{ $t('home.menu2') }}</div>
          </div>
        </div>
        <div class="switch-tab">
          <div
            class="tab-comm"
            :class="currentTab == 0 ? 'btn' : ''"
            @click="tabChose(0)"
          >
            NFTS
          </div>
          <div
            class="tab-comm"
            :class="currentTab == 1 ? 'btn' : ''"
            @click="tabChose(1)"
          >
            Tokens
          </div>
        </div>
        <div class="tab-box2" v-if="currentTab == 0">
          <div
            class="tab-li"
            :class="currentTab2 == 0 ? 'active' : ''"
            @click="tabChose2(0)"
          >
            <img src="../assets/img-nfts-in.png" v-if="currentTab2 == 0" />
            <img src="../assets/img-nfts.png" v-else />
            NFTS
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 1 ? 'active' : ''"
            @click="tabChose2(1)"
          >
            <img src="../assets/img-bqcz-in.png" v-if="currentTab2 == 1" />
            <img src="../assets/img-bqcz.png" v-else />
            {{ $t('home.tab1') }}
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 2 ? 'active' : ''"
            @click="tabChose2(2)"
          >
            <img src="../assets/img-yxdj-in.png" v-if="currentTab2 == 2" />
            <img src="../assets/img-yxdj.png" v-else />
            {{ $t('home.tab2') }}
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 3 ? 'active' : ''"
            @click="tabChose2(3)"
          >
            <img src="../assets/img-qklym-in.png" v-if="currentTab2 == 3" />
            <img src="../assets/img-qklym.png" v-else />
            {{ $t('home.tab3') }}
          </div>
        </div>
        <div class="nfts-cont" v-if="currentTab == 0">
          <template v-if="currentTab2 == 0">
            <ul v-if="nfts.length > 0">
              <li
                v-for="(items, index) in nfts"
                :key="index"
                @click="goNftDetail(items)"
              >
                <div class="chain-circle">
                  <img :src="items.image_uri" />
                </div>
                <div class="flex1">
                  <p class="text-line1">{{ items.name }}</p>
                </div>
              </li>
            </ul>
            <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
          </template>
          <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
        </div>
        <div class="tokens-cont" v-else>
          <template v-if="tokens.length > 0">
            <div class="tokens-title">
              <span>Tokens</span>
              <span>{{ $t('home.balance') }}</span>
            </div>
            <div
              class="select"
              style="margin-top: 0"
              v-for="(items, index) in tokens"
              :key="index"
            >
              <div class="comm-logo">
                <img src="../assets/headerlogo.png" />
              </div>
              <div class="flex1">{{ items.name }}-{{ items.netName }}</div>
              <span>{{ items.balance }}</span>
            </div>
          </template>
          <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
        </div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>

      <!-- 插件弹窗 -->
      <div class="plug-box" v-if="drawer">
        <div class="plug-count">
          <img src="../assets/img-bg.png" class="bg-img" />
          <img
            src="../assets/img-close.png"
            class="img-close"
            @click="drawer = false"
          />
          <ul>
            <li v-for="(item, index) in pluginsList" :key="index">
              <div class="img-circle">
                <img :src="item[3].logo" />
              </div>
              <div class="flex1">{{ item[1].name }}</div>
              <div
                class="btn disabled"
                v-if="item[4].state && item[4].state == 1"
              >
                Installed
              </div>
              <div class="btn" @click="installFile(index)" v-else>Install</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="version-num">
        {{ $t('set.version') }} X-Pocket v{{ version }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { plusXing } from '../assets/js/index'
import { getSolanaBalance } from '@/utils/solana'
import Clipboard from 'clipboard'
import { ethers } from 'ethers'
import axios from 'axios'
import HomeHeader from '@/components/HomeHeader.vue'
import PromptPopup from '@/components/PromptPopup.vue'
import { i18n } from '@/main';

export default {
  components: { HomeHeader, PromptPopup },
  setup() {
    const router = useRouter()
    const currentTab = ref(0)
    const currentTab2 = ref(0)
    const addressInfo = ref('')
    const address = ref(JSON.parse(localStorage.getItem('currentAccont')).address)
    const balanceMoney = ref('0.00')
    const drawer = ref(false)
    const nfts = ref([])
    const tokens = ref([])
    const version = ref(process.env.VUE_APP_POCKET_VERSION)
    const prompt = ref(null)

    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    const currentAccont = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })

    onMounted(() => {
      addressInfo.value = plusXing(currentAccont.value.address, 5, 5)
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      
      if (currentNet && currentNet.type === 'xuper') {
        balance()
      } else if (currentNet && currentNet.type === 'eth') {
        ethBalance()
      }
      else if (currentNet && currentNet.type ==='solana') {
        solanaBalance()
      }
      getTokensList()
      gettablist()
    })

    const tabChose = (i) => {
      currentTab.value = i
    }

    const tabChose2 = (i) => {
      currentTab2.value = i
      if (currentTab2.value === 0) {
        gettablist()
      }
    }

    const goSearchFun = () => {
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      if (currentNet && currentNet.type === 'eth') {
        router.push({ path: '/Search' })
      } else {
        prompt.value.showToast(i18n.global.t('toastMsg.msg26'), 'warning', 2500)
      }
    }

    const goTransFun = () => {
      router.push({ path: '/Transfer' })
    }

    const getAccound = (msg, net) => {
      localStorage.setItem('currentAccont', JSON.stringify(msg))
      addressInfo.value = plusXing(msg.address, 5, 5)
      if (net) {
        localStorage.setItem('currentNet', JSON.stringify(net))
        if (net.type === 'xuper') {
          balance()
        } else if (net.type === 'eth') {
          ethBalance()
        } else if (net.type ==='solana') {
          solanaBalance()
        }
      } else {
        const currentNet = JSON.parse(localStorage.getItem('currentNet'))
        if (currentNet.type === 'xuper') {
          balance()
        } else if (currentNet.type === 'eth') {
          ethBalance()
        } else if (currentNet.type === 'solana') {
          solanaBalance()
        }
      }
      getTokensList()
    }

    const copy = () => {
      const clipboard = new Clipboard('.copycont')
      clipboard.on('success', () => {
        prompt.value.showToast(i18n.global.t('toastMsg.msg2'), 'success', 2500)
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        prompt.value.showToast(i18n.global.t('toastMsg.msg3'), 'warning', 2500)
        clipboard.destroy()
      })
    }

    const balance = async () => {
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const node = currentNet.node
      const chain = currentNet.chain
      const params = {
        server: node,
        fee: '400',
        endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
        endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
      }
      const nodeStatus = node === 'https://xuper.baidu.com/nodeapi' ? [Endorsement(params)] : null
      const xsdk = new XuperSDK({ node, chain, plugins: nodeStatus })
      try {
        const result = await xsdk.getBalance(currentAccont.value.address)
        balanceMoney.value = (result.bcs[0].balance / 100000).toFixed(3)
        localStorage.setItem('banlance', balanceMoney.value)
      } catch (err) {
        console.error(err)
      }
    }

    const ethBalance = async () => {
      const currentNet = JSON.parse(localStorage.getItem('currentNet'))
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
      provider.getBalance(currentAccont.value.address).then((balance) => {
        balanceMoney.value = ethers.utils.formatEther(balance)
        localStorage.setItem('banlance', balanceMoney.value)
      })
    }
    const solanaBalance = async () => {
      const balanceInfo = await getSolanaBalance(currentAccont.value.address)
      console.log('-solana-balanceInfo=',balanceInfo)
      if(balanceInfo && balanceInfo.success) {
        balanceMoney.value = balanceInfo.balance
        localStorage.setItem('banlance', balanceMoney.value)
      }
    }

    const gettablist = async () => {
      const currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      if (currentPlug) {
        const item = currentPlug.tabCont[0][0]
        const response = await axios({
          url: `${item.nftsurl}/${currentAccont.value.address}?contract_address=${item.contract_address}`,
          method: 'GET',
          headers: { 'X-API-KEY': item.xapikey },
        })
        if (response.data.status === 'success' && response.data.statusCode === '200') {
          nfts.value = JSON.parse(response.data.result)
        } else {
          console.error(response.data.message)
        }
      }
    }

    const getTokensList = async () => {
      const netList = JSON.parse(localStorage.getItem('netList'))
      const tokenslist = []
      for (const item of netList) {
        if (item.type === 'xuper' && currentAccont.value.type === 'xuper') {
          const xsdk = new XuperSDK({
            node: item.node,
            chain: item.chain,
            plugins: [Endorsement({ server: item.node, fee: '400' })],
          })
          try {
            const result = await xsdk.getBalance(currentAccont.value.address)
            tokenslist.push({ name: item.chain, balance: (result.bcs[0].balance / 100000).toFixed(3) })
          } catch (err) {
            console.error(err)
          }
        } else if (item.type === 'eth' && currentAccont.value.type === 'eth') {
          const provider = new ethers.providers.JsonRpcProvider(item.node)
          const balance = await provider.getBalance(currentAccont.value.address)
          tokenslist.push({ name: item.chain, balance: ethers.utils.formatEther(balance), netName: item.netName })
        }
      }
      tokens.value = tokenslist
    }

    return {
      currentTab,
      currentTab2,
      addressInfo,
      address,
      balanceMoney,
      drawer,
      nfts,
      tokens,
      version,
      prompt,
      accountAllList,
      currentAccont,
      tabChose,
      tabChose2,
      goSearchFun,
      goTransFun,
      getAccound,
      copy,
      balance,
      ethBalance,
      gettablist,
      getTokensList,
      solanaBalance,
    }
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 0 24px 40px 24px;
  text-align: left;

  .balance-box {
    display: flex;
    align-items: center;
    margin: 15px 0 0px 0;
    span {
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
    }
    div {
      font-size: 18px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
.title {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin: 17px 0 8px 0;
}
.key-txt {
  font-size: 18px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #ffffff;
  img {
    width: 12px;
    cursor: pointer;
    margin-left: 5px;
  }
}
.tab-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 30px;
  .tab-list {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .list-circle {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 23px;
        height: 23px;
      }
      i {
        color: white;
        font-size: 20px;
      }
    }
    .tab-name {
      color: white;
      font-size: 12px;
      font-family: Open Sans-Regular, Open Sans;
      font-weight: 400;
      margin-top: 8px;
    }
  }
}
.switch-tab {
  display: flex;
  align-items: center;
  background: #39536f;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 38px;
  .tab-comm {
    flex: 1;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border-radius: 20px;
    overflow: hidden;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
}
.tab-box2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 11px 0;
  .tab-li {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
    color: white;
    text-align: center;
    cursor: pointer;
    img {
      width: 16px;
    }
  }
  .tab-li.active {
    color: #00e5c4;
  }
}
.nfts-cont {
  ul {
    li {
      display: flex;
      align-items: center;
      height: 47px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      margin-bottom: 10px;
      overflow: hidden;
      padding: 0 15px 0 8px;
      cursor: pointer;
      .chain-circle {
        width: 32px;
        height: 32px;
        background: #262636;
        border-radius: 8px;
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
        padding-left: 8px;
        overflow: hidden;
        p {
          color: white;
          font-size: 14px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
        }
        p:last-child {
          font-size: 12px;
          font-family: Open Sans-Regular, Open Sans;
          font-weight: 400;
        }
      }
      span {
        color: white;
        font-size: 14px;
        font-family: Open Sans-Bold, Open Sans;
        font-weight: bold;
      }
    }
  }
}
.tokens-cont {
  .tokens-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    span {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .select {
    display: flex;
    align-items: center;
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    padding: 0 15px 0 8px;
    border-radius: 8px;
    margin-top: 30px;
    margin-bottom: 5px;
    .comm-logo {
      width: 32px;
      height: 32px;
      background: rgba(38, 38, 54, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 12px;
      img {
        width: 18px;
      }
    }
    .flex1 {
      flex: 1;
      text-align: left;
      padding-left: 10px;
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: white;
      overflow: hidden;
    }
    span {
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      color: white;
    }
  }
}
.no-data {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: #ffffff;
  margin-top: 28px;
  text-align: center;
}
.plug-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .plug-count {
    max-height: 400px;
    min-height: 300px;
    overflow-y: auto;
    position: relative;
    border-radius: 10px 10px 0 0;
    .bg-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .img-close {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 9;
      cursor: pointer;
    }
    ul {
      margin-top: 50px;
      padding: 0 25px 30px 25px;
      li {
        display: flex;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 8px;
        .img-circle {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #262636;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 18px;
            height: 18px;
          }
        }
        .flex1 {
          flex: 1;
          padding-left: 10px;
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #ffffff;
          text-align: left;
        }
        .btn {
          width: 71px;
          height: 27px;
          background: linear-gradient(90deg, #00e5c4 0%, #027ce3 100%);
          border-radius: 14px;
          text-align: center;
          line-height: 27px;
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #ffffff;
        }
        .btn.disabled {
          background: #878787;
        }
      }
    }
  }
}
.version-num {
  position: fixed;
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  color: white;
  left: 0;
  bottom: 0;
  text-align: center;
}
</style>
