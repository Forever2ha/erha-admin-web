import axios from 'axios';

export interface OraDeploy {
  deployId: number;
  appId: number;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  serverId: number;
}

export function startServer(deployId: number) {
  return axios.post<string>(`/operation/deploy/startServer/${deployId}`);
}

export function checkServerStatus(deployId: number) {
  return axios.post<string>(`/operation/deploy/serverStatus/${deployId}`);
}

export function stopServer(deployId: number) {
  return axios.post<string>(`/operation/deploy/stopServer/${deployId}`);
}

export function reductionServer(deployHisId: number) {
  return axios.post<string>(`/operation/deploy/serverReduction/${deployHisId}`);
}

export function uploadApp(
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  },
  data: FormData,
  deployId: number
) {
  return axios.post(`/operation/deploy/upload/${deployId}`, data, config);
}
