import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.prototype.$axios = axios
// 国际化中英文切换
const i18n = new VueI18n({
  locale: localStorage.getItem('languageSet') || 'zh', //从localStorage里获取用户中英文选择，没有则默认中文
  messages: {
    zh: require('./components/Language/zh'),
    en: require('./components/Language/en'),
  },
})
// // let _this = this;
// chrome.runtime.onMessageExternal.addListener(
//   (request, sender, sendResponse) => {
//     console.log(request); // 发送的消息
//     // 解析请求参数
//     const req = JSON.parse(request);
//     // console.log(req.orderID, req.receive, req.tokenID, req.amount); // 发送的消息
//     // 拿到所有参数之后调用插件，并且插件弹窗显示资产转移的页面，并且填充数据，订单ID不用显示, 用户点击确认后调用转移资产方法
//     // var txID = _this.TransferNFTEvm("ruleForm");
//     var txID = "123456";
//     // 返回交易ID
//     sendResponse(txID); // 这里将tab信息发送给发送者
//   }
// );
new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
