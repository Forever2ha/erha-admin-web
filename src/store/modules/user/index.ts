import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  switchRoles,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    jobs: undefined,
    permissions: undefined,
    roles: undefined,
    user: undefined,
    nowRole: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
    userRolesName(state: UserState): string[] {
      const roleNames: string[] = [];
      state.roles?.forEach((r) => roleNames.push(r.name as string));
      return roleNames;
    },
    userPermissions(state: UserState): string[] {
      const per: string[] = [];
      state.permissions?.forEach((p) => per.push(p));
      return per;
    },
  },

  actions: {
    async switchRoles(name: string) {
      // todo 转换角色:菜单转换
      const res = await switchRoles(name);
      return res;
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch({ ...partial, nowRole: (partial.nowRole as any).name });
    },
    // 设置用户头像
    setAvatarPath(path: string) {
      (this.user as any).avatarName = path;
    },
    // Reset user's information
    resetInfo() {
      // 这个方法是重置state
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },
    // Login
    async login(loginForm: LoginData) {
      try {
        // 调用api获取数据
        const { data } = await userLogin(loginForm);
        // 设置token和用户信息
        this.setInfo(data.userDetailsDto);
        setToken(data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      await userLogout();
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
  },
});

export default useUserStore;
