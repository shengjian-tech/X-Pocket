<template>
  <div class="set">
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
</template>

<script>
import Header from "../components/Header";
export default {
  name: "NftDetail",
  data() {
    return {
      form: {
        netName: "",
        type: "",
        chain: "",
        node: "",
        chainid: "",
        symbol: "",
      },
      netList: JSON.parse(localStorage.getItem("netList")),
      netType: "",
      data: JSON.parse(this.$route.query.item),
    };
  },
  components: { Header },
  mounted() {},
  methods: {
    goHome() {
      this.$router.push("/Home");
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>
<style>
.nftDetail {
  width: 460px;
  height: 600px;
  background-color: #5932a1;
}
.nftDetail .nftImg {
  width: 300px;
  height: 300px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.detailbg {
  background-color: #ffffff;
  text-align: left;
  padding: 30px;
  line-height: 45px;
  border-radius: 50px 50px 0 0;
}
.detailbg div {
  word-break: break-all;
  font-weight: bold;
}
.detailbg div span {
  font-weight: 400;
  margin-left: 10px;
}
</style>
