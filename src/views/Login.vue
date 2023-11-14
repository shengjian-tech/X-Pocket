<template>
  <div class="container">
    <img src="../assets/img-bg.png" class="bg-img2" />
    <div class="header">
      <img src="../assets/img-back.png" class="img-back" @click="toBack" />
      <img class="logo-img" src="../assets/headerlogo.png" />
    </div>
    <div class="content">
      <div class="select">
        <div class="comm-logo">
          <img :src="selectVal.imgUrl" />
        </div>
        <div class="flex1">{{ selectVal.name }}</div>
        <img src="../assets/img-checked.png" />
      </div>
      <!-- xuper os -->
      <template v-if="selectVal.value == 'xuper'">
        <img
          src="../assets/planet.png"
          class="xuperAnimate"
          :class="[xuperKey ? 'xuperA2' : '', nowXuper ? '' : 'xuperA1']"
        />
        <template v-if="isXuperKey">
          <div class="comm-pw">
            <p>{{ $t('login.localKeyPath') }}</p>
            <div class="copy-box">
              <input
                type="text"
                v-model="private_key"
                :placeholder="$t('comm.placeholder')"
              />
              <img
                src="../assets/img-upload.png"
                class="file-btn"
                @click="clickLoad"
              />
              <input
                type="file"
                id="files"
                ref="refFile"
                style="display: none"
                @change="fileLoad"
              />
            </div>
            <div class="bottom">
              <a
                class="tips"
                href="https://xuper.baidu.com/n/console#/xuperos/info"
                target="_blank"
                >{{ $t('login.tips') }}</a
              >
              <span @click="xuperSwitch(1)">{{ $t('login.codeLogin') }}</span>
            </div>
          </div>
          <div class="comm-pw">
            <p>{{ $t('login.code') }}</p>
            <div class="copy-box">
              <input
                type="password"
                v-model="password"
                :placeholder="$t('comm.placeholder')"
              />
            </div>
          </div>
        </template>
        <div class="comm-pw" v-else>
          <p>{{ $t('login.word') }}</p>
          <div class="copy-box">
            <input
              type="password"
              v-model="password"
              :placeholder="$t('comm.placeholder')"
            />
          </div>
          <div class="bottom">
            <span></span>
            <span @click="xuperSwitch(2)">{{ $t('login.keyLogin') }}</span>
          </div>
        </div>
      </template>

      <!-- ethereum -->
      <template v-if="selectVal.value == 'eth'">
        <img
          src="../assets/planet.png"
          class="ethAnimate"
          :class="[!isEthKey ? 'ethA2' : '', nowEth ? '' : 'ethA1']"
        />
        <div class="comm-pw">
          <p>{{ !isEthKey ? $t('login.word') : $t('login.key') }}</p>
          <div class="copy-box">
            <input
              type="text"
              v-model="privateKey"
              :placeholder="
                isEthKey
                  ? $t('pwdLogin.placeholder')
                  : $t('pwdLogin.placeholder2')
              "
            />
            <img
              src="../assets/img-copy.png"
              class="file-btn"
              :data-clipboard-text="privateKey"
              @click="copypwd()"
            />
          </div>
          <div class="bottom">
            <div class="create-key" @click="createPkey()" v-if="isEthKey">
              <img src="../assets/img-add.png" />{{ $t('login.createKey') }}
            </div>
            <span v-else></span>
            <span @click="swithkey">{{
              !isEthKey ? $t('login.keyLogin') : $t('login.codeLogin')
            }}</span>
          </div>
        </div>
      </template>

      <!-- 设置密码 -->
      <div class="comm-pw">
        <p>{{ $t('setPwd.title') }}</p>
        <div class="copy-box">
          <input
            v-model="setpwd"
            :type="showPwd ? 'text' : 'password'"
            :placeholder="$t('setPwd.placeholder')"
          />
          <img
            src="../assets/img-eyes.png"
            v-if="showPwd"
            @click="showPwd = false"
          />
          <img src="../assets/img-hidden.png" v-else @click="showPwd = true" />
        </div>
        <div class="bottom">
          <span class="tips">{{ $t('setPwd.tips') }}</span>
        </div>
      </div>

      <div class="btn-wrapper">
        <div class="btn" @click="getLogin" v-if="selectVal.value == 'xuper'">
          {{ $t('comm.confirm') }}
        </div>
        <div class="btn" @click="getEthLogin" v-else>
          {{ $t('comm.confirm') }}
        </div>
      </div>
    </div>
    <prompt-popup ref="prompt"></prompt-popup>
    <confirm-popup ref="confirm" :title="$t('comm.tips')" @confirm="sure">{{
      $t('toastMsg.msg1')
    }}</confirm-popup>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import Header from '../components/Header'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'
