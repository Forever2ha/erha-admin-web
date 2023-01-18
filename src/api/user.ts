import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
  uuid: string;
}

export interface LoginRes {
  token: string;
  userDetailsDto: UserState;
}

export interface LoginCaptcha {
  img: string;
  uuid: string;
}
// 获取验证码
export function getCaptcha() {
  return axios.get<LoginCaptcha>('/auth/code');
}
// 用户登录
export function login(data: LoginData) {
  return axios.post<LoginRes>('/auth/login', data);
}
// 用户登出
export function logout() {
  return axios.post<LoginRes>('/auth/logout');
}
// 获取用户信息
export function getUserInfo() {
  return axios.get<UserState>('/system/user/info');
}
export function switchRoles(name: string) {
  return axios.post('/system/user/switchRoles', { name });
}

// 获取当前角色菜单
export function getMenuList() {
  return axios.get<RouteRecordNormalized[]>('/system/menu/nowUser');
}

// 上传头像
export function userUploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/system/user/updateAvatar', data, config);
}
