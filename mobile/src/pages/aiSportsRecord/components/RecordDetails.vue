<template>
  <view class="record-details">
    <!-- 月记录的日期部分 -->
    <view class="u-flex u-row-between u-col-top">
      <view class="record-details-circle" />
      <view class="record-details-date">
        <text class="record-details-date-month">
          {{ monthItemRecord.month }}
        </text>
        <text class="record-details-date-year">
          / {{ monthItemRecord.year }}年
        </text>
      </view>
    </view>
    <!-- 月记录的每次记录卡片 -->
    <template v-for="(items, index) in monthItemRecord.recordDetails">
      <record-item-card
        :key="index"
        class="record-item-card"
        :class="
          monthItemRecord.recordDetails.length === index + 1 ? 'margin-b' : ''
        "
        :card-record="items"
        @clickRecordCard="clickRecordCard"
      />
    </template>
  </view>
</template>

<script>
import RecordItemCard from './RecordItemCard';

export default {
  name: 'RecordDetails',
  components: {
    'record-item-card': RecordItemCard
  },
  props: {
    monthItemRecord: {
      type: Object,
      default: null
    }
  },
  methods: {
    clickRecordCard(recordId) {
      this.$emit('clickRecordCardHandle', recordId);
    }
  }
};
</script>

<style lang="scss" scoped>
.record-details {
  &-date {
    width: 638rpx;
    margin-bottom: 32rpx;
    &-month {
      font-size: 36rpx;
      font-weight: bold;
    }
    &-year {
      display: inline-block;
      margin-left: 14rpx;
      font-weight: bold;
    }
  }
  &-circle {
    z-index: 1;
    width: 20rpx;
    height: 20rpx;
    background: #fc6c37;
    border-radius: 50%;
    margin-top: 16rpx;
  }
  .record-item-card {
    margin-bottom: 24rpx;
  }
  .margin-b {
    margin-bottom: 48rpx;
  }
}
</style>
