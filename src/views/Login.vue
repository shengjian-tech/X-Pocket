<template>
  <div class="login">
    <!-- <Header /> -->
    <div class="headerDefoult">
      <img src="../assets/testlogo.png" alt="" />
      <div>Your Daily Space for Connecting</div>
      <div>Daily Digital Asset</div>
    </div>

    <h2>请先选择链类型</h2>
    <div class="selectLoginType">
      <el-select v-model="value" placeholder="请选择" class="selectContent">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- xuper -->
    <div class="setLoginFrom" v-if="value == 'xuper'">
      <h3>本地私钥</h3>
      <div class="write">
        <div class="grid-content bg-purple">
          <el-input placeholder="本地私钥路径" v-model="private_key">
            <i
              slot="suffix"
              class="el-input__icon el-icon-folder-opened"
              @click="clickLoad"
            ></i>
          </el-input>
        </div>

        <div class="grid-content bg-purple-light">
          <!-- <el-button
                style="background-color: #5295fe; border: none"
                type="primary"
                @click="clickLoad"
                >选择私钥文件</el-button
              > -->
          <input
            type="file"
            id="files"
            ref="refFile"
            style="display: none"
            @change="fileLoad"
          />
        </div>

        <p class="alertP">
          <span style="border-bottom: 1px solid #9327fc"
            >*暂无私钥，点击立即下载</span
          >
        </p>
        <el-input
          placeholder="安全码（可选，开放网络必填）"
          v-model="password"
          type="password"
        >
        </el-input>
      </div>
      <div class="submit">
        <el-button @click="getLogin" class="submitBtn" type="primary" round
          >登录</el-button
        >
      </div>
    </div>

    <!-- eth -->
    <div class="setLoginFrom" v-if="value == 'eth'">
      <h3>私钥</h3>
      <div class="write">
        <el-input placeholder="请输入您的私钥" v-model="privateKey"> </el-input>
        <p class="alertP">
          <span style="border-bottom: 1px solid #9327fc"
            >*私钥只留存本地，不会上传到任何服务器
          </span>
        </p>
      </div>
      <div class="submit">
        <el-button @click="getEthLogin" class="submitBtn" type="primary" round
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
      private_key: "",
      password: "",
      key: "",
      detailData: this.$route.query.detail,
      privateKey: "", //以太坊私钥
      options: [
        {
          value: "xuper",
          label: "百度超级链",
        },
        {
          value: "eth",
          label: "以太坊",
        },
      ],
      value: "",
      netList: [
        {
          chain: "xuper",
          netName: "开放网络",
          node: "https://xuper.baidu.com/nodeapi",
          type: "xuper",
        },
        {
          chain: "eth",
          netName: "以太坊",
          node: "https://rpc-mumbai.maticvigil.com",
          type: "eth",
        },
      ],
    };
  },
  components: { Header },
  created() {
    if (localStorage.getItem("netList")) {
      let netList = localStorage.getItem("netList");
      localStorage.setItem("netList", netList);
    } else {
      localStorage.setItem("netList", JSON.stringify(this.netList));
    }
  },
  methods: {
    //开放网络
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
          let accont;
          acc.type = "xuper";
          acc.chain = "xuper";
          if (localStorage.getItem("acc")) {
            //先判断 本地有没有账户，如果有的话，就push进去
            accont = JSON.parse(localStorage.getItem("acc"));
            accont.push(acc);
          } else {
            accont = [];
            accont.push(acc);
          }

          let obj = {};
          let newAcc = accont.reduce((cur, next) => {
            obj[next.address]
              ? ""
              : (obj[next.address] = true && cur.push(next));
            return cur;
          }, []);
          localStorage.setItem("currentAccont", JSON.stringify(acc));
          localStorage.setItem("acc", JSON.stringify(newAcc));
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

    // getEthLogin  以太坊 获取主账户
    getEthLogin() {
      if (this.privateKey == "") {
        this.$message("请输入您的私钥");
      } else {
        const privateKey = this.privateKey;
        const provider = new ethers.providers.JsonRpcProvider(
          JSON.parse(localStorage.getItem("netList"))[1].node
        );
        const wallet = new ethers.Wallet(privateKey, provider);
        let accountAddress = wallet.address;
        if (accountAddress) {
          let accObject = {
            address: accountAddress,
            privateKey: this.privateKey,
            publicKey: "",
            type: "eth",
            chain: "eth",
          };
          let acc;
          if (localStorage.getItem("acc")) {
            //先判断 本地有没有账户，如果有的话，就push进去
            console.log(JSON.parse(localStorage.getItem("acc")));
            acc = JSON.parse(localStorage.getItem("acc"));
            acc.push(accObject);
          } else {
            acc = [];
            acc.push(accObject);
          }
          let obj = {};
          let newAcc = acc.reduce((cur, next) => {
            obj[next.address]
              ? ""
              : (obj[next.address] = true && cur.push(next));
            return cur;
          }, []);
          localStorage.setItem("acc", JSON.stringify(newAcc));
          localStorage.setItem("currentAccont", JSON.stringify(accObject));
          this.$router.push("/Home");
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
<style>
.login {
  width: 635px;
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
}
.login .help {
  text-align: left;
}
.login .help img {
  width: 68px;
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
  width: 60%;
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
}
</style>
