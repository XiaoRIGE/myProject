export const projectMenu = {
  1: '身高体重',
  2: '肺活量',
  3: '50米',
  4: '坐位体前屈',
  5: '立定跳远',
  6: '引体向上',
  7: '仰卧起坐',
  8: '800米',
  9: '1000米',
  10: '视力'
};
// 格式化秒为分秒
const formatTime = (time) => {
  if (!time) return '';
  if (time < 60) return `${time}秒`;
  const m = time / 60;
  const s = time % 60;
  return `${parseInt(m)}分${s.toFixed(0)}秒`;
};
export const menuList = {
  1: [
    {
      type: 1,
      title: '身高体重',
      score: 'bmiScore',
      value: 'bmi',
      level: 'bmiTag',
      render(params) {
        const { height, weight, bmi } = params;
        return `BMI ${bmi || ''} ${height || ''}cm/${weight || ''}kg`;
      },
      src: 't1-icon.svg'
    },
    {
      type: 2,
      title: '肺活量',
      score: 'vitalCapacityScore',
      value: 'vitalCapacity',
      unit: '毫升',
      level: 'vitalCapacityTag',
      src: 't2-icon.svg'
    },
    {
      type: 3,
      title: '50米',
      src: 't3-icon.svg',
      render(params) {
        return formatTime(params.fiftyMeters);
      },
      score: 'fiftyMetersScore',
      value: 'fiftyMeters',
      level: 'fiftyMetersTag'
    },
    {
      type: 4,
      title: '坐位体前屈',
      src: 't4-icon.svg',
      score: 'sitAndReachScore',
      value: 'sitAndReach',
      level: 'sitAndReachTag',
      unit: '个'
    },
    {
      type: 5,
      title: '立定跳远',
      src: 't5-icon.svg',
      score: 'jumpScore',
      value: 'jump',
      level: 'jumpTag',
      unit: '厘米'
    },
    {
      type: 6,
      title: '引体向上',
      src: 't7-icon.svg',
      score: 'pullUpScore',
      value: 'pullUp',
      level: 'pullUpTag',
      unit: '个'
    },
    {
      type: 9,
      title: '1000米',
      src: 't8-icon.svg',
      score: 'thousandMetersScore',
      value: 'thousandMeters',
      level: 'thousandMetersTag',
      render(params) {
        return formatTime(params.thousandMeters);
      }
    }
  ],
  2: [
    {
      type: 1,
      title: '身高体重',
      score: 'bmiScore',
      value: 'bmi',
      level: 'bmiTag',
      render(params) {
        const { height, weight, bmi } = params;
        return `BMI ${bmi || ''} ${height || ''}cm /${weight || ''}kg`;
      },
      src: 't1-icon.svg'
    },
    {
      type: 2,
      title: '肺活量',
      src: 't2-icon.svg',
      score: 'vitalCapacityScore',
      value: 'vitalCapacity',
      level: 'vitalCapacityTag',
      unit: '毫升'
    },
    {
      type: 3,
      title: '50米',
      src: 't3-icon.svg',
      score: 'fiftyMetersScore',
      value: 'fiftyMeters',
      render(params) {
        return formatTime(params.fiftyMeters);
      },
      level: 'fiftyMetersTag'
    },
    {
      type: 4,
      title: '坐位体前屈',
      src: 't4-icon.svg',
      score: 'sitAndReachScore',
      value: 'sitAndReach',
      level: 'sitAndReachTag',
      unit: '个'
    },
    {
      type: 5,
      title: '立定跳远',
      src: 't5-icon.svg',
      score: 'jumpScore',
      value: 'jump',
      level: 'jumpTag',
      unit: '厘米'
    },
    {
      type: 7,
      title: '仰卧起坐',
      src: 't9-icon.svg',
      score: 'sitUpScore',
      value: 'sitUp',
      unit: '个',
      level: 'sitUpTag'
    },
    {
      type: 8,
      title: '800米',
      src: 't8-icon.svg',
      score: 'eightHundredMetersScore',
      value: 'eightHundredMeters',
      level: 'eightHundredMetersTag',
      render(params) {
        return formatTime(params.eightHundredMeters);
      }
    }
  ]
};

