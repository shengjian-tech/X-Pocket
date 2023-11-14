<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { setOpen, createdMessage } from '@/utils/popup'
export default {
  created() {
    console.log('插件打开')
    createdMessage()
    setOpen(true)
    window.addEventListener('beforeunload', (e) => {
      setOpen(false)
    })
  },
  beforeDestroy() {
    setOpen(false)
  },
}
</script>
<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  background: #242429;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // height: 600px;
  height: 100%;
  box-sizing: border-box;
  min-width: 300px;
  background: url('./assets/img-bg.png');
  background-size: 100% 100%;
}
#app * {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
input {
  border: none;
  background: transparent;
  outline-color: transparent;
  outline: none;
}
input::-webkit-input-placeholder {
  color: white;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}
.text-line1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.container {
  height: 600px;
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  width: 300px;
  margin: auto;
}
.btn {
  background: linear-gradient(90deg, #00e5c4 0%, #0078e5 100%);
  text-align: center;
  color: white;
  cursor: pointer;
}
.btn:active {
  opacity: 0.8;
}
.bg-img2 {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  left: 0;
  top: 0;
}
.header {
  width: 100%;
  position: relative;
  text-align: center;
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  line-height: 0;
  .img-back {
    position: absolute;
    top: 0;
    left: 25px;
    width: 38px;
    height: 38px;
    z-index: 2;
    cursor: pointer;
  }
  .nav-title {
    font-size: 18px;
    font-family: Arial-Bold, Arial;
    font-weight: bold;
    color: #ffffff;
  }
}
/*滚动条样式*/

*::-webkit-scrollbar {
  display: none;
}
.comm-request {
  text-align: center;
  margin-top: 10px;
  img {
    width: 32px;
  }
  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    word-break: break-all;
  }
}
</style>
