<template>
  <div class="header">
    <el-row>
      <el-col :span="12" class="help_out_more">
        <el-row style="width: 100%">
          <el-col :span="8">
            <div class="headerFant">
              <img
                class="headerlogo"
                src="../assets/X_Pocket.png"
                alt=""
                srcset=""
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="headerSelect">
              <img
                class="lineState"
                src="../assets/line.png"
                alt=""
                srcset=""
              />
              <el-select @change="getSelect" v-model="value">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.netName"
                  :value="index"
                >
                </el-option>
                <div class="addNetButton">
                  <span @click="goAddNet()">添加网络</span>
                </div>
              </el-select>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="headerImgLogo">
              <div class="dropdown_el">
                <el-dropdown trigger="click" @command="handleCommand">
                  <img src="../assets/avatar.png" alt="" />
                  <el-dropdown-menu slot="dropdown">
                    <div class="dropHeader">
                      <h3>我的账户</h3>
                    </div>

                    <el-dropdown-item
                      v-for="(item, index) in accountAllList"
                      :key="index"
                      @click.native="changeAccount(item)"
                      command="list"
                      class="dropHeaderItem"
                    >
                      <span class="dropHeaderSpan"
                        ><span class="addreslistindex">{{ index + 1 }}</span
                        ><span class="addreslistspan">{{
                          item.address
                        }}</span></span
                      >
                    </el-dropdown-item>

                    <el-dropdown-item
                      icon="el-icon-plus"
                      command="a"
                      class="topBoderStyle"
                      >新建地址</el-dropdown-item
                    >
                    <!-- <el-dropdown-item icon="el-icon-sort" command="b"
                      >导入钱包</el-dropdown-item
                    > -->
                    <el-dropdown-item icon="el-icon-download" command="c"
                      >设置</el-dropdown-item
                    >
                    <el-dropdown-item icon="el-icon-circle-close" command="d"
                      >注销</el-dropdown-item
                    >
                    <div class="showdropBtn">
                      <el-button
                        size="mini"
                        round
                        type="primary"
                        class="dropReset"
                        @click="goout()"
                        >重置账户</el-button
                      >
                      <el-button
                        size="mini"
                        type="info"
                        class="dropOut"
                        @click="goout()"
                        >退出</el-button
                      >
                    </div>
                    <div class="dropFooter">当前版本为X Pocket v0.0.1</div>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        style="text-align: left"
        label-position="top"
        :model="addForm"
        :rules="rules1"
        ref="addForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="操作名称" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入您要添加的操作名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作类型" prop="type">
              <el-radio-group v-model="addForm.type">
                <el-radio label="transaction">交易</el-radio>
                <el-radio label="query">查询</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
          <el-button size="small" type="primary" @click="addParams"
            >添加操作参数</el-button
          >
          <el-row
            :gutter="20"
            v-for="(item, index) in addForm.formValue"
            :key="index"
          >
            <el-col :span="10">
              <el-form-item label="参数名称">
                <el-input
                  v-model="item.label"
                  placeholder="请输入您要添加的参数名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="参数">
                <el-input
                  v-model="item.value"
                  placeholder="请输入您要添加的参数"
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
        <el-button size="small" type="primary" @click="submit('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { plusXing } from "../assets/js/index";
