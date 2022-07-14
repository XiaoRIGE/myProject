<template>
  <view class="login-page">
    <view class="login-page-header">
      <text class="login-page-header-text">登录</text>
    </view>

    <view class="login-page-body">
      <view class="login-page-body-input-group">
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
          <u-form-item label="手机号" prop="phone">
            <u-input
              v-model="form.phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号码"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            />
            <!-- <view class="phone-ipt" @click="clickPhone">
              <text v-if="form.phone">
                {{ form.phone }}
              </text>
              <text v-else class="placeholder">
                请输入手机号码
              </text>
            </view> -->
          </u-form-item>
          <u-form-item label="密码" prop="password">
            <u-input
              v-model="form.password"
              type="password"
              maxlength="16"
              placeholder="请输入密码"
              placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            />
          </u-form-item>
        </u-form>
      </view>
      <view class="login-page-body-forget">
        <view class="login-page-body-forget-btn" @click="forgetPasswordHandle">
          忘记密码?
        </view>
      </view>
      <view class="login-page-body-action-bar">
        <view class="to-login-btn">
          <u-button
            shape="square"
            :disabled="disabled"
            class="login-page-body-action-bar-btn"
            :class="disabled ? 'dis-activate-btn' : 'activate-btn'"
            @click="onClickLogin"
          >
            登录
          </u-button>
        </view>
        <view class="to-activate-btn">
          <u-button
            shape="square"
            class="
              login-page-body-action-bar-btn
              login-page-body-action-bar-activate-button
            "
            @click="onClickActivation"
          >
            新用户激活
          </u-button>
        </view>
      </view>
      <g-agreement @changeCheckedHandle="changeChecked" />
    </view>
    <!-- <u-keyboard
      v-model="show"
      mode="number"
      :mask="false"
      class="keyboard"
      :cancel-btn="false"
      :tooltip="false"
      :dot-enabled="false"
      :safe-area-inset-bottom="true"
      :confirm-btn="false"
      @change="valChange"
      @backspace="backspace"
    /> -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { login } from '@/request/api/authorization';
import backPressMixin from '@/mixins/backPressMixin';
import events from '@/nativeEvent';
export default {
  mixins: [backPressMixin],
  data() {
    return {
      checked: false,
      show: false,
      // backButtonPress: 0,
      form: {
        phone: '',
        password: ''
      },
      checkPhoneNum: '', //手机号
      errorType: ['toast'],
      rules: {
        phone: [
          {
            // 自定义验证手机号函数
            validator: (rule, value) => {
              const phone = value.replace(/\s/g, '');
              return this.$u.test.mobile(phone);
            },
            message: '请输入正确的手机号'
          }
        ],
        password: [
          // 对name字段进行长度验证
          {
            min: 6,
            max: 16,
            message: '请输入正确的密码'
          }
        ]
      }
    };
  },

  computed: {
    disabled() {
      return !(
        (
          this.$u.test.mobile(this.form.phone.replace(/\s/g, '')) &&
          this.form.password.length >= 6
        ) // 8
      );
    }
    // eleDateNew() {
    //   return JSON.parse(JSON.stringify(this.form));
    // }
  },
  watch: {
    // eleDateNew: {
    //   handler(newValue, oldValue) {
    //     // 监听电话号码
    //     this.form.phone =
    //       newValue.phone.length > oldValue.phone.length
    //         ? newValue.phone
    //             .replace(/\s/g, '')
    //             .replace(/(\d{3})(\d{0,4})(\d{0,4})/, '$1 $2 $3')
    //         : this.form.phone.trim();
    //     if (this.form.phone.length === 13) {
    //       // 验证/保存的手机号码，去除空格
    //       this.checkPhoneNum = this.form.phone.replace(/\s/g, '');
    //     }
    //   }
    // },
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
    uni.hideLoading();
  },
  methods: {
    // clickPhone() {
    //   this.show = true;
    // },
    // // 按键被点击(点击退格键不会触发此事件)
    // valChange(val) {
    //   if (this.form.phone.length < 13) {
    //     this.form.phone += val;
    //   }
    // },

    // // 删除键
    // backspace() {
    //   // 删除value的最后一个字符
    //   if (this.form.phone.length)
    //     this.form.phone = this.form.phone.substr(0, this.form.phone.length - 1);
    // },
    changeChecked(checked) {
      this.checked = checked;
    },
    onClickActivation() {
      uni.navigateTo({ url: '/pages/chooseIdentity/index' });
    },
    onClickLogin() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          if (this.checked) {
            this.login();
            // if (checkedPassword(this.form.password)) {
            //   this.login();
            // } else {
            //   this.$refs.uToast.show({
            //     title: '密码不符合规范'
            //   });
            // }
          } else {
            this.$refs.uToast.show({
              title: '请先同意服务协议与隐私政策'
            });
          }
        }
      });
    },
    async login() {
      try {
        const { password, phone } = this.form;
        const str = `${phone}${password}1`;
        // 通过原生获取加密后数据
        let signDigital = '';
        // #ifdef APP-PLUS
        signDigital = await events.getEncryptedData(str);
        // #endif

        const res = await login({
          entrance: '1',
          password,
          userName: phone,
          signDigital
        });
        if (res.code === 0) {
          this.$store.commit('app/SET_USERINFO', res.data);
          // 清除上一次学期缓存
          this.$store.commit('semester/SET_CURRENT_SEMESTER', {});
          uni.redirectTo({
            url: '/pages/index/index'
          });
        } else {
          this.$store.commit('app/SET_USERINFO', null);
        }
      } catch (error) {
        console.log(error);
      }
      // .catch(res => {
      //   this.$refs.uToast.show({
      //     title: res.message
      //   });
      // });
    },
    forgetPasswordHandle() {
      uni.navigateTo({
        url: `/pages/changePassword/index?type=${0}`
      });
    }
  }
  // onBackPress() {
  //   this.backButtonPress++;
  //   if (this.backButtonPress > 1) {
  //     events.quitApp();
  //     plus.runtime.quit();
  //   }
  //   return true;
  // }
};
</script>

