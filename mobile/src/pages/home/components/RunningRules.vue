<template>
  <view class="running-rules-container">
    <scroll-view scroll-y="true" style="height: 980rpx">
      <!-- <view class="rules-title">
        跑步规则
      </view> -->
      <view class="content">
        <view class="effect-time">
          <view class="effect-time-title">有效时间</view>
          <view class="effect-time-run-row">
            <view class="effect-time-run-row-title font-size16">跑步日期</view>
            <view class="effect-time-run-row-content">
              •
              {{
                $u.timeFormat(
                  Number(ruleInfo.runningTimeLimit.startTime || 0),
                  'yyyy.mm.dd'
                )
              }}
              至
              {{
                $u.timeFormat(
                  Number(ruleInfo.runningTimeLimit.endTime || 0),
                  'yyyy.mm.dd'
                )
              }}
            </view>
          </view>
          <view class="effect-time-run-row">
            <view class="effect-time-run-row-title font-size16">有效时段</view>
            <view
              v-for="(item, index) in weekOpenTimes"
              :key="index"
              class="effect-time-run-row-content"
            >
              •
              {{ item.week || '' }}
              {{ $u.timeFormat(item.start, 'hh:MM') }}-{{
                $u.timeFormat(item.end, 'hh:MM')
              }}
            </view>
          </view>
        </view>
        <view class="rule-tab">
          <view class="rule-tab-item" @click="tabValue = 1">
            <view class="rule-tab-item-title">APP规则</view>
            <view
              v-if="tabValue === 1 && faceRunningStatus"
              class="rule-tab-item-line app"
            ></view>
          </view>
          <view
            v-if="faceRunningStatus"
            class="rule-tab-item"
            @click="tabValue = 2"
          >
            <view class="rule-tab-item-title">岗亭打卡规则</view>
            <view
              v-if="tabValue === 2 && faceRunningStatus"
              class="rule-tab-item-line punch"
            ></view>
          </view>
        </view>
        <!-- APP规则 -->
        <view v-if="tabValue === 1" class="app-rule">
          <view class="rules">
            <view
              v-for="(item, index) in currentRule"
              :key="index"
              class="ruleItem"
            >
              <view class="rule-title">
                {{ item.title }}
              </view>
              <view class="rule-detail">
                {{ item.value || getValue(item) }}
              </view>
            </view>
          </view>
          <view class="scope-run">
            <view class="font-size14">范围跑:</view>
            <view class="line-h20">
              • 有效范围外的跑步里程不能超过总里程的“{{
                ruleInfo.scopePercentage
              }}%”，否则将此次记录看作无效
            </view>
          </view>
          <view class="point-run">
            <view class="font-size14">定点跑:</view>
            <view class="line-h20">
              • 有效范围外的跑步里程不能超过总里程的“{{
                ruleInfo.fixedPointPercentage
              }}%”，否则将此次记录看作无效
            </view>
            <view class="line-h20">
              • 需“{{
                ruleInfo.fixedPointOrder === 1 ? '按顺序' : '不按顺序'
              }}”经过{{
                ruleInfo.fixedPointNumber || 0
              }}个点，并且完成最小有效里程
            </view>
          </view>
          <text class="hint">* 累计暂停时长大于15分钟，自动提交数据</text>
        </view>
        <!-- 岗亭打卡规则 -->
        <view v-else-if="faceRunningStatus && tabValue === 2" class="roadmap">
          <view v-for="(items, idx) in routes" :key="idx" class="roadmap-item">
            <view class="roadmap-item-left">
              <view class="roadmap-item-left-title">路线计入</view>
              <view class="roadmap-item-left-value">
                <text class="roadmap-item-left-value__count">
                  {{ ruleInfo.scoringType === 1 ? items.mileage : items.part }}
                </text>
                <text class="roadmap-item-left-value__unit">
                  {{ ruleInfo.scoringType === 1 ? 'km' : '段' }}
                </text>
              </view>
            </view>
            <scroll-view
              scroll-x="true"
              class="roadmap-item-right"
              @touchmove.stop
            >
              <view class="roadmap-item-right-road">
                <view
                  v-for="(item, index) in items.details"
                  :key="index"
                  class="roadmap-item-right-road__item"
                >
                  <view
                    v-if="index < items.details.length && index"
                    class="roadmap-item-right-road__item__arrows"
                  >
                    <image
                      src="~@/static/img/triangle-arrows.png"
                      mode="scaleToFill"
                      class="triangle-arrows"
                    />
                    <view class="time">
                      {{ item.minMinutes }}~{{ item.maxMinutes }}分钟
                    </view>
                  </view>
                  <view class="roadmap-item-right-road__item__name">
                    {{ item.locationName }}
                  </view>
                </view>
                <view class="visibility">占位</view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
