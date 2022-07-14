import { HttpPromise } from '@/@types/index';
import {
  LoginServiceModel,
  UserServiceModel,
  UserServiceGetMobile
} from '../model/login';

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
 * @description 登录模块请求 presenter 层。
 */
export class LoginServicePresenter {
  // 登录接口
  static async getLoginMessage(Params: GetLoginModelRequestData): Promise<any> {
    const axiosRes = await LoginServiceModel.getLoginMessage(Params);
    return axiosRes.data;
  }

  // 退出登录
  static async logout(): Promise<any> {
    const axiosRes = await LoginServiceModel.logout();
    return axiosRes.data;
  }

  // 修改密码接口
  static async resetPassword(
    Params: ResetPasswordModelRequestData
  ): Promise<any> {
    const axiosRes = await LoginServiceModel.resetPassword(Params);
    return axiosRes.data.data;
  }

  //获取验证码接口
  static async getMobileCode(
    Params: GetMobileCodeModelRequestData
  ): Promise<any> {
    const axiosRes = await LoginServiceModel.getMobileCode(Params);
    return axiosRes;
  }

  /**
   * @description 登录 字母数字验证码
   */
  static async getAlphanumericCode(): Promise<getAlphanumericCodePromise> {
    const axiosRes = await LoginServiceModel.getAlphanumericCode();
    return axiosRes.data.data;
  }

  /**
   * @description 获取验证码web
   */
  static async getMobileCodeWithAlphanumericVerify(
    data: getMobileCodeWithAlphanumericVerifyParams
  ): Promise<{ success: boolean }> {
    const axiosRes = await LoginServiceModel.getMobileCodeWithAlphanumericVerify(
      data
    );
    return axiosRes.data.data;
  }
}

/**
 * @description: userinfo模块 请求 presenter 层
 */
interface SearchUserResponse {
  id: string;
  realName: string;
  identity: string;
  mobile: string | null;
}
interface SearchUserParams {
  userName: string;
}
export class UserServicePresenter {
  static async searchUser(
    params: SearchUserParams
  ): Promise<SearchUserResponse[]> {
    const axiosRes = await UserServiceModel.searchUser(params);
    return axiosRes.data.data;
  }
}

/**
 * @description: 输入密码请求电话 请求 presenter 层
 */
interface PasswordParams {
  password: string;
  userId: string;
}
export class GetUserMobilePresenter {
  static async getUserMobile(params: PasswordParams): Promise<any> {
    const axiosRes = await UserServiceGetMobile.getUserMobile(params);
    return axiosRes.data.data;
  }
}
