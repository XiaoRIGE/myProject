<template>
  <view class="activity-attendance-container">
    <!-- 自定义导航栏 -->
    <g-navbar
      back-icon-size="48"
      title="我的活动"
      :border-bottom="false"
      class="navbar"
    >
      <view slot="right" class="statistic" @click="activityStatisticHandle">
        活动统计
      </view>
    </g-navbar>
    <!-- 吸顶 -->
    <view class="sticky" :style="{ top: top + 'px' }">
      <!-- 选项卡 -->
      <view class="activity-tabs">
        <u-tabs-swiper
          ref="uTabs"
          :list="tabs"
          height="88"
          font-size="32"
          :current="current"
          :is-scroll="false"
          swiper-width="750"
          active-color="#FC6C37"
          inactive-color="#222222"
          @change="tabsChange"
        />
      </view>
      <!-- 时间筛选器 -->
      <g-dropdown
        v-show="dropdownShow"
        ref="uDropdown"
        class="dropdown"
        active-color="#FC6C37"
        inactive-color="#222222"
        border-radius="32rpx"
        title-size="28rpx"
      >
        <g-dropdown-item
          v-model="timeLimit.value"
          :title="timeLimit.label"
          :options="options"
          @change="timeLimitHandle"
        />
      </g-dropdown>
    </view>
    <!-- 活动列表 -->
    <swiper
      class="swiper-box"
      :current="swiperCurrent"
      :style="{ height: height }"
      @transition="transition"
      @animationfinish="animationfinish"
      @change="swiperChange"
    >
      <swiper-item v-for="(item, i) in tabs" :key="i" class="swiper-item">
        <mescroll-item
          ref="mescrollItem"
          :i="i"
          :state="state"
          :index="swiperCurrent"
          :time-limit="timeLimit"
        />
      </swiper-item>
    </swiper>
    <!-- 活动统计 -->
    <u-popup
      v-if="activityStatisticShow"
      v-model="activityStatisticShow"
      mode="bottom"
      border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <activity-statistic :activity-statistic="activityStatistic" />
    </u-popup>
  </view>
</template>

<script>
import MescrollItem from './components/MescrollItem';
import ActivityStatistic from './components/ActivityStatistic';
import { activity } from '@/request/api/student';

export default {
  components: {
    'mescroll-item': MescrollItem,
    'activity-statistic': ActivityStatistic
  },
  data() {
    return {
      pageQuery: { activitie: { refresh: false } },
      tabs: [
        {
          name: '进行中'
        },
        {
          name: '未开始'
        },
        {
          name: '已结束'
        }
      ],
      current: 0, //0:进行中 1:未开始 2:已结束
      state: 4, //3未开始 4进行中 5已结束
      swiperCurrent: 0,
      activityStatisticShow: false,
      activityStatistic: null,
      options: [
        {
          label: '近7天',
          value: 0
        },
        {
          label: '近30天',
          value: 1
        },
        {
          label: '本学期',
          value: 2
        }
      ],
      timeLimit: null,
      noStartTimeLimit: null, //记录未开始上一次的时间筛选
      endTimeLimit: null //记录已结束上一次的时间筛选
      // height: ''
    };
  },
  computed: {
    dropdownShow() {
      return this.current !== 0;
    },
    top() {
      return this.StatusBar + 44;
    },
    height() {
      // 需要固定swiper的高度
      return `${this.screenHeight - this.StatusBar - 44 - 80}px`;
    }
  },
  onLoad() {
    this.timeLimit = { ...this.options[0] };
    // this.height = `${uni.getSystemInfoSync().windowHeight}px`;
  },
  methods: {
    // 修改状态
    changeState() {
      if (this.swiperCurrent === 1 && this.noStartTimeLimit !== null) {
        this.timeLimit = this.noStartTimeLimit;
      } else if (this.swiperCurrent === 2 && this.endTimeLimit !== null) {
        this.timeLimit = this.endTimeLimit;
      } else {
        this.timeLimit = { ...this.options[0] };
      }
      if (this.swiperCurrent === 0) {
        this.state = 4;
      } else if (this.swiperCurrent === 1) {
        this.state = 3;
      } else if (this.swiperCurrent === 2) {
        this.state = 5;
      }
    },
    swiperChange(e) {
      this.swiperCurrent = e.detail.current;
      this.changeState();
    },
    // 切换选项卡
    tabsChange(index) {
      this.swiperCurrent = index;
      // 当下拉菜单打开时切换选项卡，需关闭选项卡
      if (this.$refs.uDropdown && this.$refs.uDropdown.active) {
        this.$refs.uDropdown.close();
      }
      this.changeState();
    },
    // 筛选时间限制
    timeLimitHandle(value) {
      this.timeLimit = { ...this.options[value] };
      if (this.current === 1) {
        this.noStartTimeLimit = { ...this.options[value] };
      } else if (this.current === 2) {
        this.endTimeLimit = { ...this.options[value] };
      }
      // 调用子组件重新刷新方法
      this.$refs.mescrollItem[this.swiperCurrent].downCallback();
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      const dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      const current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
    },
    // 活动统计
    activityStatisticHandle() {
      activity.activityStatistics().then(res => {
        this.activityStatistic = res.data;
        this.activityStatisticShow = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-attendance-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  .navbar {
    .statistic {
      font-size: 30rpx;
      margin-right: 32rpx;
      color: $u-main-color;
    }
  }
  ::v-deep uni-swiper {
    // min-height: 100vh;
    height: none;
  }
  .sticky {
    position: sticky;
    z-index: 2000;
    background: #fff;
  }
  .dropdown {
    background: #fff;
    font-weight: bold;
    ::v-deep .u-dropdown__menu__item {
      justify-content: flex-start;
      .u-flex {
        margin-left: 56rpx;
        padding: 10rpx 18rpx;
        background: rgba(245, 246, 250, 1);
        border-radius: 8rpx;
      }
    }
    ::v-deep .u-cell-item-box {
      font-size: 32rpx;
      font-weight: 400;
    }
    ::v-deep .u-border-bottom::after {
      border: none;
    }
  }
}
</style>
