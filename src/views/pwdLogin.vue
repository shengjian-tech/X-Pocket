<template>
  <div class="login">
    <div class="headerDefoult">
      <img src="../assets/testlogo.png" alt="" />
      <div>Your Daily Space for Connecting</div>
      <div>Daily Digital Asset</div>
    </div>
    <!-- xuper -->
    <div class="setLoginFrom">
      <h3>密码</h3>
      <div class="write">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入密码" v-model="password" type="text">
          </el-input>
        </div>
      </div>

      <div class="submit">
        <el-button @click="getLogin" class="submitBtn" type="primary" round
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
import { ethers } from "ethers";
export default {
  name: "Login",
  data() {
    return {
      state: this.$route.query.state,
      password: "",
    };
  },
  components: { Header },
  mounted() {},
  methods: {
    //开放网络
    getLogin() {
      if (!this.password) {
        this.$message.error("请完整填写密码");
      } else {
        let closepwd = localStorage.getItem("closepwd");
        if (closepwd === this.password) {
          localStorage.setItem("closeState", false);
          this.$router.push("/Home");
        } else {
          this.$message.error("密码不正确");
        }
      }
    },
  },
};
</script>
<style>
.el-notification {
  word-break: break-all;
}
.login {
  width: 460px;
  height: 1012px;
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
}
.login .help {
  text-align: left;
}
.login .help img {
  width: 68px;
}
.headermap {
  height: 80px;
  line-height: 80px;
  background-color: #7657b1;
  color: #ffffff;
  font-size: 16px;
  text-align: left;
}
.headermap i {
  font-size: 16px;
  vertical-align: -1px;
  margin-left: 20px;
  margin-right: 20px;
}
.login .write {
  overflow: hidden;
  margin: auto;
}
.login .submit {
  width: 80%;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
.headerDefoult {
  margin-top: 70px;
}
.headerDefoult img {
  width: 132px;
  margin-bottom: 30px;
}
.headerDefoult div {
  margin-bottom: 20px;
  font-size: 24px;
  color: #000000;
}
h2 {
  color: #000000;
  margin-bottom: 24px;
}
.selectLoginType {
  margin-bottom: 40px;
}
.selectContent {
  width: 370px;
  height: 50px;
}
.selectContent .el-input__inner {
  border-radius: 50px !important;
  border-color: #9327fc !important;
  width: 370px;
  height: 50px;
  padding: 0 40px;
}
.selectContent .el-input__suffix {
  margin-right: 20px;
}
.setLoginFrom {
  width: 82%;
  margin: 0 auto;
}
.setLoginFrom h3 {
  text-align: left;
  margin-bottom: 30px;
}
.setLoginFrom .el-input__inner {
  border-color: #9327fc !important;
  border-radius: 50px !important;
  width: 370px;
  height: 50px;
  padding: 0 40px;
}
.setLoginFrom .el-input__prefix {
  margin-left: 20px;
  margin-right: 10px;
}
.setLoginFrom .el-input__suffix {
  margin-right: 20px;
}
.setLoginFrom .el-icon-folder-opened {
  font-size: 30px;
  margin-top: 5px;
}
.submitBtn {
  width: 173px;
  height: 48px;
  background-color: #9327fc !important;
  border: none !important;
  border-radius: 48px !important;
  margin-top: 52px !important;
}
.alertP {
  color: #9327fc;
  font-size: 14px;
  text-align: left;
  margin-bottom: 30px;
  margin-top: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.alertP span {
  display: inline-block;
  cursor: pointer;
}
</style>
