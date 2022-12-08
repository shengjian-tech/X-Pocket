<template>
  <div class="setSearch">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>首页/操作
    </div>
    <div class="form formsearch">
      <el-form
        style="text-align: left"
        label-position="top"
        :model="addForm"
        :rules="rules1"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="操作名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入您要添加的操作名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio label="transaction">交易</el-radio>
            <el-radio label="query">查询</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合约名" prop="contractName">
          <el-input
            v-model="addForm.contractName"
            placeholder="请输入合约名"
          ></el-input>
        </el-form-item>
        <el-form-item label="方法名" prop="methodName">
          <el-input
            v-model="addForm.methodName"
            placeholder="请输入方法名"
          ></el-input>
        </el-form-item>
        <div>
          <a class="addParams" @click="addParams">添加操作参数</a>

          <el-row
            :gutter="20"
            v-for="(item, index) in addForm.formValue"
            :key="index"
          >
            <el-col :span="10">
              <el-form-item label="参数">
                <el-input
                  v-model="item.label"
                  placeholder="请输入您要添加的参数"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="参数值">
                <el-input
                  v-model="item.value"
                  placeholder="请输入您要添加的参数值"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <i
                @click.prevent="removeDomain(item)"
                style="font-size: 24px; margin-top: 35%; cursor: pointer"
                class="el-icon-remove-outline"
              ></i>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button
          size="small"
          class="submitSearch"
          type="primary"
          @click="submit('addForm')"
          >确 定</el-button
        >
      </span>
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
export default {
  name: "Netlist",
  data() {
    return {
      dialogVisible: false,
      doalogContent: "",
      form: {
        netName: "",
        type: "",
        chain: "",
        node: "",
        chainid: "",
        symbol: "",
        bwUrl: "",
      },
      addForm: {
        name: "",
        contractName: "",
        methodName: "",
        formValue: [],
      },
      rules1: {
        name: [
          { required: true, message: "操作名称不能为空", trigger: "blur" },
        ],
        contractName: [
          { required: true, message: "合约名不能为空", trigger: "blur" },
        ],
        methodName: [
          { required: true, message: "方法名不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "选择您的操作类型", trigger: "change" },
        ],
      },
      netList: JSON.parse(localStorage.getItem("netList")),
    };
  },
  components: { Header },
  mounted() {},
  methods: {
    //新增操作
    submit(formName) {
      let netWork = JSON.parse(localStorage.getItem("currentNet")); //判断当前网络类型
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(valid);
          console.log(this.addForm);
          if (netWork.type == "xuper") {
            this.publicMethod(this.addForm);
          } else if (netWork.type == "eth") {
            this.etnPublicMethod(this.addForm);
          }
        } else {
          return false;
        }
      });
    },
    //通用方法
    publicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));

      console.log(formName);

      let contractName = formName.contractName;
      let methodName = formName.methodName;
      let setType = formName.type;

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
      if (setType == "query") {
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
      const commonFunc = async (contractName, methodName, args) => {
        try {
          const objects = Object.fromEntries(
            args.map((item) => [item.label, item.value])
          );
          args = objects;

          if (args.from) {
            args.from = XchainAddrToEvm(args.from);
          }
          if (args.to) {
            args.to = XchainAddrToEvm(args.to);
          }

          if (args.txId) {
            const demo = await xsdk.queryTransaction(
              Buffer.from(args.txId, "hex").toString("base64")
            );
            this.doalogContent = demo;
            this.dialogVisible = true;
          } else {
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
      commonFunc(contractName, methodName, formName.formValue);
    },

    //
    async etnPublicMethod(formName) {
      let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      console.log(formName);
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node);
      let from = formName.formValue;
      const objects = Object.fromEntries(
        from.map((item) => [item.label, item.value])
      );
      from = objects;
      console.log(from);
      if (formName.methodName == "getBlance") {
        let address = currentAccont.address;
        provider.getBalance(address).then((balance) => {
          // 余额是 BigNumber (in wei); 格式化为 ether 字符串
          let etherString = ethers.utils.formatEther(balance);
          console.log("Balance: " + etherString);
          this.doalogContent = `Balance: ${etherString}`;
          this.dialogVisible = true;
        });
      } else if (formName.methodName == "addrContract") {
        //地址解析
        const { ens_abi } = require("../utils/ENSRegistry.json");
        const ensRegistryAddr = from.ensRegistryAddr;
        const ensRegistry = new ethers.Contract(
          ensRegistryAddr,
          ens_abi,
          provider
        );
        const nodeHash = ethers.utils.namehash(from.url);
        const resolverAddr = await ensRegistry.resolver(nodeHash);
        this.doalogContent = `域名解析地址: ${resolverAddr}`;
        this.dialogVisible = true;
      } else if (
        formName.type == "transaction" &&
        formName.methodName == "transfer"
      ) {
        //地址转账
        let privateKey = from.privateKey;
        let wallet = new ethers.Wallet(privateKey, provider);
        let gasPrice = await provider.getGasPrice();
        let tx = await wallet.sendTransaction({
          gasLimit: 21000,
          gasPrice: gasPrice,
          to: from.toaddress,
          value: ethers.utils.parseUnits(from.value),
        });
        this.doalogContent = `交易哈希: ${tx.hash}`;
        this.dialogVisible = true;
      }
    },

    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: "", label: "" });
    },
    removeDomain(item) {
      var index = this.addForm.formValue.indexOf(item);
      if (index !== -1) {
        this.addForm.formValue.splice(index, 1);
      }
    },
    goHome() {
      this.$router.push("/Home");
    },
    addNetList() {
      console.log(this.form);
      if (!this.form.type) {
        this.$message.error("请完善信息");
      } else if (
        this.form.type == "xuper" &&
        (this.form.netName == "" ||
          this.form.chain == "" ||
          this.form.node == "")
      ) {
        this.$message.error("请完善信息");
      } else if (
        this.form.type == "eth" &&
        (this.form.netName == "" ||
          this.form.node == "" ||
          this.form.chainid == "" ||
          this.form.symbol == "")
      ) {
        this.$message.error("请完善信息");
      } else {
        //操作
        let netList = this.netList;
        netList.push(this.form);
        localStorage.setItem("netList", JSON.stringify(netList));
        this.$router.push("/Netlist");
        window.location.reload();
      }
    },
  },
};
</script>
<style>
.setSearch {
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
.formsearch {
  width: 70%;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 20px;
}
.formsearch .el-form-item__content {
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
.addNetBtnFath {
  text-align: center;
}
.setSearch .addNetBtn {
  width: 160px;
  height: 40px;
  border-radius: 40px !important;
  background-color: #9327fc;
  border: none !important;
  margin-top: 50px;
}
.setSearch .el-radio__inner {
  border-color: #9327fc;
}

.setSearch .el-radio__input.is-checked + .el-radio__label {
  color: #9327fc;
}
.setSearch .el-radio__input.is-checked .el-radio__inner {
  border-color: #9327fc;
  background-color: #9327fc;
}
.addParams {
  color: #9327fc;
  text-decoration: #9327fc;
  margin-bottom: 30px;
  display: inline-block;
}
.submitSearch {
  background-color: #9327fc;
  border: none;
}
.setSearch .el-dialog {
  height: 60%;
  width: 75% !important;
  overflow-y: auto;
  border-radius: 10px;
}

.preStyle {
  height: 375px;
  text-align: left;
  overflow-y: scroll;
}
.formsearch .el-form-item__label {
  font-weight: bold;
}
</style>
