<template>
  <div class="set">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>{{ setName }}
    </div>
    <div class="form plugForm">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          v-for="(item, index) in formData"
          :label="item.label"
          :key="index"
        >
          <el-input
            v-model="form[item.value]"
            placeholder="请输入网络名称"
            :placeholder="'请输入' + item.label"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="addNetBtnlist" type="primary" round @click="goAdd()"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="详细" :visible.sync="dialogVisible" width="30%">
      <pre class="preStyle">{{ doalogContent }}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header";
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import { XchainAddrToEvm, EvmToXchainAddr } from "../assets/js/index";
import { ethers } from "ethers";
import { async } from "q";
export default {
  name: "Netlist",
  data() {
    return {
      form: {},
      netList: JSON.parse(localStorage.getItem("netList")),
      netType: "",
      pluginsList: [],
      tabsSetList: [],
      index: this.$route.query.index,
      setName: "",
      formData: [],
      currentMethod: "", //当前操作的方法集合
      dialogVisible: false,
      doalogContent: "",
    };
  },
  components: { Header },
  mounted() {
    console.log(this.index);
    this.getFromData();
  },
  methods: {
    //取值
    findKey(data, field) {
      let finding = "";
      let that = this;
      for (const key in data) {
        if (key === field) {
          finding = data[key];
        }
        // if (typeof data[key] === "object") {
        //   finding = that.findKey(data[key], field);
        // }else{

        // }
        if (finding) {
          return finding;
        }
      }
      return null;
    },
    goHome() {
      this.$router.push("/Home");
    },
    onSubmit() {
      console.log("submit!");
    },
    getFromData() {
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      let that = this;
      console.log(currentPlug);
      let addList = currentPlug.addList;
      addList[this.index];
      this.setName = addList[this.index].name;
      this.formData = addList[this.index].formValue;
      console.log(that.formData);

      const obj = Object.fromEntries(
        addList[this.index].formValue.map((item) => [item.value, ""])
      );
      that.form = obj;
      console.log(that.form);
    },
    goAdd() {
      console.log(this.form);
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      if (currentNet.type == "xuper" && currentPlug.type == "xuper") {
        //开放网络
        this.publicMethod("form");
      } else if (currentNet.type == "eth" && currentPlug.type == "eth") {
        //以太通用方法
        this.publicETHers("form");
      } else {
        this.$message.error("请切换到对应网络");
      }
    },
    //以太坊通用方法
    publicETHers(formName) {
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      let addList = currentPlug.addList[this.index];
      let that = this;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(addList);
          const provider = new ethers.providers.JsonRpcProvider(
            currentNet.node
          );
          if (addList.methodName == "getBlance") {
            let address = that.form.address;
            provider.getBalance(address).then((balance) => {
              // 余额是 BigNumber (in wei); 格式化为 ether 字符串
              let etherString = ethers.utils.formatEther(balance);
              console.log("Balance: " + etherString);
              this.doalogContent = `Balance: ${etherString}`;
              this.dialogVisible = true;
            });
          } else if (addList.methodName == "addrContract") {
            //地址解析
            const { ens_abi } = require("../utils/ENSRegistry.json");
            const ensRegistryAddr = that.form.ensRegistryAddr;
            const ensRegistry = new ethers.Contract(
              ensRegistryAddr,
              ens_abi,
              provider
            );
            const nodeHash = ethers.utils.namehash(that.form.url);
            const resolverAddr = await ensRegistry.resolver(nodeHash);
            this.doalogContent = `域名解析地址: ${resolverAddr}`;
            this.dialogVisible = true;
          } else if (addList.methodName == "transfer") {
            //地址转账
            let privateKey = currentAccont.privateKey;
            let wallet = new ethers.Wallet(privateKey, provider);
            let gasPrice = await provider.getGasPrice();
            let tx = await wallet.sendTransaction({
              gasLimit: 21000,
              gasPrice: gasPrice,
              to: that.form.toaddress,
              value: ethers.utils.parseUnits(that.form.value),
            });
            this.doalogContent = `交易哈希: ${tx.hash}`;
            this.dialogVisible = true;
          }
        } else {
          this.$message.error("请填写完整相关信息");
        }
      });
    },

    //通用方法
    publicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      let addList = currentPlug.addList[this.index];

      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = currentNet.node;
          const chain = currentNet.chain;
          const acc = currentAccont;
          const params = {
            server: node, // ip, port
            fee: "400", // fee
            endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
            endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
          };
          let xsdk;
          if (addList.type == "query") {
            //查询操作
            xsdk = new XuperSDK({ node, chain });
          } else {
            xsdk = new XuperSDK({
              node,
              chain,
              plugins: [
                Endorsement({
                  transfer: params,
                  makeTransaction: params,
                }),
              ],
            });
          }
          const commonFunc = async (type, contractName, methodName, args) => {
            try {
              if (addList.txType == 0) {
                //api方法，无需调用合约
                if (addList.txName && addList.txName == "queryTransaction") {
                  //查询交易
                  const demo = await xsdk.queryTransaction(
                    Buffer.from(
                      this.form[this.formData[0].value],
                      "hex"
                    ).toString("base64")
                  );
                  var txReqJson = JSON.parse(
                    Buffer.from(
                      demo.tx.contract_requests[1].args.input,
                      "base64"
                    ).toString()
                  );
                  console.log(addList.search);
                  console.log(this.findKey(demo, addList.search));
                  this.doalogContent = this.findKey(demo, addList.search);
                  this.dialogVisible = true;
                  // this.$alert(txReqJson, "详细内容", {
                  //   confirmButtonText: "确定",
                  // });
                }
              } else if (addList.txType == 1) {
                //需要调用到合约
                console.log(args);
                if (args.from) {
                  args.from = XchainAddrToEvm(args.from);
                }
                if (args.to) {
                  args.to = XchainAddrToEvm(args.to);
                }
                const demo = await xsdk.invokeSolidityContarct(
                  contractName,
                  methodName,
                  "evm",
                  args,
                  "0",
                  acc
                );
                this.doalogContent = demo;
                this.dialogVisible = true;
              }
            } catch (err) {
              if (err) {
                console.log(err);
                this.$message.error("执行失败");
              } else {
                this.$message.success("执行成功");
              }
            }
          };
          if (JSON.stringify(this.ruleForm) == "{}") {
            this.ruleForm = { "": "1" };
          }
          commonFunc(
            addList.type,
            addList.contractName,
            addList.methodName,
            this.form
          );
        } else {
          return false;
        }
      });
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
.listdetail {
  display: flex;
  flex-direction: column;
  width: 33.33%;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.listdetail img {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  margin-top: 30px;
  box-shadow: 4px 4px 4px 4px #f3f3f3;
}
.plugList .addNetBtn {
  height: 22px;
  background-color: #9327fc;
  border: none;
  line-height: 3px;
}
.listdetail span {
  margin: 20px 0;
}
.form {
  width: 70%;
  margin: 0 auto;
  margin-top: 40px;
}
.plugForm .el-form-item__content {
  margin-left: 0 !important;
  text-align: center;
}
.plugForm .el-input__inner {
  height: 36px;
  border-radius: 36px;
}
.plugForm .inputlabel {
  font-size: 18px;
  color: #000000;
  margin-bottom: 20px;
  display: inline-block;
}
.plugForm .el-select {
  display: block;
}
.plugForm .el-form-item__label {
  width: 200px !important;
  text-align: left;
}
.addNetBtnlist {
  width: 173px;
  height: 48px;
  border-radius: 48px !important;
  margin-top: 40px;
  background-color: #9327fc;
  border: none !important;
}
.el-dialog {
  height: 60%;
  width: 75% !important;
  overflow-y: scroll;
}
.el-dialog__body {
  overflow-y: scroll;
  height: 60%;
}
.el-dialog__header {
  padding: 10px;
}
.preStyle {
  height: 375px;
  text-align: left;
  overflow-y: scroll;
}
</style>
