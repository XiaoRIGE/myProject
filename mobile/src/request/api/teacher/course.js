const BASE_API = 'education/course';
import { get, post } from '@/request/index';

// 教师-课程设置
const course = {
  /**
   * @description 教师-课程列表
   * @param {*} data
   * @returns
   */
  getForTeacherList: data =>
    get({ url: `${BASE_API}/app/forTeacher/list`, data }),

  /**
   * @description 教师-作废考勤
   * @param {*} data
   * @returns
   */
  attainabilityCancel: data =>
    post({
      url: `${BASE_API}/app/forTeacher/attainability/cancel`,
      data,
      loading: false
    }),

  /**
   * @description 教师-效率周列表
   * @param {*} data
   * @returns
   */
  getEffectiveDateList: data =>
    get({ url: `${BASE_API}/effectiveDateList`, data }),

  /**
   * @description 教师-学生考勤列表
   * @param {*} data
   * @returns
   */
  getAttainabilityList: data =>
    post({
      url: `${BASE_API}/app/forTeacher/attainability/list`,
      data,
      loading: false
    }),
  /**
   * @description 教师-学生考勤列表统计
   * @param {*} data
   * @returns
   */
  getAttainabilityCount: data =>
    post({
      url: `${BASE_API}/app/forTeacher/attainability/count`,
      data,
      loading: false
    })
};

export default course;
