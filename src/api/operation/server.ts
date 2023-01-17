import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface OraServer {
  id: number;
  account: string;
  ip: string;
  name: string;
  password: string;
  port: number;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}

// 测试服务器连接
export function testConnect(data: any) {
  return axios.post<boolean>('/operation/server/connect', data);
}

export function getOraServer() {
  return axios.get<BaseResp<OraServer>>(
    '/operation/server?pageSize=1000&currentPage=1'
  );
}
