<template>
  <div ref="live_left">
    <div class="live_top" :style="'padding-top:'+carouselH+'px'" v-if="rotationList.length>0">
      <el-carousel ref="carousel" direction="vertical" trigger="click" :autoplay="carouselPlay" @change="carouselChange">
        <el-carousel-item v-for="(item,index) in rotationList" :key="index">
          <a :href="item.url?item.url:'javaScript:void()'" target="_blank">
            <img :src="item.adverturl" alt="" width="100%" height="100%">
          </a>          
        </el-carousel-item>
      </el-carousel>
      <div class="ad_title_box">
        <div :class="rotationIndex==index?'active':''" @click="setActiveItem(index)" v-for="(item,index) in rotationList" :key="index">{{item.title}}</div>
      </div>
    </div>
    <div class="live_list">
      <div class="title">
        <span class="text">{{type=='all'?'全部直播':type=='type'&&categoryList[itype]?categoryList[itype].name:domainList[domain]?domainList[domain].name:''}}</span>
        <div class="select" v-if="type=='all'">
          <el-button round size="mini" v-for="item in liveDomain" :key="item.id" :class="domain==item.id?'active':''" @click="select(itype, item.id)">{{item.name}}</el-button>
        </div>
        <div class="select" v-if="type=='type'&&categoryList[itype]&&categoryList[itype].domainList.length>1">
          <el-button round size="mini" v-for="item in categoryList[itype].domainList" :key="item.id" :class="domain==item.id?'active':''" @click="select(itype, item.id)">{{item.name}}</el-button>
        </div>
        <div class="select" v-if="type=='domain'&&domainList[domain]&&domainList[domain].categoryList.length>1">
          <el-button round size="mini" v-for="item in domainList[domain].categoryList" :key="item.id" :class="itype==item.id?'active':''" @click="select(item.id, domain)">{{item.name}}</el-button>
          <!-- <el-button round size="mini" :class="itype==1?'active':''" @click="select(1,domain)">足球</el-button>
          <el-button round size="mini" :class="itype==2?'active':''" @click="select(2,domain)">篮球</el-button> -->
        </div>
      </div>
      <div class="content">
        <MyBox :itemArr="list" :text="'暂无数据~'"></MyBox>
      </div>
      <div class="loading" v-if="this.loading||this.pageState==2">{{this.loading?'数据加载中~':'数据加载完'}}</div>
    </div>
  </div>
</template>

