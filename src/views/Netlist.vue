<template>
  <div class="set">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>设置/管理网络
    </div>
    <div class="setList">
      <div
        v-for="(item, index) in netList"
        :key="index"
        @click="setNetWork(index)"
      >
        <i class="el-icon-position"></i>{{ item.netName
        }}<i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="setbtn">
      <el-button class="addNetBtn" type="primary" round @click="goAdd()"
        >添加网络</el-button
      >
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Netlist",
  data() {
    return {
      netList: JSON.parse(localStorage.getItem("netList")),
    };
  },
  components: { Header },
  created() {},
  methods: {
    goHome() {
      this.$router.push("/Set");
    },
    goAdd() {
      this.$router.push("/Addnet");
    },
    setNetWork(index) {
      console.log(index);
      this.$router.push(`/Netdetail?index=${index}`);
    },
  },
};
</script>
<style>
.set {
  width: 635px;
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
  text-align: left;
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
.setbtn {
  text-align: center;
}
.addNetBtn {
  width: 173px;
  height: 48px;
  border-radius: 48px !important;
  margin-top: 100px;
  background-color: #9327fc;
  border: none !important;
}
</style>
