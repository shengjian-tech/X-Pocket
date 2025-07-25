<template>
  <div class="header-nav">
    <div class="cover-box" v-if="showInfo || showList" @click="hideCover"></div>
    <div class="avator-box">
      <div class="img-box" @click="infoHandle">
        <img src="../assets/headerlogo.png" />
      </div>
      <div class="info-list" v-if="showInfo">
        <p>{{ t('home.myAccount') }}</p>
        <ul class="account-ul">
          <li
            v-for="(item, index) in accountAllList"
            :key="index"
            @click="changeAccount(item)"
          >
            <span>{{ index + 1 }}:</span>
            <div class="flex1">
              {{ plusXing(item.address, 10, 10) }}
            </div>
          </li>
        </ul>
        <ul class="list-ul">
          <li @click="handleCommand('a')">
            <img src="../assets/img-add.png" />
            <div class="flex1">{{ t('home.newAddress') }}</div>
          </li>
          <li @click="handleCommand('i')">
            <img src="../assets/img-link.png" />
            <div class="flex1">{{ t('home.linkDetails') }}</div>
          </li>
          <li @click="handleCommand('c')">
            <img src="../assets/img-set.png" />
            <div class="flex1">{{ t('home.set') }}</div>
          </li>
        </ul>
        <div class="btn-wrapper">
          <div class="btn btn-comm" @click="goLock()">
            {{ t('home.btnLock') }}
          </div>
          <div class="btn-comm" @click="goout()">{{ t('home.btnOut') }}</div>
        </div>
      </div>
    </div>
    <div class="flex1">
      <div class="select-box" @click="listHandle">
        <img :src="netObj[sign]" class="chain-logo" />
        <div class="flex1">{{ netName }}</div>
        <img src="../assets/img-right.png" class="img-down" />
      </div>
      <ul class="chain-list" v-if="showList">
        <li
          v-for="(item, index) in options"
          :key="index"
          @click="getSelect(index, item)"
        >
          <img :src="netObj[item.sign]" class="chain-logo" />
          <div class="flex1">{{ item.netName }}</div>
          <img
            src="../assets/img-checked.png"
            class="img-down"
            v-if="choseNet == item.netName"
          />
          <img src="../assets/img-check.png" class="img-down" v-else />
        </li>
        <li @click="goAddNet()">
          <img src="../assets/img-add.png" class="chain-logo" />
          <div class="flex1">{{ t('home.addNet') }}</div>
        </li>
      </ul>
    </div>
    <prompt-popup ref="prompt"></prompt-popup>
    <confirm-popup ref="confirm" @confirm="sure" :title="t('comm.tips')">
      {{ t('toastMsg.msg9') }}
    </confirm-popup>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { plusXing } from '../assets/js/index'
import { clearStorage } from '@/utils/setStorage'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'

