<template>
  <div class="anchor_box">
    <a class="nav_a" :href="'#/live/detail/'+item.roomId" target="_blank" v-for="(item, index) in itemArr" :key="item.roomId">
      <div class="video_img">
        <img :src="require('@/assets/image/default_anchor.png')" v-real-img="item.cpicurl" alt="">
      </div>
      <div class="title_text">
        <div class="rou_a">
          <div class="left">
            <img :src="require('@/assets/image/default_icon.png')" v-real-img="item.headImg" class="circle" alt="">
            <span class="title_b">{{item.roomName}}</span>
          </div>
          <div class="right" @click="follow($event, item, index)">
            <img src="../assets/image/home/dl.png" alt v-if="!item.followState"/>
            <img src="../assets/image/home/ydl.png" alt v-else/>
          </div>
        </div>
      </div>
    </a>
    <!-- <div class="nav_a" v-for="(item, index) in itemArr" :key="item.roomId">
      
    </div> -->
  </div>
</template>

<script>
import { apiUnfocusLiveRoom, apiFocusLiveRoom } from "@/api/user"
export default {
  props: {
    itemArr: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    follow(e, item, index) {
      if(e.preventDefault){
        e.preventDefault();
      }else{
        window.event.returnValue == false;
      }
      if(!this.$store.state.user.token) {
        this.$store.commit('user/DIALOG_SHOW', true);
        return
      }
      return new Promise((resolve, reject) => {
        let fn = [apiFocusLiveRoom, apiUnfocusLiveRoom][item.followState];
        let params = {
          roomId: item.roomId
        }
        fn(params).then(data => {
            this.itemArr[index].followState = item.followState?0:1;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.anchor_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .nav_a {
    display: block;
    width: 19%;
    border-radius: 10px;
    margin-bottom: 1.2%;
    overflow: hidden;
    cursor: pointer;
    &:not(:nth-child(5n)) {
      margin-right: 1.2%;
    }

    .video_img {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      padding-bottom: 100%;
      background-color: #ddd;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .clite {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
        height: 28px;
        opacity: 0.3;
        background: #000000;
        border-radius: 4px;
        text-align: center;
        line-height: 28px;
        color: #fff;
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
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .left {
          width: 100%;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;

          .circle {
            display: inline-block;
            width: 30px;
            min-width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          .title_b {
            font-size: 22px;
            font-weight: 600;
            color: #111111;
            margin-left: 14px;    
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>