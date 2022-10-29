import axios from 'axios';
import qs from 'qs';
import { Dialog } from 'vant';
import 'vant/es/dialog/style';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60 * 1000
});

service.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    httpErrorStatusHandler(error);
    return Promise.reject(error);
  }
);

/**
 * 处理HTTP状态码异常
 * @param {*} error
 */
function httpErrorStatusHandler(error) {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时！';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break;
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
  error.message = message;
  Dialog({ message });
}

function request(config) {
  config.method = config.method || 'get';
  if (config.method.toLowerCase() === 'get') {
    config.params = config.data;
  }
  config.headers = config.headers || {};
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    config.data = qs.stringify(config.data);
  }
  return service(config);
}

['get', 'delete', 'head', 'options', 'post', 'put', 'patch'].forEach((type) => {
  request[type] = (url, options) => {
    return request({ url, method: type, ...options });
  };
});

export default request;
