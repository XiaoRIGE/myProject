import { createVNode } from 'vue';
import moment from 'moment';
import { setStoreState } from '@/store/utils';
import { Md5 } from 'ts-md5';
import sha1 from 'sha1';
import useClipboard from 'vue-clipboard3';
import { message } from 'ant-design-vue';
import { ElementSize } from '@/@types';

/**
 * @description 通过值查找对象的 key
 * @param {object} target - 要查找的对象
 * @param {string} value - 要查找的值
 * @returns {string} key  返回的 key
 */
export const findKeyByValue = function findKeyByValue(
  target: { [key: string]: string },
  value: string
): string {
  const keys = Reflect.ownKeys(target) as Array<string>;
  for (let i = 0; i < keys.length; i++) {
    if (target[keys[i]] === value) {
      return keys[i];
    }
  }
  return '';
};

/**
 * @description:返回modal组件头部信息vNode
 * @param {string} title -标题
 * @return {vNode}
 */
export const getModalHeadVNode = (title: string) => {
  const childVNode = [createVNode('use', { 'xlink:href': '#icontishi' })];
  const parentVNode = [
    createVNode(
      'svg',
      {
        class: 'icon',
        style: {
          width: '24px',
          height: '24px',
          marginRight: '8px',
          position: 'absolute',
          left: '-30px'
        },
        ariaHidden: true
      },
      childVNode
    )
  ];
  const titleVNode = createVNode(
    'div',
    {
      style: { display: 'flex', alignItems: 'center', position: 'relative' }
    },
    [...parentVNode, title]
  );
  return titleVNode;
};

/**
 * @description: 防抖函数
 * @param {Function} func 函数
 * @param {number} delay 延迟执行毫秒数
 * @param {*} immediate 是否立即执行
 * @return {*}
 */
