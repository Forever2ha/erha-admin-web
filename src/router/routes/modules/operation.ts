import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/operation',
  name: 'Operation',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'project',
      name: 'Project',
      component: () => import('@/views/operation/project/index.vue'),
    },
    {
        path: 'Server',
        name: 'Server',
        component: () => import('@/views/operation/server/index.vue'),
    },
  ],
};
