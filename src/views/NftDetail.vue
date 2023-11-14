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

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left" @click="goHome"></i>首页/NFTS
      </div>
      <div class="nftDetail">
        <img class="nftImg" :src="data.image_uri" alt="" />
        <div class="detailbg">
          <div>
            名称: <span>{{ data.name }}</span>
          </div>
          <div>
            交易哈希：<span>{{ data.hash }}</span>
          </div>
          <div>
            Token_id：<span>{{ data.token_id }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
export default {
  name: 'NftDetail',
  data() {
    return {
      form: {
        netName: '',
        type: '',
        chain: '',
        node: '',
        chainid: '',
        symbol: '',
      },
      netList: JSON.parse(localStorage.getItem('netList')),
      netType: '',
      data: JSON.parse(this.$route.query.item),
    }
  },
  components: { Header },
  mounted() {},
  methods: {
    goHome() {
      this.$router.push('/Home')
    },
    onSubmit() {
      console.log('submit!')
    },
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
