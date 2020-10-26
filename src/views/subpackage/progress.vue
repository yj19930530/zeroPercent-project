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
      <div>商品名称：{{ goodsName }}</div>
      <div class="top-add-menu">
        <el-button class="mg-left" type="primary" @click="handleAction('add')"
          >新增</el-button
        >
        <el-button class="mg-left" @click="handleAction('back')"
          >返回商品列表</el-button
        >
      </div>
      <!-- 列表 -->
      <div class="table-content">
        <el-table :data="tableLsit" :height="tableHeight" border>
          <el-table-column
            align="center"
            label="描述"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.speedInfo || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="时间"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ returnTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否推送"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isPush === "1" ? "是" : "否" }}</span>
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
          <el-form-item label="描述" prop="speedInfo">
            <el-input
              maxlength="300"
              class="input-width"
              placeholder="请输入描述"
              v-model.trim="form.speedInfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品/视频">
            <div class="fl-al goods-img-box">
              <div v-for="(item, index) in imgList" :key="index">
                <div class="fl-al goods-img-item" v-if="item.type === 'img'">
                  <el-image
                    class="goods-img-style"
                    :preview-src-list="[item.url]"
                    :src="item.url"
                    fit="cover"
                  ></el-image>
                  <img
                    class="delete-img"
                    @click="deleteImgRow(item, index)"
                    src="../../images/user/deleteimg.png"
                    alt="delete"
                  />
                </div>
              </div>
              <el-upload
                v-if="imgList.length < 3"
                action
                :http-request="uploadFileGoods"
                :before-upload="beforeAvatarUploadImg"
                :show-file-list="false"
              >
                <div class="goods-img-add">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
            </div>
            <div v-for="(vi, vx) in imgList" :key="vx" class="mar-t-10">
              <video
                v-if="vi.type === 'video'"
                controls
                :src="vi.url"
                class="carousel-img"
              >
                <source :src="vi.url" type="video/mp4" />
              </video>
              <div class="delete-video-btn" v-if="vi.type === 'video'">
                <span class="fz-8 fc-999" @click="deleteImgRow(vi, vx)">删除</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="是否推送">
            <div class="input-width">
              <el-switch
                v-model="form.isPush"
                :active-value="'1'"
                :inactive-value="'0'"
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
} from "@/api/progress";
import { updateFile, deleteFile } from "@/api/index";
import { showToast, objCopyPro, dateTime } from "@/utils/common.js"; // 通用方法 弹框 复制对象
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
        speedInfo: "", // 描述
        isPush: "1", // 消息是否推送
        imgInfo: "", // 图片信息
      }, // 表单
      rules: {
        speedInfo: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
      }, // 表单验证
      goodsName: "",
      goodsId: "",
      imgList: [], // 视频图片上传列表
      uploadType: "img",
    };
  },
  created() {
    this.goodsId = this.$route.query.id;
    this.goodsName = this.$route.query.name;
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
      return dateTime(time);
    },
    // 删除图片
    deleteImgRow(row, index) {
      this.$confirm("此操纵将永久删除该资源,是否继续?", {
        confirmButtonText: "确定",
        type: "info",
      }).then(async () => {
        deleteFile({
          id: row.id,
        }).then(() => {
          this.imgList.splice(index, 1);
        });
      });
    },
    // 获取数据列表
    async getTable() {
      this.loading = false;
      getTablePage({
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        goodsId: this.goodsId,
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
    // 自定义上传
    uploadFileGoods(f) {
      const fileObj = f.file;
      const formData = new FormData();
      formData.append("file", fileObj);
      formData.uploadType = true;
      updateFile(formData).then((res) => {
        this.imgList.push({
          id: res.data.id,
          url: res.data.url,
          type: this.uploadType,
        });
      });
    },
    // 上传之前
    beforeAvatarUploadImg(file) {
      if (file.type === "video/mp4") {
        this.uploadType = "video";
      } else {
        this.uploadType = "img";
      }
      const imgType = ["image/png", "image/jpeg", "video/mp4"];
      if (imgType.indexOf(file.type) === -1) {
        this.$message.error("只能上传 png jpeg jpg 格式图片!");
        return false;
      } else {
        return true;
      }
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
      this.imgList = JSON.parse(data.imgInfo);
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
        case "back": {
          this.$router.go(-1);
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
          if (!this.imgList.length)
            return showToast("请上传图片或者视频", "error");
          this.btnloading = true;
          this.form.imgInfo = JSON.stringify(this.imgList);
          this.form.goodId = this.goodsId;
          addRowIn(this.form)
            .then(() => {
              this.btnloading = false;
              this.imgList = [];
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
      if (this.imgList.length && this.dialogTitle !== "编辑") {
        this.imgList.forEach((item) => {
          deleteFile({
            id: item.id,
          });
        });
      }
      this.form = {
        speedInfo: "", // 描述
        isPush: "1", // 消息是否推送
        imgInfo: "", // 图片信息
      };
      this.imgList = [];
      this.dialogVisible = false;
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
.goods-img-box {
  width: 500px;
}
.goods-img-item {
  position: relative;
  margin-right: 10px;
}
.goods-img-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #999;
  border-radius: 10px;
}
.goods-img-style {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.delete-img {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
}
.carousel-img {
  width: 300px;
  height: 150px;
}
.delete-video-btn {
  text-align: center;
  width: 300px;
}
</style>