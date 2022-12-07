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
    </div>
    <div class="avatar">
      <img class="avatarImg" src="../assets/headerlogo.png" alt="" />
      <div class="blancetext">{{ balanceMoney }}</div>
      <div class="nowPlugin" v-if="plugname">
        <span>正在展示{{ plugname }}插件</span>
        <i class="el-icon-sort newPluginIcon" @click="changePlug()"></i>
      </div>
      <div class="nowPlugin" v-else>
        <span>还未安装插件,快安装插件体验吧</span>
      </div>
      <div class="tab tabSetList">
        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          @click="goSearchFun()"
        >
          <p class="eliconFat"><i class="el-icon-search"></i></p>
          <p class="eliconFont" style="font-size: 14px">查询</p>
        </div>
        <div
          class="grid-content bg-purple tablistCont"
          style="cursor: pointer"
          @click="goTransFun()"
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
          <p class="eliconFat"><i :class="item.icon"></i></p>
          <p class="eliconFont" style="font-size: 14px">{{ item.name }}</p>
        </div>
      </div>
    </div>
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
                    <el-dropdown-item
                      v-for="(item, index) in pluginsTabList[0]"
                      :key="index"
                      @click.native="gettablist(item)"
                      >{{ item.nftsname }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <div class="balancelist">
                <div
                  class="grid-content bg-purple nftsClass"
                  v-for="(items, index) in nfts"
                  :key="index"
                >
                  <div @click="goNftDetail(items)">
                    <img :src="items.image_uri" alt="" srcset="" />
                  </div>
                  <div>{{ items.name }}</div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label"><i class="el-icon-date"></i> 版权存证</span>
              <div>暂无更多数据</div>
            </el-tab-pane>
            <el-tab-pane name="3">
              <span slot="label"><i class="el-icon-date"></i> 游戏道具</span>
              <div>暂无更多数据</div>
            </el-tab-pane>
            <el-tab-pane name="4">
              <span slot="label"><i class="el-icon-date"></i> 区块链域名</span>
              <div>暂无更多数据</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Tokens">
        <div class="tokensStyles">
          <div class="tokenslist">
            <span class="tokenslist_firstspan">Tokens</span>
            <span class="tokenslist_lastspan">余额</span>
          </div>
          <div
            class="tokenslist tokenslistBottom"
            v-for="(items, index) in tokens"
            :key="index"
          >
            <span class="tokenslist_bottom_left">
              <img src="../assets/avatar.png" alt="" srcset="" />
              <span>{{ items.name }}</span>
            </span>
            <span class="tokenslist_bottom_right">{{ items.balance }}</span>
          </div>
        </div>
      </el-tab-pane>
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
              class="addNetBtnHome drawerDisable"
              type="primary"
              round
              >已安装</el-button
            >
            <el-button
              v-else
              class="addNetBtnHome"
              type="primary"
              round
              @click="installFile(index)"
              >安装</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>

    <el-drawer title="已安装插件" :visible.sync="isdrawer" size="80%">
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
      address: JSON.parse(localStorage.getItem("currentAccont")).address,
      balanceMoney: 0,
      dialogVisible: false,
      ruleForm: {
        netName: "",
        node: "",
        chain: "",
      },
      node: "",
      chain: "",
      value: "xuperchain",
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
          netName: "xuperchain",
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
      pluginsTabList: [],
      nfts: [], //当年账户的nfts
      tokens: [], //tokens列表
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
      this.plugname = currentPlug.plugName;
      this.tabsSetList = currentPlug;
      console.log(this.tabsSetList);
      this.pluginsTabList = currentPlug.tabCont;
    } else {
      if (installed) {
        let currentPlug = installed[installed.length - 1];
        this.plugname = currentPlug.plugName;
        this.tabsSetList = currentPlug;
        localStorage.setItem("currentPlug", JSON.stringify(currentPlug));
      }
    }
    //登录成功后 显示余额
    let currentNet = JSON.parse(localStorage.getItem("currentNet"));
    if (currentNet.type == "xuper") {
      //调用xuper网络
      this.balance();
    } else if (currentNet.type == "eth") {
      this.ethBalance();
    }
    //tokens
    this.getTokensList();
  },
  methods: {
    noFun() {
      this.$message.error("暂未开放，请添加插件使用");
    },
    goSearchFun() {
      this.$router.push({ path: "/Search" });
    },
    goTransFun() {
      this.$router.push({ path: "/Transfer" });
    },
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
      const acc = JSON.parse(localStorage.getItem("currentAccont"));
      if (netWork.type == "xuper") {
        const node = netWork.node;
        const chain = netWork.chain;
        const xsdk = new XuperSDK({
          node,
          chain,
          env: {
            node: {
              disableGRPC: true,
            },
          },
        });

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
        this.$message.error("该网络暂无插件，请切换网络");
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
    //nft详情
    goNftDetail(item) {
      this.$router.push({
        path: "/NftDetail",
        query: { item: JSON.stringify(item) },
      });
    },
    async balance() {
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      const node = currentNet.node;
      const chain = currentNet.chain;
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
          console.log(this.balanceMoney);
        } catch (err) {
          throw err;
        }
      };
      getBalance(currentAccont.address);
    },

    //接受 header 子组件传递过来的内容

    getAccound(msg, net) {
      console.log(msg);
      localStorage.setItem("currentAccont", JSON.stringify(msg));
      this.addressInfo = plusXing(
        JSON.parse(localStorage.getItem("currentAccont")).address,
        5,
        5
      );
      if (net) {
        localStorage.setItem("currentNet", JSON.stringify(net));
        if (net.type == "xuper") {
          this.balance();
        } else if (net.type == "eth") {
          this.ethBalance();
        }
      } else {
        let currentNet = JSON.parse(localStorage.getItem("currentNet"));
        if (currentNet.type == "xuper") {
          this.balance();
        } else if (currentNet.type == "eth") {
          this.ethBalance();
        }
      }

      this.getTokensList();
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
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$message.success("当前浏览器不支持复制！");
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
              that.pluginsTabList = indata.tabCont;
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
      console.log();
      let currentNet = JSON.parse(localStorage.getItem("currentNet"));
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
    },

    //
    gettablist(item) {
      console.log(item);
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));
      axios({
        url: `${item.nftsurl}/${currentAccont.address}?contract_address=${item.contract_address}`,
        method: "GET",
        headers: {
          "X-API-KEY": item.xapikey,
        },
        data: {},
      }).then((res) => {
        if (res.data.status == "success" && res.data.statusCode == "200") {
          this.nfts = JSON.parse(res.data.result);
          console.log(this.nfts);
        } else {
          message.error(res.data.message);
        }
      });
    },

    //获取当前网络tokens 列表
    getTokensList() {
      let netList = JSON.parse(localStorage.getItem("netList"));
      let currentAccont = JSON.parse(localStorage.getItem("currentAccont"));

      let tokenslist = [];
      netList.map((item) => {
        if (item.type == "xuper" && currentAccont.type == "xuper") {
          const node = item.node;
          const chain = item.chain;
          const params = {
            server: node, // ip, port
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
          const getBalance = async (address) => {
            try {
              const result = await xsdk.getBalance(address);
              this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3);
              tokenslist.push({
                name: item.chain,
                balance: (result.bcs[0].balance / 100000).toFixed(3),
              });
              console.log(tokenslist);
            } catch (err) {
              throw err;
            }
          };
          getBalance(currentAccont.address);
        } else if (item.type == "eth" && currentAccont.type == "eth") {
          const provider = new ethers.providers.JsonRpcProvider(item.node);
          let address = currentAccont.address;
          provider.getBalance(address).then((balance) => {
            // 余额是 BigNumber (in wei); 格式化为 ether 字符串
            let etherString = ethers.utils.formatEther(balance);
            tokenslist.push({
              name: item.chain,
              balance: etherString,
            });

            console.log(tokenslist);
          });
        }
      });
      this.tokens = tokenslist;
    },
  },
};
</script>
<style scoped>
.home {
  width: 460px;
  height: 1012px;
  margin: auto;
}

.home .el-tabs--border-card {
  border: none;
  box-shadow: none;
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
  margin-bottom: 0px;
  padding: 0 30px;
  padding-bottom: 40px;
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
  background-size: cover;
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
  width: 42px;
  height: 42px;
  margin-top: 34px;
}
.blancetext {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.balancelist .nftsClass {
  width: 33.33%;
  margin-bottom: 20px;
}
.balancelist .nftsClass img {
  width: 100px;
  height: 100px;
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
.plugList .addNetBtnHome {
  height: 22px;
  background-color: #9327fc;
  border: none;
  line-height: 3px;
}
.listdetail span {
  margin: 20px 0;
}
.home .el-tabs--border-card {
  background: #fff !important;
  border-top: 1px solid #dcdfe6 !important;
  border-bottom: none !important;
}

.tokensStyles {
  width: 90%;
  margin: 0 auto;
}
.tokenslist {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
  height: 65px;
  margin: 0 auto;
}
.tokenslistBottom {
  justify-content: space-around;
}
.tokenslist span img {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 20px;
}
.tokenslist span:first-child {
  display: flex;
  align-items: center;
}
.tokenslist_firstspan {
  margin-left: 50px;
}
.tokenslist_lastspan {
  margin-right: 64px;
}
</style>