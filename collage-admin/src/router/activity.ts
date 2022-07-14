import { RouteRecordRaw } from 'vue-router';

/** 活动管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/activity_setting',
  name: 'ActivitySetting',
  component: () => import('@/views/ActivitySetting/Index.vue'),
  meta: {
    title: '活动管理',
    // defaultShow:true,
    sort: 20
  },
  children: [
    {
      path: 'activity_list',
      name: 'ActivityList',
      component: () =>
        import('../views/ActivitySetting/ActivityList/Index.vue'),
      meta: {
        title: '活动列表'
        // defaultShow: true
      }
    },
    {
      path: 'activity_manage',
      name: 'ActivityManage',
      component: () =>
        import('../views/ActivitySetting/ActivityManage/Index.vue'),
      meta: {
        title: '活动配置'
        // defaultShow:true
      }
    },
    {
      path: 'activity_restriction_manage',
      name: 'ActivityRestrictionManage',
      component: () =>
        import('../views/ActivitySetting/ActivityRestrictionManage/Index.vue'),
      meta: {
        title: '活动限制'
        // defaultShow:true
      }
    },
    {
      path: 'thematic_manage',
      name: 'ThematicManage',
      component: () =>
        import('../views/ActivitySetting/ThematicManage/Index.vue'),
      meta: {
        title: '专题管理'
        // defaultShow:true
      }
    }
  ]
};

export default GeneralRouter;
