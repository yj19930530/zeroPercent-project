import request from "../utils/request";
// 统计
export function getCompanyData(params) {
    return request({
        url: `/bus/tj/platFormTj`,
        method: "post",
        params
    });
}