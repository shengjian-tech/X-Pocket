<template>
  <div class="container">
    <img class="bg-img" src="../assets/w-bg.png" />
    <img class="logo-img" src="../assets/headerlogo.png" />
    <img
      class="planet-img"
      :class="[
        currentPage == 1 ? '' : 'planetAnimate2',
        now1 ? '' : 'planetAnimate1',
      ]"
      src="../assets/planet.png"
    />
    <div
      class="title"
      :class="[
        currentPage == 1 ? '' : 'titleAnimate2',
        now1 ? '' : 'titleAnimate1',
      ]"
    >
      <div class="tips-txt" v-if="currentPage != 1">
        {{ t('welcome.sunTitle') }}
      </div>
    </div>
    <div
      class="select-box"
      :class="[
        currentPage == 1 ? '' : 'selectAnimate2',
        now1 ? '' : 'selectAnimate1',
      ]"
    >
      <net-select
        :chainList="chainList"
        :currentchain="currentchain"
        @selectedChain="selectedChain"
      ></net-select>
    </div>
    <div class="btn-wrapper">
      <div class="btn" @click="currentPage = 2" v-if="currentPage == 1">
        {{ t('welcome.nextBtn') }}
      </div>
      <div class="btn" @click="confirm" v-else>{{ t('comm.confirm') }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { netListData,chainListData } from '@/utils/staticData'
import { useI18n } from 'vue-i18n'
import NetSelect from '@/components/NetSelect.vue'

export default {
  name: 'WelcomePage',
  components: {
    NetSelect,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()

    // 响应式数据
    const currentPage = ref(2)
    const now1 = ref(true)
    const chainList = ref(chainListData)
    const netList = ref(netListData)
    const currentchain = ref({
      id: 2,
      name: 'XuperOS',
      value: 'xuper',
      sign: 'xuper',
    })
    const isShow = ref(false)

    // 初始化
    onMounted(() => {
      if (
        localStorage.getItem('currentAccont') &&
        !route.query.state == 1
      ) {
        router.push('/Home')
      }
      if (route.query && route.query.state == 1) {
        currentPage.value = 2
      }

      const storedNetList = localStorage.getItem('netList')
      if (storedNetList && storedNetList !== 'undefined') {
        localStorage.setItem('netList', storedNetList)
      } else {
        localStorage.setItem('netList', JSON.stringify(netList.value))
      }
      console.log(localStorage.getItem('netList'), '8888')
    })

    // 选择链
    const selectedChain = (e) => {
      currentchain.value = e
    }

    // 确认操作
    const confirm = () => {
      router.push({
        path: '/Login',
        query: {
          state: 1,
          stateName: currentchain.value.value,
        },
      })
    }

    return {
      currentPage,
      now1,
      chainList,
      netList,
      currentchain,
      isShow,
      selectedChain,
      confirm,
      t,
    }
  },
}
</script>

<style lang="less" scoped>
.bg-img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  left: 0;
  top: 0;
}
.logo-img {
  width: 32px;
  margin-top: 20px;
}
.planet-img {
  position: absolute;
  width: 245px;
  left: 0;
  right: 0;
  margin: auto;
  top: 68px;
  z-index: 1;
}
.planet-img.planetAnimate1 {
  animation: planet1 0.4s linear forwards;
}
.planet-img.planetAnimate2 {
  animation: planet2 0.4s linear forwards;
}
.title {
  position: absolute;
  width: 100%;
  padding: 0 18px;
  box-sizing: border-box;
  left: 0;
  top: 340px;
  z-index: 1;
  p {
    color: white;
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    margin: 0;
  }
  .tips-txt {
    color: white;
    font-size: 18px;
    font-family: Arial-Regular, Arial;
    font-weight: bold;
    margin-top: 24px;
  }
}
.title.titleAnimate1 {
  animation: title1 0.3s linear forwards;
}
.title.titleAnimate2 {
  animation: title2 0.3s linear forwards;
}
.indicator {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 116px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .indicator-circle {
    width: 12px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    margin: 0 2px;
    cursor: pointer;
  }
  .indicator-circle.active {
    width: 36px;
    background: white;
  }
}
.btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 38px;
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
.select-box {
  position: absolute;
  width: 100%;
  left: 0;
  top: 196px;
  z-index: -1;
  padding: 0 25px;
  box-sizing: border-box;
  opacity: 0;
}
.select-box.selectAnimate1 {
  animation: select1 0.3s linear forwards;
}
.select-box.selectAnimate2 {
  animation: select2 0.1s 0.3s linear forwards;
}
@keyframes planet1 {
  0% {
    width: 136px;
    height: 136px;
    top: 292px;
    transform: rotate(90deg);
  }
  100% {
    width: 245px;
    height: 245px;
    top: 68px;
    transform: rotate(0deg);
  }
}
@keyframes planet2 {
  0% {
    width: 245px;
    height: 245px;
    top: 68px;
    transform: rotate(0deg);
  }
  100% {
    width: 136px;
    height: 136px;
    top: 292px;
    transform: rotate(90deg);
  }
}
@keyframes title1 {
  0% {
    top: 89px;
    opacity: 0;
  }
  100% {
    top: 340px;
    opacity: 1;
  }
}
@keyframes title2 {
  0% {
    top: 340px;
    opacity: 0;
  }
  100% {
    top: 89px;
    opacity: 1;
  }
}
@keyframes select1 {
  0% {
    opacity: 1;
    z-index: 1;
  }
  100% {
    opacity: 0;
    z-index: -1;
  }
}
@keyframes select2 {
  0% {
    opacity: 0;
    z-index: -1;
  }
  100% {
    opacity: 1;
    z-index: 1;
  }
}
</style>
