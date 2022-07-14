<template>
  <view>
    <view class="record-time">
      <text class="month">
        {{ recordItem.month }}
      </text>
      <text class="year">/ {{ recordItem.year }}年</text>
    </view>
    <view class="running-details">
      <view class="record-detail">
        <view
          v-for="(items, idx) in recordItem.recordDetails"
          :key="idx"
          class="record-item"
          @click="toResultPage(items)"
        >
          <view class="circle" />
          <u-line
            length="100%"
            direction="col"
            :hair-line="false"
            margin="0 0 0 14rpx"
            color="#F3F3F3"
          />
          <view
            class="record-item__content"
            :class="items.isAction ? 'is-action' : 'no-action'"
          >
            <view class="item-top u-flex u-row-between u-col-center">
              <view class="u-flex">
                <image
                  v-if="items.runningTypeName === '岗亭打卡'"
                  src="~@/static/img/runningRecord/box-clock.png"
                  mode="scaleToFill"
                  class="running-type-icon"
                />
                <image
                  v-else-if="items.runningTypeName !== '数据修改'"
                  src="~@/static/img/runningRecord/run-icon.png"
                  mode="scaleToFill"
                  class="running-type-icon"
                />
                <view class="name">
                  {{ items.runningTypeName }}
                </view>
                <view class="date">
                  <text>{{ items.date }}</text>
                  <text class="week">
                    {{ items.week }}
                  </text>
                </view>
              </view>
              <image
                v-if="items.isAction"
                src="~@/static/img/arrow.png"
                class="arrow"
              />
            </view>
            <view class="item-bottom u-flex">
              <view class="mileage-box u-flex-1">
                <view class="title">总里程</view>
                <view class="num">
                  {{ items.totalMileage }}
                  <text class="unit">km</text>
                </view>
              </view>
              <view class="mileage-box u-flex-1">
                <view class="title">
                  {{ items.scoringType === 1 ? '有效里程' : '有效段数' }}
                </view>
                <view class="num">
                  {{
                    items.scoringType === 1
                      ? items.operationMileage === null
                        ? items.effectiveMileage
                        : items.operationMileage
                      : items.operationPart === null
                      ? items.effectivePart
                      : items.operationPart
                  }}
                  <text class="unit">
                    {{ items.scoringType === 1 ? 'km' : '段' }}
                  </text>
                </view>
              </view>
            </view>
            <!-- 申诉状态 -->
            <view
              v-if="
                items.appealState !== null && items.appealState !== undefined
              "
              class="running-appeal-info u-flex"
            >
              <image
                class="icon"
                :src="getIcon(items.appealState)"
                mode="scaleToFill"
              />
              <text class="text">
                {{ getStatusName(items.appealState) }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getStatus, getStatusName } from '../common';
export default {
  props: {
    recordItem: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      flag: false
    };
  },
  methods: {
    getStatusName(state) {
      return getStatusName(getStatus(state));
    },
    getIcon(state) {
      return require(`@/static/img/appeal/${getStatus(state)}-icon.svg`);
    },
    toResultPage(items) {
      if (items.isAction) {
        const {
          date,
          id,
          endTime,
          startTime,
          keepTime,
          effectivePart,
          runningTypeName,
          scoringType,
          effectiveMileage,
          uneffectiveReason,
          operationMileage,
          operationPart,
          runningType,
          appealId
        } = {
          ...items
        };
        this.$emit('runningResult', {
          id,
          endTime,
          startTime,
          keepTime,
          effectivePart,
          runningTypeName,
          date,
          appealId,
          scoringType,
          runningType,
          effectiveMileage,
          uneffectiveReason,
          operationMileage,
          operationPart
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.record-time {
  margin-bottom: 32rpx;
  .month {
    font-size: 36rpx;
    font-weight: bold;
  }
  .year {
    display: inline-block;
    margin-left: 14rpx;
    font-weight: bold;
  }
}
.running-details {
  display: flex;
  justify-content: space-between;
  .record-detail {
    .record-item {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .circle {
        margin-right: 24rpx;
        width: 28rpx;
        height: 28rpx;
        background: #e4e6ea;
        border-radius: 50%;
        z-index: 1;
      }
      .u-line {
        position: absolute;
        top: 0;
        left: 0;
      }
      .img {
        position: absolute;
        width: 96rpx;
        height: 90rpx;
        top: 0;
        right: 32rpx;
      }
      &__content {
        width: 634rpx;
        height: 250rpx;
        border-radius: 16rpx;
        .item-top {
          height: 90rpx;
          padding: 0 32rpx 0 40rpx;
          border-bottom: 2rpx solid #eaecf0;
          .running-type-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 8rpx;
          }
          .name {
            font-size: 36rpx;
            font-weight: bold;
            margin-right: 28rpx;
          }
          .date {
            font-size: 24rpx;
            color: rgba(153, 153, 153, 1);
            .week {
              display: inline-block;
              margin-left: 16rpx;
            }
          }
          .arrow {
            width: 28rpx;
            height: 28rpx;
            float: right;
          }
        }
        .item-bottom {
          padding: 22rpx 0 0 40rpx;
          .mileage-box {
            .num {
              font-size: 36rpx;
              font-weight: bold;
              line-height: 52rpx;
              margin-top: 8rpx;
              .unit {
                font-size: 32rpx;
              }
            }
          }
        }
        .running-appeal-info {
          height: 60rpx;
          box-sizing: border-box;
          padding: 0 40rpx;
          background-color: #edeef5;
          border-radius: 0px 0px 16rpx 16rpx;
          .icon {
            width: 32rpx;
            height: 32rpx;
          }
          .text {
            margin-left: 12rpx;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: $u-main-color;
          }
        }
      }
    }
    .record-item:not(:last-child) {
      padding-bottom: 49rpx;
    }
  }
}
.no-action {
  border: 1px solid rgba(209, 213, 219, 1);
  background: rgba(255, 255, 255, 1);
}
.is-action {
  background: rgba(245, 246, 250, 1);
  // border: 1px solid rgba(209, 213, 219, 0);
}
</style>
