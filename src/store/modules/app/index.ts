import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appServerMenuConfig(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifiInstance: NotificationReturn | null = null;
      try {
        const { data } = await getMenuList();

        (data as any[]).unshift({
          name: 'dashboard',
          meta: {
            locale: 'menu.dashboard',
            requiresAuth: true,
            icon: 'icon-dashboard',
            hideInMenu: false,
            order: 0,
          },
          children: [
            {
              name: 'Workplace',
              meta: {
                locale: 'menu.dashboard.workplace',
                requiresAuth: true,
                hideInMenu: false,
                roles: ['*'],
              },
            },
          ],
        });
        this.serverMenu = data;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifiInstance = Notification.error({
          id: 'menuNotice',
          content: '获取菜单失败！',
          closable: true,
        });
      }
    },
  },
});

export default useAppStore;
