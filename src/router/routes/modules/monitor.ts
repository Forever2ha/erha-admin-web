import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/monitor',
  name: 'Monitor',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'onlineuser',
      name: 'Onlineuser',
      component: () => import('@/views/monitor/onlineuser/index.vue'),
    },
    {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/monitor/log/index.vue'),
    },
    {
      path: 'server',
      name: 'Server',
      component: () => import('@/views/monitor/server/index.vue'),
    },
    {
      path: 'sqlMnt',
      name: 'SqlMnt',
    },
  ],
};
