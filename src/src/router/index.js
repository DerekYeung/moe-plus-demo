import Vue from 'vue';
import Router from 'vue-router';
import routes from '@/router/pages';

Vue.use(Router);

routes.push({
  path: '/',
  redirect: '/module/index/index'
});

const router = new Router({
  routes: routes
});
// router.afterEach((to, from) => {
//   if (this.a) {
//     // this.a.app.isBacking = false;
//     // this.a.app.isForwarding = false;
//   }
// });
export default router;
