<template>
  <view class="student-my-ai">
    <g-navbar
      id="navBar"
      height="44"
      :background="background"
      :border-bottom="false"
      :is-back="background.back"
      back-icon-size="48"
      back-icon="white"
      :title-bold="true"
      title-color="rgba(255,255,255,1)"
      :title="background.title"
    >
      <view v-if="!background.back" class="slot-wrap navbar-left" @click="back">
        <image
          class="back-icon"
          src="~@/static/img/back-white.svg"
          mode="aspectFit"
        />
      </view>
    </g-navbar>
    <view class="statistic-content">
      <view class="statistic-content-top">
        <view class="keepTime">
          {{ Math.round(exerciseTime / 60) }}
        </view>
        <view class="hint">
          运动时长(分钟)
        </view>
      </view>
      <view class="statistic-content-bottom u-flex u-row-between">
        <view class="calorie">
          <view class="count">
            {{ calorie }}
          </view>
          <view class="hint">
            消耗(千卡)
          </view>
        </view>
        <view class="date">
          <view class="count">
            {{ days }}
          </view>
          <view class="hint">
            累计(天)
          </view>
        </view>
      </view>
    </view>
    <view class="sport-content">
      <view v-if="!empty" class="sports-list">
        <view
          v-for="(item, index) in sportsRecords"
          :key="index"
          class="item"
          @click="sportDetailHandle(item)"
        >
          <view class="date">
            {{
              isToday(item.startTime)
                ? `今日 ${$u.timeFormat(item.startTime, 'hh:MM')}`
                : `${$u.timeFormat(item.startTime, 'mm月dd日 hh:MM')}`
            }}
          </view>
          <view class="sport-details u-flex u-col-center u-row-between">
            <image
              class="sport-icon"
              :src="item.projects.length === 1 ? img[0] : img[1]"
              mode="scaleToFill"
            />
            <view class="sport-info">
              <view class="title">
                {{
                  item.projects.length === 1
                    ? item.title
                    : `共${item.projects.length}个运动项目`
                }}
              </view>
              <view class="info u-flex">
                <view class="score">
                  {{ item.score }}
                  <text class="score-unit">
                    分
                  </text>
                </view>
                <image
                  :src="getSportIcon(item.rating)"
                  mode="scaleToFill"
                  class="more-img"
                />
                <view class="keep-time u-flex u-row-between u-col-center">
                  <image
                    src="~@/static/img/sportTag/sport-clock.png"
                    mode="scaleToFill"
                    class="time-clock"
                  />
                  <view class="time">
                    {{ getkeepTime(item.exerciseTime) }}
                  </view>
                </view>
                <view class="calorie u-flex u-row-between u-col-center">
                  <image
                    src="~@/static/img/sportTag/sport-ca.png"
                    mode="scaleToFill"
                    class="calorie-img"
                  />
                  <view class="num">
                    {{ item.calorie }}cal
                  </view>
                </view>
              </view>
            </view>
            <image
              src="~@/static/img/more.png"
              mode="scaleToFill"
              class="more-img"
            />
          </view>
        </view>
      </view>
      <view v-else class="empty-content">
        <image
          src="~@/static/img/empty-sport.png"
          class="empty-content-img"
          mode="scaleToFill"
        />
        <view class="empty-content-text">
          暂时没有相关数据哦~
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sports } from '@/request/api/student';
import { getUserInfo } from '@/utils/common';
import { getSportIcon, getkeepTime, isToday } from './common';
import events from '@/nativeEvent';

