import { DirectiveBinding } from 'vue';

export default {
  mounted(el: any, binding: DirectiveBinding) {
    // el为绑定的元素，binding为绑定给指令的对象
    let width = '';
    let height = '';

    function isReize() {
      const style: CSSStyleDeclaration = (
        document.defaultView as WindowProxy & typeof globalThis
      ).getComputedStyle(el);
      if (width !== style.width || height !== style.height) {
        // 关键(这传入的是函数,所以执行此函数)
        binding.value({ width: style.width, height: style.height } as any);
      }
      width = style.width;
      height = style.height;
    }

    el.vueSetInterval = setInterval(isReize, 300);
  },
  unmounted(el: any) {
    clearInterval(el.vueSetInterval);
  },
};
