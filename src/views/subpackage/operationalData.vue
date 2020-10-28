<template>
  <div
    class="box-card"
    id="box-card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="statistics-box">
      <div class="btn-box">
        <span>用户总数 </span>
        <span class="mar-r-10 fc-red">{{objData.totalNum}}</span>
        <span>今日新增 </span>
        <span class="mar-r-10 fc-red">{{objData.newTotalNum}}</span>
        <el-select
          v-model="tjTypeVal"
          class="input-width mar-r-10"
          clearable
          placeholder="请选择时间统计方式"
        >
          <el-option
            v-for="item in timeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker class="input-width mar-r-10" v-if="tjTypeVal===2" v-model="tjTimeVal" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择月" >
        </el-date-picker>
        <el-date-picker class="input-width mar-r-10" v-if="tjTypeVal===1" v-model="tjTimeVal" type="year" format="yyyy" value-format="yyyy" placeholder="选择年">
        </el-date-picker>
        <el-button icon="el-icon-search" type="primary" @click="searchData"
          >搜索</el-button
        >
      </div>
      <div class="statistics-container">
        <div class="statistics-box-bottom">
          <div id="income-statistics"></div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import { getCompanyData } from "@/api/operation";
export default {
  data() {
    return {
      loading: false,
      timeList: [
        {
          label: "按年统计",
          value: 1,
        },
        {
          label: "按月统计",
          value: 2,
        },
      ],
      tjTypeVal: 1,
      tjTimeVal: "",
      objData:{}
    };
  },
  mounted() {
    this.getCommunityData();
  },
  methods: {
    // 搜索
    searchData() {
      this.getCommunityData();
    },
    getCommunityData() {
      this.loading = true;
      getCompanyData({
        tjType: this.tjTypeVal,
        tjTime: this.tjTimeVal,
      })
        .then((res) => {
          this.loading = false;
          this.objData = res.data;
          this.drawIncome(res.data);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 小区收入统计图
    drawIncome(data) {
      let newArr = [],
        newArr2 = [];
      data.userInfo.forEach((item) => {
        newArr.push(item.value);
        newArr2.push(item.title);
      });
      let incomeStatistics = this.$echarts.init(
        document.getElementById("income-statistics")
      );
      // 绘制图表
      incomeStatistics.setOption({
        title: {
          text: "新增用户统计图",
          x: "center",
          y: "bottom",
        },
        xAxis: {
          type: "category",
          data: newArr2,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            smooth: 0.6,
            // symbol: "none",
            label: {
              normal: {
                show: true,
                position: "top",
              },
            },
            areaStyle: {},
            markLine: {
              label: { show: false },
            },
            data: newArr,
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.input-width {
  width: 250px !important;
}
.box-card {
  height: 96%;
  overflow-y: scroll;
  background-color: #fff;
}
.btn-box {
  text-align: right;
  padding-right: 10px;
}
.statistics-box {
  background-color: #fff;
  border-radius: 6px;
  padding: 20px 0 30px 30px;
}
.mg-top {
  margin-top: 7px;
}
.mg-top-6 {
  margin-top: 6px;
}
.mg-left-30 {
  margin-left: 30px;
}
.statistics-container {
  margin-top: 20px;
  @include flex(row, center, null);
}
.statistics-box-bottom {
  @include flex(row, center, null);
  width: 100%;
}
#income-statistics {
  width: 100%;
  height: 400px;
}
#income-statistics2 {
  width: 100%;
  height: 400px;
}
#income-statistics3 {
  width: 100%;
  height: 400px;
}
</style>