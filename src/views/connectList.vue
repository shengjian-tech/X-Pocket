<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ $t('home.linkDetails') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="link-info">
          {{ $t('linkDetails.title') }}
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
                $t('linkDetails.current')
              }}</span>
            </p>
            <p>{{ plusXing(item.address,5,10) }}</p>
          </div>
          <img
            src="../assets/img-checked.png"
            v-if="currentS.includes(item.address)"
          />
          <img src="../assets/img-check.png" v-else />
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="editUrl">{{ $t('comm.confirm') }}</div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import PromptPopup from '@/components/PromptPopup.vue'
import { i18n } from '@/main';

export default {
  components: { PromptPopup },
  setup() {
    const router = useRouter()
    const favIconUrl = ref('')
    const url = ref('')
    const activeItem = ref([])
    const currentS = ref([])
    const prompt = ref(null)

    // 计算属性
    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    const currentAccont = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })

    // 方法
    const toBack = () => {
      router.push('/Home')
    }

    const getTap = async () => {
      const res = await getTab()
      console.log(res, '---gettab---')
      favIconUrl.value = res.favIconUrl
      url.value = res.url
      const connectList = JSON.parse(localStorage.getItem('connectList')) || []
      connectList.forEach((element) => {
        if (element.url === url.value) {
          activeItem.value = element.accountList
        }
      })
    }

    const active = (item) => {
      currentS.value = []
      const index = activeItem.value.findIndex((obj) => {
        return obj.address === item.address
      })
      console.log(index, '**index**')
      if (index === -1) {
        activeItem.value.push(item)
        currentS.value.push(item.address)
      } else {
        activeItem.value.splice(index, 1)
        currentS.value.splice(item.address, 1)
      }
      console.log(currentS.value, '****currentS****')
      console.log(activeItem.value, '***activeItem***')
    }

    const editUrl = () => {
      if (activeItem.value.length === 0) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg12'), 'warning', 2500)
        return
      }
      const connectList = JSON.parse(localStorage.getItem('connectList')) || []
      console.log('connectList-connectList=', connectList)
      connectList.forEach((element) => {
        if (element.url === url.value) {
          element.accountList = activeItem.value
        }
      })
      localStorage.setItem('connectList', JSON.stringify(connectList))
      prompt.value.showToast(i18n.global.t('toastMsg.msg13'), 'success', 2500)
    }

    // 生命周期钩子
    onMounted(() => {
      getTap()
    })

    return {
      favIconUrl,
      url,
      accountAllList,
      currentAccont,
      activeItem,
      currentS,
      prompt,
      plusXing,
      toBack,
      active,
      editUrl,
    }
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 26px 25px;
  text-align: left;
  .link-info {
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    color: #ffffff;
    text-align: center;
    line-height: 26px;
    padding: 0 2px;
  }
  .link-http {
    text-align: center;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 10px;
    margin-bottom: 32px;
    word-break: break-all;
  }
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
.btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 37px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
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
