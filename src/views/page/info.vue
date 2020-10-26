<template>
  <div class="project-content">
    <v-header></v-header>
    <v-sidebar></v-sidebar>
    <v-content></v-content>
  </div>
</template>
<script>
import vHeader from "@/components/layout/header.vue";
import vSidebar from "@/components/layout/sidebar.vue";
import vContent from "@/components/layout/content.vue";
export default {
  components: {
    vHeader,
    vSidebar,
    vContent
  }
};
</script>
<style lang="scss" scoped>
.project-content {
  width: auto;
  height: 100%;
}
</style>