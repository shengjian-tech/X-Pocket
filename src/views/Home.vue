<template>
  <div class="home">
    <div class="help">
      <Header />
    </div>
    <!-- <div class="avatarHeader">
      <div class="address_el">
        <div class="addressTitle">Address</div>

        <div class="addressCont">{{ addressInfo }}</div>
      </div>
      <div></div>
      <div class="dropdown_el">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link"><i class="el-icon-more"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" command="a"
              >创建新账户</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-sort" command="b"
              >切换账户</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-download" command="c"
              >钱包插件</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div> -->
    <div class="avatar">
      <img class="avatarImg" src="../assets/headerlogo.png" alt="" />
      <div class="addressfont">区块链地址 <i class="el-icon-sort"></i></div>
      <div class="addresstext">
        {{ addressInfo }} <i class="el-icon-copy-document"></i>
      </div>

      <div class="plugContent">
        <div v-if="plugname">正在使用的插件:{{ plugname }}</div>
        <div v-else>还未安装 快安装插件使用吧</div>
        <el-button type="primary" @click="changePlug()">切换插件</el-button>
      </div>

      <!-- <el-row>
        <el-col :span="18">
          <el-select @change="getSelect" style="width: 100%" v-model="value">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.netName"
              :value="item.netName"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button
            style="float: right; color: #5295FE"
            type="text"
            @click="dialogVisible = true"
            >添加网络</el-button
          >
        </el-col>
      </el-row> -->
    </div>
    <div class="tab tabSetList">
      <div
        class="grid-content bg-purple-light tablistCont"
        style="cursor: pointer"
        v-for="(item, index) in tabsSetList"
        :key="index"
        @click="getDetails(item.name)"
      >
        <p class="eliconFat"><i class="el-icon-view"></i></p>
        <p class="eliconFont" style="font-size: 14px">{{ item.name }}</p>
      </div>

      <!-- <div
        class="grid-content bg-purple tablistCont"
        style="cursor: pointer"
        @click="getDetails('转移资产')"
      >
        <p class="eliconFat"><i class="el-icon-sort"></i></p>
        <p class="eliconFont" style="font-size: 14px">转移</p>
      </div>

      <div
        class="grid-content bg-purple tablistCont"
        style="cursor: pointer"
        @click="getDetails('查询交易')"
      >
        <p class="eliconFat"><i class="el-icon-top"></i></p>
        <p class="eliconFont" style="font-size: 14px">升级</p>
      </div> -->

      <div
        class="grid-content bg-purple tablistCont"
        style="cursor: pointer"
        @click="handleCommand()"
      >
        <p class="eliconFat"><i class="el-icon-menu"></i></p>
        <p class="eliconFont" style="font-size: 14px">插件市场</p>
      </div>
    </div>
    <!-- <div class="tab" v-if="addFromState == 'eth'">
      <el-row>
        <el-col :span="8">
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="getDetails('地址解析')"
          >
            <p class="eliconFat"><i class="el-icon-coin"></i></p>
            <p class="eliconFont" style="font-size: 14px">地址解析</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="getDetails('域名注册查询')"
          >
            <p class="eliconFat"><i class="el-icon-coin"></i></p>
            <p class="eliconFont" style="font-size: 14px">域名注册查询</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="getDetails('地址转账')"
          >
            <p class="eliconFat"><i class="el-icon-coin"></i></p>
            <p class="eliconFont" style="font-size: 14px">地址转账</p>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <br />

    <div class="detailTabs">
      <el-tabs class="tabslist" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-date"></i> NFTS</span>
          <div class="balance">
            <el-row>
              <el-col :span="6">
                <h4 style="text-align: right">Address</h4>
              </el-col>
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <h4 style="padding: 0 20px 0 20px; word-wrap: break-word">
                    {{ addressInfo }}
                  </h4>
                </div>
              </el-col>
            </el-row>
            <br />
            <el-row>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <h4 style="text-align: right">账户余额</h4>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <p style="padding: 0 20px 0 20px; word-wrap: break-word">
                    ￥{{ balanceMoney }}&nbsp;
                    <i
                      @click="balance"
                      style="font-weight: 700; color: #008bd7; cursor: pointer"
                      class="el-icon-refresh-left"
                    ></i>
                    <a
                      href="https://xuper.baidu.com/n/console#/finance/wallet/recharge"
                      target="_blank"
                      style="
                        text-decoration: none;
                        color: #5295fe;
                        float: right;
                      "
                    >
                      去充值
                    </a>
                  </p>
                  <p
                    style="color: red; font-size: 14px"
                    v-if="balanceMoney === 0"
                  >
                    建议在百度超级链充值0.1元，体验插件功能
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="balancelist">
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div><img src="../assets/test.png" alt="" srcset="" /></div>
                  <div>福虎</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div><img src="../assets/test.png" alt="" srcset="" /></div>
                  <div>福虎</div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div><img src="../assets/test.png" alt="" srcset="" /></div>
                  <div>福虎</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div><img src="../assets/test.png" alt="" srcset="" /></div>
                  <div>福虎</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-date"></i> Tokens</span>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label"><i class="el-icon-date"></i> 版权存证</span>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label"><i class="el-icon-date"></i> 游戏道具</span>
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label"><i class="el-icon-date"></i> 区块链域名</span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-drawer title="钱包插件" :visible.sync="drawer" size="70%">
      <div
        class="drawerBtn"
        v-for="(item, index) in componentsList"
        :key="index"
      >
        <img src="../assets/avatar.png" alt="" />
        <div>{{ item.name }}</div>
        <el-button
          v-if="item.type == 1"
          class="drawerDisable"
          type="primary"
          plain
          >已安装</el-button
        >
        <el-button
          v-else
          class="drawerPrimary"
          type="primary"
          plain
          @click="installFile(index)"
          >安装</el-button
        >
      </div>
    </el-drawer>

    <el-drawer title="已安装插件" :visible.sync="isdrawer" size="70%">
      <div class="drawerBtn" v-for="(item, index) in isplugList" :key="index">
        <img src="../assets/avatar.png" alt="" />
        <div>{{ item.plug.plugName }}</div>
        <el-button
          class="drawerPrimary"
          type="primary"
          plain
          @click="selectChangePlug(index)"
          >选择</el-button
        >
      </div>
    </el-drawer>

    <el-dialog :visible.sync="dialogVisible" width="90%">
      <el-form
        style="text-align: left"
        label-position="top"
        :rules="rules"
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="网络名称" prop="netName">
          <el-input
            v-model="ruleForm.netName"
            placeholder="请输入网络名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="网络节点" prop="node">
          <el-input
            v-model="ruleForm.node"
            placeholder="请输入网络节点"
          ></el-input>
        </el-form-item>
        <el-form-item label="链名" prop="chain">
          <el-input
            v-model="ruleForm.chain"
            placeholder="请输入链名"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
