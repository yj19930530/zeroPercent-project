<template>
  <div
    class="box-card"
    id="box-card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="box-content">
      <!-- 头部操作栏 -->
      <div class="top-add-menu">
        <el-input
          class="input-width mar-r-10"
          placeholder="请输入用户昵称"
          clearable
          maxlength="20"
          v-model.trim="nameValue"
          @keyup.enter.native="searchData()"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="searchData"
          >搜索</el-button
        >
      </div>
      <!-- 列表 -->
      <div class="table-content">
        <el-table :data="tableLsit" :height="tableHeight" border>
          <el-table-column
            align="center"
            label="用户昵称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.nickName || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户手机号"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mblNo || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户手机号"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mblNo || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="登录时间"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.loginTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.state ? "启用" : "禁用" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleAction('delete', scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getTablePage, // 获取分页
  deleteRow, // 删除
} from "@/api/user";
import { showToast, dateTime } from "@/utils/common.js"; // 通用方法 弹框 复制对象
export default {
  data() {
    return {
      tableHeight: 0, // 表格高度
      loading: false, // 页面loading
      tableLsit: [], // 列表
      pageNum: 1, // 当前页
      pageSize: 10, // 当前页条数
      total: 0, // 总数
      nameValue: "", // 搜索商家名称
    };
  },
  created() {
    this.getTableHeight(); // 表格高度
  },
  mounted() {
    this.getTable(); // 获取列表数据
  },
  methods: {
    // 页面 taboe 高度
    getTableHeight() {
      this.$nextTick(() => {
        let data = document.getElementById("box-card");
        this.tableHeight = data.offsetHeight - 150;
      });
    },
    // 返回时间
    returnTime(time) {
      if (!time) return "-";
      return dateTime(time);
    },
    // 获取数据列表
    async getTable() {
      this.loading = true;
      getTablePage({
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        name: this.nameValue,
      })
        .then((res) => {
          if (this.pageNum > 1 && res.data.list.length === 0) {
            this.pageNum--;
            this.getTable();
            return;
          } // 删除完当前页没有数据则重新请求列表获取数据
          this.loading = false;
          this.tableLsit = res.data.list;
          this.total = res.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 搜索
    searchData() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getTable();
    },
    // 选择当前页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
    },
    // 选择页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTable();
    },
    // 删除数据
    deleteData(id) {
      this.$confirm("此操纵将永久删除该数据,是否继续?", {
        confirmButtonText: "确定",
        type: "info",
      }).then(async () => {
        await deleteRow({ id: id });
        showToast("删除成功");
        this.getTable();
      });
    },
    // 按钮操作
    handleAction(type, row) {
      switch (type) {
        case "delete": {
          // 删除
          this.deleteData(row.id);
          break;
        }
        default: {
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  @include flex(column, center, center);
}
.input-width {
  width: 250px !important;
}
.input-width2 {
  width: 200px !important;
}
.input-width3 {
  width: 120px !important;
}
.mg-left {
  margin-left: 10px;
}
.box-card {
  height: 96%;
  overflow-y: scroll;
  background-color: #fff;
}
.box-content {
  padding: 10px;
}
.table-content {
  margin-top: 10px;
}
.bottom-page {
  text-align: right;
  padding: 10px 10px 0 0;
}
.top-add-menu {
  text-align: right;
}
.btn-content {
  padding-left: 10px;
}
.dialog-footer-center {
  text-align: center;
}
</style>