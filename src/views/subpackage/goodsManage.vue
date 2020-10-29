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
          placeholder="商品名称"
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
            label="图片"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-image
                :src="scope.row.showImgInfo[0].img"
                class="img-show-inner"
                fit="cover"
                :preview-src-list="[scope.row.showImgInfo[0].img]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品名称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodName || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商家名称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ returnText(busSelectList, scope.row.businessId) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ returnText(useStateType, scope.row.goodState) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="进度"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开团平台"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{
                returnText(plaformSelectList, scope.row.platformId)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关注人数"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.scNum }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="状态"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.state ? "启用" : "禁用" }}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.state === 0"
                @click="handleAction('up', scope.row)"
                >上架</el-button
              >
              <el-button
                type="primary"
                v-if="scope.row.state === 1"
                @click="handleAction('down', scope.row)"
                >下架</el-button
              >
              <el-button
                type="primary"
                :disabled="scope.row.state === 1"
                @click="handleAction('edit', scope.row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                :disabled="scope.row.state === 1"
                @click="handleAction('delete', scope.row)"
                >删除</el-button
              >
              <el-button
                type="primary"
                @click="handleAction('progress', scope.row)"
                >进度更新</el-button
              >
              <!-- <el-button
                type="primary"
                @click="handleAction('delete', scope.row)"
                >状态更新</el-button
              > -->
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
          label-width="110px"
          class="demo-ruleForm"
        >
          <el-form-item label="封面图">
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
            <div v-else class="upload-box-style">
              <el-image :src="coverImg" class="cover-img-style" fit="fill"> </el-image>
              <img
                class="delete-img-cover"
                @click="deleteCover"
                src="../../images/user/deleteimg.png"
                alt="delete"
              />
              <!-- <div class="delete-box">
                <i class="el-icon-delete fc-999 fz-15" @click="deleteCover"></i>
              </div> -->
            </div>
          </el-form-item>
          <el-form-item label="占位" style="visibility: hidden">
            <el-input class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="商品图片">
            <div class="fl-al goods-img-box">
              <div
                class="fl-al goods-img-item"
                v-for="(item, index) in goodsUploadList"
                :key="index"
              >
                <el-image
                  class="goods-img-style"
                  :preview-src-list="[item.img]"
                  :src="item.img"
                  fit="cover"
                ></el-image>
                <img
                  class="delete-img"
                  @click="deleteImgRow(item, index)"
                  src="../../images/user/deleteimg.png"
                  alt="delete"
                />
              </div>
              <el-upload
                v-if="goodsUploadList.length < 7"
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
          </el-form-item>
          <el-form-item label="商品名称" prop="goodName">
            <el-input
              maxlength="20"
              class="input-width2"
              placeholder="请输入商品名称"
              v-model.trim="form.goodName"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品简介">
            <el-input
              type="textarea"
              resize="none"
              maxlength="300"
              :rows="5"
              class="input-width2"
              placeholder="请输入商品简介"
              v-model.trim="form.info"
            ></el-input>
          </el-form-item>
          <el-form-item label="商家" prop="businessId">
            <el-select
              v-model="form.businessId"
              class="input-width"
              clearable
              filterable
              placeholder="请选择商家"
            >
              <el-option
                v-for="item in busSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类" prop="items">
            <el-select
              v-model="itemsArr"
              class="input-width"
              multiple
              collapse-tags
              clearable
              filterable
              @change="classChange"
              placeholder="请选择分类"
            >
              <el-option
                v-for="item in classSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词" prop="keyWords">
            <el-select
              v-model="keyWordsArr"
              class="input-width"
              multiple
              collapse-tags
              clearable
              @change="keyChange"
              filterable
              placeholder="请选择关键词"
            >
              <el-option
                v-for="item in keySelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设计师" prop="designers">
            <el-select
              v-model="designersArr"
              class="input-width"
              multiple
              collapse-tags
              @change="designersChange"
              clearable
              filterable
              placeholder="请选择设计师"
            >
              <el-option
                v-for="item in designersSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开团时间" prop="openTime">
            <el-date-picker
              v-model="form.openTime"
              class="input-width"
              type="datetime"
              placeholder="选择开团时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开团提醒时间" prop="openNoticeTime">
            <el-select
              v-model="form.openNoticeTime"
              class="input-width"
              clearable
              filterable
              placeholder="请选择开团提醒时间"
            >
              <el-option
                v-for="item in openTimeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="截团时间" prop="closeTime">
            <el-date-picker
              v-model="form.closeTime"
              class="input-width"
              type="datetime"
              placeholder="选择截团时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发货时间" prop="sendTime">
            <el-date-picker
              v-model="form.sendTime"
              class="input-width"
              type="datetime"
              placeholder="选择发货时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开团平台" prop="platformId">
            <el-select
              v-model="form.platformId"
              class="input-width"
              clearable
              filterable
              placeholder="请选择开团平台"
            >
              <el-option
                v-for="item in plaformSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买链接">
            <el-input
              maxlength="20"
              class="input-width"
              placeholder="请输入购买链接"
              v-model.trim="form.buyUrl"
            ></el-input>
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
  updateState, // 修改状态
} from "@/api/goods";
import {
  getQnImg,
  deleteQnImg,
  getQnToken,
  getPlatformSelect,
  getKeySelect,
  getClassSelect,
  getDesignerSelect,
  getBusinessSelect,
} from "@/api/index";
import { DEPT_NAME } from "@/utils/validation";
import { qnHttpimg } from "@/utils/config";
import { showToast, objCopyPro, reText } from "@/utils/common.js"; // 通用方法 弹框 复制对象
export default {
  data() {
    const dateTime = new Date().getTime();
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
        buyUrl: "", // 购买链接
        closeTime: "", // 截团时间
        businessId: "", // 商家id
        showImgInfo: "", // 封面图
        designers: "", // 设计师
        goodName: "", // 商品名称
        imgInfo: "", // 图片信息
        info: "", // 简介
        items: "", // 分类
        keyWords: "", // 关键词
        openNoticeTime: "", // 关键词提醒时间`
        openTime: "", // 开团时间
        platformId: "", // 开团平台
        sendTime: "", // 发货时间
        state: 0,
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
        autoCropHeight: 400,
        fixedBox: false,
        fixed: true,
        maxImgSize: 3000, // 图片最大像素
        fixedNumber: [375, 250],
      }, // 截图配置
      rules: {
        goodName: [{ required: true, validator: DEPT_NAME, trigger: "blur" }],
        businessId: [
          {
            required: true,
            message: "请选择商家",
            trigger: "change",
          },
        ],
        platformId: [
          {
            required: true,
            message: "请选择开团平台",
            trigger: "change",
          },
        ],
        items: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change",
          },
        ],
        designers: [
          {
            required: true,
            message: "请选择设计师",
            trigger: "change",
          },
        ],
        keyWords: [
          {
            required: true,
            message: "请选择关键词",
            trigger: "change",
          },
        ],
        openTime: [
          {
            required: true,
            message: "请选择开团时间",
            trigger: "change",
          },
        ],
        openNoticeTime: [
          {
            required: true,
            message: "请选择开团提醒时间",
            trigger: "change",
          },
        ],
        closeTime: [
          {
            required: true,
            message: "请选择截团时间",
            trigger: "change",
          },
        ],
        sendTime: [
          {
            required: true,
            message: "请选择发货时间",
            trigger: "change",
          },
        ],
      }, // 表单验证
      coverImg: null, // 上传图片显示
      imgArr: [], // 上传图片arr
      imgId: "", // 删除的图片id
      nameValue: "", // 搜索商家名称
      busSelectList: [], // 商家下拉列表
      classSelectList: [], // 分类下拉列表
      keySelectList: [], //关键词下拉列表
      designersSelectList: [], // 设计师下拉列表
      plaformSelectList: [], // 平台下拉列表
      nowTime: dateTime, // 现在时间
      itemsArr: [], // 分类下拉
      keyWordsArr: [], // 关键字下拉
      designersArr: [], // 设计师分类
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < this.nowTime - 8.64e7;
        },
      }, //禁止选现在以前时间
      openTimeSelect: [
        {
          value: 1,
          label: "提前1小时",
        },
        {
          value: 2,
          label: "提前2小时",
        },
      ],
      goodsUploadList: [], // 商品上传列表
      useStateType: [
        {
          label: "正常",
          value: "1",
        },
        {
          label: "延期",
          value: "2",
        },
        {
          label: "终止",
          value: "3",
        },
      ],
      qnHttpimg: qnHttpimg,
      uploadData: { key: "", token: "" },
    };
  },
  created() {
    this.getTableHeight(); // 表格高度
    this.getQnTokenData(); // 获取七牛token
  },
  mounted() {
    this.getTable(); // 获取列表数据
    this.getSelectData(); // 获取下拉列表
  },
  methods: {
    // 获取七牛token
    async getQnTokenData() {
      const { data } = await getQnToken();
      this.uploadData.token = data;
    },
    // 页面 taboe 高度
    getTableHeight() {
      this.$nextTick(() => {
        let data = document.getElementById("box-card");
        this.tableHeight = data.offsetHeight - 150;
      });
    },
    // 显示文字
    returnText(list, type) {
      return reText(list, type);
    },
    // 分类下拉选择
    classChange(val) {
      if (val.length) {
        this.form.items = val.join(",");
      } else {
        this.form.items = "";
      }
    },
    // 关键词下拉选择
    keyChange(val) {
      if (val.length) {
        this.form.keyWords = val.join(",");
      } else {
        this.form.keyWords = "";
      }
    },
    // 设计师下拉选择
    designersChange(val) {
      if (val.length) {
        this.form.designers = val.join(",");
      } else {
        this.form.designers = "";
      }
    },
    // 商品自定义上传
    uploadFileGoods(f) {
      const fileObj = f.file;
      const formData = new FormData();
      formData.append("file", fileObj);
      formData.append("key", this.uploadData.key);
      formData.append("token", this.uploadData.token);
      getQnImg(formData).then((res) => {
        this.goodsUploadList.push({
          img: this.qnHttpimg + res.key,
          id: res.key,
        });
      });
    },
    // 获取下拉列表
    async getSelectData() {
      const plaData = await getPlatformSelect(); // 平台
      const keyData = await getKeySelect(); // 关键词
      const classData = await getClassSelect(); // 分类
      const desData = await getDesignerSelect(); // 设计师
      const busData = await getBusinessSelect(); // 商家
      this.busSelectList = busData.data;
      this.classSelectList = classData.data;
      this.keySelectList = keyData.data;
      this.designersSelectList = desData.data;
      this.plaformSelectList = plaData.data;
    },
    // 获取数据列表
    async getTable() {
      this.loading = true;
      getTablePage({
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        goodName: this.nameValue,
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
            return (item.showImgInfo = JSON.parse(item.showImgInfo));
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
        this.uploadData.key = `picture_${new Date().getTime()}_${file.name}`;
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
    deleteCover() {
      this.$confirm("此操纵将永久删除该图片,是否继续?", {
        confirmButtonText: "确定",
        type: "info",
      }).then(async () => {
        this.form.showImgInfo = "";
        this.coverImg = null;
        this.imgArr = [];
        await deleteQnImg({
          key: this.imgId,
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
        formData.append("key", this.uploadData.key);
        formData.append("token", this.uploadData.token);
        getQnImg(formData)
          .then((res) => {
            this.btnloading = false;
            this.imgArr.push({
              img: this.qnHttpimg + res.key,
              id: res.key,
            });
            this.coverImg = this.qnHttpimg + res.key;
            this.imgId = res.key;
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
    // 删除图片
    deleteImgRow(row, index) {
      this.$confirm("此操纵将永久删除该图片,是否继续?", {
        confirmButtonText: "确定",
        type: "info",
      }).then(async () => {
        deleteQnImg({
          key: row.id,
        }).then(() => {
          this.goodsUploadList.splice(index, 1);
        });
        // .catch(() => {
        //   this.goodsUploadList.splice(index, 1);
        // });
      });
    },
    // 获取详情
    async findDtails(row) {
      const { data } = await getRowDetail({ id: row.id });
      this.form = objCopyPro(this.form, data);
      const imgObj = JSON.parse(data.showImgInfo)[0];
      this.coverImg = imgObj.img;
      this.imgId = imgObj.id;
      this.imgArr = JSON.parse(data.showImgInfo);
      this.goodsUploadList = JSON.parse(data.imgInfo);
      this.designersArr = data.designers.split(",");
      this.itemsArr = data.items.split(",");
      this.keyWordsArr = data.keyWords.split(",");
      this.dialogVisible = true;
      return this.form;
    },
    // 按钮操作
    async handleAction(type, row) {
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
        case "progress": {
          //修改
          this.$router.push(`/progress?id=${row.id}&name=${row.goodName}`);
          break;
        }
        case "up": {
          // 上架
          await updateState({
            state: 1,
            id: row.id,
          });
          this.getTable();
          break;
        }
        case "down": {
          // 上架
          await updateState({
            state: 0,
            id: row.id,
          });
          this.getTable();
          break;
        }
        default: {
          return;
        }
      }
    },
    // 判断时间是否一致
    timeRuleHandle(row) {
      const dateTime = new Date().getTime();
      const ot = new Date(row.openTime).getTime(),
        ct = new Date(row.closeTime).getTime(),
        st = new Date(row.sendTime).getTime();
      if (dateTime > ot) {
        showToast("当前时间不能大于开团时间", "info");
        return false;
      } else if (ct < ot) {
        showToast("截团时间不能小于开团时间", "info");
        return false;
      } else if (ct > st) {
        showToast("发货时间不能小于截团时间", "info");
        return false;
      } else if (ot > st) {
        showToast("发货时间不能小于开团时间", "info");
        return false;
      } else {
        return true;
      }
    },
    // 提交表单
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (!this.imgArr.length)
            return showToast("请上传商品封面图", "error");
          if (!this.goodsUploadList.length)
            return showToast("请上传商品图片", "error");
          this.form.showImgInfo = JSON.stringify(this.imgArr);
          this.form.imgInfo = JSON.stringify(this.goodsUploadList);
          const type = this.timeRuleHandle(this.form);
          if (!type) return;
          this.btnloading = true;
          addRowIn(this.form)
            .then(() => {
              this.imgId = "";
              this.goodsUploadList = [];
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
        deleteQnImg({
          key: this.imgId,
        });
      }
      if (this.goodsUploadList.length && this.dialogTitle !== "编辑") {
        this.goodsUploadList.forEach((item) => {
          deleteQnImg({
            key: item.id,
          });
        });
      }
      this.imgId = "";
      this.coverImg = null;
      this.itemsArr = [];
      this.keyWordsArr = [];
      this.designersArr = [];
      this.goodsUploadList = [];
      this.$refs["ruleForm"].resetFields(); // 重置表单
      this.form = {
        buyUrl: "", // 购买链接
        closeTime: "", // 截团时间
        businessId: "", // 商家id
        showImgInfo: "", // 封面图
        designers: "", // 设计师
        goodName: "", // 商品名称
        imgInfo: "", // 图片信息
        info: "", // 简介
        items: "", // 分类
        keyWords: "", // 关键词
        openNoticeTime: "", // 关键词提醒时间
        openTime: "", // 开团时间
        platformId: "", // 开团平台
        sendTime: "", // 发货时间
        state: 0,
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
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.el-form-item {
  flex: 1 1 50%;
}
.el-form-item.full {
  flex: 1 1 100%;
}
.input-width {
  width: 250px !important;
}
.input-width2 {
  width: 350px !important;
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
  width: 40px;
  height: 40px;
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
.delete-img-cover {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
}
.cover-img-style {
  width: 100%;
  height: 100%;
}
</style>