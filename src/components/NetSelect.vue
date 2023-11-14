<template>
  <div class="select-cont">
    <div class="current select" @click="showchain">
      <div class="comm-logo">
        <img :src="netObj[currentchain.sign]" />
      </div>
      <div class="flex1">{{ currentchain.name || currentchain.netName }}</div>
      <img src="../assets/img-down.png" v-if="!disabled" />
    </div>
    <div class="select-list" v-if="isShow">
      <div
        class="select"
        v-for="(item, index) in chainList"
        :key="index"
        @click="chosechain(item)"
      >
        <div class="comm-logo">
          <img :src="netObj[item.sign]" />
        </div>
        <div class="flex1">{{ item.name }}</div>
        <img src="../assets/img-checked.png" v-if="currentId == item.id" />
        <img src="../assets/img-check.png" v-else />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      currentId: this.currentchain.id,
      netObj: {
        xuper: require('../assets/img-x.png'),
        eth: require('../assets/img-eth.png'),
        polygon: require('../assets/img-polygon.png'),
      },
    }
  },
  props: {
    disabled: Boolean,
    chainList: {
      type: Array,
      default: () => [],
    },
    currentchain: {
      type: Object,
      default: () => ({
        id: 2,
        name: 'XuperOS',
        value: 'xuper',
        sign: 'xuper',
      }),
    },
  },
  methods: {
    showchain() {
      if (!this.disabled) {
        this.isShow = !this.isShow
      }
    },
    chosechain(item) {
      this.isShow = false
      this.currentId = item.id
      this.$emit('selectedChain', item)
    },
  },
}
</script>
<style lang="less" scoped>
.select-cont {
  position: relative;
  width: 100%;
  .select {
    display: flex;
    align-items: center;
    height: 47px;
    background: rgba(255, 255, 255, 0.1);
    padding: 0 15px 0 8px;
    border-radius: 10px;
    cursor: pointer;
    .comm-logo {
      width: 32px;
      height: 32px;
      background: rgba(38, 38, 54, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      img {
        width: 18px;
      }
    }
    .flex1 {
      flex: 1;
      text-align: left;
      padding-left: 8px;
      font-size: 12px;
      font-family: Arial-Bold, Arial;
      font-weight: bold;
      color: white;
    }
  }
  .select-list {
    margin-top: 10px;
    .select {
      margin-bottom: 10px;
    }
  }
}
</style>
