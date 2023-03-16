<template>
  <div class="connect">
    <div class="connectBox">
      <div class="connectTit">连接详情</div>
      <div>
        <img :src="favIconUrl" />
        <div>{{ url }}</div>
      </div>
      <div class="conten">
        已授权该站点访问区块链网络信息、链账户信息、以及发起交易申请的权限。
      </div>
      <div class="accList">
        <div
          v-for="(item, index) in accountAllList"
          :key="index"
          @click="active(item)"
          class="listBox"
        >
          <div class="iconBox">
            <i class="el-icon-wallet" :style="{ color: color[index] }"></i>
          </div>
          <div>
            <div class="listType">
              {{ item.type }}
              <span
                v-if="item.address == currentAccont.address"
                style="color: #1e832a"
                >当前</span
              >
            </div>
            <div class="listAddress">{{ plusXing(item.address) }}</div>
          </div>
          <div class="leftIconBox" v-show="iconShow(item)">
            <i class="el-icon-circle-check" style="color: #67c23a"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="btnBox">
      <el-button class="width110" round @click="closeWindow">关闭</el-button>
      <el-button class="width110 color7657b1" type="primary" round @click="editUrl"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { getTab } from "@/utils/popup";
import { plusXing } from "../assets/js/index";
export default {
  data() {
    return {
      favIconUrl: "",
      url: "",
      color: ["#744f68", "#788890", "#ebd40a", "#1e832a", "#abb7bc"],
      connect: null,
      activeItem: [],
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
        let connectList = JSON.parse(localStorage.getItem("connectList"))
          ? JSON.parse(localStorage.getItem("connectList"))
          : [];
        connectList.forEach((element) => {
          if (element.url == this.url) {
            this.activeItem = element.accountList;
          }
        });
      });
    },
    plusXing(val) {
      return plusXing(val, 5, 10);
    },
    active(item) {
      let index = this.activeItem.findIndex((obj) => {
        return obj.address == item.address;
      });
      if (index == -1) {
        this.activeItem.push(item);
      } else {
        this.activeItem.splice(index, 1);
      }
      console.log(this.activeItem);
    },
    iconShow(item) {
      let index = this.activeItem.findIndex((obj) => {
        return obj.address == item.address;
      });
      if (index == -1) {
        return false;
      } else {
        return true;
      }
    },
    closeWindow() {
      this.$router.go(-1);
    },
    editUrl() {
      if (this.activeItem.length == 0) {
        this.$message.warning("请选择最少一个账户");
        return;
      }
      let connectList = JSON.parse(localStorage.getItem("connectList"))
        ? JSON.parse(localStorage.getItem("connectList"))
        : [];
      connectList.forEach((element) => {
        if (element.url == this.url) {
          element.accountList = this.activeItem;
        }
      });
      localStorage.setItem("connectList", [JSON.stringify(connectList)]);
      this.$message.success("授权成功");
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
.btnBox {
  position: absolute;
  width: 100%;
  bottom: 20px;
}
.width110 {
  width: 110px;
}
.leftIconBox {
  position: absolute;
  right: 25px;
  font-size: 20px;
}
</style>