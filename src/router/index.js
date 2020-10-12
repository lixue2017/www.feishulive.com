import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
    }]
  }, {
    //搜索页面
    path: '/search',
    component: Layout,
    children: [{
      path: '',
      name: 'Search',
      component: () => import(/* webpackChunkName: "search" */ '@/views/search')
    }]
  }, {
    //主播排行榜
    path: '/ranking',
    component: Layout,
    children: [{
      path: '',
      name: 'Ranking',
      component: () => import(/* webpackChunkName: "ranking" */ '@/views/ranking.vue')
    }]
  },
  {
    path: '/live',
    component: Layout,
    children: [{
      path: '',
      redirect: 'all',
      component: () => import(/* webpackChunkName: "liveIndex" */ '@/views/live/index'),
      children: [{
        //我的关注
        path: 'follow',
        name: 'Follow',
        component: () => import(/* webpackChunkName: "liveFollow" */ '@/views/live/follow')
      }, {
        //历史观看
        path: 'history',
        name: 'History',
        component: () => import(/* webpackChunkName: "liveHistory" */ '@/views/live/follow')
      }, {
        //精彩推荐
        path: 'recommend',
        name: 'Recommend',
        component: () => import(/* webpackChunkName: "Recommend" */ '@/views/live/recommend')
      }, {
        //今日推荐
        path: 'dayrecommend',
        name: 'Dayrecommend',
        component: () => import(/* webpackChunkName: "Dayrecommend" */ '@/views/live/recommend')
      }, {
        //颜值
        path: 'appearance',
        name: 'Appearance',
        component: () => import(/* webpackChunkName: "Appearance" */ '@/views/live/recommend')
      }, {
        //举报
        path: 'report',
        name: 'Report',
        component: () => import(/* webpackChunkName: "Appearance" */ '@/views/live/to_report')
      }, {
        //直播间
        path: 'detail/:id',
        name: 'Detail',
        component: () => import(/* webpackChunkName: "Detail" */ '@/views/live/detail')
      }, {
        //直播首页分類
        path: ':id',
        name: 'live',
        component: () => import(/* webpackChunkName: "baseInfo" */ '@/views/live/base-info')
      }]
    }]
  },
  {
    path: '/download',
    component: Layout,
    children: [{
      path: '',
      name: 'Download',
      component: () => import(/* webpackChunkName: "app_download" */ '@/views/app_download.vue')
    }]
  },
  {
    path: '/tool',
    component: Layout,
    children: [{
      path: '',
      name: 'Tool',
      component: () => import(/* webpackChunkName: "app_download" */ '@/views/tool.vue')
    }]
  },
  {
    path: '/my',
    component: Layout,
    children: [{
      path: '',
      redirect: 'baseinfo',
      component: () => import(/* webpackChunkName: "my" */ '@/views/my'),
      children: [{
        //我的资料
        path: 'baseinfo',
        name: 'BaseInfo',
        component: () => import(/* webpackChunkName: "base-info" */ '@/views/my/base-info')
      }, {
        //我的消息
        path: 'message',
        name: 'Message',
        component: () => import(/* webpackChunkName: "message" */ '@/views/my/message')
      }, {
        //直播设置
        path: 'liveset',
        name: 'LiveSet',
        component: () => import(/* webpackChunkName: "liveset" */ '@/views/my/live-set')
      }, {
        //房间管理 
        path: 'roommanage',
        name: 'RoomManage',
        component: () => import(/* webpackChunkName: "roommanage" */ '@/views/my/room-manage')
      }, {
        //取款
        path: 'drawmoney',
        name: 'DrawMoney',
        component: () => import(/* webpackChunkName: "drawmoney" */ '@/views/my/draw-money')
      }, {
        //直播收益
        path: 'live-earn',
        name: 'LiveEarn',
        component: () => import(/* webpackChunkName: "live-earn" */ '@/views/my/live-earning')
      },{
        //申请直播
          path: 'apply-anchor',
          name: 'applyAnchor',
          component: () => import(/* webpackChunkName: "apply-anchor" */ '@/views/my/apply-anchor')
      },{
        //我的等级
          path: 'grade',
          name: 'Grade',
          component: () => import(/* webpackChunkName: "grade" */ '@/views/my/grade')
      },{
        //任务中心
          path: 'task',
          name: 'Task',
          component: () => import(/* webpackChunkName: "task" */ '@/views/my/task')
      },{
        //客服中心
          path: 'customer-service',
          name: 'CustomerService',
          component: () => import(/* webpackChunkName: "task" */ '@/views/my/customer-service')
      },{
        //我的订阅
          path: 'subscribe',
          name: 'Subscribe',
          component: () => import(/* webpackChunkName: "subscribe" */ '@/views/my/subscribe')
      },{
        //历史观看  
          path: 'historical',
          name: 'Historical',
          component: () => import(/* webpackChunkName: "historical" */ '@/views/my/historical')
      },{
        //我的财富
          path: 'wealth',
          name: 'Wealth',
          component: () => import(/* webpackChunkName: "wealth" */ '@/views/my/wealth')
      }]
    }]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
