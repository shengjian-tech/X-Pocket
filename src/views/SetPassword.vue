<template>
  <div class="set">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>设置密码
    </div>
    <div class="form setpwdForm">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item>
          <span class="inputlabel">设置密码</span>
          <el-input v-model="form.password" placeholder="请设置密码"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="inputlabel">确认密码</span>
          <el-input
            v-model="form.norpwd"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="setPwdBtnFath">
          <el-button
            class="addNetBtn"
            type="primary"
            round
            @click="addNetList()"
            >设置</el-button
          >
        </el-form-item>
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
        password: "",
        norpwd: "",
      },
      netList: JSON.parse(localStorage.getItem("netList")),
    };
  },
  components: { Header },
  mounted() {},
  methods: {
    goHome() {
      this.$router.push("/Home");
    },
    addNetList() {
      console.log(this.form);
      if (!this.form.password || !this.form.norpwd) {
        this.$message.error("请完善信息");
      }
      if (this.form.password !== this.form.norpwd) {
        this.$message.error("两次密码不一致!");
      } else {
        //操作
        localStorage.setItem("closepwd", this.form.password);
        this.$router.push("/Set");
      }
    },
  },
};
</script>
<style>
.set {
  width: 460px;
  /* height: 460px; */
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
.setpwdForm {
  width: 70%;
  margin: 0 auto;
  margin-top: 40px;
}
.setpwdForm .el-form-item__content {
  margin-left: 0 !important;
  text-align: left;
}
.setpwdForm .el-input__inner {
  height: 36px;
  border-radius: 36px;
}
.setpwdForm .inputlabel {
  font-size: 18px;
  color: #000000;
}
.setpwdForm .el-select {
  display: block;
}
.setPwdBtnFath .el-form-item__content {
  text-align: center !important;
}
.setpwdForm .addNetBtn {
  width: 160px;
  height: 40px;
  border-radius: 40px !important;
  background-color: #9327fc;
  border: none !important;
  margin-top: 50px;
}
</style>
