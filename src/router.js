import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { languages } from './i18n';
import NotFound from './views/ErrorViews/404.vue';

Vue.use(Router);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home'),
    meta: {
      title: 'home',
      icon: 'info',
      noCache: true, // noCache 为 true 则页面不会被缓存下来
      hidden: true, // 在侧边导航栏是否显示
      access: true // 页面是否能访问，权限管理
    }
  }
];

const errorViews = [
  {
    path: '/404',
    name: 'notFound',
    component: NotFound,
    meta: { title: '404', hidden: true, access: true },
    alias: '*'
  }
];

const router = new Router({
  mode: 'history',
  routes
});

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  if (!to.meta.access && to.name) {
    next({ name: 'notFound' });
    return;
  }
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

const routeArr = [
  {
    path: '/user',
    name: 'user',
    component: () => import('./views/Order/User'),
    meta: { title: 'user2', icon: 'info' }
  },
  {
    path: '/order_about',
    component: () => import('./views/Order/index'),
    meta: { title: 'order_about', icon: 'info' },
    children: [
      {
        path: 'user1',
        name: 'user1',
        component: () => import('./views/Order/User'),
        meta: { title: 'user' }
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('./views/Order/Order'),
        meta: { title: 'order' }
      }
    ]
  }
];

// 根据后端返回的权限列表生成路由表，可访问则 route.meta.access 为 true
export function getRouteByRole(roleArr) {
  const roleMap = {};
  roleArr.map(item => (roleMap[item.action_code] = true));
  const routes = [...routeArr];
  function reduce(routeArr) {
    routeArr.map(route => {
      if (route.children) reduce(route.children);
      else if (roleMap[`Router:${route.name}`]) {
        route.meta.access = true;
      }
    });
  }
  reduce(routes);
  return routes.concat(errorViews);
}

export default router;
