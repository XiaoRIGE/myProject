import { RouteRecordRaw } from 'vue-router';

/** 申诉管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/appeal_manage',
  name: 'AppealManage',
  component: () => import('@/views/AppealManage/Index.vue'),
  meta: {
    title: '申诉管理',
    // defaultShow: true,
    sort: 75
  },
  children: [
    {
      path: 'running_appeal',
      name: 'RunningAppeal',
      component: () => import('../views/AppealManage/RunningAppeal/Index.vue'),
      meta: {
        title: '跑步申诉'
        // defaultShow: true
      }
    },
    {
      path: 'appeal_detail',
      name: 'appealDetail',
      component: () => import('../views/AppealManage/AppealDetail/Index.vue'),
      meta: {
        title: '申诉详情',
        parentRoute: {
          path: 'running_appeal',
          title: '跑步申诉'
        }
      }
    }
  ]
};

export default GeneralRouter;
