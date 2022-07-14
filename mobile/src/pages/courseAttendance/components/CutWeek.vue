<template>
  <view class="cut-week-container">
    <view class="title u-flex u-row-between">
      <view class="title-left" @click="cancelHandle">
        取消
      </view>
      <view class="title-center">
        切换周次
      </view>
      <view class="title-right" @click="submitHandle">
        确定
      </view>
    </view>
    <scroll-view scroll-y="true" style="height: 740rpx">
      <view class="content u-row-left u-flex u-flex-wrap">
        <view
          v-for="(item, index) in effectiveDateList"
          :key="index"
          :class="
            item.weekNumber === selectIndex ? 'sel-week week-item' : 'week-item'
          "
          :style="
            item.currentSureWeek && item.weekNumber !== selectIndex
              ? { background: 'rgba(23,43,76,0.12)' }
              : {}
          "
          @click="selectWeekHandle(item)"
        >
          <view class="item-week">
            {{ item.currentSureWeek ? '本周' : `第${item.weekNumber}周` }}
          </view>
          <view
            :style="item.startSignDataStatus ? {} : { visibility: 'hidden' }"
            class="item-date"
          >
            {{ $u.timeFormat(item.startSignDate, 'mm/dd') }}
          </view>
          <view v-if="item.startSignDataStatus" class="item-yes">
            已考勤
          </view>
          <view v-else class="item-no">
            未考勤
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MorePopup',
  props: {
    week: {
      type: Object,
      default: null
    },
    effectiveDateList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      selectIndex: 0, //选中周数
      selectWeek: null //选中周信息
    };
  },
  mounted() {
    this.selectIndex = this.$props.week.weekNumber;
    this.selectWeek = this.$props.week;
  },
  methods: {
    //选择周次
    selectWeekHandle(item) {
      this.selectIndex = item.weekNumber;
      this.selectWeek = item;
    },
    //确认切换
    submitHandle() {
      this.$emit('submitCutWeekHandle', this.selectWeek);
    },
    //取消切换
    cancelHandle() {
      this.$emit('cancelCutWeekHandle');
    }
  }
};
</script>

<style lang="scss" scoped>
.cut-week-container {
  font-size: 28rpx;
  .title {
    width: 100%;
    height: 100rpx;
    font-size: 32rpx;
    text-align: center;
    line-height: 100rpx;
    padding: 0 24rpx;
    border-bottom: 2rpx solid #f0f0f0;
    &-left {
      width: 144rpx;
    }
    &-center {
      font-weight: bold;
      font-size: 36rpx;
    }
    &-right {
      color: #fc6c37;
      width: 144rpx;
    }
  }
  .content {
    padding: 32rpx 36rpx 0;
    .week-item:not(:nth-child(4n)) {
      margin-right: 22rpx;
    }
    .week-item {
      flex: 1 0 1;
      width: 152rpx;
      height: 172rpx;
      text-align: center;
      padding-top: 16rpx;
      background: rgba(245, 246, 250, 1);
      border-radius: 16rpx;
      margin-bottom: 24rpx;
      .item-week {
        font-weight: bold;
        line-height: 40rpx;
        letter-spacing: 2rpx;
      }
      .item-date {
        height: 34rpx;
        font-size: 24rpx;
        color: $u-content-color;
        margin-bottom: 18rpx;
      }
      .item-no {
        font-weight: bold;
        color: rgba(195, 194, 204, 1);
      }
      .item-yes {
        font-weight: bold;
        color: rgba(74, 186, 93, 1);
      }
    }
    .cur-week {
      background: rgba(23, 43, 76, 0.12);
    }
    .sel-week {
      background: rgba(23, 43, 76, 1);
      .item-week,
      .item-date {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
