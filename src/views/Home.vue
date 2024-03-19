<template>
  <div>
    <div class="container">
      <img src="../assets/img-bg.png" class="bg-img2" />
      <div class="content">
        <home-header @transfer="getAccound"></home-header>
        <div class="title">{{ $t('home.title') }}</div>
        <div class="key-txt">
          {{ addressInfo }}
          <img
            src="../assets/img-copy.png"
            class="copycont"
            :data-clipboard-text="address"
            @click="copy"
          />
        </div>
        <div class="balance-box">
          <span>{{ $t('home.balance') }}：&nbsp;</span>
          <div>{{ balanceMoney }}</div>
        </div>
        <div class="tab-box">
          <div class="tab-list" @click="goSearchFun()">
            <div class="list-circle">
              <img src="../assets/img-cx.png" />
            </div>
            <div class="tab-name">{{ $t('home.menu1') }}</div>
          </div>
          <div class="tab-list" @click="goTransFun()">
            <div class="list-circle">
              <img src="../assets/img-zy.png" />
            </div>
            <div class="tab-name">{{ $t('home.menu2') }}</div>
          </div>
        </div>
        <div class="switch-tab">
          <div
            class="tab-comm"
            :class="currentTab == 0 ? 'btn' : ''"
            @click="tabChose(0)"
          >
            NFTS
          </div>
          <div
            class="tab-comm"
            :class="currentTab == 1 ? 'btn' : ''"
            @click="tabChose(1)"
          >
            Tokens
          </div>
        </div>
        <div class="tab-box2" v-if="currentTab == 0">
          <div
            class="tab-li"
            :class="currentTab2 == 0 ? 'active' : ''"
            @click="tabChose2(0)"
          >
            <img src="../assets/img-nfts-in.png" v-if="currentTab2 == 0" />
            <img src="../assets/img-nfts.png" v-else />
            NFTS
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 1 ? 'active' : ''"
            @click="tabChose2(1)"
          >
            <img src="../assets/img-bqcz-in.png" v-if="currentTab2 == 1" />
            <img src="../assets/img-bqcz.png" v-else />
            {{ $t('home.tab1') }}
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 2 ? 'active' : ''"
            @click="tabChose2(2)"
          >
            <img src="../assets/img-yxdj-in.png" v-if="currentTab2 == 2" />
            <img src="../assets/img-yxdj.png" v-else />
            {{ $t('home.tab2') }}
          </div>
          <div
            class="tab-li"
            :class="currentTab2 == 3 ? 'active' : ''"
            @click="tabChose2(3)"
          >
            <img src="../assets/img-qklym-in.png" v-if="currentTab2 == 3" />
            <img src="../assets/img-qklym.png" v-else />
            {{ $t('home.tab3') }}
          </div>
        </div>
        <div class="nfts-cont" v-if="currentTab == 0">
          <template v-if="currentTab2 == 0">
            <ul v-if="nfts.length > 0">
              <li
                v-for="(items, index) in nfts"
                :key="index"
                @click="goNftDetail(items)"
              >
                <div class="chain-circle">
                  <img :src="items.image_uri" />
                </div>
                <div class="flex1">
                  <p class="text-line1">{{ items.name }}</p>
                </div>
              </li>
            </ul>
            <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
          </template>
          <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
        </div>
        <div class="tokens-cont" v-else>
          <template v-if="tokens.length > 0">
            <div class="tokens-title">
              <span>Tokens</span>
              <span>{{ $t('home.balance') }}</span>
            </div>
            <div
              class="select"
              style="margin-top: 0"
              v-for="(items, index) in tokens"
              :key="index"
            >
              <div class="comm-logo">
                <img src="../assets/headerlogo.png" />
              </div>
              <div class="flex1">{{ items.name }}-{{ items.netName }}</div>
              <span>{{ items.balance }}</span>
            </div>
          </template>
          <p class="no-data" v-else>{{ $t('comm.noData') }}</p>
        </div>
      </div>

      <prompt-popup ref="prompt"></prompt-popup>

      <!-- 插件弹窗 -->
      <div class="plug-box" v-if="drawer">
        <div class="plug-count">
          <img src="../assets/img-bg.png" class="bg-img" />
          <img
            src="../assets/img-close.png"
            class="img-close"
            @click="drawer = false"
          />
          <ul>
            <li v-for="(item, index) in pluginsList" :key="index">
              <div class="img-circle">
                <img :src="item[3].logo" />
              </div>
              <div class="flex1">{{ item[1].name }}</div>
              <div
                class="btn disabled"
                v-if="item[4].state && item[4].state == 1"
              >
                Installed
              </div>
              <div class="btn" @click="installFile(index)" v-else>Install</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="version-num">
        {{ $t('set.version') }} X-Pocket v{{ version }}
      </div>
    </div>

    <div class="home" style="display: none">
      <div class="help">
        <home-header @transfer="getAccound"></home-header>
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
          <template v-if="plugState">
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
          </template>
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
                <span slot="label"
                  ><img
                    class="labelListImg"
                    src="../assets/nfts.png"
                    alt=""
                    srcset=""
                    v-if="tabslistTabName == '1'"
                  />
                  <img
                    class="labelListImg"
                    src="../assets/nftFont.png"
                    alt=""
                    srcset=""
                    v-else
                  />NFTS
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
                <span slot="label">
                  <img
                    class="labelListImg"
                    src="../assets/copyfont-1.png"
                    alt=""
                    srcset=""
                    v-if="tabslistTabName == '2'"
                  />
                  <img
                    class="labelListImg"
                    src="../assets/copyfont.png"
                    alt=""
                    srcset=""
                    v-else
                  />
                  版权存证</span
                >
                <div>暂无更多数据</div>
              </el-tab-pane>
              <el-tab-pane name="3">
                <span slot="label">
                  <img
                    class="labelListImg"
                    src="../assets/gameFont-1.png"
                    alt=""
                    srcset=""
                    v-if="tabslistTabName == '3'"
                  />
                  <img
                    class="labelListImg"
                    src="../assets/gameFont.png"
                    alt=""
                    srcset=""
                    v-else
                  />
                  游戏道具</span
                >
                <div>暂无更多数据</div>
              </el-tab-pane>
              <el-tab-pane name="4">
                <span slot="label">
                  <img
                    class="labelListImg"
                    src="../assets/priFont-1.png"
                    alt=""
                    srcset=""
                    v-if="tabslistTabName == '4'"
                  />
                  <img
                    class="labelListImg"
                    src="../assets/priFont.png"
                    alt=""
                    srcset=""
                    v-else
                  />
                  区块链域名</span
                >
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

      <!-- <el-drawer title="插件市场" :visible.sync="drawer" size="80%">
        <div class="drawerBtn">
          <div class="plugList">
            <div
              class="listdetail"
              v-for="(item, index) in pluginsList"
              :key="index"
            >
              <img :src="item[3].logo" alt="" />
              <span>{{ item[1].name }}</span>
              <el-button
                v-if="item[4].state && item[4].state == 1"
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
      </el-drawer> -->

      <el-drawer title="已安装插件" :visible.sync="isdrawer" size="80%">
        <div class="drawerBtn">
          <div class="plugList">
            <div
              class="listdetail"
              v-for="(item, index) in isplugList"
              :key="index"
            >
              <img :src="item.plugLogo" alt="" />
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
          <el-button size="small" @click="dialogVisible = false"
            >取 消</el-button
          >
          <el-button size="small" type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { plusXing } from '../assets/js/index'
