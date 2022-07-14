import { RouteRecordRaw } from 'vue-router';

/** APP配置路由 */
const GeneralRouter: RouteRecordRaw = {
  path: '/app_config',
  name: 'AppConfig',
  component: () => import('@/views/AppConfig/Index.vue'),
  meta: {
    title: 'APP配置',
    // defaultShow:true,
    sort: 70
  },
  children: [
    {
      path: 'Banner_Config',
      name: 'BannerConfig',
      component: () => import('@/views/AppConfig/BannerConfig/Index.vue'),
      meta: {
        title: 'Banner配置'
        // defaultShow:true
      }
    },
    {
      path: 'Notice_Config',
      name: 'NoticeConfig',
      component: () => import('@/views/AppConfig/NoticeConfig/Index.vue'),
      meta: {
        title: '学校通知配置',
        defaultShow: true
      }
    }
  ]
};

export default GeneralRouter;
