<template>
  <div class="header_content">
    <div class="header_left">
      <div class="header_logo">
        <img :src="require('@/assets/image/logo.png')" />
      </div>
      <div class="header_nav">
        <router-link to="/index" tag="span">首页</router-link>
        <router-link to="/live" tag="span">直播</router-link>
        <!-- <span :class="isMy?'router-link-exact-active router-link-active':''" @click="applyClick()" v-if="!token||applyStep!=2">招募直播</span> -->
        <router-link to="/download" tag="span">APP下载</router-link>
        <!-- <router-link to="/tool" tag="span">直播工具下载</router-link> -->
      </div>
    </div>

    <div class="header_right">
      <div class="header_search">
        <el-input
          placeholder=""
          v-model="query" @keydown.native="keydownFn($event)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchFn()"></i>
        </el-input>
      </div>
      
      <router-link to="/my/subscribe" tag="div" class="header_focus" v-if="token">
        <img src="../assets/image/ico_follow.png" alt=""><br />
        <span>订阅</span>
      </router-link>
      <!-- <router-link to="/my/historical" tag="div" class="header_his">
        <img src="../assets/image/ico_history.png" alt=""><br />
        <span>历史</span>
      </router-link> -->
      <div class="header_user">
        <img :src="userInfo.head?userInfo.head:require('../assets/image/ico_unlogin.png')" @error="userInfo.head=require('../assets/image/ico_unlogin.png')" width="48px" height="48px" alt="">
        <div>
          <div class="click_face" v-show="!token">
            <img src="../assets/image/login/login_btn.png" alt=""  @click="click_login_fn">
          </div>
          <div class="userInfo" v-if="token&&userInfo.userAcct">
              <div class="top">
                <div class="logout" @click="logout()">
                  <img src="../assets/image/login/ico_logout.png" alt="">
                  <span>退出</span>
                </div>
                <div class="usermsg">
                  <div class="name">{{userInfo.nickName}}</div>
                  <div class="level">
                    <img src="../assets/image/login/ico_level.png" v-real-img="userInfo.cmedal" alt="">
                    <span>lv{{userInfo.vipLevel}}</span>
                  </div>
                  <div class="cmedal" v-if="userInfo.cmedal">
                    <img :src="require('@/assets/image/my/cmedal'+item+'.png')" :title="cmedalTitle[item]" alt="" class="cmedal" v-for="(item,index) in cmedal" :key="index">
                  </div>
                </div>
                <div class="progress_outer">
                  <div>LV{{userLevel.ilevel}}</div>
                  <div class="progress">
                    <div class="bar" :style="'width:'+((userLevel.exp/userLevel.ivalue)*100)+'%'"></div>
                    <div class="text">{{userLevel.exp}}/{{userLevel.ivalue}}</div>
                  </div>
                  <div>LV{{userLevel.nextLevel}}</div>
                </div>
                <div class="gold_coin">
                  <div class="left">
                    <div>
                      <img src="../assets/image/login/cheese.png" alt="">
                      <span class="num">{{hotNumFn(userInfo.userAcct.giftNum)}}</span>
                      <!-- <span>万</span> -->
                    </div>
                    <div>
                      <img src="../assets/image/login/gold.png" alt="">
                      <span class="num">{{hotNumFn(userInfo.userAcct.goldCoin)}}</span>
                      <!-- <span>万</span> -->
                    </div>
                  </div>
                  <div class="line"></div>
                  <div class="right">
                    <img src="../assets/image/login/recharge.png" @click="$store.commit('user/RECHARGE_SHOW', true);" alt="">
                  </div>
                </div>
              </div>
              <div class="bottom">
                <router-link to="/my/baseinfo" tag="div">
                  <div>
                    <img src="../assets/image/login/ico_personal.png" alt="">
                  </div>
                  <div>个人资料</div>
                </router-link>
                <router-link to="/my/message" tag="div">
                  <div>
                    <img src="../assets/image/login/ico_news.png" alt="">
                  </div>
                  <div>我的消息</div>
                </router-link>
                <router-link to="/my/task" tag="div">
                  <div>
                    <img src="../assets/image/login/ico_task.png" alt="">
                  </div>
                  <div>任务中心</div>
                </router-link>
                <div @click="applyClick()">
                  <div>
                    <img src="../assets/image/login/ico_recruit.png" alt="">
                  </div>
                  <div>{{token&&applyStep==2?'直播管理':'主播招募'}}</div>
                </div>
              </div>
          </div>
        </div>
        
      </div>
    </div>
    <Login></Login>
    <Recharge></Recharge>

  </div>
