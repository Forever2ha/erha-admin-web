import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface OraApp {
  id: number;
  name: string;
  uploadPath: string;
  deployPath: string;
  backupPath: string;
  port: number;
  startScript: string;
  deployScript: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}

export function getOraApp() {
  return axios.get<BaseResp<OraApp>>(
    '/operation/app?pageSize=10000&currentPage=1'
  );
}
