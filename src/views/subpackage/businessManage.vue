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
            label="logo"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-image
                class="img-style"
                :preview-src-list="[scope.row.logo[0].img]"
                :src="scope.row.logo[0].img"
                fit="fill"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商家名称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="产品数量"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodNum || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="终止数量"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.endNum || "-" }}</span>
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
          <el-table-column align="center" label="操作" width="150">
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
          <el-form-item label="商家名称" prop="name">
            <el-input
              maxlength="20"
              class="input-width"
              placeholder="请输入商家名称"
              v-model.trim="form.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="logo">
            <el-upload
              v-if="!coverImg"
              action
              :show-file-list="false"
              :before-upload="beforeAvatarUploadImg"
              :http-request="uploadFileMethodAnswer"
            >
              <div class="upload-box-style">
                <i class="el-icon-plus avatar-uploader-icon fc-999 fz-20"></i>
              </div>
            </el-upload>
            <div v-else>
              <el-image
                :src="coverImg"
                class="upload-box-style"
                fit="fill"
              ></el-image>
              <div class="delete-box">
                <i class="el-icon-delete fc-999 fz-15" @click="deleteCover"></i>
              </div>
            </div>
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
      <!-- 截图 -->
      <el-dialog
        title="截取图片"
        :visible.sync="dialogVisibleCro"
        :before-close="handleCloseCopper"
        :close-on-click-modal="false"
      >
        <div class="cropper-content">
          <div class="cropper" style="text-align: center">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
            ></vueCropper>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleCro = false">取 消</el-button>
          <el-button type="primary" :loading="btnloading" @click="finish"
            >确 定</el-button
          >
        </span>
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
} from "@/api/business";
import { updateFile, deleteFile } from "@/api/index";
import { DEPT_NAME } from "@/utils/validation";
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
      dialogVisibleCro: false, // 截图弹框
      pageNum: 1, // 当前页
      pageSize: 10, // 当前页条数
      total: 0, // 总数
      form: {
        name: "", // 商家名称
        logo: "", // logo
        state: 1, // 启用状态
      }, // 表单
      option: {
        img: "",
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropHeight: 500,
        fixedBox: false,
        fixed: true,
        maxImgSize: 3000, // 图片最大像素
        fixedNumber: [97, 100],
      }, // 截图配置
      rules: {
        name: [{ required: true, validator: DEPT_NAME, trigger: "blur" }],
      }, // 表单验证
      coverImg: null, // 上传图片显示
      imgArr: [], // 上传图片arr
      imgId: "", // 删除的图片id
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
          this.tableLsit.map((item) => {
            return (item.logo = JSON.parse(item.logo));
          });
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
    // 上传之前
    beforeAvatarUploadImg(file) {
      const imgType = ["image/png", "image/jpeg"];
      if (imgType.indexOf(file.type) === -1) {
        this.$message.error("只能上传 png jpeg jpg 格式图片!");
        return false;
      } else {
        return true;
      }
    },
    // 自定义上传
    uploadFileMethodAnswer(f) {
      const fileObj = f.file;
      this.dialogVisibleCro = true;
      this.option.img = URL.createObjectURL(fileObj);
    },
    // 选择当前页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
    },
    // 删除图片
    async deleteCover() {
      this.$confirm("此操纵将永久删除该图片,是否继续?", {
        confirmButtonText: "确定",
        type: "info",
      }).then(async () => {
        this.form.logo = "";
        this.coverImg = null;
        await deleteFile({
          id: this.imgId,
        });
        this.imgId = "";
      });
    },
    // 截图完成
    finish() {
      this.$refs.cropper.getCropBlob((obj) => {
        this.btnloading = true;
        const formData = new FormData();
        formData.append("file", obj);
        formData.uploadType = true;
        updateFile(formData)
          .then((res) => {
            this.btnloading = false;
            this.imgArr.push({
              img: res.data.url,
              id: res.data.id,
            });
            this.coverImg = res.data.url;
            this.imgId = res.data.id;
            this.dialogVisibleCro = false;
          })
          .catch(() => {
            this.btnloading = false;
          });
      });
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
      const imgObj = JSON.parse(data.logo)[0];
      this.coverImg = imgObj.img;
      this.imgId = imgObj.id;
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
          if (!this.imgArr.length) return showToast("请上传logo", "error");
          this.btnloading = true;
          this.form.logo = JSON.stringify(this.imgArr);
          addRowIn(this.form)
            .then(() => {
              this.imgId = "";
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
      if (this.imgId !== "" && this.dialogTitle !== "编辑") {
        deleteFile({
          id: this.imgId,
        });
      }
      this.imgId = "";
      this.coverImg = null;
      this.$refs["ruleForm"].resetFields(); // 重置表单
      this.form = {
        name: "", // 商家名称
        logo: "", // logo
        state: 1, // 启用状态
      };
      this.dialogVisible = false;
    },
    // 关闭截图弹框
    handleCloseCopper() {
      this.dialogVisibleCro = false;
    },
  },
};
</script>

<style lang="scss" scoped>
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
.upload-box-style {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px dashed #999999;
  border-radius: 6px;
  transition: all 0.5s;
}
.dialog-footer-center {
  text-align: center;
}
.delete-box {
  margin-top: 10px;
  width: 200px;
  text-align: center;
}
.cropper-content .cropper {
  width: auto;
  height: 500px !important;
}
.img-style {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
</style>