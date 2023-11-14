<template>
  <div class="header-nav">
    <div class="cover-box" v-if="showInfo || showList" @click="hideCover"></div>
    <div class="avator-box">
      <div class="img-box" @click="infoHandle">
        <img src="../assets/headerlogo.png" />
      </div>
      <div class="info-list" v-if="showInfo">
        <p>{{ $t('home.myAccount') }}</p>
        <ul class="account-ul">
          <li
            v-for="(item, index) in accountAllList"
            :key="index"
            @click="changeAccount(item)"
          >
            <span>{{ index + 1 }}:</span>
            <div class="flex1">
              {{ plusXing(item.address, 10, 10) }}
            </div>
          </li>
        </ul>
        <ul class="list-ul">
          <li @click="handleCommand('a')">
            <img src="../assets/img-add.png" />
            <div class="flex1">{{ $t('home.newAddress') }}</div>
          </li>
          <li @click="handleCommand('i')">
            <img src="../assets/img-link.png" />
            <div class="flex1">{{ $t('home.linkDetails') }}</div>
          </li>
          <li @click="handleCommand('c')">
            <img src="../assets/img-set.png" />
            <div class="flex1">{{ $t('home.set') }}</div>
          </li>
        </ul>
        <div class="btn-wrapper">
          <div class="btn btn-comm" @click="goLock()">
            {{ $t('home.btnLock') }}
          </div>
          <div class="btn-comm" @click="goout()">{{ $t('home.btnOut') }}</div>
        </div>
      </div>
    </div>
    <div class="flex1">
      <div class="select-box" @click="listHandle">
        <img :src="netObj[sign]" class="chain-logo" />
        <div class="flex1">{{ value }}</div>
        <img src="../assets/img-right.png" class="img-down" />
      </div>
      <ul class="chain-list" v-if="showList">
        <li
          v-for="(item, index) in options"
          :key="index"
          @click="getSelect(index, item)"
        >
          <img :src="netObj[item.sign]" class="chain-logo" />
          <div class="flex1">{{ item.netName }}</div>
          <img
            src="../assets/img-checked.png"
            class="img-down"
            v-if="choseNet == item.netName"
          />
          <img src="../assets/img-check.png" class="img-down" v-else />
        </li>
        <li @click="goAddNet()">
          <img src="../assets/img-add.png" class="chain-logo" />
          <div class="flex1">{{ $t('home.addNet') }}</div>
        </li>
      </ul>
    </div>
    <prompt-popup ref="prompt"></prompt-popup>
    <confirm-popup ref="confirm" @confirm="sure" :title="$t('comm.tips')">{{
      $t('toastMsg.msg9')
    }}</confirm-popup>
  </div>
