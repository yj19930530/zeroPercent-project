<template>
  <div id="header-container">
    <div id="header-content-left">
      <img src="@/images/user/logo-left.png" alt />
    </div>
    <div id="header-content-right">
      <div id="header-user-name">
        <img src="@/images/user/user.png" alt />
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            admin
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="out">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="header-now-time">{{ nowTime }}</div>
    </div>
  </div>
</template>
<script>
import { removeAll } from "@/utils/cookie";
import { userOut } from "@/api/index";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      timer: null,
      nowTime: "",
      access_token: "",
    };
  },
  created() {
    this.getTime();
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
    this.access_token = Cookies.get("Access-Token");
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    handleCommand(val) {
      switch (val) {
        case "out": {
          this.$confirm("是否返回到登录界面?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            await userOut({
              token: this.access_token,
            });
            removeAll();
            localStorage.clear();
            this.$router.push("/login");
          });
          break;
        }
        default: {
          return true;
        }
      }
    },
    getTime() {
      const date = new Date();
      const y = date.getFullYear();
      const m =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      const d = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
      const hours =
        date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
      const minute =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
      const second =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
      return (this.nowTime = `${y}-${m}-${d} ${hours}:${minute}:${second}`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/index.scss";
#header-container {
  position: relative;
  width: 100%;
  height: 50px;
  box-shadow: 0 0 6px #bfbfbf;
  z-index: 7;
  @include flex(row, center, space-between);
  #header-content-left {
    width: 250px;
    height: 100%;
    @include flex(row, center, center);
    span {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
    img {
      width: 150px;
      height: 70%;
    }
  }
  #header-content-right {
    @include flex(row, center, null);
    #header-user-name {
      margin-right: 50px;
      @include flex(row, center, center);
      img {
        margin-right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 30px;
      }
    }
    #header-now-time {
      margin-right: 30px;
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>