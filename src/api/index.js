import request from '@/utils/request.js';
import requestQn from '@/utils/qnRequest.js';
// 用户登录
export const userLogin = params => {
    return request({
        url: '/login/web',
        method: 'post',
        params,
    });
};
// 用户登出
export const userOut = params => {
    return request({
        url: '/login/out',
        method: 'post',
        params,
    });
};
// 上传文件
export const updateFile = params => {
    return request({
        url: '/bus/fileManage/saveOrUpdate',
        method: 'post',
        params,
    });
};
// 删除图片
export const deleteFile = params => {
    return request({
        url: '/bus/fileManage/delete',
        method: 'post',
        params,
    });
};
// 获取文件
export const getFile = params => {
    return request({
        url: '/bus/fileManage/get',
        method: 'post',
        params,
    });
};
// 获取商家下拉列表
export const getBusinessSelect = params => {
    return request({
        url: '/bus/select/getBusinessSelect',
        method: 'post',
        params,
    });
};
// 获取设计师下拉列表
export const getDesignerSelect = params => {
    return request({
        url: '/bus/select/getDesignerSelect',
        method: 'post',
        params,
    });
};
// 获取分类下拉列表
export const getClassSelect = params => {
    return request({
        url: '/bus/select/getItemSelect',
        method: 'post',
        params,
    });
};
// 获取关键词下拉列表
export const getKeySelect = params => {
    return request({
        url: '/bus/select/getKeyWordSelect',
        method: 'post',
        params,
    });
};
// 获取平台下拉列表
export const getPlatformSelect = params => {
    return request({
        url: '/bus/select/getPlatformSelect',
        method: 'post',
        params,
    });
};
// 获取七牛token
export const getQnToken = params => {
    return request({
        url: '/bus/qn/getToken',
        method: 'post',
        params,
    });
};
// 七牛上传图片
export const getQnImg = params => {
    return requestQn({
        url: '',
        method: 'post',
        params,
    });
};
// 删除七牛图片
export const deleteQnImg = params => {
    return request({
        url: `/bus/qn/delete/${params.key}`,
        method: 'post',
        params,
    });
};