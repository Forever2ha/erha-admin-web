import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        userStore.nowRole === '超级管理员' || // 超级管理员放行
        !route.meta?.requiresAuth || // 不需要权限放行
        !route.meta?.roles || // 不需要角色放行
        route.meta?.roles?.includes('*') || // 所有角色放行
        route.meta?.roles?.some((val) => {
          // 用户的角色在路由允许的角色中放行
          return userStore.userRolesName?.includes(val);
        })
      );
    },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