export default {
  data() {
    return {
      addressInfo: "",
      visible: false,
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
      options: [
        {
          netName: "xuperchain",
          node: "https://xuper.baidu.com/nodeapi",
          chain: "xuper",
        },
      ],
      value: "xuperchain",
      accountAllList: [],
    };
  },
  mounted() {
    //设置默认网络
    let netList = JSON.parse(localStorage.getItem("netList"));
    this.options = JSON.parse(localStorage.getItem("netList"));
    let acc = JSON.parse(localStorage.getItem("currentAccont"));
    let closeState = localStorage.getItem("closeState");
    let closepwd = localStorage.getItem("closepwd");
    if (acc) {
      if (closeState == true && closepwd) {
        this.$router.push("/pwdLogin");
      } else {
        this.value = acc.type == "xuper" ? "xuperchain" : "以太坊";
        console.log(this.value);
        if (localStorage.getItem("accountAllList")) {
          this.accountAllList = JSON.parse(
            localStorage.getItem("accountAllList")
          );
        }
        this.addressInfo = plusXing(
          JSON.parse(localStorage.getItem("currentAccont")).address,
          5,
          5
        );

        if (acc.type == "xuper") {
          localStorage.setItem("currentNet", JSON.stringify(netList[0]));
        } else if (acc.type == "eth") {
          localStorage.setItem("currentNet", JSON.stringify(netList[1]));
        }
      }
    } else {
      this.$router.push("/Login");
    }
  },
  methods: {
    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: "", label: "" });
    },
    getSetting() {
      this.$router.push("/Home");
    },
    goAddNet() {
      this.$router.push("/Addnet");
    },
    //新增操作
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var localArr = {
            addList: [],
          };
          if (localStorage.getItem("addForm")) {
            localArr.addList = JSON.parse(
              localStorage.getItem("addForm")
            ).addList;
            localArr.addList.push(this.addForm);
            localStorage.setItem("addForm", JSON.stringify(localArr));
          } else {
            localArr.addList.push(this.addForm);
            localStorage.setItem("addForm", JSON.stringify(localArr));
          }
          this.visible = false;
          window.location.reload();
        } else {
          return false;
        }
      });
    },
    //退出
    getOut() {
      localStorage.clear();
      this.$router.replace("/Login");
    },
    goMakerOne() {
      window.location.href =
        "https://makerone.shengjian.net/front_nft_mobileN/nft_mobileN_home";
    },

    //判断数据
    getSelect(value) {
      //切换网络，先看看 是否存在同类型网络账户，如果没有，前去登录。
      let that = this;
      let accountList = JSON.parse(localStorage.getItem("acc"));
      let netList = JSON.parse(localStorage.getItem("netList"));
      let type = netList[value].type;
      console.log(value);

      let mapresult = accountList.some(function (item) {
        return item.type == type;
      });
      if (!mapresult) {
        //不存在同网络类型账户,前去登录
        this.$router.push({ path: "/login", query: { state: 1 } });
      } else {
        that.accountAllList = []; //符合当前网络类型的 账户列表
        accountList.map((item) => {
          if (item.type == type) {
            that.accountAllList.push(item);
          }
        });
        localStorage.setItem(
          "accountAllList",
          JSON.stringify(that.accountAllList)
        );
        this.$emit(
          "transfer",
          JSON.parse(localStorage.getItem("accountAllList"))[0],
          netList[value]
        );
      }
      //存一下正在使用的网络
      localStorage.setItem("currentNet", JSON.stringify(netList[value]));
    },

    handleCommand(command) {
      if (command == "a") {
        this.$router.push({ path: "/login", query: { state: 1 } });
      } else if (command == "b") {
        this.$message.error("待开放");
      } else if (command == "c") {
        this.$router.push("/Set");
      } else if (command == "d") {
        //注销
        let closepwd = localStorage.getItem("closepwd");
        if (closepwd) {
          localStorage.setItem("closeState", true);
          this.$router.push("/pwdLogin");
        } else {
          this.$message("请先设置密码");
          this.$router.push("/SetPassword");
        }
      }

      console.log(command);
    },

    //给父组件传递消息
    changeAccount(item, net) {
      this.$emit("transfer", item, net);
      // window.location.reload();
    },

    //goout
    goout() {
      //退出
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.header {
  height: 84px;
  background-color: #f2f2f2;
}

.header .return {
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgb(245, 245, 245);
}
.help_out {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95% !important;
  margin-top: 25px;
}
.el-icon-arrow-left {
  font-size: 16px;
}
.exit_helpout {
  margin-top: 20px !important;
}
.help_out_more {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 93% !important;
}
.headerFant {
  margin-top: 15px;
  text-align: center;
}
.headerFant img {
  width: 53px;
  height: 58px;
}
.headerlogo {
  width: 42px;
}
.headerSelect {
  margin-top: 25px;
  /* margin-left: 100px; */
  border: 1px solid #cccccc;
  border-radius: 20px;
  background: #ffffff;
  width: 220px;
  display: flex;
  align-items: center;
}
.headerSelect .el-input__inner {
  border-radius: 20px !important;
  border: none;
  width: 150px;
}
.headerImgLogo img {
  width: 42px;
  height: 42px;
  border-radius: 42px;
}
.headerImgLogo {
  text-align: center;
  margin-top: 22px;
}
.el-dropdown-menu {
  width: 200px !important;
  right: 10px !important;
}
.popper__arrow::after {
  margin-left: -6px !important;
}
.dropHeader {
  padding: 0px 22px;
  /* border-bottom: 1px solid #ebebeb; */
  padding-bottom: 10px;
}
.topBoderStyle {
  border-top: 1px solid #ebebeb;
}
.dropHeader h6 {
  font-weight: normal;
  margin-top: 10px;
  word-break: break-all;
  text-decoration: underline;
}
.dropHeaderItem {
  font-weight: normal;
  margin-top: 10px;
  word-break: break-all;
  /* text-decoration: underline; */
  font-size: 12px !important;
  color: #000000 !important;
  line-height: 30px !important;
}
.addreslistindex {
  display: inline-block;
  width: 36px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 20px;
  color: #ffffff;
  background: #7657b1;
  margin-right: 15px;
}
.dropHeaderSpan {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.addreslistspan {
  text-decoration: underline;
}
.showdropBtn {
  text-align: center;
}

.dropReset,
.dropOut {
  width: 140px;
  height: 28px;
  border-radius: 6px !important;
  margin-left: 0 !important;
  margin-top: 10px !important;
  background-color: #cdcbce !important;
  border: none !important;
}
.dropReset {
  background-color: #7657b1 !important;
}
.dropFooter {
  text-align: center;
  font-size: 12px;
  margin-top: 16px;
  color: #999999;
}
.lineState {
  width: 12px;
  margin-right: 10px;
  height: 12px;
  margin-left: 20px;
}
.addNetButton {
  text-align: center;
  font-size: 14px;
  width: 100%;
  margin-top: 8px;
  border-top: 1px solid #ddd;
}
.addNetButton span {
  width: 96px;
  height: 26px;
  line-height: 26px;
  color: #ffffff;
  display: inline-block;
  background-color: #9327fc;
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 14px;
  margin-right: 9px;
  cursor: pointer;
}
</style>