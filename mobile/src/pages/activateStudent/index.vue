<template>
  <view class="stu-activate-container">
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
            type="number"
            maxlength="11"
            placeholder="请输入手机号码"
            placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
          />
        </u-form-item>
        <u-form-item label="验证码" prop="code">
          <u-input
            v-model="form.code"
            type="number"
            maxlength="4"
            placeholder="请输入验证码"
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
      </u-form>
      <u-button
        shape="square"
        :disabled="disabled"
        class="btn"
        :class="disabled ? 'dis-activate-btn' : 'activate-btn'"
        @click="nextStep"
      >
        下一步
      </u-button>
      <g-agreement @changeCheckedHandle="changeChecked" />
    </view>
    <!-- 该手机号已注册 -->
    <u-modal
      v-model="activatedShow"
      :show-title="false"
      content="该手机号已注册"
      confirm-text="去登录"
      :show-cancel-button="true"
      confirm-color="#FC6C37"
      @confirm="toLoginHandle"
      @cancel="activatedShow = false"
    />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { getMobileCode, verifyPhoneNumber } from '@/request/api/authorization';
import { getSign } from '@/utils/common';

export default {
  data() {
    return {
      show: false,
      timer: null,
      checked: false,
      activatedShow: false, //已注册弹窗状态
      iptFlag: '', //输入框类型
      checkPhoneNum: '',
      errorType: ['toast'],
      tips: '获取验证码',
      seconds: 60,
      form: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [
          {
            // 自定义验证手机号函数
            validator: (rule, value) => {
              const phone = value.replace(/\s/g, '');
              return this.$u.test.mobile(phone);
            },
            message: '手机号码格式错误',
            trigger: ['blur']
          }
        ]
      },
      type: 2
    };
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  computed: {
    disabled() {
      return !(
        this.$u.test.mobile(this.form.phone.replace(/\s/g, '')) &&
        this.form.code
      );
    }
  },
  watch: {},
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
    nextStep() {
      if (this.checked) {
        verifyPhoneNumber({
          mobile: this.form.phone,
          validateCode: this.form.code,
          validateCodeType: this.type
        })
          .then(res => {
            if (res.code === 0) {
              clearTimeout(this.timer);
              const info = {
                phone: this.form.phone,
                code: this.form.code,
                type: this.type
              };
              uni.navigateTo({
                url: `/pages/studentCompleteInfo/index?info=${encodeURIComponent(
                  JSON.stringify(info)
                )}`
              });
            }
          })
          .catch(res => {
            if (res.code === 40035) {
              this.activatedShow = true;
            } else {
              this.$refs.uToast.show({
                title: res.message
              });
            }
          });
      } else {
        this.$u.toast('请先同意服务协议与隐私政策');
      }
    },
    // 去登陆
    toLoginHandle() {
      uni.reLaunch({ url: '/pages/login/index' });
    }
  }
};
</script>

<style lang="scss" scoped>
.stu-activate-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  .content {
    padding: 12rpx 48rpx 0 48rpx;
    .phone-ipt,
    .code-ipt {
      width: 100%;
      .placeholder {
        font-size: 32rpx;
        color: rgba(162, 165, 170, 1);
      }
    }
    ::v-deep .u-form-item:last-child {
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
    // .to-login-btn {
    ::v-deep .u-default-hover {
      background-color: #e26031 !important;
      color: rgba(255, 255, 255, 1) !important;
      border: none !important;
    }
    // }
  }
}
.code-style {
  color: rgba(252, 108, 55, 1);
}
</style>
