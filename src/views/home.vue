<template>
  <div class="home" :style="ad_bg?'background-image: url('+ad_bg+');':'background-image: url('+require('../assets/image/home/bg.png')+');'">
    <!-- 内容区域 -->
    <div class="content">
      <div class="conten_header" v-if="recommend.rotationList">
        <div class="video_left">
          <div class="top">
            <div class="roomDetail">
              <div class="roomDetail-left">
                <img :src="currRotationList.headImg" alt="">
              </div>
              <div class="roomDetail-right">
                <div>{{currRotationList.roomName}}</div>
                <div>{{currRotationList.typeName}}-大神推荐</div>
              </div>
            </div>
            <div class="roomTitle">{{currRotationList.roomTitle}}</div>
          </div>
          <div class="bottom">
            <div class="title" v-if="currRotationList.introduce">主播个人介绍</div>
            <div class="detail">{{currRotationList.introduce}}</div>
            <div class="title" v-if="currRotationList.gongGao">直播间公告</div>
            <div class="detail">{{currRotationList.gongGao}}</div>
          </div>
        </div>
        <div id="video-container" class="video"></div>
        <div class="video_right">
          <div :class="onAdvert==index?'active':''" :title="item.title" v-for="(item,index) in recommend.rotationList.slice(0,5)" :key="index" @click="onAdvert=index;currRotationList=item">
            <img :src="item.imgUrl" alt="">
          </div>
        </div>
      </div>
      <div class="nav-actar" v-if="customAdList.adverturl">
        <a :href="customAdList.url?customAdList.url:''" target="_blank">
          <img :src="customAdList.adverturl" alt="">
        </a>        
      </div>
      <div class="nav_content" v-if="recommend.webHotList&&recommend.webHotList.length>0">
        <div class="title">
          <h1>热门推荐</h1>
          <!-- <div>
            <el-row>
              <el-button size="mini" round v-for="item in liveType" :key="item.id">{{item.name}}</el-button>
            </el-row>
          </div> -->
        </div>
        <router-link to="/live/recommend" tag="div" class="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <MyBox :itemArr="recommend.webHotList.slice(0,4)" :xl="6" v-if="recommend.webHotList"></MyBox>
     
      <!-- <div class="nav_content" v-if="recommend.marvellousList&&recommend.marvellousList.length>0">
        <div class="title">
          <h1>今日推荐</h1>
        </div>
        <router-link to="/live/dayrecommend" tag="div" class="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <MyBox :itemArr="recommend.marvellousList.slice(0,4)" :xl="6" v-if="recommend.marvellousList"></MyBox> -->

      <div class="nav_content" v-if="liveType&&liveType.length>0">
        <div class="title">
          <h1>{{liveType[currLiveType].name}}</h1>
          <div>
            <el-row>
              <template v-for="(item, index) in liveType" >
                <el-button size="mini" round :key="index" v-if="currLiveType!=index" @click="currLiveType=index;getLiveRoomMore(item.id)">{{item.name}}</el-button>
              </template>              
            </el-row>
          </div>
        </div>
        <router-link :to="'/live/'+liveType[currLiveType].id" tag="div" class="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <MyBox :itemArr="liveList" :xl="6"></MyBox>
      <div v-if="liveList.length==0">暂无数据</div>

      <div class="nav_content" v-if="recommend.appearanceList&&recommend.appearanceList.length>0">
        <div class="title">
          <h1>颜值</h1>
          <div>
            <!-- <el-row>
              <el-button size="mini" round>篮球</el-button>
              <el-button size="mini" round>足球</el-button>
              <el-button size="mini" round>娱乐</el-button>
            </el-row>-->
          </div>
        </div>
        <router-link to="/live/appearance" tag="div" class="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <MyBox :itemArr="recommend.appearanceList.slice(0,4)" :xl="6" v-if="recommend.appearanceList"></MyBox>
      
      <div class="nav_content" v-if="recommend.anchorHotList&&recommend.anchorHotList.length>0">
        <div class="title">
          <h1>主播排行榜</h1>
          <div>
            <!-- <el-row>
              <el-button size="mini" round>篮球</el-button>
              <el-button size="mini" round>足球</el-button>
              <el-button size="mini" round>娱乐</el-button>
            </el-row>-->
          </div>
        </div>
        <router-link to="/ranking" tag="div" class="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>

      <div class="nav_listz">
        <MyAnchorBox :itemArr="recommend.anchorHotList.slice(0,5)" v-if="recommend.anchorHotList"></MyAnchorBox>        
      </div>
    </div>
    <div class="fonter">
      <div class="font_top">
        <!-- <div class="font_p">
          <p class="title">友情链接</p>
          <p>懂球帝官网</p>
          <p>直播吧官网</p>
          <p>盈球体育官网</p>
        </div> -->

        <div class="font_p">
          <p class="title">联系方式</p>
          <p>客服QQ：2457568057</p>
          <p>运营微信：odoubleo</p>
          <p>商务合作电话：18820208646</p>
        </div>

        <div class="font_p">
          <p class="title">飞鼠产品下载</p>
          <div class="chanp">
            <div class="left">
              <img src="../assets/image/erma.png" alt />
              <p class="hubtitle">扫描下载飞鼠APP</p>
            </div>

            <div class="right">
              <a href="/#/download" target="_blank" class="right_a">
                <img src="../assets/image/home/ios.png" alt />
                <p>IPhone下载</p>
              </a> 
              <a href="/#/download" target="_blank" class="right_a">
                <img src="../assets/image/home/android.png" alt />
                <p>Android下载</p>
              </a>     
              <a href="/#/tool" target="_blank" class="right_a">
                <img src="../assets/image/home/zs.png" alt />
                <p>直播助手下载</p>
              </a>              
            </div>
          </div>
        </div>

        <div class="font_p">
          <p class="title">关注我们</p>
          <div class="chanp">
            <div class="left">
              <img src="../assets/image/erma.png" alt />
              <p class="hubtitle">扫码关注微信公众号</p>
            </div>

            <div class="right">
              <a href="https://weibo.com/p/1006067404888967" target="_blank" class="right_a">
                <img src="../assets/image/home/xl.png" alt />
                <p>新浪微博</p>
              </a>  
              <a href="https://mp.toutiao.com/profile_v4/index" target="_blank" class="right_a">
                <img src="../assets/image/home/tt.png" alt />
                <p>今日头条</p>
              </a>  
              <a href="https://v.douyin.com/JrxWvv4/" target="_blank" class="right_a">
                <img src="../assets/image/home/dy.png" alt />
                <p>抖音短视频</p>
              </a>  
            </div>
          </div>
        </div>
      </div>
      <div class="font_btn">
        <div class="top">
          <span>关于我们</span>
          <a href="/#/my/apply-anchor" target="_black">主播招募</a>
          <a href="/#/my/customer-service" target="_black">客服中心</a>
        </div>
        <div class="centent">
          <span>川网文【2020】1666-342号</span>
          <span>川 ICP备 150448428</span>
          <span>川公安网备 3547156488455号</span>
        </div>
        <div class="btn">
          <span>成都盈球吧体育文化传播有限公司版权所有 Copyrihgt 2020-2025</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyBox from "@/components/MyBox";
