<template>
  <div class="prompt-box" v-if="show">
    <img src="../assets/img-succes.png" v-if="type == 'success'" />
    <img src="../assets/img-warning.png" v-if="type == 'warning'" />
    <img src="../assets/img-error.png" v-if="type == 'error'" />
    <span
      :class="
        type == 'success'
          ? 'success'
          : type == 'warning'
          ? 'warning'
          : type == 'error'
          ? 'error'
          : ''
      "
      >{{ promptText }}</span
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      type: 'success',
      promptText: 'success',
    }
  },
  methods: {
    showToast(text, type, time) {
      this.show = true
      this.type = type
      this.promptText = text
      const timer = setTimeout(() => {
        this.show = false
        clearTimeout(timer)
      }, time)
    },
  },
}
</script>
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
