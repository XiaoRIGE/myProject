import _ from 'lodash';

/**
 * @description 时间戳中获取星期
 */
import { getWeekItem } from '@/utils/common';

/**
 * @description 跑步记录数据结构
 */
export const getRunningRecord = (data) => {
  const newData = [];
  data.forEach((item) => {
    let flag = false;
    const monthItem = getMonthItem(item.endTime);
    const yearItem = getYearItem(item.endTime);
    const dateItem = getDateItem(item.endTime);
    item.month = monthItem;
    item.year = yearItem;
    item.date = `${yearItem}年${monthItem}月${dateItem}日`;
    item.week = getWeekItem(item.endTime);
    item.isAction =
      item.runningTypeName === '自由跑' ||
      item.runningTypeName === '定点跑' ||
      item.runningTypeName === '范围跑';
    item.isHint = item.effectiveMileage < item.totalMileage;
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
  newData.forEach((item) => {
    item.recordDetails = _.filter(data, {
      month: item.index,
      year: item.year
    });
    item.num = item.recordDetails.length;
    item.hintNum = _.filter(item.recordDetails, {
      isHint: true
    }).length;
  });
  return newData;
};

/**
 * @description 时间戳中获取月份
 */
const getMonthItem = (time) => {
  const date = new Date(Number(time));
  return date.getMonth() + 1;
};

/**
 * @description 时间戳中获取年份
 */
const getYearItem = (time) => {
  const date = new Date(Number(time));
  return date.getFullYear();
};

/**
 * @description 时间戳中获取日期
 */
const getDateItem = (time) => {
  const date = new Date(Number(time));
  return date.getDate();
};

// 申诉状态
const statusNames = {
  processing: '处理中，请耐心等待',
  success: '申诉成功',
  fail: '申诉失败'
};
const status = {
  0: 'processing',
  1: 'success',
  2: 'fail'
};
export const getStatus = (state) => status[state];

export const getStatusName = (state) => statusNames[state];
