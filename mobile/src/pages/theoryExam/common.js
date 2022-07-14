// TAG 状态
export const tagStatus = {
  0: 'notStarted', // 未开始
  1: 'inProgress', // 进行中
  2: 'hasEnded' // 已结束
};

// TAG 状态名称
export const tagStatusNames = {
  inProgress: '进行中',
  notStarted: '未开始',
  hasEnded: '已结束'
};

// 右侧按钮状态
export const btnStatus = {
  0: 'startExam',
  1: 'continueExam',
  2: 'success' // 已完成考试
};

// 右侧按钮名称
export const btnsStatusNames = {
  startExam: '开始考试', // 未开始
  continueExam: '继续考试',
  missExam: '缺考',
  score: '得分'
};

// 单选题，多选题，判断题
export const examTagStatus = {
  radio: '单选题',
  checkbox: '非固定选题',
  judge: '判断题'
};

// 错误弹窗提示内容
export const errContent = {
  90005: '考试起止时间被修改，请与老师确定考试时间',
  90006: '考试时间已过，提交失败'
};

export const getTagStatus = (state) => tagStatus[state];

export const getTagStatusNames = (tag) => tagStatusNames[tag];

export const getBtnStatus = (state) => btnStatus[state];

export const getBtnsStatusName = (status) => btnsStatusNames[status];

export const getExamTagStatusName = (tag) => examTagStatus[tag];
