import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/tools',
  name: 'Tools',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'generate',
      name: 'Generate',
      component: () => import('@/views/tools/generate/index.vue'),
    },
  ],
};
