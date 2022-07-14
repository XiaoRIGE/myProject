import { RouteRecordRaw } from 'vue-router';

/** 课程管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/course_setting',
  name: 'CourseSetting',
  component: () => import('@/views/CourseSetting/Index.vue'),
  meta: {
    title: '课程管理',
    // defaultShow:true,
    sort: 15
  },
  children: [
    {
      path: 'Class_setting',
      name: 'ClassSetting',
      component: () => import('@/views/CourseSetting/ClassSetting/Index.vue'),
      meta: {
        title: '班级配置'
        // defaultShow:true
      }
    },
    {
      path: 'student_list',
      name: 'studentlist',
      component: () =>
        import('@/views/CourseSetting/ClassSetting/StudentList/Index.vue'),
      meta: {
        title: '学生列表',
        parentRoute: {
          path: 'Class_setting',
          title: '班级配置'
        }
      }
    }
  ]
};

export default GeneralRouter;
