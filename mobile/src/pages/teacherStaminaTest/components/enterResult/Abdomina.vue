<template>
  <view class="long-jump-content u-flex u-row-between">
    <view class="long-jump-content-left">
      <view class="label">
        <text>成绩录入</text>
      </view>
      <view
        class="input-box u-flex u-row-between u-col-bottom"
        @click="handelInput"
      >
        <view class="input" placeholder="请输入">
          {{ value }}
        </view>
        <text class="unit">
          个
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
// 引体向上和仰卧起坐
import { abdomina } from './section';
export default {
  name: 'Abdomina',
  props: {
    type: {
      type: String,
      default: ''
    },
    compInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
        if (newval.fitnessData >= 0 && newval.fitnessData !== null) {
          this.value = newval.fitnessData.toString();
        }
      }
    }
  },
  methods: {
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
      const value = Number(this.value);
      if (sex === 1) {
        // 男
        // 等级
        const levelSectionsMan = abdomina['levelSectionsMan'][grade];
        // 分数区间
        const scoreSections = abdomina['scoreSectionsMan'][grade];
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
        const levelSectionsWoman = abdomina['levelSectionsWoman'][grade];
        // 分数区间
        const scoreSections = abdomina['scoreSectionsWoman'][grade];

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
      this.rules.valid = value >= 0 && value <= 99;
      this.rules.message = value
        ? this.rules.valid
          ? ''
          : '请输入0至99范围的数值'
        : '请输入';
      return this.rules;
    },
    clear() {
      this.value = '';
    },
    // 整个表单验证，暴露给外部组件使用
    validate(cb) {
      const query = {
        ...this.rules,
        data: {}
      };
      if (this.type === 't7') {
        // 引体向上
        query.data.pullUp = this.value;
      } else if (this.type === 't9') {
        // 仰卧起坐
        query.data.sitUp = this.value;
      }

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
      // 只能是整数
      if (value === '.') return;
      this.value = this.value + value;
    },

    // 键盘清除
    backspace() {
      if (!this.value) return;
      this.value = this.value.slice(0, -1);
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
}
</style>
