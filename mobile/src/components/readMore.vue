<template>
  <view class="text-box" :style="textBoxStyle">
    <slot />
    <view
      class="text-result"
      :style="
        isOverHeight && !isOpen
          ? { height: textHeight, overflow: 'hidden' }
          : { height: 'auto' }
      "
    >
      {{ textValue }}
      <!-- 收起箭头 -->
      <view
        v-show="isOverHeight"
        class="arrow"
        :style="
          isOpen
            ? { height: '60rpx', bottom: '-12rpx', background: 'none' }
            : { height: '80rpx' }
        "
      >
        <image
          v-show="isOpen"
          class="arrow-down"
          src="~@/static/img/appeal/arrow-up.svg"
          mode="scaleToFill"
          @click.stop="isOpen = !isOpen"
        />
        <image
          v-show="!isOpen"
          class="arrow-down"
          src="~@/static/img/appeal/arrow-down.svg"
          mode="scaleToFill"
          @click.stop="isOpen = !isOpen"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { toRpx } from '@/utils/common';
export default {
  name: 'ReadMore',
  props: {
    // 反馈结果
    textValue: {
      type: String,
      default: ''
    },
    // 限制显示行数
    lineNum: {
      type: Number,
      default: 2
    },
    textBoxStyle: {
      type: Object,
      default: () => Object.create(null)
    }
  },
  data() {
    return {
      textHeight: null, //限制高度
      isOpen: false, //展开状态
      isOverHeight: false //文字是否超出高度
    };
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.calculateText();
      });
    }, 50);
  },
  methods: {
    calculateText() {
      // 这是默认两行数据的高度，一行的高度可以取决于设置的行高（可自定义
      const twoHeight = 34 * this.lineNum;
      this.textHeight = `${twoHeight}rpx`;

      /** 获取布局位置信息 API参考地址：https://uniapp.dcloud.io/api/ui/nodes-info.html#createselectorquery */
      const query = uni.createSelectorQuery().in(this);
      query
        .select('.text-result')
        .boundingClientRect((data) => {
          const curHeight = toRpx(data.height) || 0;
          if (curHeight > twoHeight) {
            this.isOverHeight = true;
          } else {
            this.isOverHeight = false;
          }
        })
        .exec();
    }
  }
};
</script>

<style scoped lang="scss">
.text-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f6fa;
  margin-top: 32rpx;
  border-radius: 12px;
  padding: 24rpx 22rpx;

  .text-result {
    display: inline-block;
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    line-height: 34rpx;
  }
  .arrow {
    position: absolute;
    left: 0;
    bottom: -28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(245, 246, 250, 0.43) 0%,
      #ffffff 100%
    );
    &-down {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
