<template>
  <div class="box">
    <el-row :gutter="25" v-if="itemArr.length>0">
      <el-col :class="'box_col'" :xs="6" :sm="6" :md="6" :lg="6" :xl="xl" v-for="(item) in itemArr" :key="item.roomId">
        <a :href="'#/live/detail/'+item.roomId" target="_blank" :class="item.is_hover?'nav_a is_hover':'nav_a'" @mouseenter="boxHover($event,item)" @mouseleave="boxLeave(item)">
          <div class="img_out">
            <div class="video_img">
              <div class="clite" v-if="item.domainName">
                <p>{{item.domainName}}</p>
              </div>
              <div>
                <img :src="require('@/assets/image/default_cover.png')" v-real-img="item.imgUrl" alt  v-if="!item.is_hover"/>
                <!-- <div :id="'video-container'+item.roomId" class="video" v-else></div> -->
                <video :src="item.pullUrl" :poster="item.imgUrl?item.imgUrl:require('../assets/image/default_cover.png')" autoplay muted width="100%" height="100%" loop v-else></video>
              </div>
            </div>
          </div>
          <div class="title_text">
            <p class="title_a">{{item.roomTitle}}</p>
            <div class="rou_a">
              <div class="left">
                <img :src="require('@/assets/image/default_icon.png')" v-real-img="item.headImg" alt />
                <p class="title_b">{{item.roomName}}</p>
              </div>
              <div class="right">
                <img src="../assets/image/icon_hot.png" alt="">
                <p>{{hotNumFn(item.hotNum)}}</p>
              </div>
            </div>
          </div>
          <div class="zhiboing" v-if="item.state"><i class="el-icon-video-play"></i> 直播中</div>
        </a>
      </el-col>
    </el-row>
    <div class="nodata" v-else-if="text">
      <div>
        <img src="../assets/image/live/nodata.png" alt="">
      </div>
      <div class="login_btn" @click="login" v-if="noLogin&&!noLogin.token">
        立即登录
      </div>
      <div class="text">
        {{noLogin&&!noLogin.token?noLogin.text:text}}
      </div>
    </div>
  </div>
</template>

<script>
  let box_x, box_y = 0
  // import tweblive_mixin from '@/utils/mixins/tweblive_simple'
  // import { mapState, mapGetters } from 'vuex'
  export default {
    // mixins: [tweblive_mixin],
    props: {
      itemArr: {
        type: Array,
        default: () => []
      },
      text: {
        type: String,
        default: ''
      },
      noLogin: {
        type: Object,
        default: () => {}
      },
      xl: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        x: 0,
        y: 0,
        domID: "",
        muted: true,
        roomInfo: {}
      }
    },
    // computed: {
    //   ...mapState('chat',['sdkAppID'])
    // },
    mounted() {
      let that = this
      // this.$nextTick(function() {
        document.getElementById("app").onmousemove = (e) => {
          box_x = e.clientX+document.documentElement.scrollLeft
          box_y = e.clientY+document.documentElement.scrollTop
        }
        document.onmouseleave = function(){
          box_x = 0
          box_y = 0
        }
      // })
    },
    methods: {
      hotNumFn(num) {
        if(num < 10000) {
          return num
        }
        return (num/10000).toFixed(1)+"万"
      },
      login() {
        this.$store.commit('user/DIALOG_SHOW', true);
      },
      boxHover(e, item) {
        if(item.is_hover) return
        if(e.preventDefault){
          e.preventDefault();
        }else{
          window.event.returnValue == false;
        }
        this.itemArr.filter(val => val.is_hover||val.timer).map((val)=>{
          if(item.timer) {
            clearTimeout(item.timer)
            item.timer = 0
          }
          val.is_hover = 0
        })
        let that = this;
        item.timer = setTimeout(function() {
          item.timer = 0;
          let divx1 = that.pageX(e.target);
          let divy1 = that.pageY(e.target);
          let divx2 = divx1 + e.target.offsetWidth;
          let divy2 = divy1 + e.target.offsetHeight;
          if(box_x <= divx2 && box_x >= divx1 && box_y <= divy2 && box_y >= divy1) {
            item.is_hover = 1
            setTimeout(function() {
              if(!box_x) {
                item.is_hover = 0
              }
            },200)
            // that.roomInfo = item
            // that.domID = "video-container"+item.roomId
          }else {
            item.is_hover = 0
            // that.domID = ""
          }
        },100)
      },
      boxLeave(item) {
        item.is_hover=0
        if(item.timer) {
          clearTimeout(item.timer)
          item.timer = 0
        }
      },
      pageX(elem){//获取元素相对于这个页面的y坐标。
        return elem.offsetParent?(elem.offsetLeft+this.pageX(elem.offsetParent)):elem.offsetLeft;
      },
      pageY(elem){//获取元素相对于这个页面的y坐标。
        return elem.offsetParent?(elem.offsetTop+this.pageY(elem.offsetParent)):elem.offsetTop;
      }
    }
  }
</script>

<style lang="scss" scoped>
.box {
  // .box_col:hover {
  //   .nav_a {
  //     display: none;
  //     &.is_hover {
  //       display: block;
  //     }
  //   }
  // }
  .nav_a {
    width: 100%;
    margin-top: 20px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    display: block;
    position: relative;
    
    &:not(:last-child) {
      margin-right: 24px;
    }
    &.is_hover {
      transform: scale(1.05);
      // box-shadow: 0px 27px 137px 0px rgba(0,0,0,0.2);
      box-shadow: 2px 3px 4px 2px rgba(0,0,0,0.22); 
      // display: none;
    }
    .img_out {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      padding-bottom: 56.25%;
      .video_img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #ddd;

        .clite {
          font-size: 14px;
          position: absolute;
          top: 9px;
          left: 9px;
          width: 80px;
          height: 28px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          text-align: center;
          line-height: 28px;
          color: #fff;
          z-index: 1;
        }

        img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }

    .title_text {
      height: 70px;
      background: #fff;
      padding: 11px 15px 0 15px;

      .title_a {
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
        font-weight: 600;
        text-align: left;
        color: #111111;
      }

      .rou_a {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        color: #999;
        font-size: 16px;
        line-height: 28px;

        .left {
          height: 28px;
          display: flex;
          align-items: center;

          img {
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-right: 4px;
          }

          p {
            line-height: 20px;
          }
        }

        .right {
          display: flex;
          align-items: center;
          white-space: nowrap;
          img {
            margin-right: 5px;
            margin-top: -2px;
          }
          p {
            font-size: 16px;
            font-weight: 600;
            color: #999999;
          }
        }
      }
    }

    .zhiboing {
      width: 80px;
      height: 28px;
      position: absolute;
      background: linear-gradient(#02cd9c 1%, #35d8b1 99%);
      border-radius: 4px;
      font-size: 14px;
      top: 9px;
      right: 9px;
      text-align: center;
      line-height: 28px;
      color: #fff;
      z-index: 1;
      i {
        font-size: 21px;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
  }
  .nodata {
    text-align: center;
    padding: 28px 0;
    .login_btn {
      width: 102px;
      height: 42px;
      line-height: 42px;
      font-size: 18px;
      color: #fff;
      background: #10d2a4;
      border-radius: 6px;
      margin: 24px auto 0;
      text-align: center;
      cursor: pointer;
    }
    .text {
      font-size: 20px;
      font-weight: 600;
      color: #999999;
      margin-top: 24px;
    }
  }
}

</style>