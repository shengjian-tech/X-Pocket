<template>
  <div class="header">
    <el-row>
      <el-col :span="12" v-if="get_out_state" class="help_out_more">
        <el-row style="width: 100%">
          <el-col :span="8">
            <div class="headerFant">
              <img
                class="headerlogo"
                src="../assets/headerlogo.png"
                alt=""
                srcset=""
              />
              <h3>X Pocket</h3>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="headerSelect">
              <el-select @change="getSelect" v-model="value">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.netName"
                  :value="item.netName"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="headerImgLogo">
              <div class="dropdown_el">
                <el-dropdown trigger="click" @command="handleCommand">
                  <img src="../assets/avatar.png" alt="" />
                  <el-dropdown-menu slot="dropdown">
                    <div class="dropHeader">
                      <h3>我的账户</h3>
                      <h6>当前账户地址</h6>
                      <h6>
                        {{ addressInfo }}
                      </h6>
                    </div>

                    <el-dropdown-item icon="el-icon-plus" command="a"
                      >新建地址</el-dropdown-item
                    >
                    <el-dropdown-item icon="el-icon-sort" command="b"
                      >导入钱包</el-dropdown-item
                    >
                    <el-dropdown-item icon="el-icon-download" command="c"
                      >设置</el-dropdown-item
                    >
                    <div class="showdropBtn">
                      <el-button
                        size="mini"
                        round
                        type="primary"
                        class="dropReset"
                        >重置账户</el-button
                      >
                      <el-button size="mini" type="info" class="dropOut"
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

        <!-- <el-button
          class="exit_helpout"
          v-if="!outState"
          type="text"
          @click="getOut()"
          >退出</el-button
        > -->
      </el-col>
      <el-col :span="12" v-else class="help_out">
        <div @click="getSetting" class="return">
          <i class="el-icon-arrow-left"></i>
        </div>
        <!-- <el-button
          type="text"
          @click="(visible = true), (addForm.formValue = [])"
          >新增操作</el-button
        > -->
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
      routeState: false,
      get_out_state: false,
      outState: false,
      options: [
        {
          netName: "开放网络",
          node: "https://xuper.baidu.com/nodeapi",
          chain: "xuper",
        },
      ],
      value: "开放网络",
    };
  },
  mounted() {
    this.addressInfo = plusXing(
      JSON.parse(localStorage.getItem("acc")).address,
      5,
      5
    );
    this.$route.name == "Details"
      ? (this.routeState = false)
      : (this.routeState = true);

    this.$route.name == "Login" || this.$route.name == "Home"
      ? ((this.get_out_state = true), (this.outState = true))
      : (this.get_out_state = false);
    this.$route.name == "Home"
      ? (this.outState = false)
      : (this.outState = true);

    if (JSON.parse(localStorage.getItem("plugAll"))) {
      this.plugname = JSON.parse(localStorage.getItem("plugAll"))[
        JSON.parse(localStorage.getItem("plugAll")).length - 1
      ].plug.plugName;
      this.tabsSetList = JSON.parse(localStorage.getItem("addForm")).addList;
    }

    if (localStorage.getItem("netList")) {
      var arr = JSON.parse(localStorage.getItem("netList")).netList;
      this.options = arr;
      // this.options = this.options.concat(arr);
      this.value = this.options[0].netName;
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          localStorage.setItem("nodeApi", item.node);
          localStorage.setItem("chain", item.chain);
        }
      });
    } else {
      let netList = {
        netList: [
          {
            netName: "开放网络",
            node: "https://xuper.baidu.com/nodeapi",
            chain: "xuper",
          },
        ],
      };
      localStorage.setItem("netList", JSON.stringify(netList));
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          localStorage.setItem("nodeApi", item.node);
          localStorage.setItem("chain", item.chain);
        }
      });
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

    handleCommand(command) {
      if (command == "c") {
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
      }
      console.log(command);
    },
  },
};
</script>

<style>
.header {
  height: 88px;
  background-color: #f2f4f6;
  margin-bottom: 10px;
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
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
}
.headerlogo {
  width: 42px;
}
.headerSelect {
  margin-top: 25px;
  margin-left: 16px;
}
.headerSelect .el-input__inner {
  border-radius: 20px !important;
}
.headerImgLogo img {
  width: 42px;
  height: 42px;
  border-radius: 42px;
}
.headerImgLogo {
  text-align: center;
  margin-left: 14px;
  margin-top: 22px;
}
.el-dropdown-menu {
  width: 200px !important;
  left: 180px !important;
}
.popper__arrow::after {
  margin-left: -18px !important;
}
.dropHeader {
  padding: 0px 22px;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 10px;
}
.dropHeader h6 {
  font-weight: normal;
  margin-top: 10px;
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
}
.dropFooter {
  text-align: center;
  font-size: 12px;
  margin-top: 16px;
  color: #999999;
}
</style>