import MyAnchorBox from "@/components/MyAnchorBox";
import { apiLiveRecommend, apiLiveRoomMore } from "@/api/home"
import { apiUnfocusLiveRoom, apiFocusLiveRoom } from "@/api/user"
import { apiAdvertisement } from "@/api/ad"
import { apiChannelList } from '@/api/live'
import { mapState, mapGetters } from 'vuex'
import tweblive_mixin from '@/utils/mixins/tweblive_simple'
export default {
  name: "Home",
  mixins: [tweblive_mixin],
  components: {
    MyBox,
    MyAnchorBox
  },
  computed: {
    ...mapState('chat',['sdkAppID']),
    ...mapGetters(['token'])
  },
  watch: {
    token() {
      this.getRecommend();
    },
    // onAdvert(val) {
    //   this.tweblive_home.load(this.recommend.rotationList[val].pullUrl)
    //   if(this.tweblive_home._player.el.querySelector(".mask")) {
    //     this.tweblive_home._player.el.querySelector(".mask").remove()
    //   }
    // }
  },
  data() {
    return {
      ad_bg: '', // 背景图
      customAdList: {},
      recommend: {},
      currRotationList: {},
      onAdvert: null,
      liveType: [],
      currLiveType: 0,
      liveList: [],
      options: {
        flv: "",
        m3u8: '',
        autoplay: true,
        width: '100%',
        height: 'auto',
        poster: {style:'cover', src: ''},
        controls: 'none',
        pausePosterEnabled: false,
        wording: {
          1:'主播不在，先在直播间聊聊天吧~ ',
          2:'主播不在，先在直播间聊聊天吧~ ',
          4:'主播不在，先在直播间聊聊天吧~ ',
          13:'您观看的直播已结束',
          2032: '请求视频失败，请检查网络',
          2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
        }
      },
      domID: "video-container",
      controls: true
    };
  },
  created() {
    this.getRecommend();
    this.getChannelList();
    this.getAdvertisement(1);
    this.getAdvertisement(2);
  },
  methods: {
    getRecommend() {
      return new Promise((resolve, reject) => {
        apiLiveRecommend().then(data => {
          for(let key in data) {
            data[key].map(val=>{
              val.is_hover = 0
            })
          }
          this.recommend = data;            
          this.$nextTick(function() {
            if(this.recommend.rotationList.length>0) {
              if(this.recommend.rotationList.length<=5) {
                this.onAdvert = Math.floor(Math.random()*this.recommend.rotationList.length)
              }else {
                this.onAdvert = Math.floor(Math.random()*5)
              }
              this.currRotationList = data.rotationList[this.onAdvert]
            }            
          })  
          resolve();
        })
        .catch(error => {
          reject(error);
        });
      });
    },
    // 房间类型列表
    getChannelList() {
      return new Promise((resolve, reject) => {
        apiChannelList().then(data => {
            this.liveType = data.liveType;
            if(this.liveType[this.currLiveType]) {
              this.getLiveRoomMore(this.liveType[this.currLiveType].id)
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getLiveRoomMore(itype) {
      return new Promise((resolve, reject) => {
        let params = {
          pageNo: 1,
          pageSize: 4
        }
        if(itype) {
          params.itype = itype
        }
        apiLiveRoomMore(params).then(data => {
          data.map(key=>{
            key.is_hover = 0
          })
          this.liveList = data;
          resolve();
        })
        .catch(error => {
          this.loading = 0;
          reject(error);
        });
      });
    },
    // 获取广告图，与背景图
    getAdvertisement(type) {
      let param = {
        type: type
      }
      apiAdvertisement(param).then(data => {
        if(data.length>0) {
          if(type==1) {
            this.ad_bg = data[data.length-1].adverturl;            
          }else if(type==2) {
            this.customAdList = data[0]
          }
        }
      })
    },
    hotNumFn(num) {
      if(num < 10000) {
        return num
      }
      return (num/10000).toFixed(1)+"万"
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: #000;
  margin-right: 17px;  
}
.home {
  width: 100%;
  min-width: 1143px;
  margin-top: -70px;
  padding-top: 70px;  
  background-size: auto 584px;
  background-repeat: no-repeat;
  background-position-x: center;
  background-color: #f2f5f6;

  .header {
    width: 100%;
    height: 70px;

    .header_q {
      width: 1320px;
      height: 100%;
      margin: 0 auto;
      background-color: darkcyan;
    }
  }

  .content {
    width: 1320px;
    margin: 0 auto;
    position: relative;

    .conten_header {
      width: 100%;
      height: 514px;
      display: flex;
      justify-content: space-between;
      background-color: rgba(34, 34, 34, 0.59);
      border-radius: 10px;
      overflow: hidden;

      .video_left {
        width: 15.1%;
        font-size: 18px;
        color: #fff;
        font-family: PingFang SC Semibold, PingFang SC Semibold-Semibold;
        .top {
          width: 96%;
          margin: auto;
          border-bottom: 1px solid #ccc;
          padding: 10% 5.8% 10%;
          box-sizing: border-box;
          .roomDetail {
            display: flex;
            align-items: center;
            .roomDetail-left {
              width: 35.5%;
              padding-bottom: 35.5%;
              background: #ffffff;
              border-radius: 50%;
              margin-right: 10.5%;
              position: relative;
              img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .roomDetail-right {
              width: 54%;
              &>div {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:nth-child(2) {
                  font-size: 14px;
                  color: #42edc4;
                  margin-top: 8px;
                }
              }
            }
          }
          .roomTitle {
            margin-top: 9.2%;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .bottom {
          padding: 9.8% 7.9% 0;
          .detail {
            color: #ccc;
            font-size: 14px;
            margin: 9.8% 0;
          }
        }
      }

      .video {    
        width: 69.3%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
        /deep/ .vcp-player {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
          .vcp-fullscreen-toggle {
            margin-left: 10px;
          }
          .vcp-clarityswitcher {
            margin-left: 20px;
          }
          video {
            height: 100%;
          }
          &:hover .enter-outer {
            display:block;
          }
          .enter-outer {
            position: absolute;
            width: 100%;
            height: 80%;
            top: 0;
            left: 0;
            z-index: 1002;
            display: none;
            cursor: pointer;
            .enter {
              width: 216px;
              height: 60px;
              margin: auto;
              line-height: 60px;
              border: 2px solid #42EDC4;
              border-radius: 6px;
              color: #42EDC4;
              text-align: center;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              cursor: pointer;              
            }
            &:hover .enter {
              background: #42EDC4;
              color: #fff;
            }
          }
          .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.6);
            z-index: 1002;
            .autoPlayImg {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 252px;
              height: 178px;
              background: url('../assets/image/1_c8d3aa.png') no-repeat;
              border: 0 solid;
              border-radius: 3px;
              text-align: center;
              cursor: pointer;
            }
          }
        }
      }

      .video_right {
        width: 14.6%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-right: 0.5%;
        cursor: pointer;
        box-sizing: border-box;

        div {
          width: 100%;
          height: 19%;
          background: #000;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            opacity: 0.5;
          }
          &:hover,&.active {
            img {
              opacity: 1;
            }            
          }
        }
      }
    }

    .nav-actar {
      width: 100%;
      height: 120px;
      border-radius: 10px;
      overflow: hidden;
      margin: 40px 0 40px 0;
      img {
        display: block;
        width: 100%;
      }
    }

    .nav_content {
      width: 100%;
      display: flex;
      align-items: center;
      height: 94px;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;
      }

      .more {
        cursor: pointer;
        color: #111;
        font-size: 20px;
      }
    }

    .nav_list {
      width: 100%;
      display: flex;
      // justify-content: space-between;

      .nav_a {
        width: 312px;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 24px;
        }
        .video_img {
          width: 100%;
          height: 176px;
          background-color: #ddd;
          position: relative;

          .clite {
            position: absolute;
            top: 9px;
            left: 9px;
            width: 80px;
            height: 28px;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            text-align: center;
            line-height: 28px;
            color: #fff;
          }

          img {
            height: 176px;
          }
        }

        .title_text {
          height: 88px;
          background: #fff;
          padding: 17px 15px 0 15px;

          .title_a {
            font-size: 18px;
            font-weight: 600;
            text-align: left;
            color: #111111;
          }

          .rou_a {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
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
            }

            .right {
              p {
                font-size: 16px;
                font-weight: 600;
                color: #999999;
              }
            }
          }
        }
      }
    }

    .nav_listz {
      width: 100%;
      display: flex;
      justify-content: space-between;
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // transform: translateY(100%);
    }
  }

  .fonter {
    width: 100%;
    height: 473px;
    background: #fff;
    margin-top: 47px;
    padding-top: 40px;

    .font_top {
      width: 1320px;
      margin: 0 auto;
      height: 260px;
      display: flex;
      justify-content: space-between;

      .font_p {
        display: flex;
        flex-direction: column;

        p {
          font-size: 16px;
          font-weight: 400;
          color: #333333;
          line-height: 41px;

          &.title {
            font-weight: 600;
            font-size: 18px;
          }
        }

        .chanp {
          display: flex;

          .left {
            width: 140px;
            display: flex;
            flex-direction: column;

            img {
              display: inline-block;
              width: 110px;
              height: 110px;
            }

            .hubtitle {
              font-size: 14px;
            }
          }

          .right {
            height: 110px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-top: -8px;

            .right_a {
              display: flex;
              align-items: center;

              img {
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }

    .font_btn {
      width: 100%;
      border-top: 1px solid #ccc;
      height: 211px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;

      span, a {
        display: inline-block;
        font-size: 14px;
        color: #333;
        text-decoration: none;
      }

      .top {
        width: 277px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 45px;
        margin-bottom: 20px;
      }

      .centent {
        width: 596px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
    }
  }
}

@media screen and (min-width: 1700px) {
  .home {
    background-size: 100% 584px;
  }
}
@media screen and (max-width: 1500px) {
  .home {
    background-size: auto 508px;
    .content {
      width: 1120px;
      .conten_header {
        height: 438px;
        .video {}
      }
      .nav-actar {
        height: 102px;        
      }
    }
    .fonter {
      .font_top {
        width: 1120px;
      }
    }
  }
}
</style>
