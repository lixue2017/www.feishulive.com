<template>
  <div class="content">
    <div class="recommend">
      <div class="title">{{recommendList[recommendType]}}</div>
      <MyBox :itemArr="recommend"></MyBox>
    </div>
  </div>
</template> 

<script>
import MyBox from "@/components/MyBox";
import { apiFocusLiveRoomList } from "@/api/user"
import { apiLiveRoomMore } from "@/api/home"
export default {
  name: "More",
  components: {
    MyBox
  },
  data() {
    return {
      recommendType: 6,
      recommend: [],
      recommendList: { 
        2: "颜值",
        3: "今日推荐",
        6: "热门推荐"
      }
    };
  },
  watch:{
    $route(to){
      this.setRecommendType(to.path);
      this.getLiveRoomMore();
    }
  },
  created() {
    this.setRecommendType(this.$route.path);
  },
  mounted() {
    this.getLiveRoomMore();
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
    setRecommendType(path) {
      if(path.indexOf('dayrecommend') != -1) {
        this.recommendType = 3
      }else if(path.indexOf('appearance') != -1) {
        this.recommendType = 2
      }else {
        this.recommendType = 6
      }
    },
    // 推荐列表
    getLiveRoomMore() {
      return new Promise((resolve, reject) => {
        let params = {
          column: this.recommendType,
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
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  padding: 20px 20px 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    font-size: 30px;
    color: #111111;
    margin-bottom: 11px;
    margin-top: 15px;
  }
  .recommend {
    margin-bottom: 50px;
    .title { 
      margin-top: 35px;
    }
  }
}

</style>