export const getGradeList = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(({ year }, index) => ({
    text: year,
    color: '#333',
    fontSize: 36,
    index
  }));
};

export const projectList = [
  {
    className: 'one',
    title: '速度素质',
    type: 1,
    projectType: 6
  },
  {
    className: 'tow',
    title: '体重指数',
    type: 2,
    projectType: 1
  },
  {
    className: 'three',
    title: '柔韧素质',
    type: 3,
    projectType: 5
  },
  {
    className: 'four',
    title: '耐力素质',
    type: 4,
    projectType: 4
  },
  {
    className: 'five',
    title: '力量素质',
    type: 5,
    projectType: 3
  },
  {
    className: 'six',
    title: '肺活量',
    type: 6,
    projectType: 2
  }
];
export const opts = {
  type: 'radar',
  canvasId: '',
  canvas2d: false,
  background: 'none',
  animation: true,
  timing: 'easeOut',
  duration: 1000,
  color: ['#FF6E19'],
  textStyle: {
    color: ['#FF6E19'],
    fontSize: 10,
    margin: [
      0, // 上
      10, // 右
      5, // 下
      0 // 左
    ]
  },
  padding: [20, 20, 20, 20],
  rotate: false,
  errorReload: true,
  fontSize: 14,
  fontColor: '#666666',
  enableScroll: false,
  touchMoveLimit: 60,
  enableMarkLine: false,
  dataLabel: false,
  dataPointShape: true,
  dataPointShapeType: 'hollow',
  legend: {
    show: false
  },
  extra: {
    radar: {
      gridType: 'radar',
      gridColor: '#E6E6E6',
      gridCount: 3,
      labelColor: '#333333',
      opacity: 0.2,
      border: true,
      borderWidth: 1,
      max: 100
    },
    arcbar: { startAngle: 1.5 },
    tooltip: {
      showBox: false,
      showArrow: true,
      showCategory: false,
      borderWidth: 0,
      borderRadius: 0,
      borderColor: '#000000',
      borderOpacity: 0.7,
      bgColor: '#000000',
      bgOpacity: 0.7,
      gridType: 'solid',
      dashLength: 4,
      gridColor: '#CCCCCC',
      fontColor: '#FFFFFF',
      splitLine: true,
      horizentalLine: false,
      xAxisLabel: false,
      yAxisLabel: false,
      labelBgColor: '#FFFFFF',
      labelBgOpacity: 0.7,
      labelFontColor: '#666666'
    }
  }
};