const status = {
  1: 'mileageRule', // 里程模式
  2: 'segmentsRule' // 段数模式
};
const weeks = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const fitnessData = (value) => {
  if (!value) return value || 0;
  if (value / 1000 < 60) {
    return `${value / 1000}''`;
  }
  const M = Math.floor(value / 1000 / 60); //  分
  const s = (value / 1000) % 60; // 秒
  const format = s > 0 ? `${M}'${s.toFixed(0)}''` : `${M}'`;
  return format;
};
const formatWeekRules = (list, currentTimeStamp) => {
  const result = [];
  if (list && list.length > 0) {
    list.forEach((item) => {
      const { dayStartTime, dayEndTime, week } = item;
      const weekArr = [];
      week.split(',').map((num) => {
        if (num && Number(num)) {
          weekArr.push(weeks[Number(num)]);
        }
      });
      const rowItem = {
        week: weekArr.join('/'),
        start: Number(currentTimeStamp) + Number(dayStartTime),
        end: Number(currentTimeStamp) + Number(dayEndTime)
      };
      result.push(rowItem);
    });
  }
  return result;
};
const mileageRule = [
  {
    title: '单次有效里程限制',
    params: ['effectiveMileageStart', 'effectiveMileageEnd'],
    unit: ['km', 'km']
  },
  {
    title: '每日里程上限',
    params: 'dailyMileage',
    unit: 'km'
  },
  {
    title: '每周里程上限',
    unit: 'km',
    params: 'weeklyMileage'
  },
  {
    title: '学期目标里程',
    unit: 'km',
    params: 'semesterMileage'
  },
  {
    title: '平均配速',
    unit: ['', ''],
    fn: fitnessData,
    params: ['averageSpeedStart', 'averageSpeedEnd']
  },
  {
    title: '平均步频/分钟',
    unit: ['', ''],
    params: ['averageCadenceStart', 'averageCadenceEnd']
  }
];
const segmentsRule = [
  {
    title: '每段有效里程',
    params: 'effectiveParagraphMileage',
    unit: 'km'
  },
  {
    title: '每次有效段数',
    unit: ['', ''],
    params: ['effectiveParagraphStart', 'effectiveParagraphEnd']
  },
  {
    title: '每日段数上限',
    unit: '',
    params: 'dailyParagraph'
  },
  {
    title: '每周段数上限',
    unit: '',
    params: 'weeklyParagraph'
  },
  {
    title: '学期目标段数',
    unit: '',
    params: 'semesterParagraph'
  },
  {
    title: '平均配速',
    unit: ['', ''],
    fn: fitnessData,
    params: ['averageSpeedStart', 'averageSpeedEnd']
  },
  {
    title: '平均步频/分钟',
    unit: ['', ''],
    params: ['averageCadenceStart', 'averageCadenceEnd']
  }
];

