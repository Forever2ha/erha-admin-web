import { DEFAULT_LAYOUT, PARENT_VIEW } from '@/router/constans';

export default {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
    },
    {
      path: 'dept',
      name: 'Dept',
      component: () => import('@/views/system/dept/index.vue'),
    },
    {
      path: 'job',
      name: 'Job',
      component: () => import('@/views/system/job/index.vue'),
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('@/views/system/dict/index.vue'),
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/system/menu/index.vue'),
    },
    {
      path: 'quartz',
      name: 'Quartz',
      component: () => import('@/views/system/quartz/index.vue'),
    },
  ],
};
