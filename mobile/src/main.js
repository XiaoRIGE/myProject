import Vue from 'vue';
import App from './App';
import uview from 'uview-ui';
import store from '@/store';

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});
Vue.use(uview);
app.$mount();
