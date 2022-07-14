<template>
  <view class="attendance-state">
    <!-- 签到类型-自动签到 -->
    <!-- 自动签到 -->
    <view
      v-if="signModeInfo.attainabilityModeSwitch === 2"
      class="auto-check-container"
    >
      <view class="title">
        自动签到{{ isOpenSignIn ? '已' : '未' }}开启
      </view>
      <view class="sign-info">
        <view
          v-for="(tps, index) in autoSignContent"
          :key="index"
          class="sign-info-tps"
        >
          <text class="sign-info-content">
            {{ tps.label }}{{ signModeInfo[tps.key] || '' }} {{ tps.unit }}
          </text>
        </view>
      </view>
      <view class="sigin-btns" @click="$emit('changeSignMode')">
        开启手动签到
      </view>
    </view>
    <!-- 签到类型-手动签到 -->
    <template v-if="signModeInfo.attainabilityModeSwitch === 1">
      <!-- 开启考勤 -->
      <view v-if="isOpenSignIn" class="open-state">
        <view class="open-state-title">
          {{ number === 1 ? '首次签到已开启' : '二次签到已开启' }}
        </view>
        <view v-if="number === 1" class="open-state-hint">
          需要开启二次签到?
          <text class="open-second" @click="showOpenSecondHandle(0)">
            去开启
          </text>
        </view>
        <view v-else class="open-state-hint">
          二次签到间隔时长已设置！
          <text class="open-second" @click="showOpenSecondHandle(1)">
            去修改
          </text>
        </view>
        <view class="open-state-btn u-flex u-row-between">
          <view
            class="btn-item u-flex"
            :style="{
              background: isGps ? 'rgba(255,171,2,1)' : ''
            }"
            @click="clickGspHandle"
          >
            <image
              class="btn-img gps"
              mode="scaleToFill"
              src="~@/static/img/gps.png"
            />
            <view>{{ isGps ? '关闭' : '开启' }}GPS签到</view>
          </view>
          <view class="btn-item u-flex" @click="clickScanHandle">
            <image
              class="btn-img scan"
              mode="scaleToFill"
              src="~@/static/img/scan.png"
            />
            <view>签到扫一扫</view>
          </view>
        </view>
      </view>
      <!-- 未开启考勤 -->
      <view v-else class="not-open-state">
        <view class="not-open-state-text">
          当前未开启签到
        </view>
        <view class="not-open-state-btn" @click="confirmOpenHandle(1)">
          开启首次签到
        </view>
      </view>
    </template>

    <!-- 二次签到弹窗 -->
    <u-select
      v-model="showOpenSecond"
      mode="mutil-column"
      :list="list"
      confirm-color="#FC6C37"
      cancel-color="#222222"
      :safe-area-inset-bottom="true"
      :default-value="defaultValue"
      :title="number === 1 ? '开启二次签到' : '二次签到'"
      @confirm="confirmOpenSecondHandle"
    />
    <!-- <u-modal
      v-model="showOpenSecond"
      title="开启二次签到"
      :title-style="{ fontSize: '36rpx', fontWeight: 600 }"
      content="开启二次签到后，首次签到将被关闭，考勤成绩以二次签到为准"
      :content-style="{ fontSize: '34rpx', color: '#666666' }"
      :show-cancel-button="true"
      confirm-text="确认开启"
      :confirm-style="{ fontWeight: 600, color: '#FC6C37', fontSize: '36rpx' }"
      :cancel-style="{ fontWeight: 600, color: '##666666', fontSize: '36rpx' }"
      @cancel="showOpenSecond = false"
      @confirm="confirmOpenHandle(2)"
    /> -->
  </view>
</template>

