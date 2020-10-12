<template>
  <el-dialog
    :visible.sync="rechargeStauts"
    width="540px"
    :appendToBody="true"
    @opened="createQrcode"
    :before-close="close"
    top="0"
    class="recharge-dialog"
  >
    <h1 class="recharge-title">充值</h1>
    <div class="recharge-content">
      <div class="count">充值数量</div>
      <div class="lists clearfix">
        <div
          class="list"
          v-for="(item,index) in countArr"
          :key="item.cexchangeid"
          @click="changeCount = index+1 "
          :class="changeCount == (index+1) ?'active-gold':''"
        >
          <p>
            <span>{{item.imoney}}</span>
            <img src="@/assets/image/gold.png" alt />
            <br />
            {{item.iexchangemoney}}元
          </p>
        </div>
      </div>
      <div class="count">充值方式</div>
      <div class="fa clearfix">
        <div
          class="fa-list"
          :class="changepay == (index+1)?'fa-active':''"
          @click="changepay = index+1"
          v-for="(item,index) in modeList"
          :key="item.iwayid"
        >
          <img :src="item.cimgurl" alt />
          <div class="fa-name">{{item.iway}}</div>
        </div>
      </div>
      <!-- <div class="center"><button @click="isPay = true" class="surePay">确定</button></div> -->
      <div class="pay center">
        手机扫码，支付
        <span class="red">{{total}}元</span>
      </div>
      <div class="qrcode_outer">
        <div id="qrcode" ref="qrcode"></div>
        <img
          :src="modeList[changepay-1].cimgurl"
          alt
          class="qrcode_logo"
          v-if="modeList[changepay-1]&&modeList[changepay-1].cimgurl"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import {
  apiExchangeList,
  apiCZModeList,
  apiPayLink,
  apiSearch
} from "@/api/user";
import QRCode from "qrcodejs2";
// import Stomp from 'stompjs'
export default {
  data() {
    return {
      countArr: [], //充值数量列表`
      changeCount: 1, //充值数量默认选中第一个
      changepay: 1, //充值方式默认选中第一个
      modeList: [], //充值方式
      qrcode: null,
      link: "", //二维码链接
      timer: null,
      nums: 0,
      total: 0
    };
  },
  computed: {
    ...mapGetters(["token", "rechargeStauts"])
  },
  watch: {
    changeCount(val, oldVal) {
      // 金币数量
      this.getPayLink(
        this.countArr[val - 1].iexchangemoney,
        this.modeList[this.changepay - 1].iwayid,
        this.countArr[val - 1].cexchangeid
      );
      this.total = this.countArr[val - 1].iexchangemoney;
    },
    changepay(val, oldVal) {
      // 支付方式
      this.getPayLink(
        this.countArr[this.changeCount - 1].iexchangemoney,
        this.modeList[val - 1].iwayid,
        this.countArr[this.changeCount - 1].cexchangeid
      );
    },
    token(val) {
      if (val) {
        this.getGoldList();
        this.modeRecharge();
      }
    },
    rechargeStauts() {
      if(this.timer) {
        clearInterval(this.timer);
      }      
    }
  },
  created() {
    if (this.token) {
      this.getGoldList();
      this.modeRecharge();
    }
  },
  methods: {
    getPayLink(count, payId, changeId, type) {
      // 获取支付二维码链接 生成二维码
      apiPayLink({ money: count, payWayId: payId, exchangeId: changeId }).then(
        res => {
          if (!res.result) return;
          this.link = res.result.urlCode;
          this.$refs.qrcode.innerHtml = "";
          if (this.qrcode) {
            this.qrcode.clear();
            this.qrcode.makeCode(this.link);
          } else {
            this.qrcode = new QRCode("qrcode", {
              width: 132,
              height: 132,
              text: this.link, //二维码链接
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });
          }

          if (type != 1) {
            // if (payId == 7) {
              this.getSearch(res.result.orderId);
            // } else if (payId == 8) {
            //   this.getSearch(1, res.result.orderId);
            // }
          }
        }
      );
    },
    createQrcode() {
      // 创建支付二维码
      this.getPayLink(
        this.countArr[0].iexchangemoney,
        this.modeList[0].iwayid,
        this.countArr[0].cexchangeid
      );
    },
    getSearch(ids) {
      // 查询微信支付订单
      var _this = this;
      clearInterval(_this.timer);
      _this.timer = setInterval(() => {
        apiSearch({ itype: _this.modeList[_this.changepay - 1].cbankid, orderId: ids }).then(res => {
          //itype=1 支付宝  itype=2 微信   
          if (res.tradeState == "NOTPAY"||res.tradeState == "TRADE_CLOSED"||res.tradeState == "NOT_SCAN") {
            // 未支付状态  刷新二维码
            _this.getPayLink(
              _this.countArr[_this.changeCount - 1].iexchangemoney,
              _this.modeList[_this.changepay - 1].iwayid,
              _this.countArr[_this.changeCount - 1].cexchangeid,
              1
            );
          } else {
            if(res.tradeState == "WAIT_BUYER_PAY") {
              return
            }
            _this.nums++;
            if (_this.nums > 3) {
              // 循环超过3次退出
              _this.nums = 0;
              clearInterval(_this.timer);
              _this.changeCount = 1; //充值数量默认选中第一个
              _this.changepay = 1; //充值方式默认选中第一个
              _this.$store.commit("user/RECHARGE_SHOW", false); // 关闭充值弹框
              _this.$message.error("充值失败");
            } else {
              if (res.tradeState == "") {
                //签名失败
                _this.nums = 0;
                clearInterval(_this.timer);
                _this.changeCount = 1; //充值数量默认选中第一个
                _this.changepay = 1; //充值方式默认选中第一个
                _this.$store.commit("user/RECHARGE_SHOW", false); // 关闭充值弹框
                _this.$message.error("充值失败");
              } else if (res.tradeState == "SUCCESS"||res.tradeState == "TRADE_SUCCESS"||res.tradeState == "TRADE_FINISHED") {
                _this.nums = 0;
                clearInterval(_this.timer);
                _this.changeCount = 1; //充值数量默认选中第一个
                _this.changepay = 1; //充值方式默认选中第一个
                _this.$store.commit("user/RECHARGE_SHOW", false); // 关闭充值弹框
                this.$confirm("", "提示", {
                  confirmButtonText: "充值完成",
                  cancelButtonText: "遇到问题",
                  customClass: "confirm-tip",
                  center: true,
                  showClose: false,
                  cancelButtonClass: "cancelBtn",
                  confirmButtonClass: "confirmBtn"
                })
                  .then(() => {
                    this.$store.dispatch("user/getUserInfoAction");
                  })
                  .catch(() => {
                    this.$router.push({ path: "/my", query: {} });
                  });
                // _this.$message.success('充值成功')
              }
            }
          }
        });
      }, 30000);
    },
    getGoldList() {
      //获取充值数量列表
      apiExchangeList({ IRHZ: 1, osName: "h5" }).then(res => {
        this.countArr = res;
        this.total = res[0].iexchangemoney;
      });
    },
    close() {
      // 关闭充值弹框
      this.$store.commit("user/RECHARGE_SHOW", false);
      this.nums = 0;
      clearInterval(this.timer);
      this.changeCount = 1; //充值数量默认选中第一个
      this.changepay = 1; //充值方式默认选中第一个
    },
    modeRecharge() {
      //获取充值方式
      apiCZModeList({ cfrom: "h5" }).then(res => {
        this.modeList = res;
      });
    }
  }
};
</script>

