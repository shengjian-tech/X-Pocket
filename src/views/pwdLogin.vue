<template>
  <div>
    <div class="container">
      <div style="text-align: center">
        <img src="../assets/headerlogo.png" class="img-logo" />
      </div>
      <img src="../assets/planet.png" class="img-planet" />
      <p class="title">{{ $t('pwdLogin.title') }}</p>
      <p class="sub-title">{{ $t('pwdLogin.subTitle') }}</p>
      <div class="content">
        <input
          type="password"
          v-model="password"
          :placeholder="$t('pwdLogin.placeholder')"
        />
        <div class="bottom">
          {{ $t('pwdLogin.tips') }}
          <span>{{ $t('pwdLogin.forget') }}</span>
        </div>
        <div class="btn" @click="getLogin">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'
import PromptPopup from '@/components/PromptPopup.vue'
import { i18n } from '@/main';

export default {
  components: { PromptPopup },
  setup() {
    const router = useRouter()
    const password = ref('')
    const prompt = ref(null)

    const getLogin = () => {
      if (!password.value) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg28'), 'warning', 2500)
      } else {
        const hashBuffer = CryptoJS.SHA512(password.value)
        const byteArray = []
        for (let i = 0; i < hashBuffer.words.length; i++) {
          const word = hashBuffer.words[i]
          byteArray.push((word >> 24) & 0xff)
          byteArray.push((word >> 16) & 0xff)
          byteArray.push((word >> 8) & 0xff)
          byteArray.push(word & 0xff)
        }
        const hashHex = byteArray
          .map((byte) => String.fromCharCode(byte))
          .join('')

        const currentPwd = btoa(hashHex)
        const closepwd = localStorage.getItem('closepwd')

        if (closepwd === currentPwd) {
          // 一致通过
          localStorage.setItem('closeState', false)
          router.push('/Home')
        } else {
          // 不一致密码错误
          prompt.value.showToast(i18n.global.t('toastMsg.msg27'), 'error', 2500)
        }
      }
    }

    return {
      password,
      prompt,
      getLogin,
    }
  },
}
</script>
<style lang="less" scoped>
.img-logo {
  width: 32px;
  margin-top: 20px;
}
.img-planet {
  width: 245px;
  margin-top: 18px;
}
.title {
  font-size: 18px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #ffffff;
  margin-top: 26px;
}
.sub-title {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 7px;
}
.content {
  padding: 0 38px;
  input {
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
    height: 20px;
    margin-top: 55px;
  }
  input::-webkit-input-placeholder {
    color: #919397;
  }
  .bottom {
    border-top: 2px solid rgba(255, 255, 255, 0.1);
    margin-top: 10px;
    padding-top: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    span {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #00e5c4;
      cursor: pointer;
    }
  }
  .btn {
    width: 225px;
    height: 45px;
    background: linear-gradient(90deg, #00e5c4 0%, #0078e5 100%);
    text-align: center;
    line-height: 45px;
    cursor: pointer;
    font-size: 15px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
    margin-top: 27px;
    border-radius: 30px;
  }
}
</style>
