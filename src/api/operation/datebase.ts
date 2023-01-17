import axios from 'axios';

export interface OraDatabase {
  name: string;
  jdbcUrl: string;
  userName: string;
  pwd: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  typeDatabese: string;
}

export function testConnection(dbId: number) {
  return axios.post<boolean>(`/operation/database/testConnect/${dbId}`);
}
export function uploadSql(
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  },
  data: FormData,
  dbId: number
) {
  return axios.post(`/operation/database/upload/${dbId}`, data, config);
}
