<template>
  <div>
    <div class="container">
      <div class="header">
        <img src="../assets/img-back.png" class="img-back" @click="goHome" />
        <span class="nav-title">{{ $t('addNet.title') }}</span>
      </div>
      <div class="content">
        <div class="pwd-set">
          <div class="set-box">
            <div class="pwd-top">
              <span>{{ $t('addNet.name') }}</span>
            </div>
            <textarea
              v-model="form.netName"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <p class="s-title">{{ $t('addNet.type') }}</p>
        <net-select
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
              v-model="form.node"
              :placeholder="$t('comm.placeholder')"
            ></textarea>
          </div>
        </div>
        <!-- XuperOS -->
        <template v-if="form.type == 'xuper'">
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.chainName') }}</span>
              </div>
              <textarea
                v-model="form.chain"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
        </template>

        <!-- Polygon-Testnet、Ethereum -->
        <template v-if="form.type == 'eth'">
          <div class="pwd-set">
            <div class="set-box">
              <div class="pwd-top">
                <span>{{ $t('addNet.chainId') }}</span>
              </div>
              <textarea
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
                v-model="form.bwUrl"
                :placeholder="$t('comm.placeholder')"
              ></textarea>
            </div>
          </div>
        </template>
        <div class="btn-wrapper">
          <div class="btn" @click="addNetList">{{ $t('comm.confirm') }}</div>
        </div>
      </div>
      <prompt-popup ref="prompt"></prompt-popup>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NetSelect from '@/components/NetSelect.vue';
import PromptPopup from '@/components/PromptPopup.vue';
import { i18n } from '@/main';

export default {
  name: 'Netlist',
  components: { NetSelect, PromptPopup },
  setup() {
    const router = useRouter();
    const prompt = ref(null);

    // 表单数据
    const form = reactive({
      netName: '',
      type: 'xuper',
      chain: '',
      node: '',
      chainid: '',
      symbol: '',
      bwUrl: '',
      sign: 'xuper',
      isNewAdd: true,
    });

    // 链列表
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
    ]);

    // 当前选择的链
    const currentchain = ref({
      id: 2,
      name: 'XuperOS',
      value: 'xuper',
      sign: 'xuper',
    });

    // 网络列表
    const netList = ref(JSON.parse(localStorage.getItem('netList')) || []);

    // 方法：返回首页
    const goHome = () => {
      router.push('/Home');
    };

    // 方法：选择链
    const selectedChain = (e) => {
      console.log(e, '***e***');
      form.type = e.value;
      form.sign = e.value;
      currentchain.value = e;
    };

    // 方法：添加网络
    const addNetList = () => {
      if (!form.type) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg14'), 'warning', 2500);
      } else if (
        form.type == 'xuper' &&
        (form.netName == '' || form.chain == '' || form.node == '')
      ) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg14'), 'warning', 2500);
      } else if (
        form.type == 'eth' &&
        (form.netName == '' || form.node == '' || form.chainid == '' || form.symbol == '')
      ) {
        prompt.value.showToast(i18n.global.t('toastMsg.msg14'), 'warning', 2500);
      } else {
        // 操作
        netList.value.push({ ...form });
        localStorage.setItem('netList', JSON.stringify(netList.value));
        router.go(-1);
      }
    };

    return {
      form,
      chainList,
      currentchain,
      netList,
      prompt,
      goHome,
      selectedChain,
      addNetList,
    };
  },
};
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
    margin-top: 50px;
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
