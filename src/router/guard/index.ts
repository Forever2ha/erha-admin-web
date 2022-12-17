import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';

import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 分发路由变化
    setRouteEmitter(to);
    next();
  });
}

export default function createRouteGuard(router: Router) {
  // 路由变化会依次执行下面三个函数
  setupPageGuard(router);
  setupPermissionGuard(router);
}
