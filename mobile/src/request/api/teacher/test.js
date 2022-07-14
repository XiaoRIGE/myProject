const BASE_API = 'fitness/fitness/app';
import { post } from '@/request/index';

// 教师-课程设置
const test = {
  /**
   * @description 班级体测列表
   * @param {*} data
   * @returns
   */
  classList: (data) => post({ url: `${BASE_API}/course/info/list`, data }),

  /**
   * @description 全校体测列表
   * @param {*} data
   * @returns
   */
  schoolList: (data) => post({ url: `${BASE_API}/school/info/list `, data }),

  /**
   * @description 体测录入和编辑
   * @param {*} data
   * @returns
   */
  update: (data) => post({ url: `${BASE_API}/info/update `, data }),

  /**
   * @description 扫一扫获取学生信息
   * @param {*} data
   * @returns
   */

  getUserInfo: (data) => post({ url: `${BASE_API}/v2/info/scan`, data })
};

export default test;
