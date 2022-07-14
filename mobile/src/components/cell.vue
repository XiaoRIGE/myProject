<template>
  <view class="cell" @tap="click">
    <view :class="['cell__main', divided ? 'cell__main--divided-line' : '']">
      <div class="cell__main__title">
        {{ title }}
      </div>
      <div class="cell__main__value">
        <span class="cell__main__value__text">{{ value }}</span>
        <image
          v-if="arrow"
          src="~@/static/img/cell/right-arrow.svg"
          alt="右箭头"
          class="cell__main__value__right-arrow"
        />
      </div>
    </view>
  </view>
</template>

<script>
/**
 * cellItem 单元格Item
 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配u-cell-group使用
 * @tutorial https://www.uviewui.com/components/cell.html
 * @property {String} title 左侧标题
 * @property {String} value 右侧内容
 * @property {Boolean} arrow 是否显示右侧箭头（默认true）
 * @property {Boolean} divided 是否显示分割线（默认true）
 */
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    arrow: {
      type: Boolean,
      default: true
    },
    divided: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    click() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
.cell {
  width: 100%;
  background: white;
  padding: 0 32rpx;
  &__main {
    color: #222;
    font-size: 32rpx;
    display: flex;
    justify-content: space-between;
    padding: 32rpx 0;
    &--divided-line {
      border-bottom: 1px solid #f0f0f0;
    }
    &__title {
      font-weight: 500;
    }
    &__value {
      display: flex;
      align-items: center;
      &__right-arrow {
        margin-left: 4rpx;
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
}
</style>
