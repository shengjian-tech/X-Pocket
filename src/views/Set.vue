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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const value = ref(false)
    const currentStatus = ref('off')
    const version = ref(process.env.VUE_APP_POCKET_VERSION)

    const goHome = () => {
      router.push('/Home')
    }

    const setNet = () => {
      router.push('/Netlist')
    }

    const setLanguage = () => {
      router.push('/languageSwitch')
    }

    const setPwd = () => {
      router.push('/SetPassword')
    }

    const setRsa = () => {
      router.push('/setrsa')
    }

    const setWhiteList = () => {
      router.push('/setWhiteList')
    }

    const getChange = (v) => {
      console.log(v)
      chrome.storage.local.set({ key: v }, () => {
        console.log('Data saved.')
      })
    }

    onMounted(() => {
      chrome.storage.local.get(['key'], (result) => {
        value.value = result.key
        currentStatus.value = result.key ? 'on' : 'off'
        console.log('Value retrieved:', value.value)
      })
    })

    return {
      value,
      currentStatus,
      version,
      goHome,
      setNet,
      setLanguage,
      setPwd,
      setRsa,
      setWhiteList,
      getChange,
    }
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
