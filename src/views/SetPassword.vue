<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('setPwd.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('setPwd.title') }}</span>
              <div class="right" v-if="!isShow" @click="isShow = true">
                <img src="../assets/img-eyes.png" />{{ $t('setPwd.show') }}
              </div>
              <div
                class="right"
                style="color: white"
                @click="isShow = false"
                v-else
              >
                <img src="../assets/img-hidden.png" />{{ $t('setPwd.hide') }}
              </div>
            </div>
            <input
              :type="isShow ? 'text' : 'password'"
              v-model="form.password"
              :placeholder="$t('comm.placeholder')"
            />
          </div>
        </div>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('setPwd.title2') }}</span>
              <div class="right" v-if="!isShow2" @click="isShow2 = true">
                <img src="../assets/img-eyes.png" />{{ $t('setPwd.show') }}
              </div>
              <div
                class="right"
                style="color: white"
                @click="isShow2 = false"
                v-else
              >
                <img src="../assets/img-hidden.png" />{{ $t('setPwd.hide') }}
              </div>
            </div>
            <input
              :type="isShow2 ? 'text' : 'password'"
              v-model="form.norpwd"
              :placeholder="$t('comm.placeholder')"
            />
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="addNetList">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup
        ref="confirm"
        @confirm="sure"
        @cancel="sure"
        :title="$t('comm.tips')"
      >
        {{ $t('toastMsg.msg15') }}
      </confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS, { enc, AES } from 'crypto-js'
import { getPrivateKey } from '@/utils/decryptKey'
import PromptPopup from '@/components/PromptPopup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import { i18n } from '@/main';

export default {
  components: { PromptPopup, ConfirmPopup },
  setup() {
    const router = useRouter()
    const form = ref({
      password: '',
      norpwd: '',
    })
    const isShow = ref(false)
    const isShow2 = ref(false)
    const prompt = ref(null)
    const confirm = ref(null)

    const goHome = () => {
      router.push('/Set')
    }

    const addNetList = () => {
      if (!form.value.password || !form.value.norpwd) {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg14'), 'warning', 2500)
      }
      if (form.value.password !== form.value.norpwd) {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg16'), 'warning', 2500)
      }
      confirm.value.showConfirm()
    }

    const generateRandomString = () => {
      const characters =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomString = ''
      for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        randomString += characters.charAt(randomIndex)
      }
      return randomString
    }

    const sure = async () => {
      const str = generateRandomString()
      const hashBuffer = CryptoJS.SHA512(form.value.password, str)
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
      localStorage.setItem('closepwd', btoa(hashHex))

      const acc = JSON.parse(localStorage.getItem('currentAccont'))

      if (acc) {
        const privateKey = await getPrivateKey()
        const encipherKey = AES.encrypt(privateKey, str).toString()
        const randS = AES.encrypt(str, acc?.address).toString()
        acc.privateKey = encipherKey
        acc.rString = randS
        localStorage.removeItem('currentAccont')
        localStorage.setItem('currentAccont', JSON.stringify(acc))
      }

      router.push('/Set')
    }

    return {
      form,
      isShow,
      isShow2,
      prompt,
      confirm,
      goHome,
      addNetList,
      sure,
    }
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 23px 25px;
  text-align: left;
  .pwd-set {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 14px;
    overflow: hidden;
    padding: 0 15px;
    .set-box {
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 11px;
      margin-bottom: 14px;
    }
    .pwd-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      span {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
      }
      .right {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: #00e5c4;
        cursor: pointer;
        img {
          margin-right: 5px;
        }
      }
    }
    input {
      font-size: 18px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      width: 100%;
      color: #ffffff;
      letter-spacing: 5px;
    }
  }
}
.btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 50px;
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
