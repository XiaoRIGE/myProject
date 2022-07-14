// 体测详情
import { post, get } from '@/request/index';

// 学生端-体测详情
const test = {
  /**
   * @description 学生体测详情
   * @param {*} data
   * @returns
   */
  getTestInfo: data => post({ url: 'fitness/fitness/app/info', data }),

  /**
   * @description 体测配置年份选择
   * */
  getYearList: data => get({ url: 'fitness/fitness/setting/list', data })
};

export default test;
