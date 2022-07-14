/**
 * @description 获取运动等级图标
 */
export const getSportIcon = key => {
  const iconList = {
    //  #ifndef APP-PLUS-NVUE || APP-NVUE
    A: require('@/static/img/sportTag/a-tag.png'),
    B: require('@/static/img/sportTag/b-tag.png'),
    C: require('@/static/img/sportTag/c-tag.png'),
    S: require('@/static/img/sportTag/s-tag.png')
    // #endif
  };
  return iconList[key];
};
/**
 * @description 获取运动时间
 */
export const getkeepTime = exerciseTime => {
  const m = parseInt(exerciseTime / 60);
  let s = parseInt(exerciseTime % 60);
  s = s < 10 ? `0${s}` : `${s}`;
  return `${m}'${s}''`;
};
/**
 * @description 是否是今天
 */
export const isToday = startTime => {
  return new Date(startTime).toDateString() === new Date().toDateString();
};
