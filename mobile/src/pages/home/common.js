export const cardList = [
  {
    index: 1,
    type: 'free',
    isRecommend: false,
    title: '自由跑',
    bgImg: 'free-bg.png',
    subTitle: '无区域点位限制'
  },
  {
    index: 2,
    isRecommend: false,
    type: 'range',
    title: '范围跑',
    subTitle: '规定区域范围',
    bgImg: 'range-bg.png'
  },
  {
    index: 3,
    isRecommend: false,
    title: '定点跑',
    type: 'point',
    bgImg: 'fixed-point-bg.png',
    subTitle: '遵循点位序号'
  }
];

// 首页初始化运动开篇顺序
export const initCardList = data => {
  const { freePattern, fixedPointPattern, scopePattern, enableStatus } = data;
  if (enableStatus === -1) {
    return cardList;
  }
  if (freePattern !== 1 && fixedPointPattern !== 1 && scopePattern !== 1) {
    // 都未开启跑步，显示默认
    return cardList;
  }
  if (freePattern === 1 && fixedPointPattern === 1 && scopePattern === 1) {
    // 都开启

    const result = cardList.map(item => {
      item.isRecommend = true;
      return item;
    });
    return result;
  }
  if (scopePattern === 1 && freePattern !== 1 && fixedPointPattern !== 1) {
    // 仅开启范围跑
    return [
      {
        index: 2,
        type: 'range',
        title: '范围跑',
        isRecommend: true,
        subTitle: '规定区域范围',
        bgImg: 'range-bg.png'
      },
      {
        index: 1,
        type: 'free',
        isRecommend: true,
        title: '自由跑',
        bgImg: 'free-bg.png',
        subTitle: '无区域点位限制'
      },
      {
        index: 3,
        title: '定点跑',
        type: 'point',
        bgImg: 'fixed-point-bg.png',
        subTitle: '遵循点位序号'
      }
    ];
  }
  if (freePattern === 1 && scopePattern !== 1 && fixedPointPattern !== 1) {
    // 仅开启自由跑
    return [
      {
        index: 1,
        type: 'free',
        isRecommend: true,
        title: '自由跑',
        bgImg: 'free-bg.png',
        subTitle: '无区域点位限制'
      },
      {
        index: 2,
        type: 'range',
        title: '范围跑',
        subTitle: '规定区域范围',
        bgImg: 'range-bg.png'
      },
      {
        index: 3,
        title: '定点跑',
        type: 'point',
        bgImg: 'fixed-point-bg.png',
        subTitle: '遵循点位序号'
      }
    ];
  }

  if (fixedPointPattern === 1 && scopePattern !== 1 && freePattern !== 1) {
    // 仅开启定点跑
    return [
      {
        index: 3,
        title: '定点跑',
        isRecommend: true,
        type: 'point',
        bgImg: 'fixed-point-bg.png',
        subTitle: '遵循点位序号'
      },
      {
        index: 1,
        type: 'free',
        title: '自由跑',
        bgImg: 'free-bg.png',
        subTitle: '无区域点位限制'
      },
      {
        index: 2,
        type: 'range',
        title: '范围跑',
        subTitle: '规定区域范围',
        bgImg: 'range-bg.png'
      }
    ];
  }
  if (freePattern === 1 && scopePattern === 1 && fixedPointPattern === 0) {
    // 自由跑和范围跑开启 -> 默认
    return cardList.map(item => {
      item.isRecommend = item.type === 'free' || item.type === 'range';
      return item;
    });
  }
  if (scopePattern === 1 && fixedPointPattern === 1 && freePattern === 0) {
    // 范围跑和定点跑 -> 范围跑-定点跑-自由跑
    return [
      {
        index: 2,
        type: 'range',
        isRecommend: true,
        title: '范围跑',
        subTitle: '规定区域范围',
        bgImg: 'range-bg.png'
      },
      {
        index: 3,
        title: '定点跑',
        isRecommend: true,
        type: 'point',
        bgImg: 'fixed-point-bg.png',
        subTitle: '遵循点位序号'
      },
      {
        index: 1,
        type: 'free',
        title: '自由跑',
        bgImg: 'free-bg.png',
        subTitle: '无区域点位限制'
      }
    ];
  }
  if (freePattern === 1 && fixedPointPattern === 1 && scopePattern === 0) {
    //  自由跑和定点跑开启
    return [
      {
        index: 1,
        type: 'free',
        isRecommend: true,
        title: '自由跑',
        bgImg: 'free-bg.png',
        subTitle: '无区域点位限制'
      },
      {
        index: 3,
        title: '定点跑',
        isRecommend: true,
        type: 'point',
        bgImg: 'fixed-point-bg.png',
        subTitle: '遵循点位序号'
      },
      {
        index: 2,
        type: 'range',
        title: '范围跑',
        subTitle: '规定区域范围',
        bgImg: 'range-bg.png'
      }
    ];
  }
  // 排序规则
  // 默认 自由跑 -> 范围跑 -> 定点跑
  // 当学校仅开启范围跑时 -> 范围跑、自由跑、定点跑；
  // fixedPointPattern：是否开启定点跑 0 1
  // freePattern：是否开启自由跑
  // scopePattern：是否开启范围跑
};

export const skeletonCard = [
  'card{h:150rpx,w:300rpx,MB:0,r:18rpx,ML:32rpx}+card{h:150rpx,w:300rpx,MB:0,r:18rpx}+card{h:150rpx,w:300rpx,MB:0,r:18rpx}'
];
