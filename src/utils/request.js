import axios from 'axios';
import Cookies from 'js-cookie';
// import store from '../store.js';
import { Message, MessageBox } from 'element-ui';

let instance = axios.create({
    // baseURL: 'http://192.168.1.72:9009/',
    baseURL: 'http://47.114.135.205:9009/',
});
instance.interceptors.request.use(config => {
    const questStatus = config.method;
    config.timeout = 15000;
    const access_token = Cookies.get('Access-Token');
    config.headers.post['Authorization'] = 'Bearer ' + access_token;
    switch (questStatus) {
        case 'post': {
            config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            config.params = config.params ? config.params : {};
            if (config.params.loginType) {
                config.headers.post['Content-Type'] = 'application/json';
                delete config.params.loginType;
            } else if (config.params.uploadType) {
                config.timeout = 60000;
                config.headers['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryJ0BstsRQ55xWJzBB';
                delete config.params.uploadType;
                config.data = config.params;
                delete config.params;
            } else if (config.params.arrtype) {
                config.data = config.params.arr;
                delete config.params;
            } else {
                config.headers.post['Authorization'] = 'Bearer ' + access_token;
            }
            break;
        }
        default: {
            return config;
        }
    }
    return config;
})

instance.interceptors.response.use(response => {
    if (response.data === "") return;
    const res = response.data;
    if (response.status === 200 && res.code === 200) {
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 1000
            });
        } else {
            return res;
        }

    } else {
        if (res.code === 401) {
            MessageBox.confirm('认证失效请重新登录', {
                confirmButtonText: '重新登录',
                type: 'warning',
            }).then(() => {
                Cookies.remove('Access-Token');
                location.reload();
            })

        } else {
            Message({
                message: res.message,
                type: 'error',
                duration: 1000
            });
            return Promise.reject();
        }
        debugger
    }
}, error => {
    Message({
        message: error.response.data.message,
        type: 'error',
        duration: 1000
    });
    return Promise.reject(error);
})

export default instance;