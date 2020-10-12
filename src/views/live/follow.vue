<template>
  <div class="content">
    <div class="follow">
      <div class="title">{{!isfollow?'历史观看':'我的订阅'}}</div>
      <MyBox :itemArr="follow" :text="'暂无'+(!isfollow?'历史':'订阅')+'数据～'" :noLogin="{token,text:'未登录，无法获取'+(!isfollow?'历史':'订阅')+'数据～'}"></MyBox>
    </div>
    <div class="recommend">
      <div class="title">为你推荐</div>
      <MyBox :itemArr="recommend"></MyBox>
    </div>
  </div>
</template> 

<script>
import MyBox from "@/components/MyBox";
import { apiFocusLiveRoomList } from "@/api/user"
import { apiLiveRoomMore } from "@/api/home"
import { mapGetters } from 'vuex';
export default {
  components: {
    MyBox
  },
  data() {
    return {
      isfollow: this.$route.path.indexOf('history')==-1?1:0,
      follow: [],
      recommend: []
    };
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch:{
    $route(to){
      this.isfollow = to.path.indexOf('history')==-1?1:0
    },
    token(val) {
      if(val) {
        this.getFollowList();
      }else {
        this.follow = []
      }
    }
  },
  mounted() {
    if(this.token) {
      this.getFollowList();
    }    
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
    // 关注列表
    getFollowList() {
      return new Promise((resolve, reject) => {
        apiFocusLiveRoomList().then(data => {
            data.array.map(key=>{
              key.is_hover = 0
            })
            this.follow = data.array;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 推荐列表
    getLiveRoomMore(type) {
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