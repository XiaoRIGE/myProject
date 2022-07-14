/**
 * @description: ai运动相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import ApiPrefix from '@/request/config/prefix';

const AIMOVEMENT_URL = ApiPrefix.AIMOVEMENT;

// 运动限制与目标设置列表
interface querySportLimitListParams {
  semesterId: string;
  type: number;
}

interface sexInfoList {
  dayGoals: number;
  id: string;
  semesterGoals: number;
  sex: number;
  sexStr: string;
  weekGoals: number;
}
interface SemesterVO {
  limitGoalsInfoId: string;
  limitType: number;
  sexInfoList: sexInfoList[];
  sexType: number;
  sexTypeStr: string;
}
interface goalsInfoList {
  lastSemesterVO: SemesterVO;
  nextSemesterVO: SemesterVO;
  yearType: number;
}
interface querySportLimitListResponse {
  goalsInfoList: goalsInfoList[];
  limitGoalsId: string;
  limitType: number;
}
interface resetSportLimitListParams {
  limitGoalsInfoId: string;
}
interface updateSportLimitListParams {
  limitGoalsInfoId: string;
  limitGoalsInfoList: any[];
  sexType: number;
}

// 运动限制与目标设置网络请求
export class SportLimitTargetService {
  /**
   * @description 运动限制与目标设置列表
   */
  static queryList(
    data: querySportLimitListParams
  ): HttpPromise<querySportLimitListResponse> {
    return Axios(`${AIMOVEMENT_URL}/goalsList/info`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 运动限制与目标设置编辑
   */
  static update(data: updateSportLimitListParams): HttpPromise<any> {
    return Axios(`${AIMOVEMENT_URL}/goalsList/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 运动限制与目标设置重置
   */
  static reset(data: resetSportLimitListParams): HttpPromise<any> {
    return Axios(`${AIMOVEMENT_URL}/goalsList/reset`, {
      method: 'post',
      data
    });
  }
}

interface validTimeListParams {
  campusId: string;
}
interface validTimeUpdateParams {
  endDate: string;
  id: string;
  startDate: string;
}
interface timeRuleVOList {
  endDate: string;
  id: string;
  semesterType: number;
  startDate: string;
  yearType: number;
}
interface validTimeListResponse {
  campusId: string;
  id: string;
  timeRuleVOList: timeRuleVOList[];
  type: number;
}
// 有效时间设置网络请求
export class validTimeService {
  /**
   * @description 获取运动有效设置列表
   */
  static queryList(
    params: validTimeListParams
  ): HttpPromise<validTimeListResponse> {
    return Axios(`${AIMOVEMENT_URL}/sport/time/rule`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 切换全校规则
   */
  static switch(params: { campusId: string }): HttpPromise<any> {
    return Axios(`${AIMOVEMENT_URL}/sport/time/switch`, {
      method: 'post',
      params
    });
  }

  /**
   * @description 编辑运动日期
   */
  static update(data: validTimeUpdateParams): HttpPromise<any> {
    return Axios(`${AIMOVEMENT_URL}/sport/time/rule/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 重置有效时间
   */
  static resetTime(data: { id: string }): HttpPromise<any> {
    return Axios(`${AIMOVEMENT_URL}/sport/time/rule/reset`, {
      method: 'post',
      data
    });
  }
}
