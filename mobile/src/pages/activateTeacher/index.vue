<template>
  <view class="tea-activate-container">
    <g-activateHeader title="新用户激活" :is-right-show="true" />
    <view class="content">
      <u-form
        ref="uForm"
        :model="form"
        label-position="top"
        label-width="28rpx"
        :error-type="errorType"
        :label-style="{
          'font-weight': 'bold',
          height: '40rpx',
          'font-size': '28rpx'
        }"
      >
        <u-form-item label="手机号" prop="phone">
          <u-input
            v-model="form.phone"
            maxlength="11"
            type="number"
            placeholder="请输入手机号码"
            placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
          />
        </u-form-item>
        <u-form-item label="验证码" prop="code">
          <u-input
            v-model="form.code"
            placeholder="请输入验证码"
            maxlength="4"
            type="number"
            placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
          />
          <u-verification-code
            ref="uCode"
            change-text="xs 后重试"
            :seconds="seconds"
            @change="codeChange"
          />
          <text class="code-style" @click="getCode">
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
      <u-button
        shape="square"
        :disabled="disabled"
        class="btn"
        :class="disabled ? 'dis-activate-btn' : 'activate-btn'"
        @click="activateTeacherHandle"
      >
        激活
      </u-button>
      <g-agreement @changeCheckedHandle="changeChecked" />
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { getMobileCode, activateTeacher } from '@/request/api/authorization';
import { checkedPassword, getSign } from '@/utils/common';

export default {
  data() {
    return {
      show: false,
      timer: null,
      tips: '获取验证码',
      seconds: 60,
      checked: false,
      iptFlag: '', //输入框类型
      // disabled: true,
      type: 3,
      errorType: ['toast'],
      form: {
        phone: '',
        code: '',
        password: ''
      },
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
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    changeChecked(checked) {
      this.checked = checked;
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
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
        }
      });
    },
    // 教师激活
    activateTeacherHandle() {
      const { code, password, phone } = this.form;
      if (this.checked) {
        if (checkedPassword(this.form.password)) {
          activateTeacher({
            mobile: phone,
            validateCode: code,
            password,
            validateCodeType: this.type
          })
            .then(() => {
              this.timer = null;
              uni.showToast({
                title: '激活成功，请重新登录',
                mask: true,
                icon: 'none',
                success: () => {
                  uni.reLaunch({
                    url: '/pages/login/index'
                  });
                }
              });
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
      } else {
        this.$u.toast('请先同意服务协议与隐私政策');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tea-activate-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  .content {
    padding: 12rpx 48rpx 0 48rpx;
    ::v-deep .u-form-item:not(:first-child) {
      margin-top: 28rpx;
    }
    ::v-deep .uni-input-input {
      font-size: 40rpx;
      font-weight: bold;
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
}
.pwd-hint {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: rgba(162, 165, 170, 1);
}
.code-style {
  color: rgba(252, 108, 55, 1);
}
</style>
