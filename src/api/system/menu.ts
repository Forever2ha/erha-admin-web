import axios from 'axios';

export interface Menu {
  cache: boolean;
  createBy: string;
  createTime: string;
  hidden: boolean;
  icon: string;
  id: number;
  iframe: boolean;
  locale: string;
  name: string;
  order: number;
  path: string;
  permission: string;
  pid: number;
  subCount: number;
  title: string;
  type: number;
  updateBy: string;
  updateTime: string;
  children: Menu[];
}

export function getMenuTree() {
  return axios.get<Menu[]>('/menu');
}
