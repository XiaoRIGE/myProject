// 理论考试-学生端
const BASE_API = 'education/app/student/theoryExamination';
import { post } from '@/request/index';

const theoryExam = {
  /**
   * @description 获取考试列表
   */
  getTheoryExaminationList: () =>
    post({
      url: `${BASE_API}/list`
    }),

  /**
   * @description 开始考试获取题库
   * */
  getTheoryExaminationInfo: (data) =>
    post({
      url: `${BASE_API}/start`,
      data
    }),

  /**
   * @description 考试结束提交试题
   */
  submitTheoryExamination: (data) =>
    post({
      url: `${BASE_API}/submit`,
      data,
      hiddenToast: true
    }),

  /**
   * @description 获取考试结果
   */
  getTheoryExaminationResult: (data) =>
    post({
      url: `${BASE_API}/result`,
      data
    })
};

export default theoryExam;
