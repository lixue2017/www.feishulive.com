<template>
  <div class="recharge">
    <div class="recharge_num">
      <div class="recharge_num_title">
        充值数量
      </div>
      <div class="recharge_num_content">

      </div>
    </div>
    <div class="recharge_type">
      <div class="recharge_type_title">
        充值方式
      </div>
      <div class="recharge_type_content">

      </div>
    </div>
  </div>
</template>

<script>
import { apiCZModeList } from '@/api/user'
export default {
  mounted () {
    apiCZModeList({cfrom: 'h5'}).then((result)=>{
    })
  }
}
</script>

<style lang="scss" scoped>
.recharge{
  width: 1200px;
  margin: 0 auto;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 140px;
  box-sizing: border-box;
  .recharge_num{
    .recharge_num_title{
      font-size: 24px;
      font-weight: 400;
      color: #414141;
    }
  }
  .recharge_type{
    .recharge_type_title{
      font-size: 24px;
      font-weight: 400;
      color: #414141;
    }
  }
}
</style>