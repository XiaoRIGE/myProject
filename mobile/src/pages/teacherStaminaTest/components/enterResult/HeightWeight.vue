<template>
  <view class="height-weight-content u-flex u-row-between">
    <view class="height-weight-content-left">
      <view class="label">
        <text>身高</text>
      </view>
      <view
        class="input-box u-flex u-row-between u-col-bottom"
        @click="handelInput('height')"
      >
        <view class="input" placeholder="请输入">
          {{ height }}
        </view>
        <text class="unit">
          cm
        </text>
      </view>
    </view>
    <view class="height-weight-content-right">
      <view class="label">
        <text>体重</text>
      </view>
      <view
        class="input-box u-flex u-row-between u-col-bottom"
        @click="handelInput('weight')"
      >
        <view class="input" placeholder="请输入">
          {{ weight }}
        </view>
        <text class="unit">
          kg
        </text>
      </view>
    </view>
    <!-- 键盘 -->
    <u-keyboard
      ref="uKeyboard"
      v-model="showKeyboard"
      :show-tips="false"
      :cancel-btn="false"
      safe-area-inset-bottom
      z-index="9"
      :mask="false"
      mode="number"
      @change="keyChange"
      @backspace="backspace"
      @confirm="sendParent"
    />
  </view>
</template>

<script>
export default {
  name: 'HeightWeight',
  props: {
    compInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      height: '',
      weight: '',
      inputType: '',
      rules: {
        valid: true,
        message: ''
      },
      showKeyboard: false
    };
  },
  watch: {
    showKeyboard: {
      handler(newvale) {
        if (newvale === false) {
          const { valid, message } = this.validateCurrentFile(
            this.inputType,
            this[this.inputType]
          );
          if (!valid) {
            this[this.inputType] = '';
            uni.showToast({
              title: message,
              icon: 'none',
              mask: true
            });
          }
          // 向父级发送组件状态展示相关内容
          this.sendParent();
        }
      }
    },
    compInfo: {
      deep: true,
      immediate: true,
      handler(newval) {
        if (newval.fitnessData) {
          const varr = newval.fitnessData.split('/');
          if (varr.length > 1) {
            this.height = varr[0].split('.')[0];
            this.weight = varr[1];
          }
        }
      }
    }
  },
  methods: {
    clear() {
      this.height = '';
      this.weight = '';
    },
    handelInput(type) {
      this.showKeyboard = true;
      this.inputType = type;
    },
    // 获取成绩
    calculationResult(sex = this.compInfo.gender) {
      const result = {
        level: -1,
        score: 0,
        bmi: 0
      };
      const { height, weight } = this;
      const bmi = weight / (height / 100) ** 2;

      result.bmi = bmi.toFixed(2);
      if (sex === 1) {
        // 男
        if (bmi >= 17.9 && bmi <= 23.9) {
          result.score = 100;
          result.level = 1; // 优秀
        }
        if ((bmi >= 24.0 && bmi <= 27.9) || bmi <= 17.8) {
          result.score = 80;
          result.level = 3; // 良好
        }
        if (bmi >= 28.0) {
          result.score = 60;
          result.level = 2; // 及格
        }
      }
      if (sex === 2) {
        // 女
        if (bmi >= 17.2 && bmi <= 23.9) {
          result.score = 100;
          result.level = 1; // 优秀
        }
        if ((bmi >= 24.0 && bmi <= 27.9) || bmi <= 17.1) {
          result.score = 80;
          result.level = 3; // 良好
        }
        if (bmi >= 28.0) {
          result.score = 60;
          result.level = 2; // 及格
        }
      }
      return result;
    },
    // 当前组件验证，仅当前组件使用
    validateCurrentFile(type, value) {
      // 身高
      if (type === 'height') {
        // if (!this.rules.valid) return;
        this.rules.valid = value >= 80 && value <= 250;
        this.rules.message = value
          ? this.rules.valid
            ? ''
            : '身高范围请输入80至250范围的数值'
          : '请输入身高值';
      }
      // 体重
      if (type === 'weight') {
        // if (!this.rules.valid) return;
        this.rules.valid = value >= 14 && value <= 200;
        this.rules.message = value
          ? this.rules.valid
            ? ''
            : '体重范围请输入14至200范围的数值'
          : '请输入体重值';
      }
      return this.rules;
    },

    // 整个表单验证，暴露给外部组件使用
    validate(cb) {
      const query = {
        ...this.rules,
        data: {
          height: this.height,
          weight: this.weight
        }
      };
      return new Promise(resolve => {
        typeof cb === 'function' && cb(query);
        resolve(query);
      });
    },
    // 向父级传递状态
    sendParent() {
      let result = {
        isLevel: false, // 必须正确输入了，身高和体重
        message: '',
        level: -1, // 等级
        disabled: false, // 按钮是否disabled
        score: 0
      };
      if (!this.height && !this.weight) {
        result.isLevel = false;
        result.message = '请输入身高体重';
        result.disabled = true;
      }
      if (this.height && !this.weight) {
        result.isLevel = false;
        result.message = '请输入体重';
        result.disabled = true;
      }
      if (!this.height && this.weight) {
        result.isLevel = false;
        result.message = '请输入身高';
        result.disabled = true;
      }
      if (this.height && this.weight) {
        result.isLevel = true;
        result = Object.assign({}, result, this.calculationResult());
      }
      this.$emit('on-change', result);
    },
    // input 输入
    keyChange(value) {
      if (!value && value !== 0) return;
      // 身高是整数，体重保留一位小数
      if (this.inputType === 'height') {
        if (value === '.') {
          uni.showToast({
            title: '请输入整数',
            icon: 'none'
          });
          return;
        }
      }
      if (this.inputType === 'weight') {
        // 只能保留一位小数
        const oldVal = this[this.inputType] + value;
        const ens = oldVal.split('.')[1];
        if (ens && ens.length > 1) {
          uni.showToast({
            title: '只能保留一位小数',
            icon: 'none',
            mask: true
          });
          return;
        }
      }
      this[this.inputType] = this[this.inputType] + value;
    },

    // 键盘清除
    backspace() {
      if (!this[this.inputType]) return;
      this[this.inputType] = this[this.inputType].slice(0, -1);
    }
  }
};
</script>

<style scoped lang="scss">
.height-weight-content {
  height: 170rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  &-left {
    width: 296rpx;
    box-sizing: border-box;
    padding: 32rpx 0;
    border-bottom: 1px solid #f0f0f0;
  }
  &-right {
    width: 296rpx;
    box-sizing: border-box;
    padding: 32rpx 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .label {
    font-size: 28rpx;
    color: $u-content-color;
  }
  .input-box {
    margin-top: 30rpx;
    box-sizing: border-box;
    padding-right: 32rpx;
    .input {
      font-size: 36rpx;
      width: 200rpx;
      overflow-x: scroll;
      color: $u-main-color;
      &:empty:before {
        font-size: 36rpx;
        content: attr(placeholder);
        color: $u-tips-color;
      }
    }
    .unit {
      font-size: 36rpx;
      color: $u-main-color;
    }
  }
  ::v-deep .u-drawer__scroll-view {
    box-shadow: 0 10rpx 20rpx 5rpx rgba(0, 0, 0, 0.17);
  }
}
</style>