export const quotaData = {
  1: {
    // 身高体重
    1: [
      //男
      {
        value: 'BMI',
        label: '低体重',
        showScore: true,
        score: '80分'
      },
      {
        value: '17.9',
        label: '正常',
        showScore: true,
        score: '100分'
      },
      {
        value: '24.0',
        label: '超重',
        showScore: true,
        score: '80分'
      },
      {
        value: '28.0',
        label: '肥胖',
        showScore: true,
        score: '60分'
      }
    ],
    2: [
      // 女
      {
        value: 'BMI',
        label: '低体重',
        showScore: true,
        score: '80分'
      },
      {
        value: '17.2',
        label: '正常',
        showScore: true,
        score: '100分'
      },
      {
        value: '24.0',
        label: '超重',
        showScore: true,
        score: '80分'
      },
      {
        value: '28.0',
        label: '肥胖',
        showScore: true,
        score: '60分'
      }
    ]
  },
  2: {
    // 肺活量
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '毫升',
          label: '不及格'
        },
        {
          value: '3100',
          label: '及格'
        },
        {
          value: '4300',
          label: '良好'
        },
        {
          value: '4800',
          label: '优秀'
        },
        {
          value: '5040',
          label: '100分'
        }
      ],
      2: [
        // 女
        {
          value: '毫升',
          label: '不及格'
        },
        {
          value: '2000',
          label: '及格'
        },
        {
          value: '3000',
          label: '良好'
        },
        {
          value: '3300',
          label: '优秀'
        },
        {
          value: '3400',
          label: '100分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '毫升',
          label: '不及格'
        },
        {
          value: '3200',
          label: '及格'
        },
        {
          value: '4400',
          label: '良好'
        },
        {
          value: '4900',
          label: '优秀'
        },
        {
          value: '5140',
          label: '100分'
        }
      ],
      2: [
        {
          value: '毫升',
          label: '不及格'
        },
        {
          value: '2050',
          label: '及格'
        },
        {
          value: '3050',
          label: '良好'
        },
        {
          value: '3350',
          label: '优秀'
        },
        {
          value: '3450',
          label: '100分'
        }
      ]
    }
  },
  3: {
    // 50米
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '秒',
          label: '不及格'
        },
        {
          value: '9.1',
          label: '及格'
        },
        {
          value: '7.1',
          label: '良好'
        },
        {
          value: '6.9',
          label: '优秀'
        },
        {
          value: '6.7',
          label: '100分'
        }
      ],
      2: [
        // 女
        {
          value: '秒',
          label: '不及格'
        },
        {
          value: '10.3',
          label: '及格'
        },
        {
          value: '8.3',
          label: '良好'
        },
        {
          value: '7.7',
          label: '优秀'
        },
        {
          value: '7.5',
          label: '100分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '秒',
          label: '不及格'
        },
        {
          value: '9.0',
          label: '及格'
        },
        {
          value: '7.0',
          label: '良好'
        },
        {
          value: '6.8',
          label: '优秀'
        },
        {
          value: '6.6',
          label: '100分'
        }
      ],
      2: [
        {
          value: '秒',
          label: '不及格'
        },
        {
          value: '10.2',
          label: '及格'
        },
        {
          value: '8.2',
          label: '良好'
        },
        {
          value: '7.6',
          label: '优秀'
        },
        {
          value: '7.4',
          label: '100分'
        }
      ]
    }
  },
  4: {
    // 坐位体前屈
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '3.7',
          label: '及格'
        },
        {
          value: '17.7',
          label: '良好'
        },
        {
          value: '21.3',
          label: '优秀'
        },
        {
          value: '24.9',
          label: '100分'
        }
      ],
      2: [
        // 女
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '6.0',
          label: '及格'
        },
        {
          value: '19.0',
          label: '良好'
        },
        {
          value: '22.2',
          label: '优秀'
        },
        {
          value: '25.8',
          label: '100分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '4.2',
          label: '及格'
        },
        {
          value: '18.2',
          label: '良好'
        },
        {
          value: '21.5',
          label: '优秀'
        },
        {
          value: '25.1',
          label: '100分'
        }
      ],
      2: [
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '6.5',
          label: '及格'
        },
        {
          value: '19.5',
          label: '良好'
        },
        {
          value: '22.4',
          label: '优秀'
        },
        {
          value: '26.3',
          label: '100分'
        }
      ]
    }
  },
  5: {
    // 立定跳远
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '208',
          label: '及格'
        },
        {
          value: '248',
          label: '良好'
        },
        {
          value: '263',
          label: '优秀'
        },
        {
          value: '273',
          label: '100分'
        }
      ],
      2: [
        // 女
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '151',
          label: '及格'
        },
        {
          value: '181',
          label: '良好'
        },
        {
          value: '195',
          label: '优秀'
        },
        {
          value: '207',
          label: '100分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '210',
          label: '及格'
        },
        {
          value: '250',
          label: '良好'
        },
        {
          value: '265',
          label: '优秀'
        },
        {
          value: '275',
          label: '100分'
        }
      ],
      2: [
        {
          value: '厘米',
          label: '不及格'
        },
        {
          value: '152',
          label: '及格'
        },
        {
          value: '182',
          label: '良好'
        },
        {
          value: '196',
          label: '优秀'
        },
        {
          value: '208',
          label: '100分'
        }
      ]
    }
  },
  6: {
    // 引体向上
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '次数',
          label: '不及格'
        },
        {
          value: '10',
          label: '及格'
        },
        {
          value: '15',
          label: '良好'
        },
        {
          value: '17',
          label: '优秀'
        },
        {
          value: '19',
          label: '100分',
          isEndLabel: true,
          endValue: '29',
          endLabel: '110分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '次数',
          label: '不及格'
        },
        {
          value: '11',
          label: '及格'
        },
        {
          value: '16',
          label: '良好'
        },
        {
          value: '18',
          label: '优秀'
        },
        {
          value: '20',
          label: '100分',
          isEndLabel: true,
          endValue: '30',
          endLabel: '110分'
        }
      ]
    }
  },
  7: {
    // 仰卧起坐
    1: {
      // 年级 大一大二
      2: [
        // 女
        {
          value: '次数',
          label: '不及格'
        },
        {
          value: '26',
          label: '及格'
        },
        {
          value: '46',
          label: '良好'
        },
        {
          value: '52',
          label: '优秀'
        },
        {
          value: '56',
          label: '100分',
          isEndLabel: true,
          endValue: '69',
          endLabel: '110分'
        }
      ]
    },
    2: {
      // 大三大四
      2: [
        {
          value: '次数',
          label: '不及格'
        },
        {
          value: '27',
          label: '及格'
        },
        {
          value: '47',
          label: '良好'
        },
        {
          value: '53',
          label: '优秀'
        },
        {
          value: '57',
          label: '100分',
          isEndLabel: true,
          endValue: '70',
          endLabel: '110分'
        }
      ]
    }
  },
  8: {
    // 800米
    1: {
      // 年级 大一大二
      2: [
        // 女
        {
          value: '时间',
          label: '不及格'
        },
        {
          value: "4'34''",
          label: '及格'
        },
        {
          value: "3'44''",
          label: '良好'
        },
        {
          value: "3'30''",
          label: '优秀'
        },
        {
          value: "3'18''",
          label: '100分',
          isEndLabel: true,
          endValue: "2'28''",
          endLabel: '110分'
        }
      ]
    },
    2: {
      // 大三大四
      2: [
        {
          value: '时间',
          label: '不及格'
        },
        {
          value: "4'32''",
          label: '及格'
        },
        {
          value: "3'42''",
          label: '良好'
        },
        {
          value: "3'28''",
          label: '优秀'
        },
        {
          value: "3'16''",
          label: '100分',
          isEndLabel: true,
          endValue: "3'26''",
          endLabel: '110分'
        }
      ]
    }
  },
  9: {
    // 1000米
    1: {
      // 年级 大一大二
      1: [
        // 男
        {
          value: '时间',
          label: '不及格'
        },
        {
          value: "4'32''",
          label: '及格'
        },
        {
          value: "3'42''",
          label: '良好'
        },
        {
          value: "3'27''",
          label: '优秀'
        },
        {
          value: "3'17''",
          label: '100分',
          isEndLabel: true,
          endValue: "2'42''",
          endLabel: '110分'
        }
      ]
    },
    2: {
      // 大三大四
      1: [
        {
          value: '时间',
          label: '不及格'
        },
        {
          value: "4'30''",
          label: '及格'
        },
        {
          value: "3'40''",
          label: '良好'
        },
        {
          value: "3'25''",
          label: '优秀'
        },
        {
          value: "3'15''",
          label: '100分',
          isEndLabel: true,
          endValue: "2'40''",
          endLabel: '110分'
        }
      ]
    }
  }
};
// 单项指标描述信息
export const projectEum = {
  1: {
    name: '体重指数',
    desc: '体重指数（BMI）也称为身体质量指数，计算公式为BMI=体重÷身高2（体重单位：千克；身高单位：米。）。世界卫生组织一直将它作为判别人体胖瘦程度的一项重要指标。超重肥胖的训练方法为：主要是有大肌肉群参与的有氧运动，辅以抗阻运动和柔韧性练习。'
  },
  2: {
    name: '肺活量',
    desc: '肺活量测试肺通气功能，反映人体肺的容积和扩张能力。运动锻炼既能使人的肺活量水平提高，也能延缓肺活量的衰减。主要的训练方法包括：1、保持正确的呼吸方式，主要采取腹式呼吸。2、坚持进行有氧运动和柔韧性训练为主，抗阻训练为辅的运动训练。'
  },
  3: {
    name: '力量素质',
    desc: '力量素质是指人体肌肉收缩克服和对抗阻力完成运动的能力，通常称为肌肉力量或力量（musclestrength）。提高力量速度的训练方法包括：等长收缩训练，等张收缩训练，等动收缩训练。训练原则包括：大负荷原则；渐增负荷原则；专门性原则；负荷顺序原则；有效运动负荷原则；合理训练隔原则。'
  },
  4: {
    name: '耐力素质',
    desc: '耐力是指人体长时间进行肌肉工作的运动能力，也称为抗疲劳能力，从能量供应角度可分为有氧耐力和无氧耐力。发展有氧耐力常用的训练方法有持续训练法、间歇训练法及高原训练法。发展无氧耐力常用的方法包括：间歇训练法和缺氧训练法。'
  },
  5: {
    name: '柔韧素质',
    desc: '柔韧素质是指人体各个关节的活动幅度、肌肉和韧带的伸展能力。提高柔韧素质的训练可以采用主动和被动拉伸练习。拉伸练习包括快速爆发式拉伸和缓慢拉伸两种。'
  },
  6: {
    name: '速度素质',
    desc: '速度素质是指人体进行快速运动的能力或最短时间完成某种运动的能力。按其在运动中的表现可以分为反应速度、动作速度和周期性运动的位移速度三种形式。提高速度素质的训练包括：1、提高动作速率的训练，采用变换各种信号让练习者迅速作出反应的练习，以及做各种高频率动作的练习（如牵引跑、在转动跑台上跑和顺风跑等借助外力提高动作频率的练习）。2、发展磷酸原系统供能的能力，一般常用的方法是重复练法（如短跑运动员常采用 10 秒以内的短距离反复疾跑来发展磷酸原系统供能能力）。3、提高肌肉的协调放松能力，主要是进行柔韧性训练。'
  }
};

