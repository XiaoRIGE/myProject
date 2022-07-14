<template>
  <view class="change-bound-phone-page">
    <view class="change-bound-phone-page-header">
      <image
        class="change-bound-phone-page-header-back-icon"
        src="~@/static/img/left.svg"
        mode="scaleToFill"
        @click="onClickBackIcon"
      />
      <text class="change-bound-phone-page-header-text">
        修改绑定手机号
      </text>
    </view>
    <view class="change-bound-phone-page-body">
      <view class="change-bound-phone-page-body-input-group">
        <u-form
          ref="uForm"
          :model="form"
          label-width="28rpx"
          label-position="top"
          :error-type="errorType"
          :label-style="{ 'font-weight': '500' }"
        >
          <u-form-item label="已绑定手机号">
            <u-input v-model="userInfo.mobile" disabled placeholder="" />
          </u-form-item>
          <u-form-item label="登录密码" prop="password">
            <u-input v-model="form.password" placeholder="请输入登录密码" />
          </u-form-item>
          <u-form-item label="新的手机号" prop="newPhone">
            <u-input v-model="form.newPhone" placeholder="请输入新的手机号" />
          </u-form-item>
          <u-form-item label="验证码" prop="code">
            <u-input
              v-model="form.code"
              type="number"
              placeholder="请输入验证码"
            />
            <u-toast ref="uToast" />
            <u-verification-code
              ref="uCode"
              change-text="xs 后重试"
              :seconds="seconds"
              @change="codeChange"
            />
            <text slot="right" class="code-style" @click="getCode">
              {{ tips }}
            </text>
          </u-form-item>
        </u-form>
      </view>
      <view class="change-bound-phone-page-body-action-bar">
        <u-button
          type="primary"
          class="change-bound-phone-page-body-action-bar-button"
          @click="submit"
        >
          提交
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { updatePhoneNumber, getMobileCode } from '@/request/api/authorization';
import { getSign, getUserInfo } from '@/utils/common';
export default {
  data() {
    return {
      seconds: 60,
      validateCodeType: 3,
      errorType: ['toast'],
      form: {
        newPhone: '',
        password: '',
        code: ''
      },
      rules: {
        newPhone: [
          {
            // 自定义验证手机号函数
            validator: (rule, value) => {
              const phone = value.replace(/\s/g, '');
              const reg = this.$u.test.mobile(phone);
              this.disArr[0] = reg;
              return reg;
            },
            message: '手机号码格式错误',
            trigger: ['blur']
          }
        ],
        password: [
          // 对name字段进行长度验证
          {
            min: 6,
            max: 16,
            message: '请输入正确的密码',
            trigger: ['blur'],
            validator: (rule, value) => {
              if (6 <= value.length && value.length <= 16) {
                return true;
              } else {
                return false;
              }
            }
          }
        ],
        code: [
          {
            min: 4,
            max: 4,
            message: '请输入正确的验证码',
            trigger: ['blur'],
            validator: (rule, value) => {
              return value.length === 4;
            }
          }
        ]
      },
      pageType: 0,
      tips: '获取验证码'
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    }
  },
  methods: {
    onClickBackIcon() {
      uni.navigateBack();
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          if (this.$refs.uCode.canGetCode) {
            // 模拟向后端请求验证码
            uni.showLoading({
              title: '正在获取验证码'
            });
            // 向后端请求验证码
            getMobileCode({
              mobile: this.form.newPhone,
              type: this.validateCodeType,
              sign: getSign(this.form.newPhone, this.validateCodeType)
            })
              .then(() => {
                uni.showLoading({
                  title: '正在获取验证码'
                });
                this.timer = setTimeout(() => {
                  uni.hideLoading();
                  // 这里此提示会被this.start()方法中的提示覆盖
                  this.$u.toast('验证码已发送');
                  // 通知验证码组件内部开始倒计时
                  this.$refs.uCode.start();
                }, 1000);
              })
              .catch(res => {
                this.$refs.uToast.show({
                  title: res.message
                });
              });
          } else {
            this.$u.toast('倒计时结束后再发送');
          }
        }
      });
    },
    async updatePhoneNumber() {
      const res = await updatePhoneNumber();
      res;
    },
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          valid;
        }
      });
    }
  },
  onLoad(e) {
    this.pageType = Number.parseInt(e.type);
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  }
};
</script>

<style lang="scss">
page {
  background: white;
}
</style>

<style lang="scss" scoped>
.change-bound-phone-page {
  width: 100%;
  height: 100vh;
  &-header {
    position: relative;
    background: url('~@/static/img/forget-password-bg.png');
    background-size: cover;
    height: 356rpx;
    &-back-icon {
      position: absolute;
      top: 108rpx;
      left: 32rpx;
      height: 48rpx;
      width: 48rpx;
    }
    &-text {
      position: absolute;
      top: 208rpx;
      left: 48rpx;
      font-size: 64rpx;
      font-weight: bold;
      color: #222222;
      line-height: 45px;
    }
  }
  &-body {
    top: 402rpx;
    background: white;
    width: 100%;
    padding: 8rpx 48rpx;
    &-input-group {
      display: flex;
      flex-direction: column;
      padding: 24rpx 0;
    }
    &-forget {
      text-align: right;
      color: $uni-color-primary;
    }
    &-action-bar {
      margin-top: 32px;
      &-button {
        height: 110rpx;
        font-size: 32rpx;
        border-radius: 24rpx;
      }
      &-activate-button {
        margin-top: 14px;
      }
    }
    &-agreement {
      margin-top: 19px;
      text-align: center;
    }
  }
}

.code-style {
  color: rgba(252, 108, 55, 1);
}
</style>
