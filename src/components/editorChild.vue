<template>
  <Editor ref="editor" id="tinymce" v-model="value" :init="editorInit"></Editor>
</template>
<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons.min.js";
// 拓展插件
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
export default {
  data() {
    return {
      value: this.editValue,
      editorInit: {
        language_url: "/static/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/static/tinymce/skins/ui/oxide",
        content_css: "/static/plugins/tinymce/mycontent.css",
        height: 600,
        plugins: this.plugins,
        toolbar: this.toolbar,
        images_upload_url: `https://www.trunshare.com/sysFile/uploadFile`,
        // images_upload_url: `${process.env.VUE_APP_API_URL}/sysFile/uploadFile`,
        // images_upload_base_path: "/gw-pro",
        // menubar:false
        // setup: (editor) => {
        //   //设置自定义功能的按钮
        //   editor.ui.registry.addButton("imageUpload", {
        //     tooltip: "上传图片",
        //     icon: "image",
        //     onAction: () => {
        //       this.editor = editor;
        //       this.editor.execCommand(
        //         "mceInsertContent",
        //         false,
        //         `<p>这是测试的</p>`
        //       );
        //     },
        //   });
        // },
        branding: false,
        menubar: true,
        editor: null,
      },
    };
  },
  mounted() {
    tinymce.init({});
  },
  props: {
    plugins: {
      type: String,
      default: "",
    },
    editValue: {
      type: String,
      default: "",
    },
    toolbar: {
      type: String,
      default: "",
    },
  },
  components: {
    Editor,
  },
  watch: {
    value(val) {
      this.$emit("modelVal", val);
    },
  },
  methods: {
    resetValue() {
      this.value = '';
    },
    updataValue(val){
      this.value = val;
    }
  },
};
</script>
<style lang="sass" scoped>

</style>