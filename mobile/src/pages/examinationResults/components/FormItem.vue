<template>
  <view
    :style="{ height: firmHeight + 'rpx' }"
    :class="[{ 'bottom-border': borderBottom }]"
    class="form-item-content"
  >
    <view class="from-item-row u-flex u-row-between">
      <view class="from-item-row-left">
        <text class="title">
          {{ target.title }}
        </text>
      </view>
      <view v-if="inputType !== 'textarea'" class="from-item-row-right">
        <template v-if="disabled">
          <!-- 不可编辑 -->
          <text class="disabled-text">
            {{ comValue === 0 ? '0' : comValue ? comValue : '-' }}
          </text>
        </template>
        <template v-if="!disabled">
          <!-- 不可编辑,展示输入框 -->
          <!-- 失去焦点展示文本框，获取焦点展示input输入框 -->
          <view class="input-content">
            <view v-if="inputState === 'text'" @click="changeInput">
              <input
                class="u-text-right input"
                :placeholder="placeholder"
                :value="comValue"
                type="text"
                placeholder-style="color:#999;font-size: 32rpx;font-weight:400"
                disabled
              />
            </view>
            <input
              v-if="inputState === 'input'"
              class="u-text-right input"
              type="digit"
              :auto-blur="true"
              :value="value"
              :focus="inputFocus"
              placeholder-style="color:#999;font-size: 32rpx;font-weight:400"
              :placeholder="placeholder"
              @input="input"
              @focus="focus"
              @blur="blur"
              @confirm="confirm"
            />
          </view>
        </template>
      </view>
    </view>
    <view v-if="!hiddenProportion" class="from-item-row u-flex u-row-between">
      <view class="from-item-row-left u-flex-1">
        <template v-if="inputType !== 'textarea' && !hiddenProportion">
          <text class="sub-tps">占总分{{ target.proportion }}%</text>
        </template>
        <template v-if="inputType === 'textarea'">
          <textarea
            v-if="!disabled"
            class="textarea u-flex-1"
            :value="value"
            placeholder-style="color:#999;font-size: 32rpx;font-weight:400"
            :placeholder="placeholder"
            @confirm="confirm"
            @blur="blur"
            @focus="focus"
            @input="input"
          />
          <textarea
            v-if="disabled"
            disabled
            placeholder-style="color:#999;font-size: 32rpx;font-weight:400"
            class="textarea u-flex-1"
            :value="value"
            placeholder="暂无备注..."
          />
        </template>
      </view>
      <view v-if="inputType !== 'textarea'" class="from-item-row-right">
        <text v-if="showScore && !error" class="score">
          {{ target.score }}分
        </text>
        <text v-if="error" class="err-tps">
          {{ errorTps }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatTime } from './../common';
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    target: {
      type: Object,
      default: () => Object.create(null)
    },
    showScore: {
      type: Boolean,
      default: true
    },
    hiddenProportion: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: 'number'
    },
    borderBottom: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 68 * 2
    },
    disabled: {
      //是否可编辑
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    prop: {
      // 值对应的key值
      type: String,
      default: 'value'
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: '', // input输入框绑定值
      comValue: '', // 需要展示的value值
      submitValue: '', // 提交给后台的值
      error: false,
      inputFocus: false,
      inputState: 'text', // text input
      errorTps: ''
    };
  },
  computed: {
    firmHeight() {
      if (this.inputType === 'textarea' || this.hiddenProportion) return 'auto';
      return this.height;
    }
  },
  watch: {
    target: {
      immediate: true,
      deep: true,
      handler(nval, oldval) {
        if (nval && JSON.stringify(nval) !== JSON.stringify(oldval)) {
          if (this.type === 'time') {
            const { rule, format, rateFormat } = formatTime.timeStampToTime(
              nval[this.prop]
            );
            if (rule && nval[this.prop] !== '') {
              this.value = rateFormat;
              this.comValue = format;
              this.submitValue = nval[this.prop];
            }
          } else {
            this.value = nval[this.prop];
            this.comValue = nval[this.prop];
            this.submitValue = nval[this.prop];
          }
        }
      }
    }
  },
  methods: {
    changeInput() {
      if (this.disabled) return;
      this.inputState = 'input';
      this.inputFocus = true;
    },
    emitBlur(data) {
      // data value error target
      this.$emit('blur', data);
    },
    sendVal(value) {
      if (value.trim() === '') return '';
      return this.inputType === 'number' ? Number(value) : value;
    },
    input(event) {
      this.$emit('input', this.sendVal(event.detail.value));
    },
    focus(event) {
      this.$emit('focus', this.sendVal(event.detail.value));
    },
    verification(value) {
      // 验证输入是否正确 理论考试：0++.00 考勤：0++ .00 附加分：0-100.00, 备注：不限
      // 判断 数值
      if (this.type === 'time') {
        // 如果是时间，就需要验证输入格式
        this.validateForm(value, this.verificationTime);
      } else {
        this.validateForm(value);
      }
    },
    validate(cb) {
      return new Promise((resolve, reject) => {
        try {
          this.verification(this.value);
          if (typeof cb === 'function') {
            cb(!this.error, this.target, this.errorTps);
          }
          resolve(!this.error, this.target, this.errorTps);
        } catch (err) {
          reject(err);
        }
      });
    },
    blur(event) {
      this.inputState = 'text';
      const value = this.sendVal(event.detail.value);
      // 验证
      this.verification(value);
      // 提交数据
      this.emitBlur({
        value: this.submitValue,
        rule: !this.error,
        data: this.target
      });
    },
    confirm(event) {
      this.$emit('confirm', this.sendVal(event.detail.value));
    },
    verificationTime(value) {
      // 时间验证
      const { rule, error, timeStamp, format } = formatTime.formatTimeNumber(
        value,
        false
      );
      if (rule) {
        this.submitValue = timeStamp;
        this.error = false;
        this.comValue = format;
      } else {
        this.error = true;
        this.errorTps = error;
        this.comValue = value;
      }
      this.value = value;
    },

    validateForm(value, fn) {
      const setVal = (value) => {
        this.comValue = value;
        this.value = value;
        this.submitValue = value;
      };
      if (this.rules.length > 0) {
        for (let i = 0; i < this.rules.length; i++) {
          const {
            max = Infinity,
            min = -Infinity,
            required = false,
            isInteger = false,
            decimal = 0,
            message,
            validator
          } = this.rules[i];
          // 修复允许值为null的情况
          if (!required && (value === '' || value === null)) {
            this.error = false;
            this.errorTps = '';
            break;
          }
          if (required && value === '') {
            this.error = true;
            this.errorTps = message;
            break;
          }
          if (this.inputType === 'number') {
            if (value > max || value < min) {
              this.error = true;
              this.errorTps = message;
              break;
            }
          }
          if (this.inputType === 'text' || this.inputType === 'textarea') {
            if (value.length > max || value.length < min) {
              this.error = true;
              this.errorTps = message;
              break;
            }
          }
          if (isInteger) {
            if (!Number.isInteger(value)) {
              this.error = true;
              this.errorTps = message;
              break;
            }
          }
          if (!isInteger && decimal > 0 && !Number.isInteger(value)) {
            // 保留小数位数
            let vStr = String(value).split('.');
            if (vStr[1]) {
              vStr = vStr[1];
              if (vStr.length > decimal) {
                this.error = true;
                this.errorTps = message;
                break;
              }
            }
          }
          if (typeof validator === 'function') {
            const v1 = validator(this.rules[i]);
            if (!v1) {
              this.error = true;
              this.errorTps = message;
              break;
            }
          }
          this.error = false;
          this.errorTps = '';
          if (typeof fn === 'function' && !this.error) fn(value);
        }
        if (!fn) setVal(value);
      } else {
        if (typeof fn === 'function') fn(value);
        else setVal(value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item-content {
  box-sizing: border-box;
  padding: 26rpx 32rpx;
  .from-item-row {
    min-height: 48rpx;
    &-left {
      .title {
        font-size: 32rpx;
        font-weight: 400;
        color: $u-main-color;
      }
      .sub-tps {
        font-size: 24rpx;
        color: $u-content-color;
      }
      .textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 13rpx 0;
        max-height: 120rpx;
      }
    }
    &-right {
      text-align: right;
      .input-content {
        width: 240rpx;
        height: 100%;
        .input {
          margin: 0;
          padding: 0;
          width: 240rpx;
          min-height: 40rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: $u-main-color;
          overflow: hidden;
        }
      }
      .disabled-text {
        font-size: 32rpx;
        font-weight: 500;
        color: $uni-text-color-grey;
      }
      .score {
        font-size: 24rpx;
        color: $u-content-color;
      }
      .err-tps {
        font-size: 24rpx;
        font-weight: 400;
        color: #ff6767;
      }
    }
    .textarea {
      font-size: 32rpx;
      color: $uni-text-color-grey;
      width: 100%;
      max-height: 110rpx;
      margin-top: 20rpx;
    }
  }
}
.bottom-border {
  border-bottom: 0.5px solid #e8e8e8;
}
</style>
