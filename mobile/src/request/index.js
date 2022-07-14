import { getToken, logOut, getUserInfo, getNetworkType } from '@/utils/common';
import { refreshToken as refreshTokenRequest } from './api/authorization';
import store from '@/store';
import { BASE_URL_LIST } from '@/setting';
export const BASE_URL = BASE_URL_LIST.wDev;
export const authType = 'Bearer';
const TIMEOUT = 200000;
const BAST_HEADER = {
  'Content-Type': 'application/json'
};
let _errMessage = '';
// 13300000001
//  是否正在刷新token的标记
let isRefreshing = false;

// 需要重试的队列
let requests = [];

// 设置Authorization
export const setToken = (auth, token) => {
  if (token) return `${auth} ${token}`;
  return '';
};

/**
 * @description loading状态控制，存在同时请求多个接口请求只展示一个loading
 */
const loadingController = {
  isLoading: false,
  key: ''
};

/**
 * @description 接口加载显示loading状态
 * */
const showLoadingMethod = (url, method, loading) => {
  const { isLoading } = loadingController;
  if (loading && !isLoading) {
    uni.showLoading({
      title: '加载中'
    });
    loadingController.isLoading = true;
    loadingController.key = url + method;
  }
};

/**
 * @description 关闭loading
 * */
const hiddenLoadingMethod = (url, method) => {
  const { isLoading, key } = loadingController;
  if (isLoading && key === url + method) {
    uni.hideLoading();
    loadingController.isLoading = false;
  }
};

/**
 * @description 接口请求错误提示
 * */
const showToast = (message) => {
  uni.showToast({
    title: message,
    duration: 800,
    icon: 'none'
  });
};

/**
 * @description 刷新token请求
 * */
const refreshToken = async (resolve, options) => {
  const { refreshToken } = getUserInfo() || {};
  const reLaunch = () => {
    isRefreshing = false;
    requests = [];
    logOut();
  };
  // 不存在 refreshToken
  if (!refreshToken) return reLaunch();

  // 刷新token
  try {
    const res = await refreshTokenRequest({ refreshToken });
    if (res.code === 0 && res.data) {
      store.commit('app/REFRESH_TOKEN', res.data);
      // 刷新成功后重新加载之前的接口
      await requests.forEach((request) => request());
    } else {
      reLaunch();
    }
    isRefreshing = false;
    requests = [];
    resolve(request(options));
  } catch (err) {
    reLaunch();
  }
};

const request = (options) => {
  // 判断网络状态，无网络时提示用户
  const noeNetWork = getNetworkType('none');
  if (noeNetWork) {
    showToast('当前没有网络，请连接网络');
    return;
  }
  const { url, method, data, header, loading, hiddenToast = false } = options;
  return new Promise((resolve, reject) => {
    showLoadingMethod(url, method, loading);
    const URL = url.includes('http://') ? url : BASE_URL + url;
    uni.request({
      url: URL,
      data,
      method,
      timeout: TIMEOUT,
      header: Object.assign(
        {},
        {
          Authorization: setToken(authType, getToken()),
          Organization: (getUserInfo() || {}).schoolId
            ? getUserInfo().schoolId
            : ''
        },
        BAST_HEADER,
        header,
        hiddenToast
      ),
      success(response) {
        hiddenLoadingMethod(url, method);
        _errMessage =
          (response.data && (response.data.message || response.data.error)) ||
          '加载失败，请检查网络环境';
        if (response.statusCode === 200) {
          if (response.data.code !== 0) {
            if (!hiddenToast) showToast(_errMessage);
          }
          resolve(response.data);
        } else if (response.statusCode === 401) {
          // 登录过期
          _errMessage = '登录过期';

          // token过期刷新token
          if (!isRefreshing) {
            isRefreshing = true;
            return refreshToken(resolve, options);
          }
          // 过期接口放进队列中，等待刷新token后重新请求
          requests.push(() => resolve(request(options)));
        } else if (response.statusCode === 503) {
          _errMessage = '服务器开小差了';
          showToast(_errMessage);
          reject(response.data);
        } else {
          if (!hiddenToast) showToast(_errMessage);
          reject(response.data);
        }
      },
      fail(err) {
        hiddenLoadingMethod(url, method);
        if (!hiddenToast) {
          showToast('加载失败，请检查网络环境');
        }
        reject({ type: 'fail', err });
      }
    });
  });
};

export const get = ({
  url,
  data = null,
  header = null,
  loading = true,
  hiddenToast = false
}) => {
  return request({
    url,
    method: 'GET',
    data,
    header,
    loading,
    hiddenToast
  });
};

export const post = ({
  url,
  data = null,
  header = null,
  loading = true,
  hiddenToast = false
}) => {
  return request({
    url,
    data,
    method: 'POST',
    header,
    loading,
    hiddenToast
  });
};

export const put = ({
  url,
  data = null,
  header = null,
  loading = true,
  hiddenToast = false
}) => {
  return request({
    url,
    data,
    method: 'PUT',
    header,
    loading,
    hiddenToast
  });
};
