<template>
  <div class="tableData">
    <el-table :data="tableData" stripe>
      <slot name="index" v-if="indexColumn.show">
        <el-table-column :label="indexColumn.label" align="center">
          <template slot-scope="scope">
            {{ indexRender(scope.$index) }}
          </template>
        </el-table-column>
      </slot>
      <template v-for="column in columnConfig">
        <el-table-column 
          align="center" 
          :prop="column.prop" 
          :label="column.label" 
          :width="column.width"
          :formatter="column.render" 
          :key="column.prop">
        </el-table-column>
      </template>
      <slot name="default" />
    </el-table>
    <my-pagination 
      :page="start" 
      :limit="limit" 
      :total="total" 
      @pagination="handlePagination" />
  </div>
</template>

<script>
import MyPagination from './MyPagination'
export default {
  components: {
    MyPagination,
  },
  props: {
    indexColumn: {
      type: Object,
      default: () => {
        return {
          show: false,
          label: '序号'
        }
      }
    },
    columnConfig: {
      type: Array,
      default: ()=>[]
    },
    httpRequest: {
      type: Function,
      default: ()=>{}
    },
    getQueryParams:{
      type: Function,
      default: ()=>{}
    }
  },
  data(){
    return {
      start: 1,
      limit: 10,
      tableData: [],
      total: 0,
      query: {}
    }
  },
  mounted () {
    this.getTableData(this.getQueryParams())
  },
  methods: {
    indexRender($index){
      let num = (this.start - 1) * this.limit + ($index + 1)
      if(num<10) return "0"+num
      else return num
      // return (this.start - 1) * this.limit + ($index + 1)
    },
    getTableData(params) {
      if(params){
        this.query = params
      }
      this.httpRequest({ ...this.query, pageNo: this.start, pageSize: this.limit }).then((result)=>{
        this.tableData = result.array
        this.total = parseInt(result.total) || 0
      })
    },
    refreshTable(restart = true){
      if(restart){
        this.start = 1
      }
      this.getTableData(this.getQueryParams())
    },
    handlePagination({page, limit}){
      this.start = page
      this.limit = limit
      this.refreshTable(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.tableData{
  background: #f2f5f6;
  border-radius: 10px;
}

</style>