import { getPrivateKey } from '@/utils/decryptKey'
import Clipboard from 'clipboard'
import { ethers } from 'ethers'
import axios from 'axios'
import HomeHeader from '@/components/HomeHeader.vue'
import PromptPopup from '@/components/PromptPopup.vue'
const Base64 = require('js-base64').Base64
export default {
  name: 'Home',
  data() {
    return {
      currentTab: 0,
      currentTab2: 0,
      addressInfo: '',
      address: JSON.parse(localStorage.getItem('currentAccont')).address,
      balanceMoney: 0,
      dialogVisible: false,
      ruleForm: {
        netName: '',
        node: '',
        chain: '',
      },
      node: '',
      chain: '',
      value: 'XuperOS',
      rules: {
        netName: [
          { required: true, message: '网络名称不能为空', trigger: 'blur' },
        ],
        node: [
          { required: true, message: '网络节点不能为空', trigger: 'blur' },
        ],
        chain: [{ required: true, message: '链名不能为空', trigger: 'blur' }],
      },
      options: [
        {
          netName: 'XuperOS',
          node: 'https://xuper.baidu.com/nodeapi',
          chain: 'xuper',
        },
      ],
      activeName: '1',
      drawer: false,
      isdrawer: false,
      componentsList: [],
      isplugList: [],
      addFromState: '',
      tabsSetList: '',
      plugname: '',
      plugList: [], //已经安装的插件集合
      idArray: [], //已经安装的插件id
      pluginsList: [], //
      pluginsTabList: [],
      nfts: [], //当年账户的nfts
      tokens: [], //tokens列表
      plugState: true, //插件显示状态。
      tabslistTabName: 1,
      version: process.env.VUE_APP_POCKET_VERSION,
    }
  },
  components: { HomeHeader, PromptPopup },
  created() {
    this.addressInfo = plusXing(
      JSON.parse(localStorage.getItem('currentAccont')).address,
      5,
      5
    )
    // let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
    // let installed = JSON.parse(localStorage.getItem('installed'))
    // if (currentPlug) {
    //   this.plugname = currentPlug.plugName
    //   this.tabsSetList = currentPlug
    //   console.log(this.tabsSetList)
    //   this.pluginsTabList = currentPlug.tabCont
    // } else {
    //   if (installed) {
    //     let currentPlug = installed[installed.length - 1]
    //     this.plugname = currentPlug.plugName
    //     this.tabsSetList = currentPlug
    //     localStorage.setItem('currentPlug', JSON.stringify(currentPlug))
    //   }
    // }
    //登录成功后 显示余额
    let currentNet = JSON.parse(localStorage.getItem('currentNet'))

    if (currentNet && currentNet.type == 'xuper') {
      //调用xuper网络
      this.balance()
    } else if (currentNet && currentNet.type == 'eth') {
      this.ethBalance()
    }
    //tokens
    this.getTokensList()
  },
  mounted() {
    this.gettablist()
  },
  methods: {
    tabChose(i) {
      this.currentTab = i
    },
    tabChose2(i) {
      this.currentTab2 = i
      console.log(this.currentTab2, '**this.currentTab2**')
      if (this.currentTab2 == 0) {
        this.gettablist()
      }
    },
    noFun() {
      this.$refs.prompt.showToast(this.$t('toastMsg.msg7'), 'error', 2500)
    },
    goSearchFun() {
      this.$router.push({ path: '/Search' })
    },
    goTransFun() {
      this.$router.push({ path: '/Transfer' })
    },

    getPlugMethodTest() {
      this.$router.push({ path: '/test' })
    },

    //判断数据
    getSelect(value) {
      this.options.forEach((item) => {
        if (value == item.netName) {
          this.node = item.node
          this.chain = item.chain
          localStorage.setItem('nodeApi', item.node)
          localStorage.setItem('chain', item.chain)
        }
      })
    },
    //添加网络
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var netArr = {
            netList: [],
          }
          if (localStorage.getItem('netList')) {
            netArr.netList = JSON.parse(localStorage.getItem('netList')).netList
            netArr.netList.push(this.ruleForm)
            localStorage.setItem('netList', JSON.stringify(netArr))
          } else {
            netArr.netList.push(this.ruleForm)
            localStorage.setItem('netList', JSON.stringify(netArr))
          }
          this.dialogVisible = false
          window.location.reload()
        } else {
          return false
        }
      })
    },
    //查询余额
    getDetails(index) {
      this.$router.push({
        path: '/Pluglist',
        query: { index: JSON.stringify(index) },
      })
    },
    //nft详情
    goNftDetail(item) {
      this.$router.push({
        path: '/NftDetail',
        query: { item: JSON.stringify(item) },
      })
    },
    async balance() {
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      const node = currentNet.node
      const chain = currentNet.chain
      const params = {
        server: node, // ip, port
        fee: '400', // fee
        endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
        endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
      }
      let nodeStatus = null
      if (node === 'https://xuper.baidu.com/nodeapi') {
        nodeStatus = [
          Endorsement({
            transfer: params,
            makeTransaction: params,
          }),
        ]
      } else {
        nodeStatus = null
      }
      const xsdk = new XuperSDK({
        node,
        chain,
        plugins: nodeStatus,
      })
      const getBalance = async (address) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await xsdk.getBalance(address)
          this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3)
          localStorage.setItem('banlance', this.balanceMoney)
          console.log(this.balanceMoney)
        } catch (err) {
          throw err
        }
      }
      getBalance(currentAccont.address)
    },

    //接受 header 子组件传递过来的内容

    getAccound(msg, net) {
      console.log(msg, '*****msg****')
      console.log(net, '*****net****')
      localStorage.setItem('currentAccont', JSON.stringify(msg))
      this.addressInfo = plusXing(
        JSON.parse(localStorage.getItem('currentAccont')).address,
        5,
        5
      )
      // let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      // console.log(currentPlug.type, '****currentPlug***')

      if (net) {
        localStorage.setItem('currentNet', JSON.stringify(net))
        if (net.type == 'xuper') {
          this.balance()
        } else if (net.type == 'eth') {
          this.ethBalance()
        }
      } else {
        let currentNet = JSON.parse(localStorage.getItem('currentNet'))
        if (currentNet.type == 'xuper') {
          this.balance()
        } else if (currentNet.type == 'eth') {
          this.ethBalance()
        }
      }

      // if (currentPlug && net && currentPlug.type == net.type) {
      //   this.plugState = true
      // } else {
      //   this.plugState = false
      // }

      this.getTokensList()
    },

    //切换选项卡
    handleClick(tab, event) {
      console.log(tab.name)
      this.tabslistTabName = tab.name
    },

    //切换插件
    changePlug() {
      this.isplugList = JSON.parse(localStorage.getItem('installed'))
      this.isdrawer = true
    },

    //复制
    copy() {
      console.log(this.address, '****address*****')
      var clipboard = new Clipboard('.copycont')
      console.log(clipboard, 'clipboard')
      clipboard.on('success', (e) => {
        console.log('success')
        this.$refs.prompt.showToast(this.$t('toastMsg.msg2'), 'success', 2500)
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        console.log('error')
        this.$refs.prompt.showToast(this.$t('toastMsg.msg3'), 'warning', 2500)
        clipboard.destroy()
      })
    },

    // selectChangePlug(index) {
    //   let that = this
    //   let installed = JSON.parse(localStorage.getItem('installed'))
    //   let currentPlug = installed[index]
    //   that.plugname = installed[index].plugName
    //   that.tabsSetList = currentPlug
    //   localStorage.setItem('currentPlug', JSON.stringify(currentPlug))
    //   that.isdrawer = false
    // },

    //eth查询余额
    async ethBalance() {
      console.log('---eth查询余额---')
      let currentNet = JSON.parse(localStorage.getItem('currentNet'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      const provider = new ethers.providers.JsonRpcProvider(currentNet.node)
      let heightBlock = await provider.getBlockNumber()
      console.log(heightBlock)
      let address = currentAccont.address
      provider.getBalance(address).then((balance) => {
        // 余额是 BigNumber (in wei); 格式化为 ether 字符串
        let etherString = ethers.utils.formatEther(balance)
        console.log('Balance: ' + etherString)
        this.balanceMoney = etherString
      })
    },
    //
    gettablist() {
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))
      let currentPlug = JSON.parse(localStorage.getItem('currentPlug'))
      if (currentPlug) {
        let item = currentPlug.tabCont[0][0]
        console.log(item)
        axios({
          url: `${item.nftsurl}/${currentAccont.address}?contract_address=${item.contract_address}`,
          method: 'GET',
          headers: {
            'X-API-KEY': item.xapikey,
          },
          data: {},
        }).then((res) => {
          console.log(res, '*****res*******')
          if (res.data.status == 'success' && res.data.statusCode == '200') {
            this.nfts = JSON.parse(res.data.result)
          } else {
            message.error(res.data.message)
          }
        })
      }
    },

    //获取当前网络tokens 列表
    getTokensList() {
      let netList = JSON.parse(localStorage.getItem('netList'))
      let currentAccont = JSON.parse(localStorage.getItem('currentAccont'))

      let tokenslist = []
      netList.map((item) => {
        if (item.type == 'xuper' && currentAccont.type == 'xuper') {
          const node = item.node
          const chain = item.chain
          const params = {
            server: node, // ip, port
            fee: '400', // fee
            endorseServiceCheckAddr: 'jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n', // sign address
            endorseServiceFeeAddr: 'aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT', // fee address
          }
          const xsdk = new XuperSDK({
            node,
            chain,
            plugins: [
              Endorsement({
                transfer: params,
                makeTransaction: params,
              }),
            ],
          })
          const getBalance = async (address) => {
            try {
              const result = await xsdk.getBalance(address)
              // this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3)
              let xuperBalance = (result.bcs[0].balance / 100000).toFixed(3)
              tokenslist.push({
                name: item.chain,
                balance: xuperBalance,
              })
              console.log(tokenslist, '----xuper-tokenList-----')
            } catch (err) {
              throw err
            }
          }
          getBalance(currentAccont.address)
        } else if (item.type == 'eth' && currentAccont.type == 'eth') {
          const provider = new ethers.providers.JsonRpcProvider(item.node)
          let address = currentAccont.address
          provider.getBalance(address).then((balance) => {
            // 余额是 BigNumber (in wei); 格式化为 ether 字符串
            let etherString = ethers.utils.formatEther(balance)
            tokenslist.push({
              name: item.chain,
              balance: etherString,
              netName: item.netName,
            })

            console.log(tokenslist, '----eth-tokenList-----')
          })
        }
      })
      this.tokens = tokenslist
      console.log(this.tokens, '*****this.tokens****')
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 0 24px 40px 24px;
  text-align: left;

  .balance-box {
    display: flex;
    align-items: center;
    margin: 15px 0 0px 0;
    span {
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
    }
    div {
      font-size: 18px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
.title {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin: 17px 0 8px 0;
}
.key-txt {
  font-size: 18px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #ffffff;
  img {
    width: 12px;
    cursor: pointer;
    margin-left: 5px;
  }
}
.tab-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 30px;
  .tab-list {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .list-circle {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 23px;
        height: 23px;
      }
      i {
        color: white;
        font-size: 20px;
      }
    }
    .tab-name {
      color: white;
      font-size: 12px;
      font-family: Open Sans-Regular, Open Sans;
      font-weight: 400;
      margin-top: 8px;
    }
  }
}
.switch-tab {
  display: flex;
  align-items: center;
  background: #39536f;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 38px;
  .tab-comm {
    flex: 1;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border-radius: 20px;
    overflow: hidden;
    font-size: 12px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
}
.tab-box2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 11px 0;
  .tab-li {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
    color: white;
    text-align: center;
    cursor: pointer;
    img {
      width: 16px;
    }
  }
  .tab-li.active {
    color: #00e5c4;
  }
}
.nfts-cont {
  ul {
    li {
      display: flex;
      align-items: center;
      height: 47px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      margin-bottom: 10px;
      overflow: hidden;
      padding: 0 15px 0 8px;
      cursor: pointer;
      .chain-circle {
        width: 32px;
        height: 32px;
        background: #262636;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .flex1 {
        flex: 1;
        padding-left: 8px;
        overflow: hidden;
        p {
          color: white;
          font-size: 14px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
        }
        p:last-child {
          font-size: 12px;
          font-family: Open Sans-Regular, Open Sans;
          font-weight: 400;
        }
      }
      span {
        color: white;
        font-size: 14px;
        font-family: Open Sans-Bold, Open Sans;
        font-weight: bold;
      }
    }
  }
}
.tokens-cont {
  .tokens-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    span {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .select {
    display: flex;
    align-items: center;
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    padding: 0 15px 0 8px;
    border-radius: 8px;
    margin-top: 30px;
    margin-bottom: 5px;
    .comm-logo {
      width: 32px;
      height: 32px;
      background: rgba(38, 38, 54, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 12px;
      img {
        width: 18px;
      }
    }
    .flex1 {
      flex: 1;
      text-align: left;
      padding-left: 10px;
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: white;
      overflow: hidden;
    }
    span {
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      color: white;
    }
  }
}
.no-data {
  font-size: 12px;
  font-family: Arial-Regular, Arial;
  font-weight: 400;
  color: #ffffff;
  margin-top: 28px;
  text-align: center;
}
.plug-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .plug-count {
    max-height: 400px;
    min-height: 300px;
    overflow-y: auto;
    position: relative;
    border-radius: 10px 10px 0 0;
    .bg-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .img-close {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 9;
      cursor: pointer;
    }
    ul {
      margin-top: 50px;
      padding: 0 25px 30px 25px;
      li {
        display: flex;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 8px;
        .img-circle {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #262636;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 18px;
            height: 18px;
          }
        }
        .flex1 {
          flex: 1;
          padding-left: 10px;
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #ffffff;
          text-align: left;
        }
        .btn {
          width: 71px;
          height: 27px;
          background: linear-gradient(90deg, #00e5c4 0%, #027ce3 100%);
          border-radius: 14px;
          text-align: center;
          line-height: 27px;
          font-size: 12px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #ffffff;
        }
        .btn.disabled {
          background: #878787;
        }
      }
    }
  }
}
.version-num {
  position: fixed;
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  color: white;
  left: 0;
  bottom: 0;
  text-align: center;
}
</style>
