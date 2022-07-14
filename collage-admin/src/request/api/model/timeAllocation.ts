/**
 * @description: 作息时间管理接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';

import ApiPrefix from '@/request/config/prefix';
const EDUCATION_URL = ApiPrefix.EDUCATION;

export interface timeAllocationResponse {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}

export interface createTimeRequestData {
  name: string;
  startTime: number;
  endTime: number;
}

export interface upDateTimeRequestData {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}

export interface deleteTimeRequestData {
  timeAllocationId: string;
}

export class TimeAllocationService {
  /**
   * @description 查询作息时间列表
   */
  static allocationTime(): HttpPromise<timeAllocationResponse[]> {
    return Axios(`${EDUCATION_URL}/base/time/allocation`, {
      method: 'get'
    });
  }
  /**
   * @description 新增作息时间
   */
  static createTime(
    data:createTimeRequestData
  ): HttpPromise<{}> {
    return Axios(`${EDUCATION_URL}/timeAllocation/save`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 编辑作息时间
   */
  static upDateTime(
    data:upDateTimeRequestData
  ): HttpPromise<{}> {
    return Axios(`${EDUCATION_URL}/timeAllocation/mod`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 删除作息时间
   */
  static deleteTime(
    data:any
  ): HttpPromise<{}> {
    return Axios(`${EDUCATION_URL}/timeAllocation/del`, {
      method: 'delete',
      headers:{
        'Content-Type':"multipart/form-data"
      },
      data
    });
  }
}
