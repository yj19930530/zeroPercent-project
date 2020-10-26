// 商家管理 api
import request from '@/utils/request.js';
// 获取分页
export const getTablePage = params => {
    return request({
        url: '/bus/keyWordManage/getPage',
        method: 'post',
        params,
    });
};
// 获取详情
export const getRowDetail = params => {
    return request({
        url: '/bus/keyWordManage/get',
        method: 'post',
        params,
    });
};
// 新增
export const addRowIn = params => {
    return request({
        url: '/bus/keyWordManage/saveOrUpdate',
        method: 'post',
        params,
    });
};
// 删除
export const deleteRow = params => {
    return request({
        url: '/bus/keyWordManage/delete',
        method: 'post',
        params,
    });
};