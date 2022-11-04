import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Alert, Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { clearToken, getToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // do something

    return Promise.reject(error);
  }
);
let hasWarningModal = false;
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // 放行excel下载的文件
    if (
      (response.data as any).type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return res;
    }
    const tokenValid = ![40005].includes(res.code);
    // 40006是crud异常,由crud组件处理,
    if (![20000, 40006].includes(res.code)) {
      // 40004登录失败,40000请求不合法,data中有具体原因
      if ([40004, 40000].includes(res.code)) {
        Message.error({
          content: `${res.msg}:${res.data ? res.data : ''}` || 'Error',
          duration: 5 * 1000,
        });
        return Promise.reject(new Error((res.data as string) || 'Error'));
      }

      Message.error({
        content: `${res.msg}:${response.request.responseURL}` || 'Error',
        duration: 5 * 1000,
      });

      // 40005:token过期或者不存在

      if (!tokenValid) {
        if (!hasWarningModal) {
          const userStore = useUserStore();
          removeRouteListener();
          clearToken();
          userStore.resetInfo();

          Modal.warning({
            title: '信息失效',
            content: `您已经登出：${res.msg}`,
            okText: '确定',
            onOk() {
              window.location.reload();
            },
          });
          hasWarningModal = true;
        }
      }
      return Promise.reject(new Error((res.msg as string) || 'Error'));
    }
    if (hasWarningModal) {
      hasWarningModal = false;
    }
    return res;
  },
  (error) => {
    const resp = error.response;
    Message.error({
      content: error.msg || `请求失败:无法连接到后端接口:${resp.data.path}`,
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
