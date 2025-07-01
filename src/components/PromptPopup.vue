<template>
  <div class="prompt-box" v-if="show">
    <img src="../assets/img-succes.png" v-if="type === 'success'" />
    <img src="../assets/img-warning.png" v-if="type === 'warning'" />
    <img src="../assets/img-error.png" v-if="type === 'error'" />
    <span
      :class="
        type === 'success'
          ? 'success'
          : type === 'warning'
          ? 'warning'
          : type === 'error'
          ? 'error'
          : ''
      "
      >{{ promptText }}</span
    >
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PromptPopup',
  setup() {
    // 响应式数据
    const show = ref(false)
    const type = ref('success')
    const promptText = ref('success')

    // 显示 Toast
    const showToast = (text, toastType, time) => {
      show.value = true
      type.value = toastType
      promptText.value = text
      const timer = setTimeout(() => {
        show.value = false
        clearTimeout(timer)
      }, time)
    }

    return {
      show,
      type,
      promptText,
      showToast,
    }
  },
}
</script>

<style scoped>
/* 样式保持不变 */
</style>
<style lang="less" scoped>
.prompt-box {
  position: fixed;
  width: 251px;
  background: rgba(133, 133, 133, 0.5);
  left: 0;
  right: 0;
  top: 15px;
  z-index: 999;
  margin: auto;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 14px;
  backdrop-filter: blur(4px);
  img {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    margin-left: 10px;
  }
  span.success {
    color: #00e5c4;
  }
  span.warning {
    color: #e5c600;
  }
  span.error {
    color: #ff0000;
  }
}
</style>
