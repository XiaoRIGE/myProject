const BASE_API = 'education/course/app/forStudent';
import { get, put, post } from '@/request/index';
const course = {
  /**
   * @description 获取学生课程列表
   * */
  getStudentCourseList: (data) =>
    get({ url: `${BASE_API}/list`, data, loading: false }),

  /**
   * @description 学生-课程效率周,签到列表
   * */
  getStudentAttainabilityInfo: (data) =>
    get({ url: `${BASE_API}/attainability/info`, data, loading: false }),

  /**
   * @description 学生-课程详情
   * */
  getStudentCourseDetail: (data) => get({ url: `${BASE_API}/info`, data }),

  /**
   * @description 学生GPS签到接口
   * */
  sign: (data) => put({ url: `${BASE_API}/sign`, data, hiddenToast: true }),
  /**
   * @description 教师扫码签到街口
   * */
  newSign: (data) =>
    put({
      url: 'education/v2/forStudent/sign',
      data,
      hiddenToast: true
    }),

  /**
   * @description 判断学生是否为管理员
   * */
  manager: (data) =>
    post({ url: 'education/check/course/manager', data, loading: false }),

  /**
   * @description 查询学生今天的课程
   * */
  getCourseToday: (data) =>
    get({ url: 'education/course/today', data, loading: false })
};
export default course;
