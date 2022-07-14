import { RouteRecordRaw } from 'vue-router';

/** 体测管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/physical_test',
  name: 'PhysicalTest',
  component: () => import('@/views/PhysicalTest/Index.vue'),
  meta: {
    title: '体测管理',
    // defaultShow:true,
    sort: 30
  },
  children: [
    {
      path: 'physical_grade',
      name: 'PhysicalGrade',
      component: () => import('@/views/PhysicalTest/PhysicalGrade/Index.vue'),
      meta: {
        title: '体测成绩'
        // defaultShow:true
      }
    }
  ]
};

export default GeneralRouter;
