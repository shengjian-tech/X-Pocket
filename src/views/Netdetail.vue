<template>
  <div>
    <div class="container">
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="toBack" />
        <span class="nav-title">{{ $t('checkNet.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('addNet.name') }}</span>
            </div>
            <textarea
              disabled
              v-model="form.netName"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <p class="s-title">{{ $t('addNet.type') }}</p>
        <net-select
          disabled
          :chainList="chainList"
          :currentchain="currentchain"
          @selectedChain="selectedChain"
        ></net-select>
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('addNet.RPC') }}</span>
            </div>
            <textarea
              disabled
              v-model="form.node"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <!-- XuperOS -->
        <template v-if="netType == 'xuper'">
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.chainName') }}</span>
              </div>
              <textarea
                disabled
                v-model="form.chain"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
        </template>

        <!-- Polygon-Testnet、Ethereum -->
        <template v-if="netType == 'eth'">
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.chainId') }}</span>
              </div>
              <textarea
                disabled
                v-model="form.chainid"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.currency') }}</span>
              </div>
              <textarea
                disabled
                v-model="form.symbol"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.browserUrl') }}</span>
              </div>
              <textarea
                disabled
                v-model="form.bwUrl"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
        </template>
        <div class="btn-wrapper" v-if="currentchain.isNewAdd">
          <div class="btn" @click="deleteNet">{{ $t('checkNet.delBtn') }}</div>
        </div>
      </div>
    </div>

    <div class="set" style="display: none">
      <Header />
      <div class="headermap">
        <i class="el-icon-arrow-left"></i>设置/查看网络
      </div>
      <div class="form netDetailForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <span class="inputlabel">网络名称</span>
            <el-input
              v-model="form.netName"
              placeholder="请输入网络名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="inputlabel">网络类型</span>
            <el-select v-model="form.type" placeholder="请选择网络类型">
              <el-option label="XuperOS" value="xuper"></el-option>
              <el-option label="Ethereum" value="eth"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <span class="inputlabel">新的RPC URL</span>
            <el-input
              v-model="form.node"
              placeholder="请输入网络URL"
            ></el-input>
          </el-form-item>
          <div v-if="netType == 'xuper'">
            <el-form-item>
              <span class="inputlabel">链名</span>
              <el-input
                v-model="form.chain"
                placeholder="请输入网络名称"
              ></el-input>
            </el-form-item>
          </div>

          <div v-if="netType == 'eth'">
            <el-form-item>
              <span class="inputlabel">链ID</span>
              <el-input
                v-model="form.chainid"
                placeholder="请输入链ID"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <span class="inputlabel">货币符号</span>
              <el-input
                v-model="form.symbol"
                placeholder="请输入货币符号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <span class="inputlabel">区块链浏览器URL（可选）</span>
              <el-input
                v-model="form.bwUrl"
                placeholder="请输入区块链浏览器URL"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import NetSelect from '@/components/NetSelect.vue'
export default {
  name: 'Netlist',
  data() {
    return {
      form: {
        netName: '',
        type: '',
        chain: '',
        node: '',
        chainid: '',
        symbol: '',
      },
      chainList: [
        {
          id: 1,
          name: 'Ethereum',
          value: 'eth',
          sign: 'eth',
        },
        {
          id: 2,
          name: 'XuperOS',
          value: 'xuper',
          sign: 'xuper',
        },
      ],
      currentchain: {
        id: 2,
        name: 'XuperOS',
        value: 'xuper',
        sign: 'xuper',
      },
      netList: JSON.parse(localStorage.getItem('netList')),
      netType: '',
      netIndex: -1,
    }
  },
  components: { Header, NetSelect },
  mounted() {
    console.log(this.$route.query.index)
    this.netIndex = this.$route.query.index
    this.form = this.netList[this.$route.query.index]
    this.netType = this.netList[this.$route.query.index].type
    console.log(this.form, '*****form****')
    this.currentchain = this.form
  },
  methods: {
    toBack() {
      this.$router.push('/Netlist')
    },
    deleteNet() {
      let netList = JSON.parse(localStorage.getItem('netList'))
      netList.splice(this.netIndex, 1)
      localStorage.setItem('netList', JSON.stringify(netList))
      this.$router.push('/Netlist')
      window.location.reload()
    },
    onSubmit() {
      console.log('submit!')
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 23px 25px;
  text-align: left;
  .pwd-set {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-top: 10px;
    overflow: hidden;
    padding: 0 15px;
    .set-box {
      padding-bottom: 15px;
    }
    .pwd-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      span {
        font-size: 12px;
        font-family: Arial-Regular, Arial;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
      }
    }
    textarea {
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      outline: none;
      margin-top: 10px;
    }
  }
  .s-title {
    text-align: left;
    font-size: 12px;
    font-family: Arial-Regular, Arial;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 24px;
    margin-bottom: 10px;
  }
  .btn-wrapper {
    margin-bottom: 38px;
    margin-top: 30px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 13px;
    .btn {
      width: 225px;
      height: 45px;
      line-height: 45px;
      font-size: 15px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      border-radius: 30px;
    }
  }
}
</style>
