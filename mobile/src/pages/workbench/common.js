import store from '@/store';

/**
 * @description 获取当前周次
 * */
export const getCurrentWeek = () => {
  return store.state.semester.currentSemester
    ? store.state.semester.currentSemester.weekIndex
    : null;
};

/**
 * @description 获取问候语
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return '早上好';
  } else if (hour >= 11 && hour < 13) {
    return '中午好';
  } else if (hour >= 13 && hour < 17) {
    return '下午好';
  } else {
    return '晚上好';
  }
};
