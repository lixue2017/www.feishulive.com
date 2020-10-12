<template>
  <el-dialog
    :visible.sync="rechargeStauts"
    width="500px"
    :appendToBody="true"
    @opened="createQrcode"
    :before-close="close"
    top="0"
    class="recharge-dialog"
  >
    <div slot="title" class="dialog-title">
      <span>余额不足</span>
      <span>（充值后请刷新页面）</span>
    </div>
    <div>
      <div class="left-title">快速扫码充值</div>
      <div class="left-content">
        <span>充值账户：</span>
        <span class="color weight">长歌</span>
      </div>
      <div class="left-content">
        <span>金币余额：</span>
        <span class="color weight">0</span>
        <span class="weight"> 金币</span>
      </div>
      <div class="left-content">
        <span>充值数量：</span>
        <span class="color weight">52000</span>
        <span class="weight"> 金币</span>
      </div>
      <div class="left-content">
        <span>支付金额：</span>
        <span class="color weight">520</span>
        <span class="weight"> 元</span>
      </div>
    </div>
    <div>
      <div class="right-title">微信支付</div>
      <div id="wxqrcode" class="qrcode"></div>
    </div>
    <div>
      <div class="right-title">支付宝支付</div>
      <div id="zfbqrcode" class="qrcode"></div>
    </div>
  </el-dialog>
</template>

<script>
import {
  apiExchangeList,
  apiCZModeList,
  apiPayLink,
  apiSearch
} from "@/api/user";
import QRCode from "qrcodejs2";
// import Stomp from 'stompjs'
export default {
  name: 'Recharge',
  props: {
    rechargeStauts: {
      type: Boolean,
      default: false
    }
  },
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
        this.modeRecharge();
      }
    }
  },
  created() {
    if (this.token) {
      this.modeRecharge();
    }
  },
  methods: {
    getPayLink(count, payId, changeId, type) {
      // 获取支付二维码链接 生成二维码
      apiPayLink({ money: count, payWayId: payId, exchangeId: changeId }).then(
        res => {
          if (!res || res.result.length == 0) return;
          this.link = res.result[0].urlCode;
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
            if (payId == 7) {
              this.getSearch(2, res.result[0].orderId);
            } else if (payId == 8) {
              this.getSearch(1, res.result[0].orderId);
            }
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
    getSearch(type, ids) {
      // 查询微信支付订单
      var _this = this;
      clearInterval(_this.timer);
      _this.timer = setInterval(() => {
        apiSearch({ itype: type, orderId: ids }).then(res => {
          //itype=1 支付宝  itype=2 微信
          if (res.tradeState == "NOTPAY") {
            // 未支付状态  刷新二维码
            _this.getPayLink(
              _this.countArr[_this.changeCount - 1].iexchangemoney,
              _this.modeList[_this.changepay - 1].iwayid,
              _this.countArr[_this.changeCount - 1].cexchangeid,
              1
            );
          } else {
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
              } else if (res.tradeState == "SUCCESS") {
                _this.nums = 0;
                clearInterval(_this.timer);
                _this.changeCount = 1; //充值数量默认选中第一个
                _this.changepay = 1; //充值方式默认选中第一个
                _this.$store.commit("user/RECHARGE_SHOW", false); // 关闭充值弹框
                this.$confirm("", "提示", {
                  confirmButtonText: "充值完成",
                  cancelButtonText: "遇到问题",
                  customClass: "username-confirm",
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

<style lang="scss" scoped>
.recharge-dialog {
  /deep/ .el-dialog {
    padding: 0;
    div {
      font-size: 16px;
      color: #111;
    }
    .el-dialog__header {
      .dialog-title {
        height: 58px;
        line-height: 58px;
        border-bottom: 1px solid #ccc;
        padding-left: 27px;
        span:nth-child(1) {
          font-weight: 600;
          font-size: 18px;
        }
      }
      .el-dialog__headerbtn {
        top: 14px;
        font-size: 13px;
      }
    }
    
    .el-dialog__body {
      display: flex;
      padding: 18px 22px 27px 27px;
      justify-content: space-between;
      .left-title {
        font-weight: 600;
        margin-bottom: 14px;
      }
      .left-content {
        line-height: 35px;
        .color {
          color: #F24059;          
        }
        .weight {
          font-weight: bold;
        }
      }
      .right-title {
        font-weight: 600;
        margin: 13px 0;
        text-align: center;
      }
      .qrcode {
        width: 120px;
        height: 120px;
        border: 1px solid #cccccc;
        box-sizing: border-box;
      }
    }
  }  
}
</style>