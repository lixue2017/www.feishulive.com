<template>
  <BackFramework :is_shrink="is_shrink">
    <template v-slot:aside>
      <div class="nologin" v-if="!is_shrink&&!token">
        <div class="nologin-title">登录飞鼠，签到免费拿金币</div>
        <div class="nologin-btn">
          <el-button type="info" size="medium" @click="click_login_fn(1)">注册</el-button>
          <el-button type="primary" size="medium" @click="click_login_fn(4)">登录</el-button>
        </div>
      </div>
      <div class="my_subscribe is_shrink shrink_nologin" v-if="is_shrink&&!token" @click="click_login_fn(4)">
        <img src="../../assets/image/nologin.png" />
        <span>登录</span>
      </div>
      <router-link to="/my/subscribe" :class="is_shrink?'my_subscribe is_shrink':'my_subscribe'" tag="div" v-if="token">
        <img src="../../assets/image/my_subscribe.png" />
        <span>我的订阅</span>
      </router-link>
      <router-link to="/live/all" :class="is_shrink?'my_subscribe is_shrink':'my_subscribe'" @click.native="identical = !identical" tag="div">
        <img src="../../assets/image/all_live.png" />
        <span>全部直播</span>
      </router-link>
      <div class="channel_classify">
        <div :class="is_shrink?'channel_classify_title is_shrink':'channel_classify_title'" @click="is_shrink=false">
          <img src="../../assets/image/channel_classify.png" />
          <span>频道分类</span>
        </div>
        <div class="channel_classify_list" v-if="!is_shrink">
          <router-link :to="'/live/type_'+item.id"  v-for="item in liveType" :key="item.id" tag="div" @click.native="identical = !identical">
            {{item.name}}
          </router-link>
          <!-- <div  v-for="item in liveType" :class="type_==item.id?'router-link-exact-active router-link-active':''" :key="item.id" @click="haddleClick('type_',item.id)">
            {{item.name}}
          </div> -->
        </div>
      </div>
      <div class="field_exclusive">
        <div :class="is_shrink?'field_exclusive_title is_shrink':'field_exclusive_title'" @click="is_shrink=false">
          <img src="../../assets/image/field_exclusive.png" />
          <span>领域专属</span>
        </div>
        <div class="field_exclusive_list" v-if="!is_shrink">
          <!-- <div  v-for="item in liveDomain" :class="domain_==item.id?'router-link-exact-active router-link-active':''" :key="item.id" @click="haddleClick('domain_',item.id)">
            {{item.name}}
          </div> -->
          <router-link :to="'/live/domain_'+item.id"  v-for="item in liveDomain" :key="item.id" tag="div" @click.native="identical = !identical">
            {{item.name}}
          </router-link>
        </div>
      </div>
      <div class="aside_bottom" v-show="!is_shrink">
        <el-button round size="medium" @click="toAPPDownload()">飞鼠APP</el-button>
        <el-button round size="medium" @click="applyClick()">{{token&&applyStep==2?'直播管理':'主播招募'}}</el-button>
      </div>
      <div :class="is_shrink?'shrink_btn is_shrink':'shrink_btn'" @click="is_shrink=!is_shrink"></div>
    </template>
    <template v-slot:content="oData">
      <router-view :liveDomain="liveDomain" :identical="identical" :isScrollbottom="oData.isScrollbottom"/>
    </template>
  </BackFramework>
</template>

