// 考勤模块

const BASE_API = 'education/attainability';
import { post } from '@/request/index';
const attainability = {
  /**
   * @description
   * */
  getGps: data =>
    post({
      url: `${BASE_API}/info`,
      data
    })
};
export default attainability;
