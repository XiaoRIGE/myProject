const BASE_API = 'running';
import { post } from '@/request/index';

// 教师-课程设置
const running = {
  /**
   * @description 教师-获取学生跑步情况
   * @param {*} data
   * @returns
   */
  getStudentsGrade: data => {
    // 判断是否带模糊查询字符串，搜索和列表查询接口不一样
    const isQuery =
      data.queryParam && String(data.queryParam).trim().length > 0;
    return post({
      url: `${BASE_API}/back/${
        isQuery ? 'getStudentsRunningGradeByNameOrNumber' : 'getStudentsGrade'
      }`,
      data,
      loading: false
    });
  },
  /**
   * @description 获取学期运动计分模式
   */
  getRunningRule: data =>
    post({
      url: `${BASE_API}/back/getRunningRule`,
      data,
      loading: false
    })
};

export default running;
