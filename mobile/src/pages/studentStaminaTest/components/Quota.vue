<template>
  <view class="quota-content u-flex">
    <view
      v-for="(item, index) in list"
      :key="item.backgroundColor"
      class="col"
      :style="[{ width: item.width }]"
      :class="{ mr4: index !== list.length - 1 }"
    >
      <view
        class="item-name"
        :class="{ 'item-value': index !== 0, 'first-item': index === 0 }"
      >
        <view v-if="item.isEndLabel" class="u-flex u-row-between">
          <text>{{ item.value }}</text>
          <text>{{ item.endValue }}</text>
        </view>
        <text v-else>
          {{ item.value }}
        </text>
      </view>
      <view
        class="line"
        :class="{ symbol: index !== 0, 'end-symbol': item.isEndLabel }"
        :style="[{ backgroundColor: item.backgroundColor }]"
      />
      <view class="title">
        <view v-if="item.isEndLabel" class="u-flex u-row-between">
          <text>{{ item.label }}</text>
          <text>{{ item.endLabel }}</text>
        </view>
        <text v-else>
          {{ item.label }}
        </text>
      </view>
      <view v-if="item.showScore" class="grad-container">
        <view class="grad">
          {{ item.score }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const style4 = [
  {
    backgroundColor: '#57AEFF',
    width: '15%'
  },
  {
    backgroundColor: '#40C79A',
    width: '43%'
  },
  {
    backgroundColor: '#FFAB02',
    width: '21%'
  },
  {
    backgroundColor: '#F66267',
    width: '21%'
  }
];
const style5 = [
  {
    backgroundColor: '#F66267',
    width: `${(40 / 227) * 100}%`
  },
  {
    backgroundColor: '#FFAB02',
    width: `${(60 / 227) * 100}%`
  },
  {
    backgroundColor: '#40C79A',
    width: `${(60 / 227) * 100}%`
  },
  {
    backgroundColor: '#57AEFF',
    width: `${(60 / 227) * 100}%`
  },
  {
    backgroundColor: '#BA62F6',
    width: `${(107 / 227) * 100}%`
  }
];
import { quotaData } from '../stamina';
export default {
  name: 'Quota',
  props: {
    projectType: {
      type: String,
      default: ''
    }
  },
  computed: {
    grade() {
      const year =
        new Date().getFullYear() - this.$store.state.app.userInfo.year + 1;
      if (year === 1 || year === 2) return 1;
      return 2;
    },
    list() {
      if (this.projectType === '1') {
        const list = quotaData[1][this.sex].map((item, index) => {
          return {
            ...item,
            ...style4[index]
          };
        });
        return list;
      }
      if (this.grade > 0 && this.sex > 0) {
        const list = quotaData[this.projectType][this.grade][this.sex].map(
          (item, index) => {
            return {
              ...item,
              ...style5[index]
            };
          }
        );
        return list;
      }

      return [];
    },
    sex() {
      return this.$store.state.app.userInfo.gender;
    }
  }
};
</script>

<style lang="scss" scoped>
.quota-content {
  width: 100%;
  .col {
    width: 25%;
    .item-name,
    .title {
      text {
        color: $u-main-color;
      }
      font-size: 24rpx;
    }
    .item-name {
      height: 100rpx;
    }
    .title {
      margin: 16rpx 0 24rpx;
      text-align: center;
    }
    .line {
      height: 6rpx;
      width: 100%;
      margin: 0 0 16rpx;
    }
    .item-value {
      font-size: 36rpx;
      font-weight: bold;
    }
    .first-item {
      box-sizing: border-box;
      padding-top: 10rpx;
    }
    .symbol {
      position: relative;
      &::before {
        top: -44rpx;
        left: -16rpx;
        position: absolute;
        display: block;
        content: '';
        width: 0;
        height: 0;
        transform: rotate(-45deg);
        border-top: 16rpx solid transparent;
        border-right: 16rpx solid transparent;
        border-left: 16rpx solid transparent;
        border-bottom: 16rpx solid #d8d8d8;
      }
    }
    .end-symbol {
      position: relative;
      &::after {
        top: -44rpx;
        right: -16rpx;
        position: absolute;
        display: block;
        content: '';
        width: 0;
        height: 0;
        transform: rotate(-45deg);
        border-top: 16rpx solid transparent;
        border-right: 16rpx solid transparent;
        border-left: 16rpx solid #d8d8d8;
        border-bottom: 16rpx solid transparent;
      }
    }
    .grad-container {
      display: flex;
      justify-content: center;
    }
    .grad {
      width: 80rpx;
      line-height: 40rpx;
      text-align: center;
      background-color: #ececec;
      border-radius: 8rpx;
      font-size: 24rpx;
      color: #8b8a99;
    }
  }
  .mr4 {
    margin-right: 4rpx;
  }
}
</style>
