// 导入axios包
import axios, { type AxiosResponse } from 'axios';
import { useMessage } from 'naive-ui'

const message = useMessage()
// 配置请求的根路径
const protocol = window.location.protocol; // 协议(http:)
const host = window.location.host; // 主机(主机名+端口号)(localhost:8080)
const reg = /^localhost+/;
if (reg.test(host)) {
  //若本地项目调试使用
  axios.defaults.baseURL = 'http://localhost:8080';
  // axios.defaults.baseURL = 'http://172.17.137.235:8030';
  // axios.defaults.baseURL = 'https://cfmock.test.bestpay.net/';
} else {
  //动态请求地址
  axios.defaults.baseURL = protocol + '//' + host;
}
// 允许携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 接口错误处理
function errHandler(err: string) {
  message.error('接口调用失败: ' + err );
}

// 接口响应拦截处理
function responseHandler(response: AxiosResponse<any, any>) {
  if (response && response.data && response.data.code === 9999) {
    // 若错误码是9999则判断未登录
    message.error(response.data.msg);
    return Promise.reject('接口响应: ' + response.data);
  } else {
    return response;
  }
}

const request = axios.create();
request.defaults.withCredentials = true;
request.interceptors.response.use(responseHandler, errHandler);

const http = {
  baseURL: axios.defaults.baseURL,
  get: request.get,
  post: request.post,
};

export default http;
