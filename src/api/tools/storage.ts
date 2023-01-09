import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface ToolLocalStorage {
  realName: string;
  name: string;
  suffix: string;
  path: string;
  type: string;
  size: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}
export interface ToolQiniuContent {
  bucket: string;
  name: string;
  size: string;
  type: string;
  url: string;
  suffix: string;
  updateTime: string;
}
export interface ToolQiniuConfig {
  configId: number;
  accessKey: string;
  bucket: string;
  host: string;
  secretKey: string;
  type: string;
  zone: string;
}

export function localUpload(
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  },
  data: FormData,
  name: string
) {
  return axios.post(`/tools/storage?name=${name}`, data, config);
}

export function qiniuUpload(
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  },
  data: FormData
) {
  return axios.post('/tools/storage/qiniu', data, config);
}
// 激活七牛云配置
export function activeQiniuCfg(id: number) {
  return axios.post(`/tools/storage/qiniuConfig/active/${id}`);
}

// 获取激活的配置
export function getActiveCfg() {
  return axios.get<BaseResp<ToolQiniuConfig>>(
    `/tools/storage/qiniuConfig?active=true`
  );
}
