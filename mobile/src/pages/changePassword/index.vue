<template>
  <view class="forget-password-page">
    <g-activateHeader
      :title="pageType === 0 ? '忘记密码' : '修改密码'"
      :is-right-show="false"
    />
    <view class="forget-password-page-body">
      <view class="forget-password-page-body-input-group">
        <u-form
          ref="uForm"
          :model="form"
          label-width="28rpx"
          label-position="top"
          :error-type="errorType"
          :label-style="{
            'font-weight': 'bold',
            height: '40rpx',
            'font-size': '28rpx'
          }"
        >
          <u-form-item v-if="pageType === 0" label="手机号" prop="phone">
            <u-input
              v-model="form.phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            />
          </u-form-item>
          <u-form-item v-if="pageType === 1" label="已绑定手机号" prop="phone">
            <u-input
              v-model="form.phone"
              placeholder="请输入已绑定手机号"
              type="number"
              maxlength="11"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            />
          </u-form-item>
          <u-form-item label="验证码" prop="code">
            <u-input
              v-model="form.code"
              type="number"
              maxlength="4"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
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
          <u-form-item label="新密码" prop="password">
            <u-input
              v-model="form.password"
              type="password"
              placeholder="请输入新密码"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            />
          </u-form-item>
          <view class="pwd-hint">
            8-16位至少包含数字、大写字母、小写字母、特殊符号中的三种
          </view>
        </u-form>
      </view>
      <u-button
        shape="square"
        :disabled="disabled"
        class="btn"
        :class="disabled ? 'dis-activate-btn' : 'activate-btn'"
        @click="submitHandle"
      >
        提交
      </u-button>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { getMobileCode, resetPassword } from '@/request/api/authorization';
import { checkedPassword, getSign, getUserInfo } from '@/utils/common';

export default {
  data() {
    return {
      seconds: 60,
      form: {
        phone: '',
        code: '',
        password: ''
      },
      pageType: 0,
      tips: '获取验证码',
      type: 3,
      timer: null,
      errorType: ['toast'],
      rules: {
        phone: [
          {
            // 自定义验证手机号函数
            validator: (rule, value) => {
              const phone = value.replace(/\s/g, '');
              return this.$u.test.mobile(phone);
            },
            message: '手机号码错误',
            trigger: ['blur']
          }
        ]
      }
    };
  },
  computed: {
    disabled() {
      return !(
        this.$u.test.mobile(this.form.phone.replace(/\s/g, '')) &&
        this.form.code &&
        this.form.password.length >= 8
      );
    },
    mobile() {
      if (getUserInfo()) {
        return getUserInfo().mobile;
      }
      return '';
    }
  },
  watch: {
    'form.password': {
      handler(newValue, oldValue) {
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newValue)) {
          this.$nextTick(function () {
            this.form.password = oldValue;
          });
        } else {
          this.$nextTick(function () {
            this.form.password = newValue;
          });
        }
      }
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad(e) {
    this.pageType = Number.parseInt(e.type);
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
          if (
            this.pageType === 0 ||
            (this.pageType === 1 && this.form.phone === this.mobile)
          ) {
            if (this.$refs.uCode.canGetCode) {
              // 向后端请求验证码
              getMobileCode({
                mobile: this.form.phone,
                type: this.type,
                sign: getSign(this.form.phone, this.type)
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
          } else {
            this.$refs.uToast.show({
              title: '请输入已绑定手机号'
            });
          }
        }
      });
    },
    // 提交
    submitHandle() {
      this.resetPasswordHandle();
    },
    // 忘记密码
    resetPasswordHandle() {
      const { code, password, phone } = this.form;
      if (checkedPassword(this.form.password)) {
        resetPassword({
          mobile: phone,
          password,
          validateCode: code
        })
          .then(res => {
            this.timer = null;
            this.$refs.uToast.show({
              title: res.message
            });
            if (this.pageType === 0) {
              uni.reLaunch({
                url: '/pages/login/index'
              });
            } else {
              uni.navigateBack();
            }
          })
          .catch(res => {
            this.$refs.uToast.show({
              title: res.message
            });
          });
      } else {
        this.$refs.uToast.show({
          title: '密码不符合规范'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.forget-password-page {
  width: 100%;
  height: 100vh;
  background: white;
  &-body {
    top: 402rpx;
    width: 100%;
    padding: 12rpx 48rpx;
    &-input-group {
      display: flex;
      flex-direction: column;
      ::v-deep .u-form-item:not(:first-child) {
        margin-top: 28rpx;
      }
      ::v-deep .uni-input-input {
        font-size: 40rpx;
        font-weight: bold;
      }
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
  .pwd-hint {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: rgba(162, 165, 170, 1);
  }
  .btn {
    width: 654rpx;
    height: 100rpx;
    margin-top: 64rpx;
    letter-spacing: 2rpx;
    font-size: 32rpx;
    border-radius: 24rpx;
    color: rgba(255, 255, 255, 1);
  }
  .activate-btn {
    background: rgba(252, 108, 55, 1);
  }
  .dis-activate-btn {
    background: rgba(252, 108, 55, 0.5);
    color: rgba(255, 255, 255, 1);
  }
  ::v-deep .u-default-hover {
    background-color: #e26031 !important;
    color: rgba(255, 255, 255, 1) !important;
    border: none !important;
  }
}

.code-style {
  color: rgba(252, 108, 55, 1);
}
</style>
