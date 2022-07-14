<template>
  <view class="screen-container">
    <!-- 通用样式 -->
    <template v-if="type === 'currency'">
      <g-dropdown title-size="32rpx" active-color="#fc6c37">
        <g-dropdown-item
          v-model="testValue"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="testTitle"
          :options="testOptions"
          @change="change"
        />
        <g-dropdown-item
          v-model="sexValue"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="sexTitle"
          :options="sexOptions"
          @change="change"
        />
      </g-dropdown>
    </template>
    <!-- 性别页面过来样式 -->
    <template v-if="type === 'sex'">
      <view class="list-row u-flex u-row-between">
        <view
          v-for="item in testOptions"
          :key="item.value"
          class="item"
          :class="{ active: testValue === item.value }"
          @click="handelClick(item)"
        >
          {{ item.label }}
        </view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '' //'currency sex'
    }
  },
  data() {
    return {
      testValue: -1,
      sexValue: 0,
      testOptions: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '未测试',
          value: 0
        },
        {
          label: '已测试',
          value: 1
        }
      ],
      sexOptions: [
        {
          label: '全部性别',
          value: 0
        },
        {
          label: '男生',
          value: 1
        },
        {
          label: '女生',
          value: 2
        }
      ]
    };
  },
  computed: {
    testTitle() {
      return (
        this.testOptions.find(item => item.value === this.testValue) || {}
      ).label;
    },
    sexTitle() {
      return (this.sexOptions.find(item => item.value === this.sexValue) || {})
        .label;
    }
  },
  methods: {
    change() {
      this.$emit('change', { test: this.testValue, sex: this.sexValue });
    },
    handelClick({ value }) {
      if (this.testValue === value) return;
      this.testValue = value;
      this.$emit('change', { test: value, sex: 0 });
    }
  }
};
</script>
<style scoped lang="scss">
.screen-container {
  background-color: #fff;
  height: 88rpx;
  ::v-deep .uicon-checkbox-mark:before {
    color: $uni-color-primary;
  }
  .list-row {
    height: 100%;
    box-sizing: border-box;
    padding: 0 62rpx;
    .item {
      position: relative;
      text-align: center;
      width: 128rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: $u-content-color;
    }
    .active {
      font-weight: bold;
      color: $uni-color-primary;
      &::after {
        position: absolute;
        left: 50%;
        bottom: -20rpx;
        transform: translateX(-50%);
        display: block;
        content: '';
        width: 40rpx;
        height: 6rpx;
        background-color: $u-type-primary;
        border-radius: 4rpx;
      }
    }
  }
}
</style>
