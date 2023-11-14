<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ $t('rsa.name') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('rsa.name') }}</span>
            </div>
            <textarea
              v-model="form.password"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="addNetList">{{ $t('comm.confirm') }}</div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>
      <confirm-popup
        ref="confirm"
        :title="$t('comm.tips')"
        @confirm="sure"
        @cancel="sure"
      >
        {{ $t('toastMsg.msg17') }}
      </confirm-popup>
    </div>

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>设置RSA密钥
      </div>
      <div class="form setpwdForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <span class="inputlabel">设置RSA密钥</span>
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 8 }"
              v-model="form.password"
              placeholder="请设置RSA-SHA256私钥"
            ></el-input>
          </el-form-item>

          <el-form-item class="setPwdBtnFath">
            <el-button
              class="addNetBtn"
              type="primary"
              round
              @click="addNetList()"
              >设置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import PromptPopup from '@/components/PromptPopup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
export default {
  name: 'setRsa',
  data() {
    return {
      form: {
        password: '',
        norpwd: '',
      },
      netList: JSON.parse(localStorage.getItem('netList')),
    }
  },
  components: { Header, PromptPopup, ConfirmPopup },
  mounted() {},
  methods: {
    toBack() {
      this.$router.back()
    },
    goHome() {
      this.$router.push('/Home')
    },
    sure() {
      localStorage.setItem(
        'privateKeyPem',
        this.form.password.replace(/\n/g, '\\n')
      )
      this.$router.push('/Set')
    },
    addNetList() {
      console.log(this.form)
      if (!this.form.password) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg14'),
          'warning',
          1500
        )
      }
      this.$refs.confirm.showConfirm()
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
