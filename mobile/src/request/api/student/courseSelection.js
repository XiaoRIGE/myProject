const BASE_API = 'education/optional/course';
const BASE_API1 = 'education/course/app';
import { post } from '@/request/index';
const courseSelection = {
  /**
   * @description 获取选课筛选时间
   * */
  getCourseAllTime: data =>
    post({
      url: `${BASE_API}/time`,
      data,
      loading: false
    }),
  /**
   * @description 获取选课筛选项目
   * */
  getCourseAllProject: data =>
    post({
      url: `${BASE_API}/project`,
      data,
      loading: false
    }),
  /**
   * @description 获取选课候选列表
   * */
  getCourseSelectionList: data =>
    post({
      url: `${BASE_API}/list`,
      data,
      loading: true
    }),
  /**
   * @description 获取新选课候选列表
   * */
  getCourseSelectionNewList: data =>
    post({
      url: `${BASE_API}/newList`,
      data,
      loading: true
    }),
  /**
   * @description 学生选课列表
   * */
  getOptionalPageList: data =>
    post({ url: `${BASE_API}/optionalPageList`, data }),
  /**
   * @description 选课报名
   * */
  signUpCourse: data =>
    post({
      url: `${BASE_API1}/signUp`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data,
      loading: false
    }),
  /**
   * @description 修改课程报名
   * */
  changeCourse: data =>
    post({
      url: `${BASE_API1}/change`,
      data,
      loading: false
    }),
  /**
   * @description 取消报名
   * */
  cancelCourse: data => post({ url: `${BASE_API1}/cancel`, data })
};
export default courseSelection;