export const debounced = (
  func: Function,
  delay: number,
  immediate = false
): Function => {
  let timer: number | undefined | any;
  let _immediate = immediate;
  return (...args: any) => {
    if (_immediate) {
      func.apply(this, args);
      _immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * @description: 节流函数
 * @param {Function} func 函数
 * @param {number} wait 延迟执行毫秒数
 * @return {*}
 */
export const throttle = (func: Function, wait: number): Function => {
  let previous = 0;
  return (...args: any) => {
    const now = Date.now();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

/**
 * @description: 数字转学年
 * @param {number} num
 * @return {string}
 */
export const numFormatYearStr = (num: number) => {
  switch (num) {
    case 1:
      return '大一';
    case 2:
      return '大二';
    case 3:
      return '大三';
    case 4:
      return '大四';
    case 10:
      return '大一~大四';
    default:
      return '大一';
  }
};

/**
 * @description: 星期数组转字符串 [1,2,4]=>'周一、周二、周四'
 * @param {string[]} target
 * @return {string}
 */
export const getWeekTimeStr = (target: string[]) => {
  // 格式化星期
  return target
    .map(item => {
      switch (item) {
        case '1':
          return '周一';
        case '2':
          return '周二';
        case '3':
          return '周三';
        case '4':
          return '周四';
        case '5':
          return '周五';
        case '6':
          return '周六';
        case '7':
          return '周日';
      }
    })
    .join('、');
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

/**
 * @description: 生成限制选择时间范围
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {*} type hour：生成限制小时 minutes：生成限制分支 second：生成限制秒
 * @return {Array}
 */
export const getDisableTime = (
  startTime: string,
  endTime: string,
  type = 'hour'
) => {
  const startHour = moment(startTime).hours();
  const endHour = moment(endTime).hours();
  const startMinutes = moment(startTime).minutes();
  const endMinutes = moment(endTime).minutes();
  const startSecond = moment(startTime).seconds();

  if (type === 'hour') {
    if (startTime) {
      return range(0, startHour);
    }
    return [];
  } else if (type === 'minutes') {
    if (startHour === endHour) {
      return range(0, startMinutes);
    }
  } else if (type === 'second') {
    if (startHour === endHour && startMinutes === endMinutes) {
      return range(0, startSecond + 1);
    }
  }
  return [];
};

const telReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

/**
 * @description: 校验是否是手机号
 */
export const isTel = (val: string) => {
  return telReg.test(val);
};

/**
 * @description: 获取localStorage中某个对象某个key的值
 */
export const getStorageData = (objName: string, key: string) => {
  const result = localStorage.getItem(objName) || '';
  if (!result) return '';
  const resultObj = JSON.parse(result);
  return resultObj ? resultObj[key] : '';
};

/**
 * @description: 根据成绩返回颜色状态
 * @param {number | string} val 成绩
 * @return {*} 颜色
 */
export const getColorByGrade = (val: number | string) => {
  if (typeof val === 'number') {
    if (val >= 90) {
      return '#6196FF';
    } else if (val >= 80) {
      return '#40C79A';
    } else if (val >= 60) {
      return '#FFAE00';
    } else if (val < 80 && val > 0) {
      return '#F66267';
    }
  }
  return '#9599A4';
};

/**
 * @description: 获取串镜和屈光不正
 * @param {number} valType 1：屈光不正 2：串镜
 * @param {number} val 值
 * @return {string}
 */
export const getEyeInfoByVal = (valType: number, val: number) => {
  // 屈光不正
  if (valType === 1) {
    switch (val) {
      case 0:
        return '正常';
      case 1:
        return '近视';
      case 2:
        return '远视';
      case 3:
        return '其他';
      case 9:
        return '未测';
    }
  } else if (valType === 2) {
    // 串镜
    switch (val) {
      case 0:
        return '正常';
      case 1:
        return '正↑负↓';
      case -1:
        return '正↓负↑';
      case 2:
        return '其他';
      case 9:
        return '未测';
    }
  }
};

/**
 * @description: 将100秒转为一分40秒格式
 * @param {number} val
 * @return {string}
 */
export const secondToMinutes = (val: number) => {
  if (!val) return '0';
  const second = Math.floor(val / 60);
  const minutes = val % 60;
  return `${second}'${minutes}''`;
};

/**
 * @description: 设置上传文件进度
 */
export const onUploadProgress = (progressEvent: any) => {
  const result = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(
    2
  );
  setStoreState('basic', 'uploadProgress', Number(result));
  if (progressEvent.loaded / progressEvent.total === 1) {
    setStoreState('basic', 'readingFile', true);
  }
};

/**
 * @description: 无嵌套使用的对象深拷贝
 * @param {object} obj
 * @return {object}
 */
export const deepCopy = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * @description: 计算科目得分
 * @param {number} result 科目成绩
 * @param {number} maxGrade 科目最大成绩
 * @param {number} PercentageOfTotalAchievement 科目占总成绩百分比：10
 * @param {boolean} isPercentageSys 是否为百分制
 * @return {number} 科目得分
 */
export const computeSubjectGrade = (
  result: number,
  maxGrade: number,
  PercentageOfTotalAchievement: number,
  isPercentageSys = false
) => {
  console.log('科目成绩', result);
  console.log('科目最大成绩', maxGrade);
  console.log('PercentageOfTotalAchievement', PercentageOfTotalAchievement);

  if (isPercentageSys) {
    return (result / maxGrade).toFixed(2);
  } else {
    return ((result / maxGrade) * PercentageOfTotalAchievement).toFixed(2);
  }
};

/**
 * @description: 将数组依据某字段进行排序
 * @param {string} property 排序的key
 * @return {number} 排序后的数组
 */
const compare = (property: string) => {
  return (a: any, b: any) => {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
};

type TestType = 'RATING' | 'ENUM' | 'TIME';
type ScoringType = 'CEILING' | 'FLOOR' | 'RANGE';
type DataGroupType = 'SEX_UNIFIED' | 'SEX_SEPARATED';
interface ruleItem {
  value: number | string;
  grade: number | string;
}

// 处理前的数据结构
interface RuleItem {
  value: string;
  grade: number;
  sex: number;
}

/**
 * @description:  根据录入成绩、规则（性别处理后能直接使用的规则）、计分方式计算学生成绩
 * @param {number} target 录入值（得分、时间、数值）
 * @param {ruleItem[]} rule 性别
 * @param {scoringType} scoringType 计分方式
 * @return {number} 科目成绩
 */
export const getScoreByRule = (
  target: number,
  rule: ruleItem[],
  scoringType: ScoringType //计分方式
) => {
  console.log('录入成绩', target);
  console.log('规则', rule);

  let result = 0;

  const gradeArr = rule.map(item => Number(item.value)); //成绩值数组
  const scoreArr = rule.map(item => Number(item.grade)); //得分值数组

  let hitIndex = 0; //命中规则索引

  // 判断录入成绩是否能在配置中直接找到
  if (gradeArr.indexOf(target) === -1) {
    //未找到时自动计算

    gradeArr.push(target);

    // 成绩值和得分可能是正相关也可能是负相关
    const isDirectProportion =
      gradeArr.length >= 1 ? (gradeArr[1] > gradeArr[0] ? true : false) : false;

    // 按成绩排序
    // {10:10,20:20}=》正序 {180:10,150:20,120:30}=》倒序
    const tempArr = gradeArr.sort((a: any, b: any) => {
      return isDirectProportion ? a - b : b - a;
    });

    const targetIndex = tempArr.lastIndexOf(target); //目标值对应索引

    // 边界值以外处理
    if (targetIndex === 0) {
      return scoreArr[0];
    } else if (targetIndex === tempArr.length - 1) {
      return scoreArr[scoreArr.length - 1];
    }

    const minGrade = gradeArr[targetIndex - 1] || 0; //区间最小成绩
    const maxGrade = gradeArr[targetIndex + 1] || 0; //区间最大成绩
    const minScore = scoreArr[targetIndex - 1] || 0; //区间最小得分
    const maxScore = scoreArr[targetIndex] || 0; //区间最大得分

    console.log(maxScore, minScore, maxGrade, minGrade);

    if (scoringType === 'RANGE') {
      result =
        Number(
          (
            ((maxScore - minScore) / (maxGrade - minGrade)) *
              (target - minGrade) +
            minScore
          ).toFixed(2)
        ) || 0;
    } else if (scoringType === 'CEILING') {
      result = maxScore;
    } else if (scoringType === 'FLOOR') {
      result = minScore;
    }
  } else {
    // 直接匹配
    hitIndex = gradeArr.indexOf(target);
    result = scoreArr[hitIndex];
  }

  console.log('目标得分为', result);
  return result;
};

/**
 * @description: 计算科目成绩
 * @param {number} target 录入值（得分、时间、数值）
 * @param {number} sex 性别
 * @param {number} ScoreAllocation 成绩规则
 * @param {number} testType 测试类型
 * @param {number} scoringType 计分方式
 * @param {number} dataGroupType 计分规则
 * @return {number} 科目成绩
 */
export const computeSubjectAchievement = (
  target: number,
  sex: number,
  ScoreAllocation: RuleItem[],
  testType: TestType,
  scoringType: ScoringType,
  dataGroupType: DataGroupType
) => {
  let result = 0; //目标返回值

  // 判断测试类型
  if (testType === 'RATING') {
    //测试类型为技评
    result = target;
  } else if (testType === 'ENUM' || testType === 'TIME') {
    //测试类型为数值或时间

    // 处理得分规则（后端返回值可能未排序）

    //统一/男生规则
    const baseRule = ScoreAllocation.filter((item: RuleItem) => {
      return item.sex === 1 || item.sex === 0;
    });

    //女生规则
    const womanRule = ScoreAllocation.filter((item: RuleItem) => {
      return item.sex === 2;
    });

    // 按得分排序后的规则
    const resultRule = baseRule.sort(compare('grade'));
    const resultWomanRule = womanRule.sort(compare('grade'));

    if (
      dataGroupType === 'SEX_UNIFIED' ||
      (dataGroupType === 'SEX_SEPARATED' && sex === 1)
    ) {
      // 统一规则或者性别为男
      result = getScoreByRule(target, resultRule, scoringType);
    } else {
      //双规则 且 性别为女
      result = getScoreByRule(target, resultWomanRule, scoringType);
    }
  }

  return result;
};

/**
 * @description:  根据性别、规则找到该学生最大得分
 * @param {number} sex 性别
 * @param {ruleItem[]} rule 性别
 * @return {number} 最大得分
 */
export const getMaxScoreByRule = (sex: number, rule: RuleItem[]) => {
  // 技评没有规则 最大值为100
  if (!rule || rule.length === 0) {
    return 100;
  }
  const baseRule = rule.filter((item: RuleItem) => {
    return item.sex === 1 || item.sex === 0;
  });
  const womanRule = rule.filter((item: RuleItem) => {
    return item.sex === 2;
  });

  // 按得分排序后的规则
  const resultRule = baseRule.sort(compare('grade'));
  const resultWomanRule = womanRule.sort(compare('grade'));

  if (sex === 1 && resultRule.length) {
    return resultRule[resultRule.length - 1].grade;
  } else if (sex === 2 && resultWomanRule.length) {
    return resultWomanRule[resultWomanRule.length - 1].grade;
  } else {
    return 100;
  }
};

/**
 * @description:  是否是整数
 * @param {number} val 目标值
 * @return {boolean}
 */
export const isInteger = (obj: number) => {
  return Math.floor(obj) === obj;
};

/**
 * @description:  获取md5加密结合sha1加密字符串
 * @param {number} code type
 * @return {boolean}
 */
export const getSineStr = (value: string) => {
  const mobileStr = Md5.hashStr(value);
  return mobileStr;
};

/**
 * @description:  获取md5加密结合sha1加密字符串
 * @param {number} mobileStr input值
 * @param {number} code type
 * @return {string}
 */
export const sha = (mobileStr: string, code: number) => {
  const typeStr = code * 256;
  const str = process.env.VUE_APP_GET_MOBILE_CODE_SIGN_SALT;
  return sha1(`${mobileStr}:${typeStr}:${str}`);
};

/**
 * @description:  点击按钮复制文本
 * @param {textVal} mobileStr 复制的文本
 */
const { toClipboard } = useClipboard();
export const copy = async (textVal: string) => {
  try {
    await toClipboard(textVal);
    message.success('复制成功');
  } catch (error) {
    console.error(error);
    message.success('复制失败');
  }
};

/**
 * @description:  根据索引转换为题目选项
 * @param {number} index  索引
 * @return {string}       选项
 */
export const getTag = (index: number) => {
  const tagArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return tagArr[index];
};

/**
 * 获取图片尺寸
 * @param src 图片地址，支持 URL, Base64 或 Blob
 * @returns 图片尺寸信息
 */
export const getImageSize = (src: string): Promise<ElementSize> => {
  return new Promise((resolve, reject) => {
    const imageElement = new Image();

    imageElement.src = src;

    imageElement.onload = () =>
      resolve({
        width: imageElement.width,
        height: imageElement.height
      });

    imageElement.onerror = error => reject(error);
  });
};
