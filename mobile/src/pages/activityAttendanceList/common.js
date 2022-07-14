/**
 * @description 时间戳中获取星期
 */
import { getWeekItem } from '@/utils/common';

/**
 * @description 获取活动时间
 */
export const getActivityTime = (startTime, endTime) => {
  const week = getWeekItem(startTime);
  const month = getMonthItem(startTime);
  const date = getDateItem(startTime);
  const start = `${getHoursItem(startTime)}:${getMinutesItem(
    startTime
  )}~${getHoursItem(endTime)}:${getMinutesItem(endTime)}`;
  return `${week}(${month}月${date}日)${start}`;
};

/**
 * @description 时间戳中获取月份
 */
const getMonthItem = time => {
  const date = new Date(Number(time));
  return date.getMonth() + 1;
};

/**
 * @description 时间戳中获取日期
 */
const getDateItem = time => {
  const date = new Date(Number(time));
  return date.getDate();
};

/**
 * @description 时间戳中获取小时
 */
const getHoursItem = time => {
  const date = new Date(Number(time));
  return date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
};

/**
 * @description 时间戳中获取分钟
 */
const getMinutesItem = time => {
  const date = new Date(Number(time));
  return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
};

/**
 * @description 获取教师是否可以开启签到
 * 可以开启签到时间:活动当天00:00-活动结束时间
 */
export const canOpenSignIn = cardInfo => {
  const startTime = new Date(Number(cardInfo.startTime)).setHours(0, 0, 0, 0); //活动当天00:00
  return (
    startTime <= cardInfo.currentTime && cardInfo.currentTime < cardInfo.endTime
  );
};
