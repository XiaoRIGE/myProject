const BASE_API = 'running/app';
import { post, get } from '@/request/index';

const running = {
  /**
   * @description 学生端-获取本学期跑步记录
   * @param {*} data
   * @returns
   */
  getDetails: (data) => post({ url: `${BASE_API}/getDetails`, data }),

  /**
   * @description 学生端-获取跑步详情
   * @param {*} data
   * @returns
   */
  getRunningDetailsRoutine: (data) =>
    // post({ url: `${BASE_API}/getRunningDetailsRoutine`, data }),
    post({ url: 'running/back/getRunningDetailsAppeal', data }),

  /**
   * @description 学生端-获取历史跑步记录
   * @param {*} data
   * @returns
   */
  getHistoryDetails: () => get({ url: `${BASE_API}/getHistoryDetails` }),

  /**
   * @description 学生端-查询跑步详情申诉状态
   * @param {*} data
   * @returns
   */
  getAppealStatus: (data) =>
    post({ url: `${BASE_API}/appeal/check`, data, loading: false }),

  /**
   * @description 学生端-查询跑步申诉是否达到上限
   * @param {*} data
   * @returns
   */
  getLimit: (data) =>
    post({ url: `${BASE_API}/appeal/limit`, data, loading: false }),

  /**
   * @description 学生端-获取跑步申诉类型列表
   * @param {*} data
   * @returns
   */
  getRunningTypes: () => get({ url: 'running/appeal/type', loading: false }),

  /**
   * @description 学生端-创建申诉
   * @param {*} data
   * @returns
   */
  createRunningAppeal: (data) => post({ url: 'running/app/appeal', data }),

  /**
   * @description 学生端-获取申诉详情
   * @param {*} data
   * @returns
   */
  getAppealInfo: (data) => post({ url: 'running/appeal/info', data }),

  /**
   * @description 学生端-取消申诉
   * @param {*} data
   * @returns
   */
  cancelAppeal: (data) => post({ url: 'running/app/appeal/cancel', data }),

  /**
   * @description 学生端-再次申诉
   * @param {*} data
   * @returns
   */
  appealAgain: (data) => post({ url: 'running/app/appeal/again', data }),
  /**
   * @description 学生端-获取app已处理未读数量
   * @returns
   */
  getUnReadNum: () =>
    get({ url: `${BASE_API}/appeal/handleCount`, hiddenToast: true }),
  /**
   * @description 学生端-获取我的申诉
   * @param {number} handleState
   * @param {number} page
   * @param {number} size
   * @returns
   */
  getAppealList: (data) => post({ url: `${BASE_API}/appeal/list`, data }),

  /**
   * @description 学生端-获取某一天岗亭打卡记录详情
   * @param {*} data
   * @returns
   */
  getFaceRunningDetailsOfDay: (data) =>
    get({
      url: 'face-running/app/face/uploading/record/getListByDate',
      data,
      loading: false
    }),
  /**
   * @description 学生端-获取某月岗亭打卡记录详情
   * @param {*} data
   * @returns
   */
  getFaceRunningDetailsOfMonth: (data) =>
    get({
      url: 'face-running/app/face/uploading/record/getListByMonth',
      data,
      loading: false
    })
};

export default running;
