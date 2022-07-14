import store from '@/store';
import { BASE_URL, authType } from '@/request';
import { sendNativeEvents, onNativeEvents } from './events';

/**
 * 参数序列化
 * */
const stringifyParams = (params) => {
  if (typeof params === 'object') {
    return JSON.stringify(params);
  }
  if (typeof params === 'function') {
    uni.showToast({
      title: '参数格式不正确',
      icon: 'none',
      mask: true
    });
    return;
  }
  return params;
};

const isExistence = (method) => {
  // 验证是否定义该方法的描述信息
  return onNativeEvents[method] && onNativeEvents[method].description;
};

/**
 * 小程序向App发送事件
 * */
const events = {};
Object.keys(sendNativeEvents).forEach((method) => {
  events[method] = (...args) => {
    return new Promise((resolve, reject) => {
      try {
        let query = args[0] || {};
        const { senUser, sendBaseUrl } = sendNativeEvents[method];
        // 是否需要传递用户信息
        if (senUser === true) {
          query = Object.assign({}, query, {
            userInfo: store.state.app.userInfo
          });
          if (!query.userInfo.semesterId) {
            query.userInfo.semesterId = (
              store.state.semester.currentSemester || {}
            ).id;
          }
        }
        // 是否传递请求环境域名
        if (sendBaseUrl) {
          query = Object.assign({}, query, {
            baseUrl: BASE_URL,
            authType
          });
        }
        console.log('native-query:', query);
        uni.sendNativeEvent(method, stringifyParams(query), (cbResult) => {
          let result = cbResult;
          // 是否需要JSON序列化
          if (args.includes('parse') && query !== 'parse')
            if (typeof result === 'string') {
              result = JSON.parse(result);
            }

          if (args.length > 1) {
            // 是否存在回调处理函数
            const newArgs = args.slice(1, args.length);
            const fn = newArgs.find((p) => typeof p === 'function');
            if (fn && typeof fn === 'function') {
              fn(result);
            } else {
              resolve(result);
            }
          } else {
            resolve(result);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };
});

/**
 * @description 小程序监听宿主App发送事件
 * */
export const onNativeEventReceive = (event) =>
  new Promise((resolve, reject) => {
    if (!event) {
      reject('请选择要监听的事件名称');
      return;
    }
    if (!isExistence(event)) {
      reject(`请先在目录src/nativeEvent/events.js文件中配置${event}事件信息`);
      return;
    }
    try {
      uni.onNativeEventReceive((event = event, data) => {
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });

export default events;
