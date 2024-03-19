<template>
  <div class="details" v-loading.fullscreen.lock="fullscreenLoading">
    <Header />
    <div class="write">
      <el-select @change="getSelect" style="width: 100%" v-model="value">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <br /><br />
      <el-form
        style="text-align: left"
        label-position="top"
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="(item, index) in formData"
          :label="item.label"
          :key="index"
        >
          <el-input
            v-model="ruleForm[item.value]"
            :placeholder="'请输入' + item.label"
          ></el-input>
        </el-form-item>
        <!-- 表单提交方法判断 -->
        <el-form-item>
          <div style="text-align: center">
            <el-button
              v-if="value == '转移资产'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="TransferNFTEvm('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '查询NFT余额'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="findAssets('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '查询交易'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="findOrder('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '地址解析'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="ethUrlextend('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '域名注册查询'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="ethRegistrarContriller('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '地址转账'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="ethChangeContral('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '查询余额'"
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="ethGetBlance('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else
              style="width: 80%; background-color: #5295fe; border: none"
              type="primary"
              round
              @click="publicMethod('ruleForm')"
              >执行</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        title="交易ID"
        :visible.sync="dialogVisible"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <div
              class="grid-content bg-purple"
              style="text-align: left; word-wrap: break-word"
            >
              {{ txId }}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-button
                type="primary"
                size="small"
                class="tag-read"
                :data-clipboard-text="txId"
                @click="copy"
                >复制</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        :visible.sync="ordersVisible"
        width="95%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="order">
          <h3>交易信息</h3>
          <br />
          <el-row :gutter="10">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品ID：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.id }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>交易ID：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.txID }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>from：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.from }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>to：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.to }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>交易时间：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ (txDetail.timestamp / 1000) | formatDate }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>数量：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.amount }}
              </div></el-col
            >
          </el-row>
        </div>
        <br />
        <div class="order">
          <h3>藏品信息</h3>
          <br />
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品名：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ nftDetail.name }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品预览：</b>
              </div></el-col
            >
            <el-col :span="18">
              <div class="grid-content bg-purple" style="text-align: left">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="nftDetail.link"
                  :preview-src-list="srcList"
                ></el-image>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品哈希：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ nftDetail.hash }}
              </div></el-col
            >
          </el-row>
        </div>
      </el-dialog>
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
  </div>
</template>

<script>
// import { xsdk } from "../utils/index";
import XuperSDK, { Endorsement } from '@xuperchain/xuper-sdk'
import { XchainAddrToEvm, EvmToXchainAddr } from '../assets/js/index'
import { ethers } from 'ethers'
import Clipboard from 'clipboard'
import Header from '../components/Header'

