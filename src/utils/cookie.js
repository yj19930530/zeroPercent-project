import Cookies from "js-cookie";
// 存 cookie
export function saveToken(key, data) {
    if (typeof data == 'object') {
        Cookies.set(key, JSON.stringify(data))
    } else {
        Cookies.set(key, data)
    }
}
// 删除 cookie
export function removeToken(key) {
    Cookies.remove(key)
}
// 删除 所有cookie
export function removeAll() {
    var keys = document.cookie.match(/[^ =;]+(?==)/g);
    keys.forEach(item => {
        Cookies.remove(item)
    })
}