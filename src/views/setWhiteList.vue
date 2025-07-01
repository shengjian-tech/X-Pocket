<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ t('setWhiteList.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ t('setWhiteList.title') }}</span>
            </div>
            <textarea
              v-model="form.httpTxt"
              :placeholder="t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="addNetList">{{ t('comm.confirm') }}</div>
      </div>
    </div>
    <confirm-popup
      ref="confirm"
      :title="t('comm.tips')"
      @confirm="sure"
    >
      {{ t('toastMsg.msg30') }}
    </confirm-popup>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ConfirmPopup from '@/components/ConfirmPopup.vue'

export default {
  name: 'SetWhiteList',
  components: { ConfirmPopup },
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    // 表单数据
    const form = reactive({
      httpTxt: '',
    })

    // 引用 ConfirmPopup 组件
    const confirm = ref(null)

    // 初始化时从 localStorage 中读取数据
    onMounted(() => {
      chrome.storage.local.get('whiteList', (result) => {
        if (result.whiteList && result.whiteList !== 'undefined') {
          form.httpTxt = result.whiteList
        }
      })
    })

    // 返回上一页
    const toBack = () => {
      router.back()
    }

    // 添加网络列表
    const addNetList = () => {
      chrome.storage.local.remove('whiteList', () => {
        // 删除后的回调
      })
      chrome.storage.local.set({ whiteList: form.httpTxt }, () => {
        // 设置完毕后的回调
      })
      confirm.value.showConfirm()
    }

    // 确认操作
    const sure = () => {
      router.push('/Home')
      window.close()
    }

    return {
      form,
      confirm,
      toBack,
      addNetList,
      sure,
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
