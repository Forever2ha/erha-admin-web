import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/tools',
  name: 'Tools',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.tools',
    requiresAuth: true,
  },
  children: [
    {
      path: 'generate',
      name: 'Generate',
      component: () => import('@/views/tools/generate/index.vue'),
      meta: {
        locale: 'menu.tools.generate',
      },
    },
  ],
};
