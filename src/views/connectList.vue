<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ $t('home.linkDetails') }}</span>
      </div>
      <div class="content">
        <div class="comm-request">
          <img :src="favIconUrl" />
          <p>{{ url }}</p>
        </div>
        <p class="link-info">
          {{ $t('linkDetails.title') }}
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
                $t('linkDetails.current')
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
        <div class="btn" @click="editUrl">{{ $t('comm.confirm') }}</div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>
    </div>

    <div class="connect" style="display: none">
      <div class="connectBox">
        <div class="connectTit">连接详情</div>
        <div>
          <img :src="favIconUrl" />
          <div>{{ url }}</div>
        </div>
        <div class="conten">
          已授权该站点访问区块链网络信息、链账户信息、以及发起交易申请的权限。
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
        <el-button class="width110" round @click="closeWindow">关闭</el-button>
        <el-button
          class="width110 color7657b1"
          type="primary"
          round
          @click="editUrl"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getTab } from '@/utils/popup'
import { plusXing } from '../assets/js/index'
import PromptPopup from '@/components/PromptPopup.vue'
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
  components: { PromptPopup },
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
    toBack() {
      this.$router.push('/Home')
    },
    getTap() {
      getTab().then((res) => {
        console.log(res)
        this.connect = res
        this.favIconUrl = res.favIconUrl
        this.url = res.url
        let connectList = JSON.parse(localStorage.getItem('connectList'))
          ? JSON.parse(localStorage.getItem('connectList'))
          : []
        connectList.forEach((element) => {
          if (element.url == this.url) {
            this.activeItem = element.accountList
          }
        })
      })
    },
    plusXing(val) {
      return plusXing(val, 5, 10)
    },
    active(item) {
      this.currentS = []
      let index = this.activeItem.findIndex((obj) => {
        return obj.address == item.address
      })
      console.log(index, '**index**')
      if (index == -1) {
        this.activeItem.push(item)
        this.currentS.push(item.address)
      } else {
        this.activeItem.splice(index, 1)
        this.currentS.splice(item.address, 1)
      }
      console.log(this.currentS, '****currentS****')
      console.log(this.activeItem, '***activeItem***')
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
    closeWindow() {
      this.$router.go(-1)
    },
    editUrl() {
      if (this.activeItem.length == 0) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg12'), 'warning', 2500)
        return
      }
      let connectList = JSON.parse(localStorage.getItem('connectList'))
        ? JSON.parse(localStorage.getItem('connectList'))
        : []
      connectList.forEach((element) => {
        if (element.url == this.url) {
          element.accountList = this.activeItem
        }
      })
      localStorage.setItem('connectList', [JSON.stringify(connectList)])
      this.$refs.prompt.showToast(this.$t('toastMsg.msg13'), 'success', 2500)
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 26px 25px;
  text-align: left;
  .link-info {
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    color: #ffffff;
    text-align: center;
    line-height: 26px;
    padding: 0 2px;
  }
  .link-http {
    text-align: center;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 10px;
    margin-bottom: 32px;
    word-break: break-all;
  }
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
.btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 37px;
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
