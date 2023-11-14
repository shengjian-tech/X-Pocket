<template>
  <div>
    <div class="container">
      <div style="text-align: center">
        <img src="../assets/headerlogo.png" class="img-logo" />
      </div>
      <img src="../assets/planet.png" class="img-planet" />
      <p class="title">{{ $t('pwdLogin.title') }}</p>
      <p class="sub-title">{{ $t('pwdLogin.subTitle') }}</p>
      <div class="content">
        <input
          type="password"
          v-model="password"
          :placeholder="$t('pwdLogin.placeholder')"
        />
        <div class="bottom">
          {{ $t('pwdLogin.tips') }}
          <span>{{ $t('pwdLogin.forget') }}</span>
        </div>
        <div class="btn" @click="getLogin">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>

    <div class="login" style="display: none">
      <div class="headerDefoult">
        <img src="../assets/testlogo.png" alt="" />
        <div>Your Daily Space for Connecting</div>
        <div>Daily Digital Asset</div>
      </div>
      <!-- xuper -->
      <div class="setLoginFrom">
        <h3>密码</h3>
        <div class="write">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入密码" v-model="password" type="text">
            </el-input>
          </div>
        </div>

        <div class="submit">
          <el-button @click="getLogin" class="submitBtn" type="primary" round
            >登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import PromptPopup from '@/components/PromptPopup.vue'
import CryptoJS, { enc, AES } from 'crypto-js'
export default {
  name: 'Login',
  data() {
    return {
      state: this.$route.query.state,
      password: '',
    }
  },
  components: { Header, PromptPopup },
  mounted() {},
  methods: {
    //开放网络
    getLogin() {
      if (!this.password) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg28'), 'warning', 2500)
      } else {
        // let acc = JSON.parse(localStorage.getItem('currentAccont'))
        // let closepwd = localStorage.getItem('closepwd')
        // let randomString = localStorage.getItem('randS')
        // console.log(acc, '**acc**')
        // console.log(randomString, '**randomString**')

        // 解密AES字符串
        // const decryptedString = AES.decrypt(randomString, acc?.address)
        // console.log(decryptedString, '***解密未处理***')
        // let decryptedBytes = []
        // for (let i = 0; i < decryptedString.sigBytes; i += 4) {
        //   let word = decryptedString.words[i >>> 2]
        //   for (let j = 3; j >= 0; j--) {
        //     decryptedBytes.push((word >>> (j * 8)) & 0xff)
        //   }
        // }

        // 将字节数组转换为字符串（假设使用UTF-8编码）
        // let originalString = new TextDecoder().decode(
        //   Uint8Array.from(decryptedBytes)
        // )

        // console.log(originalString, '***解密后的字符串***')

        // 输入的密码加密后与存储的密码进行对比
        // let hashBuffer = CryptoJS.SHA512(this.password, originalString)
        let hashBuffer = CryptoJS.SHA512(this.password)
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

        let currentPwd = btoa(hashHex)

        if (closepwd === currentPwd) {
          // 一致通过
          localStorage.setItem('closeState', false)
          this.$router.push('/Home')
        } else {
          // 不一致密码错误
          this.$refs.prompt.showToast(this.$t('toastMsg.msg27'), 'error', 2500)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.img-logo {
  width: 32px;
  margin-top: 20px;
}
.img-planet {
  width: 245px;
  margin-top: 18px;
}
.title {
  font-size: 18px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #ffffff;
  margin-top: 26px;
}
.sub-title {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 7px;
}
.content {
  padding: 0 38px;
  input {
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
    height: 20px;
    margin-top: 55px;
  }
  input::-webkit-input-placeholder {
    color: #919397;
  }
  .bottom {
    border-top: 2px solid rgba(255, 255, 255, 0.1);
    margin-top: 10px;
    padding-top: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    span {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #00e5c4;
      cursor: pointer;
    }
  }
  .btn {
    width: 225px;
    height: 45px;
    background: linear-gradient(90deg, #00e5c4 0%, #0078e5 100%);
    text-align: center;
    line-height: 45px;
    cursor: pointer;
    font-size: 15px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
    margin-top: 27px;
    border-radius: 30px;
  }
}
</style>
