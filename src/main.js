import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import Bia from '@/api/bia';

Vue.config.productionTip = false;

Vue.prototype.$bia = new Bia();

Vue.mixin({
  methods: {
    formatDate: (val) => {
      const date = new Date(Number(val * 1000));
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day < 10 ? `0${day}` : day}.
        ${month < 10 ? `0${month}` : month}.
        ${year}`;
    },
  },
});

new Vue({
  Vuelidate,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
