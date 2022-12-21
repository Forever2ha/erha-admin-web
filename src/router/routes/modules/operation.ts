import { DEFAULT_LAYOUT } from "@/router/constans";

export default {
  path: "/operation",
  name: "Operation",
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: "project",
      name: "Project",
      component: () => import("@/views/operation/project/index.vue")
    },
    {
      path: "Server",
      name: "Server",
      component: () => import("@/views/operation/server/index.vue")
    },
    {
      path: "App",
      name: "App",
      component: () => import("@/views/operation/app/index.vue")
    },
    {
      path: "Deploy",
      name: "Deploy",
      component: () => import("@/views/operation/deploy/index.vue")
    },
    {
      path: "History",
      name: "History",
      component: () => import("@/views/operation/history/index.vue")
    },
    {
      path: "Database",
      name: "Database",
      component: () => import("@/views/operation/datebase/index.vue")
    }
  ]
};
