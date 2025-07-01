<template>
  <div>
    <div class="container">
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('nftDetails.title') }}</span>
      </div>
      <div class="content">
        <div class="main-img">
          <img :src="data.image_uri" />
        </div>
        <ul>
          <li>
            <p>{{ $t('nftDetails.name1') }}</p>
            <div class="comm-cont">{{ data.name }}</div>
          </li>
          <li>
            <p>{{ $t('nftDetails.name2') }}</p>
            <div class="comm-cont">{{ data.hash }}</div>
          </li>
          <li>
            <p>Token_id:</p>
            <div class="comm-cont">{{ data.token_id }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'NftDetail',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const form = ref({
      netName: '',
      type: '',
      chain: '',
      node: '',
      chainid: '',
      symbol: '',
    })

    const netList = ref(JSON.parse(localStorage.getItem('netList')))
    const netType = ref('')
    const data = ref(JSON.parse(route.query.item))

    const goHome = () => {
      router.push('/Home')
    }

    const onSubmit = () => {
      console.log('submit!')
    }

    return {
      form,
      netList,
      netType,
      data,
      goHome,
      onSubmit,
    }
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 20px 25px;
  text-align: left;
  .main-img {
    width: 100%;
    height: 248px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
    }
  }
  ul {
    margin-top: 20px;
    li {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      margin-bottom: 8px;
      padding: 14px;
      p {
        margin: 0;
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
      }
      .comm-cont {
        margin-top: 10px;
        padding-bottom: 13px;
        border-bottom: 2px solid #5c6b7c;
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: #ffffff;
        word-break: break-all;
      }
    }
    li:first-child {
      .comm-cont {
        font-size: 18px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>
