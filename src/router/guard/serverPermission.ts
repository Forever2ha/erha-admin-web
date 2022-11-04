import type { Router, RouteRecordNormalized } from 'vue-router';
import { useAppStore, useUserStore } from '@/store';
import { has } from 'lodash';
import { isLogin } from '@/utils/auth';

const whiteList = [
  { name: 'notFound', children: [], meta: { roles: ['*'] } },
  { name: 'login', children: [], meta: { roles: ['*'] } },
  { name: '403Forbidden', children: [], meta: { roles: ['*'] } },
  { name: '500InternalError', children: [], meta: { roles: ['*'] } },
];

export default function setupServerPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // A simple example 简单示例
    // 针对来自服务端的菜单配置进行处理
    // Handle routing configuration from the server
    // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
    // Refine the permission logic from the server's menu configuration as needed
    const appStore = useAppStore();
    const userStore = useUserStore();

    if (appStore.menuFromServer) {
      const serverMenuConfig = [...appStore.appServerMenuConfig, ...whiteList];

      let exist = false;
      let hasPermission = false;
      while (serverMenuConfig.length) {
        const element = serverMenuConfig.shift();
        if (element?.name === to.name) {
          exist = true;
          const userPer = userStore.permissions as string[];
          const routerPer = (element as any).meta.roles;
          for (let i = 0; i < routerPer.length; i += 1) {
            if (routerPer[i] === '*') {
              hasPermission = true;
              break;
            }
            if (userPer.includes('admin') || userPer.includes(routerPer[i])) {
              hasPermission = true;
              break;
            }
          }
          break;
        }

        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }

      if (exist && !hasPermission) {
        next({ name: '403Forbidden' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
}
