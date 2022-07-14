/**
 * @description 获取我的活动状态
 */
const stateStrArr = {
  0: '未签到',
  1: '已签到',
  2: '已请假',
  3: '去签到',
  4: '取消报名',
  5: '已报名'
};
export const getStateStr = cardInfo => {
  if (cardInfo.state !== 5) {
    // 0: '报名未开始',1: '报名中',  2: '报名结束',3: '活动未开始',4: '活动进行中',5: '活动结束'
    if (
      (cardInfo.signType === 0 || cardInfo.signType === null) &&
      cardInfo.isSign
    ) {
      // 去签到
      return stateStrArr['3'];
    } else if (cardInfo.signType === 1) {
      // 已签到
      return stateStrArr['1'];
    } else if (cardInfo.signType === 2) {
      // 已请假
      return stateStrArr['2'];
    } else if (cardInfo.state !== 4 && !cardInfo.signType && !cardInfo.isSign) {
      // 取消报名
      return stateStrArr['4'];
    } else {
      // 已报名
      return stateStrArr['5'];
    }
  } else {
    // 活动结束
    if (
      (cardInfo.signType === 0 || cardInfo.signType === null) &&
      cardInfo.isSign
    ) {
      // 未签到
      return stateStrArr['0'];
    } else if (cardInfo.signType === 1) {
      // 已签到
      return stateStrArr['1'];
    } else if (cardInfo.signType === 2) {
      // 已请假
      return stateStrArr['2'];
    }
  }
};

/**
 * @description 获取活动列表图标
 */
export const getMyActivityIcon = activityState => {
  const iconList = {
    //  #ifndef APP-PLUS-NVUE || APP-NVUE
    进行中: require('@/static/img/activity/activity-ing.png'),
    报名中: require('@/static/img/activity/apply-ing.png'),
    报名结束: require('@/static/img/activity/apply-end.png'),
    已结束: require('@/static/img/activity/activity-end.png')
    // #endif
  };
  if (activityState === 4) {
    return iconList['进行中'];
  } else if (activityState === 1) {
    return iconList['报名中'];
  } else if (activityState === 2) {
    return iconList['报名结束'];
  } else {
    return iconList['已结束'];
  }
};
