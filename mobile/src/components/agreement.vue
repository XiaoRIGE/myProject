<template>
  <view class="agreement u-flex u-row-center">
    <u-checkbox
      v-model="checked"
      shape="circle"
      icon-size="26rpx"
      label-size="24rpx"
      active-color="#4ABA5D"
      @change="changeChecked"
    >
      同意
    </u-checkbox>
    <navigator
      url="/pages/webView/index?url=http://47.108.225.20/app/v1/index.html&title=用户服务协议"
      open-type="navigate"
      hover-class="none"
    >
      <text class="color-blue">
        《用户服务协议》
      </text>
    </navigator>

    与
    <navigator
      url="/pages/webView/index?url=http://47.108.225.20/app/v1/privacy.html&title=隐私政策"
      open-type="navigate"
      hover-class="navigator-hover"
    >
      <text class="color-blue">
        《隐私政策》
      </text>
    </navigator>
  </view>
</template>

<script>
export default {
  name: 'Agreement',
  data() {
    return {
      checked: false
    };
  },
  methods: {
    changeChecked() {
      this.checked = !this.checked;
      this.$emit('changeCheckedHandle', this.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
.agreement {
  width: 100%;
  text-align: center;
  color: #a2a5aa;
  font-size: 24rpx;
  color: rgba(162, 165, 170, 1);
  margin: 34rpx auto 0;
  .color-blue {
    color: #576b95;
    font-weight: bold;
  }
  ::v-deep .u-checkbox__label {
    margin-right: 0;
  }
}
</style>
