<template>
  <view class="complete-info-container">
    <g-activateHeader title="请完善信息" :is-right-show="false" />
    <view class="content">
      <view class="select-school">
        <image
          src="~@/static/img/school-icon.svg"
          mode="scaleToFill"
          class="school-icon"
        />
        <u-popup
          v-model="selectSchoolShow"
          mode="bottom"
          border-radius="28"
          :closeable="true"
          height="88%"
          :safe-area-inset-bottom="true"
        >
          <select-school
            :click-flag="clickFlag"
            @selectSchoolHandle="selectSchoolHandle"
          />
        </u-popup>
        <view class="school-text u-flex u-row-center u-col-center">
          <view
            :style="{
              color: hasSchool ? 'rgba(34,34,34,1)' : 'rgba(162,165,170,1)'
            }"
            @click="selectSchoolShowHandle"
          >
            {{ hasSchool ? selSchool.name : '选择学校' }}
          </view>
          <image
            src="~@/static/img/arrow.png"
            mode="scaleToFill"
            class="more-img"
          />
        </view>
      </view>
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
        <u-form-item label="学号" prop="number">
          <u-input
            v-model="form.number"
            placeholder="请输入学号"
            type="number"
            placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
            @change="changeNumber"
          />
        </u-form-item>
        <u-form-item label="姓名" prop="name">
          <u-input
            v-model="form.name"
            placeholder="请输入姓名"
            placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
          />
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
        @click="activateStudentHandle"
      >
        激活
      </u-button>
    </view>
    <u-toast ref="uToast" />
    <!-- 验证码过期 -->
    <u-modal
      v-model="recheckShow"
      :show-title="false"
      content="很抱歉，验证码已过期！请重新验证"
      confirm-text="重新验证"
      confirm-color="#FC6C37"
      @confirm="toActivateHandle"
    />
    <!-- 输入错误次数过多 -->
    <u-modal
      v-model="moreErrorShow"
      :show-title="false"
      content="输入错误次数过多，手机号已被锁定，请明天再试"
      confirm-text="知道了"
      confirm-color="#FC6C37"
      @confirm="toActivateHandle"
    />
  </view>
</template>

<script>
import SelectSchool from './components/SelectSchool';
import { checkedPassword } from '@/utils/common';
import { activateStudent } from '@/request/api/authorization';

export default {
  components: {
    'select-school': SelectSchool
  },
  data() {
    return {
      selectSchoolShow: true,
      recheckShow: false,
      moreErrorShow: false,
      info: null,
      clickFlag: false, //点击选择学校标记
      hasSchool: false,
      selSchool: null,
      errorType: ['toast'],
      form: {
        number: '',
        name: '',
        password: ''
      },
      rules: {}
    };
  },
  computed: {
    disabled() {
      return !(
        this.hasSchool &&
        this.form.number &&
        this.form.name &&
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
    },
    'form.number': {
      handler(newValue, oldValue) {
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newValue)) {
          this.$nextTick(function () {
            this.form.number = oldValue;
          });
        } else {
          this.$nextTick(function () {
            this.form.number = newValue;
          });
        }
      }
    }
  },
  onLoad(option) {
    this.info = JSON.parse(decodeURIComponent(option.info));
  },
  methods: {
    // 打开选择学校弹窗
    selectSchoolShowHandle() {
      this.selectSchoolShow = true;
      this.clickFlag = true;
    },
    // 选中学校
    selectSchoolHandle(selSchool) {
      this.selSchool = selSchool;
      this.selectSchoolShow = false;
      this.hasSchool = true;
    },
    // 学生激活
    activateStudentHandle() {
      const { phone, code, type } = this.info;
      const { number, name, password } = this.form;
      if (checkedPassword(this.form.password)) {
        activateStudent({
          mobile: phone,
          organizationId: this.selSchool.id,
          organizationUserNumber: number,
          password,
          realName: name,
          validateCode: code,
          validateCodeType: type
        })
          .then(() => {
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
            if (res.code === 50003) {
              this.recheckShow = true;
            } else {
              this.$refs.uToast.show({
                title: res.message
              });
            }
          });
      } else {
        this.$refs.uToast.show({
          title: '密码不符合规范'
        });
      }
    },
    // 返回学生激活页
    toActivateHandle() {
      uni.navigateBack();
      this.recheckShow = false;
      this.moreErrorShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.complete-info-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  .content {
    padding: 0 48rpx;
    .select-school {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      margin-bottom: 44rpx;
      .school-text {
        font-size: 36rpx;
        font-weight: bold;
        margin-top: 16rpx;
      }
      .school-icon {
        width: 56rpx;
        height: 56rpx;
      }
      .more-img {
        width: 28rpx;
        height: 28rpx;
        margin-left: 8rpx;
      }
    }
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
      margin-top: 116rpx;
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
</style>
