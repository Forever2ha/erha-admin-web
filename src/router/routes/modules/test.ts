import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/test',
  name: 'Test',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'student',
      name: 'Student',
      component: () => import('@/views/test/student/index.vue'),
      meta: {
        locale: 'menu.test.student',
      },
    },
  ],
};
