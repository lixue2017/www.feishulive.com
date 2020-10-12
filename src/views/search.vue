<template>
  <div class="search">
    <div class="search_box">
      <el-input
          placeholder="输入想搜索的内容"
          v-model="query" @keydown.native="keydownFn($event)">
          <span slot="suffix" class="search_btn" @click="searchContent()">搜索</span>
        </el-input>
    </div>
    <div class="search_content" v-if="!nodata">
      <div class="tab">
        <div :class="!tab?'active':''" @click="tab=0">主播</div>
        <div :class="tab?'active':''" @click="tab=1">直播间</div>
      </div>
      <div class="search_result">
        <div class="search_num">
          共找到相关结果 <span>{{total}}</span> 个
        </div>
        <div class="title">相关直播</div>
        <div class="search_result_anchor" v-if="!tab">
          <MyAnchorBox :itemArr="anchorHotList"></MyAnchorBox>
          <!-- <div class="nav_a" v-for="(item, index) in anchorHotList" :key="item.roomId">
            <div class="video_img">
              <img :src="item.cpicurl" alt="">
            </div>
            <div class="title_text">
              <div class="rou_a">
                <div class="left">
                  <img :src="item.headImg" class="circle" alt="">
                  <span class="title_b">{{item.roomName}}</span>
                </div>
                <div class="right" @click="follow(item, index)">
                  <img src="../assets/image/home/dl.png" alt v-if="!item.followState"/>
                  <img src="../assets/image/home/ydl.png" alt v-else/>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="search_result_live" v-if="tab">
          <MyBox :itemArr="anchorHotList" :xl="6"></MyBox>
        </div>
      </div>
    </div>
    <div class="search_nodata" v-if="nodata">
      <div class="nodata">
        没搜索到相关内容
      </div>
      <div class="recommend">
        <div class="title">为你推荐</div>
        <MyBox :itemArr="recommend"></MyBox>
      </div>
    </div>
  </div>
</template>

<script>
import MyBox from "@/components/MyBox";
import MyAnchorBox from "@/components/MyAnchorBox";
import { apiLiveRoomMore } from "@/api/home"
import { apiSearch } from "@/api/search"
import { mapGetters } from 'vuex';
export default {
  name: "search",
  components: {
    MyBox,
    MyAnchorBox
  },
  data() {
    return {
      query: this.$route.query.kw,
      nodata: 0,
      recommend: [],
      tab: 1,
      total: 0,
      anchorHotList: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch:{
    $route(to){
      this.query = to.query.kw;
      this.anchorHotList = [];
      this.searchContent();
    },
    token(val) {
      this.searchContent()
    }
  },
  mounted() {
    this.searchContent()
  },
  methods: {
    keydownFn(e) {
      if(e.keyCode == 13) {
        this.searchContent()
      }
    },
    // 推荐列表
    getLiveRoomMore() {
      return new Promise((resolve, reject) => {
        let params = {
          column: 3,
          pageNo: 1
        }
        apiLiveRoomMore(params).then(data => {
            data.map(key=>{
              key.is_hover = 0
            })
            this.recommend = data;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 搜索
    searchContent() {
      this.$router.push({path: '/search',query:{kw: this.query}})
      this.$route.query.kw = this.query;
      // history.pushState("", "", "/search?kw="+this.query);
      return new Promise((resolve, reject) => {
        let params = {
          content: this.query,
          pageNo: 1
        }
        apiSearch(params).then(data => {
            this.nodata = 0;
            this.total = data.length;
            data.map(key=>{
              key.is_hover = 0
            })
            this.anchorHotList = data;
            if(data.length==0) {
              this.getLiveRoomMore();
              this.nodata = 1;
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
}
</script>
<style lang="scss">
  .search_box {
    input {
      border-radius: 20px;
    }
    .el-input__suffix {
      line-height: 40px;
      right: 0;
      padding: 0 20px;
      background: #42EDC4;
      border-radius: 0 20px 20px 0;
      color: #fff;
      cursor: pointer;
    }
  }
</style>
<style lang="scss" scoped>
.search {
  flex: 1;
  background: #F2F5F6;
  color: #111;
  overflow: auto;
  .title {
    font-size: 30px;
    margin-bottom: 32px;
    margin-top: 35px;
  }
  .search_box {
    width: 470px;
    height: 40px;
    padding-top: 150px;
    margin: 0 auto;
  }
  .search_content {
    overflow: hidden;
    padding-bottom: 50px;
    .tab {
      display: flex;
      justify-content: center;
      padding-top: 12px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      div {
        line-height: 40px;
        font-size: 16px;
        margin: 0 36px;
        border-bottom: 4px solid transparent;
        border-radius: 2px;
        &.active {
          color: #42EDC4;
          border-bottom-color: #42EDC4;
        }
      }
    }
    .search_result {
      width: 1350px;
      margin: 0 auto;
      padding-left: 20px;
      .search_num {
        padding-top: 13px;
        font-size: 12px;
        span {
          color: #42EDC4;
        }
      }
    }
  }
  .search_nodata {
    .nodata {
      font-size: 14px;
      color: #666666;
      text-align: center;
      padding: 107px 0;
    }
    .recommend {
      width: 1350px;
      margin: 0 auto;
      padding: 50px 0;
      .title { 
        margin-top: 35px;
      }
    }
  }
  
}
  
@media screen and (max-width: 1500px) {
  .search {
    .search_content {
      .search_result{
        width: 1081px;
      }
    }
    .search_nodata {
      .recommend {
        width: 1081px;
      }
    }
  }
}
</style>