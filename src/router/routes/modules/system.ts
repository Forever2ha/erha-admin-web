import { DEFAULT_LAYOUT, PARENT_VIEW } from '@/router/constans';

export default {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 1,
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
      },
    },
    {
      path: 'dept',
      name: 'Dept',

      component: () => import('@/views/system/dept/index.vue'),
      meta: {
        locale: 'menu.system.dept',
      },
    },
    {
      path: 'job',
      name: 'Job',
      component: () => import('@/views/system/job/index.vue'),
      meta: {
        locale: 'menu.system.job',
      },
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('@/views/system/dict/index.vue'),
      meta: {
        locale: 'menu.system.dict',
      },
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: 'menu.system.menu',
      },
    },
    {
      path: 'quartz',
      name: 'Quartz',
      component: () => import('@/views/system/quartz/index.vue'),
      meta: {
        locale: 'menu.system.quartz',
      },
    },
  ],
};