</template>

<script>
import Login from "@/components/Login";
import Recharge from "@/components/Recharge";
import { mapGetters } from 'vuex';
import { getToken } from '@/utils/auth'
export default {
  data(){
    return {
      dialogVisible: false,
      query: this.$route.query.kw,
      isMy: false,
      cmedalTitle: ['一掷千金勋章','王者加冕勋章','守护使者勋章'],
      cmedal: []
    }
  },
  components: {
    Login,
    Recharge
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'userLevel', 'applyStep'])
  },
  watch:{
    $route(to){
      if(to.path.indexOf("/my/")!=-1) {
        this.isMy = true
      }else {
        this.isMy = false
      }
      this.query = to.query.kw;
    },    
    'userInfo.cmedal'(val) {
      if(val) {
        this.cmedal = val.split(",")
      }      
    }
  },
  created() {
    if(this.$route.path.indexOf("/my/")!=-1) {
      this.isMy = true
    }
    document.addEventListener('visibilitychange',() => {
        var isHidden = document.hidden;
        if(!isHidden){
          if ( !getToken() && this.token) {
            this.$store.commit('user/SET_TOKEN', '');
            this.$store.commit('user/SET_USERINFO', {});
          }else if(getToken() && !this.token) {
            this.$store.commit('user/SET_TOKEN', getToken());
            this.$store.dispatch("user/getUserInfoAction");
            this.$store.dispatch("user/getUserLevel");
            this.$store.dispatch("user/getAnchorState");
          }          
        }
    });
  },
  mounted() {
    if(this.token&&!this.userInfo.userId){
      this.$store.dispatch("user/getUserInfoAction");
      this.$store.dispatch("user/getUserLevel");
      this.$store.dispatch("user/getAnchorState");
    }
  },
  methods: {
    applyClick() {
      if(this.token) {
        if(this.applyStep==2){
          this.$router.push({path: '/my/liveset',query:{}})
        }else {
          this.$router.push({path: '/my/apply-anchor',query:{}})
        }        
      }else {
        // this.$store.commit('user/DIALOG_TAB', 1);
        this.$store.commit('user/DIALOG_SHOW', true);
      }
    },
    keydownFn(e) {
      if(e.keyCode == 13) {
        this.searchFn()
      }
    },
    searchFn() {
      if(this.query) {        
        this.$router.push({path: '/search',query:{kw: this.query}})
      }
    },
    click_login_fn() {
      // this.$store.commit('user/DIALOG_TAB', 4);
      this.$store.commit('user/DIALOG_SHOW', true);
    },
    logout() {
      this.$store.dispatch("user/logout");
    },
    hotNumFn(num) {
      if(num < 10000) {
        return num+" 个"
      }
      return (num/10000).toFixed(1)+" 万"
    }
  }
}
</script>

