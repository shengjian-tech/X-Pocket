export function setStorage(key, data) {
    if (!ifChrome()) {
        return
    }
    let obj = {}
    obj[key] = data
    chrome.storage.sync.set(obj, function () {
        console.log('storage保存成功');
    });
}
export function getStorage(key, data) {
    if (!ifChrome()) {
        return
    }
    let obj = {}
    obj[key] = data
    chrome.storage.sync.get(obj, function () {
        console.log('storage保存成功');
    });
}

export function removeStorage(key) {
    if (!ifChrome()) {
        return
    }
    chrome.storage.sync.remove(key, function () {
        console.log('storage:' + key + '删除成功');
    });
}
export function clearStorage() {
    if (!ifChrome()) {
        return
    }
    chrome.storage.sync.clear(function () {
        console.log('storage:清除成功');
    });
}
export function ifChrome() {
    if (chrome.storage) {
        return true
    }else{
        return false
    }
}