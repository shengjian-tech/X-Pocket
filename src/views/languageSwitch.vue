<template>
  <div class="container">
    <div class="header">
      <img src="../assets/img-back.png" class="img-back" @click="goHome" />
      <span class="nav-title">{{ $t('setLanguage.title') }}</span>
    </div>
    <div class="content">
      <ul>
        <li @click="choseLanguage(0)">
          <div class="img-circle">
            <img src="../assets/img-en.png" />
          </div>
          <div class="flex1">English</div>
          <img
            src="../assets/img-checked.png"
            class="img-check"
            v-if="current == 0"
          />
          <img src="../assets/img-check.png" class="img-check" v-else />
        </li>
        <li @click="choseLanguage(1)">
          <div class="img-circle">
            <img src="../assets/img-zh.png" />
          </div>
          <div class="flex1">{{ $t('setLanguage.chinese') }}</div>
          <img
            src="../assets/img-checked.png"
            class="img-check"
            v-if="current == 1"
          />
          <img src="../assets/img-check.png" class="img-check" v-else />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 0,
    }
  },
  mounted() {
    let curr = localStorage.getItem('languageSet')
    if (curr == 'en') {
      this.current = 0
    } else {
      this.current = 1
    }
  },
  methods: {
    choseLanguage(i) {
      this.current = i - 0
      if (this.current == 0) {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
      localStorage.setItem('languageSet', this.$i18n.locale)
    },
    goHome() {
      this.$router.push('/Set')
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 23px 25px;
  text-align: left;
  ul {
    li {
      display: flex;
      align-items: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
      margin-bottom: 10px;
      overflow: hidden;
      padding: 7px 22px 7px 10px;
      border-radius: 10px;
      .img-circle {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #262636;
        overflow: hidden;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .flex1 {
        flex: 1;
        padding-left: 10px;
        font-size: 16px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        color: #ffffff;
      }
      .img-check {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
