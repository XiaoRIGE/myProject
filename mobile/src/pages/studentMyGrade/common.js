// 总分图标选项
const opts = {
  type: 'arcbar',
  canvasId: '',
  canvas2d: false,
  background: 'none',
  animation: true,
  timing: 'easeOut',
  duration: 1000,
  color: ['#FFA903', '#FC6C37'],
  padding: [20, 20, 20, 20],
  rotate: false,
  errorReload: true,
  fontSize: 12,
  fontColor: '#666666',
  enableScroll: false,
  touchMoveLimit: 60,
  enableMarkLine: false,
  dataLabel: true,
  dataPointShape: true,
  dataPointShapeType: 'solid',
  tapLegend: true,
  title: {
    name: '0',
    fontSize: 32,
    color: '#222222 ',
    offsetX: 0,
    offsetY: -15
  },
  subtitle: {
    name: '课程总分',
    fontSize: 12,
    color: '#666666',
    offsetX: 0,
    offsetY: -10
  },
  extra: {
    arcbar: {
      type: 'default',
      width: 15,
      backgroundColor: '#ECECEC',
      startAngle: 1,
      endAngle: 0,
      radius: 85,
      gap: 2,
      centerX: 0,
      centerY: 115,
      linearType: 'custom',
      customColor: ['#FC6C37']
    }
  }
};

export const getOpts = (total) => {
  opts.title.name = total;
  return opts;
};

// 成绩固定列表
const fixedParams = [
  {
    title: '考勤',
    key: 'sign',
    proportion: 0,
    grade: 0
  },
  {
    title: '跑步',
    key: 'running',
    proportion: 0,
    grade: 0
  },
  {
    title: '课外活动',
    key: 'activity',
    proportion: 0,
    grade: 0
  },
  {
    title: '体质健康',
    proportion: 0,
    key: 'fitness',
    grade: 0
  },
  {
    title: '理论考试',
    proportion: 0,
    key: 'theoryExamination',
    grade: 0
  },
  {
    title: '课堂表现',
    proportion: 0,
    key: 'coursePerformance',
    grade: 0
  }
];

// 获取成绩列表
export const getGradeList = (gradeData, gradeHead) => {
  // 固定成绩
  fixedParams.forEach((item) => {
    if (item.key === 'coursePerformance') {
      item.title = gradeHead.normalName;
    }
    item.proportion = gradeHead[item.key];
    item.grade = gradeData[item.key];
  });
  // 专项成绩
  let subjectGrade = [];
  if (gradeHead.subjectSettingListVO) {
    subjectGrade = gradeHead.subjectSettingListVO.map((item) => {
      const subjectItem = {
        title: item.title,
        proportion: item.proportion,
        key: item.id,
        grade: 0
      };
      return subjectItem;
    });
    // 专项成绩
    subjectGrade.forEach((item) => {
      gradeData.subjectSettingListVO.forEach((i) => {
        if (item.key === i.id) {
          item.grade = i.grade;
        }
      });
    });
  }
  // 附加分
  const additionalPoints = {
    title: '附加分',
    proportion: 100,
    key: 'additionalPoints',
    grade: gradeData['additionalPoints']
  };
  return [...fixedParams, ...subjectGrade, additionalPoints];
};
