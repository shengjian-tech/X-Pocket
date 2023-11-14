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

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>设置密码
      </div>
      <div class="form setpwdForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <span class="inputlabel">设置密码</span>
            <el-input
              v-model="form.password"
              placeholder="请设置密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="inputlabel">确认密码</span>
            <el-input
              v-model="form.norpwd"
              placeholder="请再次输入密码"
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
import { getPrivateKey } from '@/utils/decryptKey'
import CryptoJS, { enc, AES } from 'crypto-js'

export default {
  name: 'Netlist',
  data() {
    return {
      form: {
        password: '',
        norpwd: '',
      },
      netList: JSON.parse(localStorage.getItem('netList')),
      isShow: false,
      isShow2: false,
    }
  },
  components: { Header, PromptPopup, ConfirmPopup },
  mounted() {},
  methods: {
    goHome() {
      this.$router.push('/Set')
    },
    addNetList() {
      // console.log(this.form)
      if (!this.form.password || !this.form.norpwd) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg14'),
          'warning',
          2500
        )
      }
      if (this.form.password !== this.form.norpwd) {
        return this.$refs.prompt.showToast(
          this.$t('toastMsg.msg16'),
          'warning',
          2500
        )
      }
      this.$refs.confirm.showConfirm()
    },

    // 随机生成32位字符串
    generateRandomString() {
      let characters =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomString = ''
      for (let i = 0; i < 32; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length)
        randomString += characters.charAt(randomIndex)
      }
      return new Promise((resolve) => resolve(randomString))
    },

    async sure() {
      // 密码SHA512加密
      let str = await this.generateRandomString()
      // console.log(str, '**随机生成的字符串***')
      let hashBuffer = CryptoJS.SHA512(this.form.password, str)
      let byteArray = []
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

      let acc = JSON.parse(localStorage.getItem('currentAccont'))

      // 设置完后再用随机字符串进行私钥加密
      // 先解密私钥
      if (acc) {
        const privateKey = await getPrivateKey()
        // let privateKey = AES.decrypt(acc.privateKey, acc.address).toString(
        //   enc.Utf8
        // )
        // console.log(privateKey, '***解密后的私钥*****')

        // 再加密私钥（用随机字符串）
        const encipherKey = AES.encrypt(privateKey, str).toString()
        // 随机字符串AES加密
        const randS = AES.encrypt(str, acc?.address).toString()
        // console.log(randS, '***加密后的字符串***')
        // localStorage.setItem('randS', randS)
        // console.log(encipherKey, '***用字符串加密后的私钥***')
        acc.privateKey = encipherKey
        acc.rString = randS
        localStorage.removeItem('currentAccont')
        // 重新缓存私钥
        localStorage.setItem('currentAccont', JSON.stringify(acc))
      }

      this.$router.push('/Set')
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
