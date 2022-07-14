/**
 * @description: 体测模块相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';

import ApiPrefix from '@/request/config/prefix';
const FITNESS_URL = ApiPrefix.FITNESS;
// 新增体测配置参数
interface AddPhysicalConfigParams {
  tag: boolean;
  year: number;
}
// 体测配置列表响应
interface PhysicalConfigListResponse {
  check: boolean;
  dataStatus: boolean;
  id: string;
  tag: boolean;
  year: number;
}
// 体测配置年信息
interface yearItem {
  check: boolean;
  year: number;
}
// year信息
interface YearParams {
  id: string;
}

// 体测配置接口
export class PhysicalConfigService {
  /**
   * @description 新增体测配置
   */
  static add(params: AddPhysicalConfigParams): HttpPromise<any> {
    return Axios(`${FITNESS_URL}/fitness/setting/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 体测配置年列表
   */
  static list(): HttpPromise<PhysicalConfigListResponse[]> {
    return Axios(`${FITNESS_URL}/fitness/setting/list`, {
      method: 'get'
    });
  }
  /**
   * @description 体测配置年份选择
   */
  static getYearList(): HttpPromise<yearItem[]> {
    return Axios(`${FITNESS_URL}/fitness/setting/yearList`, {
      method: 'get'
    });
  }
  /**
   * @description 设置录入年份
   */
  static setYear(params: YearParams): HttpPromise<any> {
    return Axios(`${FITNESS_URL}/fitness/setting/update/tag`, {
      method: 'post',
      params: params
    });
  }
  /**
   * @description 删除体测配置(某一年)
   */
  static delYear(params: YearParams): HttpPromise<any> {
    return Axios(`${FITNESS_URL}/fitness/setting/del`, {
      method: 'post',
      params: params
    });
  }
}

// 获取课程体测列表参数
interface PhysicalTestParams {
  courseId: string;
  gender: number;
  offsetPage: number;
  organizationUserNumber: string;
  page: number;
  size: number;
}
// 获取全校体测列表参数
interface PhysicalTestAllParams {
  gender: number | string;
  inputYear: number | string;
  offsetPage: number;
  organizationUserNumber: string;
  page: number;
  size: number;
  years: number[];
}
// 体测单项数据
interface PhysicalItemInfo {
  bmi: number;
  eightHundredMeters: number;
  eightHundredMetersTag: number;
  fiftyMeters: number;
  fiftyMetersTag: number;
  fitnessStatus: number;
  gender: number;
  genderStr: string;
  height: number;
  id: string;
  inputYear: number;
  jump: number;
  jumpTag: number;
  leftEyeAmetropia: number;
  leftEyeStrandMirror: number;
  leftEyeVision: number;
  organizationUserNumber: string;
  pullUp: number;
  pullUpTag: number;
  realName: string;
  rightEyeAmetropia: number;
  rightEyeStrandMirror: number;
  rightEyeVision: number;
  sitAndReach: number;
  sitAndReachTag: number;
  sitUp: number;
  sitUpTag: number;
  thousandMeters: number;
  thousandMetersTag: number;
  totalScore: number;
  userId: string;
  vitalCapacity: number;
  vitalCapacityTag: number;
  weight: number;
  year: number;
}
interface PhysicalTestResponse {
  items: PhysicalItemInfo[];
}
// 课程体测统计请求参数
interface PhysicalTestCountParams {
  courseId: string;
}
// 课程体测信息导出请求参数
interface PhysicalTestExportParams {
  courseId: string;
  gender: number;
  organizationUserNumber: string;
}
// 全校体测统计请求参数
interface PhysicalTestCountAllParams {
  year: number;
}
// 统计单项
interface CountItem {
  number: number;
  percentage: number;
}
// 课程体测统计响应值
interface PhysicalTestCountResponse {
  allSchoolReachRate: number;
  average: number;
  averageForMan: number;
  averageForWoman: number;
  excellent: CountItem;
  flunk: CountItem;
  good: CountItem;
  passrate: CountItem;
  unconfirmed: CountItem;
}

// 导出全校体测请求参数
interface SchoolhysicalTestExportParams {
  gender: number;
  inputYear: number;
  organizationUserNumber: string;
  type: number; //1 全部 2有成绩
  years: number[] | string[];
}
// 体测信息编辑
interface EditPhysicalTestParams {
  eyeInfo: {
    leftEyeAmetropia: number;
    leftEyeStrandMirror: number;
    leftEyeVision: number;
    rightEyeAmetropia: number;
    rightEyeStrandMirror: number;
    rightEyeVision: number;
  };
  fitnessInfo: {
    eightHundredMeters: number;
    fiftyMeters: number;
    height: number;
    jump: number;
    pullUp: number;
    sitAndReach: number;
    sitUp: number;
    thousandMeters: number;
    vitalCapacity: number;
    weight: number;
  };
  sex: number;
  userId: string;
  year: number;
}
// 体测列表及统计
export class PhysicalTestService {
  /**
   * @description 课程体测列表
   */
  static list(params: PhysicalTestParams): HttpPromise<PhysicalTestResponse> {
    return Axios(`${FITNESS_URL}/fitness/course/info/list`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 课程体测列表统计
   */
  static count(
    params: PhysicalTestCountParams
  ): HttpPromise<PhysicalTestCountResponse> {
    return Axios(`${FITNESS_URL}/fitness/course/info/count`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 课程体测详情
   */
  static exportList(params: PhysicalTestExportParams): Promise<any> {
    return exportFile(
      'post',
      `${FITNESS_URL}/fitness/course/exportDetail`,
      params
    );
  }
  /**
   * @description 课程体测国标
   */
  static exportStandardList(params: PhysicalTestExportParams): Promise<any> {
    return exportFile('post', `${FITNESS_URL}/fitness/course/exportGB`, params);
  }
  /**
   * @description 全校体测列表
   */
  static schoolList(
    params: PhysicalTestAllParams
  ): HttpPromise<PhysicalTestResponse> {
    return Axios(`${FITNESS_URL}/fitness/school/info/list`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 全校体测列表统计
   */
  static schoolCount(
    params: PhysicalTestCountAllParams
  ): HttpPromise<PhysicalTestCountResponse> {
    return Axios(`${FITNESS_URL}/fitness/school/info/count`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 全校体测详情导出
   */
  static exportSchoolList(params: SchoolhysicalTestExportParams): Promise<any> {
    return exportFile(
      'post',
      `${FITNESS_URL}/fitness/school/exportDetail`,
      params
    );
  }
  /**
   * @description 全校国标体测导出
   */
  static exportStandardSchoolList(
    params: SchoolhysicalTestExportParams
  ): Promise<any> {
    return exportFile('post', `${FITNESS_URL}/fitness/school/exportGB`, params);
  }
  /**
   * @description 体测信息编辑
   */
  static edit(params: EditPhysicalTestParams): HttpPromise<any> {
    return Axios(`${FITNESS_URL}/fitness/info/update`, {
      method: 'post',
      data: params
    });
  }
}
