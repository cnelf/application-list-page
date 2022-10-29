import { Toast, Dialog } from 'vant';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';

/**
 * 轻提示
 * @param {Object | string} params
 * @returns {Object}
 */
export function showToast(params) {
  const options = {
    forbidClick: true
  };
  if (typeof params === 'string') {
    Object.assign(options, { message: params });
  } else {
    Object.assign(options, params);
  }
  return Toast(options);
}

/**
 * 显示loading
 * @param {Object | string} params
 * @returns {Object}
 */
export function showLoading(params) {
  const options = {
    message: '加载中...',
    loadingType: 'spinner',
    duration: 0,
    forbidClick: true
  };
  if (typeof params === 'string') {
    Object.assign(options, { message: params });
  } else {
    Object.assign(options, params);
  }
  return Toast.loading(options);
}

/**
 * 隐藏loading
 * @returns {Object}
 */
export function hideLoading() {
  return Toast.clear();
}

/**
 * 自动loading
 * @param {Function | Object} target
 * @param {Object} options
 * @returns {Promise}
 */
export function autoLoading(target, options = {}) {
  const action = target instanceof Function ? target() : target;
  if (!(action instanceof Promise)) {
    return action;
  }
  showLoading(options);
  return action.finally(() => {
    hideLoading();
  });
}

/**
 * 消息提示
 * @param {Object | string} params
 * @returns {Object}
 */
export function alert(params) {
  const options = {
    title: '提示',
    confirmButtonText: '我知道了'
  };
  if (typeof params === 'string') {
    Object.assign(options, { message: params });
  } else {
    Object.assign(options, params);
  }
  return Dialog.alert(options);
}

/**
 * 消息确认
 * @param {Object | string} params
 * @returns {Object}
 */
export function confirm(params) {
  const options = {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  };
  if (typeof params === 'string') {
    Object.assign(options, { message: params });
  } else {
    Object.assign(options, params);
  }
  return Dialog.confirm(options);
}
