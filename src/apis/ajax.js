import axios from 'axios';
import { Notification, Message } from 'element-ui';
import { i18n } from '../i18n';

// Ajax config
const config = {
  baseURL: `/api`,
  apiTimeout: 30 * 1000,
  responseCode: {
    success: 0,
    needLogin: 2
  },
  action: {
    toast: 'toast'
  }
};

const fetch = axios.create({
  baseURL: config.baseURL,
  timeout: config.apiTimeout,
  validateStatus: status => status >= 200 && status < 300
});

// 通用请求
function request(opts) {
  return new Promise((resolve, reject) => {
    function responseCallback(response) {
      const promise = handleResponseError(response);
      if (promise) promise.then(resolve, reject);
    }
    // 实际进行请求的方法
    function doRequest() {
      fetch(opts).then(resp => responseCallback(resp.data), reject);
    }
    doRequest();
  });
}

/**
 * 通用处理器
 * 用于处理通用的网络请求，如错误提示、dialog、页面跳转等等
 */
function handleResponseError(response) {
  const CODE = +response.code;
  const ACTION = response.action;
  return new Promise((resolve, reject) => {
    if (CODE !== config.responseCode.success) {
      Notification.error({
        // dangerouslyUseHTMLString: true,
        title: i18n.t('notify.error'),
        message: response.message
      });
      if (CODE === config.responseCode.needLogin) {
        setTimeout(() => {
          window.user && window.location.reload();
        }, 2000);
      }
      reject(response);
    }
    // 对 action 进行操作
    if (ACTION === config.action.toast) {
      CODE === config.responseCode.success &&
        Notification.success({
          title: i18n.t('notify.success'),
          message: response.message || i18n.t('notify.success')
        });
    }
    resolve(response.data);
  });
}

function post(url, data) {
  return request({
    method: 'POST',
    url,
    data
  });
}

function get(url) {
  return request({
    method: 'GET',
    url
  });
}

function upload(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    function responseCallback(response) {
      const promise = handleResponseError(response);
      if (promise) promise.then(resolve, reject);
    }
    // 实际进行请求的方法
    function doRequest() {
      const options = {
        url,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function(e) {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          onProgress && onProgress(e, percentage);
        }
      };
      // axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      fetch(options).then(resp => responseCallback(resp.data), reject);
    }
    doRequest();
  });
}

function download(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', config.baseURL + url, true);
  xhr.responseType = 'arraybuffer';
  Message.info({
    iconClass: 'el-icon-loading',
    message: `${i18n.t('msg.downloading')}...`,
    duration: 0
  });
  xhr.onload = function() {
    if (this.status === 200) {
      var filename = '';
      var disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1])
          filename = matches[1].replace(/['"]/g, '');
      }
      var type = xhr.getResponseHeader('Content-Type');

      var blob = new Blob([this.response], { type: type });
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
          // use HTML5 a[download] attribute to specify filename
          var a = document.createElement('a');
          // safari doesn't support this yet
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          window.location = downloadUrl;
        }
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100); // cleanup
      }
      Message.closeAll();
      Message.success({
        message: i18n.t('msg.exportSuccess')
      });
    } else {
      Message.closeAll();
      Message.error({
        message: i18n.t('msg.exportFail')
      });
    }
  };
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify(data));
}

export { post, get, upload, download };
