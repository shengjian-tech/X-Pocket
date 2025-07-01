<template>
  <div class="popup-box" v-if="show">
    <div class="popup-cont">
      <div class="title">
        {{ title }}<img src="../assets/img-help.png" />
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="btn-box">
        <div class="btn" @click="cancel">{{ t('comm.cancel') }}</div>
        <div class="btn" @click="sure">{{ t('comm.confirm') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ConfirmPopup',
  props: {
    title: {
      type: String,
      default: 'Tips',
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    // 响应式数据
    const show = ref(false)

    // 显示弹窗
    const showConfirm = () => {
      show.value = true
    }

    // 取消操作
    const cancel = () => {
      show.value = false
      emit('cancel')
    }

    // 确认操作
    const sure = () => {
      show.value = false
      emit('confirm')
    }

    return {
      show,
      showConfirm,
      cancel,
      sure,
      t,
    }
  },
}
</script>

<style lang="less" scoped>
.popup-box {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  .popup-cont {
    width: 240px;
    background: white;
    overflow: hidden;
    border-radius: 16px;
    box-sizing: border-box;
    padding: 0 15px;
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 26px 0 12px 0;
      font-size: 15px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: #000000;
      img {
        width: 12px;
        height: 12px;
        margin-left: 5px;
      }
    }
  }
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 0 20px 0;
    .btn {
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: #ffffff;
      border-radius: 15px;
    }
    .btn:first-child {
      background: #c8c8c9;
    }
  }
}
</style>
