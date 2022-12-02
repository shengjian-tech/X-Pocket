<template>
  <div class="set">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>设置
    </div>
    <div class="setList">
      <div @click="setNet">
        <i class="el-icon-s-operation"></i>管理网络<i
          class="el-icon-arrow-right"
        ></i>
      </div>
      <!-- <div>
        <i class="el-icon-lock"></i>更改密码<i class="el-icon-arrow-right"></i>
      </div>
      <div>
        <i class="el-icon-s-help"></i>语言<i class="el-icon-arrow-right"></i>
      </div>
      <div>
        <i class="el-icon-view"></i>安全隐私<i class="el-icon-arrow-right"></i>
      </div>
      <div>
        <i class="el-icon-warning-outline"></i>关于<i
          class="el-icon-arrow-right"
        ></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Set",
  data() {
    return {};
  },
  components: { Header },
  created() {},
  methods: {
    goHome() {
      this.$router.push("/Home");
    },
    setNet() {
      this.$router.push("/Netlist");
    },
  },
};
</script>
<style>
.set {
  width: 460px;
  height: 1012px;
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
}
.headermap {
  height: 80px;
  line-height: 80px;
  background-color: #7657b1;
  color: #ffffff;
  font-size: 26px;
}
.headermap i {
  font-size: 26px;
  vertical-align: -1px;
  margin-left: 20px;
  margin-right: 20px;
}
.setList div {
  height: 90px;
  line-height: 90px;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  align-items: center;
}
.setList div i {
  margin-left: 20px;
  margin-right: 10px;
}
.setList div i:last-child {
  text-align: right;
  flex: 1;
}
</style>
