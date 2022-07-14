const BASE_API = 'education/course/project/subject';
import { get, post } from '@/request/index';

const specialSubject = {
  /**
   * @description 获取科目列表
   * @param {*} data
   * @returns
   */
  getSubjectList: data =>
    get({
      url: `${BASE_API}/list`,
      data,
      loading: true
    }),
  /**
   * @description 学生科目成绩列表
   * @param {*} data
   * @returns
   */
  getAchievementList: data =>
    post({
      url: `${BASE_API}/achievement/list`,
      data,
      loading: true
    }),
  /**
   * @description 学生科目保存
   * @param {*} data
   * @returns
   */
  getAchievementSave: data =>
    post({
      url: `${BASE_API}/achievement/save`,
      data,
      loading: true,
      hiddenToast: true
    })
};

export default specialSubject;
