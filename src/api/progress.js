// 商家管理 api
import request from '@/utils/request.js';
// 获取分页
export const getTablePage = params => {
    return request({
        url: '/bus/busSpeed/getPage',
        method: 'post',
        params,
    });
};
// 获取详情
export const getRowDetail = params => {
    return request({
        url: '/bus/busSpeed/get',
        method: 'post',
        params,
    });
};
// 新增
export const addRowIn = params => {
    return request({
        url: '/bus/busSpeed/saveOrUpdate',
        method: 'post',
        params,
    });
};
// 删除
export const deleteRow = params => {
    return request({
        url: '/bus/busSpeed/delete',
        method: 'post',
        params,
    });
};