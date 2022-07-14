import { RouteRecordRaw } from 'vue-router';

/** 班级管理路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/class_index',
  name: 'ClassConfig',
  component: () => import('@/views/ClassSetting/Index.vue'),
  meta: {
    title: '班级管理',
    sort: 10
  },
  children: [
    // {
    //   path: 'myclass',
    //   name: 'Myclass',
    //   component: () => import('../views/ClassSetting/MyClassInfo/Index.vue'),
    //   meta: {
    //     title: '我的班级'
    //   }
    // },
    {
      // path: 'class_datail',
      // name: 'ClassDetail',
      path: 'myclass',
      name: 'Myclass',
      component: () =>
        import('../views/ClassSetting/MyClassInfo/ClassDetail/Index.vue'),
      meta: {
        title: '我的班级',
        keepAlive: true
        // parentRoute: {
        //   path: 'myclass',
        //   title: '我的班级',
        // }
      }
    },
    {
      path: 'student_class_query',
      name: 'StudentClassQuery',
      component: () =>
        import('../views/ClassSetting/MyClassInfo/StudentClassQuery/Index.vue'),
      meta: {
        title: '学生班级查询'
        // defaultShow: true
      }
    },
    {
      path: 'running_data',
      name: 'runningData',
      component: () =>
        import(
          '../views/ClassSetting/MyClassInfo/ClassDetail/RunCondition/RunningData/Index.vue'
        ),
      meta: {
        title: '跑步数据',
        parentRoute: {
          path: 'class_datail',
          title: '班级详情'
        }
      }
    }
  ]
};

export default GeneralRouter;
