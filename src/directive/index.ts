import { App } from 'vue';
import permission from './permission';
import sizeChange from './size-change';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('size-change', sizeChange);
  },
};
