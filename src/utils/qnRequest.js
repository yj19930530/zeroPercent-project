import axios from 'axios';
// import Cookies from 'js-cookie';
// import store from '../store.js';
import { Message } from 'element-ui';

let instance = axios.create({
    baseURL: 'http://up-z2.qiniu.com',
});
instance.interceptors.request.use(config => {
    const questStatus = config.method;
    config.timeout = 15000;
    switch (questStatus) {
        case 'post': {
            config.timeout = 60000;
            instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
            config.data = config.params;
            delete config.params;
            break;
        }
        default: {
            return config;
        }
    }
    return config;
})

instance.interceptors.response.use(response => {
    return response.data;
}, error => {
    Message({
        message: error.response.data.message,
        type: 'error',
        duration: 1000
    });
    return Promise.reject(error);
})

export default instance;