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
          placeholder="请输入商家名称"
          clearable
          maxlength="20"
          v-model.trim="nameValue"
          @keyup.enter.native="searchData()"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="searchData"
          >搜索</el-button
        >
        <el-button class="mg-left" type="primary" @click="handleAction('add')"
          >新增</el-button
        >
      </div>
      <!-- 列表 -->
      <div class="table-content">
        <el-table :data="tableLsit" :height="tableHeight" border>
          <el-table-column
            align="center"
            label="姓名"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户名"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userName || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mblNo || "-" }}</span>
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
          <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleAction('edit', scope.row)"
                >编辑</el-button
              >
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
      <!-- 新增编辑弹框 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
      >
        <el-form
          :model="form"
          :rules="rules"
          label-position="right"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              maxlength="20"
              class="input-width"
              placeholder="请输入密码"
              v-model.trim="form.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mblNo">
            <el-input
              maxlength="11"
              class="input-width"
              placeholder="请输入密码"
              v-model.trim="form.mblNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <div class="input-width">
              <el-switch
                v-model="form.state"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer-center">
          <el-button @click="handleClose">关 闭</el-button>
          <el-button type="primary" @click="submitForm" :loading="btnloading"
            >提 交</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getTablePage, // 获取分页
  addRowIn, // 新增
  deleteRow, // 删除
  getRowDetail, // 获取详情
} from "@/api/platform";
import { showToast, objCopyPro } from "@/utils/common.js"; // 通用方法 弹框 复制对象
export default {
  data() {
    return {
      tableHeight: 0, // 表格高度
      loading: false, // 页面loading
      btnloading: false, // 按钮loading
      tableLsit: [], // 列表
      dialogTitle: "新增", // 弹窗标题
      dialogVisible: false, // 弹窗状态
      pageNum: 1, // 当前页
      pageSize: 10, // 当前页条数
      total: 0, // 总数
      form: {
        name: "", // 平台名称
        openWay: "", // 打开方式
        info: "", // 提示内容
        state: 1, // 启用状态
      }, // 表单
      rules: {
        name: [{ required: true, message: "平台名称不能为空", trigger: "blur" }],
      }, // 表单验证
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
    // 获取数据列表
    async getTable() {
      this.loading = false;
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
    // 获取详情
    async findDtails(row) {
      const { data } = await getRowDetail({ id: row.id });
      this.form = objCopyPro(this.form, data);
      this.dialogVisible = true;
      return this.form;
    },
    // 按钮操作
    handleAction(type, row) {
      switch (type) {
        case "add": {
          // 新增
          this.dialogTitle = "新增";
          this.dialogVisible = true;
          break;
        }
        case "delete": {
          // 删除
          this.deleteData(row.id);
          break;
        }
        case "edit": {
          //修改
          this.dialogTitle = "编辑";
          this.findDtails(row);
          break;
        }
        default: {
          return;
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.btnloading = true;
          addRowIn(this.form)
            .then(() => {
              this.btnloading = false;
              showToast(this.dialogTitle + "成功");
              this.getTable();
              this.handleClose();
            })
            .catch(() => {
              this.btnloading = false;
            });
        }
      });
    },
    // 关闭弹窗
    handleClose() {
      this.$refs["ruleForm"].resetFields(); // 重置表单
      this.form = {
        name: "", // 平台名称
        openWay: "", // 打开方式
        info: "", // 提示内容
        state: 1, // 启用状态
      };
      this.dialogVisible = false;
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