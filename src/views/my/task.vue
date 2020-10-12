<!--任务中心-->
<template>
    <div class="task">
        <header-info @edit-nickname="switchComp('UpdateNickname', $event)" />
        <div class="divider" style="display: block;height: 1px;width: 100%;background:#ccc"></div>
        <component :is="dynamicName" v-bind="dynamicData" @goback="switchComp('')"></component>
        <div v-if="!dynamicName" class="bottom-task">
          <!-- 新手任务 -->
          <div class="task-list clearfix">
            <h2>新手任务</h2>
            <div class="lists">
              <div class="list" v-for="(item,index) of task.newArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                  <div class="list-left">
                    <img :src="item.imgurl" alt="">
                  </div>
                  <div class="list-center">
                    <p>{{item.taskname}}</p>
                    <p>{{item.vicename}}</p>
                  </div>
                  <div class="list-right">
                    <button class="noBtn" v-if="item.receive == 0">{{item.ihittask+'/'+item.ialltask}}</button>
                    <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                    <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,1)">领取</button>
                  </div>
              </div>
            </div>
          </div>
          <!-- 日常任务 -->
          <div class="task-list clearfix">
            <h2>日常任务</h2>
            <div class="lists">
              <div class="list" v-for="(item,index) of task.dayArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                  <div class="list-left">
                    <img :src="item.imgurl" alt="">
                  </div>
                  <div class="list-center">
                    <p>{{item.taskname}}</p>
                    <p>{{item.vicename}}</p>
                  </div>
                  <div class="list-right">
                    <button class="noBtn" v-if="item.receive == 0">{{item.ihittask+'/'+item.ialltask}}</button>
                    <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                    <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,2)">领取</button>
                  </div>
              </div>
            </div>
          </div>
          <!-- 王者加冕 -->
          <div class="task-list clearfix">
            <h2>王者加冕</h2>
            <div class="lists">
              <div class="list" v-for="(item,index) of task.kingArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                  <div class="list-left">
                    <img :src="item.imgurl" alt="">
                  </div>
                  <div class="list-center">
                    <p>{{item.taskname}}</p>
                    <p>{{item.vicename}}</p>
                  </div>
                  <div class="list-right">
                    <button class="noBtn" v-if="item.receive == 0">{{item.ihittask+'/'+item.ialltask}}</button>
                    <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                    <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,3)">领取</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import HeaderInfo from './components/HeaderInfo'
import UpdateNickname from './components/UpdateNickname'

import { apiTaskCenterList , apiGetTask} from '@/api/live'  
import { mapGetters } from 'vuex';
export default {
  components: {
    HeaderInfo, UpdateNickname
  },
  data(){
    return {
      dynamicName: '',
      dynamicData:''
    }
  },
  created(){
    this.$store.dispatch("user/getTask")
  },
  computed: {
    ...mapGetters(['task'])
  },
  mounted () {


  },  
  // watch:{
  //   $route(to){
  //     console.log(to.path.split("/")[2])
  //     localStorage.setItem("active",to.path.split("/")[2])
  //   }

  // },
  methods:{
    getGift(id,type){ // 领取
      this.$store.dispatch("user/getGift",{id,type,message: this.$message})
    },
    switchComp(name, data){
      this.dynamicName = name
      this.dynamicData = data
    }
  }
}
</script>

<style lang="scss" scoped>
  .task{
    background: #fff;
    width: 95%;
    margin: 20px auto;
    border-radius: 10px;
  }
  .bottom-task{
    padding:0 60px 30px;
  }
  .task-list{
    h2{
      line-height: 60px;
      font-weight:700;
      color:#111;
    }
    .list-active{
      border-right:1px solid #E6E6E6;
    }
  }
 .task-list .list{
    display: flex;
    width:33.3333%;
    float:left;
    padding:10px 20px;
    min-height:100px;
    box-sizing: border-box;
    .list-left{
      width:48px;
      height:48px;
      img{
        width:100%;
        height:100%;
      }
    }
    .list-center{
      flex:1;
      margin-left: 12px;
      font-size:14px;
      p:nth-of-type(1){
        color:#111;
        font-weight:700;
        margin:5px 0;
      }
      p:nth-of-type(2){
        color:#999;
      }
    }
    .list-right{
      button{
        min-width: 76px;
        height: 32px;
        margin-top: 8px;
        border-radius: 16px;
        border:none;
        outline:none;
        padding: 0 5px;
      }
      .noBtn{
        border: 1px solid #111111;
        background: #fff;
        color:#000;
        // cursor: pointer;
      }
      .finshBtn{
        background: #F2F2F2;
        color: #999999;
      }
      .getBtn{
        color:#fff;
        cursor: pointer;
        background: linear-gradient(#70f06e 0%, #4f88eb 100%);
      }
    }
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .clearfix{
    *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
  }
</style>