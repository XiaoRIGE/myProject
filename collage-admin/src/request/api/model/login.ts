/**
 * @description: 登录模块相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';

import ApiPrefix from '@/request/config/prefix';
const AUTHORIZATION_URL = ApiPrefix.AUTHORIZATION;

export interface GetLoginModelRequestData {
  userName: string;
  password: string;
  organizationId: string | undefined;
}

export interface ResetPasswordModelRequestData {
  mobile: string;
  validateCode: string;
  password: string;
}

export interface GetMobileCodeModelRequestData {
  type: string;
  mobile: string;
  sign: string;
}
/** 登录获取图片验证码响应体 */
interface getAlphanumericCodePromise {
  id: string;
  image: string;
}
/** 获取验证码web */
interface getMobileCodeWithAlphanumericVerifyParams {
  code: string;
  codeId: string;
  mobile: string;
  sign: string;
  type: number;
}

/**
 * @description 登录模块请求 Model 层。
 */
export class LoginServiceModel {
  static getLoginMessage(Params: GetLoginModelRequestData): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/user/manage/login`, {
      method: 'post',
      data: Params
    });
  }
  static logout(): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/user/manage/logout`, {
      method: 'post'
    });
  }

  static resetPassword(Params: ResetPasswordModelRequestData): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/user/manage/resetPassword/mobileCode`, {
      method: 'post',
      data: Params
    });
  }

  static getMobileCode(Params: GetMobileCodeModelRequestData): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/user/manage/getMobileCode`, {
      method: 'post',
      data: Params
    });
  }

  /**
   * @description 登录 字母数字验证码
   */
  static getAlphanumericCode(): HttpPromise<getAlphanumericCodePromise> {
    return Axios(`${AUTHORIZATION_URL}/user/getAlphanumericCode`, {
      method: 'post'
    });
  }

  /**
   * @description 获取验证码web
   */
  static getMobileCodeWithAlphanumericVerify(
    data: getMobileCodeWithAlphanumericVerifyParams
  ): HttpPromise<{ success: boolean }> {
    return Axios(
      `${AUTHORIZATION_URL}/user/getMobileCodeWithAlphanumericVerify`,
      {
        method: 'post',
        data
      }
    );
  }
}

/**
 * @description: userinfo模块 请求 Model 层
 */
interface SearchUserParams {
  userName: string;
}
interface SearchUserResponse {
  id: string;
  realName: string;
  identity: string;
  mobile: string | null;
}
export class UserServiceModel {
  static searchUser(
    params: SearchUserParams
  ): HttpPromise<SearchUserResponse[]> {
    return Axios(`${AUTHORIZATION_URL}/user/nameGet`, {
      method: 'get',
      params
    });
  }
}

/**
 * @description: 输入密码请求电话 请求 Model 层
 */
interface PasswordParams {
  password: string;
  userId: string;
}
export class UserServiceGetMobile {
  static getUserMobile(data: PasswordParams): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/user/getUserMobile`, {
      method: 'post',
      data
    });
  }
}
