<template>
  <view class="list-title-box u-flex u-row-between">
    <view class="left-title-name">
      学生列表({{ num }})
    </view>
    <view class="right-content u-flex u-row-right u-flex-1">
      <template v-if="listType === 'vision'">
        <view class="item score">
          左眼
        </view>
        <view class="item score">
          右眼
        </view>
      </template>
      <template v-else>
        <view class="item u-flex-1">
          体测数据
        </view>
        <view class="item score">
          体测成绩
        </view>
        <view class="item level">
          等级
        </view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 0
    },
    listType: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
.list-title-box {
  height: 88rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  background-color: #f5f6fa;
  z-index: 9;
  .left-title-name {
    width: 200rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .right-content {
    width: 550rpx;
    .score,
    .level {
      width: 120rpx;
    }
    .item {
      margin-left: 20rpx;
      text-align: center;
    }
  }
}
</style>
