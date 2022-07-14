/*
 * @Author: your name
 * @Date: 2021-08-25 15:41:02
 * @LastEditTime: 2021-09-17 15:03:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \collage-admin\src\router\index.ts
 */
// import { clearPending } from '@/request/config/plugin';
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';

/** 自动加载其他路由模块 */
const files = require.context('.', true, /\.ts$/);
const modules: Array<RouteRecordRaw> = [];
files.keys().forEach(key => {
  if (key === './index.ts') return;
  modules.push(files(key).default);
});

export const routes: Array<RouteRecordRaw> = [
  ...modules,
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home/Index.vue'),
  //   meta: {
  //     title: '首页',
  //     shouldFilterWhenNotCurrentSemester: true
  //   }
  // },
  {
    path: '/',
    redirect: { name: 'Myclass' },
    meta: {
      title: '我的班级'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/layout/Login.vue'),
    meta: {
      title: '登录',
      shouldFilterWhenNotCurrentSemester: true,
      authentication: false
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/layout/403.vue'),
    meta: {}
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/layout/404.vue'),
    meta: {}
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {}
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // 切换路由时，取消还未请求完的接口
    // if(to.path !== '/login') {
    //   clearPending();
    // }
    console.log('from ', from, 'to ', to);
    // console.log('to ', to);

    const authorities = localStorage.getItem('authorities') || '';

    const authoritiesList = JSON.parse(authorities);
    const authoritiesListMap = authoritiesList.map((item: any) => {
      return item.name;
    });
    // 跳转无权限界面
    // 当前用户无菜单权限 && 跳转页面不是403、404、/、login && 跳转页面不是默认展示（不需要权限的一级菜单） && 不是二级菜单
    // next();
    if (to.matched.length && to.matched[0].redirect === '/404') {
      next({ path: '/404' });
    } else {
      if (
        !authoritiesListMap.includes(to.name) &&
        to.name !== '403' &&
        to.name !== '404' &&
        to.path !== '/' &&
        to.path !== '/login' &&
        !to.meta?.defaultShow &&
        !to.meta?.parentRoute
      ) {
        next({ name: '403', replace: true });
      } else {
        next();
      }
    }
  }
);
