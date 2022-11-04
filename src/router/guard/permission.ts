import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useAppStore, useUserStore } from '@/store';
import { clearToken, isLogin } from '@/utils/auth';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const userStore = useUserStore();
    async function crossroads() {
      const Permission = usePermission();
      // 四种情况为true: 1.requireAuth=false 2.route.meta.roles不存在 3.route.meta.roles=['*'] 4.用户roles在route.meta.roles中
      if (Permission.accessRouter(to)) {
        next();
      } else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.nowRole
        ) || {
          name: 'notFound',
        };
        next(destination);
      }
      NProgress.done();
    }

    // 如果有token但是没有菜单则先获取菜单
    const appStore = useAppStore();
    if (appStore.appServerMenuConfig.length === 0 && isLogin()) {
      await appStore.fetchServerMenuConfig();
    }

    if (isLogin()) {
      if (userStore.roles) {
        crossroads();
      } else {
        try {
          await userStore.info();
          crossroads();
        } catch (error) {
          clearToken();
          next({
            name: 'login',
          });
          NProgress.done();
        }
      }
    } else if (to.name === 'login') {
      next();
      NProgress.done();
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
