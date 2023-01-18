import axios from 'axios';
import { BaseResp } from '@/api/baseType';

export interface Role {
  roleId: number;
  name: string;
  description: string;
  level: number;
  dataScope: string;
  createTime: string;
  updateTime: string;
  updateBy: string;
}

export function getRoleList() {
  return axios.get<BaseResp<Role>>('/system/role/all');
}

export function getMenuIdByRoleId(roleId: number) {
  return axios.get<number[]>('/system/roleMenu/menuIds', {
    params: { roleId },
  });
}

export function editRoleMenu(roleId: number, menuIdList: number[]) {
  return axios.put('/system/roleMenu', { roleId, menuIdList });
}
