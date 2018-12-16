import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入路由配置文件
import store from './vuex/store' //引入Vuex
import axios from './https' //引入axios
import './plugins/element.js' //引入element-ui框架
import './assets/css/common.css' //引入公共样式表
import './assets/css/reset.css' //引入css清除样式表

axios.defaults.headers.common['token'] = ""
axios.defaults.headers.post["Content-type"] = "application/json"

Vue.prototype.$axios = axios  //写入vue的原型属性，全局注册，使用方法为:this.$axios

Vue.config.productionTip = false

new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app')