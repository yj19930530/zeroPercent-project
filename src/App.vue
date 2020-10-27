<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style lang="scss">
@import "./styles/font.css";
// 弹框宽度
.el-dialog {
  width: $form-width !important;
}
// 隐藏滚动条
#content-show ::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
// 菜单选中背景颜色
.el-menu-item.is-active {
  background-color: rgb(40, 52, 70) !important;
}
</style>
