/**
 * @description 格式化日期方法
 */
export const formatTime = {
  formatTimeNumber: (number, toast = true) => {
    const timeObj = {
      s: '', // 秒
      m: '', // 分
      format: '',
      error: '',
      rule: true,
      timeStamp: ''
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
        if (toast) {
          uni.showToast({
            title: '请输入0至59范围的秒数',
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }

        timeObj['s'] = '';
        timeObj['error'] = '请输入0至59范围的秒数';
        timeObj.rule = false;
        return timeObj;
      }
      if (strArr[1] && strArr[1].length > 2) {
        // timeObj['s'] = '';
        if (toast) {
          uni.showToast({
            title: '最多可输入2位小数',
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }

        timeObj['error'] = '请输入0至59范围的秒数';
        timeObj.rule = false;
        // return timeObj;
      }
      if (strArr[1] && strArr[1]) {
        timeObj['s'] = Number(`${timeObj['s']}.${strArr[1]}`);
      }

      for (let i = 0; i < mAr.length; i++) {
        timeObj['m'] = Number(timeObj['m'] + mAr[i]);
      }
      if (timeObj['m'] > 999) {
        if (toast) {
          uni.showToast({
            title: '请输入0至999范围的分钟数',
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }

        timeObj['m'] = '';
        timeObj['error'] = '请输入0至999范围的分钟数';
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
  timeStampToTime: (timeStamp) => {
    const result = {
      s: '', // 秒
      m: '', // 分
      format: '',
      rule: true,
      rateFormat: '',
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
      result.rateFormat = result.m * 100 + result.s;
    } catch (err) {
      result.rule = false;
      throw new Error(err);
    }

    return result;
  },
  skillRule: (rate) => {
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
  NumberRule: (rate) => {
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

/**
 *  @description 处理表格表头
 * */
export const getTableHeader = (data, total) => {
  if (!data) return [];
  const { subjectSettingListVO = [] } = data;
  const renderHeader = (title, z) => {
    return `<view class="colun-flex">
          <view class="title">${title}</view>
          <text class="label">${z}%</text>
        </view>`;
  };
  const filterRender = (value) => {
    if (value === null || value === undefined) return '-';
    return value;
  };
  const columns = [
    {
      key: 'name',
      width: 270,
      proportion: false,
      count: total,
      style: {
        color: '#666'
      },
      render({ count }) {
        return `<text>学生列表(${count})</text>`;
      },
      h({ name, number, sexStr }) {
        return `
        <view class="colun-flex">
          <view class="name">${name}(${sexStr})</view>
          <view class="code">${number}</view>
        </view>`;
      }
    },
    {
      title: '总分',
      key: 'total',
      proportion: false,
      align: 'center',
      style: {
        fontWeight: 'bold'
      },
      width: 196,
      h({ total }) {
        const commonS = 'font-size: 32rpx; font-weight:bold;color:';
        const h = (color, total) =>
          `<text style="${commonS + color};">${total}<text>`;
        if (total === '') return '-';
        if (total >= 60) return h('#222', total);
        return h('#FF6767', total);
      }
    }
  ];
  if (subjectSettingListVO && Array.isArray(subjectSettingListVO)) {
    let len = 0;
    while (len < subjectSettingListVO.length) {
      const { id, title, proportion } = subjectSettingListVO[len];
      columns.push({
        key: id,
        align: 'center',
        width: 196,
        class: ['bor-right'],
        proportion: true,
        proportionValue: proportion,
        render() {
          return renderHeader(title, proportion);
        },
        h(data) {
          return filterRender(data[id]);
        }
      });
      ++len;
    }
  }
  const endColumns = [
    {
      title: '考勤',
      key: 'sign',
      proportion: true,
      proportionValue: data.sign,
      align: 'center',
      width: 196,
      class: ['bor-right'],
      render({ title }) {
        return renderHeader(title, data.sign);
      },
      h({ sign }) {
        return filterRender(sign);
      }
    },
    {
      title: '理论考试',
      key: 'theoryExamination',
      proportion: true,
      proportionValue: data.theoryExamination,
      align: 'center',
      width: 196,
      class: ['bor-right'],
      render({ title }) {
        return renderHeader(title, data.theoryExamination);
      },
      h({ theoryExamination }) {
        return filterRender(theoryExamination);
      }
    },
    {
      title: data.normalName,
      key: 'coursePerformance',
      align: 'center',
      width: 196,
      class: ['bor-right'],
      proportion: true,
      proportionValue: data.coursePerformance,
      render({ title }) {
        return renderHeader(title, data.coursePerformance);
      },
      h({ coursePerformance }) {
        return filterRender(coursePerformance);
      }
    },
    {
      title: '跑步',
      key: 'running',
      proportion: true,
      proportionValue: data.running,
      align: 'center',
      width: 196,
      class: ['bor-right'],
      render({ title }) {
        return renderHeader(title, data.running);
      },
      h({ running }) {
        return filterRender(running);
      }
    },
    {
      title: '课外活动',
      proportion: true,
      proportionValue: data.activity,
      key: 'activity',
      align: 'center',
      width: 196,
      class: ['bor-right'],
      render({ title }) {
        return renderHeader(title, data.activity);
      },
      h({ activity }) {
        return filterRender(activity);
      }
    },
    {
      title: '体质健康',
      key: 'fitness',
      align: 'center',
      width: 196,
      proportion: true,
      proportionValue: data.fitness,
      class: ['bor-right'],
      render({ title }) {
        return renderHeader(title, data.fitness);
      },
      h({ fitness }) {
        return filterRender(fitness);
      }
    }
  ];
  columns.push(...endColumns);
  columns.push({
    title: '附加分',
    key: 'additionalPoints',
    align: 'center',
    width: 196,
    proportion: false,
    style: { color: '#222', fontWeight: 600 },
    class: ['bor-right'],
    h({ additionalPoints }) {
      return filterRender(additionalPoints);
    }
  });
  return columns;
};

/**
 * @description 处理表格body内容
 * */
export const getTableBody = (body) => {
  const result = [];
  if (body && Array.isArray(body)) {
    let _index = 0;
    while (_index < body.length) {
      /**
       * @todo 数据处理逻辑 25+1+1+10+8+10+3.3
       * */
      const rowItem = {
        ...body[_index]
      };
      const { subjectSettingListVO = [] } = body[_index];
      const len = subjectSettingListVO && subjectSettingListVO.length;
      if (len > 0) {
        let sub_index = 0;
        while (sub_index < len) {
          const { id, grade } = subjectSettingListVO[sub_index];
          rowItem[id] = grade;
          ++sub_index;
        }
      }
      result.push(rowItem);
      ++_index;
    }
  }
  return result;
};

/**
 * @description 处理详情项目列表
 * */
export const getScoreProjectList = (headerData, detail, state) => {
  const result = [];
  const setValue = (val) => {
    if (val === '' || val === null) return '-';
    return val;
  };
  // headerData 表头项目列表，测试项目，包括每项的规则
  if (!headerData) return result;
  // 详情，包含每项的分数
  if (!detail || !detail.id) return result;
  const { subjectSettingListVO = [] } = headerData;
  const setDisabled = (state) => state === 'show';
  // 默认项目 考勤 跑步 活动 体质健康 理论 课堂表现 附加分 备注
  // 处理专项成绩
  const len = subjectSettingListVO && subjectSettingListVO.length;
  if (len > 0) {
    let _index = 0;
    const detail_subjectSettingListVO = detail['subjectSettingListVO'] || [];
    while (_index < len) {
      const { id, title, proportion, subjectType } =
        subjectSettingListVO[_index];
      // 专项详情去匹配该学生的科目信息
      const d_item = detail_subjectSettingListVO.find((d) => d.id === id);
      const projectItem = {
        id,
        title,
        showScore: true,
        proportion,
        ppon: true,
        type: subjectType ? subjectType.toLocaleLowerCase() : null, //测试类型
        score: '',
        value: '', //去详情找
        isSpecial: true,
        disabled: setDisabled(state),
        inputType: 'number',
        rules: [
          {
            min: 0,
            message: '不能为负数'
          },
          {
            decimal: 2,
            message: '最多可输入2位小数'
          }
        ]
      };
      if (subjectType === 'RATING') {
        // 计评范围0-100
        projectItem.rules.push({
          max: 100,
          message: '请输入0至100范围的整数'
        });
        projectItem.rules.push({
          max: 100,
          isInteger: true,
          message: '请输入0至100范围的整数'
        });
        // 计评不展示分数
        // projectItem.showScore = false;
      }
      if (d_item) {
        const { value, grade } = d_item;
        projectItem.value = value;
        projectItem.score = grade;
      }
      result.push(projectItem);
      ++_index;
    }
  }
  const mommonProjectEnd = [
    {
      ppon: true,
      title: '考勤', // 标题
      proportion: headerData.sign, // 占比
      value: detail.sign, // 值
      score: 0, // 单项分数
      isSpecial: false,
      disabled: setDisabled(state),
      inputType: 'number',
      id: 'sign', // 标识 key
      showScore: false,
      rules: [
        {
          decimal: 2,
          message: '最多可输入2位小数'
        },
        {
          min: 0,
          message: '不能输入负数'
        }
      ]
    },
    {
      title: '理论考试', // 标题
      showScore: false,
      ppon: true,
      proportion: headerData.theoryExamination, // 占比
      value: detail.theoryExamination, // 值
      score: 0, // 单项分数
      isSpecial: false,
      disabled: setDisabled(state),
      inputType: 'number',
      rules: [
        {
          decimal: 2,
          message: '最多可输入2位小数'
        },
        {
          min: 0,
          message: '不能输入负数'
        }
      ],
      id: 'theoryExamination' // 标识 key
    },
    {
      title: headerData.normalName, // 课堂表现
      ppon: true,
      showScore: false,
      proportion: headerData.coursePerformance, // 占比
      value: detail.coursePerformance, // 值
      score: 0, // 单项分数
      isSpecial: false,
      disabled: setDisabled(state),
      inputType: 'number',
      rules: [
        {
          decimal: 2,
          message: '最多可输入2位小数'
        },
        {
          min: 0,
          message: '不能输入负数'
        }
      ],
      id: 'coursePerformance' // 标识 key
    },
    {
      ppon: true,
      title: '跑步', // 标题
      showScore: false,
      proportion: headerData.running, // 占比
      value: detail.running, // 值
      score: 0, // 单项分数
      isSpecial: false,
      disabled: true,
      inputType: 'number',
      id: 'running', // 标识 key
      rules: []
    },
    {
      title: '课外活动', // 标题
      ppon: true,
      showScore: false,
      proportion: headerData.activity, // 占比
      value: setValue(detail.activity), // 值
      score: 0, // 单项分数
      disabled: true,
      isSpecial: false,
      inputType: 'number',
      rules: [],
      id: 'activity' // 标识 key
    },
    {
      title: '体质健康', // 标题
      ppon: true,
      showScore: false,
      proportion: headerData.fitness, // 占比
      value: setValue(detail.fitness), // 值
      score: 0, // 单项分数
      disabled: true,
      isSpecial: false,
      inputType: 'number',
      id: 'fitness' // 标识 key
    },
    {
      type: 'line'
    },
    {
      title: '附加分', // 标题
      showScore: false,
      ppon: false,
      value: detail.additionalPoints, // 值
      score: 0, // 单项分数
      isSpecial: false,
      disabled: true,
      hiddenProportion: true,
      inputType: 'number',
      rules: [
        {
          decimal: 2,
          message: '最多可输入2位小数'
        },
        {
          min: 0, //20211204 需求改了哟，范围是大于0，不是0-100的范围了
          message: '不能为负数'
        }
      ],
      id: 'additionalPoints' // 标识 key
    },
    {
      ppon: false,
      title: '备注', // 标题
      proportion: '', // 占比
      value: detail.content, // 值
      isSpecial: false,
      disabled: true,
      inputType: 'textarea',
      score: 0, // 单项分数
      id: 'content' // 标识 key
    }
  ];
  result.push(...mommonProjectEnd);
  // 过滤掉占比为0的项目
  return result.filter(({ ppon, proportion }) => {
    if (!ppon) return true;
    if (ppon && proportion > 0) return true;
    return false;
  });
};

/**
 * @description 计算分数
 * */
export const calculateScore = (subjectType, rules, score) => {
  const { proportion } = rules;
  // subjectType 科目类型： 专项考试(special) 理论考试(theory) 考勤(attendance) 附加分(additional)
  // rule 算分规则
  // score 当前分数
  // 判断科目类型是否专项考试
  //  const scoreRules = [
  //    {
  //      value: 50,
  //      grad: 1
  //    },
  //    {},
  //    {}
  //   ]
  const result = {
    currentScore: '', // 当前科目成绩
    proportionScore: '' // 计算比例后的占比成绩
  };
  if (subjectType === 'additional') {
    // 附加分 无占比 累加在总分
    result.currentScore = score;
    result.proportionScore = score;
  }
  if (subjectType === 'attendance') {
    // 考勤 规则 至少满足次数  占比
    result.currentScore = score;
    result.proportionScore = score * proportion;
  }
  if (subjectType === 'theory') {
    // 理论考试
    result.currentScore = score;
    result.proportionScore = score * proportion;
  }
  if (subjectType === 'special') {
    // 规则 1. 自动匹配 2. 向上取整 3.向下取整 4.男女区别 5.占比
    const rules = {
      man: [],
      woman: [],
      sortMan: [],
      sortWoman: [],
      sectionMan: [],
      sectionWoman: []
    };
    const qj = [
      // 19 [15, 20]
      {
        grad: 100,
        value: 20,
        sex: 1
      },
      {
        grad: 80,
        value: 15,
        sex: 2
      },
      {
        grad: 50,
        value: 10,
        sex: 1
      },
      {
        grad: 30,
        value: 6,
        sex: 2
      }
    ];
    let index = 0;
    // 根据性别筛选规则
    while ((index < qj.length, index++)) {
      if (qj[index].sex === 1) rules['man'].push(qj[index]);
      if (qj[index].sex === 2) rules['woman'].push(qj[index]);
    }
    // 规则排序
    rules.mam = rules.mam.sort((a, b) => a.value - b.value);
    rules.woman = rules.woman.sort((a, b) => a.value - b.value);

    // 区间匹配
    rules.sectionMan = rules.mam.map((item, index) => {
      const result = {
        min: 0,
        max: 0
      };
      if (index === 0) {
        result.min = -Infinity;
        result.max = item.value;
      } else if (index === rules.mam.length - 1) {
        result.min = item.value;
        result.max = Infinity;
      } else {
        result.min = rules.mam[index - 1].value;
        result.max = item.value;
      }
      return result;
    });
    // 13 -> [20,15,10,6] => [6,10,15,20] [{ max: Infinity, min: 20 }, { max: 20, min: 15 }];
  }
  return result;
};

/**
 * @description 初始化原始值
 */
export const setOriginalVs = (data, subList) => {
  const setValue = (val) => {
    if (val === 0) return '0';
    if (val === null || val === undefined || val === '') return '';
    return val;
  };
  const nullValue = (val) => {
    return val === null;
  };
  const {
    activity,
    sign,
    fitness,
    theoryExamination,
    additionalPoints,
    content,
    coursePerformance,
    subjectSettingListVO = []
  } = data;
  const originalVs = [
    {
      key: 'activity',
      oldval: setValue(activity),
      newval: setValue(activity),
      isNull: nullValue(activity),
      rule: true
    },
    {
      key: 'sign',
      oldval: setValue(sign),
      newval: setValue(sign),
      isNull: nullValue(sign),
      rule: true
    },
    {
      key: 'fitness',
      oldval: setValue(fitness),
      newval: setValue(fitness),
      isNull: nullValue(fitness),
      rule: true
    },
    {
      key: 'theoryExamination',
      oldval: setValue(theoryExamination),
      newval: setValue(theoryExamination),
      isNull: nullValue(theoryExamination),
      rule: true
    },
    {
      key: 'coursePerformance', // 课堂表现
      oldval: setValue(coursePerformance),
      newval: setValue(coursePerformance),
      isNull: nullValue(coursePerformance),
      rule: true
    },
    {
      key: 'additionalPoints',
      oldval: setValue(additionalPoints),
      newval: setValue(additionalPoints),
      isNull: nullValue(additionalPoints),
      rule: true
    },
    {
      key: 'content',
      oldval: setValue(content),
      newval: setValue(content),
      rule: true
    }
  ];
  const list = subjectSettingListVO || subList || [];
  list.map(({ id, value }) => {
    originalVs.push({
      key: id,
      oldval: setValue(value),
      newval: setValue(value),
      special: true,
      rule: true
    });
  });

  return originalVs;
};

/**
 * @description 提交验证按钮，是否存在值的修改
 */
export const verificationBtn = (origina) => {
  // origina 原始数据
  // currentval 当前项目
  // const values = [];
  for (let i = 0; i < origina.length; i++) {
    if (!origina[i].rule) return false;
  }
  return true;
  // for (let i = 0; i < origina.length; i++) {
  //   const { newval, oldval } = origina[i];
  //   if (oldval === null) values.push(newval === oldval);
  //   else values.push(String(newval) === String(oldval));
  // }
  // return values.indexOf(false) > -1;
};
