import { RouteRecordRaw } from 'vue-router';

/** 综合配置路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/manage_control',
  name: 'userManage',
  component: () => import('@/views/ComprehensiveSetting/Index.vue'),
  meta: {
    title: '用户管理',
    sort: 60
  },
  children: [
    {
      path: 'manage_user',
      name: 'ManageUser',
      component: () =>
        import('@/views/ComprehensiveSetting/UserManage/ManageUser/Index.vue'),
        meta: {
          title: '管理员'
        }
    },
    {
      path: 'teacher_user',
      name: 'TeacherUser',
      component: () =>
        import('@/views/ComprehensiveSetting/UserManage/TeacherUser/Index.vue'),
        meta: {
          title: '普通教师'
        }
    },
    {
      path: 'student_user',
      name: 'StudentUser',
      component: () =>
        import(
          '@/views/ComprehensiveSetting/UserManage/StudentUser/index.vue'
        ),
        meta: {
          title: '学生用户'
        }
    }
  ]
};

export default GeneralRouter;
