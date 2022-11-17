<template>
  <div class="login">
    <Header />
    <div class="headerDefoult">
      <img src="../assets/logo.png" alt="" />
      <div>欢迎使用OpenNFT钱包插件</div>
    </div>
    <div class="write">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="本地私钥路径" v-model="private_key">
              <i slot="prefix" class="el-input__icon el-icon-folder"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-button
              style="background-color: #ff7300; border: none"
              type="primary"
              @click="clickLoad"
              >选择私钥文件</el-button
            >
            <input
              type="file"
              id="files"
              ref="refFile"
              style="display: none"
              @change="fileLoad"
            />
          </div>
        </el-col>
      </el-row>
      <p
        style="
          color: gray;
          font-size: 14px;
          text-align: left;
          margin-bottom: 5px;
        "
      >
        <i class="el-icon-warning-outline"></i
        >私钥只留存本地，不会上传到任何服务器
      </p>
      <br /><br />
      <el-input placeholder="安全码（可选，开放网络必填）" v-model="password">
        <i slot="prefix" class="el-input__icon el-icon-lollipop"></i>
      </el-input>
    </div>
    <div class="submit">
      <el-button
        @click="getLogin"
        style="width: 80%; background-color: #ff7300; border: none"
        type="primary"
        round
        >登录</el-button
      >
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
export default {
  name: "Login",
  data() {
    return {
      private_key: "",
      password: "",
      key: "",
      detailData: this.$route.query.detail,
    };
  },
  components: { Header },
  created() {
    if (localStorage.getItem("acc")) {
      this.$router.push("/Home");
    }
  },
  methods: {
    getLogin() {
      if (this.private_key == "") {
        this.$message("请选择您的本地key文件以获取私钥路径");
      } else if (this.password == "") {
        this.$message("请填写您的安全码");
      } else {
        const node = "https://xuper.baidu.com/nodeapi";
        const chain = "xuper";
        const params = {
          server: "https://xuper.baidu.com/nodeapi", // ip, port
          fee: "400", // fee
          endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
          endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
        };
        const xsdk = new XuperSDK({
          node,
          chain,
          plugins: [
            Endorsement({
              transfer: params,
              makeTransaction: params,
            }),
          ],
        });
        const acc = xsdk.import(this.password, this.key);
        if (acc) {
          localStorage.setItem("acc", JSON.stringify(acc));
          //如果是调用插件进来，未登录情况下，登录后，需要跳转到对应页面。
          //begin
          if (this.detailData) {
            let data = JSON.parse(this.detailData);
            if (data.message == "OpenNFT_transfer") {
              this.$router.push({
                path: "/Details",
                query: {
                  index: "转移资产",
                  detail: this.detailData,
                },
              });
            } else if (data.message == "OpenNFT_demand") {
              this.$router.push({
                path: "/Details",
                query: {
                  index: "查询NFT余额",
                  detail: this.detailData,
                },
              });
            }
          } else {
            this.$router.push("/Home");
          }
          //end
        } else {
          this.$$message.warning("请检查私钥和安全码");
        }
      }
    },
    clickLoad() {
      this.$refs.refFile.dispatchEvent(new MouseEvent("click"));
    },
    fileLoad() {
      const that = this;
      //获取读取的文件File对象
      const selectedFile = this.$refs.refFile.files[0];
      that.private_key = selectedFile.name;
      var reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = function () {
        that.key = this.result;
      };
    },
  },
};
</script>
<style scoped>
.login {
  width: 400px;
  margin: auto;
}
.login .help {
  text-align: left;
}
.login .help img{
  width: 68px;
}

.login .write {
  width: 90%;
  overflow: hidden;
  margin: auto;
}
.login .submit {
  width: 80%;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
.headerDefoult img{
  width: 150px;
}
.headerDefoult div{
  margin-bottom: 20px;
  font-size: 14px;
  color: #cccccc;
}
</style>
