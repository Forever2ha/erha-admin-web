import axios from 'axios';
import { BaseField } from '@/api/baseType';

export interface SingleDictDetail extends BaseField {
  detailId: number;
  dictId: number;
  label: string;
  value: string;
  dictSort: number;
}
export interface Dict extends BaseField {
  dictId: number;
  name: string;
  description: string;
}

export function getDictDetail(dictName?: string) {
  return axios.get<SingleDictDetail[]>('/dictDetail', { params: { dictName } });
}

export function getDict() {
  return axios.get('/dict?currentPage=1&pageSize=9999');
}
