<template>
  <div class="set">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>设置/查看网络
    </div>
    <div class="form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item>
          <span class="inputlabel">网络名称</span>
          <el-input
            v-model="form.netName"
            placeholder="请输入网络名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span class="inputlabel">网络类型</span>
          <el-select v-model="form.type" placeholder="请选择网络类型">
            <el-option label="开放网络" value="xuper"></el-option>
            <el-option label="以太坊" value="eth"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <span class="inputlabel">新的RPC URL</span>
          <el-input v-model="form.node" placeholder="请输入网络URL"></el-input>
        </el-form-item>
        <div v-if="netType == 'xuper'">
          <el-form-item>
            <span class="inputlabel">链名</span>
            <el-input
              v-model="form.chain"
              placeholder="请输入网络名称"
            ></el-input>
          </el-form-item>
        </div>

        <div v-if="netType == 'eth'">
          <el-form-item>
            <span class="inputlabel">链ID</span>
            <el-input
              v-model="form.chainid"
              placeholder="请输入链ID"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="inputlabel">货币符号</span>
            <el-input
              v-model="form.symbol"
              placeholder="请输入货币符号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="inputlabel">区块链浏览器URL（可选）</span>
            <el-input
              v-model="form.symbol"
              placeholder="请输入区块链浏览器URL"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Netlist",
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
    };
  },
  components: { Header },
  mounted() {
    console.log(this.$route.query.index);
    this.form = this.netList[this.$route.query.index];
    this.netType = this.netList[this.$route.query.index].type;
  },
  methods: {
    goHome() {
      this.$router.push("/Netlist");
    },
    onSubmit() {
      console.log("submit!");
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
.form {
  width: 70%;
  margin: 0 auto;
  margin-top: 40px;
}
.form .el-form-item__content {
  margin-left: 0 !important;
}
.form .el-input__inner {
  height: 36px;
  border-radius: 36px;
}
.form .inputlabel {
  font-size: 18px;
  color: #000000;
}
.form .el-select {
  display: block;
}
</style>
