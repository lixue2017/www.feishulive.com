<template>
  <div class="download">
    <div class="content">
      <div class="left">
        <img src="../assets/image/app/phone.png" alt />
      </div>
      <div class="right">
        <div class="welcome">
          <img src="../assets/image/app/logo.png" alt />
          <img src="../assets/image/app/logo_title.png" alt />
        </div>
        <div class="words">
          足球、NBA、CBA
          <br />海量精彩赛事&emsp;&emsp;主播陪你一起看
          <br />在这里 每个人都在直播主场
          <br />立即扫码下载 看球聊天尽在飞鼠直播
        </div>
        <div class="qrcode_btn">
          <div class="btn">
            <a :href="live_ios">
              <img src="../assets/image/app/ios.png" alt width="350px" />
            </a>
            <a :href="live_az">
              <img src="../assets/image/app/android.png" alt width="350px" />
            </a>            
          </div>
          <div class="qrcode">
            <img src="../assets/image/app/qrcode.png" alt width="213px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiLiveVersion } from '@/api/app'
export default {
  name: "Download",
  data() {
    return {
      live_az: "",
      live_ios: ""
    }
  },
  mounted() {
    this.getLiveVersion()
  },
  methods: {
    getLiveVersion() {
      apiLiveVersion({apipkg: "live_az"}).then((res) => {
        this.live_az = res.downloadurl
      })
      apiLiveVersion({apipkg: "live_ios"}).then((res) => {
        this.live_ios = res.downloadurl
      })
    }
  },
};
</script>
<style  lang="scss" scoped>
.download {
    width: 100%;
    flex: 1;
    background: #f2f5f6;
  .content {
    margin: 90px auto 27px;
    width: 1320px;
    overflow: hidden;

    .left {
      width: 48%;
      height: 100%;
      float: left;

      img {
        width: 93%;
      }
    }

    .right {
      width: 48%;
      height: 100%;
      float: right;
      color: #111;

      .welcome {
        margin: 4% 0 10%;
        padding-left: 41px;
        img {
          vertical-align: middle;
          &:first-child {
            margin-right: 35px;
          }
        }
      }

      .words {
        font-size: 28px;
        line-height: 40px;
        letter-spacing: 2px;
        padding-left: 41px;
      }
      .qrcode_btn {
        width: 95%;
        display: flex;
        margin-top: 95px;
        justify-content: space-between;

        .btn {
          margin-right: 33px;
          img:first-child {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  .download {
    .content {
      width: 1120px;
      .right  {
        .welcome {
          img {
            &:first-child {
              width: 110px;
            }
            &:last-child {
              width: 240px;
            }
          }
        }
        .words {
          font-size: 26px;
        }
        .qrcode_btn {
          margin-top: 81px;
          .btn {
            img {
              width: 297px;
            }
          }
          .qrcode {
            img {
              width: 181px;
            }
          }
        }
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