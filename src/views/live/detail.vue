<template>
  <div class="detail">
    <div class="ad" v-if="customAdList.adverturl">
      <a :href="customAdList.url?customAdList.url:''" target="_blank">
        <img :src="customAdList.adverturl" alt="">
      </a>        
    </div>
    <div class="live_room">
      <div class="live_video">
        <div class="video_top">
          <div class="face">
            <img :src="require('@/assets/image/default_icon.png')" v-real-img="roomInfo.headImg" alt="" width="108px" height="108px">
          </div>
          <div class="centent">
            <div class="title">{{roomInfo.domainName}} {{roomInfo.roomTitle}} <a :href="`/#/live/report?roomTitle=${roomInfo.roomTitle}&roomId=${roomId}`" target="_blank">举报</a></div>
            <div class="anchor">
              <span class="level">
                <img src="../../assets/image/login/ico_level.png" alt="">
                <span>lv{{roomInfo.level}}</span>
              </span>
              <span class="name">{{roomInfo.nickName}}</span>
              <img src="../../assets/image/detail/hot.png" alt="" class="hot">
              <span class="chat_num">{{hotNumFn(roomInfo.hotNum)}}</span>
              <span class="gift_num">直播间贡献值：{{roomInfo.giftprice}}</span>
            </div>
            <router-link target="_blank" to="/ranking" tag="a" class="recommend_btn">推荐大神</router-link>
          </div>
          <div class="right">
            <div class="follow">
              <div class="follow_num">{{roomInfo.focusNum}}</div>
              <div class="follow_btn" v-if="!followState" @click="follow()">
                <img src="../../assets/image/detail/like.png" alt="">
                <span>订阅</span>
              </div>
              <div class="follow_btn" style="background: #ccc;" @click="follow()" v-else>
                已订阅
              </div>
            </div>
            <!-- <div class="share">
              <div>
                <img src="../../assets/image/detail/phone.png" alt="" width="22px">
                <span>手机<br />观看</span>
              </div>
              <div>
                <img src="../../assets/image/detail/share.png" alt="" width="26px">
                <span>分享<br />直播</span>
              </div>
            </div> -->
          </div>
        </div>
        <div id="video-container" class="video_middle">
          <!-- <div class="down-player"><div class="down-player-title">主播暂不在播哦～</div><div class="down-player-bottom"><div class="down-player-face"><img :src="require('@/assets/image/default_icon.png')" v-real-img="roomInfo.headImg" alt=""></div><div class="down-player-date"><p>上次直播时间：</p><p>{{roomInfo.lastdate}}</p></div></div></div> -->
        </div>
        <div  class="video_bottom">
          <div class="date" v-if="token">
            <el-popover
              placement="top_start"
              width="400"
              popper-class="task_box"
              :popper-options="{boundariesElement: 'viewport'}"
              trigger="click"
              v-model="taskStauts">
                <!-- <div class="task_box"> -->
                  <div class="task_top">
                    <div :class="tasknum==0?'active':''" @click="tasknum=0" v-if="!taskFinsh">新手任务<i v-if="isNew"></i></div>
                    <div :class="tasknum==1?'active':''" @click="tasknum=1">日常任务<i v-if="isDay"></i></div>
                    <div :class="tasknum==2?'active':''" @click="tasknum=2">王者加冕<i v-if="isKing"></i></div>
                  </div>
                  <div class="task_lists" v-show="tasknum==0">
                    <div class="list" v-for="(item,index) of task.newArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                        <div class="list-left">
                          <img :src="item.imgurl" alt="">
                        </div>
                        <div class="list-center">
                          <p>{{item.taskname}}</p>
                          <p>{{item.vicename}}</p>
                        </div>
                        <div class="list-right">
                          <button class="noBtn" v-if="item.receive == 0" @click="taskStauts=false">{{item.ihittask+'/'+item.ialltask}}</button>
                          <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                          <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,1)">领取</button>
                        </div>
                    </div>
                  </div>
                  <div class="task_lists" v-show="tasknum==1">
                    <div class="list" v-for="(item,index) of task.dayArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                        <div class="list-left">
                          <img :src="item.imgurl" alt="">
                        </div>
                        <div class="list-center">
                          <p>{{item.taskname}}</p>
                          <p>{{item.vicename}}</p>
                        </div>
                        <div class="list-right">
                          <button class="noBtn" v-if="item.receive == 0" @click="taskStauts=false">{{item.ihittask+'/'+item.ialltask}}</button>
                          <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                          <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,2)">领取</button>
                        </div>
                    </div>
                  </div>
                  <div class="task_lists" v-show="tasknum==2">
                    <div class="list" v-for="(item,index) of task.kingArr" :class="(index+1) % 3 ?'list-active':''" :key='item.type'>
                        <div class="list-left">
                          <img :src="item.imgurl" alt="">
                        </div>
                        <div class="list-center">
                          <p>{{item.taskname}}</p>
                          <p>{{item.vicename}}</p>
                        </div>
                        <div class="list-right">
                          <button class="noBtn" v-if="item.receive == 0" @click="taskStauts=false">{{item.ihittask+'/'+item.ialltask}}</button>
                          <button class="finshBtn" v-if="item.receive == 2">已完成</button>
                          <button class="getBtn" v-if="item.receive == 1" @click="getGift(item.type,3)">领取</button>
                        </div>
                    </div>
                  </div>
                <!-- </div> -->
              <img slot="reference" src="../../assets/image/detail/date.png" alt="" width="64px">
            </el-popover>
          </div>
          <div class="date" v-else>
            <span>
              <img slot="reference" src="../../assets/image/detail/date.png" alt="" width="64px" @click="showLogin()">
            </span>
          </div>
          <div class="gift">
            <div class="gift_top">
              <div :class="gift_transform>0?'gift_more left':'gift_more left noClick'" @click="toLeft()">
                <img src="../../assets/image/detail/toLeft.png" alt="">
              </div>
              <div class="gift_collection_content">
                <div class="gift_collection" :style="'transform: translateX(-'+(gift_transform*56)+'px);'">
                  <div v-for="(item,index) in giftList" :key="item.giftId">
                    <el-popover
                      placement="top"
                      width="436"
                      popper-class="gift_popover"
                      trigger="hover"
                      v-model="item.hover" v-if="index>0">
                        <div class="gift_detail">
                          <div class="gift_img">
                            <img :src="item.pictureUrl" alt="" width="100%">
                          </div>
                          <div class="gift_right">
                            <div class="gift_title">{{item.name}} <span>{{item.price?'（'+item.price+'金币）':''}}</span> </div>
                            <div class="gift_harvest">
                              <span>经验值 +{{item.exp}}</span>
                              <span>主播热度 +{{item.hot}}</span>
                            </div>
                            <div class="gift_describe">{{item.giftDescribe}}</div>
                          </div>
                        </div>
                        <div class="gift_give">
                          <div :class="item==giveNumKey?'num active':'num'" v-for="item in giveNumList" :key="item" @click="giveNumKey=item">{{item}}</div>
                          <div class="give_btn" @click="getGiveGift(item,giveNumKey)">赠送</div>
                        </div>
                        <div class="gift_price">
                          总共： <span>{{item.price?item.price*giveNumKey+'金币':giveNumKey+'奶酪'}}</span>
                        </div>
                      <img slot="reference" :src="item.pictureUrl" alt="" width="46px" height="46px">
                    </el-popover>
                    <span v-if="index==0">
                      <img :src="item.pictureUrl" alt="" width="46px" height="46px" @click="getGiveGift(item,1)">
                    </span>                  
                  </div>
                </div>
              </div>
              <div :class="gift_transform<giftList.length-6?'gift_more':'gift_more noClick'" @click="toRight()">
                <img src="../../assets/image/detail/toRight.png" alt="">
              </div>
            </div>
            <div class="gift_bottom">
              <div class="gift_gold">
                <span>奶酪</span>
                <span>{{hotNumFn(userInfo.userAcct?userInfo.userAcct.giftNum:0)}}</span>
              </div>
              <div class="gift_gold">
                <span>金币</span>
                <span>{{hotNumFn(userInfo.userAcct?userInfo.userAcct.goldCoin:0)}}</span>
              </div>
              <div class="gift_btn recharge" @click="recharge()">充值</div>
              <!-- <div class="gift_btn knapsack">背包</div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="live_chat">
        <div class="notice">
          <div><img src="../../assets/image/detail/notice.png" alt=""></div>
          <marquee behavior="scroll">直播间公告：{{roomInfo.gonggao?roomInfo.gonggao:''}}</marquee>
        </div>
        <div class="ranking">
          <div class="ranking_tab">
            <div :class="rankType==1?'active':''" @click="rankType=1;getRankList(1)">日榜</div>
            <div :class="rankType==2?'active':''" @click="rankType=2;getRankList(2)">周榜</div>
          </div>
          <div :class="rankNum>3?'ranking_content ranking_more':'ranking_content'" @mouseenter="handleRankingMore(true)" @mouseleave="handleRankingMore(false)" v-if="rankList.length>0">
            <div v-for="(item,index) in rankNum" :key="index">
              <div :class="index<3?'ranking_num':'ranking_num ranking_no'">
                <span v-if="index>=3">{{item}}</span>
                <img :src="require('../../assets/image/detail/ranking'+item+'.png')" alt="" width="39px" v-if="index<3">
              </div>
              <div class="ranking_face" v-if="rankList[index]">
                <img :src="require('@/assets/image/default_icon.png')" v-real-img="rankList[index].head" alt="" width="38px" height="38px">
              </div>
              <div class="ranking_name" v-if="rankList[index]">{{rankList[index].nickname}}</div>
              <div class="ranking_level" v-if="rankList[index]">
                <img src="../../assets/image/login/ico_level.png" alt="">
                <span>lv{{rankList[index].level}}</span>
              </div>
              <div v-if="!rankList[index]" class="noData">虚位以待</div>
            </div>
          </div>
          <div class="noRankData" v-else>
            暂无人上榜
          </div>
        </div>
        <Message :userRole="userRole" />
      </div>
    </div>
    <div class="introduce" v-if="roomInfo.introduce">
      <div class="title">
        <img :src="require('@/assets/image/detail/introduce.png')" alt="">
        <span>主播简介</span>
      </div>
      <div class="introduce-detail">{{roomInfo.introduce}}</div>
    </div>
    <BaseInfo :liveDomain="liveDomain" :isScrollbottom="isScrollbottom"></BaseInfo>
    <Recharge :rechargeStauts="rechargeStauts"></Recharge>
  </div>
