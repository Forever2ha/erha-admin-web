import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import hljsCommon from 'highlight.js/lib/common';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';
// highlight 的样式，依赖包，组件
import 'highlight.js/styles/atom-one-light.css';

const app = createApp(App);
// 注意：解决Vue使用highlight.js build打包发布后样式消失问题，原因是webpack在打包的时候没有把未被使用的代码打包进去，因此，在此处引用一下，看似无意义实则有用
// eslint-disable-next-line no-unused-expressions
hljsCommon.highlightAuto(
  '<h1>Highlight.js has been registered successfully!</h1>'
).value;

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(hljsVuePlugin);

app.mount('#app');
