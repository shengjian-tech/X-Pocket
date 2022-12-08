<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "AlibabaPuHuiTi-Regular";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 600px;
}
* {
  margin: 0;
  padding: 0;
}
.el-button--text {
  color: #5295fe !important;
}
.el-dropdown {
  color: #ffffff !important;
}
.firstTabs .el-tabs__item {
  width: 50%;
  border-radius: 50px 50px 0 0;
  height: 55px;
  border: none !important;
  line-height: 58px !important;
  font-size: 24px !important;
}
.firstTabs .el-tabs__header:nth-child(1) {
  border-radius: 50px 50px 0 0;
  background: #5832a0;
  margin-top: -50px;
}

.firstTabs .is-top {
  background-color: #ffffff;
}
.firstTabs .el-tabs__nav-wrap {
  border-radius: 50px 50px 0 0;
}

.tabslist .el-tabs__header:nth-child(1) {
  border-radius: none;
  background: none;
  margin-top: 0px;
}

.firstTabs .el-tabs__item.is-active {
  color: #9327fc !important;
  border-bottom: 4px solid #9327fc !important;
}

.tabslist .el-tabs__item {
  width: auto !important;
  font-size: 16px !important;
}
.tabslist .el-tabs__item.is-active {
  color: #9327fc !important;
  border-bottom: none !important;
}
.tabslist .el-tabs__active-bar {
  display: none;
}
</style>
