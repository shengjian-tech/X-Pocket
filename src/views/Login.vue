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
              @click="copypwd"
            />
          </div>
          <div class="bottom">
            <div class="create-key" @click="createPkey" v-if="isEthKey">
              <img src="../assets/img-add.png" />{{ $t('login.createKey') }}
            </div>
            <span v-else></span>
            <span @click="swithkey">{{
              !isEthKey ? $t('login.keyLogin') : $t('login.codeLogin')
            }}</span>
          </div>
        </div>
      </template>

      <!-- solana -->
      <template v-if="selectVal.value == 'solana'">
        <div class="comm-pw">
          <p>{{ $t('login.key') }}</p>
          <div class="copy-box">
            <input
              type="text"
              v-model="solanaPrivateKey"
              :placeholder="$t('pwdLogin.placeholder')"
            />
            <img
              src="../assets/img-copy.png"
              class="file-btn"
              :data-clipboard-text="solanaPrivateKey"
              @click="copypwd"
            />
          </div>
          <div class="bottom">
            <div class="create-key" @click="createSolanaPriviteKey">
              <img src="../assets/img-add.png" />{{ $t('login.createKey') }}
            </div>
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
        <div class="btn" @click="getEthLogin" v-if="selectVal.value == 'eth'">
          {{ $t('comm.confirm') }}
        </div>
        <div class="btn" @click="getSolanaLogin" v-if="selectVal.value == 'solana'">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { netListData } from '@/utils/staticData'
import {validatePrivateKey,getPublicKeyFromPrivateKey} from '@/utils/solana'
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { ethers } from 'ethers'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import { routerPush } from '@/utils/popup'
import CryptoJS, { AES } from 'crypto-js'
import Clipboard from 'clipboard'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import PromptPopup from '@/components/PromptPopup.vue'
import { i18n } from '@/main';

