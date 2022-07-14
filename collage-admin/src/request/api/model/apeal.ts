/**
 * @description: 申诉管理相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';

import ApiPrefix from '@/request/config/prefix';
const RUNNING_URL = ApiPrefix.RUNNING;

interface queryApealListParams {
  appealTimeEnd: number;
  appealTimeStart: number;
  handleState: number;
  num: string;
  page: number;
  semesterId: string;
  size: number;
  appealTimeOrder?: number;
  handleTimeOrder?: number;
}
interface queryApealListResponseItem {
  appealTime: number;
  appealType: string;
  appealTypeStr: string;
  collegeName: string;
  handlePerson: string;
  handlePersonName: string;
  handleResult: string;
  handleState: number;
  handleStateStr: string;
  handleTime: number;
  id: string;
  name: string;
  studentNum: string;
  userId: string;
  year: number;
}
interface queryApealListResponse {
  items: queryApealListResponseItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface apealInfoResponse {
  appealReason: string;
  appealState: number;
  appealStateStr: string;
  appealTime: number | string;
  appealType: string;
  appealTypeStr: string;
  collegeName: string;
  effectiveMileage: number;
  effectivePart: number;
  endTime: number;
  handleResult: string;
  handleState: number;
  handleStateStr: string;
  handleTime: number | string;
  handlePersonName: string;
  id: string;
  keepTime: number;
  keepTimeVal: string;
  mobile: string;
  name: string;
  operationMileage: number;
  operationPart: number;
  runningDetailsId: string;
  runningType: number;
  runningTypeName: string;
  scoringType: number;
  startTime: number | string;
  studentNum: string;
  totalMileage: number;
  totalPart: number;
  url: string[][];
  userId: string;
  year: number;
}
interface passOrTurndownParams {
  id: string;
  result: string;
  state: number;
}
interface passOrTurndownResponse {
  code: number;
  data: boolean;
  message: string;
}
// 申诉管理网络请求
export class ApealManageService {
  /**
   * @description 申诉管理列表
   */
  static queryList(
    data: queryApealListParams
  ): HttpPromise<queryApealListResponse> {
    return Axios(`${RUNNING_URL}/back/appeal/page`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 申诉详情
   */
  static apealInfo(data: { id: string }): HttpPromise<apealInfoResponse> {
    return Axios(`${RUNNING_URL}/appeal/info`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 通过或驳回
   */
  static passOrTurndown(
    data: passOrTurndownParams
  ): HttpPromise<passOrTurndownResponse> {
    return Axios(`${RUNNING_URL}/back/appeal/handle`, {
      method: 'post',
      data
    });
  }
}
