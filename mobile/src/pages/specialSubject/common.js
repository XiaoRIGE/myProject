/**
 * @description 获取表头
 */
export const getColumns = (list, total) => {
  list.unshift({
    id: 'name',
    title: `学生列表(${total})`,
    type: null
  });
  const columns = list.map((item, index) => {
    return {
      key: item.id,
      title: item.title,
      subjectType: item.type,
      colNum: index
    };
  });
  return columns;
};
/**
 * @description 获取表格信息
 */
export const getTableData = list => {
  return list.map((item, index) => {
    item.subjectAchievementList.map(i => {
      item[i.subjectId] = i.rate;
      return item;
    });
    item['rowNum'] = index;
    return item;
  });
};
/**
 * @description 验证方法
 */
export const scoresDetails = {
  formatTimeNumber: number => {
    const timeObj = {
      s: 0, // 秒
      m: 0, // 分
      format: '',
      rule: true,
      timeStamp: 0
    };
    if (!number && number !== 0) return timeObj;
    if (number === 0 || number === '0') {
      timeObj.format = '0';
      return timeObj;
    }
    try {
      const str = typeof number === 'number' ? number.toString() : number;
      // 判断是否存在小数位
      const strArr = str.split('.');
      const sAr = []; // 秒
      const mAr = []; // 分
      if (strArr[0]) {
        let index = strArr[0].length;
        while (index > 0) {
          if (sAr.length < 2) {
            sAr.unshift(strArr[0][index - 1]);
          } else {
            mAr.unshift(strArr[0][index - 1]);
          }
          --index;
        }
      }
      timeObj['s'] =
        sAr.length > 1 ? Number(`${sAr[0]}${sAr[1]}`) : Number(sAr[0]);
      if (timeObj['s'] > 59) {
        uni.showToast({
          title: '请输入0至59范围的秒数',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        timeObj['s'] = '';
        timeObj.rule = false;
        return timeObj;
      }
      if (strArr[1] && strArr[1].length > 2) {
        // timeObj['s'] = '';
        uni.showToast({
          title: '最多可输入2位小数',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        timeObj.rule = false;
        // return timeObj;
      }
      if (strArr[1] && strArr[1]) {
        timeObj['s'] = Number(`${timeObj['s']}.${strArr[1]}`);
      }

      for (let i = 0; i < mAr.length; i++) {
        timeObj['m'] = Number(timeObj['m'] + mAr[i]);
      }
      if (timeObj['m'] >999) {
        uni.showToast({
          title: '请输入0至999范围的分钟数',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        timeObj['m'] = '';
        timeObj.rule = false;
        return timeObj;
      }
      if (timeObj.s || timeObj.m) {
        timeObj.format = timeObj.m
          ? `${timeObj.m}' ${timeObj.s}''`
          : `${timeObj.s}''`;
      }
      // 时间戳转换
      const { s = 0, m = 0 } = timeObj;
      timeObj.timeStamp = Number(s * 1000) + Number(m * 60 * 1000);
    } catch (err) {
      throw new Error(err);
    }
    return timeObj;
  },
  timeStampToTime: timeStamp => {
    const result = {
      s: '', // 秒
      m: '', // 分
      format: '',
      rule: true,
      timeStamp
    };
    try {
      if (!timeStamp || timeStamp === 0) return result;
      result.m = parseInt(timeStamp / 1000 / 60);
      result.s = Math.round(((timeStamp % (1000 * 60)) / 1000) * 100) / 100;
      if (result.s || result.m) {
        result.format = result.m
          ? `${result.m}' ${result.s}''`
          : `${result.s}''`;
      }
    } catch (err) {
      result.rule = false;
      throw new Error(err);
    }

    return result;
  },
  skillRule: rate => {
    const reg = /^([0-9]{1,2}|100)$/;
    if (reg.test(rate)) {
      return true;
    } else {
      uni.showToast({
        title: '请输入0至100范围的整数',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return false;
    }
  },
  NumberRule: rate => {
    const reg = /^\d+(?=\.{0,1}\d+$|$)/;
    if (reg.test(rate)) {
      return true;
    } else {
      uni.showToast({
        title: '数值不能为负数',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return false;
    }
  }
};
// 7800 000

/**
 * @description 键盘中间回填值
 */
export const getValueStr = selSubject => {
  const { rate, subjectType } = selSubject;
  if (rate === null) {
    // 为空
    return '';
  } else if (subjectType === 'TIME') {
    const obj = scoresDetails.timeStampToTime(rate);
    return `${obj.m * 100 + obj.s}`;
  } else {
    return rate;
  }
};

/**
 * @description 恢复数据
 */
export const restoreValueStr = selSubject => {
  const { rate, subjectType } = selSubject;
  if (rate === null) {
    // 为空
    return '-';
  } else if (subjectType === 'TIME' && rate) {
    return scoresDetails.timeStampToTime(rate).format;
  } else {
    return rate;
  }
};

/**
 * @description 验证
 */
export const checkRule = (subjectType, value) => {
  let flag;
  if (value === '') {
    flag = true;
  } else {
    if (subjectType === 'TIME') {
      flag = scoresDetails.formatTimeNumber(value).rule;
    } else if (subjectType === 'RATING') {
      flag = scoresDetails.skillRule(value);
    } else {
      flag = scoresDetails.NumberRule(value);
    }
  }
  return flag;
};
/**
 * @description 转换提交的rate
 */
export const getRate = (subjectType, value) => {
  if (value === '') {
    return null;
  } else if (subjectType === 'TIME') {
    return scoresDetails.formatTimeNumber(value).timeStamp;
  } else {
    return value;
  }
};