<script>
import { apiLiveRoomMore, apiCategoryDoman } from "@/api/home"
import { apiAdvertisement } from "@/api/ad"
import MyBox from "@/components/MyBox";
export default {
  name: 'BaseInfo',
  props: {
    liveDomain: {
      type: Array,
      default: () => []
    },
    isScrollbottom: {
      type: Number,
      default: 0
    },
    identical: Boolean
  },
  components: {
    MyBox
  },
  data() {
    return {
      type: 'all',
      list: [],
      loading: 0,
      pageState: 0, //0为数据未加载完，1为暂无数据，2数据加载完
      pageNo: 0,
      pageSize: 24,
      itype: 0,
      column: 0,
      domain: 0,
      rotationList: [],
      rotationIndex: 0,
      carouselPlay: true,
      carouselH: 400,
      categoryList: {},
      domainList: {}
    }
  },
  watch:{
    $route(to){
      this.initialization()
    },
    identical() {
      this.initialization()
    },
    'isScrollbottom'(newValue) {
      this.getLiveRoomMore();
    }
  },
  mounted() {
    let id = this.$route.params.id;
    if(id) {
      let arr = id.split("_")
      if(arr[0]=="type") {
        this.type = "type"
        this.itype = parseInt(arr[1])
      }else if(arr[0]=="domain") {
        this.type = "domain"
        this.domain = parseInt(arr[1])
      }
    }
    let that = this
    window.onresize = function() {
      that.carouselH = that.$el.offsetWidth*0.25  
    }
    this.carouselH = this.$el.offsetWidth*0.25 
    this.getCategoryDoman();   
    this.getLiveRoomMore();
    this.getAdvertisement();
  },
  methods: {
    initialization() {
      this.itype = 0;
      this.column = 0;
      this.domain = 0;
      this.type = "all"
      let id = this.$route.params.id;
      if(id) {
        let arr = id.split("_")
        this.type = arr[0]
        if(arr[0]=="type") {
          this.itype = parseInt(arr[1])
        }else if(arr[0]=="domain") {
          this.domain = parseInt(arr[1])
        }
      }
      this.select(this.itype,this.domain)
    },
    select(itype, domain) {
      this.itype=itype;
      this.domain=domain;
      this.pageNo = 0;
      this.loading = 0;
      this.pageState = 0;
      this.list = [];
      this.getLiveRoomMore();
    },
    getLiveRoomMore() {
      if(this.loading||this.pageState) {
        return
      }
      this.loading = 1;
      this.pageNo++;
      return new Promise((resolve, reject) => {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        if(this.column) {
          params.column = this.column
        }
        if(this.itype) {
          params.itype = this.itype
        }
        if(this.domain) {
          params.doman = this.domain
        }
        apiLiveRoomMore(params).then(data => {
          if(this.loading) {
            data.map(key=>{
              key.is_hover = 0
            })
            this.list = this.list.concat(data);
            if(data.length<this.pageSize) {
              this.pageState = 2
            }
            if(data.length==0&&this.list.length==0) {
              this.pageState = 1
            }
            this.loading = 0;
          }
          resolve();
        })
        .catch(error => {
          this.loading = 0;
          reject(error);
        });
      });
    },
    // 获取分类与领域
    getCategoryDoman() {
      apiCategoryDoman().then((res)=>{
        res.map((category)=>{
          this.categoryList[category.id] = {
            name: category.name,
            domainList: category.domanList
          };
          category.domanList.map((domain)=>{
            if(this.domainList[domain.id]){
              if(this.domainList[domain.id].categoryList.filter(item => item.id === category.id).length==0) {
                this.domainList[domain.id].categoryList.push({
                  id: category.id,
                  name: category.name
                })
              }
            }else {
              this.domainList[domain.id] = {
                name: domain.name,
                categoryList: []
              };
              this.domainList[domain.id].categoryList.push({
                id: category.id,
                name: category.name
              })
            }
          })
        })
      })
    },
    // 获取轮播图
    getAdvertisement() {
      let param = {
        type: 0
      }
      apiAdvertisement(param).then(data => {
        this.rotationList = data
      })
    }, 
    carouselChange(index) {
      this.rotationIndex = index;
    },
    setActiveItem(index) {
      if(this.rotationIndex != index) {
        this.carouselPlay = false
        this.$refs.carousel.setActiveItem(index)
        let vue = this
        setTimeout(function() {
          vue.carouselPlay = true
        },3000)
      }      
    }
  }
}
</script>

<style lang="scss" scoped>
.live_top {
  display: flex;
  width: 100%;
  padding-top: 25%;
  background: #2a2a2a;
  position: relative;
  /deep/ .el-carousel {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .el-carousel__container {
      height: 100%;
    }
    .el-carousel__indicators--vertical {
      top: auto;
      transform: translateY(0);
      bottom: 14px;
      .el-carousel__indicator--vertical {
        padding: 14px 30px;
        .el-carousel__button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  .ad_title_box {
    width: 330px;
    overflow: hidden;
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    right: 50px;
    z-index: 1;
    background: rgba(0,0,0,.7);
    border-radius: 10px;
    div {
      line-height: 60px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      padding-left: 19px;
      cursor: pointer;
      &.active {
        color: #42EDC4;
        background: rgba(0,0,0,.6);
      }
    }
  }
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
  padding: 0 20px 0 40px;
  .title{
    display: flex;
    .text{
      line-height: 30px;
      color: #111111;
      font-weight: 400;
      font-size: 30px;
    }
    .select{
      margin-left: 40px;
      display: inline-block;
      line-height: 30px;
      button.active {
        background: #36c2a0;
        color: #fff;
      }
    }
  }
  .content {
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .loading {
    text-align: center;
    padding-bottom: 20px;
  }
}
</style>