<style lang="scss" scoped>
.header_content {
  width: 1320px;
  height: 100%;
  color: #fff;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header_left{
    display: flex;
    .header_logo{
      margin: 10px 0;
    }
    .header_nav{
      display: flex;
      align-items: center;
      .router-link-active{
        color: #42edc4;
      }
      span{
        font-size: 18px;
        font-weight: 400px;
        line-height: 30px;
        margin-left: 55px;
        cursor: pointer;
      }
    }
  }
  .header_right{
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_search{
      /deep/ .el-input__inner{
        border-radius: 22px;
      }
      /deep/ .el-icon-search{
        cursor: pointer;
      }
    }
    .header_focus, .header_his{
      margin-left: 30px;
      line-height: 17px;
      cursor: pointer;
      img {
        height: 25px;
      }
    }
    .header_user{
      margin-left: 30px;
      position: relative;
      &>img {
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
      }
      &>div {
        display: none;
        width: 400px;
        height: 400px;
        position: absolute;
        top: 44px;
        right: -29px;
        z-index: 2;
      }
      &:hover {
        &>div {
          display: block;
        }
      }
      .click_face {
        width: 420px;
        height: 274px;
        background-image: url(../assets/image/login/login_bg.png);
        position: absolute;
        top: 10px;
        right: -24px;
        z-index: 1;
        text-align: center;
        img {
          margin-top: 203px;
          cursor: pointer;
        }
      }
      .userInfo {
        width: 350px;
        height: 360px;
        border-radius: 10px;
        color: #111;
        font-size: 16px;
        box-shadow: 10px 10px 10px rgba(0,0,0,0.3);
        background-color: #fff;
        position: absolute;
        top: 23px;
        right: -1px;
        z-index: 1;
        &::before {
          content: '';
          width: 0px;
          height: 0px;
          border: 10px solid;
          border-color: #41e2bb #41e2bb transparent transparent;
          position: absolute;
          top: -9px;
          right: 44px;
          transform: rotateZ(-45deg) skew(-5deg, -5deg);
        }
        .top {
          height: 264px;
          border-radius: 10px 10px 0 0;
          background-color: #41e2bb;
          padding: 20px 15px;
          box-sizing: border-box;
          .logout {
            font-size: 18px;
            float: right;
            cursor: pointer;
            span {
              display: inline-block;
              margin-left: 8px;
            }
            img, span {
              vertical-align: middle;
            }
          }
          .usermsg {
            clear: both;
            display: flex;
            padding-top: 5px;
            padding-bottom: 20px;
            .name {
              max-width: 158px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size: 21px;
              font-weight: 600;
              margin-right: 9px;
            }
            .level {
              line-height: 27px;
              background: #57c797;
              border-radius: 5px;
              padding: 0 6px;
              color: #fff;
              font-size: 14px;
              font-weight: bold;
              span {
                display: inline-block;
                margin-left: 3px;
              }
              img, span {
                vertical-align: middle;
                opacity: 0.9;
              }
            }
            .cmedal {
              img {
                margin: 2px 0px 2px 5px;
                vertical-align: middle;
              }
            }
          }
          .progress_outer {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            margin-bottom: 15px;
            .progress {
              width: 220px;
              height: 14px;
              font-size: 16px;
              line-height: 16px;
              background: #ffffff;
              border-radius: 7px;
              margin-top: 3.5px;
              text-align: center;
              .bar {
                width: 50%;
                height: 14px;
                background: #15C6F9;
                border-radius: 7px;
              }
              .text {
                position: relative;
                top: -14px;
              }
            }
          }
          .gold_coin {
            background: #fff;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            padding: 16px 30px;
            .left {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              font-weight: 600;
              font-size: 20px;
              padding: 7px 0;
              &>div {
                line-height: 26px;
                img, span {
                  display: inline-block;
                  vertical-align: middle;
                }
                .num {
                  font-size: 25px;
                  padding: 0 8px 0 13px;
                }
              }
            }
            .line {
              width: 1px;
              height: 36px;
              background: #999999;
              margin-top: 22px;
            }
            .right {
              cursor: pointer;
            }
          }
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          text-align: center;
          padding: 15px;
          font-weight: bold;
          &>div {
            cursor: pointer;
            img {
              margin-bottom: 3px;
            }
          }
        }
      }
    }
  }
}

.header {
  width: 100%;
  height: 70px;
  color: #fff;
}

@media screen and (max-width: 1500px) {
  .header_content {
    width: 1120px;
  }
}
</style>