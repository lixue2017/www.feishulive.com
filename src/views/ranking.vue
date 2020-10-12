<template>
<div class="ranking_outer">
  <div class="ranking">
    <div>
      <div class="title">主播 日贡献榜</div>
      <div class="ranking_top">
        <div v-if="tableDataDay.length>1" class="sliver_outer">
          <div class="sliver">
            <img :src="tableDataDay[1].head" alt="">
            <div class="name">
              {{tableDataDay[1].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataDay[1].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataDay[1].roomId" class="btn" target="_black">进入直播间</a>
          <!-- <div class="btn">进入直播间</div> -->
        </div>
        <div v-if="tableDataDay.length>0" class="gold_outer">
          <div class="gold">
            <img :src="tableDataDay[0].head" alt="">
            <div class="name">
              {{tableDataDay[0].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataDay[0].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataDay[0].roomId" class="btn" target="_black">进入直播间</a>
        </div>
        <div v-if="tableDataDay.length>2" class="copper_outer">
          <div class="copper">
            <img :src="tableDataDay[2].head" alt="">
            <div class="name">
              {{tableDataDay[2].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataDay[2].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataDay[2].roomId" class="btn" target="_black">进入直播间</a>
        </div>
      </div>
      <div class="table">
        <template v-for="(item,index) in tableDataDay">
          <div class="col" :key="index" v-if="index>=3">
            <div class="td1">{{index+1}}</div>
            <div class="td2">
              <img :src="require('@/assets/image/default_icon.png')" v-real-img="item.head" alt="">
            </div>
            <div class="td3">{{item.nickname}}</div>
            <div class="td4">直播间贡献值：{{item.giftprice}}</div>
          </div>
        </template>
      </div>
    </div>
    <div>
      <div class="title">主播 周贡献榜</div>
      <div class="ranking_top">
        <div v-if="tableDataWeek.length>1" class="sliver_outer">
          <div class="sliver">
            <img :src="tableDataWeek[1].head" alt="">
            <div class="name">
              {{tableDataWeek[1].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataWeek[1].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataWeek[1].roomId" class="btn" target="_black">进入直播间</a>
        </div>
        <div v-if="tableDataWeek.length>0" class="gold_outer">
          <div class="gold">
            <img :src="tableDataWeek[0].head" alt="">
            <div class="name">
              {{tableDataWeek[0].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataWeek[0].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataWeek[0].roomId" class="btn" target="_black">进入直播间</a>
        </div>
        <div v-if="tableDataWeek.length>2" class="copper_outer">
          <div class="copper">
            <img :src="tableDataWeek[2].head" alt="">
            <div class="name">
              {{tableDataWeek[2].nickname}}
            </div>
          </div>
          <div class="giftprice">
            <span>直播间贡献值：</span>
            <span>{{tableDataWeek[2].giftprice}}</span>
          </div>
          <a :href="'/#/live/detail/'+tableDataWeek[2].roomId" class="btn" target="_black">进入直播间</a>
        </div>
      </div>
      <div class="table">
        <template v-for="(item,index) in tableDataWeek">
          <div class="col" :key="index" v-if="index>=3" @click="toLink(item.roomId)">
            <div class="td1">{{index+1}}</div>
            <div class="td2">
              <img :src="require('@/assets/image/default_icon.png')" v-real-img="item.head" alt="">
            </div>
            <div class="td3">{{item.nickname}}</div>
            <div class="td4">直播间贡献值：{{item.giftprice}}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
import { apiApplication } from "@/api/ranking"
export default {
  name: "Ranking",
  data() {
    return {
      tableDataDay: [],
      tableDataWeek: [],
      tableData: [
        {
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        },{
          "head": require("../assets/image/header1.png"),
          "nickname": "唯唯诺诺",
          "giftprice": "52020",
          "roomId": ""
        }
      ]
    }
  },
  created() {
    this.getApplication(1);
    this.getApplication(2);
  },
  methods: {
    getApplication(type) {
      return new Promise((resolve, reject) => {
        let params = {
          type: type,
          pageNo: 1,
          pageSize: 10
        }
        apiApplication(params).then(data => {
          if(type==1) {
            this.tableDataDay = data.array
          }else {
            this.tableDataWeek = data.array
          }
          // console.log(data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
      });
    },
    toLink(id) {
      window.open('/#/live/detail/'+id)
    }
  },
}
</script>

<style lang="scss" scoped>
.ranking_outer {  
  flex: 1;
  padding: 20px;
  background-color: #F2F5F6;
  .ranking {
    min-height: 100%;
    display: flex;
    width: 1320px;
    margin: auto;
    &>div {
      width: 49.2%;
      background: #fff;
      padding: 1.7% 1.9% 2.7%;
      box-sizing: border-box;
      &:first-child {
        margin-right: 1.5%;
      }
      .title {
        font-size: 24px;
        font-weight: 500;
        color: #111111;
      }
      .ranking_top {
        display: flex;
        justify-content: space-around;
        .sliver_outer, .copper_outer {
          width: 27.2%;
        }
        .gold_outer {
          width: 36.8%;
        }
        .sliver, .copper {
          width: 85.9%;
          padding-top: 110.5%;
          font-size: 16px;    
          margin: 36px auto 0;
          text-align: center;
          position: relative;
          background-position-x: center;
          background-size: 100% auto;
          background-repeat: no-repeat;
          img {
            position: absolute;
            top: 17.8%;
            left: 3%;
            width: 92.5%;
            height: 71.8%;
            border-radius: 50%;
            box-sizing: border-box;
          }
          .name {
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 17px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 98.2% 12.14% 0;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: -1.4%;
            z-index: 1;
            background-size: 100%;
            background-position-y: bottom;
            background-repeat: no-repeat;
          }
        }
        .sliver {
          background-image: url(../assets/image/live/border_silver.png);
          .name {
            color: #515151;
            background-image: url(../assets/image/live/bg_silver.png);
          }
        }
        .copper {
          background-image: url(../assets/image/live/border_copper.png);
          .name {
            color: #873102;
            background-image: url(../assets/image/live/bg_copper.png);
          }
        }
        .gold {
          width: 100%;
          padding-top: 104.5%;
          font-size: 18px;
          text-align: center;
          position: relative;    
          background-position-x: 57%;
          background-position-y: top;
          background-size: 79% auto;
          background-repeat: no-repeat;
          background-image: url(../assets/image/live/border_gold.png);
          img {
            position: absolute;
            top: 17.75%;
            left: 14.2%;
            width: 72.2%;
            height: 69%;
            border-radius: 50%;
            box-sizing: border-box;
          }
          .name {
            width: 100%;
            height: 100%;
            text-align: center;
            color: #6F5500;
            line-height: 19px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 79.5% 19.46% 0;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position-y: bottom;
            background-image: url(../assets/image/live/bg_gold.png);
          }
        }
        .giftprice {
          margin: 17px 0 19px;
          // min-width: 163px;
          text-align: center;
          span {
            &:nth-child(1) {
                font-size: 16px;
              color: #444444;
            }
            &:nth-child(2) {
              font-size: 18px;
              color: #111;
            }
          }
        }
        .btn {
          width: 106px;
          line-height: 32px;
          border: 1px solid #999999;
          border-radius: 17px;
          font-size: 16px;
          color: #999;
          text-align: center;
          margin: auto;
          display: block;
          cursor: pointer;
          &:hover {
            color: #10d2a4;
            border-color: #10d2a4;
          }
        }
      }
      .table {
        color: #111;
        margin-top: 24px;
        .col {
          display: flex;
          height: 72px;
          line-height: 72px;
          font-size: 18px;
          cursor: pointer;
          &:nth-child(2n-1) {
            background: #f6f6f6;
          }
          .td1 {
            width: 84px;
            text-align: center;
          }
          .td2 {
            width: 60px;
            text-align: center;
            img {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              vertical-align: middle;
              background-color: #eee;
            }
          }
          .td3 {
            padding: 0 11px;
            flex: 1;
          }
          .td4 {
            padding-right: 20px;
            width: 200px
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1500px) {
  .ranking_outer {
    .ranking {
      width: 1120px;
    }
  }
}
</style>