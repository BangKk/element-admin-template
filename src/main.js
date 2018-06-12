import 'normalize.css';
import Vue from 'vue';
import VueBus from 'vue-bus';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router';
import { loadLanguageAsync, CN } from '@/i18n';
import App from '@/App.vue';
import localStorage from '@/libs/localStorage';

Vue.use(VueBus);

Vue.config.productionTip = false;

const lang = localStorage.get('lang') || CN; // 默认值：中文

loadLanguageAsync(lang).then(i18n => {
  new Vue({
    i18n,
    router,
    render: h => h(App)
  }).$mount('#app');
});
