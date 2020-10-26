<template>
  <div id="content-show">
    <router-view></router-view>
    <div
      class="footer-container"
    >蜀ICP备20023892号 版权所有：四方创享科技有限公司</div>
  </div>
</template>
<style lang="scss" scoped>
#content-show {
  position: absolute;
  left: 250px;
  right: 0;
  top: 50px;
  bottom: 0;
  background: #d9e5ed;
}
.footer-container {
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 100%;
  font-size: 14px;
  color: #999;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>