<script>
import events from '@/nativeEvent';
import { activity } from '@/request/api/teacher';
import { getTimeList } from '../common';
const autoSignContent = [
  {
    label: '签到开启时间：',
    unit: '',
    key: 'autoStartTime'
  },
  {
    label: '签到间隔时长：',
    key: 'interval',
    unit: '分钟'
  },
  {
    label: 'GPS签到地点：',
    key: 'signAddress',
    unit: ''
  },
  {
    label: '签到区域半径：',
    key: 'radius',
    unit: '米'
  }
];
export default {
  name: 'AttendanceState',
  props: {
    signModeInfo: {
      type: Object,
      default: () => Object.create(null)
    },
    isOpenSignIn: {
      type: Boolean,
      default: null
    },
    number: {
      type: Number,
      default: null
    },
    interval: {
      type: Number,
      default: null
    },
    activityId: {
      type: String,
      default: ''
    },
    isGps: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      showOpenSecond: false,
      flag: null, //flag:0 开启二次签到 flag:1 修改二次签到
      autoSignContent: Object.freeze(autoSignContent)
    };
  },
  computed: {
    list() {
      return getTimeList();
    },
    defaultValue() {
      if (this.$props.interval) {
        return [0, this.$props.interval, 0];
      }
      return [0, 0, 0];
    }
  },
  methods: {
    // 显示二次签到弹窗
    showOpenSecondHandle(flag) {
      // flag:0 开启二次签到 flag:1 修改二次签到
      this.flag = flag;
      this.showOpenSecond = true;
    },
    // 确认开启第二次签到
    confirmOpenSecondHandle(e) {
      this.showOpenSecond = false;
      if (!this.flag) {
        this.$emit('openSignIn', { num: 2, interval: e[1].value });
      } else {
        this.$emit('updateSignIn', e[1].value);
      }
    },
    // 修改二次签到间隔时间
    updateOpenSecondHandle() {},
    // 确认开启第一次签到
    confirmOpenHandle(num) {
      this.$emit('openSignIn', { num, interval: 0 });
    },
    // GPS签到
    clickGspHandle() {
      activity
        .getGpsInfo({
          simpleActivityId: this.$props.activityId,
          times: this.$props.number
        })
        .then(res => {
          if (res.code === 0) {
            this.$emit('changeLoading');
            // 进入原生GPS签到页面
            events.navigatorNativePage({
              page: 'gpsActivitySignIn',
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
    // 二维码签到
    clickScanHandle() {
      this.$emit('changeLoading');
      uni.navigateTo({
        url: `/pages/activityAttendanceDetail/activityScan?activityId=${this.$props.activityId}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.attendance-state {
  text-align: center;
  padding: 32rpx 40rpx 0;
  border-radius: 20rpx 20rpx 0 0;
  background: rgba(255, 255, 255, 1);
  .not-open-state {
    &-text {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 24rpx;
    }
    &-btn {
      width: 256rpx;
      height: 92rpx;
      font-size: 32rpx;
      background: linear-gradient(
        360deg,
        rgba(106, 175, 30, 1) 0%,
        rgba(132, 209, 48, 1) 100%
      );
      margin: 0 auto;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 92rpx;
      box-shadow: 0rpx 4rpx 24rpx -2rpx rgba(107, 176, 31, 0.4);
      border-radius: 24rpx;
    }
  }
  .open-state {
    &-title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 16rpx;
      margin-top: 30rpx;
    }
    .open-second {
      color: #2db7b2;
      margin-left: 6rpx;
      text-decoration: underline;
    }
    &-btn {
      margin-top: 60rpx;
      .btn-item {
        width: 300rpx;
        height: 92rpx;
        background: rgba(252, 108, 55, 1);
        border-radius: 24rpx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        .btn-img {
          width: 36rpx;
          height: 36rpx;
        }
        .gps {
          margin-left: 38rpx;
          margin-right: 16rpx;
        }
        .scan {
          margin-left: 54rpx;
          margin-right: 16rpx;
        }
      }
    }
  }
  ::v-deep .u-drawer-bottom {
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    .u-select__header {
      height: 100rpx;
      border-bottom: 2rpx solid #ececec;
      padding: 0 60rpx;
      .u-select__header__title {
        font-size: 36rpx;
        font-weight: 600;
      }
      .u-select__header__btn {
        font-size: 32rpx;
      }
    }
    .u-select__body {
      font-size: 32rpx;
      font-weight: 600;
    }
  }
  .auto-check-container {
    text-align: center;
    .title {
      font-size: 40rpx;
      color: $u-main-color;
      font-weight: bold;
    }
    .sign-info {
      box-sizing: border-box;
      padding: 24rpx 0 56rpx;
      &-content {
        font-size: 24rpx;
        color: $u-content-color;
      }
    }
    .sign-info-tps {
      text-align: left;
      margin-bottom: 12rpx;
    }
    .sigin-btns {
      display: inline-block;
      width: 256rpx;
      height: 92rpx;
      line-height: 92rpx;
      font-weight: bold;
      text-align: center;
      color: #fff;
      background: linear-gradient(360deg, #fc6c37 0%, #fc8937 100%);
      box-shadow: 0px 4rpx 24rpx -2rpx rgba(252, 108, 55, 0.4);
      border-radius: 24rpx;
    }
  }
}
</style>
