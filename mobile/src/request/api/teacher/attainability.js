// 教师考勤模块

const BASE_API = 'education/attainability';
import { put, post } from '@/request/index';
const attainability = {
  /**
   * @description 教师-手动修改考勤
   * */
  updateSignType: data =>
    put({
      url: `${BASE_API}/record/updateSignType`,
      data
    }),
  /**
   * @description 教师-开启签到
   * */
  start: data =>
    post({
      url: `${BASE_API}/start`,
      data,
      loading: true,
      hiddenToast: false
    }),
  /**
   * @description 教师-获取gps经纬度
   * */
  getGpsInfo: data =>
    post({
      url: `${BASE_API}/info`,
      data
    })
};
export default attainability;
