<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ t('rsa.name') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ t('rsa.name') }}</span>
            </div>
            <textarea
              v-model="form.password"
              :placeholder="t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="addNetList">{{ t('comm.confirm') }}</div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup
        ref="confirm"
        :title="t('comm.tips')"
        @confirm="sure"
        @cancel="sure"
      >
        {{ t('toastMsg.msg17') }}
      </confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PromptPopup from '@/components/PromptPopup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'

export default {
  name: 'SetRsa',
  components: { PromptPopup, ConfirmPopup },
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    const form = reactive({
      password: '',
      norpwd: '',
    })

    const netList = ref(JSON.parse(localStorage.getItem('netList')))
    const prompt = ref(null)
    const confirm = ref(null)

    const toBack = () => {
      router.back()
    }

    const goHome = () => {
      router.push('/Home')
    }

    const sure = () => {
      localStorage.setItem('privateKeyPem', form.password.replace(/\n/g, '\\n'))
      router.push('/Set')
    }

    const addNetList = () => {
      if (!form.password) {
        return prompt.value.showToast(t('toastMsg.msg14'), 'warning', 1500)
      }
      confirm.value.showConfirm()
    }

    return {
      form,
      netList,
      prompt,
      confirm,
      toBack,
      goHome,
      sure,
      addNetList,
      t,
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
    margin-bottom: 18px;
    overflow: hidden;
    padding: 0 15px;
    .set-box {
      padding-bottom: 15px;
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
        color: rgba(255, 255, 255, 0.5);
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
      margin-top: 10px;
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
