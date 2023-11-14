<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ $t('setWhiteList.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('setWhiteList.title') }}</span>
            </div>
            <textarea
              v-model="form.httpTxt"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="addNetList">{{ $t('comm.confirm') }}</div>
      </div>
    </div>
    <confirm-popup ref="confirm" :title="$t('comm.tips')" @confirm="sure">{{
      $t('toastMsg.msg30')
    }}</confirm-popup>
  </div>
</template>

<script>
import Header from '../components/Header'
import ConfirmPopup from '@/components/ConfirmPopup.vue'

export default {
  name: 'setWhiteList',
  data() {
    return {
      form: {
        httpTxt: '',
      },
    }
  },
  components: { Header, ConfirmPopup },
  mounted() {
    let http = localStorage.getItem('whiteList')
    if (http && http != 'undefined') {
      this.form.httpTxt = http
    }
  },
  methods: {
    toBack() {
      this.$router.back()
    },
    addNetList() {
      localStorage.removeItem('whiteList')
      localStorage.setItem('whiteList', this.form.httpTxt)
      this.$refs.confirm.showConfirm()
    },
    sure() {
      this.$router.push('/Home')
      window.close()
    },
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
