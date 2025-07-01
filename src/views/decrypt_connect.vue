<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ $t('decypt.title') }}</span>
      </div>
      <div class="content">
        <p class="url-txt">{{ url }}</p>
        <p class="intro-txt">
          {{ $t('decypt.intro') }}
        </p>
        <div class="current-box">
          <div class="img-circle">
            <img
              src="../assets/img-eth.png"
              v-if="currentAccont.type == 'eth'"
            />
            <img src="../assets/img-x.png" v-else />
          </div>
          <div class="flex1">
            <span>{{ $t('comm.current') }}</span>
            <p>{{ plusXing(currentAccont.address,5,10) }}</p>
          </div>
        </div>
        <div class="msg-box">
          <p>{{ $t('comm.msg') }}</p>
          <div class="msg-cont">{{ message }}</div>
          <div class="line"></div>
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
import { useRoute } from 'vue-router'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import { sendDecryptHash, sendExit } from '@/utils/transaction'
import { getPrivateKey } from '@/utils/decryptKey'
import PromptPopup from '@/components/PromptPopup.vue'
import { decryptWithPrivateKey } from 'eth-crypto-js'
import { cipher } from 'eth-crypto';
import { i18n } from '@/main';

export default {
  components: {
    PromptPopup,
  },
  setup() {
    const route = useRoute()
    const favIconUrl = ref('')
    const url = ref('')
    const message = ref('')
    const prompt = ref(null)

    // 计算属性
    const accountAllList = computed(() => {
      return JSON.parse(localStorage.getItem('acc'))
    })

    const currentAccont = computed(() => {
      return JSON.parse(localStorage.getItem('currentAccont'))
    })

    // 方法
    const getTap = async () => {
      const res = await getTab()
      console.log(res)
      favIconUrl.value = res.favIconUrl
      url.value = res.url
    }

    const closeWindow = () => {
      sendExit()
    }

    const addUrl = async () => {
      console.log(JSON.parse(localStorage.getItem('currentAccont')))
      const account = JSON.parse(localStorage.getItem('currentAccont'))

      const privateKey = await getPrivateKey()

      if (account.type === 'eth') {
        const encryptedData = cipher.parse(message.value)
        const decryptData = await decryptWithPrivateKey(
          privateKey,
          encryptedData
        )
        sendDecryptHash('decryptCrypto_sign', decryptData)
      } else {
        prompt.value.showToast(i18n.global.t('toastMsg.msg26'), 'warning', 2500)
      }
    }

    // 生命周期钩子
    onMounted(() => {
      getTap()

      let query = route.query
      let params = JSON.parse(query.params)
      console.log('query', JSON.parse(query.params))
      if (params && params.length > 0) { 
        message.value = params[0].message
      }
    })

    return {
      favIconUrl,
      url,
      message,
      currentAccont,
      accountAllList,
      prompt,
      plusXing,
      closeWindow,
      addUrl,
    }
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 25px;
  text-align: left;
  .url-txt {
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-top: 15px;
  }
  .intro-txt {
    font-size: 14px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    margin-top: 10px;
    text-align: center;
  }
  .current-box {
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-top: 30px;
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
      margin: 10px 0;
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
      margin: 10px 0;
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