</template>
<script>
import { plusXing } from '../assets/js/index'
import { clearStorage } from '@/utils/setStorage'
import { getLocalAccont } from '@/utils/popup'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'
export default {
  data() {
    return {
      addressInfo: '',
      visible: false,
      addForm: {
        name: '',
        contractName: '',
        methodName: '',
        formValue: [],
      },
      showInfo: false,
      showList: false,
      options: [
        {
          netName: 'XuperOS',
          node: 'https://xuper.baidu.com/nodeapi',
          chain: 'xuper',
          type: 'xuper',
          imgUrl: require('../assets/img-eth.png'),
        },
      ],
      value: 'XuperOS',
      accountAllList: [],
      choseNet: '',
      sign: '',
      netObj: {
        xuper: require('../assets/img-x.png'),
        eth: require('../assets/img-eth.png'),
        polygon: require('../assets/img-polygon.png'),
      },
    }
  },
  components: {
    ConfirmPopup,
    PromptPopup,
  },
  mounted() {
    console.log('header------mounted')
    //设置默认网络
    let netList = JSON.parse(localStorage.getItem('netList'))
    this.options = JSON.parse(localStorage.getItem('netList'))
    let acc = JSON.parse(localStorage.getItem('currentAccont'))
    let closeState = localStorage.getItem('closeState')
    let closepwd = localStorage.getItem('closepwd')
    console.log(closeState, '**closeState**')
    console.log(closepwd, '**closepwd**')
    console.log(acc, '**acc**')
    if (acc) {
      if (closeState == true && closepwd) {
        this.$router.push('/pwdLogin')
      } else {
        this.value = acc.type == 'xuper' ? 'XuperOS' : 'Ethereum'
        this.sign = acc.type == 'xuper' ? 'xuper' : 'eth'
        this.choseNet = this.value
        console.log(this.value)
        if (localStorage.getItem('accountAllList')) {
          this.accountAllList = JSON.parse(
            localStorage.getItem('accountAllList')
          )
        }
        this.addressInfo = plusXing(
          JSON.parse(localStorage.getItem('currentAccont')).address,
          5,
          5
        )
        getLocalAccont()
        if (acc.type == 'xuper') {
          localStorage.setItem('currentNet', JSON.stringify(netList[0]))
          // sendAccont('eth_requestAccounts',JSON.parse(localStorage.getItem("currentAccont")).address,"baidu")
        } else if (acc.type == 'eth') {
          // sendAccont('eth_requestAccounts',JSON.parse(localStorage.getItem("currentAccont")).address)
          localStorage.setItem('currentNet', JSON.stringify(netList[1]))
        }
      }
    } else {
      this.$router.push('/Login')
    }
  },

  methods: {
    plusXing,
    infoHandle() {
      this.showInfo = !this.showInfo
    },
    listHandle() {
      this.showList = !this.showList
    },
    hideCover() {
      this.showInfo = false
      this.showList = false
    },
    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: '', label: '' })
    },
    getSetting() {
      this.$router.push('/Home')
    },
    goAddNet() {
      this.$router.push('/Addnet')
    },
    //新增操作
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var localArr = {
            addList: [],
          }
          if (localStorage.getItem('addForm')) {
            localArr.addList = JSON.parse(
              localStorage.getItem('addForm')
            ).addList
            localArr.addList.push(this.addForm)
            localStorage.setItem('addForm', JSON.stringify(localArr))
          } else {
            localArr.addList.push(this.addForm)
            localStorage.setItem('addForm', JSON.stringify(localArr))
          }
          this.visible = false
          window.location.reload()
        } else {
          return false
        }
      })
    },
    //退出
    getOut() {
      localStorage.clear()
      this.$router.replace('/Login')
    },
    goMakerOne() {
      window.location.href =
        'https://makerone.shengjian.net/front_nft_mobileN/nft_mobileN_home'
    },

    //判断数据
    getSelect(value, item) {
      console.log(value, '**value***')
      //切换网络，先看看 是否存在同类型网络账户，如果没有，前去登录。
      let that = this
      let accountList = JSON.parse(localStorage.getItem('acc'))
      let netList = JSON.parse(localStorage.getItem('netList'))
      console.log(netList, '**netList**')
      let type = netList[value].type
      this.choseNet = item.netName
      this.value = item.netName
      this.sign = item.sign

      let mapresult = accountList.some(function (item) {
        return item.type == type
      })
      console.log(mapresult, '**mapresult**')
      if (!mapresult) {
        //不存在同网络类型账户,前去登录
        this.$router.push({
          path: '/login',
          query: { state: 1, stateName: type },
        })
        this.showList = false
      } else {
        that.accountAllList = [] //符合当前网络类型的 账户列表
        accountList.map((item) => {
          if (item.type == type) {
            that.accountAllList.push(item)
          }
        })
        localStorage.setItem(
          'accountAllList',
          JSON.stringify(that.accountAllList)
        )
        this.$emit(
          'transfer',
          JSON.parse(localStorage.getItem('accountAllList'))[0],
          netList[value]
        )
        this.showList = false
      }
      //存一下正在使用的网络
      localStorage.setItem('currentNet', JSON.stringify(netList[value]))
    },

    //锁定
    goLock() {
      let closepwd = localStorage.getItem('closepwd')
      if (closepwd) {
        localStorage.setItem('closeState', true)
        this.$router.push('/pwdLogin')
      } else {
        this.$refs.prompt.showToast(this.$t('comm.msg10'), 'warning', 2500)
        this.$router.push('/SetPassword')
      }
    },

    handleCommand(command) {
      console.log(command, '**command**')
      if (command == 'a') {
        this.$router.push({ path: '/', query: { state: 1 } })
      } else if (command == 'b') {
        this.$refs.prompt.showToast(this.$t('comm.msg11'), 'warning', 2500)
      } else if (command == 'c') {
        this.$router.push('/Set')
      } else if (command == 'i') {
        this.$router.push('/connectList')
      }
    },

    //给父组件传递消息
    changeAccount(item, net) {
      console.log(item, '**item**')
      this.$emit('transfer', item, net)
      this.showInfo = false
      // window.location.reload();
    },

    //goout
    goout() {
      this.$refs.confirm.showConfirm()
    },
    sure() {
      //退出
      localStorage.clear()
      clearStorage()
      this.$router.push('/login')
    },
  },
}
</script>
<style lang="less" scoped>
.header-nav {
  display: flex;
  align-items: center;
  padding-top: 26px;
  .avator-box {
    position: relative;
    .img-box {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .info-list {
      position: absolute;
      z-index: 99;
      width: 252px;
      left: 0;
      top: 44px;
      backdrop-filter: blur(6px);
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 10px;
      overflow: hidden;
      padding: 15px;
      text-align: left;
      p {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
      }
      .account-ul {
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        li {
          display: flex;
          align-items: center;
          padding: 8px 0;
          cursor: pointer;
          span {
            font-size: 12px;
            color: white;
          }
          .flex1 {
            flex: 1;
            font-size: 12px;
            color: white;
          }
        }
      }
      .list-ul {
        margin: 18px 0 0 0;
        padding: 0;
        li {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;
          img {
            width: 12px;
            height: 12px;
          }
          .flex1 {
            flex: 1;
            padding-left: 8px;
            font-size: 12px;
            font-family: Arial-Regular, Arial;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
      .btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn-comm {
          height: 30px;
          width: 100px;
          line-height: 30px;
          overflow: hidden;
          border-radius: 15px;
          font-size: 12px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
          box-sizing: border-box;
          cursor: pointer;
        }
        .btn-comm:last-child {
          font-size: 12px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
          color: white;
          background: #252429;
          text-align: center;
        }
      }
    }
  }
  .flex1 {
    flex: 1;
    padding-left: 14px;
    position: relative;
    .select-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow: hidden;
      height: 38px;
      padding: 0 12px;
      cursor: pointer;
      .chain-logo {
        width: 18px;
        height: 18px;
      }
      .flex1 {
        flex: 1;
        padding-left: 8px;
        font-size: 12px;
        font-family: Open Sans-Regular, Open Sans;
        font-weight: 400;
        color: #ffffff;
        text-align: left;
      }
      .img-down {
        width: 10px;
      }
    }
    .chain-list {
      position: absolute;
      width: 200px;
      right: 0;
      top: 44px;
      margin: 0;
      z-index: 99;
      li {
        display: flex;
        align-items: center;
        height: 38px;
        overflow: hidden;
        padding: 10px 12px;
        backdrop-filter: blur(6px);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        .flex1 {
          flex: 1;
          color: white;
          padding-left: 10px;
          font-size: 12px;
          font-family: Open Sans-Regular, Open Sans;
          font-weight: 400;
          text-align: left;
        }
        .img-down {
          width: 8px;
          height: 8px;
        }
      }
    }
  }
  .cover-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 98;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0);
  }
}
</style>