export default {
  name: 'HeaderNav',
  components: {
    ConfirmPopup,
    PromptPopup,
  },
  setup(props, { emit }) {
    const router = useRouter()
    const { t } = useI18n()

    // 响应式数据
    const showInfo = ref(false)
    const showList = ref(false)
    const options = ref([
      {
        netName: 'XuperOS',
        node: 'https://xuper.baidu.com/nodeapi',
        chain: 'xuper',
        type: 'xuper',
        imgUrl: require('../assets/img-eth.png'),
      },
    ])
    const netName = ref('XuperOS')
    const accountAllList = ref([])
    const choseNet = ref('')
    const sign = ref('')
    const netObj = ref({
      xuper: require('../assets/img-x.png'),
      eth: require('../assets/img-eth.png'),
      polygon: require('../assets/img-polygon.png'),
      solana : require('../assets/img-solana.png'),
    })
    const prompt = ref(null)
    const confirm = ref(null)

    // 初始化
    onMounted(() => {
      const netList = JSON.parse(localStorage.getItem('netList'))
      const currentNet = localStorage.getItem('currentNet')
        ? JSON.parse(localStorage.getItem('currentNet'))
        : null
      options.value = JSON.parse(localStorage.getItem('netList'))
      const acc = JSON.parse(localStorage.getItem('currentAccont'))
      const closeState = localStorage.getItem('closeState')
      const closepwd = localStorage.getItem('closepwd')

      if (acc) {
        if (closeState === 'true' && closepwd) {
          router.push('/pwdLogin')
        } else {
          if (currentNet) {
            netName.value = currentNet.netName
            console.log('netName.value=',netName.value)
            if(currentNet.type === 'xuper') {
              sign.value = 'xuper'
            } else if (currentNet.type === 'eth') {
              sign.value = 'eth'
            } else if (currentNet.type ==='solana') {
              sign.value = 'solana'
            }
          } else {
            if(acc.type === 'xuper') {
              sign.value = 'xuper'
              netName.value = 'XuperOS'
            } else if (acc.type === 'eth') {
              sign.value = 'eth'
              netName.value = 'Ethereum'
            } else if (acc.type ==='solana') {
              sign.value = 'solana'
              netName.value = 'Solana'
            }
          }
          choseNet.value = netName.value
          if (localStorage.getItem('accountAllList')) {
            accountAllList.value = JSON.parse(
              localStorage.getItem('accountAllList')
            )
          }
          if (!currentNet) {
            if (acc.type === 'xuper') {
              localStorage.setItem('currentNet', JSON.stringify(netList[0]))
            } else if (acc.type === 'eth') {
              localStorage.setItem('currentNet', JSON.stringify(netList[2]))
            } else if (acc.type === 'solana') {
              localStorage.setItem('currentNet', JSON.stringify(netList[3]))
            }
          }
        }
      } else {
        router.push('/Login')
      }
    })

    // 显示/隐藏账户信息
    const infoHandle = () => {
      showInfo.value = !showInfo.value
    }

    // 显示/隐藏网络列表
    const listHandle = () => {
      showList.value = !showList.value
    }

    // 隐藏遮罩层
    const hideCover = () => {
      showInfo.value = false
      showList.value = false
    }

    // 跳转到添加网络页面
    const goAddNet = () => {
      router.push('/Addnet')
    }

    // 切换网络
    const getSelect = (value, item) => {
      const accountList = JSON.parse(localStorage.getItem('acc'))
      const netList = JSON.parse(localStorage.getItem('netList'))
      const type = netList[value].type
      choseNet.value = item.netName
      netName.value = item.netName
      sign.value = item.sign

      const mapresult = accountList.some((item) => item.type === type)
      if (!mapresult) {
        router.push({ path: '/login', query: { state: 1, stateName: type } })
        showList.value = false
      } else {
        accountAllList.value = accountList.filter((item) => item.type === type)
        localStorage.setItem(
          'accountAllList',
          JSON.stringify(accountAllList.value)
        )
        emit('transfer', accountAllList.value[0], netList[value])
        showList.value = false

        // 更新缓存链接
        const connectList = JSON.parse(localStorage.getItem('connectList'))
        connectList[0].accountList = accountAllList.value
        localStorage.setItem('connectList', JSON.stringify(connectList))
      }
      localStorage.setItem('currentNet', JSON.stringify(netList[value]))
    }

    // 锁定账户
    const goLock = () => {
      const closepwd = localStorage.getItem('closepwd')
      if (closepwd) {
        localStorage.setItem('closeState', 'true')
        router.push('/pwdLogin')
      } else {
        prompt.value.showToast(t('comm.msg10'), 'warning', 2500)
        router.push('/SetPassword')
      }
    }

    // 处理命令
    const handleCommand = (command) => {
      if (command === 'a') {
        router.push({ path: '/', query: { state: 1 } })
      } else if (command === 'c') {
        router.push('/Set')
      } else if (command === 'i') {
        router.push('/connectList')
      }
    }

    // 切换账户
    const changeAccount = (item) => {
      emit('transfer', item)
      showInfo.value = false
    }

    // 退出登录
    const goout = () => {
      confirm.value.showConfirm()
    }

    // 确认退出
    const sure = () => {
      localStorage.clear()
      clearStorage()
      router.push('/login')
    }

    return {
      showInfo,
      showList,
      options,
      netName,
      accountAllList,
      choseNet,
      sign,
      netObj,
      prompt,
      confirm,
      infoHandle,
      listHandle,
      hideCover,
      goAddNet,
      getSelect,
      goLock,
      handleCommand,
      changeAccount,
      goout,
      sure,
      plusXing,
      t,
    }
  },
}
</script>

<style lang="less" scoped>
.header-nav {
  display: flex;
  align-items: center;
  padding-top: 26px;
  .avator-box {
    position: relative;
    .img-box {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .info-list {
      position: absolute;
      z-index: 99;
      width: 252px;
      left: 0;
      top: 44px;
      backdrop-filter: blur(6px);
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 10px;
      overflow: hidden;
      padding: 15px;
      text-align: left;
      p {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
      }
      .account-ul {
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        li {
          display: flex;
          align-items: center;
          padding: 8px 0;
          cursor: pointer;
          span {
            font-size: 12px;
            color: white;
          }
          .flex1 {
            flex: 1;
            font-size: 12px;
            color: white;
          }
        }
      }
      .list-ul {
        margin: 18px 0 0 0;
        padding: 0;
        li {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;
          img {
            width: 12px;
            height: 12px;
          }
          .flex1 {
            flex: 1;
            padding-left: 8px;
            font-size: 12px;
            font-family: Arial-Regular, Arial;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
      .btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn-comm {
          height: 30px;
          width: 100px;
          line-height: 30px;
          overflow: hidden;
          border-radius: 15px;
          font-size: 12px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
          box-sizing: border-box;
          cursor: pointer;
        }
        .btn-comm:last-child {
          font-size: 12px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
          color: white;
          background: #252429;
          text-align: center;
        }
      }
    }
  }
  .flex1 {
    flex: 1;
    padding-left: 14px;
    position: relative;
    .select-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow: hidden;
      height: 38px;
      padding: 0 12px;
      cursor: pointer;
      .chain-logo {
        width: 18px;
        height: 18px;
      }
      .flex1 {
        flex: 1;
        padding-left: 8px;
        font-size: 12px;
        font-family: Open Sans-Regular, Open Sans;
        font-weight: 400;
        color: #ffffff;
        text-align: left;
      }
      .img-down {
        width: 10px;
      }
    }
    .chain-list {
      position: absolute;
      width: 200px;
      right: 0;
      top: 44px;
      margin: 0;
      z-index: 99;
      li {
        display: flex;
        align-items: center;
        height: 38px;
        overflow: hidden;
        padding: 10px 12px;
        backdrop-filter: blur(6px);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        img{
          width: 24px;
          height: 24px;
        }
        .flex1 {
          flex: 1;
          color: white;
          padding-left: 10px;
          font-size: 12px;
          font-family: Open Sans-Regular, Open Sans;
          font-weight: 400;
          text-align: left;
        }
        .img-down {
          width: 8px;
          height: 8px;
        }
      }
    }
  }
  .cover-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 98;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0);
  }
}
</style>
