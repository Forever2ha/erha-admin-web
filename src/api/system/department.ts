import axios from 'axios';
import { BaseField, BaseResp } from '@/api/baseType';

export interface DeptTree {
  children: DeptTree[];
  key: number;
  title: string;
}
export interface Dept extends BaseField {
  deptId: number;
  pid: number;
  subCount: number;
  name: string;
  deptSort: number;
  enabled: number;
}
export interface SummaryDept extends BaseField {
  id: number;
  pid: number;
  subCount: number;
  name: string;
  deptSort: number;
  enabled: number;
}

export function getDeptListTree() {
  return axios.get<DeptTree[]>('/system/dept/listTree');
}

export function getAllDept() {
  return axios.get<Dept[]>('/system/dept/all');
}

export function getChildrenDeptsById(deptId: number | null) {
  return axios.get<BaseResp<SummaryDept>>('/system/dept', {
    params: { deptId },
  });
}
