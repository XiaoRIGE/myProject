export const projectMenu = {
  t1: '身高体重',
  t2: '肺活量',
  t3: '50米',
  t4: '坐位体前屈',
  t5: '立定跳远',
  t6: '视力',
  t7: '引体向上',
  t8: '1000米',
  t9: '仰卧起坐',
  t10: '800米'
};
export const projectItemType = {
  t1: 1,
  t2: 2,
  t3: 3,
  t4: 4,
  t5: 5,
  t6: 10,
  t7: 6,
  t8: 9,
  t9: 7,
  t10: 8
};

export const listObj = [
  {
    title: '男女通用',
    list: [
      {
        id: 1,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t1-icon.svg'),
        title: '身高体重',
        type: 't1'
      },
      {
        id: 2,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t2-icon.svg'),
        title: '肺活量',
        type: 't2'
      },
      {
        id: 3,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t3-icon.svg'),
        title: '50米',
        type: 't3'
      },
      {
        id: 4,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t4-icon.svg'),
        title: '坐位体前屈',
        type: 't4'
      },
      {
        id: 5,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t5-icon.svg'),
        title: '立定跳远',
        type: 't5'
      },
      {
        id: 6,
        projectSex: '0',
        img: require('@/static/img/studentStamina/t6-icon.svg'),
        title: '视力',
        type: 't6'
      }
    ]
  },
  {
    title: '男生项目',
    list: [
      {
        id: 7,
        projectSex: '1',
        img: require('@/static/img/studentStamina/t7-icon.svg'),
        title: '引体向上',
        type: 't7'
      },
      {
        projectSex: '1',
        id: 8,
        img: require('@/static/img/studentStamina/t8-icon.svg'),
        title: '1000米',
        type: 't8'
      }
    ]
  },
  {
    title: '女生项目',
    list: [
      {
        id: 9,
        projectSex: '2',
        img: require('@/static/img/studentStamina/t9-icon.svg'),
        title: '仰卧起坐',
        type: 't9'
      },
      {
        id: 10,
        projectSex: '2',
        img: require('@/static/img/studentStamina/t10-icon.svg'),
        title: '800米',
        type: 't10'
      }
    ]
  }
];
export const getTitle = type => projectMenu[type];

export const componentsMenu = {
  t1: 'height-weight',
  t2: 'vital-capacity',
  t3: 'fifty-meter',
  t4: 'sitting-flexion',
  t5: 'long-jump',
  t6: 'vision',
  t7: 'abdomina',
  t8: 'thousand-meter',
  t9: 'abdomina',
  t10: 'thousand-meter'
};
export const units = {
  t1: undefined,
  t2: 'ml',
  t3: '秒',
  t4: 'cm',
  t5: 'cm',
  t6: undefined,
  t7: '个',
  t8: undefined,
  t9: '个',
  t10: undefined
};