export const projectDetail = {
  1: {
    name: '体重指数',
    desc: '体重指数（BMI）也称为身体质量指数，计算公式为BMI=体重÷身高2（体重单位：千克；身高单位：米。）。世界卫生组织一直将它作为判别人体胖瘦程度的一项重要指标。超重肥胖的训练方法为：主要是有大肌肉群参与的有氧运动，辅以抗阻运动和柔韧性练习。常用的减脂运动：长跑，跳绳，游泳，骑行，健美操等。'
  },
  2: {
    name: '肺活量',
    desc: '肺活量测试肺通气功能，反映人体肺的容积和扩张能力。肺活量高表示肺通气量高，肺换气效率高。肺活量低则相反。坚持进行有氧运动和柔韧性训练为主，抗阻训练为辅的运动训练。常用的提高肺活量的运动包括，腹式呼吸，扩胸运动，长跑，跳绳，游泳，骑行，健美操等。'
  },
  3: {
    name: '50米',
    desc: '50 米跑测试学生的位移速度，可反映速度、灵敏、协调素质及神经系统灵活性的发展水平。50米跑的训练方向为发展下肢力量，爆发力，提升下肢肌肉的协调放松能力。常用训练方法有：深蹲，箭步蹲，半蹲跳，弓步跳，单腿提踵，臀大肌拉伸，股四头肌和屈髋肌群拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },
  4: {
    name: '坐位体前屈',
    desc: '坐位体前屈是测量在静止状态下的躯干、腰、髋等关节可能达到的活动幅度，主要反映这些部位的关节、韧带和肌肉的伸展性和弹性及身体柔韧素质的发展水平，是全年龄段的测试指标。坐位体前屈的训练方向是，增加人体体表后侧肌群（竖脊肌，背阔肌，臀大肌，腘绳肌，小腿三头肌等）的柔韧性。常见训练方法有，坐式向前屈身，臀大肌拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },
  5: {
    name: '立定跳远',
    desc: '立定跳远是反映下肢爆发力及身体协调能力的常用指标。立定跳远的训练方向为发展下肢力量，爆发力，提升下肢肌肉的协调放松能力。常用训练方法有：立定跳远，收腹跳，挺身跳，深蹲，箭步蹲，单腿提踵，臀大肌拉伸，股四头肌和屈髋肌群拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },
  6: {
    name: '引体向上',
    desc: '引体向上是反映上肢肌肉力量和耐力的常用指标。引体向上的训练方向为增加背部肌肉的耐力和力量，常用的训练方法有：引体向上，俯卧背伸，俯卧模拟游泳姿(蛙泳)等。'
  },
  7: {
    name: '仰卧起坐',
    desc: '1 分钟仰卧起坐反映人体腰腹部肌肉的力量及持续工作能力。常用的训练方法：仰卧起坐，卷腹，反向卷腹，仰卧摸膝，仰卧两头起，坐姿收腿等。'
  },
  8: {
    name: '800米',
    desc: '800米(女)跑是反映学生耐力素质的常用指标,可以有效地反映学生心血管、呼吸系统的机能及肌肉耐力。800 米跑测试适用于初中至大学各个年级的女生。800米跑的训练方向为发展心肺耐力，下肢耐力和力量，提升下肢肌肉的协调放松能力。常用训练方法有：800米跑，深蹲，箭步蹲，单腿提踵，臀大肌拉伸，股四头肌和屈髋肌群拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },
  9: {
    name: '1000米',
    desc: '1000米(男)跑是反映学生耐力素质的常用指标,可以有效地反映学生心血管、呼吸系统的机能及肌肉耐力。1000 米跑测试适用于初中至大学各个年级的男生。1000米跑的训练方向为发展心肺耐力，下肢耐力和力量，提升下肢肌肉的协调放松能力。常用训练方法有：1000米跑，深蹲，箭步蹲，单腿提踵，臀大肌拉伸，股四头肌和屈髋肌群拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },

  101: {
    name: '50米x8',
    desc: '50 米×8 往返跑是 400 米跑的替代项目，是有效反映学生耐力及灵敏素质发展水平的常用指标。50x8往返跑的训练方向为发展心肺耐力，下肢耐力和力量，提升下肢肌肉的协调放松能力。常用训练方法有：50 米×8 往返跑，深蹲，箭步蹲，单腿提踵，臀大肌拉伸，股四头肌和屈髋肌群拉伸，仰卧大腿后侧拉伸，坐姿小腿拉伸等。'
  },

  102: {
    name: '跳绳',
    desc: '跳绳是一项人体在环摆的绳索中做各种跳跃动作的运动项目，能有效地综合反映学生身体的灵敏性、协调性、动作节奏感，以及下肢肌肉力量与心肺功能等，其成绩与学生参加体育锻炼的程度有关。常用训练方法有：跳绳，单腿提踵，双脚连续跳，左右小跳，前后小跳等。'
  }
};
