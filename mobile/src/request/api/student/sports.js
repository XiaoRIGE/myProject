const BASE_API = 'sports-core';
import { get, post } from '@/request/index';
const sports = {
  /**
   * @description 获取锻炼者运动数据列表
   * */
  getExerciseRecordList: data =>
    get({
      url: `${BASE_API}/exerciser/calendar/getExerciseRecordList`,
      data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }),
  /**
   * @description 获取锻炼者运动 某天某次的 结果页
   * */
  getExerciseResultConcise: data =>
    get({
      url: `${BASE_API}/plan/exerciser/getExerciseResultConcise`,
      data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }),

  /**
   * @description Ai规则
   * */
  getAiRule: data =>
    post({
      url: `${BASE_API}/app/sport/getRule`,
      data,
      loading: false
    }),
  /**
   * @description 获取学期有效分数
   */
  getValidRecord: data =>
    post({
      url: `${BASE_API}/getValidRecord`,
      data,
      loading: false
    }),
  /**
   * @description 检查用户是否同意ai风险协议
   * */
  getDataStatus: data =>
    get({
      url: `${BASE_API}/sport/danger/text/dataStatus`,
      data
    }),
  /**
   * @description 获取ai运动记录
   */
  getSportsRecords: data =>
    post({
      url: `${BASE_API}/app/getSportsRecords`,
      data,
      loading: false
    }),
  /**
   * @description 获取ai运动结果页
   */
  getRecordDetails: data =>
    get({
      url: `${BASE_API}/getRecordDetails`,
      data
    }),
  /**
   * @description 查询风险清单内容
   * */
  getDangerText: data =>
    post({
      url: `${BASE_API}/sport/danger/text`,
      data
    }),
  /**
   * @description 用户同意协议风险清单
   * */
  dangerAccessText: data =>
    get({
      url: `${BASE_API}/sport/danger/text/access`,
      data
    })
};
export default sports;
