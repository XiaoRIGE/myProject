<template>
  <view class="vision-content">
    <view class="vision-content-row u-flex">
      <view class="vision-content-row-header u-flex">
        <view class="vision-content-row-item">
          <text class="label">
            左眼
          </text>
        </view>
        <view class="vision-content-row-item">
          <text class="label">
            屈光不正
          </text>
        </view>
        <view class="vision-content-row-item">
          <text class="label">
            串镜
          </text>
        </view>
      </view>
      <view class="u-flex">
        <view
          class="vision-content-row-item input vision-content-row-item-content"
          placeholder="请输入"
          @click="handelInput('leftVisionValue')"
        >
          {{ leftVisionValue }}
        </view>
        <view
          class="vision-content-row-item vision-content-row-item-content u-flex"
          @click="showSelectModel('showLeftRefraction', 'leftRefractionValue')"
        >
          <view placeholder="请选择" class="value">
            {{ leftRefractionLabel }}
          </view>

          <u-icon name="arrow-down-fill" size="24" color="#C9CDD6" />
        </view>
        <view
          class="vision-content-row-item vision-content-row-item-content u-flex"
          @click="showSelectModel('showLeftMirror', 'leftMirrorValue')"
        >
          <view placeholder="请选择" class="value">
            {{ leftMirrorLabel }}
          </view>
          <u-icon name="arrow-down-fill" size="24" color="#C9CDD6" />
        </view>
      </view>
    </view>
    <view class="vision-content-row u-flex">
      <view class="vision-content-row-header u-flex">
        <view class="vision-content-row-item">
          <text class="label">
            右眼
          </text>
        </view>
        <view class="vision-content-row-item">
          <text class="label">
            屈光不正
          </text>
        </view>
        <view class="vision-content-row-item">
          <text class="label">
            串镜
          </text>
        </view>
      </view>
      <view class="u-flex">
        <view
          class="vision-content-row-item input vision-content-row-item-content"
          placeholder="请输入"
          @click="handelInput('rightVisionValue')"
        >
          {{ rightVisionValue }}
        </view>
        <view
          class="vision-content-row-item vision-content-row-item-content u-flex"
          @click="
            showSelectModel('showRightRefraction', 'rightRefractionValue')
          "
        >
          <view placeholder="请选择" class="value">
            {{ rightRefractionLabel }}
          </view>
          <u-icon name="arrow-down-fill" size="24" color="#C9CDD6" />
        </view>
        <view
          class="vision-content-row-item vision-content-row-item-content u-flex"
          @click="showSelectModel('showRightMirror', 'rightMirrorValue')"
        >
          <view placeholder="请选择" class="value">
            {{ rightMirrorLabel }}
          </view>
          <u-icon name="arrow-down-fill" size="24" color="#C9CDD6" />
        </view>
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
    <!-- 左眼屈光不正选项 -->
    <u-select
      v-model="showLeftRefraction"
      confirm-color="#FC6C37"
      :list="refractionList.left"
      safe-area-inset-bottom
      @confirm="onChange"
    />
    <!-- 右眼屈光不正选项 -->
    <u-select
      v-model="showRightRefraction"
      confirm-color="#FC6C37"
      :list="refractionList.right"
      safe-area-inset-bottom
      @confirm="onChange"
    />
    <!-- 左眼串镜选项 -->
    <u-select
      v-model="showLeftMirror"
      confirm-color="#FC6C37"
      :list="mirrorList.left"
      safe-area-inset-bottom
      @confirm="onChange"
    />
    <!-- 右眼串镜选项 -->
    <u-select
      v-model="showRightMirror"
      confirm-color="#FC6C37"
      :list="mirrorList.right"
      safe-area-inset-bottom
      @confirm="onChange"
    />
  </view>
</template>

