<template>
  <div class="room-manage">
    <live-desc />
    <div class="list-region">
      <div class="search">
        <el-input
          :placeholder="activeName=='room'?'请输入昵称搜索管理员':'请输入昵称搜索用户'"
          prefix-icon="el-icon-search"
          v-model="search">
        </el-input>
        <el-button type="primary" size="medium" @click="handleSearch">提交</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="房管管理" name="room">
          <my-table ref="myTableRoomAdminRef" :columnConfig="room.columnConfig" :httpRequest="room.httpRequest" :getQueryParams="room.getQueryParams">
            <el-table-column label="权限设置" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" plain round @click="handleRelieveRoom(scope.row)">取消管理</el-button>
              </template>
            </el-table-column>
          </my-table>
        </el-tab-pane>
        <el-tab-pane label="禁言管理" name="blacklist">
          <my-table ref="myTableBlackListRef" :columnConfig="blacklist.columnConfig" :httpRequest="blacklist.httpRequest" :getQueryParams="blacklist.getQueryParams">
            <el-table-column label="权限设置" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" plain round @click="handleRelieveBlacklist(scope.row)">解除禁言</el-button>
              </template>
            </el-table-column>
          </my-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyTable from '@/components/Common/MyTable'
import LiveDesc from './components/LiveDesc'

import { apiRoomManage, apiBlacklist, apiRelieveRoom, apiRelieveBlacklist } from '@/api/user'
export default {
  components: {
    MyTable, LiveDesc
  },
  data(){
    return {
      search: '',
      activeName: 'room',
      room: {
        httpRequest: apiRoomManage,
        getQueryParams: this.getQueryParams,
        columnConfig: [{
          prop: 'nickName', label: '用户昵称'
        }, {
          prop: 'userId', label: '用户ID'
        }, {
          prop: 'addDate', label: '设置时间'
        }]
      },
      blacklist: {
        httpRequest: apiBlacklist,
        getQueryParams: this.getQueryParams,
        columnConfig: [{
          prop: 'nickName', label: '用户昵称'
        }, {
          prop: 'userId', label: '用户ID'
        }, {
          prop: 'shutupTime', label: '类型'
        }, {
          prop: 'addDate', label: '设置时间'
        }]
      }
    }
  },
  methods: {
    //解除房管操作
    handleRelieveRoom(row) {  
      this.$confirm("确定取消"+row.nickName+"的管理权限？" , "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "confirm-room",
        center: true,
        showClose: false,
        cancelButtonClass: "cancelBtn",
        confirmButtonClass: "confirmBtn"
      })
      .then(() => {
        apiRelieveRoom({roomId: row.roomId, userId: row.userId}).then((result)=>{
          this.$message.success('操作成功')
          this.$refs.myTableRoomAdminRef.refreshTable()
        })
      })      
    },
    //解除禁言操作
    handleRelieveBlacklist(row){        
      this.$confirm("确定解除"+row.nickName+"的禁言限制？" , "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "confirm-room",
        center: true,
        showClose: false,
        cancelButtonClass: "cancelBtn",
        confirmButtonClass: "confirmBtn"
      })
      .then(() => {
        apiRelieveBlacklist({roomId: row.roomId, userId: row.userId}).then((result)=>{
          this.$message.success('操作成功')
          this.$refs.myTableBlackListRef.refreshTable()
        })
      }) 
    },
    handleSearch() {
      if(this.activeName == 'room') {
        this.$refs.myTableRoomAdminRef.refreshTable()
      }else {
        this.$refs.myTableBlackListRef.refreshTable()
      }
    },
    getQueryParams() {
      return {
        nickName: this.search
      }
    }
  }
}
</script>

<style lang="scss">
  .confirm-room {
    width: 502px;
    .el-message-box__content {
      font-size: 22px;
      margin: 10px 0;
      color: #111
    }
    .el-message-box__title {
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
.room-manage{
  width: 95%;
  border-radius: 10px;
  margin: 20px auto;
  /deep/ .el-tabs__header {
    width: 280px;
    margin-bottom: 40px;
  }
  /deep/ .pagination-container {
    margin-top: 20px;
  }  
  .list-region{
    margin-top: 25px;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;

    .search {
      display: flex;
      float: right;
      align-items: center;
      /deep/ .el-input--prefix {
        .el-input__inner {
          height: 54px;
          width: 318px;
          margin-right: 22px;
          font-size: 20px;
          padding-left: 43px;
        }
        .el-input__prefix {
          font-size: 20px;
          padding: 0 7px;
          top: 3px;
        }
      }
      /deep/ .el-button--medium {
        padding: 13px 42px;
        font-size: 20px;
        border-radius: 4px;
      }
    }

    /deep/ .el-table{
      border-radius: 10px;
      .el-table__header th{
        font-size: 24px;
        background: #2F3035;
        color: #fff;
      }
      .el-table__body td{
        font-size: 22px;
        color: #2f3035;
        background: #dcdcdc;
        .el-button{
          font-size: 22px;
        }
      }
      .el-table__body tr.el-table__row--striped td {
        background: #e9e9e9;
      }
    }
    /deep/ .el-tabs__active-bar {
      height: 4px;
    }
    /deep/ .el-tabs__item{
      font-size: 28px;
      // font-weight: bold;
      color: #666;
      height: 52px;
      &.is-active {
        color: #42EDC4; 
      }
      &.is-top:nth-child(2) {
        padding-left: 8px;
      }
    }
  }
}
</style>