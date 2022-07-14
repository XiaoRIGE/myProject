import { RouteRecordRaw } from 'vue-router';

/** 课外配置路由 */
const GeneralRouter: RouteRecordRaw = {
  path: '/extracurricular_config',
  name: 'ExtracurricularConfig',
  component: () => import('@/views/ExtracurricularConfig/Index.vue'),
  meta: {
    title: '课外配置',
    // defaultShow:true,
    sort: 50
  },
  children: [
    {
      path: 'course_running_rules',
      name: 'RunningRules',
      component: () =>
        import('../views/ComprehensiveSetting/RunningRulesSetting/Index.vue'),
      meta: {
        title: '跑步配置'
        // defaultShow:true
      }
    },
    {
      path: 'physical_test_config',
      name: 'PhysicalTestConfig',
      component: () =>
        import('@/views/ExtracurricularConfig/PhysicalTestConfig/Index.vue'),
      meta: {
        title: '体测配置'
        // defaultShow:true
      }
    },
    {
      path: 'ai_sport_config',
      name: 'AiSportConfig',
      component: () =>
        import('@/views/ExtracurricularConfig/AiSportConfig/Index.vue'),
      meta: {
        title: 'AI运动配置'
        // defaultShow: true
      }
    },
    {
      path: 'face_sport_config',
      name: 'FaceSportConfig',
      component: () =>
        import('@/views/ExtracurricularConfig/FaceSportData/Index.vue'),
      meta: {
        title: '岗亭打卡记录',
        defaultShow: true
      }
    }
  ]
};

export default GeneralRouter;
