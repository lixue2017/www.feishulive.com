<!--我的消息-->
<template>
  <div class="message">
    <h1 class="h1-title">消息中心</h1>
    <div class="content">
      <div class="content-left">
        <el-menu
            :default-active="activeMemu"
            class="el-menu-vertical-demo"
            text-color="#666"
            active-text-color="#42EDC4"
            @select="selectMenu">
            <el-menu-item index="1" @click="getMessage(0, 1)">
              <img :src="require('@/assets/image/my/notice.png')" alt="" width="48px">
              <span slot="title">全部</span>
            </el-menu-item>
            <el-menu-item index="2" @click="getMessage(1, 1)">
              <img :src="require('@/assets/image/my/system_notice.png')" alt="" width="48px">
              <span slot="title">系统通知</span>
            </el-menu-item>
            <el-menu-item index="3" @click="getMessage(2, 1)">
              <img :src="require('@/assets/image/my/activity_notice.png')" alt="" width="48px">
              <span slot="title">活动通知</span>
            </el-menu-item>
        </el-menu>
      </div>
      <div class="content-right">
        <!-- <div class="breadcrumb">
          <span :class="isActive==0?'is-active':''">全部</span>
          <span :class="isActive==1?'breadcrumb-item is-active':'breadcrumb-item'">未读</span>
          <span :class="isActive==2?'is-active':''">已读</span>
        </div> -->
        <div class="items">
          <div class="item" v-for="(item, index) in messageList.array" :key="index">
            <div class="time">{{item.cadddate||item.addDate}}</div>
            <div class="text unread">
              <div class="title">{{item.title?item.title:item.itype==1?'系统通知':'活动通知'}}</div>
              <div class="desc"> 
                <a :href="'/#/live/detail'+item.roomId" v-if="item.roomId">{{item.content}}</a>
                <span v-else>{{item.content}}</span>
                <!-- <span class="detail" v-if="activeMemu==2">点击查看详情！</span> -->
              </div>
            </div>
          </div>
        </div> 
        <!-- <div v-else class="noData">暂无消息</div>        -->
        
        <my-pagination 
          :page="start" 
          :limit="limit" 
          :total="messageList.total"
          layout="total, prev, pager, next"
          @pagination="handlePagination" />
      </div>      
    </div>
  </div>
</template>

<script>
import { apiUserMessage } from '@/api/user' 
import MyPagination from '@/components/Common/MyPagination'
  export default {
    name: 'Message',
    components: {
      MyPagination,
    },
    data(){
      return {
        newList:[],
        activeMemu: "1",
        isActive: 0,
        start: 1,
        limit: 3,
        total: 0,
        type: 0,
        messageList: {
          total: 0,
          array: []
        },
      }

    },
    created(){
      this.getMessage(this.type)
      // this.getSubscribeMessage()
      // this.getUserMessage(this.type)
    },
    methods:{
      getMessage(type, start){
        if(start) {
          this.start = start
        }
        let params= {
          types: type,          
          pageNo: this.start,
          pageSize: this.limit
        }
        this.type = type;
        this.activeMemu = (type+1)+"";
        apiUserMessage(params).then(res=>{
          this.messageList = res;
        })  
      },
      selectMenu() {

      },
      handlePagination({page, limit}){
        this.start = page
        this.limit = limit
        this.getMessage(this.type)
      }
    }
  }
</script>

<style lang="scss" scoped>
.message{
  width: 95%;
  height: calc(100% - 40px);
  background: #fff;
  border-radius: 10px;
  padding: 30px 35px;
  margin: 20px auto;
  box-sizing: border-box;
  .h1-title{
    color:#111;
    font-size:24px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .content{
    width: 1050px;
    height: 95%;
    border: 1px solid #cccccc;
    border-radius: 15px;
    display: flex;
    overflow: hidden;
    .content-left {
      height: 100%;
      border-right: 1px solid #ccc;
      /deep/ .el-menu-vertical-demo {
        width: 180px;
        border-top: 1px solid #ccc;
        margin-top: 63px;
        .el-menu-item {
          width: 180px;
          height: 87px;
          line-height: 87px;
          font-size: 22px;
          border-bottom: 1px solid #ccc;
          &.is-active {
            background-color: #eee;
          }
          &:hover {
            background-color: #eee;
          }
          img {
            margin-right: 10px;
          }
        }
      }
    }
    .content-right {
      width: 868px;
      overflow: hidden;
      .breadcrumb {
        height: 63px;
        line-height: 63px;
        text-align: center;
        border-bottom: 1px solid #ccc;
        span {
          padding: 0 44px;
          font-size: 22px;
          color: #666;
          cursor: pointer;
          &.is-active {
            color: #42EDC4;
          }
          &.breadcrumb-item {
            border-left: 2px solid #ccc;
            border-right: 2px solid #ccc;
          }
        }
      }
      .items{
        min-height: calc(100% - 152px);
        box-sizing: border-box;
        padding-bottom: 20px;
      }
      .item{
        margin: 0 auto;
        width: 88%;
        margin-bottom:15px;
        .time{
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          color: #666666;
          padding: 27px 0 16px;
        }
        .text{
          padding: 20px;
          // border: 1px solid #cccccc;
          box-shadow: 2px 2px 3px 2px #ccc;
          border-radius: 6px;          
          font-size: 18px;
          color: #666;     
          line-height: 31px;
          letter-spacing: 0.5px;
          &.unread {
            color: #333;
            font-weight: bold;
          }    
          .desc{
            .detail {
              color: #42EDC4;
              cursor: pointer;
              font-weight: 600;
            }
          }
          .more{
            height: 40px;
            text-align: right;
            .el-button{
              color: #42EDC4;
            }
          }
        }
      }
      .pagination-container {
        padding: 0 10px;        
        margin-bottom: 30px;
      }
    }
    .message_title{
      font-size: 20px;
      font-weight: 700;
      color: #111111;
      line-height: 50px;
      text-align: center;
      border-bottom: 2px solid #ccc;
    }
    .noData{
      color:#999;
      padding: 50px 0;
      text-align: center;
    }
    
  }

}
</style>