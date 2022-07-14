import { get, post } from '@/request/index';
const BASE_URL_1 = 'education/course/registered/record/grade';
const BASE_URL_2 = 'education/review/course';
const BASE_URL_3 = 'education/course/registered/record';
const achievement = {
  /**
   * @description 获取表头数据
   * @param {*} data
   * @returns
   */
  getTableHeaders: data =>
    get({ url: `${BASE_URL_1}/head`, data, loading: false }),

  /**
   * @description 获取表格body列表
   */
  getTableBody: data =>
    post({
      url: `${BASE_URL_1}/list`,
      data,
      loading: false
    }),

  /**
   * @description 查看学生分数
   */
  getUserScore: data => post({ url: `${BASE_URL_1}/info/forTeacher`, data }),

  /**
   * @decription 编辑学生成绩
   */
  update: data => post({ url: `${BASE_URL_1}/update`, data }),

  /**
   * @description 复核班级成绩
   */
  course: data => post({ url: BASE_URL_2, data }),

  /**
   * @description 取消复核班级成绩
   */
  cancel: data => post({ url: `${BASE_URL_2}/cancel`, data }),

  /**
   * @description 复核进度
   */
  progress: data => post({ url: `${BASE_URL_2}/count`, data, loading: false }),

  /**
   * @description 获取单个班级的复核状态
   */
  getReviewStatus: data =>
    get({ url: `${BASE_URL_2}/getReviewStatus`, data, loading: false }),

  /**
   * @description 获取专项成绩计分模式
   * @enum [0,1] 0 小分制， 1 百分制
   */
  getSingleShowType: data => get({ url: `${BASE_URL_3}/singleShowType`, data })
};

export default achievement;
