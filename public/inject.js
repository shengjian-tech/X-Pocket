//create by yjs
let _requestId = 0
let _handlers = {}
window.ethereum = {
	request: async function (args) {
		if (!args || typeof args !== 'object' || Array.isArray(args)) {
			console.log('应为单个非数组对象参数')
		}

		const {
			method,
			params
		} = args;
		if (typeof method !== 'string' || method.length === 0) {
			console.log("'method'属性必须是非空字符串")
			return
		}
		if (
			params !== undefined &&
			!Array.isArray(params) &&
			(typeof params !== 'object' || params === null)
		) {
			console.log("如果提供了'params'属性，则该属性必须是对象或数组")
			return
		}
		return _postMessage('EXTERNAL_REQUEST', args);
	}
}

function _postMessage(message, request, subscriber, reqId) {

	return new Promise(function (resolve, reject) {
		const id = reqId || `${Date.now()}.${++_requestId}`;
		_handlers[id] = {
			reject,
			resolve,
			subscriber
		};
		window.postMessage({
			id,
			message,
			origin: 'POCKET_PROVIDER',
			request: request,
		}, '*');
	})
}
let _baiduRequestId = 0
window.xuper = {
	request: async function (args) {
		if (!args || typeof args !== 'object' || Array.isArray(args)) {
			console.log('应为单个非数组对象参数')
		}

		const {
			method,
			params
		} = args;
		if (typeof method !== 'string' || method.length === 0) {
			console.log("'method'属性必须是非空字符串")
			return
		}
		if (
			params !== undefined &&
			!Array.isArray(params) &&
			(typeof params !== 'object' || params === null)
		) {
			console.log("如果提供了'params'属性，则该属性必须是对象或数组")
			return
		}
		return _baiduPostMessage('EXTERNAL_REQUEST', args);
	}
}

function _baiduPostMessage(message, request, subscriber, reqId) {
	return new Promise(function (resolve, reject) {
		const id = reqId || `${Date.now()}.${++_baiduRequestId}`;
		_handlers[id] = {
			reject,
			resolve,
			subscriber
		};
		window.postMessage({
			id,
			message,
			origin: 'POCKET_PROVIDER',
			request: request,
			type: "baidu"
		}, '*');
	})
}

function md5(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
async function handler(request) {
	window.postMessage(request, '*');
}

window.addEventListener('message', ({
	data,
	source,
}) => {
	if (source !== window ||
		data.origin !== 'POCKET_BACKGROUND') {
		return;
	}
	if (data.id) {
		handleResponse(data);
	}
});

function handleResponse(data) {
	const _handler = _handlers[data.id];
	// console.log(data)
	if (!_handler) {
		return;
	}
	if (data.origin != "POCKET_BACKGROUND") {
		return;
	}
	_handler.resolve(data.response);
}

function initHtml(data) {
	var panel = document.createElement('div');
	panel.className = 'chrome-plugin-demo-panel';
	panel.innerHTML = "<div>" + data + "</div>";
	document.body.appendChild(panel);
}