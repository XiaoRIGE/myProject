<template>
  <div class="Loginbody">
    <a-spin v-if="isSpin" size="large" class="spin" />
    <div class="container">
      <div class="logo">
        <img class="logo-img" src="../assets/logo-bg@2x.png" alt="" />
      </div>
      <div v-if="isForgetPass === true" class="login-con">
        <div class="login-tab">
          <span
            :class="tabLoginWayRef ? 'login-password' : 'bottom-line'"
            @click="loginTabPassword"
          >
            密码登录
          </span>
          <span
            :class="tabLoginWayRef ? 'bottom-line' : 'login-password'"
            @click="loginTabPhone"
          >
            手机号登录
          </span>
        </div>
        <span class="logo-span" />
        <div v-if="!tabLoginWayRef">
          <div class="username-con username-input">
            <a-input
              v-model:value="loginForm.mobile"
              allow-clear
              :maxlength="29"
              placeholder="账号/手机号"
            />
          </div>
          <div class="password-con">
            <a-input-password
              v-model:value="loginForm.password"
              allow-clear
              :maxlength="29"
              placeholder="密码"
            />
            <span v-if="isErrorTitle === 2" class="errorTitle">
              用户名或密码不能为空
            </span>
            <span v-else-if="isErrorTitle === 3" class="errorTitle">
              用户名或密码错误
            </span>
            <span v-else-if="isErrorTitle === 4" class="errorTitle">
              账号未激活,请前往激活
            </span>
            <span class="forgetPassword" @click="forgetPassword">
              忘记密码？
            </span>
          </div>
        </div>

        <div v-else>
          <!-- 手机号登录 -->
          <div class="org-con">
            <div id="org" class="org select_module_con">
              <div style="display:flex">
                <p class="org_mobileLabel">
                  手机
                </p>
                <a-input
                  v-model:value="loginPhone.mobile"
                  allow-clear
                  :maxlength="29"
                  placeholder="输入手机号"
                />
              </div>
            </div>
          </div>
          <div class="username-con username_code" style="display:flex">
            <p class="org_mobileLabel">
              验证码
            </p>
            <p
              v-if="getPhoneLoginCode"
              class="org_getCode"
              @click="getCodeFunc(1)"
            >
              获取验证码
            </p>
            <p v-else class="org_code_down">
              {{ countDownObj.countDownPhoneLogin }} 秒
            </p>
            <a-input
              v-model:value="loginPhone.code"
              allow-clear
              :maxlength="29"
              :disabled="loginPhone.isLoginCode"
              placeholder="输入验证码"
            />
          </div>
          <span class="phone-title-error">
            {{ PhoneLoginEmptyMessage }}
          </span>
        </div>

        <div class="login">
          <button
            v-if="!tabLoginWayRef"
            id="login"
            class="login-btn"
            @click="phoneOrPassLogin(1)"
          >
            登录
          </button>
          <button
            v-else
            id="login"
            class="login-btn"
            @click="phoneOrPassLogin(2)"
          >
            登录
          </button>
        </div>
      </div>

      <div v-else class="login-con">
        <p class="logo-text">
          修改密码
          <span class="backLogin" @click="backLogin">
            返回登录
          </span>
        </p>
        <span class="logo-span">
          手机APP登录密码将同步修改
        </span>

        <div class="org-con">
          <div id="org" class="org select_module_con">
            <div style="display:flex">
              <p class="org_mobileLabel">
                手机
              </p>
              <a-input
                v-model:value="updateForm.mobile"
                allow-clear
                :maxlength="29"
                placeholder="输入手机号"
              />
            </div>
          </div>
        </div>
        <div class="username-con username_code" style="display:flex">
          <p class="org_mobileLabel">
            验证码
          </p>
          <p v-if="getCode" class="org_getCode" @click="getCodeFunc(2)">
            获取验证码
          </p>
          <p v-else class="org_code_down">{{ countDownObj.countDown }} 秒</p>
          <a-input
            v-model:value="updateForm.code"
            allow-clear
            :maxlength="29"
            :disabled="isAuthCode"
            placeholder="输入验证码"
          />
        </div>
        <div class="password-con" style="display:flex">
          <p class="org_mobileLabel">
            新密码
          </p>
          <a-input-password
            v-model:value="updateForm.newPassword"
            :maxlength="29"
            placeholder="新密码"
            style="padding-left:10px"
          />
          <span v-if="isUpdateError === 1" class="errorTitle">
            手机号、验证码或密码
            <br />
            不能为空
          </span>
          <span v-else-if="isUpdateError === 2" class="errorTitle">
            {{ errorInfo }}
          </span>
          <a-popover class="newPassTH" placement="right">
            <template #content>
              <strong>密码设置规则：</strong>
              <p>要求 6-18 位数</p>
              <p>
                "且包含"
                <span class="spanText">
                  数字
                </span>
                ，
                <span class="spanText">
                  大写字母
                </span>
                ，
                <span class="spanText">
                  小写字母
                </span>
                ，
                <span class="spanText">
                  特殊符号
                </span>
              </p>
              <p>中至少三种</p>
            </template>
            <span>!</span>
          </a-popover>
          <a-popover class="forgetPassword" placement="right">
            <template #content>
              <strong>可能导致的原因：</strong>
              <p>1. 手机号无法使用，请联系客服:</p>
              <p>2. 验证码获取过于频繁或次数过多，请稍后再试。</p>
              <p>3. 手机信号、网络状况差，无法接收到信息。</p>
              <p>4. 手机上安装有拦截短信软件。请检查屏蔽短信。</p>
            </template>
            <span>收不到验证码？</span>
          </a-popover>
        </div>

        <div class="login">
          <button id="login" class="login-btn" @click="updatePassword">
            修改密码
          </button>
        </div>
      </div>

      <div class="login-des">
        &copy;2018 四川乐健梦想家科技有限公司. All rights reserved.
        教APP备5100118号.
        <a
          style="color:#FFB945"
          target="_bank"
          href="http://www.beian.miit.gov.cn/"
        >
          蜀ICP备17023824号-1
        </a>
      </div>
    </div>
  </div>

  <a-modal
    v-model:visible="verifyImageVisible"
    :width="300"
    :centered="true"
    :footer="null"
    @ok="handleOk"
  >
    <p>输入算式答案</p>
    <img :src="verifyImg" alt="" />
    <span class="refreshClick" @click="handleRefresh">
      刷新
    </span>
    <br />
    <input v-model="verifyInput" class="verify_input" type="text" />
    <button class="verify_btn" @click="handleVerifyOk">
      确定
    </button>
    <p class="errorVerifyTitle">
      {{ verifyErrorMessage }}
    </p>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginServicePresenter } from '@/request/api/presenter/login';
