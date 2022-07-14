const BASE_API = 'education';
import { post, get, put } from '@/request/index';

const activity = {
  /**
   * @description 教师端-获取活动列表
   * @param {*} data
   * @returns
   */
  getActivityList: (data) =>
    post({ url: `${BASE_API}/teacher/app/getActivityList`, data }),

  /**
   * @description 教师-学生活动考勤列表
   * @param {*} data
   * @returns
   */
  getAttainabilityList: (data) =>
    post({
      url: `${BASE_API}/activity/app/forTeacher/attainability/list`,
      data,
      loading: false
    }),

  /**
   * @description 教师-学生考勤列表统计
   * @param {*} data
   * @returns
   */
  getAttainabilityCount: (data) =>
    post({
      url: `${BASE_API}/activity/app/forTeacher/attainability/count`,
      data,
      loading: false
    }),
  /**
   * @description 教师-学生活动详情
   * @param {*} data
   * @returns
   */
  getActivityTeacherDetail: (data) =>
    get({
      url: `${BASE_API}/teacher/app/getActivityTeacherDetail`,
      data
    }),
  /**
   * @description 教师-手动修改考勤状态
   * @param {*} data
   * @returns
   */
  updateSignType: (data) =>
    post({
      url: `${BASE_API}/activity/app/attainability/record/updateSignType`,
      data
    }),
  /**
   * @description 教师-开启活动考勤
   * @param {*} data
   * @returns
   */
  start: (data) =>
    post({
      url: `${BASE_API}/activity/simple/attainability/start`,
      data,
      loading: true,
      hiddenToast: false
    }),
  /**
   * @description 教师-活动修改间隔时间
   * @param {*} data
   * @returns
   */
  changeInterval: (data) =>
    post({
      url: `${BASE_API}/activity/simple/change/interval`,
      data,
      loading: true,
      hiddenToast: false
    }),
  /**
   * @description 教师-获得活动gps签到信息
   * @param {*} data
   * @returns
   */
  getGpsInfo: (data) =>
    post({
      url: `${BASE_API}/activity/simple/attainability/get`,
      data
    }),
  /**
   * @description 教师-签到接口
   * @param {*} data
   * @returns
   */
  sign: (data) =>
    put({
      url: `${BASE_API}/activity/app/attainability/sign`,
      data,
      hiddenToast: true
    }),

  /**
   * @description 教师-签到接口(新-教师端使用)
   * @param {*} data
   * @returns
   */
  newSign: (data) =>
    put({
      url: `${BASE_API}/v2/attainability/sign`,
      data,
      hiddenToast: true
    }),

  /**
   * @description 教师-课外活动统计列表
   * @param {*} data
   * @returns
   */
  getActivityStatistics: (data) =>
    post({
      url: `${BASE_API}/activity/getSignUpStatistics`,
      data
    }),
  /**
   * @description 教师-课外活动统计列表搜索查询
   * @param {*} data
   * @returns
   */
  queryActivityStatistics: (data) =>
    post({
      url: `${BASE_API}/activity/querySignUpStatistics`,
      data
    }),
  updateActivityToManually: (data) =>
    post({
      url: `${BASE_API}/activity/simple/updateActivityToManually`,
      data
    })
};

export default activity;
