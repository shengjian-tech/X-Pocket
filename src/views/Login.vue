<template>
  <div class="login">
    <div class="headermap" v-if="state == 1">
      <i class="el-icon-arrow-left" @click="goHome"></i>添加账户
    </div>
    <div class="headerDefoult">
      <img src="../assets/testlogo.png" alt="" />
      <div v-if="!state == 1">Your Daily Space for Connecting</div>
      <div v-if="!state == 1">Daily Digital Asset</div>
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
      <h3 v-if="!other_state">本地私钥</h3>
      <h3 v-else>助记词</h3>
      <div class="write">
        <div v-if="!other_state" class="grid-content bg-purple">
          <el-input placeholder="本地私钥路径" v-model="private_key">
            <i
              slot="suffix"
              class="el-input__icon el-icon-folder-opened"
              @click="clickLoad"
            ></i>
          </el-input>
        </div>

        <div v-if="!other_state" class="grid-content bg-purple-light">
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

        <el-input
          v-if="other_state"
          placeholder="助记词"
          v-model="password"
          type="text"
        >
        </el-input>

        <p class="alertP">
          <a href="https://xuper.baidu.com/n/console#/xuperos/info"
            >*暂无私钥，右键打开新标签页下载</a
          >
          <span @click="otherLogin" v-if="other_state">私钥登录</span>
          <span @click="otherLogin" v-else>助记词登录</span>
        </p>
        <el-input
          placeholder="安全码（可选，开放网络必填）"
          v-model="password"
          type="password"
          v-if="!other_state"
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
      <h3 v-if="!other_state">私钥</h3>
      <h3 v-else>助记词</h3>
      <div class="write">
        <el-input
          v-if="!other_state"
          placeholder="请输入您的私钥"
          v-model="privateKey"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-copy-document copycont"
            :data-clipboard-text="privateKey"
            @click="copypwd()"
          ></i>
        </el-input>
        <el-input v-else placeholder="请输入您的助记词" v-model="privateKey">
        </el-input>
        <p class="alertP">
          <span style="border-bottom: 1px solid #9327fc" @click="createPkey()"
            >创建私钥
          </span>
          <span @click="otherLogin" v-if="other_state">私钥登录</span>
          <span @click="otherLogin" v-else>助记词登录</span>
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
import Clipboard from "clipboard";
import { ethers } from "ethers";
import { routerPush } from "@/utils/popup";
export default {
  name: "Login",
  data() {
    return {
      state: this.$route.query.state,
      private_key: "",
      password: "",
      key: "",
      detailData: this.$route.query.detail,
      privateKey: "", //以太坊私钥
      options: [
        {
          value: "xuper",
          label: "XuperOS",
        },
        {
          value: "eth",
          label: "Ethereum",
        },
      ],
      value: this.$route.query.stateName
        ? this.$route.query.stateName
        : "xuper",
      netList: [
        {
          chain: "xuper",
          netName: "XuperOS",
          node: "https://xuper.baidu.com/nodeapi",
          type: "xuper",
        },
        {
          chain: "eth",
          netName: "Polygon-Testnet",
          node: "https://rpc-mumbai.maticvigil.com",
          type: "eth",
          chainid: 80001,
        },
        {
          chain: "eth",
          netName: "Ethereum",
          node: "https://mainnet.infura.io/v3/",
          type: "eth",
          chainid: 1,
        },
      ],
      other_state: false,
    };
  },
  components: { Header },
  mounted() {
    if (
      localStorage.getItem("currentAccont") &&
      !this.$route.query.state == 1
    ) {
      this.$router.push("/Home");
    }

    if (localStorage.getItem("netList")) {
      let netList = localStorage.getItem("netList");
      localStorage.setItem("netList", netList);
    } else {
      localStorage.setItem("netList", JSON.stringify(this.netList));
    }
  },
  methods: {
    //复制
    copypwd() {
      var clipboard = new Clipboard(".copycont");
      clipboard.on("success", (e) => {
        this.$message.success("复制成功！");
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$message.success("当前浏览器不支持复制！");
        clipboard.destroy();
      });
    },
    createPkey() {
      const wallet = ethers.Wallet.createRandom().privateKey;
      console.log(wallet);
      this.privateKey = wallet;
      this.$notify({
        title: "获取成功",
        dangerouslyUseHTMLString: true,
        message: "私钥十分重要,请注意及时保存",
        type: "success",
        duration: 0,
      });
    },
    goHome() {
      this.$router.push("/Home");
    },
    //切换登录方式
    otherLogin() {
      this.other_state == true
        ? (this.other_state = false)
        : (this.other_state = true);
    },
    //开放网络
    getLogin() {
      if (this.private_key == "" && this.other_state !== true) {
        this.$message("请选择您的本地key文件以获取私钥路径");
      } else if (this.password == "") {
        this.$message("请完整填写信息!");
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

        let acc = null;
        if (this.other_state == true) {
          acc = xsdk.retrieve(this.password, "SimplifiedChinese");
          // 缓存助记词
          localStorage.setItem("xuperSimplifiedChinese",this.password);
        } else {
          acc = xsdk.import(this.password, this.key);
          //缓存密码和秘钥
          localStorage.setItem("xuperPassword",this.password);
          localStorage.setItem("xuperKey",this.key);
        }

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

          if (localStorage.getItem("accountAllList")) {
            let accountAllList = JSON.parse(
              localStorage.getItem("accountAllList")
            );
            accountAllList.push(acc);
            localStorage.setItem(
              "accountAllList",
              JSON.stringify(accountAllList)
            );
          } else {
            let accountAllList = [];
            accountAllList.push(acc);
            localStorage.setItem(
              "accountAllList",
              JSON.stringify(accountAllList)
            );
          }

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
          routerPush()
          //end
        } else {
          this.$$message.warning("请检查私钥和安全码");
        }
      }
    },

    // getEthLogin  以太坊 获取主账户
    getEthLogin() {
      if (this.privateKey == "") {
        this.$message("请完整填写信息");
      } else {
        let accObject;
        if (this.other_state) {
          //助记词登录
          let mnemonic = this.privateKey;
          let hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic);
          console.log(hdnode);
          accObject = {
            address: hdnode.address,
            privateKey: hdnode.privateKey,
            publicKey: hdnode.publicKey,
            type: "eth",
            chain: "eth",
          };
        } else {
          const privateKey = this.privateKey;
          const provider = new ethers.providers.JsonRpcProvider(
            JSON.parse(localStorage.getItem("netList"))[1].node
          );
          const wallet = new ethers.Wallet(privateKey, provider);
          let accountAddress = wallet.address;
          accObject = {
            address: accountAddress,
            privateKey: this.privateKey,
            publicKey: "",
            type: "eth",
            chain: "eth",
          };
        }
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
          obj[next.address] ? "" : (obj[next.address] = true && cur.push(next));
          return cur;
        }, []);
        localStorage.setItem("acc", JSON.stringify(newAcc));
        localStorage.setItem("currentAccont", JSON.stringify(accObject));
        
        this.$router.push("/Home");
        routerPush()
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
.el-notification {
  word-break: break-all;
}
.login {
  width: 460px;

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
  margin-bottom: 20px;
}
.headerDefoult {
  margin-top: 30px;
}
.headerDefoult img {
  width: 60px;
  margin-bottom: 16px;
}
.headerDefoult div {
  margin-bottom: 20px;
  font-size: 18px;
  color: #000000;
}
h2 {
  color: #000000;
  margin-bottom: 24px;
  font-size: 20px;
}
.selectLoginType {
  margin-bottom: 20px;
}
.selectContent {
  width: 280px;
  height: 40px;
}
.selectContent .el-input__inner {
  border-radius: 50px !important;
  border-color: #9327fc !important;
  width: 280px;
  height: 40px;
  padding: 0 20px;
}

.selectContent .el-input__suffix {
  margin-right: 20px;
}
.setLoginFrom {
  width: 65%;
  margin: 0 auto;
}
.setLoginFrom h3 {
  text-align: left;
  margin-bottom: 20px;
  font-size: 18px;
}
.setLoginFrom .el-input__inner {
  border-color: #9327fc !important;
  border-radius: 50px !important;
  width: 280px;
  height: 40px;
  padding-right: 40px !important;
}
.setLoginFrom .el-input__prefix {
  margin-left: 20px;
  margin-right: 10px;
}
.setLoginFrom .el-input__suffix {
  margin-right: 5px;
}
.setLoginFrom .el-input__icon {
  width: 40px;
}
.setLoginFrom .el-icon-folder-opened {
  font-size: 20px;
}
.setLoginFrom .el-icon-copy-document {
  font-size: 20px;
}
.submitBtn {
  width: 173px;
  height: 48px;
  background-color: #9327fc !important;
  border: none !important;
  border-radius: 48px !important;
  margin-top: 36px !important;
}
.alertP {
  color: #9327fc;
  font-size: 14px;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.alertP span {
  display: inline-block;
  cursor: pointer;
}
.copycont {
  margin-left: 6px;
}
</style>