import { plusXing } from "../assets/js/index";
import { ethers } from "ethers";
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      addressInfo: "",
      address: JSON.parse(localStorage.getItem("acc")).address,
      balanceMoney: 0,
      dialogVisible: false,
      ruleForm: {
        netName: "",
        node: "",
        chain: "",
      },
      node: "",
      chain: "",
      value: "开放网络",
      rules: {
        netName: [
          { required: true, message: "网络名称不能为空", trigger: "blur" },
        ],
        node: [
          { required: true, message: "网络节点不能为空", trigger: "blur" },
        ],
        chain: [{ required: true, message: "链名不能为空", trigger: "blur" }],
      },
      options: [
        {
          netName: "开放网络",
          node: "https://xuper.baidu.com/nodeapi",
          chain: "xuper",
        },
      ],
      activeName: "1",
      drawer: false,
      isdrawer: false,
      componentsList: [],
      isplugList: [],
      addFromState: "",
      tabsSetList: "",
      plugname: "",
      plugList: [], //已经安装的插件集合
      idArray: [], //已经安装的插件id
    };
  },
  components: { Header },
  created() {
    this.addressInfo = plusXing(
      JSON.parse(localStorage.getItem("acc")).address,
      5,
      5
    );
    if (localStorage.getItem("netList")) {
      var arr = JSON.parse(localStorage.getItem("netList")).netList;
      this.options = this.options.concat(arr);
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          this.balance(item.node, item.chain);
        }
      });
    } else {
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          this.balance(item.node, item.chain);
        }
      });
    }
    localStorage.setItem("nodeApi", this.options[0].node);
    localStorage.setItem("chain", this.options[0].chain);
    // if (localStorage.getItem("chain") == "xuper") {
    //   this.addFromState = "xuper";
    // } else if (localStorage.getItem("chain") == "eth") {
    //   this.addFromState = "eth";
    // }
    if (JSON.parse(localStorage.getItem("plugAll"))) {
      this.plugname = JSON.parse(localStorage.getItem("plugAll"))[
        JSON.parse(localStorage.getItem("plugAll")).length - 1
      ].plug.plugName;
      this.tabsSetList = JSON.parse(localStorage.getItem("addForm")).addList;
    }
  },
  methods: {
    handleCommand() {
      axios({
        url: `https://testmakerone.shengjian.net/qianbao/api/qianbao/qbplugins/list`,
        method: "POST",
        headers: {},
        data: {},
      }).then((res) => {
        if (res.data.status == "success" && res.data.statusCode == "200") {
          this.componentsList = res.data.result;
          console.log(this.componentsList);
          if (localStorage.getItem("array_id")) {
            JSON.parse(localStorage.getItem("array_id")).array_id.forEach(
              (resf) => {
                console.log(resf);
                this.componentsList.map((resmap) => {
                  if (resmap.id == resf) {
                    resmap.type = 1;
                  } else {
                    resmap.type = 0;
                  }
                });
              }
            );
          }
          this.drawer = true;
        } else {
          message.error(res.data.message);
        }
      });
    },
    //判断数据
    getSelect(value) {
      this.options.forEach((item) => {
        if (value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          localStorage.setItem("nodeApi", item.node);
          localStorage.setItem("chain", item.chain);
          // this.balance();
          if (item.chain == "eth") {
            //如果是以太坊 调用以太坊相关方法
            this.addFromState = "eth";
            this.ethBalance();
          } else if (chain == "xuper") {
            this.addFromState = "xuper";
            this.balance();
          }
        }
      });
    },
    //添加网络
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var netArr = {
            netList: [],
          };
          if (localStorage.getItem("netList")) {
            netArr.netList = JSON.parse(
              localStorage.getItem("netList")
            ).netList;
            netArr.netList.push(this.ruleForm);
            localStorage.setItem("netList", JSON.stringify(netArr));
          } else {
            netArr.netList.push(this.ruleForm);
            localStorage.setItem("netList", JSON.stringify(netArr));
          }
          this.dialogVisible = false;
          window.location.reload();
        } else {
          return false;
        }
      });
    },
    //查询余额
    getDetails(index) {
      if (this.balanceMoney === 0) {
        this.$message.warning("请您至少充值0.1元即可正常体验插件功能");
      } else {
        this.$router.push({ path: "/Details", query: { index: index } });
      }
    },
    async balance() {
      const node = this.node;
      const chain = this.chain;
      const params = {
        server: node, // ip, port
        fee: "400", // fee
        endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
        endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
      };
      let nodeStatus = null;
      if (node === "https://xuper.baidu.com/nodeapi") {
        nodeStatus = [
          Endorsement({
            transfer: params,
            makeTransaction: params,
          }),
        ];
      } else {
        nodeStatus = null;
      }
      const xsdk = new XuperSDK({
        node,
        chain,
        plugins: nodeStatus,
      });
      const getBalance = async (address) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await xsdk.getBalance(address);
          this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3);
        } catch (err) {
          throw err;
        }
      };
      getBalance(this.address);
    },

    //切换选项卡
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //切换插件

    changePlug() {
      this.isplugList = JSON.parse(localStorage.getItem("plugAll"));
      this.isdrawer = true;
    },

    //安装
    installFile(index) {
      let that = this;
      console.log(JSON.parse(that.componentsList[index].json));
      let addList = {
        addList: JSON.parse(that.componentsList[index].json).addList,
      };
      let netList = {
        netList: JSON.parse(that.componentsList[index].json).netList,
      };
      //已安装插件id集合
      this.idArray.push(that.componentsList[index].id);
      let array_id = {
        array_id: this.idArray,
      };
      that.plugList.push(JSON.parse(that.componentsList[index].json));
      localStorage.setItem("netList", JSON.stringify(netList));
      localStorage.setItem("addForm", JSON.stringify(addList));
      localStorage.setItem("array_id", JSON.stringify(array_id));
      localStorage.setItem("plugAll", JSON.stringify(that.plugList));
      that.$message.success("安装成功");
      that.drawer = false;
      window.location.reload();
    },

    selectChangePlug(index) {
      let that = this;
      let addList = {
        addList: JSON.parse(localStorage.getItem("plugAll"))[index].addList,
      };
      let netList = {
        netList: JSON.parse(localStorage.getItem("plugAll"))[index].netList,
      };
      localStorage.setItem("netList", JSON.stringify(netList));
      localStorage.setItem("addForm", JSON.stringify(addList));
      this.plugname = JSON.parse(localStorage.getItem("plugAll"))[
        index
      ].plug.plugName;
      that.isdrawer = false;
      window.location.reload();
    },

    //eth查询余额
    async ethBalance() {
      const provider = new ethers.providers.JsonRpcProvider(
        localStorage.getItem("nodeApi")
      );
      let heightBlock = await provider.getBlockNumber();
      console.log(heightBlock);
      let address = "0x519bD63FB86c375C2687AFfe773664D2959a0a48";
      provider.getBalance(address).then((balance) => {
        // 余额是 BigNumber (in wei); 格式化为 ether 字符串
        let etherString = ethers.utils.formatEther(balance);
        console.log("Balance: " + etherString);
      });
    },
  },
};
</script>
<style scoped>
.home {
  width: 400px;
  margin: auto;
}

