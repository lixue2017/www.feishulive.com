<!--我的订阅-->
<template>
  <div class="subscribe">
    <div class="recommend">
      <div class="recommend-top">
        <div class="title">我的订阅</div>
        <el-button size="mini" round :type="currLiveType==0?'primary':''" @click="pageNo=1;getSubscribe(0)" plain>全部</el-button>
        <el-button size="mini" round :type="state==1?'primary':''" @click="pageNo=1;getSubscribe(currLiveType, 1)" plain>直播中</el-button>
        <template v-for="(item, index) in liveType" >
          <el-button size="mini" :type="currLiveType==item.id?'primary':''" round :key="index" @click="pageNo=1;getSubscribe(item.id,state)" plain>{{item.name}}</el-button>
        </template> 
      </div> 
      <MyBox :itemArr="recommend" :xl="6"></MyBox>
      <div class="noData" v-show="recommend.length == 0">还没有订阅{{currLiveType!=0?'此类型':''}}主播，可以去喜欢的直播间订阅主播~</div>
    </div>
  </div>
</template>

<script>
import MyBox from "@/components/MyBox";
import { apiGetSubscribe } from "@/api/search"
import { apiChannelList } from '@/api/live'
  export default {
    name: 'Subscribe',
    props: {      
      isScrollbottom: {
        type: Number,
        default: 0
      },
    },
    data(){
      return {
        recommend:[],
        liveType: [],
        currLiveType: 0,
        state: undefined,
        pageNo: 1,
        pageSize: 16,
        total: 0
      }

    },
    watch: {
      isScrollbottom() {
        if(this.total>this.recommend.length) {
          this.pageNo++;
          this.getSubscribe(this.currLiveType, this.state, 1)
        }        
      }
    },
    created(){
      this.getSubscribe(0)
      this.getChannelList()
    },
    methods:{
      hotNumFn(num) {
        if(num < 10000) {
          return num
        }
        return (num/10000).toFixed(1)+"万"
      },
      getSubscribe(type, state, addPageNo){  
        this.currLiveType = type
        this.state = state
        let param = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        if(state != undefined)  {
          param.state = state
        }    
        if(type) {
          param.type = type
        }
        apiGetSubscribe(param).then(res=>{
          this.total = res.total
          res.array.map(key=>{
            key.is_hover = 0
          })
          if(addPageNo) {
            this.recommend = this.recommend.concat(res.array);
          }else {
            this.recommend = res.array;
          }          
        })
      },
      // 房间类型列表
      getChannelList() {
        return new Promise((resolve, reject) => {
          apiChannelList().then(data => {
              this.liveType = data.liveType;
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      },
    },
    components: {
      MyBox
    }
  }
</script>

<style lang="scss" scoped>
.subscribe {
  height: 100%;
  // padding-right: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .recommend {
    width: 95%;
    min-height: calc(100% - 70px);
    background: #ffffff;
    border-radius: 10px;
    margin: 20px auto 50px;
    padding: 0 100px 40px 52px;
    box-sizing: border-box;
    .recommend-top {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      margin-top: 27px;
      .title {
        font-size: 24px;
        color: #111111;
        margin-right: 30px;
      }
    }
    /deep/ .box .nav_a {
      box-shadow: 2px 3px 4px 2px rgba(0,0,0,0.22); 
    }
  }
}
.noData{
  text-align: center;
  color:#999;
  padding: 100px 0;
}
@media screen and (max-width: 1500px) {
  .subscribe {
    .recommend {
      padding-right: 52px;
    }
  }  
}
@media screen and (min-width: 1680px) {
  .subscribe {
    .recommend {
      padding-right: 200px;
    }
  }  
}
</style>