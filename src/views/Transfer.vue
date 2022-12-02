<template>
  <div class="setTrans setLeft" v-loading.fullscreen.lock="fullscreenLoading">
    <Header />
    <div class="headermap">
      <i class="el-icon-arrow-left" @click="goHome"></i>设置/转移
    </div>
    <div class="form transferForm">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item>
          <span class="inputlabel">接收方地址</span>
          <el-input
            v-model="form.address"
            placeholder="请输入接收方地址"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <span class="inputlabel">转移金额</span>
          <el-input
            v-model="form.value"
            placeholder="请输入转移金额"
          ></el-input>
        </el-form-item>
        <div v-if="balanceMoney" class="balanceMoneytext">
          当前余额:{{ balanceMoney }}
        </div>

        <el-form-item class="addNetBtnFath">
          <el-button
            class="addNetBtn"
            type="primary"
            round
            @click="addNetList()"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="确认转账"
      :visible.sync="dialogVisible"
      width="50%"
      class="transferDio"
    >
      <div>
        <span class="disotatle">转入方地址：</span>
        {{ dialogContent.to }}
      </div>
      <div>
        <span class="disotatle">转移金额：</span>{{ dialogContent.value }}
      </div>
      <div><span class="disotatle">消耗Gas：</span>{{ dialogContent.gas }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header";
import { ethers } from "ethers";
export default {
  name: "Transfer",
  data() {
    return {
      form: {
        address: "",
        value: "",
      },
      balanceMoney: "",
      dialogVisible: false,
      netList: JSON.parse(localStorage.getItem("netList")),
      dialogContent: {},
      fullscreenLoading: false,
    };
  },
  components: { Header },
  mounted() {
    this.ethBalance();
  },
  methods: {
    goHome() {
      this.$router.push("/Home");
    },

    //eth查询余额
    async ethBalance() {
      console.log();
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      if (currentNet.type == "eth") {
        let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
        const provider = new ethers.providers.JsonRpcProvider(currentNet.node);
        let heightBlock = await provider.getBlockNumber();
        console.log(heightBlock);
        let address = currentAccont.address;
        provider.getBalance(address).then((balance) => {
          // 余额是 BigNumber (in wei); 格式化为 ether 字符串
          let etherString = ethers.utils.formatEther(balance);
          console.log("Balance: " + etherString);
          this.balanceMoney = etherString;
        });
      }
    },
    async addNetList() {
      console.log(this.form);
      let that = this;

      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node);
      if (currentNet.type == "xuper") {
        this.$message.error("请切换网络使用");
        return false;
      } else if (currentAccont.type == "eth") {
        //地址转账
        that.fullscreenLoading = true;
        let privateKey = currentAccont.privateKey;
        let wallet = new ethers.Wallet(privateKey, provider);
        let gasPrice = await provider.getGasPrice();

        console.log(ethers.utils.formatUnits(gasPrice));
        let object = {
          to: that.form.address,
          value: that.form.value,
          gas: ethers.utils.formatUnits(gasPrice),
        };
        that.dialogContent = object;
        that.fullscreenLoading = false;
        that.dialogVisible = true;
      }
    },

    async confirmBtn() {
      let that = this;
      that.fullscreenLoading = true;
      that.dialogVisible = false;
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node);
      let privateKey = currentAccont.privateKey;
      let wallet = new ethers.Wallet(privateKey, provider);
      let gasPrice = await provider.getGasPrice();
      let tx = await wallet.sendTransaction({
        gasLimit: 21000,
        gasPrice: gasPrice,
        to: that.form.address,
        value: ethers.utils.parseUnits(that.form.value),
      });
      that.fullscreenLoading = false;
      this.$notify({
        title: "交易成功",
        dangerouslyUseHTMLString: true,
        message: `交易哈希: ${tx.hash}`,
        type: "success",
        duration: 0,
      });
    },
  },
};
</script>
<style>
.disotatle {
  font-weight: bold;
  margin: 4px 0px;
  display: inline-block;
}
.balanceMoneytext {
  color: #666666;
}
.setTrans {
  width: 460px;
  /* height: 460px; */
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
}
.setLeft {
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
.addNetBtnFath {
  text-align: center;
}
.transferForm .addNetBtn {
  width: 160px;
  height: 40px;
  border-radius: 40px !important;
  background-color: #9327fc;
  border: none !important;
  margin-top: 50px;
}
.dialog-footer .el-button--primary {
  background-color: #9327fc;
  border: none !important;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background: #9327fc;
  border: none !important;
  color: #fff;
}
.transferDio .transferDio .el-dialog__footer {
  text-align: center;
}

.transferDio .el-dialog__footer .el-button {
  border-radius: 30px !important;
  height: 30px;
  line-height: 8px;
}
.transferDio .el-dialog {
  width: 50% !important;
  height: auto !important;
  border-radius: 10px !important;
  overflow-y: auto !important;
}
.transferDio .el-dialog__header {
  padding: 20px 20px 10px !important;
}
.el-notification__content p {
  word-break: break-all;
}
</style>
