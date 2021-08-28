import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import reactiveStorage from "vue-reactive-storage";
// import { firestorePlugin } from 'vuefire'
//
//
// Vue.use(firestorePlugin)

Vue.use(reactiveStorage, {
  data: [],
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