export default {
  props: {
    ruleInfo: {
      type: Object,
      default: () => {}
    },
    faceRunningStatus: {
      type: Boolean,
      default: false
    },
    routes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mileageRule: Object.freeze(mileageRule),
      segmentsRule: Object.freeze(segmentsRule),
      tabValue: 1
    };
  },
  computed: {
    currentRule() {
      if (!this.ruleInfo.scoringType) return [];
      return this[status[this.ruleInfo.scoringType]];
    },
    weekOpenTimes() {
      return formatWeekRules(
        this.ruleInfo.runningTimeLimit.weekOpenTimes || [],
        this.ruleInfo.currentTimeStamp
      );
    }
  },
  methods: {
    getValue(data) {
      const { params, unit, fn } = data;
      if (typeof params === 'string') {
        return (
          (typeof fn === 'function'
            ? fn(this.ruleInfo[params])
            : this.ruleInfo[params] || 0) + (unit || '')
        );
      }
      if (Array.isArray(params)) {
        const values = [];
        for (let i = 0; i < params.length; i++) {
          const value =
            typeof fn === 'function'
              ? fn(this.ruleInfo[params[i]]) + (unit[i] || '')
              : (this.ruleInfo[params[i]] || 0) + (unit[i] || '');
          values.push(value);
        }
        return values.join('-');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.running-rules-container {
  padding-top: 100rpx;
  .rules-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100rpx;
    font-weight: bold;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx;
  }
  .content {
    margin: 16rpx 0 32rpx;
    .effect-time {
      margin: 0 32rpx;
      padding-bottom: 24rpx;
      border-bottom: 2rpx solid #ececec;
      margin-bottom: 40rpx;
      &-title {
        margin-bottom: 16rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #222222;
      }
      &-run-row {
        margin-bottom: 16rpx;
        &-title {
          font-size: 28rpx;
          font-weight: 400;
          color: #999999;
        }
        &-content {
          margin-top: 8rpx;
          font-size: 28rpx;
          color: $u-main-color;
        }
      }
    }
    .rule-tab {
      padding: 0 32rpx;
      display: flex;
      &-item {
        margin-right: 64rpx;
        &-title {
          font-size: 36rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #222222;
        }
        &-line {
          height: 10rpx;
          background: #fc6c37;
          border-radius: 2rpx;
          margin-top: -12rpx;
        }
        .app {
          width: 144rpx;
        }
        .punch {
          width: 216rpx;
        }
      }
    }
    .app-rule {
      padding: 0 32rpx;
      .hint {
        display: block;
        color: #fc6c37;
        margin-top: 32rpx;
        margin-bottom: 16rpx;
      }
      .rules {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 32rpx;
        margin-bottom: 8rpx;
        .ruleItem {
          width: 218rpx;
          height: 136rpx;
          text-align: center;
          background: rgba(245, 246, 250, 1);
          border-radius: 16rpx;
          margin-bottom: 16rpx;
          .rule-title {
            font-size: 24rpx;
            color: rgba(102, 102, 102, 1);
            margin: 24rpx 0 10rpx;
          }
          .rule-detail {
            font-size: 32rpx;
            font-weight: bold;
            transform: scale(0.85, 1.1);
            color: rgba(34, 34, 34, 1);
          }
        }
      }
      .scope-run {
        margin-bottom: 32rpx;
      }
    }
    .roadmap {
      padding-left: 32rpx;
      &-item {
        display: flex;
        margin-top: 32rpx;
        &-left {
          width: 112rpx;
          height: 136rpx;
          background: #f5f6fa;
          border-radius: 16rpx;
          padding: 24rpx 8rpx;
          text-align: center;
          &-title {
            width: 96rpx;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }
          &-value {
            margin-top: 8rpx;
            height: 48rpx;
            font-size: 32rpx;
            font-family: Oswald-Bold, Oswald;
            font-weight: bold;
            color: #222222;
            line-height: 48rpx;
          }
        }
        &-right {
          overflow: hidden;
          width: 100%;
          &-road {
            display: flex;
            padding-top: 66rpx;
            &__item {
              display: flex;
              align-items: center;
              &__name {
                width: max-content;
                min-width: 184rpx;
                height: 48rpx;
                background: #545266;
                border-radius: 16rpx;
                padding: 4rpx 8rpx;
                text-align: center;
                font-size: 28rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #ffffff;
              }
              &__arrows {
                position: relative;
                .triangle-arrows {
                  width: 36rpx;
                  height: 36rpx;
                }
                .time {
                  position: absolute;
                  top: -44rpx;
                  left: -40rpx;
                  width: 160rpx;
                  font-size: 24rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #666666;
                  z-index: 100;
                }
              }
            }
            &__item:first-child {
              margin-left: 16rpx;
            }
            .visibility {
              width: 32rpx;
              height: 10rpx;
              visibility: hidden;
            }
          }
        }
      }
    }
  }
}
.font-size14 {
  font-size: 28rpx;
  font-weight: 400;
  color: #999999;
}
.line-h20 {
  margin-top: 4rpx;
  font-weight: 400;
  line-height: 40rpx;
}
</style>
