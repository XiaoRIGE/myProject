<template>
  <view v-if="appealInfo" class="appeal-infomation-container">
    <!-- 跑步信息，有关联数据 -->
    <view class="run-info">
      <view class="title">申诉信息</view>
      <view
        v-if="appealInfo && appealInfo.runningDetailsId"
        class="card"
        @click="goRunningResult"
      >
        <view class="card-header u-flex">
          <text class="run-name">
            {{ appealInfo.runningTypeName || '' }}
          </text>
          <text class="run-date">
            {{
              appealInfo.startTime
                ? $u.timeFormat(appealInfo.startTime, 'yyyy年mm月dd日')
                : '--:--:--'
            }}
          </text>
          <text v-if="week" class="run-week">
            {{ week }}
          </text>
        </view>
        <view class="card-body u-flex">
          <view class="card-body-left">
            <view class="title">
              总{{ getScoringTypeStatusNames(appealInfo.scoringType) }}
            </view>
            <view class="count">
              {{ getTotalCount(appealInfo.scoringType)
              }}{{ getScoringUnits(appealInfo.scoringType) }}
            </view>
          </view>
          <view class="card-body-right">
            <view class="title">
              有效{{ getScoringTypeStatusNames(appealInfo.scoringType) }}
            </view>
            <view class="count">
              {{ getValidData(appealInfo.scoringType) || 0 }}
              <text class="unit">
                {{ getScoringUnits(appealInfo.scoringType) }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 申诉信息 -->
    <view class="appeal-info">
      <view class="appeal-info-item u-flex info-type">
        <text class="label">申诉类型：</text>
        <view class="describe">
          {{ appealInfo.appealTypeStr || '' }}
        </view>
      </view>
      <view class="appeal-info-item u-flex info-describe">
        <view class="label">申诉描述：</view>
        <view class="describe">
          {{ appealInfo.appealReason || '' }}
        </view>
      </view>
      <view v-if="appealInfo.url" class="appeal-info-item u-flex info-img">
        <text class="label">上传凭证：</text>
        <view class="describe u-flex">
          <image
            v-for="(path, index) in appealInfo.url"
            :key="index"
            class="img"
            :src="path"
            mode="aspectFill"
            @click="previewImage(index)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getScoringTypeStatus,
  getScoringTypeStatusNames,
  getScoringUnits,
  totalKeys
} from './../common';
export default {
  name: 'AppealInfomation',
  props: {
    appealInfo: {
      type: Object,
      default: Object.create(null)
    },
    page: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      plat: ''
    };
  },
  computed: {
    week() {
      if (this.appealInfo.startTime) {
        const date = new Date(Number(this.appealInfo.startTime));
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
          date.getDay()
        ];
      }
      return false;
    }
  },
  created() {
    uni.getSystemInfo({
      success: (res) => {
        if (res.platform === 'android') {
          this.plat = 1;
        } else if (res.platform === 'ios') {
          this.plat = 2;
        }
      }
    });
  },
  methods: {
    // 图片预览
    previewImage(index) {
      uni.previewImage({
        urls: this.appealInfo.url,
        current: index,
        loop: true,
        indicator: 'number'
      });
    },
    // 获取当前跑步类型名称
    getScoringTypeStatusNames(state) {
      return getScoringTypeStatusNames(getScoringTypeStatus(state));
    },
    // 获取单位 KM、段
    getScoringUnits(state) {
      return getScoringUnits(getScoringTypeStatus(state));
    },
    // 获取总里程，或者总段数
    getTotalCount(state) {
      if (!this.appealInfo) return '';
      return this.appealInfo[totalKeys[getScoringTypeStatus(state)]];
    },
    // 获取有效里程或者段数
    getValidData(state) {
      if (!this.appealInfo) return 0;
      const type = getScoringTypeStatus(state);
      const {
        operationMileage,
        effectiveMileage,
        operationPart,
        effectivePart
      } = this.appealInfo;
      // mileage -> 里程模式
      // part -> 段数模式
      if (type === 'mileage') {
        // 先去查找修改后的里程，不存在再去取上传里程
        return operationMileage === null ? effectiveMileage : operationMileage;
      }
      if (type === 'part') {
        // 先去查找修改后的段数，不存在再去取上传段数
        return operationPart === null ? effectivePart : operationPart;
      }
    },
    // 查看跑步详情页面
    goRunningResult() {
      // 判断是否是详情页面进来，是就不跳转
      if (this.page === 'detail') return;
      uni.navigateTo({
        url: `/pages/runningResult/index?id=${this.appealInfo.runningDetailsId}&type=${this.appealInfo.runningType}&plat=${this.plat}&page=show`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.appeal-infomation-container {
  margin-top: 24rpx;
  box-sizing: border-box;
  padding: 32rpx;
  width: 100%;
  min-height: 336rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  .run-info {
    .title {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: $u-main-color;
    }
    .card {
      width: 100%;
      margin-top: 28rpx;
      min-height: 125rpx;
      background-color: #f5f6fa;
      border-radius: 16rpx;
      .card-header {
        height: 90rpx;
        box-sizing: border-box;
        padding-left: 40rpx;
        border-bottom: 1px solid #eaecf0;
        .run-name {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #2b2d33;
        }
        .run-date,
        .run-week {
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $uni-text-color-grey;
        }
        .run-date {
          margin-left: 28rpx;
        }
        .run-week {
          margin-left: 14rpx;
        }
      }
      .card-body {
        height: 158rpx;
        box-sizing: border-box;
        padding-left: 40rpx;
        .card-body-left,
        .card-body-right {
          width: 50%;
          .title {
            font-size: 28rpx;
            color: #2b2d33;
          }
          .count {
            margin-top: 8rpx;
            font-size: 36rpx;
            font-weight: bold;
            .unit {
              font-size: 32rpx;
            }
          }
        }
      }
    }
  }
  .appeal-info {
    margin-top: 32rpx;
    &-item {
      margin-bottom: 16rpx;
      flex-wrap: nowrap;
      .label {
        width: 120rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $u-content-color;
      }
      .describe {
        flex: 1;
        flex-wrap: wrap;
        flex-shrink: 0;
        font-size: 24rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: $u-main-color;
        .img {
          margin-right: 16rpx;
          width: 112rpx;
          height: 112rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
}
</style>
