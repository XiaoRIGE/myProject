// 学生端活动模块
const BASE_API = 'education/activity';
const BASE_API2 = 'education/app';
import { get, post, put } from '@/request/index';
const activity = {
  /**
   * @description 获取首页筛选专题列表
   * */
  getActivitieTopicsList: data =>
    get({
      url: `${BASE_API}/topic/list/for/activities`,
      data,
      loading: false
    }),

  /**
   * @description 课外活动列表
   * */
  getActivityList: data =>
    post({
      url: `${BASE_API2}/activity/getActivityList`,
      data,
      loading: false
    }),
  /**
   * @description 我的活动列表
   * */
  getMyActivityList: data =>
    post({
      url: `${BASE_API2}/activity/my/getActivityList`,
      data,
      loading: false
    }),

  /**
   * @description 活动详情
   * */
  getStudentActivityDetail: data =>
    get({ url: `${BASE_API2}/activity/getStudentActivityDetail`, data }),

  /**
   * @description 活动报名
    活动报名接口
  * */
  signUp: data => post({ url: `${BASE_API2}/activity/signUp`, data }),

  /**
   * @description 活动取消报名
   * */
  cancelSignUp: data =>
    post({ url: `${BASE_API2}/activity/cancelSignUp`, data }),
  /**
   * @description 校验冲突
   * */
  checkConflict: data =>
    get({ url: `${BASE_API2}/activity/checkConflict`, data }),

  /**
   * @description 获取活动签到的经纬度
   * */
  getGps: data =>
    post({ url: 'education/activity/simple/attainability/get', data }),

  /**
   * @description 活动签到
   * */
  sign: data =>
    put({
      url: 'education/activity/app/attainability/sign',
      data,
      hiddenToast: true
    }),

    /**
   * @description 我的活动--活动统计
   * */
  activityStatistics: () =>
  get({ url: `${BASE_API2}/activity/signUpStatistics` }),
};
export default activity;