import { message } from 'ant-design-vue';
import Bus from '@/utils/bus';

import { getSineStr, sha, isTel } from '@/utils/common';

export default defineComponent({
  props: {
    showForgetPwd: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isSpin = ref<boolean>(false);
    const getCode = ref<boolean>(true);
    const getPhoneLoginCode = ref<boolean>(true);
    const getCodePhoneLoginRef = ref<boolean>(true);
    const countDownObj = reactive({
      countDown: 60,
      countDownPhoneLogin: 60
    });
    const isAuthCode = ref<boolean>(true);
    const isForgetPass = ref<boolean>(true);
    const PhoneLoginEmptyMessage = ref<string>('');

    if (props.showForgetPwd) {
      isForgetPass.value = false;
    }

    const loginForm = reactive({
      school: undefined,
      mobile: '',
      password: ''
    });
    const updateForm = reactive({
      mobile: '',
      code: '',
      newPassword: ''
    });
    const loginPhone = reactive({
      mobile: '',
      code: '',
      isLoginCode: true
    });

    const isErrorTitle = ref(0);
    const isUpdateError = ref(0);
    const router = useRouter();
    const tabLoginWayRef = ref(false);

    const loginTabPassword = () => {
      tabLoginWayRef.value = false;
    };

    const loginTabPhone = () => {
      tabLoginWayRef.value = true;
    };

    /**
     * @description:  登录
     * @param {obj} requestData 请求参数
     * @param {number} code 1密码登录 2手机号登录
     * @return {string}
     */
    const login = async (requestData: any, code: number) => {
      try {
        isSpin.value = true;
        const res = await LoginServicePresenter.getLoginMessage(requestData);
        const userInfo = { ...res.data };
        delete userInfo.authorities;
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
        window.localStorage.setItem('accessToken', res.data.accessToken);
        window.localStorage.setItem(
          'authorities',
          JSON.stringify(res.data.authorities)
        );

        // router.push({ name: 'Home' });
        router.push({ name: 'Myclass' });

        Bus.$emit('login-state-change', true);
        isSpin.value = false;
      } catch (error) {
        console.log(error);
        if (code === 1) {
          if (error.code === 40034) {
            isErrorTitle.value = 4;
          } else {
            isErrorTitle.value = 3;
          }
          isSpin.value = false;
        } else {
          PhoneLoginEmptyMessage.value = error.message;
          isSpin.value = false;
        }
      }
    };

    const phoneOrPassLogin = (code: number) => {
      //1密码登录  2手机号登录
      if (code === 1) {
        //密码
        const requestData = {
          userName: loginForm.mobile,
          password: loginForm.password,
          organizationId: loginForm.school,
          entrance: 0
        };
        if (loginForm.mobile === '' || loginForm.password === '') {
          isErrorTitle.value = 2;
          return;
        } else {
          isErrorTitle.value = 0;
          login(requestData, 1);
        }
      } else {
        //手机号
        const requestData = {
          userName: loginPhone.mobile,
          verifyCode: loginPhone.code,
          organizationId: loginForm.school,
          entrance: 2
        };
        if (loginPhone.mobile && loginPhone.code) {
          PhoneLoginEmptyMessage.value = '';
          login(requestData, 2);
        } else {
          PhoneLoginEmptyMessage.value = '手机号或验证码不能为空';
        }
      }
    };

    type countType = 'countDown' | 'countDownPhoneLogin';
    const codeDown = (value: countType) => {
      //倒计时 'countDown'
      if (countDownObj[value] === 0) {
        getCode.value = true;
        getPhoneLoginCode.value = true;
        countDownObj[value] = 60;
        return;
      } else {
        countDownObj[value]--;
      }
      setTimeout(() => {
        codeDown(value);
      }, 1000);
    };

    const verifyImageVisible = ref<boolean>(false);
    const verifyImg = ref<string>('');
    const verifyInput = ref<string>('');
    const verifyErrorMessage = ref<string>('');
    const verifyCodeId = ref<string>('');
    const updatePassOrLogin = ref<number>(1);

    const queryVerifyImg = async () => {
      try {
        const res = await LoginServicePresenter.getAlphanumericCode();
        verifyImg.value = res.image;
        verifyCodeId.value = res.id;
      } catch (error) {
        PhoneLoginEmptyMessage.value = error.message;
      }
    };
    const getCodeFunc = async (code: number) => {
      //code 2修改密码验证  code 1手机号登录验证
      updatePassOrLogin.value = code;
      PhoneLoginEmptyMessage.value = '';
      verifyErrorMessage.value = '';
      verifyInput.value = '';
      if (code === 1) {
        if (loginPhone.mobile) {
          if (isTel(loginPhone.mobile)) {
            //通过手机号验证
            verifyImageVisible.value = true;
            queryVerifyImg();
          } else {
            PhoneLoginEmptyMessage.value = '请输入有效手机号';
          }
        } else {
          PhoneLoginEmptyMessage.value = '手机号或验证码不能为空';
        }
      } else {
        if (updateForm.mobile) {
          if (isTel(updateForm.mobile)) {
            //通过手机号验证
            verifyImageVisible.value = true;
            queryVerifyImg();
          } else {
            PhoneLoginEmptyMessage.value = '请输入有效手机号';
          }
        } else {
          PhoneLoginEmptyMessage.value = '手机号或验证码不能为空';
        }
      }
    };

    const handleVerifyOk = async () => {
      //val 1 手机号登录    val 2 修改密码
      if (verifyInput.value) {
        verifyErrorMessage.value = '';
        let mobileStr = await getSineStr(loginPhone.mobile);
        let sineStr = await sha(mobileStr, 0);
        const data = {
          code: verifyInput.value,
          codeId: verifyCodeId.value,
          mobile: loginPhone.mobile,
          sign: sineStr,
          type: 0
        };
        if (updatePassOrLogin.value === 2) {
          //修改密码
          data.mobile = updateForm.mobile;
          data.type = 3;
          mobileStr = await getSineStr(updateForm.mobile);
          sineStr = await sha(mobileStr, 3);
          data.sign = sineStr;
        }

        try {
          await LoginServicePresenter.getMobileCodeWithAlphanumericVerify(data);
          verifyImageVisible.value = false;
          getPhoneLoginCode.value = false;
          if (updatePassOrLogin.value === 1) {
            //手机号登录
            codeDown('countDownPhoneLogin');
            loginPhone.isLoginCode = false;
          } else {
            //修改密码
            getCode.value = false;
            isAuthCode.value = false;
            codeDown('countDown');
          }
        } catch (error) {
          console.log(error);
          if (error.code === 101002) {
            verifyErrorMessage.value = '答案错误';
            return;
          }
          verifyImageVisible.value = false;
          PhoneLoginEmptyMessage.value = error.message;
        }
      } else {
        verifyErrorMessage.value = '请输入答案';
      }
    };

    const handleRefresh = () => {
      //刷新
      queryVerifyImg();
    };

    const forgetPassword = () => {
      //忘记密码
      isForgetPass.value = false;
    };
    const backLogin = () => {
      //返回登录
      isForgetPass.value = true;
      isErrorTitle.value = 0;
      isUpdateError.value = 0;
    };

    const errorInfo = ref<string>('');
    const updatePassword = async () => {
      //修改密码
      if (
        updateForm.mobile === '' ||
        updateForm.code === '' ||
        updateForm.newPassword === ''
      ) {
        isUpdateError.value = 1;
        return;
      } else {
        isUpdateError.value = 0;
        const requestData = {
          mobile: updateForm.mobile,
          validateCode: updateForm.code,
          password: updateForm.newPassword
        };
        try {
          const data = await LoginServicePresenter.resetPassword(requestData);
          if (data === true) {
            isForgetPass.value = true;
            message.success('修改成功');
          } else {
            isUpdateError.value = 2;
            errorInfo.value = '验证码错误';
          }
        } catch (error) {
          console.log(error);
          isUpdateError.value = 2;
          errorInfo.value = error.message;
        }
      }
    };
    return {
      loginForm,
      loginPhone,
      isAuthCode,
      updateForm,
      isForgetPass,
      login,
      backLogin,
      isErrorTitle,
      isUpdateError,
      updatePassword,
      forgetPassword,
      isSpin,
      getCode,
      getPhoneLoginCode,
      getCodeFunc,
      countDownObj,
      errorInfo,
      loginTabPassword,
      loginTabPhone,
      tabLoginWayRef,
      getCodePhoneLoginRef,
      PhoneLoginEmptyMessage,
      phoneOrPassLogin,
      verifyImageVisible,
      verifyImg,
      verifyErrorMessage,
      verifyInput,
      handleVerifyOk,
      handleRefresh
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-select) {
  width: 100%;
}
:deep(.ant-input-password-icon) {
  display: none;
}
:deep(.username_code .ant-input) {
  width: 60%;
}
html,
body,
div,
input,
p {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
.Loginbody {
  background: url(../assets/bg.jpg) 0 0 no-repeat;
  background-size: cover;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: #fff;
  z-index: 99;
}
.container {
  width: 546px;
  height: 329px;
  margin: 15% auto 0;
  background: white;
}
.logo {
  width: 226px;
  float: left;
}
.logo .logo-img {
  width: 226px;
  height: 329px;
}
.login-con {
  float: left;
}
.login-con .logo-text {
  font-size: 24px;
  color: #424450;
  font-weight: bold;
  margin: 20px 0 0 40px;
  font-family: PingFangSC-Medium;
}
.login-tab {
  font-size: 18px;
  font-weight: 700;
  margin: 40px 0 10px 40px;
  .login-password {
    margin-right: 20px;
    cursor: pointer;
  }
}
.logo-span {
  margin: 20px 0 0 40px;
  color: #424450;
}
.login-con .org-con {
  margin: 10px 0 16px 40px;
}
.login-con .username-con {
  margin-left: 40px;
  margin-bottom: 16px;
  position: relative;
}
.login-con .password-con {
  margin-bottom: 16px;
  margin-left: 40px;
  position: relative;
}
.org_getCode {
  position: absolute;
  right: 0;
  height: 32px;
  z-index: 999;
  line-height: 30px;
  background: rgba(255, 185, 69, 1);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}
.org_code_down {
  width: 72px;
  text-align: center;
  position: absolute;
  right: 0;
  height: 32px;
  z-index: 999;
  line-height: 30px;
  background: rgba(255, 185, 69, 1);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}
.errorTitle {
  color: #ff143b;
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 38px;
}
.errorVerifyTitle {
  color: #ff143b;
  font-size: 12px;
}
.newPassTH {
  height: 14px;
  width: 14px;
  text-align: center;
  line-height: 14px;
  background: gray;
  color: white;
  border-radius: 50%;
  position: absolute;
  right: 5px;
  top: 30%;
  cursor: pointer;
}
.spanText {
  color: #6fb8f6;
}
.forgetPassword {
  position: absolute;
  right: 0;
  top: 35px;
  margin-top: 5px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(116, 126, 134, 1);
  line-height: 17px;
  cursor: pointer;
}

.login {
  width: 240px;
  height: 40px;
  margin: 50px 0 0 40px;
  background: rgba(255, 185, 69, 1);
  box-shadow: 0px 2px 4px 0px rgba(242, 201, 135, 1);
}

.login .login-btn {
  width: 240px;
  height: 40px;
  color: #fff;
  font-size: 16px;
  border: 0;
  background: #ffc216;
  cursor: pointer;
}
.org_mobileLabel {
  flex: 25%;
  line-height: 32px;
}
.login-des {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  bottom: 19px;
}
.backLogin {
  font-size: 12px;
  cursor: pointer;
  position: relative;
  right: -86px;
  top: -10px;
}
.spin {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
.username-input {
  margin-top: 10px;
}
.bottom-line {
  padding-bottom: 5px;
  margin-right: 20px;
  border-bottom: 2px solid black;
  cursor: pointer;
}
.phone-title-error {
  font-size: 13px;
  float: left;
  margin-left: 40px;
  color: #ff143b;
}
.verify_input {
  margin-right: 15px;
  height: 28px;
  border: 1px solid #d9d9d9;
  padding-left: 5px;
}
.verify_btn {
  color: #fff;
  background: #ff8640;
  border-color: #ff8640;
  border-radius: 2px;
}
.refreshClick {
  margin-left: 8px;
  cursor: pointer;
}
</style>
