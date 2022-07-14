<template>
  <view class="long-jump-content u-flex u-row-between">
    <view class="long-jump-content-left">
      <view class="label">
        <text>成绩录入(点击“+”可切换正负)</text>
      </view>
      <view class="input-box u-flex u-row-between u-col-bottom">
        <view class="u-flex">
          <view
            class="icon-symbol"
            :class="{
              'just-icon': inputType === 1,
              negative: inputType === -1
            }"
            @click="changeInptType"
          />
          <view class="input" placeholder="请输入" @click="handelInput">
            {{ value }}
          </view>
        </view>

        <text class="unit">
          cm
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
import { sittingFlexion } from './section';
export default {
  name: 'SittingFlexion',
  props: {
    compInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      inputType: 1,
      value: '', // 输入值
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
          const { valid, message } = this.validateCurrentFile(this.value);
          if (!valid) {
            this.value = '';
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
          if (newval.fitnessData < 0) {
            this.inputType = -1;
          }
          if (newval.fitnessData >= 0) {
            this.inputType = 1;
          }
          this.value = Math.abs(newval.fitnessData);
        }
      }
    }
  },
  methods: {
    changeInptType() {
      // 正负切换
      // 取相反数 判断值是否在-30 - 40 范围内，是则切换，否则不能切换
      const value = this.value * this.inputType * -1;
      if (value >= -30 && value <= 40) {
        this.inputType = this.inputType === 1 ? -1 : 1;
        this.sendParent();
      } else {
        uni.showToast({
          title: '请输入-30至40范围的数值',
          icon: 'none',
          mask: true
        });
      }
    },
    handelInput() {
      this.showKeyboard = true;
    },
    // 获取成绩
    calculationResult() {
      // grade: 1 //表示大一大二， grade：表示大三大四
      const sex = this.compInfo.gender;
      const gradeAll = this.compInfo.inputYear - this.compInfo.year + 1;
      const grade = (() => {
        if (gradeAll === 1 || gradeAll === 2) return 1;
        if (gradeAll === 3 || gradeAll === 4) return 2;
      })();
      const result = {
        level: -1,
        score: 0,
        bmi: 0
      };
      const value = Number(this.value) * this.inputType;
      if (sex === 1) {
        // 男
        // 等级
        const levelSectionsMan = sittingFlexion['levelSectionsMan'][grade];
        // 分数区间
        const scoreSections = sittingFlexion['scoreSectionsMan'][grade];
        for (let i = 0; i < levelSectionsMan.length; i++) {
          const { start, end, level } = levelSectionsMan[i];
          if (value >= start && value < end) {
            result.level = level;
            break;
          }
        }

        // 大一大二
        for (let i = 0; i < scoreSections.length; i++) {
          const { start, end, score } = scoreSections[i];
          if (value >= start && value < end) {
            result.score = score;
            break;
          }
        }
      }
      if (sex === 2) {
        // 女
        // 等级
        const levelSectionsWoman = sittingFlexion['levelSectionsWoman'][grade];
        // 分数区间
        const scoreSections = sittingFlexion['scoreSectionsWoman'][grade];
        for (let i = 0; i < levelSectionsWoman.length; i++) {
          const { start, end, level } = levelSectionsWoman[i];
          if (value >= start && value < end) {
            result.level = level;
            break;
          }
        }

        // 大一大二
        for (let i = 0; i < scoreSections.length; i++) {
          const { start, end, score } = scoreSections[i];
          if (value >= start && value < end) {
            result.score = score;
            break;
          }
        }
      }
      return result;
    },
    // 当前组件验证，仅当前组件使用
    validateCurrentFile(value) {
      // 范围
      this.rules.valid = value * this.inputType >= -30 && value <= 40;
      this.rules.message = value
        ? this.rules.valid
          ? ''
          : '请输入-30至40范围的数值'
        : '请输入';
      return this.rules;
    },
    clear() {
      this.value = '';
      this.inputType = 1;
    },
    // 整个表单验证，暴露给外部组件使用
    validate(cb) {
      const query = {
        ...this.rules,
        data: {
          sitAndReach: this.value * this.inputType
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
      if (!this.value) {
        result.isLevel = false;
        result.message = '请输入范围值';
        result.disabled = true;
      }
      if (this.value) {
        result.isLevel = true;
        result = Object.assign({}, result, this.calculationResult());
        result.disabled = !this.rules.valid;
      }
      this.$emit('on-change', result);
    },
    // input 输入
    keyChange(value) {
      if (!value && value !== 0) return;
      // 小数点只能保留一位
      const newVal = this.value.toString() + value;
      if (newVal && newVal.split('.').length > 0) {
        if (newVal.split('.')[1] && newVal.split('.')[1].length > 1) {
          uni.showToast({
            title: '小数点只能保留1位小数',
            icon: 'none',
            mask: true
          });
          return;
        }
      }
      this.value = this.value.toString() + value;
    },

    // 键盘清除
    backspace() {
      if (!this.value) return;
      this.value = this.value.toString().slice(0, -1);
    }
  }
};
</script>

<style scoped lang="scss">
.long-jump-content {
  height: 170rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  &-left {
    width: 100%;
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
  .icon-symbol {
    position: relative;
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    background-color: #2b2d33;
    border-radius: 6rpx;
  }
  .just-icon {
    &::after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      right: 0;
      display: block;
      content: '';
      width: 25rpx;
      height: 5rpx;
      z-index: 9;
      border-radius: 10rpx;
      background-color: #fff;
    }
    &::before {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      right: 0;
      display: block;
      content: '';
      width: 5rpx;
      height: 25rpx;
      z-index: 9;
      border-radius: 10rpx;
      background-color: #fff;
    }
  }
  .negative {
    &::after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      right: 0;
      display: block;
      content: '';
      width: 25rpx;
      height: 5rpx;
      z-index: 9;
      border-radius: 10rpx;
      background-color: #fff;
    }
  }
}
</style>
