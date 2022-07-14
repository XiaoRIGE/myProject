<template>
  <view class="face-running-result-all-container">
    <g-navbar
      back-icon-size="48"
      title="岗亭打卡记录"
      :border-bottom="false"
      class="navbar"
    ></g-navbar>
    <scroll-view
      scroll-x="true"
      :scroll-left="scrollLeft"
      class="face-running-result-all-container__top"
    >
      <view class="face-running-result-all-container__top__selectDate">
        <view
          v-for="(item, index) in dateArr"
          :key="index"
          class="face-running-result-all-container__top__selectDate__item"
          :class="index === selectIndex ? 'action' : ''"
          @click="clickSelectDateHandle(item, index)"
        >
          <view
            class="
              face-running-result-all-container__top__selectDate__item__month
            "
          >
            {{ item.month }}月
          </view>
          <view
            class="
              face-running-result-all-container__top__selectDate__item__year
            "
          >
            {{ item.year }}
          </view>
        </view>
        <view class="visibility">占位</view>
      </view>
    </scroll-view>
    <view
      v-if="recordData.length"
      class="face-running-result-all-container__bottom"
    >
      <u-collapse :head-style="headStyle" hover-class="none">
        <u-collapse-item
          v-for="(item, index) in recordData"
          :key="index"
          :index="index"
          class="collapse-item"
          :class="collapseIndex === index ? 'active-item' : ''"
          @change="changeHanlde"
        >
          <view slot="title" class="collapse-item__title">
            <text class="collapse-item__title__date">
              {{ getMonthItem(item.monthTime) }}月{{
                getDateItem(item.monthTime)
              }}日
            </text>
            <text>{{ getWeekItem(item.monthTime) }}</text>
          </view>
          <view class="face-running-result-all-container__bottom__details">
            <g-faceRunningDetailsList
              class="face-running-result-all-container__bottom__details__list"
              :record-data="item.recordList"
            />
          </view>
        </u-collapse-item>
      </u-collapse>
    </view>
    <view v-else class="empty-content">
      <image
        src="~@/static/img/running-record.png"
        mode="scaleToFill"
        class="empty-img"
      />
      <view class="text">还没有记录哦~</view>
    </view>
  </view>
</template>

<script>
import {
  getMonthItem,
  getYearItem,
  getDateItem,
  getWeekItem
} from '@/utils/common';
import { running } from '@/request/api/student';
import _ from 'lodash';
export default {
  data() {
    return {
      selectIndex: -1, // 日期索引
      collapseIndex: -1, // 折叠面板索引
      selectItem: {},
      recordData: [],
      headStyle: {
        padding: '40rpx 0',
        margin: '0 32rpx',
        borderBottom: '2rpx solid #ececec'
      },
      getDateItem,
      getMonthItem,
      getWeekItem,
      scrollLeft: 0,
      dateArr: []
    };
  },
  mounted() {
    this.getDateArr();
    const currentMonth = new Date().getMonth() + 1;
    const index = _.findIndex(this.dateArr, (item) => {
      return item.month === currentMonth;
    });
    if (index !== -1) {
      this.selectIndex = index;
      this.selectItem = this.dateArr[index];
    } else {
      this.selectIndex = 0;
      this.selectItem = this.dateArr[0];
    }
    this.$nextTick(() => {
      uni
        .createSelectorQuery()
        .select('.face-running-result-all-container__top__selectDate')
        .boundingClientRect((res) => {
          if (res) {
            const containerWidth = res.width;
            uni
              .createSelectorQuery()
              .select('.action')
              .boundingClientRect((res) => {
                if (res) {
                  const activeWidth = res.width;
                  const activeLeft = res.left;
                  let anchor = 0; // 偏移量
                  if (
                    activeLeft > containerWidth - activeWidth &&
                    activeLeft < containerWidth
                  ) {
                    // 该元素有部分被隐藏
                    anchor = activeWidth - (containerWidth - activeLeft) + 20;
                  } else if (activeLeft > containerWidth) {
                    // 该元素全部被隐藏
                    anchor = activeWidth - containerWidth + activeLeft + 20;
                  }
                  console.log(activeLeft, activeWidth, containerWidth, anchor);
                  // this.$nextTick(() => {
                  this.scrollLeft = anchor;
                  // });
                }
              })
              .exec();
          }
        })
        .exec();
    });
    this.getFaceRunningDetailsOfMonth();
  },
  // onLoad() {
  //   this.getDateArr();
  // },
  methods: {
    getDateArr() {
      const startMonth = getMonthItem(
        this.$store.state.semester.currentSemester.startDate
      );
      const endMonth = getMonthItem(
        this.$store.state.semester.currentSemester.endDate
      );
      const startYear = getYearItem(
        this.$store.state.semester.currentSemester.startDate
      );
      const endYear = getYearItem(
        this.$store.state.semester.currentSemester.endDate
      );
      const arr = [];
      if (startYear === endYear) {
        for (let i = endMonth; i >= startMonth; i--) {
          arr.push({ year: startYear, month: i });
        }
      } else {
        for (let i = endMonth; i >= 1; i--) {
          arr.push({ year: endYear, month: i });
        }
        for (let i = 12; i >= startMonth; i--) {
          arr.push({ year: startYear, month: i });
        }
      }
      this.dateArr = arr;
    },
    clickSelectDateHandle(item, index) {
      this.selectIndex = index;
      this.selectItem = item;
      this.getFaceRunningDetailsOfMonth();
    },
    getFaceRunningDetailsOfMonth() {
      const { year, month } = this.selectItem;
      running
        .getFaceRunningDetailsOfMonth({
          year,
          month
        })
        .then((res) => {
          this.recordData = res.data;
        });
    },
    changeHanlde(e) {
      if (e.show) {
        this.collapseIndex = Number(e.index);
      } else {
        this.collapseIndex = -1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.face-running-result-all-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  .navbar {
    margin-bottom: 26rpx;
  }
  &__top {
    width: 100%;
    overflow: hidden;
    margin-bottom: 32rpx;
    &__selectDate {
      display: flex;
      &__item {
        width: 112rpx;
        height: 100rpx;
        background: #f5f6fa;
        border-radius: 16rpx;
        color: #999999;
        &__month {
          width: 112rpx;
          text-align: center;
          font-size: 36rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          line-height: 50rpx;
          margin-top: 8rpx;
        }
        &__year {
          width: 112rpx;
          text-align: center;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
      &__item:first-child {
        margin-left: 32rpx;
      }
      &__item:not(:last-child) {
        margin-right: 32rpx;
      }
      .visibility {
        width: 1rpx;
        height: 10rpx;
        visibility: hidden;
      }
      .action {
        background: #fc6c37;
        color: #ffffff;
      }
    }
  }
  &__bottom {
    .collapse-item {
      &__title {
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2b2d33;
        &__date {
          display: inline-block;
          margin-right: 24rpx;
        }
      }
    }
    .active-item {
      ::v-deep .u-collapse-head {
        border-bottom: 0px solid rgb(236, 236, 236) !important;
      }
    }
    &__details {
      margin-left: 32rpx;
      &__list {
        background: #f7f8fc;
        padding: 32rpx 0 0 16rpx;
        border-radius: 16rpx 0px 0px 16rpx;
      }
    }
  }
  .empty-content {
    width: 400rpx;
    margin: 168rpx auto;
    text-align: center;
    .empty-img {
      width: 400rpx;
      height: 300rpx;
    }
    .text {
      font-size: 32rpx;
      margin: 26rpx 0rpx;
    }
  }
}
</style>
