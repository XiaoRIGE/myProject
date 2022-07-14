import _ from 'lodash';

/**
 * @description 时间戳中获取星期
 */
import { getWeekItem } from '@/utils/common';

/**
 * @description 分数正则
 */
export const getScore = score => {
  const reg = /\B(?=(\d{3})+\b)/g;
  return String(score).replace(reg, ',');
};

/**
 * @description 时间戳中获取月份
 */
const getMonthItem = time => {
  const date = new Date(Number(time));
  return date.getMonth() + 1;
};

/**
 * @description 时间戳中获取年份
 */
const getYearItem = time => {
  const date = new Date(Number(time));
  return date.getFullYear();
};

/**
 * @description 时间戳中获取日期
 */
const getDateItem = time => {
  const date = new Date(Number(time));
  return date.getDate();
};
/**
 * @description 时间戳中获取时间
 */
const getTimeItem = time => {
  const date = new Date(Number(time));
  return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;
};

/**
 * @description 跑步记录数据结构
 */
export const getaiSportsRecord = data => {
  const newData = [];
  data.forEach(item => {
    let flag = false;
    const monthItem = getMonthItem(item.startTime);
    const yearItem = getYearItem(item.startTime);
    const dateItem = getDateItem(item.startTime);
    item.month = monthItem;
    item.year = yearItem;
    item.date = `${yearItem}年${monthItem}月${dateItem}日`;
    item.week = getWeekItem(item.startTime);
    item.time = getTimeItem(item.startTime);
    if (newData && newData.length > 0) {
      flag = _.some(newData, ['index', monthItem]);
    }
    if (!flag) {
      newData.push({
        month: `${monthItem}月`,
        index: monthItem,
        year: yearItem
      });
    }
  });
  newData.forEach(item => {
    item.recordDetails = _.filter(data, {
      month: item.index,
      year: item.year
    });
    item.num = item.recordDetails.length;
  });
  return newData;
};
