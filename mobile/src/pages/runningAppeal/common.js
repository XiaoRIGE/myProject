const statusNames = {
  processing: '处理中',
  success: '申诉成功',
  fail: '申诉失败'
};
const status = {
  0: 'processing',
  1: 'success',
  2: 'fail'
};

const scoringTypeStatus = {
  1: 'mileage',
  2: 'part'
};

const scoringTypeStatusNames = {
  mileage: '里程',
  part: '段数'
};

const scoringUnits = {
  mileage: 'KM',
  part: '段'
};

export const totalKeys = {
  mileage: 'totalMileage',
  part: 'totalPart'
};

export const getStatus = state => status[state];

export const getStatusName = state => statusNames[state];

export const getScoringTypeStatus = state => scoringTypeStatus[state];

export const getScoringTypeStatusNames = state => scoringTypeStatusNames[state];

export const getScoringUnits = state => scoringUnits[state];
