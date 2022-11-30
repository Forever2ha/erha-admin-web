import localeMessageBox from '@/components/message-box/locale/en-US';
import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeCrud from '@/components/crud/locale/en-US';

import localeSettings from './en-US/settings';

// eslint-disable-next-line import/no-mutable-exports
let localeEN = {
  '': '',
  'menu.dashboard': 'Dashboard',
  'menu.system': 'System Control',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeWorkplace,
  ...localeCrud,
};

// 自动导入views/*/locale/ 下面的文件
const modules = import.meta.globEager('../views/*/locale/en-US.ts');
Object.keys(modules).forEach((key) => {
  const defaultModule = modules[key].default;
  if (!defaultModule) return;
  localeEN = { ...localeEN, ...defaultModule };
});

export default localeEN;
