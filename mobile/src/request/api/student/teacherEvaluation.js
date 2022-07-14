// 教师-学生端
const BASE_API = 'education/app/student/teacherEvaluation';
import { post } from '@/request/index';

const teacherEvaluation = {
  /**
   * @description 获取班级列表
   */
  getTeacherEvaluationList: () =>
    post({
      url: `${BASE_API}/list`,
      hiddenToast: true
    }),

  /**
   * @description 校验是否需要去评价
   * @returns { true: '不需要', false: '必须去评价' }
   * */
  checkTeacherEvaluation: (data) =>
    post({
      url: `${BASE_API}/course/check`,
      data
    }),

  /**
   * @description 获取教师评价题目
   */
  getTeacherEvaluationInfo: (data) =>
    post({
      url: `${BASE_API}`,
      data,
      loading: false
    }),

  /**
   * @description 提交评价信息
   */
  submit: (data) =>
    post({
      url: `${BASE_API}/submit`,
      data
    })
};

export default teacherEvaluation;
