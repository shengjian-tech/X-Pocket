<template>
  <div class="home">
    <div class="help">
      <Header @transfer="getAccound" />
    </div>
    <div class="avatarHeader">
      <div class="address_el">
        <div class="addressTitle">区块链地址</div>

        <div class="addressCont">
          {{ addressInfo }}
          <i
            class="el-icon-copy-document copycont"
            :data-clipboard-text="address"
            @click="copy"
          ></i>
        </div>
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
    </div>
    <div class="avatar">
      <img class="avatarImg" src="../assets/headerlogo.png" alt="" />
      <div class="nowPlugin">
        正在展示{{ plugname }}插件
        <i class="el-icon-sort newPluginIcon" @click="changePlug()"></i>
      </div>
      <div class="tab tabSetList">
        <!-- <div
          class="grid-content bg-purple-light tablistCont"
          style="cursor: pointer"
          v-for="(item, index) in tabsSetList"
          :key="index"
          @click="getDetails(item.name)"
        >
          <p class="eliconFat"><i class="el-icon-view"></i></p>
          <p class="eliconFont" style="font-size: 14px">{{ item.name }}</p>
        </div> -->
        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          @click=""
        >
          <p class="eliconFat"><i class="el-icon-search"></i></p>
          <p class="eliconFont" style="font-size: 14px">查询</p>
        </div>
        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          @click=""
        >
          <p class="eliconFat"><i class="el-icon-sort"></i></p>
          <p class="eliconFont" style="font-size: 14px">转移</p>
        </div>

        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          @click="getPlugMethod()"
        >
          <p class="eliconFat"><i class="el-icon-menu"></i></p>
          <p class="eliconFont" style="font-size: 14px">插件市场</p>
        </div>

        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          v-for="(item, index) in tabsSetList.addList"
          :key="index"
          @click="getDetails(index)"
        >
          <p class="eliconFat"><i class="el-icon-sort"></i></p>
          <p class="eliconFont" style="font-size: 14px">{{ item.name }}</p>
        </div>
      </div>

      <!-- <div class="plugContent">
        <div v-if="plugname">正在使用的插件:{{ plugname }}</div>
        <div v-else>还未安装 快安装插件使用吧</div>
        <el-button type="primary" @click="changePlug()">切换插件</el-button>
      </div> -->

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

    <el-tabs type="border-card" class="firstTabs">
      <el-tab-pane label="NFTS">
        <div class="detailTabs">
          <el-tabs
            class="tabslist"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane name="1">
              <span slot="label" class="el-dropdown-link">
                <el-dropdown trigger="click" class="tabsDropdown">
                  <span class="el-dropdown-link"
                    ><i class="el-icon-date"></i> NFTS
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>1</el-dropdown-item>
                    <el-dropdown-item>2</el-dropdown-item>
                    <el-dropdown-item>3</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <div class="balancelist">
                <el-row :gutter="20" style="margin-top: 10px">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div>
                        <img src="../assets/test.png" alt="" srcset="" />
                      </div>
                      <div>福虎</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div>
                        <img src="../assets/test.png" alt="" srcset="" />
                      </div>
                      <div>福虎</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 10px">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div>
                        <img src="../assets/test.png" alt="" srcset="" />
                      </div>
                      <div>福虎</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div>
                        <img src="../assets/test.png" alt="" srcset="" />
                      </div>
                      <div>福虎</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label"><i class="el-icon-date"></i> 版权存证</span>
            </el-tab-pane>
            <el-tab-pane name="3">
              <span slot="label"><i class="el-icon-date"></i> 游戏道具</span>
            </el-tab-pane>
            <el-tab-pane name="4">
              <span slot="label"><i class="el-icon-date"></i> 区块链域名</span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Tokens">配置管理</el-tab-pane>
    </el-tabs>

    <el-drawer title="插件市场" :visible.sync="drawer" size="80%">
      <div class="drawerBtn">
        <div class="plugList">
          <div
            class="listdetail"
            v-for="(item, index) in pluginsList"
            :key="index"
          >
            <img src="../assets/logo.png" alt="" />
            <span>{{ item[1].name }}</span>
            <el-button
              v-if="item[3].state && item[3].state == 1"
              class="addNetBtn drawerDisable"
              type="primary"
              round
              >已安装</el-button
            >
            <el-button
              v-else
              class="addNetBtn"
              type="primary"
              round
              @click="installFile(index)"
              >安装</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>

    <el-drawer title="已安装插件" :visible.sync="isdrawer" size="70%">
      <div class="drawerBtn">
        <div class="plugList">
          <div
            class="listdetail"
            v-for="(item, index) in isplugList"
            :key="index"
          >
            <img src="../assets/logo.png" alt="" />
            <span>{{ item.plugName }}</span>

            <el-button
              class="addNetBtn"
              type="primary"
              round
              @click="selectChangePlug(index)"
              >选择</el-button
            >
          </div>
        </div>
        <!-- <img src="../assets/avatar.png" alt="" />
        <div>{{ item.plugName }}</div>
        <el-button
          class="drawerPrimary"
          type="primary"
          plain
          @click="selectChangePlug(index)"
          >选择</el-button
        > -->
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
import Clipboard from "clipboard";
import { ethers } from "ethers";
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      addressInfo: "",
      address: "",
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
      pluginsList: [], //
    };
  },
  components: { Header },
  created() {
    this.addressInfo = plusXing(
      JSON.parse(localStorage.getItem("currentAccont")).address,
      5,
      5
    );

    let currentPlug = JSON.parse(localStorage.getItem("currentPlug"));
    let installed = JSON.parse(localStorage.getItem("installed"));
    if (currentPlug) {
      //如果已经有已经安装的插件列表,默认显示 最后一个安装的插件
      this.plugname = currentPlug.plugName;
      this.tabsSetList = currentPlug;
      console.log(this.tabsSetList);
    } else {
      if (installed) {
        let currentPlug = installed[installed.length - 1];
        this.plugname = currentPlug.plugName;
        this.tabsSetList = currentPlug;
        localStorage.setItem("currentPlug", JSON.stringify(currentPlug));
      }
    }

    // localStorage.setItem("nodeApi", this.options[0].node);
    // localStorage.setItem("chain", this.options[0].chain);
    // if (localStorage.getItem("chain") == "xuper") {
    //   this.addFromState = "xuper";
    // } else if (localStorage.getItem("chain") == "eth") {
    //   this.addFromState = "eth";
    // }
    // if (JSON.parse(localStorage.getItem("plugAll"))) {
    //   this.plugname = localStorage.getItem("plugname");
    //   this.tabsSetList = JSON.parse(localStorage.getItem("addForm")).addList;
    // }
    // this.node = localStorage.getItem("nodeApi");
    // this.chain = localStorage.getItem("chain");

    // if (this.chain == "xuper") {
    //   this.balance();
    // } else if (this.chain == "eth") {
    //   this.ethBalance();
    // }
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
            this.componentsList.map((resmap) => {
              if (
                JSON.parse(localStorage.getItem("array_id")).array_id.includes(
                  resmap.id
                )
              ) {
                resmap.type = 1;
              } else {
                resmap.type = 0;
              }
            });
          }
          this.drawer = true;
        } else {
          message.error(res.data.message);
        }
      });
    },
    //打开插件页面
    getPluglist() {
      this.$router.push({ path: "/Pluglist" });
    },
    //通过合约获取已经安装的插件
    getPlugMethod() {
      let that = this;
      that.pluginsList = [];
      let netWork = JSON.parse(localStorage.getItem("currentNet"));
      if (netWork.type == "xuper") {
        const node = netWork.node;
        const chain = netWork.chain;
        const xsdk = new XuperSDK({ node, chain });
        const acc = JSON.parse(localStorage.getItem("currentAccont"));
        const queryNFTBalance = async () => {
          try {
            const args = {};
            const demo = await xsdk.invokeSolidityContarct(
              "pluginQuery",
              "allIds",
              "evm",
              args,
              "0",
              acc
            );
            const len = demo.preExecutionTransaction.response.responses.length;
            if (len > 0) {
              const str =
                demo.preExecutionTransaction.response.responses[len - 1].body;
              const result = Buffer.from(str, "base64").toString("ascii");
              let idsArray = JSON.parse(JSON.parse(result)[0]["0"]);
              console.log(idsArray);
              idsArray.map(async (idItem) => {
                const argsById = {
                  pluginId: JSON.stringify(idItem),
                };
                const pluginById = await xsdk.invokeSolidityContarct(
                  "pluginQuery",
                  "getPluginById",
                  "evm",
                  argsById,
                  "0",
                  acc
                );
                const pluginByIdlen =
                  pluginById.preExecutionTransaction.response.responses.length;
                if (pluginByIdlen > 0) {
                  const pluginstr =
                    pluginById.preExecutionTransaction.response.responses[
                      pluginByIdlen - 1
                    ].body;
                  const result = Buffer.from(pluginstr, "base64").toString(
                    "ascii"
                  );
                  //增加已安装的状态。
                  let resultArray = JSON.parse(result);
                  let aninsplug = localStorage.getItem("installed");
                  if (aninsplug) {
                    let newArray = [];
                    JSON.parse(aninsplug).map((item) => {
                      newArray.push(item.id);
                    });
                    console.log(newArray.includes(resultArray[0].id));
                    if (newArray.includes(resultArray[0].id)) {
                      resultArray.push({ state: 1 });
                    } else {
                      resultArray.push({ state: 0 });
                    }
                  } else {
                    resultArray.push({ state: 0 });
                  }
                  that.pluginsList.push(resultArray);
                }
              });
            }
            console.log(that.pluginsList);
            this.drawer = true;
          } catch (err) {
            console.log(err);
          }
        };
        queryNFTBalance();
      } else {
      }
    },

    //判断数据
    getSelect(value) {
      this.options.forEach((item) => {
        if (value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          localStorage.setItem("nodeApi", item.node);
          localStorage.setItem("chain", item.chain);
          this.balance();
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
      this.$router.push({
        path: "/Pluglist",
        query: { index: JSON.stringify(index) },
      });
    },
    async balance() {
      const node = this.node;
      const chain = this.chain;
      console.log(node);
      console.log(chain);
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

    //接受 header 子组件传递过来的内容

    getAccound(msg) {
      console.log(msg);
      localStorage.setItem("currentAccont", JSON.stringify(msg));
      this.addressInfo = plusXing(
        JSON.parse(localStorage.getItem("currentAccont")).address,
        5,
        5
      );
    },

    //切换选项卡
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //切换插件

    changePlug() {
      this.isplugList = JSON.parse(localStorage.getItem("installed"));
      this.isdrawer = true;
    },
    //复制
    copy() {
      var clipboard = new Clipboard(".copycont");
      clipboard.on("success", (e) => {
        this.$message.success("复制成功！");
        console.log(e);
        //  释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$message.success("当前浏览器不支持复制！");
        console.log(e);
        // 不支持复制
        // 释放内存
        clipboard.destroy();
      });
    },

    //安装
    installFile(index) {
      let that = this;
      let plug = that.pluginsList;
      let installData = plug[index];
      let installId = installData[0].id;
      let installName = installData[1].name;
      let installedPlugin = JSON.parse(localStorage.getItem("installed"));
      let some = [];
      console.log(installId);
      let netWork = JSON.parse(localStorage.getItem("currentNet"));
      if (netWork.type == "xuper") {
        const node = netWork.node;
        const chain = netWork.chain;
        const xsdk = new XuperSDK({ node, chain });
        const acc = JSON.parse(localStorage.getItem("currentAccont"));
        const queryNFTBalance = async () => {
          try {
            const args = {
              pluginId: installId,
            };
            const demo = await xsdk.invokeSolidityContarct(
              "pluginQuery",
              "getPluginData",
              "evm",
              args,
              "0",
              acc
            );
            const len = demo.preExecutionTransaction.response.responses.length;
            if (len > 0) {
              const str =
                demo.preExecutionTransaction.response.responses[len - 1].body;
              const result = Buffer.from(str, "base64").toString("utf-8");
              console.log(JSON.parse(JSON.parse(result)[0].data));
              let indata = JSON.parse(JSON.parse(result)[0].data);
              indata.id = installId;
              indata.plugName = installName;
              if (!installedPlugin) {
                installedPlugin = [];
              }
              installedPlugin.push(indata);
              //去重
              installedPlugin.forEach((el) => {
                if (!some.some((e) => e.id == el.id)) {
                  some.push(el);
                }
              });
              localStorage.setItem("installed", JSON.stringify(some));
              that.plugname = installName;
              console.log("--------");
              console.log(indata);
              that.tabsSetList = indata;
              localStorage.setItem("currentPlug", JSON.stringify(indata));
              this.drawer = false;
            }
          } catch (err) {
            console.log(err);
          }
        };
        queryNFTBalance();
      } else {
      }
    },

    selectChangePlug(index) {
      let that = this;
      let installed = JSON.parse(localStorage.getItem("installed"));
      let currentPlug = installed[index];
      that.plugname = installed[index].plugName;
      that.tabsSetList = currentPlug;
      localStorage.setItem("currentPlug", JSON.stringify(currentPlug));
      that.isdrawer = false;
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
        this.balanceMoney = etherString;
      });
    },
  },
};
</script>
<style scoped>
.home {
  width: 635px;
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
  padding-bottom: 20px;
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
  background: url("../assets/fontbg.png") no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
}
.nowPlugin {
  color: #6cfff4;
  margin-top: 20px;
}
.avatarHeader {
  height: 60px;
  display: flex;
  background-color: #7657b1;
  flex-direction: row;
  height: 82px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.addressTitle {
  font-size: 16px;
  font-weight: bold;
}
.addressCont {
  font-size: 12px;
  margin-top: 10px;
  color: #ffffff;
}
.avatarImg {
  width: 90px;
  height: 90px;
  margin-top: 34px;
}
.newPluginIcon {
  color: #ffffff;
  margin-left: 12px;
}
.eliconFat {
  background-color: #ffffff;
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
.eliconFat .el-icon-menu,
.eliconFat .el-icon-search,
.eliconFat .el-icon-sort {
  color: #5832a0 !important;
}
.eliconFont {
  font-size: 14px;
  margin-top: 17px;
  color: #ffffff;
}
.detailTabs .el-tabs__item {
  font-size: 12px;
  padding: 0 8px;
}
.detailTabs .el-tabs__active-bar {
  left: 118px;
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
  flex-direction: row;
  width: 360px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tablistCont {
  margin: 0 0px 20px 10px;
  width: 30%;
}
.tabsDropdown .el-dropdown-link {
  color: #333333 !important;
}
.plugList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
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
</style>