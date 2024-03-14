<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('set.title') }}</span>
      </div>
      <div class="content">
        <ul>
          <li @click="setPwd">
            <div class="circle">
              <img src="../assets/img-setpwd.png" />
            </div>
            <div class="flex1">{{ $t('set.setPwd') }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
          <!-- <li>
            <div class="circle">
              <img src="../assets/img-http.png" />
            </div>
            <div class="flex1">{{ $t('set.dns') }}</div>
            <img
              src="../assets/img-switch-on.png"
              v-if="currentStatus == 'on'"
              @click="switchHandle('off')"
            />
            <img
              src="../assets/img-switch.png"
              v-else
              @click="switchHandle('on')"
            />
          </li> -->
          <li @click="setRsa">
            <div class="circle">
              <img src="../assets/img-rsa.png" />
            </div>
            <div class="flex1">{{ $t('set.certificate') }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
          <li @click="setLanguage">
            <div class="circle">
              <img src="../assets/img-language.png" />
            </div>
            <div class="flex1">{{ $t('set.language') }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
          <li @click="setNet">
            <div class="circle">
              <img src="../assets/img-eth.png" class="img-right" />
            </div>
            <div class="flex1">{{ $t('set.mNet') }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
          <li @click="setWhiteList">
            <div class="circle">
              <img src="../assets/white-list.png" class="img-right" />
            </div>
            <div class="flex1">{{ $t('set.whiteList') }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
        </ul>
      </div>
      <div class="versions">
        {{ $t('set.version') }} X-Pocket v{{ version }}
      </div>
    </div>

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>设置
      </div>
      <div class="setList">
        <div @click="setNet">
          <i class="el-icon-s-operation"></i>管理网络<i
            class="el-icon-arrow-right"
          ></i>
        </div>
        <div @click="setPwd">
          <i class="el-icon-lock"></i>设置密码<i
            class="el-icon-arrow-right"
          ></i>
        </div>
        <div class="elright">
          <div><i class="el-icon-view"></i>域名解析</div>
          <el-switch
            v-model="value"
            @change="getChange"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
          >
          </el-switch>
        </div>
        <div @click="setRsa">
          <i class="el-icon-s-help"></i>RSA-SHA256证书设置<i
            class="el-icon-arrow-right"
          ></i>
        </div>
        <!--  <div>
        <i class="el-icon-view"></i>安全隐私<i class="el-icon-arrow-right"></i>
      </div>
      <div>
        <i class="el-icon-warning-outline"></i>关于<i
          class="el-icon-arrow-right"
        ></i>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
export default {
  name: 'Set',
  data() {
    return {
      value: false,
      currentStatus: 'off',
      version: process.env.VUE_APP_POCKET_VERSION,
    }
  },
  components: { Header },
  created() {
    let that = this
    chrome.storage.local.get(['key'], function (result) {
      that.value = result.key
      that.currentStatus = result.key ? 'on' : 'off'
      console.log('Value retrieved:', that.value)
    })
  },
  methods: {
    goHome() {
      this.$router.push('/Home')
    },
    setNet() {
      this.$router.push('/Netlist')
    },
    setLanguage() {
      this.$router.push('/languageSwitch')
    },
    setPwd() {
      this.$router.push('/SetPassword')
    },
    setRsa() {
      this.$router.push('/setrsa')
    },
    setWhiteList() {
      this.$router.push('/setWhiteList')
    },
    getChange(v) {
      console.log(v)
      chrome.storage.local.set({ key: v }, function () {
        console.log('Data saved.')
      })
    },
    // switchHandle(i) {
    //   console.log(i, '***i****')
    //   this.currentStatus = i
    //   let v = false
    //   if (this.currentStatus == 'on') {
    //     v = true
    //   } else {
    //     v = false
    //   }
    //   console.log(v, '***v***')
    //   chrome.storage.local.set({ key: v }, function () {
    //     console.log('Data saved.')
    //   })
    // },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 22px 25px;
  text-align: left;
  ul {
    li {
      display: flex;
      align-items: center;
      height: 47px;
      background: rgba(255, 255, 255, 0.1);
      margin-bottom: 8px;
      padding: 0 15px 0 8px;
      overflow: hidden;
      border-radius: 8px;
      cursor: pointer;
      .circle {
        width: 32px;
        height: 32px;
        background: #262636;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .flex1 {
        flex: 1;
        padding-left: 8px;
        font-size: 12px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        color: #ffffff;
      }
      .img-right {
        width: 14px;
        height: 14px;
      }
    }
  }
}
.versions {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  color: white;
}
</style>