import Clipboard from 'clipboard'
import { ethers, utils } from 'ethers'
import { routerPush } from '@/utils/popup'
import CryptoJS, { enc, AES } from 'crypto-js'

export default {
  name: 'Login',
  data() {
    return {
      showPwd: false,
      isEthKey: true,
      isXuperKey: true,
      nowEth: true,
      xuperKey: false,
      nowXuper: true,
      state: this.$route.query.state,
      private_key: '',
      password: '',
      setpwd: '',
      key: '',
      detailData: this.$route.query.detail,
      privateKey: '', //以太坊私钥
      netList: [
        {
          chain: 'xuper',
          netName: 'XuperOS',
          node: 'https://xuper.baidu.com/nodeapi',
          type: 'xuper',
          sign: 'xuper',
        },
        {
          chain: 'eth',
          netName: 'Polygon-Testnet',
          node: 'https://rpc-mumbai.maticvigil.com',
          type: 'eth',
          chainid: 80001,
          sign: 'polygon',
        },
        {
          chain: 'eth',
          netName: 'Ethereum',
          node: 'https://eth.llamarpc.com',
          // node: 'https://mainnet.infura.io/v3/6833d8eeb842734ecaa7278a0',
          type: 'eth',
          chainid: 1,
          sign: 'eth',
        },
      ],
      options: [
        {
          value: 'xuper',
          label: 'XuperOS',
        },
        {
          value: 'eth',
          label: 'Ethereum',
        },
      ],
      chainList: [
        {
          name: 'Ethereum',
          value: 'eth',
          imgUrl: require('../assets/img-eth.png'),
        },
        {
          name: 'XuperOS',
          value: 'xuper',
          imgUrl: require('../assets/img-x.png'),
        },
      ],
      selectVal: '',
      value: this.$route.query.stateName
        ? this.$route.query.stateName
        : 'xuper',
      other_state: false,
    }
  },
  components: { Header, ConfirmPopup, PromptPopup },
  mounted() {
    if (
      localStorage.getItem('currentAccont') &&
      !this.$route.query.state == 1
    ) {
      this.$router.push('/Home')
    }

    let netList = localStorage.getItem('netList')
    if (netList && netList != 'undefined') {
      localStorage.setItem('netList', netList)
    } else {
      localStorage.setItem('netList', JSON.stringify(this.netList))
    }

    let stype = this.$route.query.stateName
    if (stype && stype != 'undefined') {
      if (stype == 'eth') {
        this.selectVal = this.chainList[0]
      }
      if (stype == 'xuper') {
        this.selectVal = this.chainList[1]
      }
    } else {
      this.selectVal = this.chainList[1]
    }
  },
  methods: {
    toBack() {
      this.$router.push('/')
    },
    swithkey() {
      this.isEthKey = !this.isEthKey
      if (this.isEthKey) {
        this.nowEth = false
      }
    },
    xuperSwitch(i) {
      if (i == 1) {
        this.isXuperKey = false
        this.xuperKey = true
        this.nowXuper = true
      } else {
        this.isXuperKey = true
        this.xuperKey = false
        this.nowXuper = false
      }
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

    //复制
    copypwd() {
      var clipboard = new Clipboard('.file-btn')
      clipboard.on('success', (e) => {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg2'), 'success', 2500)
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg3'), 'warning', 2500)
        clipboard.destroy()
      })
    },

    // 创建私钥
    createPkey() {
      const wallet = ethers.Wallet.createRandom().privateKey
      // console.log(wallet)
      this.privateKey = wallet
      this.$refs.confirm.showConfirm()
    },

    goHome() {
      this.$router.push('/Home')
    },

    //切换登录方式
    // otherLogin() {
    //   this.other_state == true
    //     ? (this.other_state = false)
    //     : (this.other_state = true)
    // },

    //开放网络
    async getLogin() {
      if (
        this.private_key == '' &&
        this.selectVal.value == 'xuper' &&
        this.isXuperKey
      ) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg4'), 'warning', 2500)
      } else if (
        this.password == '' &&
        this.selectVal.value == 'xuper' &&
        !this.isXuperKey
      ) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg5'), 'warning', 2500)
      } else if (!this.setpwd) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg29'), 'warning', 2500)
      } else {
        const node = 'https://xuper.baidu.com/nodeapi'
        const chain = 'xuper'
        const params = {
          server: 'https://xuper.baidu.com/nodeapi', // ip, port
          fee: '400', // fee
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
        }
        const xsdk = new XuperSDK({
          node,
          chain,
          plugins: [
            Endorsement({
              transfer: params,
              makeTransaction: params,
            }),
          ],
        })
        let acc = null
        if (!this.isXuperKey) {
          if (this.password == '') {
            return this.$refs.prompt.showToast(
              this.$t('toastMsg.msg5'),
              'warning',
              2500
            )
          }
          acc = xsdk.retrieve(this.password, 'SimplifiedChinese')

          // 缓存助记词
          localStorage.setItem('xuperSimplifiedChinese', this.password)
        } else {
          acc = xsdk.import(this.password, this.key)
          //缓存密码和秘钥
          localStorage.setItem('xuperPassword', this.password)
          localStorage.setItem('xuperKey', this.key)
        }

        if (acc) {
          let accont
          let rString = await this.generateRandomString()
          // 对私钥进行AES加密（用随机字符串）
          const encipher = AES.encrypt(
            JSON.stringify(acc.privateKey),
            rString
          ).toString()

          // 随机字符串AES加密
          const randS = AES.encrypt(rString, acc?.address).toString()
          // console.log(randS, '***加密后的字符串***')
          // localStorage.setItem('randS', randS)

          // 加密密码
          this.encipherPwd()

          acc.type = 'xuper'
          acc.chain = 'xuper'
          acc.privateKey = encipher
          acc.rString = randS

          if (localStorage.getItem('acc')) {
            //先判断 本地有没有账户，如果有的话，就push进去
            accont = JSON.parse(localStorage.getItem('acc'))
            accont.push(acc)
          } else {
            accont = []
            accont.push(acc)
          }

          let obj = {}
          let newAcc = accont.reduce((cur, next) => {
            obj[next.address]
              ? ''
              : (obj[next.address] = true && cur.push(next))
            return cur
          }, [])

          if (localStorage.getItem('accountAllList')) {
            let accountAllList = JSON.parse(
              localStorage.getItem('accountAllList')
            )
            accountAllList.push(acc)
            localStorage.setItem(
              'accountAllList',
              JSON.stringify(accountAllList)
            )
          } else {
            let accountAllList = []
            accountAllList.push(acc)
            localStorage.setItem(
              'accountAllList',
              JSON.stringify(accountAllList)
            )
          }

          localStorage.setItem('currentAccont', JSON.stringify(acc))
          localStorage.setItem('acc', JSON.stringify(newAcc))

          //如果是调用插件进来，未登录情况下，登录后，需要跳转到对应页面。
          //begin
          if (this.detailData) {
            let data = JSON.parse(this.detailData)
            if (data.message == 'OpenNFT_transfer') {
              this.$router.push({
                path: '/Details',
                query: {
                  index: '转移资产',
                  detail: this.detailData,
                },
              })
            } else if (data.message == 'OpenNFT_demand') {
              this.$router.push({
                path: '/Details',
                query: {
                  index: '查询NFT余额',
                  detail: this.detailData,
                },
              })
            }
          } else {
            this.$router.push('/Home')
          }
          routerPush()
          //end
        } else {
          this.$refs.prompt.showToast(this.$t('toastMsg.msg6'), 'error', 2500)
        }
      }
    },

    // 以太坊 获取主账户
    async getEthLogin() {
      if (this.privateKey == '' && this.selectVal.value == 'eth') {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg5'), 'warning', 2500)
      } else if (!this.setpwd) {
        this.$refs.prompt.showToast(this.$t('toastMsg.msg29'), 'warning', 2500)
      } else {
        let accObject
        if (!this.isEthKey) {
          //助记词登录
          let mnemonic = this.privateKey
          let hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic)
          // console.log(hdnode, '***hdnode***')
          accObject = {
            address: hdnode.address,
            privateKey: hdnode.privateKey,
            publicKey: hdnode.publicKey,
            type: 'eth',
            chain: 'eth',
          }
        } else {
          //私钥登录
          const privateKey = this.privateKey
          const provider = new ethers.providers.JsonRpcProvider(
            JSON.parse(localStorage.getItem('netList'))[1].node
          )
          const wallet = new ethers.Wallet(privateKey, provider)
          let accountAddress = wallet.address
          let rString = await this.generateRandomString()
          // console.log(privateKey, '***privateKey***')
          // 对私钥进行AES加密（用随机字符串）
          const encipherKey = AES.encrypt(this.privateKey, rString).toString()

          // 随机字符串AES加密
          const randS = AES.encrypt(rString, accountAddress).toString()
          // localStorage.setItem('randS', randS)

          // 加密密码
          this.encipherPwd()

          accObject = {
            address: accountAddress,
            privateKey: encipherKey,
            publicKey: wallet.publicKey,
            type: 'eth',
            chain: 'eth',
            rString: randS,
          }
        }
        // console.log(accObject, '***accObject***')
        let acc
        if (localStorage.getItem('acc')) {
          //先判断 本地有没有账户，如果有的话，就push进去
          // console.log(JSON.parse(localStorage.getItem('acc')))
          acc = JSON.parse(localStorage.getItem('acc'))
          acc.push(accObject)
        } else {
          acc = []
          acc.push(accObject)
        }
        let obj = {}
        let newAcc = acc.reduce((cur, next) => {
          obj[next.address] ? '' : (obj[next.address] = true && cur.push(next))
          return cur
        }, [])

        localStorage.setItem('acc', JSON.stringify(newAcc))
        localStorage.setItem('currentAccont', JSON.stringify(accObject))

        this.$router.push('/Home')
        routerPush()
      }
    },

    clickLoad() {
      this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
    },
    fileLoad() {
      const that = this
      //获取读取的文件File对象
      const selectedFile = this.$refs.refFile.files[0]
      that.private_key = selectedFile.name
      var reader = new FileReader()
      reader.readAsText(selectedFile)
      reader.onload = function () {
        that.key = this.result
      }
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

    // 加密密码
    encipherPwd() {
      let hashBuffer = CryptoJS.SHA512(this.setpwd)
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
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  position: relative;
  text-align: center;
  margin-top: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  line-height: 0;
  .img-back {
    position: absolute;
    top: 0;
    left: 25px;
    width: 38px;
    height: 38px;
    z-index: 2;
    cursor: pointer;
  }
  .logo-img {
    width: 70px;
  }
}
.content {
  padding: 0 8px;
}
.select {
  display: flex;
  align-items: center;
  height: 47px;
  background: rgba(255, 255, 255, 0.1);
  padding: 0 17px 0 8px;
  border-radius: 8px;
  margin-top: 37px;
  .comm-logo {
    width: 32px;
    height: 32px;
    background: rgba(38, 38, 54, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;
    img {
      width: 18px;
    }
  }
  .flex1 {
    flex: 1;
    text-align: left;
    padding-left: 9px;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: white;
  }
}
.comm-pw {
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.2);
  text-align: left;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  p {
    margin: 0;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
  }
  .copy-box {
    display: flex;
    align-items: center;
    padding: 10px 0 14px 0;
    overflow: hidden;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    input {
      width: 100%;
      height: 20px;
      color: white;
      font-size: 18px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
    }
    .file-btn {
      width: 12px;
      flex-shrink: 0;
      cursor: pointer;
    }
    img {
      cursor: pointer;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 19px;
    .tips {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
    }
    span {
      cursor: pointer;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #00e5c4;
    }
    .create-key {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      img {
        margin-right: 5px;
        width: 12px;
      }
    }
  }
}
.btn-wrapper {
  margin-top: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
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
.ethAnimate {
  position: absolute;
  width: 126px;
  height: 126px;
  top: 217px;
  right: 128px;
  z-index: 0;
  -webkit-filter: blur(2px) brightness(0.5);
  filter: blur(2px) brightness(0.5);
}
.ethAnimate.ethA1 {
  animation: eth1 0.15s linear forwards;
}
.ethAnimate.ethA2 {
  animation: eth2 0.15s linear forwards;
}
.xuperAnimate {
  position: absolute;
  width: 126px;
  height: 126px;
  top: 197px;
  right: 87px;
  z-index: 0;
  -webkit-filter: blur(2px) brightness(0.5);
  filter: blur(2px) brightness(0.5);
}
.xuperAnimate.xuperA1 {
  animation: xuper1 0.15s linear forwards;
}
.xuperAnimate.xuperA2 {
  animation: xuper2 0.15s linear forwards;
}

@keyframes eth2 {
  0% {
    right: 128px;
    top: 217px;
    transform: rotate(-270deg);
  }
  100% {
    top: 190px;
    right: 46px;
  }
}
@keyframes eth1 {
  0% {
    top: 190px;
    right: 46px;
  }
  100% {
    right: 128px;
    top: 217px;
    transform: rotate(-270deg);
  }
}

@keyframes xuper1 {
  0% {
    right: 32px;
    top: 200px;
    transform: rotate(90deg);
  }
  100% {
    top: 197px;
    right: 87px;
  }
}
@keyframes xuper2 {
  0% {
    top: 197px;
    right: 87px;
  }
  100% {
    right: 32px;
    top: 289px;
    transform: rotate(90deg);
  }
}
</style>