export default {
  components: { ConfirmPopup, PromptPopup },
  setup() {
    const router = useRouter()
    const showPwd = ref(false)
    const isEthKey = ref(true)
    const isXuperKey = ref(true)
    const nowEth = ref(true)
    const xuperKey = ref(false)
    const nowXuper = ref(true)
    const private_key = ref('')
    const password = ref('')
    const setpwd = ref('')
    const privateKey = ref('')
    const solanaPrivateKey = ref('')
    const solanaAddress = ref('')
    const selectVal = ref({
      name: 'XuperOS',
      value: 'xuper',
      imgUrl: require('../assets/img-x.png'),
    })
    const prompt = ref(null)
    const confirm = ref(null)
    const refFile = ref(null)
    const netList = netListData

    onMounted(() => {
      if (
        localStorage.getItem('currentAccont') &&
        !router.currentRoute.value.query.state === 1
      ) {
        router.push('/Home')
      }

      let storedNetList = localStorage.getItem('netList')
      if (storedNetList && storedNetList !== 'undefined') {
        localStorage.setItem('netList', storedNetList)
      } else {
        localStorage.setItem('netList', JSON.stringify(netList))
      }

      const stype = router.currentRoute.value.query.stateName
      if (stype && stype !== 'undefined') {
        if(stype ==='eth') {
          selectVal.value = { name: 'Ethereum', value: 'eth', imgUrl: require('../assets/img-eth.png') }
        }
        if(stype ==='xuper') {
          selectVal.value = { name: 'XuperOS', value: 'xuper', imgUrl: require('../assets/img-x.png') }
        }
        if(stype === 'solana') {
          selectVal.value = { name: 'Solana', value: 'solana', imgUrl: require('../assets/img-solana.png') }
        }
      }
    })

    const toBack = () => {
      router.push('/')
    }

    const swithkey = () => {
      isEthKey.value = !isEthKey.value
      if (isEthKey.value) {
        nowEth.value = false
      }
    }

    const xuperSwitch = (i) => {
      if (i === 1) {
        isXuperKey.value = false
        xuperKey.value = true
        nowXuper.value = true
      } else {
        isXuperKey.value = true
        xuperKey.value = false
        nowXuper.value = false
      }
    }

    const copypwd = () => {
      const clipboard = new Clipboard('.file-btn')
      clipboard.on('success', () => {
        prompt.value.showToast(i18n.global.t('toastMsg.msg2'), 'success', 2500)
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        prompt.value.showToast(i18n.global.t('toastMsg.msg3'), 'warning', 2500)
        clipboard.destroy()
      })
    }

    const createPkey = () => {
      const wallet = ethers.Wallet.createRandom().privateKey
      privateKey.value = wallet
      confirm.value.showConfirm()
    }

    const clickLoad = () => {
      refFile.value.dispatchEvent(new MouseEvent('click'))
    }

    const fileLoad = () => {
      const selectedFile = refFile.value.files[0]
      private_key.value = selectedFile.name
      const reader = new FileReader()
      reader.readAsText(selectedFile)
      reader.onload = function () {
        private_key.value = this.result
      }
    }

    const generateRandomString = () => {
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomString = ''
      for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        randomString += characters.charAt(randomIndex)
      }
      return randomString
    }

    const encipherPwd = () => {
      const hashBuffer = CryptoJS.SHA512(setpwd.value)
      const byteArray = []
      for (let i = 0; i < hashBuffer.words.length; i++) {
        const word = hashBuffer.words[i]
        byteArray.push((word >> 24) & 0xff)
        byteArray.push((word >> 16) & 0xff)
        byteArray.push((word >> 8) & 0xff)
        byteArray.push(word & 0xff)
      }
      const hashHex = byteArray.map((byte) => String.fromCharCode(byte)).join('')
      localStorage.setItem('closepwd', btoa(hashHex))
    }

    const createSolanaPriviteKey = () => {
      // 生成账户
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      solanaAddress.value = publicKey;
      const secretKey = keypair.secretKey;
      const secretKeyBase58 = bs58.encode(secretKey) 
      solanaPrivateKey.value = secretKeyBase58
      confirm.value.showConfirm()
    }

    const getLogin = async () => {
      if (private_key.value === '' && selectVal.value.value === 'xuper' && isXuperKey.value) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg4'), 'warning', 2500)
      } else if (password.value === '' && selectVal.value.value === 'xuper' && !isXuperKey.value) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg5'), 'warning', 2500)
      } else if (!setpwd.value) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg29'), 'warning', 2500)
      } else {
        const node = 'https://xuper.baidu.com/nodeapi'
        const chain = 'xuper'
        const params = {
          server: 'https://xuper.baidu.com/nodeapi',
          fee: '400',
          endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n',
          endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT',
        }
        const xsdk = new XuperSDK({
          node,
          chain,
          plugins: [Endorsement(params)],
        })
        let acc = null
        if (!isXuperKey.value) {
          if (password.value === '') {
            return prompt.value.showToast(i18n.global.t('toastMsg.msg5'), 'warning', 2500)
          }
          acc = xsdk.retrieve(password.value, 'SimplifiedChinese')
          localStorage.setItem('xuperSimplifiedChinese', password.value)
        } else {
          acc = xsdk.import(password.value, private_key.value)
        }

        if (acc) {
          const rString = generateRandomString()
          const encipher = AES.encrypt(JSON.stringify(acc.privateKey), rString).toString()
          const randS = AES.encrypt(rString, acc.address).toString()
          acc.type = 'xuper'
          acc.chain = 'xuper'
          acc.privateKey = encipher
          acc.rString = randS

          let accont = JSON.parse(localStorage.getItem('acc')) || []
          accont.push(acc)
          const obj = {}
          const newAcc = accont.reduce((cur, next) => {
            obj[next.address] ? '' : (obj[next.address] = true && cur.push(next))
            return cur
          }, [])

          localStorage.setItem('currentAccont', JSON.stringify(acc))
          localStorage.setItem('acc', JSON.stringify(newAcc))
          encipherPwd()

          const detailData = router.currentRoute.value.query.detail
          if (detailData) {
            const data = JSON.parse(detailData)
            if (data.message === 'OpenNFT_transfer') {
              router.push({
                path: '/Details',
                query: {
                  index: '转移资产',
                  detail: detailData,
                },
              })
            } else if (data.message === 'OpenNFT_demand') {
              router.push({
                path: '/Details',
                query: {
                  index: '查询NFT余额',
                  detail: detailData,
                },
              })
            }
          } else {
            router.push('/Home')
          }
          routerPush()
        } else {
          prompt.value.showToast(i18n.global.t('toastMsg.msg6'), 'error', 2500)
        }
      }
    }

    const getEthLogin = async () => {
      if (privateKey.value === '' && selectVal.value.value === 'eth') {
        prompt.value.showToast(i18n.global.t('toastMsg.msg5'), 'warning', 2500)
      } else if (!setpwd.value) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg29'), 'warning', 2500)
      } else {
        let accObject
        if (!isEthKey.value) {
          const mnemonic = privateKey.value
          const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic)
          accObject = {
            address: hdnode.address,
            privateKey: hdnode.privateKey,
            publicKey: hdnode.publicKey,
            type: 'eth',
            chain: 'eth',
          }
        } else {
          const provider = new ethers.providers.JsonRpcProvider(
            JSON.parse(localStorage.getItem('netList'))[1].node
          )
          const wallet = new ethers.Wallet(privateKey.value, provider)
          const rString = generateRandomString()
          const encipherKey = AES.encrypt(privateKey.value, rString).toString()
          const randS = AES.encrypt(rString, wallet.address).toString()
          accObject = {
            address: wallet.address,
            privateKey: encipherKey,
            publicKey: wallet.publicKey,
            type: 'eth',
            chain: 'eth',
            rString: randS,
          }
        }

        let acc = JSON.parse(localStorage.getItem('acc')) || []
        acc.push(accObject)
        const obj = {}
        const newAcc = acc.reduce((cur, next) => {
          obj[next.address] ? '' : (obj[next.address] = true && cur.push(next))
          return cur
        }, [])

        localStorage.setItem('acc', JSON.stringify(newAcc))
        localStorage.setItem('currentAccont', JSON.stringify(accObject))
        encipherPwd()

        router.push('/Home')
        routerPush()
      }
    }

    const getSolanaLogin = async () => {
      if (!solanaPrivateKey.value && selectVal.value.value === 'solana') {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg5'), 'warning', 2500)
      }
      if (!setpwd.value && selectVal.value.value === 'solana') {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg29'), 'warning', 2500)
      }

      const isValid = await validatePrivateKey(solanaPrivateKey.value)
      console.log('isValid=', isValid)
      if (!isValid) {
        return prompt.value.showToast(i18n.global.t('toastMsg.msg32'), 'warning', 2500)
      }

      // 根据私钥解析出公钥和地址
      const solanaPublicKey = await getPublicKeyFromPrivateKey(solanaPrivateKey.value)
      console.log('solanaPublicKey=', solanaPublicKey)
      solanaAddress.value = solanaPublicKey
      const rString = generateRandomString()
      const encipherKey = AES.encrypt(solanaPrivateKey.value, rString).toString()
      const randS = AES.encrypt(rString,solanaAddress.value).toString()
      let accObject = {
        address: solanaAddress.value,
        privateKey: encipherKey,
        publicKey: solanaAddress.value,
        type: 'solana',
        chain: 'solana',
        rString: randS,
      }

      let acc = JSON.parse(localStorage.getItem('acc')) || []
      acc.push(accObject)
      const obj = {}
      const newAcc = acc.reduce((cur, next) => {
        obj[next.address] ? '' : (obj[next.address] = true && cur.push(next))
        return cur
      }, [])

      localStorage.setItem('acc', JSON.stringify(newAcc))
      localStorage.setItem('currentAccont', JSON.stringify(accObject))
      encipherPwd()

      router.push('/Home')
      routerPush()
    }

    return {
      showPwd,
      isEthKey,
      isXuperKey,
      nowEth,
      xuperKey,
      nowXuper,
      private_key,
      password,
      setpwd,
      privateKey,
      solanaPrivateKey,
      selectVal,
      prompt,
      confirm,
      refFile,
      solanaAddress,
      toBack,
      swithkey,
      xuperSwitch,
      copypwd,
      createPkey,
      clickLoad,
      fileLoad,
      getLogin,
      getEthLogin,
      getSolanaLogin,
      createSolanaPriviteKey,
    }
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