</template>

<script>
import BaseInfo from "./components/base";
import Message from "./components/Message";
import Recharge from "./components/Recharge";
import { apiLiveRoomInfo, apiIsSubscribe, apiTaskCenterList, apiGiftList, apiGiveGift, apiRankList} from '@/api/live'  
import { apiUnfocusLiveRoom, apiFocusLiveRoom } from "@/api/user"
import { apiAdvertisement } from "@/api/ad"
import tweblive_mixin from '@/utils/mixins/tweblive'
import { mapState, mapGetters } from 'vuex';
export default {
  name: "Detail",
  mixins: [tweblive_mixin],
  props: {
    liveDomain: {
      type: Array,
      default: () => []
    },
    isScrollbottom: {
      type: Number,
      default: 0
    }
  },
  components: {
    BaseInfo,
    Message,
    Recharge
  },
  computed: {
    ...mapState('chat',['roomId']),
    ...mapGetters(['token', 'userInfo', 'userLevel', 'task'])
  },
  watch: {
    'token'(value) {
      if(value) {
        this.getIsSubscribe();
        // this.getTask()
        this.$store.dispatch("user/getTask")
      }else {
        this.followState = undefined
      }
    },
    'task': {
      deep:true, //深度监听设置为 true
      handler:function(val){
        if(val.newArr.filter(item => item.receive == 1).length>0) {
          this.isNew = true
        }else {
          this.isNew = false
        }
        if(val.dayArr.filter(item => item.receive == 1).length>0) {
          this.isDay = true
        }else {
          this.isDay = false
        }
        if(val.kingArr.filter(item => item.receive == 1).length>0) {
          this.isKing = true
        }else {
          this.isKing = false
        }
      }
    }
  },
  data() {
    return {
      roomInfo: {},
      followState: undefined,
      taskFinsh: false,
      tasknum: 1,
      rankList: [],
      rankNum: 3,
      rankType: 1,
      giftList: [],
      giveNumList: [1, 25, 66, 118],
      giveNumKey: 1,
      gift_transform: 0,
      customAdList: {},
      taskStauts: false,
      visible: {},
      rechargeStauts: false,
      isNew: false,
      isDay: false,
      isKing: false
    }
  },
  created(){
    // this.getLiveRoomInfo();
    this.getRankList(this.rankType);
    this.getGiftList();
  },
  mounted() {
    if(this.token) {
      this.getIsSubscribe();
      this.$store.dispatch("user/getTask")
      // this.getTask()
    }
    this.getAdvertisement()
  },
  methods: {
    toLeft() {
      if(this.gift_transform>0) {
        if(this.gift_transform-6>0) {
          this.gift_transform -= 6;
        }else {
          this.gift_transform = 0
        }
      }
    },
    toRight() {
      let len = this.giftList.length
      if(this.gift_transform < len-6) {
        if(this.gift_transform+6<len-6) {
          this.gift_transform += 6;
        }else {
          this.gift_transform = len-6
        }
      }      
    },
    isLoginFn() {
      if(!this.token) {
        this.$store.commit('user/DIALOG_SHOW', true);
        return false
      }
      return true
    },
    /**
     * 显示更多排名
     */
    handleRankingMore(more){
      clearTimeout(this.delayRanking)
      if(more){
        this.delayRanking = setTimeout(()=>{
          this.rankNum = 10
        }, 300)
      }else{
        this.rankNum = 3
      }
    },
    // 进入直播间查询主播信息
    getLiveRoomInfo(type) {
      let params = {
        roomId: this.$route.params.id
      }
      return apiLiveRoomInfo(params).then(data => {
        this.roomInfo = data;
        this.$store.commit("chat/SET_ROOM_STATE",this.roomInfo.istate)
      })
    },
    getIsSubscribe(type) {
      let params = {
        roomId: this.$route.params.id
      }
      apiIsSubscribe(params).then(data => {
        this.followState = data.isSubscribe;
      })
    },
    showLogin() {
      this.$store.commit('user/DIALOG_SHOW', true);
    },
    // 订阅主播
    follow() {
      if(!this.isLoginFn() || this.followState == undefined) {
        return
      }
      return new Promise((resolve, reject) => {
        let fn = [apiFocusLiveRoom, apiUnfocusLiveRoom][this.followState];
        let params = {
          roomId: this.$route.params.id
        }
        fn(params).then(data => {
            this.followState = this.followState?0:1;
            let msg = "订阅成功！";
            if(!this.followState) {
              msg = "已取消订阅！";
              this.roomInfo.focusNum--
            }else {
              this.roomInfo.focusNum++
            }
            this.$message({
              showClose: true,
              message: msg,
              type: 'success'
            });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取排行榜
    getRankList(type) {
      let params = {
        type: type,
        roomId: this.$route.params.id
      }
      apiRankList(params).then(data => {
        this.rankList = data;
      })
    },
    // 充值
    recharge() {
      if(this.isLoginFn()){
        this.$store.commit('user/RECHARGE_SHOW', true);
      }     
    },
    // 获取礼物列表
    getGiftList() {
      apiGiftList().then(res=>{
        let data = [{
          describe: "",
          exp: 0,
          giftId: "9",
          hot: 0,
          money: 0,
          name: "奶酪",
          pictureUrl: require('@/assets/image/login/cheese.png'),
          price: 0,
          specEffect: "",
          state: 1,
          top: 9
        }]
        res.array = data.concat(res.array)
        res.array.map((key)=>{
          key.hover = false
        })
        this.giftList = res.array;
      })
    },
    // 礼物贈送
    getGiveGift(item, num) {
      if(!this.isLoginFn()) {
        return
      }
      let params = {
        size: num,
        roomId: this.roomId,
        giftId: item.giftId
      }
      apiGiveGift(params).then(res=>{
        item.hover = false
        if(item.price) {
          this.userInfo.userAcct.goldCoin -= item.price*num
        }else {
          this.userInfo.userAcct.giftNum -= num
        }        
        this.sendGiveGift(item, num, res.tradeOrderNo) 
        // this.$message.success('赠送成功')
      }).catch((error)=>{
        if(error.message=='金币余额不足') {
          this.$store.commit('user/RECHARGE_SHOW', true);
        }
      })
    },
    sendGiveGift(item, num, orderId) {
      let sendData = {
        userName: this.userInfo.nickName,
        userId: this.userInfo.userId,
        giftName: item.name,
        giftId: item.giftId,
        giftType: item.price?"付费":'免费',
        giftNum: num,
        giftUrl: item.pictureUrl,
        sendImg: this.userInfo.head,
        specEffect: item.specEffect,
        type: "type_send_gift",
        orderId: orderId,
        roomId: this.roomId
      }
  
      this.tweblive.sendCustomMessage({
        roomID: this.roomId,
        priority: 'Normal',
        data: JSON.stringify(sendData),
        description: '',
        extension: ''
      }).then((result)=>{
        let message = result.data.message
        message.nick = this.userInfo.nickName
        this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', message)
      }).catch((imError)=>{
        if(imError.code === 10017){
          this.$message.error('你已被禁言，请联系房管。')
        }
      })
      this.send_text = ""
    },
    getGift(id,type){ // 领取
      this.$store.dispatch("user/getGift",{id,type,message: this.$message})      
    }, 
    // 获取广告图
    getAdvertisement() {
      let param = {
        type: 4
      }
      apiAdvertisement(param).then(data => {
        if(data.length>0) {
          this.customAdList = data[0]
        }
      })
    }, 
    hotNumFn(num) {
      if(num < 10000) {
        return num
      }
      return (num/10000).toFixed(1)+" 万"
    }
  }
}
</script>

<style lang="scss"> 
// #svg-animation {
//   height: 100%;
//   canvas {
//     height: 100%;
//     width: 100%;
//     transform: none !important;            
//   }
// }
.gift_popover {
  border-radius: 0;
  box-shadow: 0px 8px 6px 7px rgba(80,80,80,0.48); 
  padding: 0;
  .gift_detail {
    display: flex;
    color: #111;
    font-size: 14px;
    font-weight: 600;    
    padding: 12px;
    .gift_img {
      width: 90px;
      height: 90px;
      line-height: 90px;
      border: 1px solid #c8c8c8;
      border-radius: 4px;
      img {
        vertical-align: middle;
      }
    }
    .gift_right {
      margin-left: 14px;
      .gift_title {
        font-size: 16px;
        span {
          font-size: 14px;
          color: #42EDC4;
        }
      }
      .gift_harvest {
        color: #666;
        font-weight: 400;
        margin: 6px 0 5px;
        span:nth-child(1) {
          padding-right: 14px;
        }
      }
    }
  }
  .gift_give {
    background: #eeeeee;
    padding: 12px 15px;
    display: flex;
    .num {
      width: 60px; 
      color: #111;
      border: 1px solid #c8c8c8;
      background: #fff;
      margin-right: 10px;
      &.active {
        color: #fff;
        background: #42edc4;
        border: none;
      }
    }
    .give_btn {
      width: 100px;
      margin-left: 15px;
      color: #fff;
      background: #42edc4;
    }
    .give_btn, .num  {
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .gift_price {
    font-size: 15px;
    line-height: 38px;
    font-weight: 600;
    padding-left: 15px;
    span {
      color: #42EDC4;
    }
  }
  &[x-placement^="top"].el-popper {
    .popper__arrow::after {
      border-width: 18px;
      border-top-color: #fff;
      bottom: -23px;
      margin-left: -16px;
    }
  }
}
</style>

<style lang="scss" scoped>
// 礼物描述弹框
  .detail {
    padding: 11px 30px 40px;
    .ad {
      width: 100%;
      img {
        display: block;
        width: 100%;
        max-height: 120px;
        border-radius: 10px;
      }
    }
    .live_room {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      .live_video {
        width: 73.7%;
        background-color: #fff;
        border-radius: 10px;
        // display: flex;
        // flex-direction: column;
        .video_top {
          height: 125px;
          display: flex;
          padding: 9px 17px 8px 10px;
          box-sizing: border-box;
          color: #111;
          font-size: 16px;
          .face {
            img {
              border-radius: 10px;
            }
          }
          .centent {
            padding-left: 11px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .title {
              font-size: 18px;
              font-weight: 600;
              a {
                font-size: 15px;
                color: #666;
                text-decoration: none;
                vertical-align: bottom;
              }
            }
            .anchor {
              .level {
                background: #57c797;
                border-radius: 5px;
                padding: 3px 6px;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
                img {
                  width: 14px;
                  margin-right: 2px;
                }
              }
              .name {
                padding: 0 8px 0 13px;
                font-weight: 600;
              }
              .hot {
                width: 14px;
                vertical-align: middle;
                margin-top: -5px;
              }
              .chat_num {
                color: #666;
                font-size: 14px;
                padding: 0 10px;
              }
              .gift_num {
                color: #666;
                font-size: 14px;
              }
            }
            .recommend_btn {
              width: 100px;
              height: 26px;
              line-height: 26px;
              background: #9e2ae2;
              border-radius: 13px;
              text-align: center;
              color: #fff;
              font-size: 14px;
              cursor: pointer;
            }
          }
          .right {
            font-size: 14px;
            font-weight: 600;
            color: #666;
            padding-top: 4px;
            .follow {
              background: #f2f2f2;
              border-radius: 14px;
              display: flex;
              .follow_num {
                line-height: 28px;
                padding-left: 20px;
                padding-right: 11px;
              }
              .follow_btn {
                width: 80px;
                height: 28px;
                line-height: 28px;
                background: #42ebc4;
                border-radius: 14px;
                color: #fff;
                text-align: center;
                cursor: pointer;
                img {
                  width: 19px;
                  vertical-align: middle;
                  margin-right: 5px;
                }
              }
            }
          }
        }
        .video_middle {
          // padding-top: 56.15%;
          background-color: #111;
          overflow: hidden;
          position: relative;
          padding-bottom: 56%;
          /deep/ .down-player {
            width: 340px;
            height: 198px;
            background: rgba(133,135,146,.5);
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .down-player-title {
              line-height: 66px;
              text-align: center;
              font-size: 21px;
              color: #fff;
              border-bottom: 1px solid #666;
            }
            .down-player-bottom {
              display: flex;
              align-items: center;
              height: 131px;
              justify-content: center;
              .down-player-face {
                margin-right: 20px;
                img {
                  width: 66px;
                  height: 66px;
                  border-radius: 50%;
                }
              }
              .down-player-date {
                font-size: 17px;
                color: #fff;
                p:nth-child(1) {
                  margin-bottom: 16px;
                }
              }
            }
          }
          /deep/ .vcp-player {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            .vcp-error-tips {
              z-index: 1;
            }
            .vcp-controls-panel {
              z-index: 1003;
            }
            #svg-animation {
              height: 100%;
            }
            .vcp-clarityswitcher {
              width: auto;
              height: auto;
              font-size: 14px;
              top: 50%;
              transform: translateY(-50%);
              a:not(.current):hover, a.current {
                color: #42EBC4;
              }
              .vcp-vertical-switcher-current {
                height: 26px;
                line-height: 26px;
                padding: 0 21px;
                background: #444444;
                border-radius: 13px;
              }
              .vcp-vertical-switcher-container {
                width: 70px;
                bottom: 0;
                background: transparent;
                padding-bottom: 35px;
                // &::before {
                //   content: '';
                //   border: 5px solid;
                //   border-color: transparent #242424 #242424 transparent;
                //   position: absolute;
                //   bottom: 30px;
                //   left: 50%;
                //   transform: translateX(-50%) rotateZ(45deg) skew(10deg, 10deg);
                // }
                .vcp-vertical-switcher-item {
                  background: #242424;
                }
              }
            }            
            .mask {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0,0,0,.6);
              z-index: 1003;
              .autoPlayImg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 252px;
                height: 178px;
                background: url('../../assets/image/1_c8d3aa.png') no-repeat;
                border: 0 solid;
                border-radius: 3px;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
        .video_bottom {
          height: 100px;
          display: flex;
          justify-content: space-between;
          padding: 0 14px 0 27px;
          .date {
            position: relative;
            &>span>img {
              padding: 19px 0;
              cursor: pointer;
            }
            /deep/ .task_box {
              padding: 15px 0;
              box-shadow: 0px 6px 6px 4px rgba(152,152,152,0.48); 
              bottom: 100px;
              left: -4px;
              z-index: 1;
              &::before {
                content: '';
                border: 10px solid;
                border-color: transparent #fff #fff transparent;
                position: absolute;
                bottom: -8px;
                left: 27px;
                transform: rotateZ(45deg) skew(20deg, 20deg);
              }
              .task_top {
                display: flex;
                justify-content: space-around;
                border-bottom: 1px solid #E5E5E5;
                color: #999;
                font-weight: 400;
                font-size: 15px;
                &>div {
                  cursor: pointer;
                  position: relative;
                  padding-bottom: 4px;
                  border-bottom: 3px solid transparent;
                  i {
                    position: absolute;
                    top: -1px;
                    right: -10px;
                    width: 7px;
                    height: 7px;
                    background: red;
                    border-radius: 50%;
                  }
                }
                .active {
                  border-bottom-color: #EC4E6B;
                  color: #111;
                }
              }
              .task_lists {
                padding: 7px 0;
                .list{
                  display: flex;
                  padding: 7px 20px;
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
                      background: linear-gradient(to right, #70f06e 0%, #4f88eb 100%);
                    }
                  }
                }
              }
            }

          }
          .gift {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 5px 0;
            .gift_top {
              display: flex;
              .gift_collection_content {
                width: 335px;
                height: 48px;
                overflow: hidden;
                position: relative;
                .gift_collection {
                  position: absolute;
                  top: 0;
                  left: 0;
                  display: flex;
                  transition: transform 1s;
                  -moz-transition: transform 1s; /* Firefox 4 */
                  -webkit-transition: transform 1s; /* Safari 和 Chrome */
                  -o-transition: transform 1s; /* Opera */                  
                  &>div {
                    width: 46px;
                    height: 46px;
                    margin-right: 10px;
                    cursor: pointer;
                    &:nth-child(1) {
                      img {
                        padding: 5px;
                        box-sizing: border-box;
                      }
                    }
                    img {
                      border: 1px solid #c8c8c8;
                      border-radius: 6px;
                      box-sizing: border-box;
                    }
                  }
                }
              }
              
              .gift_more {
                cursor: pointer;
                &.noClick {
                  cursor: no-drop;
                  opacity: 0.3;
                }
                &.left {
                  margin-right: 10px;
                }
                img {
                  width: 21px;
                  margin-top: 3px;
                }
              }
            }
            .gift_bottom {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              color: #111;
              font-size: 15px;
              font-weight: 600;
              &>div {
                margin-left: 16px;
              }
              .gift_gold {
                span:nth-child(1) {
                  color: #666;
                  padding-right: 8px;
                }
              }
              .gift_btn {
                width: 60px;
                height: 24px;
                line-height: 24px;
                border-radius: 12px;
                color: #fff;
                text-align: center;
                cursor: pointer;
                &.recharge {
                  background: #42ebc4;
                }
                &.knapsack {
                  background: #3898ff;
                }
              }
            }
          }
        }
      }
      .live_chat {
        width: 25.64%;
        background-color: #fff;
        border-radius: 10px;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        .notice {
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          img {
            width: 35px;
            vertical-align: middle;
            margin-right: 12px;
          }
          marquee {
            font-weight: 600;
            color: #666;
          }
        }
        .ranking {
          min-height: 222px;
          position: relative;
          .ranking_tab {
            display: flex;
            text-align: center;
            height: 40px;
            line-height: 40px;
            color: #8F98A4;
            font-weight: 600;
            font-size: 16px;
            &>div {
              flex: 1;
              cursor: pointer;
              border: 1px solid;
              border-color: #e0e0e0 #e0e0e0 transparent #e0e0e0;
              &:first-child {
                border-color: #e0e0e0 transparent transparent #e0e0e0; 
              }
              &.active {
                background: #eeeeee;
                color: #8F97A4;
              }
            }
          }
          .noRankData { 
            font-size: 16px; 
            font-weight: 600;
            color: #525252;
            text-align: center;
            line-height: 180px;
            border: 1px solid #e0e0e0;
          }
          .ranking_content {
            padding: 18px 18px 18px 8px;
            border: 1px solid #e0e0e0;
            &.ranking_more {
              width: 100%;
              box-sizing: border-box;
              position: absolute;
              top: 40px;
              left: 0;
              background: #fff;
              z-index: 1;
            }
            &>div {
              height: 38px;
              display: flex;
              align-items: center;
              &:not(:last-child) {
                margin-bottom: 15px;
              }
              .ranking_num {
                &.ranking_no {
                  width: 34px;
                  height: 34px;
                  line-height: 34px;
                  color: #525252;
                  font-size: 18px;
                  font-weight: 600;
                  text-align: center;
                  background: #999;
                  border-radius: 50%;
                }
              }
              .noData {
                margin: 0 15px 0 25px;
                color: #494949;
                font-weight: 600;
                font-size: 15px;
              }
              .ranking_face {
                width: 38px;
                height: 38px;
                margin: 0 15px 0 25px;
                img {
                  width: 38px;
                  height: 38px;
                  // background: #7ea5d9;
                  border: 2px solid #fcd553;
                  border-radius: 50%;
                  box-sizing: border-box;
                }
              }
              .ranking_name {
                flex: 1;
                max-width: 120px;
                color: #494949;
                font-weight: 600;
                font-size: 15px;
                padding-right: 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .ranking_level {
                background: #57c797;
                border-radius: 5px;
                padding: 3px 6px;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                img {
                  width: 14px;
                  margin-right: 2px;
                  vertical-align: middle;
                  margin-top: -1px;
                }
              }
            }
          }
        }
      }
    }
    .introduce {
      margin-top: 30px;
      .title {
        color: #111;
        font-size: 30px;
        img {
          vertical-align: middle;
          margin-right: 18px;
        }
      }
      .introduce-detail {
        background: #eeeeee;
        border-radius: 10px;
        margin-top: 17px;
        padding: 13px 20px 19px 22px;
        line-height: 35px;
        color: #333333;
        font-size: 20px;
      }
    }
  }
</style>