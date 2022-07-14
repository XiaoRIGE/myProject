import { RouteRecordRaw } from 'vue-router';

/** 教学配置路由配置 */
const GeneralRouter: RouteRecordRaw = {
  path: '/general_index',
  name: 'ComprehensiveSetting',
  component: () => import('@/views/ComprehensiveSetting/Index.vue'),
  meta: {
    title: '教学配置',
    sort: 40,
    shouldFilterWhenNotCurrentSemester: true
  },
  children: [
    {
      path: 'project_setting',
      name: 'ProjectSetting',
      component: () =>
        import('../views/ComprehensiveSetting/CourseSetting/Index.vue'),
      meta: {
        title: '项目设置'
        // defaultShow:true
      }
    },
    {
      path: 'school_index',
      name: 'SchoolIndex',
      component: () =>
        import('../views/ComprehensiveSetting/SchoolSetting/Index.vue'),
      meta: {
        title: '学校设置'
      }
    },
    {
      path: 'course_attence',
      name: 'CourseAttence',
      component: () =>
        import(
          '../views/ComprehensiveSetting/TeachingSetting/CourseAttence/Index.vue'
        ),
      meta: {
        title: '考勤设置'
      }
    },
    // {
    //   path: 'course_running_rules',
    //   name: 'RunningRules',
    //   component: () =>
    //     import('../views/ComprehensiveSetting/RunningRulesSetting/Index.vue'),
    //   meta: {
    //     title: '跑步规则'
    //   }
    // },
    {
      path: 'Special_examination',
      name: 'SpecialExamination',
      component: () =>
        import('../views/ComprehensiveSetting/SpecialExamination/Index.vue'),
      meta: {
        title: '专项考试'
      }
    },
    {
      path: 'Theory_Examination',
      name: 'TheoryExamination',
      component: () =>
        import('../views/ComprehensiveSetting/TheoryExamination/Index.vue'),
      meta: {
        title: '理论考试设置'
        // defaultShow: true
      }
    },
    {
      path: 'teacher_evaluation_setting',
      name: 'TeacherEvaluationSetting',
      component: () =>
        import(
          '../views/ComprehensiveSetting/TeacherEvaluationSetting/Index.vue'
        ),
      meta: {
        title: '教师评价设置'
        // defaultShow: true
      }
    },
    {
      path: 'course_work_and_rest_time',
      name: 'WorkAndRestTime',
      component: () =>
        import(
          '../views/ComprehensiveSetting/WorkAndRestTimeSetting/Index.vue'
        ),
      meta: {
        title: '作息时间设置'
      }
    }
  ]
};

export default GeneralRouter;