<script>
const refractionList = [
  // 屈光不正列表
  { value: '0', label: '正常' },
  { value: 1, label: '近视' },
  { value: 2, label: '远视' },
  { value: 3, label: '其它' },
  { value: 9, label: '未测' }
];
const mirrorList = [
  // 串镜列表
  { value: '0', label: '正常' },
  { value: -1, label: '正下负上' },
  { value: 1, label: '正上负下' },
  { value: 2, label: '其它' },
  { value: 9, label: '未测' }
];
export default {
  name: 'Vision',
  props: {
    compInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showKeyboard: false,
      inputVal: '',
      leftVisionValue: '', // 左眼视力
      rightVisionValue: '', // 右眼视力
      refractionList: {
        left: refractionList,
        right: refractionList
      },
      mirrorList: {
        left: mirrorList,
        right: mirrorList
      },
      modelType: '', // 当前打开的那个下拉框
      showLeftRefraction: false, // 左眼屈光不正弹窗
      leftRefractionValue: '',

      showRightRefraction: false, // 右眼屈光不正弹窗
      rightRefractionValue: '',

      showLeftMirror: false, // 左眼串镜弹窗
      leftMirrorValue: '',

      showRightMirror: false, // 右眼串镜弹窗
      rightMirrorValue: '',
      rules: {
        valid: true,
        message: ''
      }
    };
  },
  computed: {
    leftRefractionLabel() {
      if (!this.leftRefractionValue) return '';
      return refractionList.find(
        item => this.leftRefractionValue === item.value
      ).label;
    },
    leftMirrorLabel() {
      if (!this.leftMirrorValue) return '';
      return mirrorList.find(item => item.value === this.leftMirrorValue).label;
    },
    rightRefractionLabel() {
      if (!this.rightRefractionValue) return '';
      return refractionList.find(
        item => this.rightRefractionValue === item.value
      ).label;
    },
    rightMirrorLabel() {
      if (!this.rightMirrorValue) return '';
      return mirrorList.find(item => item.value === this.rightMirrorValue)
        .label;
    }
  },
  watch: {
    showKeyboard: {
      handler(newvale) {
        if (newvale === false) {
          const { valid, message } = this.validateCurrentFile(
            this[this.inputVal]
          );
          if (valid) this.initSelect();
          if (!valid) {
            this[this.inputVal] = '';
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
        if (newval) {
          const {
            leftEyeVision,
            rightEyeVision,
            leftEyeAmetropia,
            rightEyeAmetropia,
            leftEyeStrandMirror,
            rightEyeStrandMirror
          } = newval;
          if (!leftEyeVision && leftEyeVision !== 0) {
            this.leftVisionValue = '';
          } else if (typeof leftEyeVision === 'number') {
            this.leftVisionValue = leftEyeVision.toString();
          } else {
            this.leftVisionValue = leftEyeVision || '';
          }
          if (!rightEyeVision && rightEyeVision !== 0) {
            this.rightVisionValue = '';
          } else if (typeof rightEyeVision === 'number') {
            this.rightVisionValue = rightEyeVision.toString();
          } else {
            this.rightVisionValue = rightEyeVision || '';
          }
          // 屈光不正
          this.leftRefractionValue =
            leftEyeAmetropia === 0
              ? leftEyeAmetropia.toString()
              : leftEyeAmetropia;
          this.rightRefractionValue =
            rightEyeAmetropia === 0
              ? rightEyeAmetropia.toString()
              : rightEyeAmetropia;
          // 串镜
          this.leftMirrorValue =
            leftEyeStrandMirror === 0
              ? leftEyeStrandMirror.toString()
              : leftEyeStrandMirror;
          this.rightMirrorValue =
            rightEyeStrandMirror === 0
              ? rightEyeStrandMirror.toString()
              : rightEyeStrandMirror;
        }
      }
    }
  },
  methods: {
    handelInput(query) {
      this.showKeyboard = true;
      this.inputVal = query;
    },
    // 当前组件验证，仅当前组件使用
    validateCurrentFile(value) {
      // 范围
      this.rules.valid = value >= 3.0 && value <= 5.3;
      this.rules.message = value
        ? this.rules.valid
          ? ''
          : '请输入3.0至5.3范围的数值'
        : '请输入';
      return this.rules;
    },
    // 显示下拉框
    showSelectModel(model, modelType) {
      this[model] = true;
      this.modelType = modelType;
    },
    // 下拉选择框触发事件
    onChange([data]) {
      if (!data) return;
      const { value } = data;
      this[this.modelType] = value;
      this.relationSele(this.modelType);
    },

    initSelect() {
      // 输入框输入值后校验下拉框的值是否在范围内
      if (this.inputVal === 'leftVisionValue') {
        if (!this.leftVisionValue) {
          this.refractionList.left = refractionList;
          this.mirrorList.left = mirrorList;
        }
        const leftVisionValue = Number(this.leftVisionValue);
        if (leftVisionValue < 5.0) {
          // 屈光不正->近视
          this.leftRefractionValue = 1;
          this.refractionList.left = refractionList.filter(
            ({ value }) => value !== '0'
          );
          // 串镜-> 未测-> 可选项：正↓负↑、正↑负↓、其他、未测，屏蔽不可选项
          this.leftMirrorValue = 9;
          this.mirrorList.left = mirrorList.filter(
            ({ value }) => value !== '0'
          );
        }
        if (leftVisionValue >= 5.0) {
          // 屈光不正->正常
          this.leftRefractionValue = '0';
          this.refractionList.left = refractionList.filter(
            ({ value }) => value === '0' || value === 9
          );
          // 串镜-> 未测-> 可选项：正↓负↑、正↑负↓、其他、未测，屏蔽不可选项
          this.leftMirrorValue = 9;
          this.mirrorList.left = mirrorList.filter(
            ({ value }) => value === '0' || value === 9
          );
        }
      }
      if (this.inputVal === 'rightVisionValue') {
        if (!this.rightVisionValue) {
          this.refractionList.right = refractionList;
          this.mirrorList.right = mirrorList;
        }
        const rightVisionValue = Number(this.rightVisionValue);
        if (rightVisionValue < 5.0) {
          // 屈光不正->近视
          this.rightRefractionValue = 1;
          this.refractionList.right = refractionList.filter(
            ({ value }) => value !== '0'
          );
          // 串镜-> 未测-> 可选项：正↓负↑、正↑负↓、其他、未测，屏蔽不可选项
          this.rightMirrorValue = 9;
          this.mirrorList.right = mirrorList.filter(
            ({ value }) => value !== '0'
          );
        }
        if (rightVisionValue >= 5.0) {
          // 屈光不正->正常
          this.rightRefractionValue = '0';
          this.refractionList.right = refractionList.filter(
            ({ value }) => value === '0' || value === 9
          );
          // 串镜-> 未测-> 可选项：正↓负↑、正↑负↓、其他、未测，屏蔽不可选项
          this.rightMirrorValue = 9;
          this.mirrorList.right = mirrorList.filter(
            ({ value }) => value === '0' || value === 9
          );
        }
      }
    },
    // 下拉选择框关联
    relationSele(modalType) {
      const value = this[modalType];
      if (modalType === 'leftRefractionValue') {
        // 左眼屈光不正，关联左眼串镜
        if (value === '0') {
          if (this.leftMirrorValue !== '0' || this.leftMirrorValue !== 9) {
            // 大于5
            this.leftMirrorValue = 9;
            // 串镜不能位正常
            this.mirrorList.left = mirrorList.filter(
              ({ value }) => value === '0' || value === 9
            );
          }
        } else if (value === 9 || value === '') {
          // 未测
          this.leftMirrorValue = 9;
          this.mirrorList.left = mirrorList;
        } else {
          // 小于 5.0
          if (this.leftMirrorValue === '0' || this.leftMirrorValue === '') {
            this.leftMirrorValue = 9;
          }

          this.mirrorList.left = mirrorList.filter(
            ({ value }) => value !== '0'
          );
        }
      }
      if (modalType === 'leftMirrorValue') {
        // 左眼串镜，关联左眼屈光不正
        if (value === '0') {
          // > 5.0
          if (this.leftRefractionValue !== '0') {
            this.leftRefractionValue = '0';
          }

          this.refractionList.left = refractionList.filter(
            ({ value }) => value === '0' || value === 9
          );
        } else if (value === '' || value === 9) {
          this.leftRefractionValue = 9;
          this.refractionList.left = refractionList;
        } else {
          // 小于5
          if (
            this.leftRefractionValue === '0' ||
            this.leftRefractionValue === ''
          ) {
            this.leftRefractionValue = -1;
          }

          this.refractionList.left = refractionList.filter(
            ({ value }) => value !== '0'
          );
        }
      }
      if (modalType === 'rightRefractionValue') {
        // 右眼屈光不正，关联左眼串镜
        if (value === '0') {
          if (this.rightMirrorValue !== '0' || this.rightMirrorValue !== 9) {
            // 大于5
            this.rightMirrorValue = 9;
            // 串镜不能位正常
            this.mirrorList.right = mirrorList.filter(
              ({ value }) => value === '0' || value === 9
            );
          }
        } else if (value === 9 || value === '') {
          // 未测
          this.rightMirrorValue = 9;
          this.mirrorList.right = mirrorList;
        } else {
          // 小于 5.0
          if (this.rightMirrorValue === '0' || this.rightMirrorValue === '') {
            this.rightMirrorValue = 9;
          }

          this.mirrorList.right = mirrorList.filter(
            ({ value }) => value !== '0'
          );
        }
      }
      if (modalType === 'rightMirrorValue') {
        // 右眼串镜，关联左眼屈光不正
        if (value === '0') {
          // > 5.0
          if (this.rightRefractionValue !== '0') {
            this.rightRefractionValue = '0';
          }

          this.refractionList.right = refractionList.filter(
            ({ value }) => value === '0' || value === 9
          );
        } else if (value === '' || value === 9) {
          this.rightRefractionValue = 9;
          this.refractionList.right = refractionList;
        } else {
          // 小于5
          if (
            this.rightRefractionValue === '0' ||
            this.rightRefractionValue === ''
          ) {
            this.rightRefractionValue = -1;
          }

          this.refractionList.right = refractionList.filter(
            ({ value }) => value !== '0'
          );
        }
      }
    },
    clear() {
      this.leftVisionValue = '';
      this.leftRefractionValue = '';
      this.leftMirrorValue = '';
      this.rightVisionValue = '';
      this.rightRefractionValue = '';
      this.rightMirrorValue = '';
    },
    // 整个表单验证，暴露给外部组件使用
    validate(cb) {
      const query = {
        ...this.rules,
        data: {
          leftEyeVision: this.leftVisionValue, // 左眼视力
          leftEyeAmetropia: this.leftRefractionValue, // 左眼屈光不正
          leftEyeStrandMirror: this.leftMirrorValue, // 左眼串镜
          rightEyeVision: this.rightVisionValue, // 右眼视力
          rightEyeAmetropia: this.rightRefractionValue, // 右眼屈光不正
          rightEyeStrandMirror: this.rightMirrorValue //右眼串镜
        }
      };
      return new Promise(resolve => {
        typeof cb === 'function' && cb(query);
        resolve(query);
      });
    },
    // 向父级传递状态
    sendParent() {
      const result = {
        isLevel: false, // 必须正确输入了，身高和体重
        message: '',
        level: -1, // 等级
        disabled: false, // 按钮是否disabled
        score: 0
      };
      const values = [
        'leftVisionValue',
        'rightVisionValue',
        'leftRefractionValue',
        'leftMirrorValue',
        'rightRefractionValue'
      ];
      values.map(item => {
        if (!this[item] && this[item] !== 0) {
          result.disabled = true;
        }
      });

      this.$emit('on-change', result);
    },
    // input 输入
    keyChange(value) {
      if (!value && value !== 0) return;
      // 只能保留一位小数
      let newVal = this[this.inputVal] + value;
      if (typeof newVal !== 'string') {
        newVal = newVal.toString();
      }
      if (newVal && newVal.split('.')) {
        if (newVal.split('.').length > 1 && newVal.split('.')[1].length > 1) {
          uni.showToast({
            title: '只能保留1位小数',
            icon: 'none',
            mask: true
          });
          return;
        }
      }
      this[this.inputVal] += value;
    },

    // 键盘清除
    backspace() {
      if (!this[this.inputVal]) return;
      this[this.inputVal] = this[this.inputVal].slice(0, -1);
    }
  }
};
</script>

<style scoped lang="scss">
.vision-content {
  &-row {
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    height: 170rpx;
    box-sizing: border-box;
    padding: 32rpx 0;
    border-bottom: 1px solid #f0f0f0;
    &-item {
      width: 250rpx;
      box-sizing: border-box;
      padding-left: 32rpx;
      &-content {
        font-size: 36rpx;
        color: $u-main-color;
        .value {
          min-width: 100rpx;
          &:empty:before {
            font-size: 32rpx;
            content: attr(placeholder);
            color: $u-tips-color;
          }
        }
      }
    }
  }
  .label {
    font-size: 28rpx;
    color: $u-content-color;
  }
  .input {
    font-size: 36rpx;
    overflow-x: scroll;
    color: $u-main-color;
    &:empty:before {
      font-size: 32rpx;
      content: attr(placeholder);
      color: $u-tips-color;
    }
  }
  ::v-deep .u-drawer__scroll-view {
    box-shadow: 0 10rpx 20rpx 5rpx rgba(0, 0, 0, 0.17);
  }
}
</style>
