import request from "../utils/request";
//获取小区统计信息
export function getCommunityStatistic(params) {
    return request({
        url: `/housing/housingTj/housingTj`,
        method: "post",
        params
    });
}
// 物业公司统计报表
export function getCompanyData(params) {
    return request({
        url: `/housing/housingTj/companyTj`,
        method: "post",
        params
    });
}
// 系统基础数据统计
export function sysStaData(params) {
    return request({
        url: `/housing/housingTj/platFormTj`,
        method: "post",
        params
    });
}
// 获取数据字典 nofind
export function getDic(params) {
    return request({
        url: `/housing/housingSelect/getDicSelect`,
        method: "post",
        params
    });
}