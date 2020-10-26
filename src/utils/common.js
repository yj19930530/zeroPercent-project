// 常用方法
import { Message } from 'element-ui';
// 对象复制
export function objCopy(obj) {
    let newObj = {};
    for (let key in obj) {
        newObj[key] = obj[key];
    }
    return newObj;
}
export function objCopyPro(form, row) {
    let keys = Object.keys(form);
    keys.push('id')
    let newObj = {};
    keys.forEach(item => {
        for (let key in row) {
            if (key === item) {
                newObj[key] = row[key] === 'null' ? '' : row[key];
            }
        }
    })
    return newObj;
}

// 深克隆多层
export function cloneData(data) {
    const type = Object.prototype.toString.call(data)
    if (type === "[object Object]") {
        const newObj = {}
        Object.keys(data).forEach(key => newObj[key] = cloneData(data[key]))
        return newObj;
    } else if (type === "[object Array]") {
        return data.map(item => cloneData(item))
    }
    return data;
}
// 时间戳转详细时间
export function dateTime(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month =
        date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    let h = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
    let m =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
    let s =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
    return `${year}-${month}-${day} ${h}:${m}:${s}`;
}
// 时间戳转日期
export function dateTime2(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month =
        date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    return `${year}-${month}-${day}`;
}
// 弹框
export function showToast(msg, type, time) {
    Message({
        message: msg,
        type: type ? type : 'success',
        duration: time ? time : 1000
    })
}
// 数据词典返回text
export function reText(list, type) {
    let label = "-";
    list.forEach(item => {
        if (item.value == type) {
            label = item.label;
        }
    });
    return label;
}