<template>
  <div class="connect">
    <div class="connectBox">
      <div class="connectTit">加密信息</div>
      <div>
        <img :src="favIconUrl" />
        <div>{{ url }}</div>
      </div>
      <div class="conten">
        只有在您完全理解内容并信任请求网站的情况下，才能进行信息加密。
        您正在进行加密:
      </div>
      <div class="conten">
          <div class="listType">
            <span  style="color: #1e832a"
              >当前</span
            >
          </div>
          <div class="listAddress">{{ plusXing(currentAccont.address) }}</div>
        </div>
      <div class="conten accList">
        
        <div>消息：</div>
        <div>{{message}}</div>
      </div>
    </div>
    <div class="btnBox">
      <el-button class="width110" round @click="closeWindow">拒绝</el-button>
      <el-button class="width110 color7657b1" type="primary" round @click="addUrl"
        >加密</el-button
      >
    </div>
  </div>
</template>

<script>
import { getTab } from "@/utils/popup";
import { plusXing } from "../assets/js/index";
import {
  sendEncryptHash,
  sendExit
} from "@/utils/transaction";
const { ethers } = require('ethers');
const { encryptWithPublicKey, decryptWithPrivateKey, cipher } = require("eth-crypto");
export default {
  data() {
    return {
      favIconUrl: "",
      url: "",
      color: ["#744f68", "#788890", "#ebd40a", "#1e832a", "#abb7bc"],
      connect: null,
      activeItem: [],
      message:this.$route.query[0].message
    };
  },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem("acc"));
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem("currentAccont"));
    },
  },
  mounted() {
    this.getTap();
    // console.log(this.accountAllList);
  },
  methods: {
    getTap() {
      getTab().then((res) => {
        console.log(res);
        this.connect = res;
        this.favIconUrl = res.favIconUrl;
        this.url = res.url;
        this.getActiveItem();
      });
    },
    plusXing(val) {
      return plusXing(val, 5, 10);
    },
    closeWindow() {
      sendExit();
    },


   async addUrl() {
      let that=this;
      console.log(JSON.parse(localStorage.getItem("currentAccont")));
      let account = JSON.parse(localStorage.getItem("currentAccont"));
      const pubey =account.publicKey;
      if(account.type='eth'){
        const encryptedData = await encryptWithPublicKey(pubey.split("0x")[1],that.message);
        console.log(encryptWithPublicKey)
        sendEncryptHash("encryptCrypto_sign",cipher.stringify(encryptedData));
      }else{
        this.$message.warning("请切换至ETH网络");
      }
    },

  },
};
</script>

<style scoped>
.connect {
  width: 460px;
  margin: auto;
  font-family: "AlibabaPuHuiTi-Regular";
}
.connectBox {
  margin: 20px;
}
.connectTit {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}
.conten {
  margin: 20px;
  font-size: 16px;
  /* font-weight: bold; */
}
.accList {
  border: 1px solid gray;
  border-radius: 5px;
  max-height: 300px;
}
.color7657b1{
  background-color: #7657b1 !important;
  border: none !important;
}
.listBox {
  margin: 10px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-items: center;
}
.listType {
  font-size: 15px;
  font-weight: bold;
}
.listAddress {
  font-size: 12px;
}
.iconBox {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  font-size: 20px;
  background: #1cbec8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}
.leftIconBox {
  position: absolute;
  right: 25px;
  font-size: 20px;
}
.btnBox {
  position: absolute;
  width: 100%;
  bottom: 20px;
}
.width110 {
  width: 110px;
}
</style>