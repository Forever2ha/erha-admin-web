import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/monitor',
  name: 'Monitor',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'onlineuser',
      name: 'Onlineuser',
      component: () => import('@/views/monitor/onlineuser/index.vue'),
      meta: {
        locale: 'menu.monitor.onlineuser',
      },
    },
  ],
};
