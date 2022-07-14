import Axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { router } from '@/router';
import Bus from '@/utils/bus';
import { message } from 'ant-design-vue';

const NO_MESSAGE_API_LIST = ['/shanks-authorization-service/user/webPwdLogin'];

/**
 * 上一次响应错误的请求时间戳
 */
let lastErrorResponseTimestamp = 0;

/**
 * @description HTTP 错误码转错误提示文本
 * @param {AxiosResponse} response Axios response object
 */
const getErrorCode2text = (response: AxiosResponse): string => {
  /** http status code */
  const code = response.status;
  /** notice text */
  let message = 'Request Error';
  switch (code) {
    case 400:
      message = 'Request Error';
      break;
    case 401:
      message = 'Unauthorized, please login';
      break;
    case 403:
      message = '拒绝访问';
      break;
    case 404:
      message = '访问资源不存在';
      break;
    case 408:
      message = '请求超时';
      break;
    case 500:
      message = '位置错误';
      break;
    case 501:
      message = '承载服务未实现';
      break;
    case 502:
      message = '网关错误';
      break;
    case 503:
      message = '服务暂不可用';
      break;
    case 504:
      message = '网关超时';
      break;
    case 505:
      message = '暂不支持的 HTTP 版本';
      break;
    default:
      message = '位置错误';
  }
  return message;
};

/**
 * @returns  {AxiosResponse} result
 * @tutorial see more:https://github.com/onlyling/some-demo/tree/master/typescript-width-axios
 * @example
 * service.get<{data: string; code: number}>('/test').then(({data}) => { console.log(data.code) })
 */
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 展示 ANTD 错误弹窗
 * @param url 请求URL
 * @param errorMessage 错误信息
 */
const showErrorMessage = function showErrorMessage(
  errorMessage: string,
  url: string
) {
  /**
   * 请求时间间距（单位：毫秒）
   */
  const INTERVAL_TIME = 2000;

  /**
   * 当前时间戳
   */
  const CURRENT_TIMESTAMP = new Date().getTime();

  /**
   * 时间差（单位：毫秒）
   */
  const TIME_DIFFERENCE = CURRENT_TIMESTAMP - lastErrorResponseTimestamp;

  /**
   * 两次请求是否越过时间间距
   */
  const IS_CROSS_INTERVAL_TIME = TIME_DIFFERENCE > INTERVAL_TIME;

  /**
   * 是否为不予错误弹窗的请求
   */
  const IS_NO_MESSAGE_API = NO_MESSAGE_API_LIST.indexOf(url) !== -1;

  if (IS_CROSS_INTERVAL_TIME && !IS_NO_MESSAGE_API) {
    message.error(errorMessage);
  }

  lastErrorResponseTimestamp = INTERVAL_TIME;
};

/**
 *  @description 创建工厂方法创建 cancel token，用于token过期取消当前进行中的其它请求
 * */
const CancelToken = Axios.CancelToken.source();

/**
 * @description 请求发起前的拦截器
 * @returns {AxiosRequestConfig} config
 */
service.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const TOKEN = localStorage.getItem('accessToken');

  /** 全局添加cancelToken **/
  config.cancelToken = CancelToken.token;

  if (TOKEN) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
  }

  return config;
});

/**
 * @description 响应收到后的拦截器
 * @returns {}
 */
service.interceptors.response.use(
  /** 请求有响应 */
  async (response: AxiosResponse) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      const __text = getErrorCode2text(response);
      return Promise.reject(new Error(__text));
    }
  },
  /** 请求无响应 */
  async (error: AxiosError) => {
    let errorMessage: string =
      error?.response?.data?.message ||
      error.message ||
      error?.response?.data?.data ||
      '未预料的服务器内部错误';

    const { url } = error.config;

    const IS_TIMEOUT =
      errorMessage.indexOf('timeout') !== -1 ||
      errorMessage.indexOf('超时') !== -1;

    const IS_UNAUTHORIZED = error?.response?.status === 401;

    if (IS_TIMEOUT) {
      errorMessage = '请求超时，请稍后重试';
    }

    if (IS_UNAUTHORIZED) {
      if (errorMessage !== '未预料的服务器内部错误') {
        if (url !== '/authorization/oauth/token') {
          errorMessage = '登录过期，请重新登录';
        }
      }

      message.info('登录凭证已过期，请重新登录');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authorities');
      localStorage.removeItem('userInfo');
      Bus.$emit('login-state-change', false);
      router.replace('/login');
    }

    showErrorMessage(errorMessage, error.response?.config.url || '');

    return Promise.reject(new Error(errorMessage));
  }
);

export default service;