export default {
  data() {
    return {
      background: {
        backgroundColor: '',
        back: false,
        title: ''
      },
      empty: false,
      sportsRecords: [],
      calorie: 0,
      days: 0,
      exerciseTime: 0,
      img: [
        './../../static/img/single-sport.png',
        './../../static/img/group-sport.png'
      ],
      getSportIcon,
      getkeepTime,
      isToday,
      exerciseDaysAndTimes: null
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    }
  },
  mounted() {
    this.getExerciseRecordListHandle();
  },
  methods: {
    // 获取锻炼者运动数据列表
    getExerciseRecordListHandle() {
      const { id } = this.userInfo;
      sports
        .getExerciseRecordList({
          exerciserId: id
        })
        .then(res => {
          if (res.code === 0) {
            if (res.data) {
              this.sportsRecords = res.data.sportsRecords;
              this.exerciseTime = res.data.exerciseTime;
              this.calorie = res.data.calorie;
              this.days = res.data.days;
              this.empty = false;
            } else {
              this.sportsRecords = [];
              this.empty = true;
            }
          }
        });
    },
    setNavBar(height) {
      this.background.backgroundColor = `rgba(23, 43, 76,${
        height > 40 ? height / 227 : 0
      })`;
      if (height > 227) {
        this.background.back = true;
        this.background.title = '我的AI运动';
      } else {
        this.background.back = false;
        this.background.title = '';
      }
    },
    // 跳转运动详情页
    sportDetailHandle(item) {
      const { id, startTime } = item;
      sports
        .getExerciseResultConcise({
          exerciserId: this.userInfo.id,
          recordId: id,
          date: startTime
        })
        .then(res => {
          if (res.code === 0) {
            // 进入原生AI运动结果页
            events.navigatorNativePage({
              page: 'sportResultPage',
              info: res.data
            });
          }
        })
        .catch(res => {
          this.$refs.uToast.show({
            title: res.message
          });
        });
    },

    back() {
      uni.navigateBack();
    }
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.$u.throttle(this.setNavBar(e.scrollTop), 100);
  }
};
</script>

<style lang="scss" scoped>
.student-my-ai {
  background: rgba(23, 43, 76, 1);
  min-height: 100vh;
  .navbar-left {
    box-sizing: border-box;
    padding-left: 24rpx;
    .back-icon {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .statistic-content {
    width: 750rpx;
    height: 452rpx;
    color: rgba(255, 255, 255, 1);
    .hint {
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
    }
    &-top {
      width: 510rpx;
      margin: 0 auto 80rpx;
      text-align: center;
      .keepTime {
        font-size: 96rpx;
        font-weight: bold;
        margin-bottom: 6rpx;
        line-height: 144rpx;
      }
    }
    &-bottom {
      padding: 0 40rpx;
      .calorie,
      .date {
        width: 296rpx;
        text-align: center;
      }
      .count {
        font-size: 48rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
        line-height: 74rpx;
      }
    }
  }
  .sport-content {
    width: 100%;
    min-height: calc(100vh - 614rpx);
    background: rgba(255, 255, 255, 1);
    border-radius: 12px 12px 0px 0px;
    .sports-list {
      padding: 0 32rpx;
      .item {
        width: 100%;
        padding: 32rpx 0 40rpx 0;
        border-bottom: 2rpx solid rgba(240, 240, 240, 1);
        .date {
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-bottom: 48rpx;
        }
        .sport-details {
          .sport-icon {
            width: 104rpx;
            height: 104rpx;
          }
          .sport-info {
            .title {
              margin-bottom: 34rpx;
              font-size: 32rpx;
              font-weight: 400;
              color: rgba(34, 34, 34, 1);
            }
            .info {
              .score {
                font-size: 48rpx;
                font-weight: bold;
                color: rgba(34, 34, 34, 1);
                line-height: 74rpx;
                .score-unit {
                  font-size: 24rpx;
                  font-weight: bold;
                  color: rgba(34, 34, 34, 1);
                  margin: 0 8rpx 0 4rpx;
                }
              }
            }
          }
          .more-img {
            width: 36rpx;
            height: 36rpx;
          }
          .keep-time {
            .time-clock {
              width: 42rpx;
              height: 40rpx;
              margin-right: 8rpx;
              margin-left: 22rpx;
            }
            .time {
              font-size: 28rpx;
              font-weight: bold;
              width: 140rpx;
              margin-right: 10rpx;
            }
          }
          .calorie {
            .calorie-img {
              width: 42rpx;
              height: 40rpx;
              margin-right: 8rpx;
            }
            .num {
              font-size: 28rpx;
              font-weight: bold;
            }
          }
        }
      }
    }
    .empty-content {
      margin: 0 auto 0;
      text-align: center;
      &-img {
        margin-top: 108rpx;
        width: 280rpx;
        height: 292rpx;
      }
      &-text {
        margin-top: 40rpx;
        font-size: 32rpx;
      }
    }
  }
}
</style>
