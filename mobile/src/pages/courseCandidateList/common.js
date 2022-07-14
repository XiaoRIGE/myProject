import { getUserInfo } from '@/utils/common';
export const getCampusId = () => {
  return getUserInfo().campusId;
};
export const getSchoolId = () => {
  return getUserInfo().schoolId;
};
/**
 * @description 筛选课程列表
 */
export const filterCourseList = (queryParams, queryCourseList) => {
  let arr = [...queryCourseList];
  const filters = (key, value, list) => {
    if (value === null) {
      return list;
    } else {
      return list.filter(item => item[key] === value);
    }
  };
  for (const key in queryParams) {
    arr = filters(key, queryParams[key], arr);
  }
  return arr;
};
