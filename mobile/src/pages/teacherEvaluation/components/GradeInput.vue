<template>
  <view class="grade-input-content">
    <input
      v-model="value"
      class="grade-input-content--input"
      type="digit"
      :placeholder-style="placeholderStyle.join(';')"
      placeholder="请输入"
      :auto-blur="true"
      @input="input"
      @blur="blur"
    />
    <!-- 提示 -->
    <view
      class="grade-input-content--tps"
      :class="[err ? 'err-tps' : 'info-tps']"
    >
      <text v-show="!err">{{ tps }}</text>
      <text v-show="err">{{ errTips }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tps: {
      type: String,
      default: ''
    },
    subject: {
      type: Object,
      default: () => Object.create(null)
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: '',
      errTips: '',
      err: false,
      placeholderStyle: [
        'paddingLeft: 16rpx',
        'fontSize: 28rpx',
        'fontWeight: 400',
        'color: #C3C2CC'
      ]
    };
  },
  methods: {
    // 输入事件
    input() {
      this.$emit('input', this.value);
    },

    // 失去焦点
    blur() {
      // 验证输入
      this.verification();
      this.$emit('blur', '3', this.value, this.subject);
    },

    // 输入验证
    verification() {
      if (this.rules && Array.isArray(this.rules)) {
        const rules = this.rules || [];
        const len = rules.length;
        for (let i = 0; i < len; i++) {
          const {
            min = -Infinity,
            max = Infinity,
            decimal = Infinity,
            required,
            message
          } = rules[i];
          if (required) {
            // 必填
            if (this.value !== 0 && !this.value) {
              this.err = true;
              this.errTips = message;
              break;
            }
          }
          // 最小值，最大值判断
          if (this.value < min || this.value > max) {
            this.err = true;
            this.errTips = message;
            break;
          }

          // 保留小数位
          if (decimal < 999) {
            const decimalValue = String(this.value).split('.')[1] || '';
            if (decimalValue && decimalValue.length > decimal) {
              this.err = true;
              this.errTips = message;
              break;
            }
          }
          this.err = false;
        }
      }
    },

    // 校验函数
    async validate() {
      await this.verification();
      return Promise.resolve({
        validate: !this.err,
        value: this.value,
        message: this.errTips,
        ...this.subject
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.grade-input-content {
  margin-top: 32rpx;
  &--input {
    box-sizing: border-box;
    padding: 0 32rpx;
    height: 88rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-main-color;
    border-radius: 16rpx;
    border: 1px solid #f1f1f5;
    background-color: #fafafb;
  }
  &--tps {
    margin-top: 8rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .err-tps {
    color: $u-type-error;
  }
  .info-tps {
    color: $u-tips-color;
  }
}
</style>
