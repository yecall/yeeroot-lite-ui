import Vue from 'vue'
import App from './App.vue'
import I18n from 'vue-i18n';
import loc from './i18n/index';
import router from './router';
import './assets/css/reset.css'
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueClipboards from 'vue-clipboard2';
vueClipboards.config.autoSetContainer = true;
// import './assets/js/rem.js'
Vue.config.productionTip = false
Vue.use(I18n);
Vue.use(element);
Vue.use(vueClipboards)

const i18n = new I18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
      en: loc.en,
      'zh': loc['zh']
  }
});
new Vue({
  i18n,
  router,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')