<template>
  <div
    class="box-card"
    id="box-card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="statistics-box">
      <span class="fz-11 fz-bold">统计图</span>
      <div class="statistics-container">
        <div class="statistics-box-bottom">
          <div id="income-statistics"></div>
        </div>
      </div>
      <div class="statistics-container">
        <div class="statistics-box-bottom">
          <div id="income-statistics2"></div>
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
    };
  },
  mounted() {
    this.getCommunityData();
  },
  methods: {
    getCommunityData() {
      getCompanyData({
        // companyId: this.getCompanyId,
      }).then((res) => {
        this.drawIncome(res.data);
        this.drawIncome2(res.data);
      });
    },
    // 小区收入统计图
    drawIncome(data) {
      let newArr = [];
      data.yzf.forEach((item) => {
        newArr.push([item.title, item.value]);
      });
      let incomeStatistics = this.$echarts.init(
        document.getElementById("income-statistics")
      );
      // 绘制图表
      incomeStatistics.setOption({
        title: {
          text: "月租车收入统计报表图",
          x: "center",
          y: "bottom",
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            smooth: 0.6,
            symbol: "none",
            label: {
              normal: {
                show: true,
                position: "top",
              },
            },
            markLine: {
              label: { show: false },
            },
            data: newArr,
          },
        ],
      });
    },
    drawIncome2(data) {
      let newArr = [];
      data.wyf.forEach((item) => {
        newArr.push([item.title, item.value]);
      });
      let incomeStatistics = this.$echarts.init(
        document.getElementById("income-statistics2")
      );
      // 绘制图表
      incomeStatistics.setOption({
        color: "#003366",
        title: {
          text: "物业费收入统计报表图",
          x: "center",
          y: "bottom",
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            smooth: 0.6,
            symbol: "none",
            label: {
              normal: {
                show: true,
                position: "top",
              },
            },
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
  height: 100%;
  overflow-y: scroll;
  background-color: #fff;
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