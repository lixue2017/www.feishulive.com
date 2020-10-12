<template>
  <div class="live_list">
    <div class="title">
      <span class="text">热门推荐</span>
    </div>
    <div class="content">
      <MyBox :itemArr="list" :text="'暂无数据~'"></MyBox>
    </div>
    <div class="loading" v-if="this.loading||this.pageState==2">{{this.loading?'数据加载中~':'数据加载完'}}</div>
  </div>
</template>

<script>
import { apiLiveRoomMore } from "@/api/home"
import MyBox from "@/components/MyBox";
export default {
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
    MyBox
  },
  data() {
    return {
      list: [],
      loading: 0,
      pageState: 0, //0为数据未加载完，1为暂无数据，2数据加载完
      pageNo: 0,
      pageSize: 24,
      column: 6
    }
  },
  watch:{
    'isScrollbottom'(newValue) {
      this.getLiveRoomMore();
    }
  },
  mounted() {
    this.getLiveRoomMore();
  },
  methods: {
    getLiveRoomMore() {
      if(this.loading||this.pageState) {
        return
      }
      this.loading = 1;
      this.pageNo++;
      return new Promise((resolve, reject) => {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          column: this.column
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .live_list{
    margin-top: 30px;
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