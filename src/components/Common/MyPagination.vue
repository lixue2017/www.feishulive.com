<template>
  <div class="pagination-container">
    <el-pagination
      :background="true"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="[10, 20, 30, 50]"
      :total="total"
      prev-text="上一页"
      next-text="下一页"
      :pager-count="pagerCount"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    },
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: 1, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  /* background: #fff; */
  padding: 20px 10px;
  text-align: center;
  /deep/ .el-pagination.is-background {
    span.el-pagination__total {
      color: #333;
      font-size: 20px;
      font-weight: 600;
      line-height: 44px;
      margin-right: 16px;
    }
    span.el-pagination__jump {
      color: #333;
      font-size: 20px;
      font-weight: 600;
      line-height: 44px;
      .el-pagination__editor {
        width: 68px;
        height: 44px;
        input {
          width: 110px;
          font-size: 20px;
          height: 44px;
          background: #ffffff;
          border: 1px solid #d7d7d7;
          border-radius: 22px;
          padding-right: 44px;
          margin-left: 10px;
        }
        &::after {
          content: 'GO';
          width: 44px;
          height: 44px;
          border-left: 1px solid #d7d7d7;
          position: absolute;
          line-height: 46px;
          right: -54px;
          cursor: pointer;
          font-size: 18px;
          box-sizing: border-box;
        }
      }
    }
    button {
      color: #333;
      font-size: 20px;
      font-weight: 600;
      border-radius: 22px;
      padding: 7px 0;
      box-sizing: border-box;
      height: 44px;
      width: 96px;
      line-height: 44px;
      border: 1px solid #d7d7d7;
      background: #fff;
      &[disabled='disabled']{
        background-color: #f4f4f5;
        &:hover {
          border-color: #d7d7d7;
        }
      }
      &:hover{
        border-color: #41e2bb;
      }
      span {
        font-size: 20px;
      }
    }
    .el-pager {
      li {
        width: 44px;
        height: 44px;
        line-height: 44px;
        color: #333;
        font-size: 20px;
        font-weight: 600;
        background: #ffffff;
        border: 1px solid #d7d7d7;
        border-radius: 50%;
        margin: 0 15px;
        box-sizing: border-box;
        &.active {
          background: #ffffff;
          border: 1px solid #41e2bb;
        }
      }
    }
  }
  
}
</style>