<style lang="scss">
page {
  background: white;
}
</style>

<style lang="scss" scoped>
.login-page {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  &-header {
    position: relative;
    background: url('~@/static/img/login-bg.png');
    background-size: cover;
    height: 600rpx;
    padding: 208rpx 48rpx;
    &-text {
      position: absolute;
      font-size: 64rpx;
      font-weight: bold;
      color: #222222;
      line-height: 45px;
    }
  }
  &-body {
    position: absolute;
    top: 402rpx;
    background: white;
    width: 100%;
    border-radius: 64rpx 64rpx 0px 0px;
    padding: 22rpx 48rpx;
    &-input-group {
      display: flex;
      flex-direction: column;
      padding: 24rpx 0;
      .phone-ipt {
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
    }
    &-forget {
      float: right;
      text-align: right;
      &-btn {
        color: rgba(252, 108, 55, 1);
        font-size: 28rpx;
        text-decoration: underline;
      }
    }
    &-action-bar {
      margin-top: 64rpx;
      &-btn {
        width: 654rpx;
        height: 100rpx;
        margin-top: 28rpx;
        letter-spacing: 2rpx;
        font-size: 32rpx;
        border-radius: 24rpx;
        // color: rgba(84, 82, 102, 1);
      }
      .activate-btn {
        background: rgba(252, 108, 55, 1);
        color: rgba(255, 255, 255, 1);
      }
      .dis-activate-btn {
        background: rgba(252, 108, 55, 0.5);
        color: rgba(255, 255, 255, 1);
      }
      &-activate-button {
        background: rgba(245, 246, 250, 1);
        color: rgba(84, 82, 102, 1);
        border: none;
      }
      .to-activate-btn {
        ::v-deep .u-default-hover {
          background-color: #dcdce0 !important;
          color: #222222 !important;
          border: none !important;
        }
      }
      .to-login-btn {
        ::v-deep .u-default-hover {
          background-color: #e26031 !important;
          color: rgba(255, 255, 255, 1) !important;
          border: none !important;
        }
      }
      ::v-deep .u-hairline-border::after {
        border: none;
      }
    }
  }
}
</style>
