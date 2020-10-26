// 商家管理 api
import request from '@/utils/request.js';
// 获取分页
export const getTablePage = params => {
    return request({
        url: '/bus/user/getPage',
        method: 'post',
        params,
    });
};
// 获取详情
export const getRowDetail = params => {
    return request({
        url: '/bus/user/get',
        method: 'post',
        params,
    });
};
// 删除
export const deleteRow = params => {
    return request({
        url: '/bus/user/delete',
        method: 'post',
        params,
    });
};