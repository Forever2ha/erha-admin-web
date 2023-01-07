import axios from 'axios';

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

export function fileUploadApi(
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  },
  data: FormData,
  name: string
) {
  return axios.post(`/tools/storage?name=${name}`, data, config);
}
