<!--我的财富-->
<template>
    <div class="wealth">
      <header-info @edit-nickname="switchComp('UpdateNickname', $event)" />
      <div class="divider" style="display: block;height: 1px;width: 100%;background:#ccc"></div>
      <component :is="dynamicName" v-bind="dynamicData" @goback="switchComp('')"></component>
      <div class="content" v-if="!dynamicName">
        <div class="query">
          <el-date-picker
            v-model="gift.query"
            type="daterange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="primary" class="query-btn" @click="$refs.giftTableRef.refreshTable()">查询</el-button>
        </div>
        <my-table ref="giftTableRef" :columnConfig="gift.columnConfig" :httpRequest="gift.httpRequest" :getQueryParams="gift.getQueryParams">
          <el-table-column
            prop="bizTypeName"
            label="交易内容">
          </el-table-column>
          <el-table-column
            prop="type"
            label="进账"
            :formatter="stateFormatIn">
          </el-table-column>
          <el-table-column
            prop="type"
            label="出账"
            :formatter="stateFormatOut">
          </el-table-column>
          <el-table-column
            prop="addDate"
            label="交易时间">
          </el-table-column>
        </my-table>
      </div>
    </div>
</template>
<script>
import HeaderInfo from './components/HeaderInfo'
import UpdateNickname from './components/UpdateNickname'
import MyTable from '@/components/Common/MyTable'
import { apiWealthList} from '@/api/user'
import { parseTime } from '@/utils'
export default {
  components: {
    HeaderInfo, UpdateNickname,MyTable
  },
  data(){
    return {
      dynamicName:'',
      dynamicData:'',
      gift: {
        query: '',
        httpRequest: apiWealthList,
        getQueryParams: ()=>{
          let query = this.gift.query
          if(query){
            return {
              startDate: parseTime(query[0], '{y}-{m}-{d}'),
              endDate: parseTime(query[1], '{y}-{m}-{d}')
            }
          }else {
            return {}
          }
        },
        // columnConfig: [{
        //   prop: '11', label: '交易内容',render(row, column, cellValue, index){
        //     return 'aaa'
        //   }
        // }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  methods:{
    stateFormatIn(row, column) { //进账  type = 0 money = 进账
      if (!row.type) {
        return row.money
      } else{
        return 0
      } 
    },
    stateFormatOut(row, column) { // 出账  type = 1 money = 出账
      if (row.type == 1) {
        return row.money
      } else{
        return 0
      } 
    },
    switchComp(name,data){
      console.log(name,data)
      this.dynamicName = name;
      this.dynamicData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.wealth{
  width: 95%;
  background: #ffffff;
  border-radius: 10px;
  margin: 20px auto;
  .content{
    padding:20px
  }
  .query{
    margin-bottom: 30px;
    .query-btn{
      margin-left: 20px;
    }
  }
}
</style>