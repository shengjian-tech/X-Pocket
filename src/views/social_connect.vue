<template>
  <div class="connect">
    <div class="connectBox">
      <div class="connectTit">发布信息</div>
      <div>
        <img :src="favIconUrl" />
        <div>{{ url }}</div>
      </div>
      <div class="conten">
        只有在您完全理解内容并信任请求网站的情况下，才能进行信息发布。
        您正在进行信息发布:
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
      <el-button class="width110 color7657b1" type="primary" round @click="getLogin"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
import { ethers } from "ethers";
import moment from "moment"
import { KJUR, KEYUTIL, RSAKey,hextob64 } from 'jsrsasign'
import {
  sendSocialHash,
  sendExit
} from "@/utils/transaction";
import { plusXing } from "../assets/js/index";
export default {
  name: "social",
  data() {
    return {
      state: this.$route.query.state,
      password: "",
      favIconUrl: "",
      url: "",
      color: ["#744f68", "#788890", "#ebd40a", "#1e832a", "#abb7bc"],
      connect: null,
      activeItem: [],
      message:this.$route.query[0].message,
      signatureString:this.$route.query[0].signatureString,
      algorithm:this.$route.query[0].algorithm
    };
  },
  components: { Header },
  computed: {
    accountAllList() {
      return JSON.parse(localStorage.getItem("acc"));
    },
    currentAccont() {
      return JSON.parse(localStorage.getItem("currentAccont"));
    },
  },
  mounted() {},
  methods: {
    plusXing(val) {
      return plusXing(val, 5, 10);
    },
    closeWindow() {
      sendExit();
    },
    //开放网络
   async getLogin() {
      let that =this;
      let account = JSON.parse(localStorage.getItem("currentAccont"));
      
      if(that.algorithm=='rsa-sha256'){
       
      }else if(that.algorithm=='secp256k1'){
        const privateKey =account.privateKey; // 用你自己的私钥替换
        const wallet = new ethers.Wallet(privateKey);
        const messageBytes = ethers.utils.toUtf8Bytes(that.signatureString);
        const signature = await wallet.signMessage(messageBytes);
        sendSocialHash("social_sign",signature)
      } 
    },
    signWithPrivateKey(signingString, privateKey) {
      const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
      sig.init(privateKey);
      sig.updateString(signingString);
      const signature = sig.sign();
      // 将签名结果进行 Base64 编码
      const signatureBase64 = hextob64(signature);
      return signatureBase64;
   }
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