export default {
  name: 'Details',
  data() {
    return {
      fullscreenLoading: false,
      txId: '',
      txDetail: '',
      nftDetail: '',
      srcList: [],
      dialogVisible: false,
      visible: false,
      ordersVisible: false,
      contractName: '',
      methodName: '',
      type: '',
      formData: [],
      addForm: {
        name: '',
        contractName: '',
        methodName: '',
        formValue: [],
      },
      ruleForm: {},
      value: this.$route.query.index,
      rules1: {
        name: [
          { required: true, message: '操作名称不能为空', trigger: 'blur' },
        ],
        contractName: [
          { required: true, message: '合约名不能为空', trigger: 'blur' },
        ],
        methodName: [
          { required: true, message: '方法名不能为空', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '选择您的操作类型', trigger: 'change' },
        ],
      },
      options: [
        // {
        //   value: "转移资产",
        //   label: "转移资产",
        // },
        // {
        //   value: "查询NFT余额",
        //   label: "查询NFT余额",
        // },
        // {
        //   value: "查询交易",
        //   label: "查询交易",
        // },
      ],
      params: [
        // {
        //   name: "转移资产",
        //   contractName: "opennft",
        //   type: "transaction",
        //   methodName: "safeTransferFrom",
        //   formValue: [
        //     { value: "address", label: "接受者账户" },
        //     { value: "token_id", label: "资产ID" },
        //     { value: "num", label: "数量" },
        //   ],
        // },
        // {
        //   name: "查询NFT余额",
        //   contractName: "opennft",
        //   type: "query",
        //   methodName: "balanceOf",
        //   formValue: [{ value: "token_id", label: "资产ID" }],
        // },
        // {
        //   name: "查询交易",
        //   contractName: "opennft",
        //   type: "query",
        //   methodName: "getTokenBytes",
        //   formValue: [{ value: "txId", label: "交易ID" }],
        // },
      ],
      detailData: this.$route.query.detail,
    }
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
  },
  components: { Header },
  created() {
    if (localStorage.getItem('addForm')) {
      var arr = JSON.parse(localStorage.getItem('addForm')).addList
      this.params = this.params.concat(arr)
      arr.forEach((element) => {
        this.options.push({ label: element.name, value: element.name })
      })
      this.params.forEach((item) => {
        if (this.value == item.name) {
          this.formData = item.formValue
          this.contractName = item.contractName
          this.methodName = item.methodName
          this.type = item.type
        }
      })
    } else {
      this.params.forEach((item) => {
        if (this.value == item.name) {
          this.formData = item.formValue
          this.contractName = item.contractName
          this.methodName = item.methodName
          this.type = item.type
        }
      })
    }
    if (this.detailData) {
      this.ruleForm = JSON.parse(this.detailData)
    }
  },
  methods: {
    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: '', label: '' })
    },
    //删除新增参数
    removeDomain(item) {
      var index = this.addForm.formValue.indexOf(item)
      if (index !== -1) {
        this.addForm.formValue.splice(index, 1)
      }
    },
    //判断数据
    getSelect(value) {
      this.params.forEach((item) => {
        if (value == item.name) {
          this.formData = item.formValue
          this.contractName = item.contractName
          this.methodName = item.methodName
        }
      })
    },
    getSetting() {
      this.$router.push('/Home')
    },
    //新增操作
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var localArr = {
            addList: [],
          }
          if (localStorage.getItem('addForm')) {
            localArr.addList = JSON.parse(
              localStorage.getItem('addForm')
            ).addList
            localArr.addList.push(this.addForm)
            localStorage.setItem('addForm', JSON.stringify(localArr))
          } else {
            localArr.addList.push(this.addForm)
            localStorage.setItem('addForm', JSON.stringify(localArr))
          }
          this.visible = false
          window.location.reload()
        } else {
          return false
        }
      })
    },
    // 转移NFT
    TransferNFTEvm(formName) {
      this.fullscreenLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = localStorage.getItem('nodeApi')
          const chain = localStorage.getItem('chain')
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
          const moveAssets = async (toAddr, TokenID, Amount) => {
            try {
              const contractName = this.contractName
              const methodName = this.methodName
              const from = XchainAddrToEvm(
                JSON.parse(localStorage.getItem('acc')).address
              )
              const acc = JSON.parse(localStorage.getItem('acc'))
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                'evm',
                {
                  from: from,
                  to: toAddr,
                  id: TokenID,
                  amount: Amount,
                  data: '',
                },
                '0',
                acc
              )
              // 352cd3f829dded7ad1da7ab3a0c3a8776cd3ec545c617ad499abb2d29459c6ee  // 交易ID 返回给用户
              // if (xsdk.transactionIdToHex(demo.transaction.txid)) {
              //   this.txId = xsdk.transactionIdToHex(demo.transaction.txid);
              //   this.dialogVisible = true;
              //   this.$axios({
              //     method: "get",
              //     url: `https://makerone.shengjian.net/nft/api/nft/userassets/synchronizedTransaction?txId=${xsdk.transactionIdToHex(
              //       demo.transaction.txid
              //     )}`,
              //   }).then((response) => {
              //     console.log(response); //请求成功返回的数据
              //   });
              // }
              const result = xsdk.postTransaction(demo.transaction, acc)
              console.log(result)
            } catch (err) {
              // err 是空 证明转移成功，不是 就是执行失败。
              if (err) {
                this.$message.error('转移失败')
              } else {
                this.$message.success('转移成功')
                this.fullscreenLoading = false
              }
            }
          }
          moveAssets(
            XchainAddrToEvm(this.ruleForm.address),
            this.ruleForm.token_id,
            this.ruleForm.num
          )
        } else {
          return false
        }
      })
    },
    //查询NFT余额
    findAssets(formName) {
      this.fullscreenLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = localStorage.getItem('nodeApi')
          const chain = localStorage.getItem('chain')
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
          const acc = JSON.parse(localStorage.getItem('acc'))
          const queryNFTBalance = async (tokenID) => {
            try {
              const contractName = this.contractName
              const methodName = this.methodName
              const args = {
                account: XchainAddrToEvm(acc.address),
                id: tokenID,
              }
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                'evm',
                args,
                '0',
                acc
              )
              // 判断  demo.preExecutionTransaction.response.responses的长度是否大于0， 大于0 取demo.preExecutionTransaction.response.responses[length - 1]
              const len = demo.preExecutionTransaction.response.responses.length
              if (len > 0) {
                const str =
                  demo.preExecutionTransaction.response.responses[len - 1].body
                const result = Buffer.from(str, 'base64').toString('ascii')
                const tokenExpireTime = await this.inquireExpireTime(
                  contractName,
                  this.ruleForm.token_id
                )
                this.fullscreenLoading = false
                // [{\"0\":\"10\"}]  result 即为 [{\"0\":\"10\"}]  10即为想要的结果，即对应nft 的余额
                this.$notify({
                  title: '查询成功',
                  dangerouslyUseHTMLString: true,
                  message: `当前您的资产数量为<b style='padding-left:5px'>${
                    JSON.parse(result)[0]['0']
                  }</b>
                  <br/>`,
                  type: 'success',
                  duration: 0,
                })
                // 冷却期剩余<b style='padding-left:5px'>${tokenExpireTime}</b>
              }
            } catch (err) {
              console.log(err)
            }
          }
          queryNFTBalance(this.ruleForm.token_id)
        } else {
          return false
        }
      })
    },
    //查询交易
    findOrder(formName) {
      this.fullscreenLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = localStorage.getItem('nodeApi')
          const chain = localStorage.getItem('chain')
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
          const acc = JSON.parse(localStorage.getItem('acc'))
          const GetTxDetail = async (txId) => {
            try {
              const demo = await xsdk.queryTransaction(
                Buffer.from(txId, 'hex').toString('base64')
              )
              if (demo.tx == undefined) {
                // 证明此交易链上没有 直接报错
                throw new Error('this tx undefined')
              }
              // 交易ID
              var txID = Buffer.from(demo.tx.txid, 'base64').toString('hex')
              var txReqJson = JSON.parse(
                Buffer.from(
                  demo.tx.contract_requests[1].args.input,
                  'base64'
                ).toString()
              )

              var from = ''
              var to = ''
              var tokenID = ''
              var amount = ''
              if (
                demo.tx.contract_requests[1].method_name == 'safeTransferFrom'
              ) {
                from = EvmToXchainAddr(txReqJson.from)
                to = EvmToXchainAddr(txReqJson.to)
                tokenID = txReqJson.id
                amount = txReqJson.amount
              } else {
                from = demo.tx.initiator
                tokenID = txReqJson._id
                amount = txReqJson._initialSupply
              }

              // 根据 tokenID 查询token id的图片路径 供浏览器跳转
              const contractName = this.contractName
              const methodName = this.methodName
              const args = {
                //上线替换为上方tokenID
                _id: tokenID,
              }
              const res = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                'evm',
                args,
                '0',
                acc
              )
              const len = res.preExecutionTransaction.response.responses.length
              if (len > 0) {
                var result =
                  res.preExecutionTransaction.response.responses[len - 1].body
                var response = JSON.parse(
                  Buffer.from(result, 'base64').toString()
                )
                var base64Addr = response[0]._response
                var data = Buffer.from(base64Addr, 'base64').toString()
                var dataJson = JSON.parse(data)
              }
              var timestamp = parseInt(demo.tx.timestamp / 1000)
              this.fullscreenLoading = false
              // 用户查看交易详情，前端显示下述txDetail信息。
              var txDetail = {
                txID: txID,
                from: from,
                to: to,
                id: tokenID,
                amount: amount,
                timestamp: timestamp,
              }
              var nftDetail = {
                link: dataJson.link,
                name: dataJson.name,
                hash: dataJson.hash,
              }
              // 前端展示数据
              if (txDetail && nftDetail) {
                this.txDetail = txDetail
                this.srcList = []
                this.nftDetail = nftDetail
                this.srcList.push(nftDetail.link)
                this.ordersVisible = true
              }
              return txDetail, nftDetail
            } catch (err) {
              console.log(err)
            }
          }
          GetTxDetail(this.ruleForm.txId)
        } else {
          return false
        }
      })
    },
    copy() {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', (e) => {
        this.$message.success('复制成功！')
        console.log(e)
        //  释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message.success('当前浏览器不支持复制！')
        console.log(e)
        // 不支持复制
        // 释放内存
        clipboard.destroy()
      })
    },
    //通用方法
    publicMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const commonFunc = async (type, contractName, methodName, args) => {
            try {
              const acc = JSON.parse(localStorage.getItem('acc'))
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                'evm',
                args,
                '0',
                acc
              )
              if (type == 'query') {
                this.$notify({
                  title: '查询成功',
                  dangerouslyUseHTMLString: true,
                  message: `<p style='word-wrap:break-word;word-break:break-all'>${JSON.stringify(
                    demo.preExecutionTransaction.response.responses
                  )}</p>`,
                  type: 'success',
                })
              } else {
                this.$notify({
                  title: '查询成功',
                  dangerouslyUseHTMLString: true,
                  message: `<p style='word-wrap:break-word'>${JSON.stringify(
                    xsdk.postTransaction(demo.transaction, acc)
                  )}</p>`,
                  type: 'success',
                  duration: 0,
                })
              }
            } catch (err) {
              if (err) {
                this.$message.error('执行失败')
              } else {
                this.$message.success('执行成功')
              }
            }
          }
          if (JSON.stringify(this.ruleForm) == '{}') {
            this.ruleForm = { '': '1' }
          }
          commonFunc(
            this.type,
            this.contractName,
            this.methodName,
            this.ruleForm
          )
        } else {
          return false
        }
      })
    },
    //查询藏品冷却期
    /*
     @param{
        contractName,
        tokenID
      }
     */
    async inquireExpireTime(contractName, tokenID) {
      try {
        const node = localStorage.getItem('nodeApi')
        const chain = localStorage.getItem('chain')
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
        const acc = JSON.parse(localStorage.getItem('acc'))
        const args = { _id: tokenID }
        const res = await xsdk.invokeSolidityContarct(
          contractName,
          'getExpireTime',
          'evm',
          args,
          '0',
          acc
        )
        const len = res.preExecutionTransaction.response.responses.length
        if (len > 0) {
          var result =
            res.preExecutionTransaction.response.responses[len - 1].body
          var response = JSON.parse(Buffer.from(result, 'base64').toString())
          var tokenExpireTiem = response[0]['0']
          // console.log(response);
          // let tokenOwnerExpireTiem =
          //   response[0]["0"] -
          //   (Date.parse(new Date()) / 1000 - response[0]["0"]);
          // console.log(tokenOwnerExpireTiem);
          // return Math.ceil(tokenOwnerExpireTiem / 3600 / 24);
        }
        const res1 = await xsdk.invokeSolidityContarct(
          contractName,
          'getTokenExpireTime',
          'evm',
          args,
          '0',
          acc
        )
        const len1 = res1.preExecutionTransaction.response.responses.length
        if (len1 > 0) {
          var result1 =
            res1.preExecutionTransaction.response.responses[len1 - 1].body
          var response1 = JSON.parse(Buffer.from(result1, 'base64').toString())
          // 该ID资产的交易保护时间
          var tokenOwnerExpireTiem = response1[0]['0']
        }
        var time =
          tokenExpireTiem -
          (Date.parse(new Date()) / 1000 - tokenOwnerExpireTiem)
        var finelTime =
          Math.ceil(time / 3600 / 24) <= 0
            ? '可转移'
            : `${Math.ceil(time / 3600 / 24)}天`
        return finelTime
      } catch (err) {
        console.log(err)
      }
    },

    //eth 地址解析
    ethUrlextend(formName) {
      this.fullscreenLoading = true
      const { ens_abi } = require('../utils/ENSRegistry.json')
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let Url = this.ruleForm
          const ensRegistryAddr = Url.ensRegistryAddr // "0x7aaBFF488e35810E8D931C96561F341d91eE0641";
          const provider = new ethers.providers.JsonRpcProvider(
            localStorage.getItem('nodeApi')
          )
          let privateKey = Url.privateKey //  "7978bfe0ffb86eaf14ac1d0d13f5850b3c2a587406b561197cd1df9501a0ac70"; //私钥
          let wallet = new ethers.Wallet(privateKey, provider)
          const ensRegistry = new ethers.Contract(
            ensRegistryAddr,
            ens_abi,
            wallet
          )
          const nodeHash = ethers.utils.namehash(Url.url)
          const resolverAddr = await ensRegistry.resolver(nodeHash)
          console.log('test2.one 的域名解析地址', resolverAddr)
          this.fullscreenLoading = false
          this.$notify({
            title: '查询成功',
            dangerouslyUseHTMLString: true,
            message: resolverAddr,
            type: 'success',
            duration: 0,
          })
        } else {
          return false
        }
      })
    },
    //eth 域名注册查询
    ethRegistrarContriller(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let Url = this.ruleForm
          const {
            ens_controller_abi,
          } = require('../utils/ETHRegistrarController.json')
          const provider = new ethers.providers.JsonRpcProvider(
            localStorage.getItem('nodeApi')
          )
          // let privateKey =
          //   "7978bfe0ffb86eaf14ac1d0d13f5850b3c2a587406b561197cd1df9501a0ac70"; //私钥
          // let wallet = new ethers.Wallet(privateKey, provider);
          const ENSControllerAddr = Url.ENSControllerAddr // "0xF8391eC06Ce377F1affc318b9E6d351eF26248A2"
          const ensController = new ethers.Contract(
            ENSControllerAddr,
            ens_controller_abi,
            // wallet,//只是查询无需私钥，可以直接用 provider
            provider
          )
          console.log(
            await ensController.functions['available(string)'](Url.addrurl)
          )
          if (
            await ensController.functions['available(string)'](Url.addrurl)[0]
          ) {
            this.$notify({
              title: '查询成功',
              dangerouslyUseHTMLString: true,
              message: '不存在该域名',
              type: 'success',
              duration: 0,
            })
          } else {
            this.$notify({
              title: '查询成功',
              dangerouslyUseHTMLString: true,
              message: '域名已经存在',
              type: 'success',
              duration: 0,
            })
          }
        }
      })
    },

    //eth 转账
    ethChangeContral(formName) {
      this.fullscreenLoading = true
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ruleForm = this.ruleForm
          const provider = new ethers.providers.JsonRpcProvider(
            localStorage.getItem('nodeApi')
          )
          let privateKey = ruleForm.privateKey //"7978bfe0ffb86eaf14ac1d0d13f5850b3c2a587406b561197cd1df9501a0ac70"; //私钥
          let wallet = new ethers.Wallet(privateKey, provider)
          let gasPrice = await provider.getGasPrice()
          console.log(gasPrice)
          let tx = await wallet.sendTransaction({
            gasLimit: 21000,
            gasPrice: gasPrice,
            to: ruleForm.toaddress,
            value: ethers.utils.parseUnits(ruleForm.value),
          })
          this.fullscreenLoading = false
          console.log('Sent in Transaction: ' + tx.hash)
        }
      })
    },

    //eth 查询余额

    ethGetBlance(formName) {
      this.fullscreenLoading = true
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ruleForm = this.ruleForm
          const provider = new ethers.providers.JsonRpcProvider(
            localStorage.getItem('nodeApi')
          )
          let heightBlock = await provider.getBlockNumber()
          console.log(heightBlock)
          let address = ruleForm.address
          provider.getBalance(address).then((balance) => {
            // 余额是 BigNumber (in wei); 格式化为 ether 字符串
            let etherString = ethers.utils.formatEther(balance)
            console.log('Balance: ' + etherString)
            this.fullscreenLoading = false
            this.$notify({
              title: '查询成功',
              dangerouslyUseHTMLString: true,
              message: `余额为${etherString}`,
              type: 'success',
              duration: 0,
            })
          })
        }
      })
    },
  },
}
</script>
<style scoped>
.details {
  width: 460px;
  min-height: 500px;
  margin: auto;
}
.details .write {
  width: 90%;
  margin: auto;
  margin-top: 30px;
}
</style>
<style>
.details .write .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-dialog__header {
  padding: 0;
}
.el-dialog {
  margin: 0 auto 0;
  margin-top: 10vh !important;
}
</style>
