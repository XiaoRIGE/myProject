<template>
  <view class="stamina-test-container">
    <g-navbar
      :background="background"
      :border-bottom="false"
      back-icon-size="48"
      title="体测报告"
    >
      <template #right>
        <view
          v-if="gradeList.length > 0"
          class="navbar-right-content"
          @click="showGrade = true"
        >
          历史年级
        </view>
      </template>
    </g-navbar>
    <!-- 个人信息 -->
    <view class="student-info u-flex">
      <view class="left">
        <view v-if="year > 0" class="grad">
          <!-- <text>{{ gradTitle || '年级不正确' }}</text> -->
          <text>{{ year }}年测试</text>
        </view>
        <!-- <text v-if="year > 0" class="test-nf">
          {{ year }}年测试
        </text> -->
      </view>
      <view v-if="isTest" class="right u-flex">
        <view class="score">
          {{ testInfo.totalScore || 0 }}
          <text>分</text>
        </view>
        <!-- tag -->
        <grade :level="testInfo.fitnessStatus || 0" />
      </view>
    </view>
    <!-- 单项数据 -->
    <!-- 已经体测 -->
    <template v-if="isTest">
      <view class="single-data">
        <text class="title">单项数据</text>
        <view class="container">
          <single-item
            v-for="item in menuList"
            :key="item.type"
            :single="item"
            :data="testInfo"
            :year="grade"
          />
          <vision :data="testInfo" />
        </view>
      </view>
      <!-- 综合能力 -->
      <view class="comprehensive-data">
        <view class="title">综合能力</view>
        <view class="notice u-flex">
          <image
            class="notice-icon"
            src="~@/static/img/notice2.svg"
            mode="scaleToFill"
          />
          <view class="notice-text">点击单项可查看详细数据分析</view>
        </view>
        <view class="echarts-container">
          <charts-item :data="testInfo" />
        </view>
      </view>
    </template>
    <template v-if="!isTest">
      <view class="no-data">
        <image
          class="img"
          src="~@/static/img/no-curriculum-bg.png"
          mode="aspectFit"
        />
        <view class="tps">当前年级暂无数据</view>
      </view>
    </template>
    <!-- 选择年级 -->
    <u-action-sheet
      v-model="showGrade"
      :border-radius="24"
      :list="gradeList"
      :cancel-btn="true"
      @click="changeGrade"
    />
  </view>
</template>

<script>
import { menuList, getGradeList } from './stamina';
import { test } from '@/request/api/student';
import Grade from './components/Grade';
import SingleItem from './components/SingleItem';
import ChartsItem from './components/ChartsItem';
import Vision from './components/Vision';
export default {
  components: {
    grade: Grade,
    'single-item': SingleItem,
    'charts-item': ChartsItem,
    vision: Vision
  },
  data() {
    return {
      showGrade: false,
      isTest: false,
      testInfo: {},
      cardType: 2,
      year: 0, // 录入年份
      gradYear: 0, // 学期年级
      grade: -1, // 当前年级
      gradeList: [],
      background: {
        backgroundColor: 'rgba(255,255,255,0)'
      }
    };
  },
  onLoad({ year }) {
    this.gradYear = year;
    //年级 = 录入年份 - 当前学年 + 1
    this.getYearList();
  },
  computed: {
    sex() {
      return this.$store.state.app.userInfo.gender;
    },
    menuList() {
      return menuList[this.sex];
    }
  },
  methods: {
    // 获取历史年份
    async getYearList() {
      const { code, data } = await test.getYearList();
      if (code === 0 && data) {
        if (data.length > 0) {
          const inputYearInfo = data.find(({ check }) => !!check);
          this.year = inputYearInfo.year;
        }
        this.gradeList = getGradeList(data);
        this.getTestInfo();
      }
    },
    setNavBar(height) {
      this.background.backgroundColor = `rgba(255,255,255,${height / 45})`;
    },
    changeGrade(index) {
      const { text } = this.gradeList[index];
      this.year = text;
      this.getTestInfo();
    },
    async getTestInfo() {
      this.grade = this.year - this.gradYear + 1;
      const res = await test.getTestInfo({
        year: this.year
      });
      if (res.code === 0 && res.data) {
        this.testInfo = res.data;
        if (this.sex === 1) {
          const list = [
            'bmiScore',
            'vitalCapacityScore',
            'fiftyMetersScore',
            'sitAndReachScore',
            'jumpScore',
            'pullUpScore',
            'thousandMetersScore'
          ];
          for (let i = 0; i < list.length; i++) {
            if (res.data[list[i]] !== null) {
              this.isTest = true;
              break;
            } else {
              this.isTest = false;
            }
          }
        }
        if (this.sex === 2) {
          const list = [
            'bmiScore',
            'vitalCapacityScore',
            'fiftyMetersScore',
            'sitAndReachScore',
            'jumpScore',
            'sitUpScore',
            'eightHundredMetersScore'
          ];
          for (let i = 0; i < list.length; i++) {
            if (res.data[list[i]] !== null) {
              this.isTest = true;
              break;
            } else {
              this.isTest = false;
            }
          }
        }
      }
    }
  },
  onPageScroll(e) {
    // 监听页面滚动
    this.$u.throttle(this.setNavBar(e.scrollTop), 100);
  }
};
</script>

<style scoped lang="scss">
.stamina-test-container {
  box-sizing: border-box;
  padding: 0 32rpx 60rpx;
  background-image: url('~@/static/img/studentStamina/bg.png');
  min-height: 100vh;
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% 424rpx;
  background-color: #fff;
  .navbar-right-content {
    box-sizing: border-box;
    padding-right: 32rpx;
    font-size: 30rpx;
    color: $u-main-color;
  }
  .student-info {
    height: 245rpx;
    justify-content: space-between;
    .left {
      .grad {
        margin-top: 10rpx;
        font-size: 40rpx;
        color: #4d2813;
        font-weight: bold;
      }
      .test-nf {
        font-size: 24rpx;
        color: #995126;
      }
    }
    .right {
      margin-right: 74rpx;
    }
    .score {
      font-size: 64rpx;
      font-weight: bold;
      margin-right: 16rpx;
      color: #4d2813;
      text {
        font-size: 24rpx;
      }
    }
  }
  .single-data {
    box-sizing: border-box;
    padding-top: 28rpx;
    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      flex-shrink: 0;
    }
  }
  .comprehensive-data {
    box-sizing: border-box;
    padding: 72rpx 0 0;
    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .notice {
      margin: 8rpx 0 48rpx;
      &-icon {
        width: 28rpx;
        height: 28rpx;
        margin-right: 0;
      }
      &-text {
        font-size: 24rpx;
        font-weight: 400;
        color: #fc6c37;
        line-height: 34rpx;
      }
    }
  }
  .no-data {
    text-align: center;
    margin-top: 29rpx;
    .img {
      width: 400rpx;
      height: 300rpx;
    }
    .tps {
      margin-top: 48rpx;
    }
  }
}
</style>
