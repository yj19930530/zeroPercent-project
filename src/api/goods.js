// 商家管理 api
import request from '@/utils/request.js';
// 获取分页
export const getTablePage = params => {
    return request({
        url: '/bus/goodManage/getPage',
        method: 'post',
        params,
    });
};
// 获取详情
export const getRowDetail = params => {
    return request({
        url: '/bus/goodManage/get',
        method: 'post',
        params,
    });
};
// 新增
export const addRowIn = params => {
    return request({
        url: '/bus/goodManage/saveOrUpdate',
        method: 'post',
        params,
    });
};
export const updateState = params => {
    return request({
        url: '/bus/goodManage/updateState',
        method: 'post',
        params,
    });
};
// 删除
export const deleteRow = params => {
    return request({
        url: '/bus/goodManage/delete',
        method: 'post',
        params,
    });
};