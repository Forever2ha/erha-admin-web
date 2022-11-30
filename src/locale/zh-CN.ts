import localeMessageBox from '@/components/message-box/locale/zh-CN';
import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeCrud from '@/components/crud/locale/zh-CN';

import appRoutes from '@/router/routes';
import localeSettings from './zh-CN/settings';

// eslint-disable-next-line import/no-mutable-exports
let localeZH = {
  '': '',
  'menu.dashboard': '仪表盘',
  'menu.system': '系统管理',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeWorkplace,
  ...localeCrud,
};

// 自动导入views/*/locale/ 下面的文件
const modules = import.meta.globEager('../views/*/locale/zh-CN.ts');
Object.keys(modules).forEach((key) => {
  const defaultModule = modules[key].default;
  if (!defaultModule) return;
  localeZH = { ...localeZH, ...defaultModule };
});

export default localeZH;