<script>
import { apiChannelList } from '@/api/live'
import BackFramework from "@/components/BackFramework";
import { mapGetters } from 'vuex';
export default {
  components: {
    BackFramework
  },
  data() {
    return {
      liveType: [],
      liveDomain: [],
      is_shrink: false,
      identical: false
    }
  },
  computed: {
    ...mapGetters(['token', 'applyStep'])
  },
  mounted() {
    this.getChannelList();
  },
  methods: {
    click_login_fn(type) {
      this.$store.commit('user/DIALOG_TAB', type);
      this.$store.commit('user/DIALOG_SHOW', true);
    },
    applyClick() {
      if(this.token) {
        if(this.applyStep==2) {
          this.$router.push({path: '/my/liveset',query:{}})
        } else {
          this.$router.push({path: '/my/apply-anchor',query:{}})
        }
        
      }else {
        this.$store.commit('user/DIALOG_TAB', 4);
        this.$store.commit('user/DIALOG_SHOW', true);
      }
    },
    toAPPDownload() {
      this.$router.push({path: '/download',query:{}})
    },
    // 房间类型列表
    getChannelList() {
      return new Promise((resolve, reject) => {
        apiChannelList().then(data => {
            this.liveType = data.liveType;
            this.liveDomain = data.liveDomain;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #2f3035;
  .nologin {
    text-align: center;
    padding: 46px 0 36px;
    border-bottom: 1px solid #666;
    .nologin-title {
      font-size: 18px;
      color: #ccc;
      text-align: center;
    }
    .nologin-btn {
      margin-top: 24px;
      .el-button {
        width: 110px;
        font-size: 16px;
      }
    }
  }
  .shrink_nologin {
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
  }
  .my_subscribe,
  .channel_classify_title,
  .field_exclusive_title {
    &.is_shrink {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        margin-left: 0;
        margin-bottom: 17px;
      }
      span {
        margin-left: 0;
      }
    }
  }
  .my_subscribe,
  .all_live,
  .channel_classify {
    margin-top: 42px;
    cursor: pointer;
  }
  
  .field_exclusive {
    margin-top: 36px;
  }
  .my_subscribe,
  .all_live,
  .channel_classify,
  .field_exclusive {
    &.router-link-active.router-link-exact-active {
      color: #10D2A4;
    }
    img {
      margin-left: 16px;
      vertical-align: middle;
    }
    span {
      margin-left: 15px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .channel_classify_list,
  .field_exclusive_list {
    font-size: 16px;
    padding: 12px 14px 0;
    div {
      display: inline-block;
      color: #fff;
      width: 78px;
      height: 32px;
      line-height: 32px;
      background-color: #38393e;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 8px;
      cursor: pointer;
      &.router-link-exact-active.router-link-active{
        background-color: #10d2a4;
      }
    }
    :not(:nth-child(3n + 1)) {
      margin-left: 7px;
    }
  }
  .aside_bottom {
    margin-top: 65px;
    text-align: center;
    .el-button {
      background: #10d2a4;
      color: #fff;
      border: 0;
    }
  }
  .shrink_btn {
    position: absolute;
    width: 22px;
    height: 80px;
    background: #2F3035;
    top: 50%;
    transform: translateY(-50%);
    right: -11px;
    z-index: 1;
    border-radius: 11px;
    cursor: pointer;
    &:hover {
      background: #38393e;
    }
    &.is_shrink {
      &::before {
        transform: translateY(-50%) rotateZ(45deg) skew(-15deg, -15deg);
        left: 4px;
      }
    }
    &::before {
      content: '';
      width: 0;
      height: 0;
      border: 4px solid;
      border-color: #999 #999 transparent transparent;
      transform: translateY(-50%) rotateZ(-135deg) skew(-15deg, -15deg);
      position: absolute;
      left: 10px;
      top: 50%;
    }
  }
}
.live_top {
  display: flex;
  .left {
    box-sizing: border-box;
    width: 840px;
    height: 250px;
    background: #ffffff;
    border-radius: 10px;
    padding: 20px 20px 14px 20px;
    .title {
      font-size: 22px;
      font-weight: 600;
      color: #111111;
    }
    .content {
      margin-top: 17px;
      height: 178px;
      background: #cccccc;
      border-radius: 10px;
    }
  }
  .right {
    margin-left: 20px;
    box-sizing: border-box;
    width: 700px;
    height: 250px;
    background: #ffffff;
    border-radius: 10px;
    padding: 20px 20px 14px 20px;
    .title {
      font-size: 22px;
      font-weight: 600;
      color: #111111;
    }
    .content{
      .yugao_list{
        font-size: 16px;
        margin-top: 20px;
        .time{
          margin-left: 20px;
          color: #58b7f9;
          font-weight: 600;
        }
        .vs{
          margin-left: 30px;
          font-weight: 600;
          color: #111111;
        }
        .enter_live{
          float: right;
          .el-button{
            width: 125px;
            font-size: 16px;
            background-color: #36c2a0;
            color: #fff;
            border: 0;
          }
        }
      }
    }
  }
}
.live_list{
  margin-top: 50px;
  .title{
    display: flex;
    .text{
      line-height: 30px;
      color: #111111;
      font-weight: 400;
      font-size: 30px;
    }
    .select{
      margin-left: 50px;
      display: inline-block;
      line-height: 30px;
    }
  }
  .content{
    .item{
      box-sizing: border-box;
      margin-top: 20px;
      display: inline-block;
      background: #FFFFFF;
      width: 378px;
      height: 268px;
      border-radius: 10px;
      img{
        width: 100%;
        height: 210px;
      }
      .title{
        color: #111111;
        font-weight: 600;
        font-size: 18px;
        margin-left: 20px;
      }
      .bottom{
        margin-left: 20px;
        margin-right: 20px;
        .game_name{
          display: inline-block;
          color: #999999;
          font-weight: 600;
          font-size: 16px;
        }
        .play_count{
          display: block;
          float: right;
        }
      }

    }
    .item:not(:nth-child(4n + 1)) {
      margin-left: 10px;
    }
  }
}
</style>