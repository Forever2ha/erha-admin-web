import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useAppStore, useUserStore } from '@/store';
import { clearToken, isLogin } from '@/utils/auth';
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router';

const whiteList = [
  { name: 'notFound', children: [], meta: { roles: ['*'] } },
  { name: 'login', children: [], meta: { roles: ['*'] } },
  { name: '403Forbidden', children: [], meta: { roles: ['*'] } },
  { name: '500InternalError', children: [], meta: { roles: ['*'] } },
  { name: 'Setting', children: [], meta: { roles: ['*'] } },
];
function mergeMetaInfo(
  source: any[],
  des: any[],
  parent: any | null,
  router: any
) {
  if (!source || !des) return;

  const map: { [key: string]: any } = {};
  source.forEach((item) => {
    map[item.name as string] = item;
  });
  des.forEach((item) => {
    const aim = map[item.name as string];

    if (aim) {
      if (item.children) {
        mergeMetaInfo(aim.children as any, item.children, aim, router);
      }
      aim.meta = item.meta;
      if (parent) {
        router.addRoute(parent as any, aim);
      } else router.addRoute(aim);
    }
  });
}
function findRouter(router: Router, name: string) {
  let res = null;
  const routes = router.getRoutes();

  let success = false;
  const find = (rts: RouteRecordRaw[], n: string) => {
    if (success) return;
    rts.forEach((rt) => {
      if (rt.name === n) {
        res = rt;
        success = true;
      }
      if (rt.children) {
        find(rt.children, name);
      }
    });
  };
  find(routes, name);

  return res;
}

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const appStore = useAppStore();

    if (to.name === '500InternalError') {
      next();
      NProgress.done();
      return;
    }

    // 登录了自动跳转
    if (isLogin() && to.name === 'login') {
      next({ name: 'Workplace' });
      NProgress.done();
      return;
    }

    if (!isLogin()) {
      if (to.name === 'login') next();
      else next({ name: 'login' });
      NProgress.done();
      return;
    }

    // 如果有token但是没有菜单则先获取菜单并刷新个人信息
    if (appStore.appServerMenuConfig.length === 0 && isLogin()) {
      await appStore.fetchServerMenuConfig();

      // 重新组织router路由的meta信息
      mergeMetaInfo(
        router.options.routes,
        appStore.appServerMenuConfig as any,
        null,
        router
      );
      const findRouter1 = findRouter(router, to.name as any);
      to.meta = (findRouter1 as any).meta;
      await userStore.info();
    }

    // 如果没有token直接重定向到Login
    if (userStore.user === undefined && to.name !== 'login') {
      next({ name: 'login' });
      return;
    }

    const serverMenuConfig = [...appStore.appServerMenuConfig, ...whiteList];
    let hasPermission = false;
    while (serverMenuConfig.length) {
      const element = serverMenuConfig.shift();
      if (element?.name === to.name) {
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

    if (!hasPermission) next({ name: '403Forbidden' });
    else next();
    NProgress.done();
  });
}
