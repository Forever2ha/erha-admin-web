import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import { isLogin } from '@/utils/auth';
import { useAppStore, useUserStore } from '@/store';

import setupPermissionGuard from './permission';
import setupServerPermissionGuard from './serverPermission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();

    // 如果有token但是没有菜单则先获取菜单并刷新个人信息
    if (appStore.appServerMenuConfig.length === 0 && isLogin()) {
      await appStore.fetchServerMenuConfig();
      await userStore.info();
    }

    // 如果没有token直接重定向到Login
    if (userStore.user === undefined && to.name !== 'login') {
      next({ name: 'login' });
    }

    // 分发路由变化
    setRouteEmitter(to);

    next();
  });
}

export default function createRouteGuard(router: Router) {
  // 路由变化会依次执行下面三个函数
  setupPageGuard(router);
  setupServerPermissionGuard(router);
  setupPermissionGuard(router);
}
