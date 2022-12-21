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
  ],
};