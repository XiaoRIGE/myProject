export const evaluateStatus = {
  // 评价状态
  0: 'notConfigured', // 未配置
  1: 'notEvaluated', // 已配置,未评价
  2: 'evaluated' // 已评价
};

export const evaluateStatusNames = {
  // 按钮名称
  notConfigured: '. 暂未配置教师评价',
  notEvaluated: '立即评价',
  evaluated: '. 已评价'
};

/**
 * @description 获取评价状态
 * */
export const getEvaluateStatus = (state) => {
  if (state === null) return evaluateStatus[0];
  return evaluateStatus[state];
};

/**
 * @description 获取右侧按钮状态名称
 * */
export const getEvaluateStatusNames = (state) => evaluateStatusNames[state];

// 题目类型
export const questionTypes = {
  1: 'single',
  2: 'multiple',
  3: 'grade',
  4: 'brief'
};

// 题目类型-对应名称
export const questionTypesNames = {
  single: '单选题',
  multiple: '非固定选题',
  grade: '评分题',
  brief: '简答题'
};

export const getQuestionTypes = (state) => questionTypes[state];

export const getQuestionTypesName = (state) => questionTypesNames[state];
