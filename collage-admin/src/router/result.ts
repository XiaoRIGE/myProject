/*
 * @Author: lyh
 * @Date: 2021-11-09 14:02:24
 * @LastEditTime: 2021-12-01 10:25:30
 * @LastEditors: Please set LastEditors
 * @Description: 成绩管理
 * @FilePath: \collage-admin\src\router\result.ts
 */
import { RouteRecordRaw } from 'vue-router';

/** 成绩管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/result_manage',
  name: 'ResultManage',
  component: () => import('@/views/ScoreManagement/Index.vue'),
  meta: {
    title: '成绩管理',
    // defaultShow:true,
    sort: 55
  },
  children: [
    {
      path: 'result_recheck',
      name: 'ResultRecheck',
      component: () => import('../views/ScoreManagement/ReCheck/Index.vue'),
      meta: {
        title: '复核情况'
        // defaultShow: true
      }
    },
    {
      path: 'result_setting',
      name: 'ResultSetting',
      component: () =>
        import('../views/ScoreManagement/ResultSetting/Index.vue'),
      meta: {
        title: '成绩设置'
        // defaultShow:true
      }
    }
  ]
};

export default GeneralRouter;