<style lang="scss">
  .confirm-tip {
    width: 502px;
    .el-message-box__title {
      font-size: 30px;
      margin: 10px 0;
      color: #111
    }
    .el-message-box__content {
      display: none;
    }
    .el-message-box__btns {
      overflow: hidden;
      padding-top: 28px;
      padding-bottom: 20px;
      width: 346px;
      margin: auto;
      .cancelBtn, .confirmBtn {
        float: right;
        font-size: 22px;
        width: 140px;
        box-sizing: border-box;
      }
      .cancelBtn {
        color: #111;
      }
      .confirmBtn {
        margin-right: 64px;
        margin-left: 0;
      }
    }
    
  }
</style>

<style lang="scss" scoped>
.recharge-dialog {
  /deep/ .el-dialog__wrapper .el-dialog {
    padding: 0;
    top: 30%;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__headerbtn .el-dialog__close {
    font-size: 1.6em;
  }
  .recharge-title {
    font-size: 1.4em;
    font-weight: bold;
    color: #111;
    border-bottom: 1px solid #eee;
    text-align: center;
    padding-bottom: 12px;
    box-sizing: border-box;
  }
  .recharge-content {
    border-top: 1px solid #eee;
    .count {
      margin: 12px 0;
    }
  }
  .list {
    background: url("../assets/image/z3.png") no-repeat center center;
    background-size: cover;
    text-align: center;
    width: 117px;
    float: left;
    height: 105px;
    margin-right: 30px;
    margin-bottom: 15px;
    padding-top: 14px;
    box-sizing: border-box;
    cursor: pointer;
    img {
      margin-left: 6px;
      vertical-align: sub;
    }
    p {
      line-height: 37px;
    }
  }
  .list.active-gold {
    background: url("../assets/image/z4.png") no-repeat center center;
    background-size: cover;
  }
  .list:nth-child(3n + 3) {
    margin-right: 0;
  }
  .fa-list {
    background: url("../assets/image/z1.png") no-repeat center center;
    background-size: cover;
    display: flex;
    width: 200px;
    height: 64px;
    float: left;
    cursor: pointer;
    margin-right: 15px;
    img {
      width: 58px;
      height: 58px;
      margin: 3px;
    }
    .fa-name {
      flex: 1;
      text-align: center;
      line-height: 64px;
    }
  }
  .fa-list.fa-active {
    background: url("../assets/image/z2.png") no-repeat center center;
  }
  .clearfix:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
  }
  .surePay {
    width: 90px;
    height: 36px;
    border-radius: 9px;
    border: none;
    outline: none;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(#70f06e 0%, #4f88eb 100%);
  }
  .qrcode_outer {
    margin-top: 15px;
    position: relative;
    #qrcode {
      width: 132px;
      height: 132px;
      margin: auto;
      padding: 8px 12px 17px 13px;
      background-image: url("../assets/image/qr-boder.png");
      background-size: 100%;
      background-repeat: no-repeat;
      /deep/ img {
        box-shadow: 0px 9px 7px 0px rgba(4, 0, 0, 0.24);
      }
    }
    .qrcode_logo {
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 5px;
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }

  .center {
    text-align: center;
    margin-top: 12px;
    .red {
      color: red;
    }
  }
}
</style>