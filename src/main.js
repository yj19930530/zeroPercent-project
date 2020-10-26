import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js';
import './styles/index.scss';
import './styles/reset.css';
import Cookies from 'js-cookie';
import ElementUI from 'element-ui';
import './styles/theme/index.css'; // 百分之0 主题
import VueCropper from 'vue-cropper';
Vue.use(VueCropper)
Vue.use(ElementUI, {
    size: 'small'
});
// //  使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const token = Cookies.get('Access-Token');
    document.title = `${to.meta.name}`;
    if (!token && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
