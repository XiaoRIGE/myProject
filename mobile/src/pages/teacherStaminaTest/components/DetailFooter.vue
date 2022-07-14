<template>
  <view v-bind="$attrs">
    <template v-if="lastStudent">
      <view class="btn-no">
        <u-button
          :disabled="disabled"
          :hair-line="false"
          :custom-style="{
            ...baseBtnStyle,
            ...{ width: 'auto' },
            backgroundColor: bgColor
          }"
          @click="saveNext(false)"
        >
          保存
        </u-button>
      </view>
    </template>
    <template v-if="!lastStudent">
      <view class="horn-container">
        <view class="content u-flex u-row-center">
          <image
            class="horn"
            src="~@/static/img/student-stamina-horn.png"
            mode="scaleToFill"
          />
          <view class="tps">
            下一个
            <text>
              {{ nextStudent.realName || '' }}({{
                nextStudent.organizationUserNumber || ''
              }})
            </text>
          </view>
        </view>
      </view>
      <view class="btns u-flex">
        <u-button
          class="save-btn"
          :hair-line="false"
          :ripple="true"
          :disabled="disabled"
          :custom-style="{
            ...baseBtnStyle,
            backgroundColor: '#F5F6FA',
            color: btnColor
          }"
          @click="saveNext(false)"
        >
          仅保存
        </u-button>
        <u-button
          :disabled="disabled"
          :custom-style="{ ...baseBtnStyle, backgroundColor: bgColor }"
          @click="saveNext(true)"
        >
          保存,录入下一个
        </u-button>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'DetailFooter',
  props: {
    lastStudent: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    nextStudent: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseBtnStyle: {
        // 按钮公共样式
        width: '328rpx',
        height: '92rpx',
        fontSize: '32rpx',
        borderRadius: '24rpx',
        fontWeight: 600,
        color: '#fff'
      }
    };
  },
  computed: {
    bgColor() {
      return this.disabled ? 'rgba(252, 108, 55, .5)' : 'rgba(252, 108, 55, 1)';
    },
    btnColor() {
      return this.disabled ? 'rgba(84,82,102,.5)' : 'rgba(84,82,102,1)';
    }
  },
  methods: {
    saveNext(data) {
      this.$emit('on-save', data);
    }
  }
};
</script>

<style scoped lang="scss">
.btn-no {
  width: 750rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
}
.u-btn--bold-border {
  border: none;
}

.horn-container {
  margin-bottom: 56rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  .content {
    background-image: url(~@/static/img/student-stamina-tz-bg.png);
    background-size: 686rpx 88rpx;
    width: 686rpx;
    height: 88rpx;
    .horn {
      position: relative;
      bottom: 20rpx;
      width: 88rpx;
      height: 88rpx;
    }
    .tps {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #172b4c;
      text {
        font-size: 28rpx;
        font-weight: bold;
        color: #172b4c;
      }
    }
  }
}
</style>
