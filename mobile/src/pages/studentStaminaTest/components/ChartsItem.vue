<template>
  <view>
    <view class="echarts-container">
      <qiun-data-charts
        type="radar"
        :onmouse="false"
        :opts="opts"
        :chart-data="chartData"
        background="none"
      />
      <view
        v-for="item in projectList"
        :key="item.type"
        class="item"
        :class="[item.className, { active: item.type === active }]"
        @tap.stop="checkTab(item)"
      >
        {{ item.title }}
      </view>
    </view>
    <view class="card-content">
      <view class="title u-flex">
        <text>{{ title }}</text>
        <grade :level="level" />
      </view>
      <view class="box">
        <text class="content">
          {{ content }}
        </text>
        <view class="footer u-flex">
          <image src="~@/static/img/school-logo.svg" mode="aspectFit" />
          <text>由成都体育学院-运动医学与健康研究所提供</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { projectList, opts, projectEum } from '../stamina';
import Grade from './Grade';

export default {
  components: {
    grade: Grade
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      active: 6,
      type: 2,
      projectList: Object.freeze(projectList),
      chartData: {
        categories: ['', '', '', '', '', ''],
        series: [
          {
            name: '综合能力', // 速度 体重 柔韧 耐力 力量
            data: [100, 100, 100, 100, 100, 100]
          }
        ]
      },
      opts: Object.freeze(opts)
    };
  },
  computed: {
    gender() {
      return this.$store.state.app.userInfo.gender;
    },
    content() {
      return projectEum[this.type].desc;
    },
    title() {
      return projectEum[this.type].name;
    },
    level() {
      const list = this.chartData.series[0].data;
      const score = list[this.active - 1];
      if (score >= 90) return 1;
      if (score >= 80 && score <= 89.9) return 3;
      if (score >= 60 && score <= 79.9) return 2;
      return 4;
    }
  },
  watch: {
    active: {
      immediate: true,
      deep: true,
      handler() {
        this.calculation(this.data);
      }
    },
    data: {
      immediate: true,
      deep: true,
      handler(nval) {
        this.calculation(nval);
      }
    }
  },
  methods: {
    checkTab(item) {
      const { type } = item;
      this.active = type;
      this.type = item.projectType;
    },
    speed(arr) {
      return (
        arr.reduce((acc, currentVal) => {
          let current = currentVal;
          if (currentVal === null) {
            current = 100;
          }
          return acc + current;
        }, 0) / arr.length
      );
    },
    endurance(data) {
      if (this.gender === 1) {
        if (data.thousandMetersScore === null) return 100;
        return data.thousandMetersScore;
      }
      if (this.gender === 2) {
        if (data.eightHundredMetersScore === null) return 100;
        return data.eightHundredMetersScore;
      }
    },
    power(data) {
      const result = [];
      // 50 米
      result.push(data.fiftyMetersScore === null ? 100 : data.fiftyMetersScore);
      if (this.gender === 1) {
        // 引体向上
        result.push(data.pullUpScore === null ? 100 : data.pullUpScore);
      }
      if (this.gender === 2) {
        // 仰卧起坐
        result.push(data.sitUpScore === null ? 100 : data.sitUpScore);
      }
      // 立定跳远
      result.push(data.jumpScore === null ? 100 : data.jumpScore);
      return result.reduce((acc, current) => acc + current, 0) / result.length;
    },
    calculation(data) {
      const list = [0, 0, 0, 0, 0, 0];
      if (this.gender !== 1 && this.gender !== 2) return;
      //  速度素质 50米
      list[0] = this.speed([data.fiftyMetersScore]);

      //  体重素质 BMI
      list[1] = data.bmiScore === null ? 100 : data.bmiScore;

      // 柔韧素质 坐位体前屈
      list[2] = data.sitAndReachScore === null ? 100 : data.sitAndReachScore;

      // 耐力素质 800米 1000米
      list[3] = this.endurance(data);

      // 力量素质 50米、1分钟仰卧起坐、立定跳远、引体向上
      list[4] = this.power(data);

      // 肺活量
      list[5] =
        data.vitalCapacityScore === null ? 100 : data.vitalCapacityScore;
      this.chartData.series[0].data = list;
    }
  }
};
</script>
<style lang="scss" scoped>
.echarts-container {
  width: 100%;
  position: relative;
  height: 500rpx;
  .item {
    font-size: 28rpx;
    position: absolute;
    // width: 140rpx;
    text-align: center;
    // line-height: 54rpx;
    border-radius: 8rpx;
    color: #333;
    z-index: 99;
    background: #f5f6fa;
    padding: 8rpx 12rpx 6rpx;
  }
  .active {
    background-color: #fc6c37;
    color: #fff;
  }
  .one {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .tow {
    top: 20%;
    left: 78%;
  }
  .three {
    left: 78%;
    top: 62%;
  }
  .four {
    left: 50%;
    top: 88%;
    transform: translateX(-50%);
  }
  .five {
    left: 4%;
    top: 62%;
  }
  .six {
    top: 25%;
    left: 4%;
  }
}
.card-content {
  margin-top: 40rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 24rpx;
  background-color: #f5f5fa;
  border-radius: 16rpx;
  .title {
    text {
      margin-right: 10rpx;
      font-size: 32rpx;
      color: $u-main-color;
      font-weight: bold;
    }
  }
  .box {
    box-sizing: border-box;
    padding: 16rpx 0 0;
    .content {
      font-size: 28rpx;
      font-weight: 400;
      color: $u-main-color;
    }
    .footer {
      margin-top: 16rpx;
      image {
        width: 36rpx;
        height: 36rpx;
      }
      text {
        margin-left: 6rpx;
        font-size: 24rpx;
        color: $u-content-color;
      }
    }
  }
}
</style>