.home .balance {
  width: 100%;
  padding: 15px 0px 15px 0px;
  border-bottom: 1px solid #ddd;
}
.home .balance p {
  text-align: left;
}
.home .tab {
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 0 30px;
}
.home .tab i {
  color: #ffffff;
  font-size: 32px;
}
</style>
<style>
.el-dialog__header {
  padding: 0;
}
.avatar {
  margin: 0 auto;
  width: 80%;
}
.avatarHeader {
  height: 60px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
}
.addressTitle {
  font-size: 16px;
  font-weight: bold;
}
.addressCont {
  font-size: 14px;
  margin-top: 10px;
  color: #bcbcbc;
}
.avatarImg {
  width: 60px;
  margin-top: 30px;
}
.eliconFat {
  background-color: #5295fe;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.eliconFont {
  font-size: 14px;
  margin-top: 8px;
  color: #5295fe;
}
.detailTabs .el-tabs__item {
  font-size: 12px;
  padding: 0 8px;
}
.detailTabs .el-tabs__active-bar {
  left: 16px;
}
.el-tabs__item.is-active {
  color: #5295fe !important;
}
.el-tabs__active-bar {
  background-color: #5295fe !important;
}
.el-tabs__nav {
  width: 100%;
}
#tab-first {
  width: 50%;
}
#tab-second {
  width: 50%;
}
.address_el {
  flex: 1;
  margin-left: 35px;
}
.dropdown_el {
  margin-right: 20px;
}
.drawerBtn {
  display: flex;
  flex-direction: row;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  width: 95%;
}
.drawerPrimary,
.drawerDisable {
  height: 30px;
  line-height: 7px;
  background-color: #5295fe !important;
  color: #ffffff !important;
  border: none !important;
}
.drawerDisable {
  background-color: #dddddd !important;
}
.balancelist {
  margin-top: 20px;
  width: 97%;
}
.balancelist_bus {
  padding: 20px;
}
.balancelist_busImg {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
.businessCont {
  text-align: left;
  line-height: 22px;
  font-size: 14px;
}
.tokenText {
  display: inline-block;
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tokenText_color {
  display: inline-block;
  width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #5295fe;
}
.tokenIcon {
  vertical-align: 6px;
}
.addressfont {
  font-size: 14px;
  margin: 10px 0px;
}
.addresstext {
  font-size: 14px;
}
.plugContent {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.tabSetList {
  display: flex;
  flex-wrap: wrap;
  width: 330px;
}
.tablistCont {
  margin: 0 0px 20px 10px;
}
</style>