<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('set.mNet') }}</span>
      </div>
      <div class="content">
        <ul>
          <li
            v-for="(item, index) in netList"
            :key="index"
            @click="setNetWork(index)"
          >
            <div class="circle">
              <img :src="netObj[item.sign]" />
            </div>
            <div class="flex1">{{ item.netName }}</div>
            <img src="../assets/img-right.png" class="img-right" />
          </li>
        </ul>
        <div class="btn" @click="goAdd">{{ $t('home.addNet') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Netlist',
  setup() {
    const router = useRouter()
    const netList = ref(JSON.parse(localStorage.getItem('netList')))
    const netObj = ref({
      xuper: require('../assets/img-x.png'),
      eth: require('../assets/img-eth.png'),
      polygon: require('../assets/img-polygon.png'),
      solana: require('../assets/img-solana.png'),
    })

    const goHome = () => {
      router.push('/Set')
    }

    const goAdd = () => {
      router.push('/Addnet')
    }

    const setNetWork = (index) => {
      router.push(`/Netdetail?index=${index}`)
    }

    return {
      netList,
      netObj,
      goHome,
      goAdd,
      setNetWork,
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
  .btn {
    width: 225px;
    height: 45px;
    line-height: 45px;
    font-size: 15px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    border-radius: 30px;
    margin: 30px auto;
  }
}
</style>
