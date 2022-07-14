const BASE_API = 'education/course/registered/record/grade';
import { get, post } from '@/request/index';

const grade = {
  /**
   * @description 判断是否允许查看分数
   */
  isShowGrade: () => get({ url: `${BASE_API}/show`, loading: true }),

  /**
   * @description 获取我的成绩
   */
  getMyGradeData: data =>
    post({ url: `${BASE_API}/info`, data, loading: true, hiddenToast: true }),

  /**
   * @description 获取我的成绩表头
   */
  getMyGradeDataHead: data =>
    get({ url: `${BASE_API}/head`, data, loading: true })
};

export default grade;
