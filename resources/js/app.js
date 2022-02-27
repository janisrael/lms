import store from './store'
import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Vuex from 'vuex'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import VueRouter from 'vue-router'
import { routes } from './router/index';
import ElementUI from 'element-ui'
import { includes } from 'lodash';
import VueLazyload from 'vue-lazyload'
import vueVimeoPlayer from 'vue-vimeo-player'
// import 'video.js/dist/video-js.css'
import VueLazyImageLoading from 'vue-lazy-image-loading'
require('./bootstrap');
// require('admin-lte');

Vue.use(Vuex)
Vue.use(ElementUI, { locale })

window.Vue = require('vue');

Vue.use(VueRouter)
Vue.use(VueLazyload)
Vue.use(vueVimeoPlayer)
Vue.use(ElementUI, { locale })
Vue.prototype.$routers = routes
Vue.use(VueLazyImageLoading, {
  cache: true
})
const router = new VueRouter({
  routes,
  mode: 'hash',
})

Vue.component('index-component', require('./components/Layout/Index.vue').default);

const app = new Vue({
    el: '#app',
    store: store,
    router
});
