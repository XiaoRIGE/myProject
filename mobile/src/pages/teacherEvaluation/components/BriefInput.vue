<template>
  <view class="brief-input-content">
    <textarea
      v-model="value"
      class="brief-input-content--input default-bor"
      auto-height
      :style="cuStyle"
      :maxlength="1000"
      :auto-blur="true"
      :placeholder-style="placeholderStyle.join(';')"
      placeholder="请输入"
      @linechange="linechange"
      @input="input"
      @blur="blur"
    />
    <!-- 提示 -->
    <view class="brief-input-content--tps info-tps">{{ currentNum }}/1000</view>
  </view>
</template>

<script>
export default {
  props: {
    subject: {
      type: Object,
      default: () => Object.create(null)
    }
  },
  data() {
    return {
      value: '',
      err: false,
      cuStyle: {
        minHeight: '68rpx',
        lineHeight: '68rpx'
      },
      placeholderStyle: [
        'height: 68rpx',
        'lineHeight: 68rpx',
        'paddingLeft: 16rpx',
        'fontSize: 28rpx',
        'fontWeight: 400',
        'color: #C3C2CC'
      ]
    };
  },
  computed: {
    currentNum() {
      return String(this.value).length;
    }
  },
  methods: {
    input() {
      this.$emit('input', this.value);
    },
    blur() {
      this.err = this.currentNum === 0;
      this.$emit('blur', '4', this.value, this.subject);
    },
    validate() {
      // 提交前调用该方法，判断是否验证通过
      return Promise.resolve({
        validate: !this.err,
        value: this.value,
        ...this.subject
      });
    },
    linechange(event) {
      const { detail } = event;
      if (detail.lineCount > 1) {
        this.cuStyle.lineHeight = 'normal';
      } else {
        this.cuStyle.lineHeight = '68rpx';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.brief-input-content {
  margin-top: 32rpx;
  &--input {
    width: 100%;
    box-sizing: border-box;
    padding: 10rpx 32rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-main-color;
    border-radius: 16rpx;
    border: 1px solid transparent;
    background-color: #fafafb;
  }
  &--tps {
    margin-top: 8rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .info-tps {
    color: $u-tips-color;
  }
  .err-bor {
    border-color: $u-type-error;
  }
  .default-bor {
    border-color: #f1f1f5;
  }
  .auto-height {
    min-height: 88rpx;
  }
}
</style>
