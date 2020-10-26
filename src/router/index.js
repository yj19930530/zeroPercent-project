import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'login',
        redirect: '/login',
        meta: {
            name: '登录'
        }
    },
    {
        path: '/login',
        name: 'login2',
        component: () => import('@/views/page/login.vue'),
        meta: {
            name: '登录'
        }
    },
    {
        path: '/progress',
        name: 'progress',
        component: () => import('@/views/subpackage/progress.vue'),
        meta: {
            name: '商品进度管理'
        }
    },
    {
        path: '/info',
        name: 'info',
        redirect: '/accountManage',
        component: () => import('@/views/page/info.vue'),
        meta: {
            name: 'info'
        },
        children: [{
            path: '/accountManage',
            name: 'accountManage',
            component: () => import('@/views/subpackage/accountManage.vue'),
            meta: {
                icon: '',
                name: '账号管理'
            }
        }, { 
            path: '/userManage',
            name: 'userManage',
            component: () => import('@/views/subpackage/userManage.vue'),
            meta: {
                icon: '',
                name: '用户管理'
            }
        }, {
            path: '/platformManage',
            name: 'platformManage',
            component: () => import('@/views/subpackage/platformManage.vue'),
            meta: {
                icon: '',
                name: '平台管理'
            }
        }, {
            path: '/businessManage',
            name: 'businessManage',
            component: () => import('@/views/subpackage/businessManage.vue'),
            meta: {
                icon: '',
                name: '商家管理'
            }
        }, {
            path: '/goodsManage',
            name: 'goodsManage',
            component: () => import('@/views/subpackage/goodsManage.vue'),
            meta: {
                icon: '',
                name: '商品管理'
            }
        }, {
            path: '/designerManage',
            name: 'designerManage',
            component: () => import('@/views/subpackage/designerManage.vue'),
            meta: {
                icon: '',
                name: '设计师管理'
            }
        }, {
            path: '/classManage',
            name: 'classManage',
            component: () => import('@/views/subpackage/classManage.vue'),
            meta: {
                icon: '',
                name: '分类管理'
            }
        }, {
            path: '/keyWordManage',
            name: 'keyWordManage',
            component: () => import('@/views/subpackage/keyWordManage.vue'),
            meta: {
                icon: '',
                name: '关键词管理'
            }
        }, {
            path: '/channelManage',
            name: 'channelManage',
            component: () => import('@/views/subpackage/channelManage.vue'),
            meta: {
                icon: '',
                name: '渠道管理'
            }
        }, {
            path: '/operationalData',
            name: 'operationalData',
            component: () => import('@/views/subpackage/operationalData.vue'),
            meta: {
                icon: '',
                name: '运营数据'
            }
        }]
    },
]
const router = new VueRouter({
    mode: 'history',
    base: '',
    routes
})
export default router
