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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NetSelect from '@/components/NetSelect.vue'

export default {
  components: { NetSelect },
  setup() {
    const router = useRouter()
    const form = ref({
      netName: '',
      type: '',
      chain: '',
      node: '',
      chainid: '',
      symbol: '',
      bwUrl: '',
    })
    const chainList = ref([
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
    ])
    const currentchain = ref({
      id: 2,
      name: 'XuperOS',
      value: 'xuper',
      sign: 'xuper',
    })
    const netType = ref('')
    const netIndex = ref(-1)

    onMounted(() => {
      const queryIndex = router.currentRoute.value.query.index
      netIndex.value = queryIndex
      const netList = JSON.parse(localStorage.getItem('netList'))
      form.value = netList[queryIndex]
      netType.value = netList[queryIndex].type
      currentchain.value = form.value
    })

    const toBack = () => {
      router.push('/Netlist')
    }

    const deleteNet = () => {
      const netList = JSON.parse(localStorage.getItem('netList'))
      netList.splice(netIndex.value, 1)
      localStorage.setItem('netList', JSON.stringify(netList))
      router.push('/Netlist')
      window.location.reload()
    }

    const onSubmit = () => {
      console.log('submit!')
    }

    return {
      form,
      chainList,
      currentchain,
      netType,
      netIndex,
      toBack,
      deleteNet,
      onSubmit,
    }
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
