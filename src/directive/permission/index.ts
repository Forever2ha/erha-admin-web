import { DirectiveBinding, isRef, unref } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { permissions } = userStore;

  if (Array.isArray(value)) {
    // 默认admin拥有全部权限
    if (value[0] !== 'admin') {
      value.unshift('admin');
    }

    if (value.length > 0) {
      let hasPermission = false;
      for (let i = 0; i < value.length; i += 1) {
        if (permissions?.includes(value[i])) {
          hasPermission = true;
          break;
        }
      }

      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
