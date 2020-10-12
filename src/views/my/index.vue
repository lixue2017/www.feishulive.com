<template>
  <back-framework>
    <template v-slot:aside>
      <div class="my_menu">
        <div class="title">个人中心</div>
        <div class="content">
          <el-menu
            :default-active="activeMemu"
            class="el-menu-vertical-demo"
            backgroundColor="#2F3035"
            text-color="#fff"
            active-text-color="#42EDC4"
            :router="true"
            @select="selectMenu">
            <el-menu-item index="baseinfo">
              <img src="../../assets/image/my/baseinfo.png" alt="" width="30px">
              <span slot="title">我的资料</span>
            </el-menu-item>
            <el-menu-item index="message">
              <img src="../../assets/image/my/message.png" alt="" width="30px">
              <span slot="title">我的消息</span>
            </el-menu-item>
            <el-menu-item index="wealth">             
              <img src="../../assets/image/my/wealth.png" alt="" width="30px">
              <span slot="title">我的财富</span>
            </el-menu-item>
            <el-menu-item index="subscribe">
              <img src="../../assets/image/my/subscribe.png" alt="" width="30px">
              <span slot="title">我的订阅</span>
            </el-menu-item>
            <!-- <el-menu-item index="historical">
              <img src="../../assets/image/my/historical.png" alt="" width="30px">
              <span slot="title">历史观看</span>
            </el-menu-item> -->
            <el-menu-item index="grade">           
              <img src="../../assets/image/my/grade.png" alt="" width="30px">
              <span slot="title">我的等级</span>
            </el-menu-item>
            <el-menu-item index="task">
              <img src="../../assets/image/my/task.png" alt="" width="30px">
              <span slot="title">任务中心</span>
            </el-menu-item>
            <el-menu-item index="apply-anchor" v-if="applyStep == 1 || applyStep == 3 || applyStep == 4">           
              <img src="../../assets/image/my/apply-anchor.png" alt="" width="30px">
              <span slot="title">申请直播</span>
            </el-menu-item>
            <template v-else-if="applyStep == 2">
              <el-menu-item index="liveset">
                <img src="../../assets/image/my/live-set.png" alt="" width="30px">
                <span slot="title">直播设置</span>
              </el-menu-item>
              <el-menu-item index="roommanage">
                <img src="../../assets/image/my/room-manage.png" alt="" width="30px">
                <span slot="title">房间管理</span>
              </el-menu-item>
              <el-menu-item index="live-earn">
                <img src="../../assets/image/my/draw-money.png" alt="" width="30px">
                <span slot="title">直播收益</span>
              </el-menu-item>
            </template>            
            <el-menu-item index="customer-service">
              <img src="../../assets/image/my/customer-service.png" alt="" width="30px">
              <span slot="title">客服中心</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </template>
    <template v-slot:content="oData">
      <router-view :reduction="reduction" @selectReduction="selectReduction" :isScrollbottom="oData.isScrollbottom"/>
    </template>
  </back-framework>
</template>

<script>
import BackFramework from '@/components/BackFramework.vue'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  components: {
    BackFramework
  },
  data() {
    return {
      reduction: false
    }
  },
  computed: {
    ...mapGetters(['applyStep', 'token']),
    activeMemu() {
      return this.$route.path.split('/')[2]
    }
  },
  watch: {
    token(val) {
      if(!val) {
        this.$router.push({path: '/'})
      }
    }
  },
  beforeRouteEnter(to, from, next){
    if(!getToken()){
      next('/')
    }else{
      next()
    }
  },
  methods: {
    selectMenu(data) {
      this.reduction = true
    },
    selectReduction(bool) {
      this.reduction = bool
    }
  },
}
</script>

<style lang="scss" scoped>
.my_menu{
  height: 100%;
  .title{
    padding: 30px 0 22px 90px;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 2px;
  }
  .content{
    height: calc(100% - 152px);
    overflow: hidden;
    padding-bottom: 18px;
    box-sizing: border-box;
    &:hover {
      overflow-y: auto;
    }
    &::-webkit-scrollbar  
    {  
        width: 10px;  /*滚动条宽度*/
    }  
      
    /*定义滚动条轨道 内阴影+圆角*/  
    &::-webkit-scrollbar-track  
    {  
        border-radius: 10px;  /*滚动条的背景区域的圆角*/
        background-color: transparent;/*滚动条的背景颜色*/  
    }  
      
    /*定义滑块 内阴影+圆角*/  
    &::-webkit-scrollbar-thumb  {  
        border-radius: 4px;  /*滚动条的圆角*/ 
        background-color: #666;  /*滚动条的背景颜色*/
    }
    .el-menu{
      border-right: none;
      .el-menu-item{
        height: 62px;
        line-height: 62px;
        padding-left: 90px !important;
        font-size: 20px;
        img {
          margin-right: 20px;
          opacity: 0.4;
        }
        &.is-active img{
          opacity: 1;
        }
      }
    }    
  }
}
</style>