import '@babel/polyfill';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
// import { Container,Input,Button,Dialog,Layout,Upload,Form,Radio,Dropdown,Pagination,Table,Message,Cascader,Popover,NavMenu,Tabs,DatePicker,Avatar,Divider,Carousel } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/element-variables.scss'

Vue.use(ElementUI);


import './assets/style/index.css'

import GiftMessage from '@/components/GiftMessage/index.js'
Vue.prototype.$giftMessage = GiftMessage;

import Danmu from '@/components/Danmu/index.js'
Vue.prototype.$Danmu = Danmu;


import Droadcast from '@/components/Droadcast/index.js'
Vue.prototype.$Droadcast = Droadcast;

Vue.config.productionTip = false

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', async function (el, binding) {//指令名称为：real-img
  let imgURL = binding.value;//获取图片地址
  if (imgURL) {
      let exist = await imageIsExist(imgURL);
      if (exist) {
          el.setAttribute('src', imgURL);
      } 
  }
})

/**
* 检测图片是否存在
* @param url
*/
let imageIsExist = function(url) {
  return new Promise((resolve) => {
      var img = new Image();
      img.onload = function () {
          if (this.complete == true){
              resolve(true);
              img = null;
          }
      }
      img.onerror = function () {
          resolve(false);
          img = null;
      }
      img.src = url;
  })
}

global.vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
