/* 合法uri*/
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

/* 小写字母*/
export function validLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}
// 地区名称
export const DEPT_NAME = (rule, value, callback) => {
    const regExp = /^[\u4e00-\u9fa5\\0-9\\A-Za-z\\_-]{1,20}$/
    if (!value) return callback(new Error('不能为空'));
    if (regExp.test(value) === false) {
        callback(new Error('请输入中文、数字、大小写字母或下划线'))
    } else {
        callback()
    }
}
// 用户名
export const USER_NAME = (rule, value, callback) => {
    const regExp = /^[0-9\\A-Za-z\\_-]{1,20}$/
    if (!value) return callback(new Error('不能为空'));
    if (regExp.test(value) === false) {
        callback(new Error('请输入长度不超过20的数字、大小写字母或下划线'))
    } else {
        callback()
    }
}

// 姓名
export const NAME = (rule, value, callback) => {
    const regExp = /^[\u4e00-\u9fa5\\A-Za-z]{1,10}$/
    if (regExp.test(value) === false) {
        callback(new Error('请输入长度不超过10的中文或大小写字母'))
    } else {
        callback()
    }
}
// 数字验证
export const NUMBER = (rule, value, callback) => {
    const regExp = /^\d+(\.\d+)?$/;
    if (value === '') return
    if (regExp.test(value) === false) {
        callback(new Error('请输入数字或最多两位小数'))
    } else {
        callback()
    }
}
// 数字验证
export const NUMBERMUST = (rule, value, callback) => {
    const regExp = /^\d+(\.\d+)?$/;
    if (regExp.test(value) === false) {
        callback(new Error('请输入数字或最多两位小数'))
    } else {
        callback()
    }
}

// 验证身份证
export const SHENFENZHENG = (rule, value, callback) => {
    const regExp = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (regExp.test(value) === false) {
        if (value) {
            callback(new Error('身份证格式不正确'))
        } else {
            callback(new Error('身份证不能为空'))
        }
    } else {
        callback()
    }
}
// 手机验证
export const PHONE = (rule, value, callback) => {
    const regExp = /^([1][3,4,5,6,7,8,9])\d{9}$/
    if (regExp.test(value) === false) {
        callback(new Error('请输入正确的手机号码'))
    } else {
        callback()
    }
}
// 邮箱验证
export const E_MAIL = (rule, value, callback) => {
    const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (regExp.test(value) === false) {
        callback(new Error('请输入正确的邮箱格式'))
    } else {
        callback()
    }
}
// 密码验证
export const PASSWORD = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('不能为空'));
        return
    }
    const regExp = /^[0-9\\A-Za-z]{6,20}$/
    if (regExp.test(value) === false) {
        callback(new Error('密码由不超过6-20的数字和大小写字母组成'))
    } else {
        callback()
    }
}
// 备注
export const ROLE_REMARK = (rule, value, callback) => {
    if (value === '') return;
    const regExp = /^.{1,300}$/
    if (regExp.test(value) === false) {
        callback(new Error('备注不超过200位的中文、数字和大小写字母以及标点组成'))
    } else {
        callback()
    }
}