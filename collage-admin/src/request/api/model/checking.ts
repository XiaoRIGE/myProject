/**
 * @description: 考勤设置模块相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import ApiPrefix from '@/request/config/prefix'

const EDUCATION_URL = ApiPrefix.EDUCATION


interface queryCheck {
  code: number;
  message: null;
  data: {
    type: number;
    scoringRules: number;
    frequency: number;
    organizationId: string;
  };
}

interface queryCheckRuleRequest {
  type: number;
  scoringRules: number;
  frequency: number;
  organizationId: String;
}
interface queryCheckRuleResponse {
  code: number;
  message: null;
  data: {
    type: number;
    scoringRules: null;
    frequency: number;
    organizationId: String;
  };
}

// 教学配置 考勤设置网络请求
export class CheckingServicesModal {
  /**
   * @description 综合管理考勤查询网络请求
   */
  static CheckingList(params: any): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/attainability/rule?organizationId=${params}`, {
      method: 'get'
    });
  }

  /**
   * @description 综合管理考勤更新保存网络请求
   */
  static updateCheckingList(
    data: queryCheckRuleRequest
  ): HttpPromise<queryCheckRuleResponse> {
    return Axios(`${EDUCATION_URL}/attainability/rule/update`, {
      method: 'post',
      data
    });
  }
}
