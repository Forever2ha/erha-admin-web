import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/operation',
  name: 'Operation',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'server',
      name: 'OperServer',
      component: () => import('@/views/operation/server/index.vue'),
    },
    {
      path: 'app',
      name: 'App',
      component: () => import('@/views/operation/app/index.vue'),
    },
    {
      path: 'deploy',
      name: 'Deploy',
      component: () => import('@/views/operation/deploy/index.vue'),
    },
    {
      path: 'history',
      name: 'History',
      component: () => import('@/views/operation/history/index.vue'),
    },
    {
      path: 'database',
      name: 'Database',
      component: () => import('@/views/operation/database/index.vue'),
    },
  ],
};
