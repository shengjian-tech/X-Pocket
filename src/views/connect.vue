<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ $t('link.title') }}</span>
      </div>
      <div class="comm-request">
        <img :src="favIconUrl" />
        <p>{{ url }}</p>
      </div>
      <div class="content">
        <p class="intro-txt">
          {{ $t('link.intro') }}
        </p>
        <div
          class="current-link"
          v-for="(item, index) in accountAllList"
          :key="index"
          @click="active(item)"
        >
          <div class="chain-circle">
            <img src="../assets/img-eth.png" v-if="item.type == 'eth'" />
            <img src="../assets/img-x.png" v-if="item.type == 'xuper'" />
            <img src="../assets/img-solana.png" v-if="item.type == 'solana'" />
          </div>
          <div class="flex1">
            <p>
              {{ item.type }}
              <span v-if="item.address == currentAccont.address">{{
                $t('comm.current')
              }}</span>
            </p>
            <p>{{ plusXing(item.address,5,5) }}</p>
          </div>
          <img
            src="../assets/img-checked.png"
            v-if="currentS.includes(item.address)"
          />
          <img src="../assets/img-check.png" v-else />
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ $t('comm.refuse') }}</div>
        <div class="btn" @click="addUrl">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { i18n } from '@/main';
import PromptPopup from '@/components/PromptPopup.vue'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'

export default {
  name: 'LinkPage',
  components: {
    PromptPopup,
  },
  setup() {
    const router = useRouter()

    // 响应式数据
    const favIconUrl = ref('')
    const url = ref('')
    const color = ref(['#744f68', '#788890', '#ebd40a', '#1e832a', '#abb7bc'])
    const connect = ref(null)
    const activeItem = ref([])
    const currentS = ref([])
    const prompt = ref(null)

    // 计算属性
    const accountAllList = ref(JSON.parse(localStorage.getItem('acc')))
    const currentAccont = ref(JSON.parse(localStorage.getItem('currentAccont')))

    // 生命周期钩子
    onMounted(() => {
      getTap()
    })

    // 获取标签页信息
    const getTap = async () => {
      const res = await getTab()
      console.log(res)
      connect.value = res
      favIconUrl.value = res.favIconUrl
      url.value = res.url
      getActiveItem()
    }

    // 关闭窗口
    const closeWindow = () => {
      window.close()
    }

    // 激活账户
    const active = (item) => {
      const index = activeItem.value.findIndex((obj) => {
        return obj.address === item.address
      })
      if (index === -1) {
        activeItem.value.push(item)
        currentS.value.push(item.address)
      } else {
        activeItem.value.splice(index, 1)
        currentS.value.splice(currentS.value.indexOf(item.address), 1)
      }
      console.log(activeItem.value)
    }

    // 显示图标
    const iconShow = (item) => {
      const index = activeItem.value.findIndex((obj) => {
        return obj.address === item.address
      })
      return index !== -1
    }

    // 添加 URL
    const addUrl = () => {
      if (activeItem.value.length === 0) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg12'), 'warning', 2500)
        return
      }
      let connectList = JSON.parse(localStorage.getItem('connectList'))
        ? JSON.parse(localStorage.getItem('connectList'))
        : []
      connect.value.accountList = activeItem.value
      connectList.push(connect.value)
      localStorage.setItem('connectList', JSON.stringify(connectList))
      router.push('/Home')
    }

    // 获取激活的账户
    const getActiveItem = () => {
      let connectList = JSON.parse(localStorage.getItem('connectList'))
        ? JSON.parse(localStorage.getItem('connectList'))
        : []
      let nowConnect = connectList.find((item) => {
        return url.value === item.url
      })
      activeItem.value = nowConnect?.accountList || []

      // 如果只有一个账户的话就默认选中
      let acc = JSON.parse(localStorage.getItem('acc'))
      if (acc && acc.length === 1) {
        activeItem.value = acc
        currentS.value.push(acc[0].address)
      }
    }

    return {
      favIconUrl,
      url,
      color,
      connect,
      activeItem,
      currentS,
      accountAllList,
      currentAccont,
      prompt,
      getTap,
      plusXing,
      closeWindow,
      active,
      iconShow,
      addUrl,
      getActiveItem,
    }
  },
}
</script>

<style scoped>
/* 样式保持不变 */
</style>

<style lang="less" scoped>
.content {
  padding: 0 25px;
  text-align: left;
  .other-cont {
    margin-top: 10px;
    .other-logo {
      width: 32px;
    }
    .other-url {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .intro-txt {
    font-size: 16px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    line-height: 29px;
    text-align: center;
    margin-bottom: 20px;
  }
  .current-link {
    display: flex;
    align-items: center;
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 8px;
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
      img {
        width: 18px;
        height: 18px;
      }
    }
    .flex1 {
      flex: 1;
      padding-left: 8px;
      p {
        color: white;
        font-size: 14px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        span {
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #00e5c4;
          position: relative;
          top: -1px;
          left: 5px;
        }
      }
      p:last-child {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 5px;
      }
    }
  }
  .intro-txt {
    font-size: 16px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    line-height: 29px;
    margin-top: 10px;
  }
  .current-box {
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-top: 37px;
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
      margin: 15px 0;
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
    }
    .line {
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin: 20px 0;
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
