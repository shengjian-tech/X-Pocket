<template>
  <div>
    <div class="container">
      <div class="header">
        <span class="nav-title">{{ $t('link.title') }}</span>
      </div>
      <div class="comm-request">
        <img :src="favIconUrl" />
        <p>{{ url }}</p>
      </div>
      <div class="content">
        <p class="intro-txt">
          {{ $t('link.intro') }}
        </p>
        <div
          class="current-link"
          v-for="(item, index) in accountAllList"
          :key="index"
          @click="active(item)"
        >
          <div class="chain-circle">
            <img src="../assets/img-eth.png" v-if="item.type == 'eth'" />
            <img src="../assets/img-x.png" v-if="item.type == 'xuper'" />
          </div>
          <div class="flex1">
            <p>
              {{ item.type }}
              <span v-if="item.address == currentAccont.address">{{
                $t('comm.current')
              }}</span>
            </p>
            <p>{{ plusXing(item.address) }}</p>
          </div>
          <img
            src="../assets/img-checked.png"
            v-if="currentS.includes(item.address)"
          />
          <img src="../assets/img-check.png" v-else />
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="closeWindow">{{ $t('comm.refuse') }}</div>
        <div class="btn" @click="addUrl">{{ $t('comm.confirm') }}</div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>

    <div class="connect" style="display: none">
      <div class="connectBox">
        <div class="connectTit">请求授权连接</div>
        <div>
          <img :src="favIconUrl" />
          <div>{{ url }}</div>
        </div>
        <div class="conten">
          申请建立连接，授权后将允许该站点访问区块链网络信息、链账户信息、以及发起交易申请的权限。
        </div>
        <div class="accList">
          <div
            v-for="(item, index) in accountAllList"
            :key="index"
            @click="active(item)"
            class="listBox"
          >
            <div class="iconBox">
              <i class="el-icon-wallet" :style="{ color: color[index] }"></i>
            </div>
            <div>
              <div class="listType">
                {{ item.type }}
                <span
                  v-if="item.address == currentAccont.address"
                  style="color: #1e832a"
                  >当前</span
                >
              </div>
              <div class="listAddress">{{ plusXing(item.address) }}</div>
            </div>
            <div class="leftIconBox" v-show="iconShow(item)">
              <i class="el-icon-circle-check" style="color: #67c23a"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="btnBox">
        <el-button class="width110" round @click="closeWindow">拒绝</el-button>
        <el-button
          class="width110 color7657b1"
          type="primary"
          round
          @click="addUrl"
          >授权连接</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import PromptPopup from '@/components/PromptPopup.vue'
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
export default {
  data() {
    return {
      favIconUrl: '',
      url: '',
      color: ['#744f68', '#788890', '#ebd40a', '#1e832a', '#abb7bc'],
      connect: null,
      activeItem: [],
      currentS: [],
    }
  },
  components: {
    PromptPopup,
  },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem('acc'))
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem('currentAccont'))
    },
  },
  mounted() {
    this.getTap()
  },
  methods: {
    getTap() {
      getTab().then((res) => {
        console.log(res)
        this.connect = res
        this.favIconUrl = res.favIconUrl
        this.url = res.url
        this.getActiveItem()
      })
    },
    plusXing(val) {
      return plusXing(val, 5, 10)
    },
    closeWindow() {
      window.close()
    },
    active(item) {
      this.currentS = []
      let index = this.activeItem.findIndex((obj) => {
        return obj.address == item.address
      })
      if (index == -1) {
        this.activeItem.push(item)
        this.currentS.push(item.address)
      } else {
        this.activeItem.splice(index, 1)
        this.currentS.splice(item.address, 1)
      }
      console.log(this.activeItem)
    },
    iconShow(item) {
      let index = this.activeItem.findIndex((obj) => {
        return obj.address == item.address
      })
      if (index == -1) {
        return false
      } else {
        return true
      }
    },
    addUrl() {
      if (this.activeItem.length == 0) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg12'), 'warning', 2500)
        return
      }
      let connectList = JSON.parse(localStorage.getItem('connectList'))
        ? JSON.parse(localStorage.getItem('connectList'))
        : []
      this.connect.accountList = this.activeItem
      connectList.push(this.connect)
      localStorage.setItem('connectList', [JSON.stringify(connectList)])
      this.$router.push('/Home')
    },
    getActiveItem() {
      let connectList = JSON.parse(localStorage.getItem('connectList'))
        ? JSON.parse(localStorage.getItem('connectList'))
        : []
      let nowConnect = connectList.find((item) => {
        return this.url == item.url
      })
      this.activeItem = nowConnect?.accountList || []

      // 如果只有一个账户的话就默认选中
      let acc = JSON.parse(localStorage.getItem('acc'))
      if (acc && acc.length == 1) {
        this.activeItem = acc
        this.currentS.push(acc[0].address)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 25px;
  text-align: left;
  .other-cont {
    margin-top: 10px;
    .other-logo {
      width: 32px;
    }
    .other-url {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .intro-txt {
    font-size: 16px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    line-height: 29px;
    text-align: center;
    margin-bottom: 20px;
  }
  .current-link {
    display: flex;
    align-items: center;
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 8px;
    overflow: hidden;
    padding: 0 15px 0 8px;
    cursor: pointer;
    .chain-circle {
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
      p {
        color: white;
        font-size: 14px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        span {
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #00e5c4;
          position: relative;
          top: -1px;
          left: 5px;
        }
      }
      p:last-child {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 5px;
      }
    }
  }
  .intro-txt {
    font-size: 16px;
    font-family: Arial-Bold, Arial;
    // font-weight: bold;
    color: #ffffff;
    line-height: 29px;
    margin-top: 10px;
  }
  .current-box {
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-top: 37px;
    padding: 0 15px;
    .img-circle {
      width: 32px;
      height: 32px;
      background: #262636;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .flex1 {
      flex: 1;
      overflow: hidden;
      padding-left: 8px;
      text-align: left;
      span {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: #00e5c4;
      }
      p {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 5px;
      }
    }
  }
  .msg-box {
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    height: 165px;
    overflow: hidden;
    padding: 0 15px;
    p {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      margin: 15px 0;
    }
    .msg-cont {
      flex: 1;
      overflow-y: auto;
      word-break: break-all;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      line-height: 14px;
    }
    .line {
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin: 20px 0;
    }
  }
}
.btn-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 38px 25px 38px;
  .btn {
    width: 102px;
    height: 31px;
    background: #414147;
    border-radius: 25px;
    text-align: center;
    line-height: 31px;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
  }
  .btn:last-child {
    background: linear-gradient(270deg, #0078e5 0%, #00e5c4 100%);
  }
}
</style>
