/**
 * @description 获取活动报名状态
 */
export const getRegisterState = cardInfo => {
  let registerState;
  if (Number(cardInfo.currentTime) < Number(cardInfo.registerStartTime)) {
    // 报名未开始
    registerState = 0;
  } else if (Number(cardInfo.currentTime) > Number(cardInfo.registerEndTime)) {
    // 报名已结束
    registerState = 2;
  } else {
    registerState = 1;
  }
  return registerState;
};

/**
 * @description 获取开启签到间隔时间
 */
export const getTimeList = () => {
  const arr = [];
  for (let i = 0; i <= 600; i++) {
    arr.push({ value: i, label: `${i}` });
  }
  return [
    [
      {
        value: '700',
        label: '间隔时长'
      }
    ],
    arr,
    [
      {
        value: '800',
        label: '分钟'
      }
    ]
  ];
};

/**
 * @description 获取教师是否可以开启签到
 * 可以开启签到时间:活动当天00:00-活动结束时间
 * 报名开始时间-活动结束前
 *
 */
export const canOpenSignIn = cardInfo => {
  const startTime = new Date(Number(cardInfo.startTime)).setHours(0, 0, 0, 0); //活动当天00:00
  return (
    startTime <= cardInfo.currentTime && cardInfo.currentTime < cardInfo.endTime
  );
};
