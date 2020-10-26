<template>
  <div class="sidebar">
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="routes"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template>
        <el-menu-item v-for="item in menuList" :key="item.name" :index="item.path">
          <i :class="item.meta.icon"></i>
          <span>{{item.meta.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import router from "../../router/index";
export default {
  data() {
    const r = this.$route.path;
    return {
      menuList: [],
      routes: r
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      let arr = router.options.routes;
      arr.forEach(item => {
        if (item.name === "info") {
          this.menuList = item.children;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.el-menu-vertical-demo {
  width: 250px;
  height: 100%;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  z-index: 8;
  ul {
    height: 100%;
  }
}
</style>