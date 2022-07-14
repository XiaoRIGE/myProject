/*
 * @Author: your name
 * @Date: 2021-08-19 11:18:46
 * @LastEditTime: 2021-09-06 14:32:43
 * @LastEditors: Please set LastEditors
 * @Description: 体测模块
 * @FilePath: \collage-admin\src\request\api\presenter\physical.ts
 */
import { parseInt } from 'lodash';
import { PhysicalConfigService, PhysicalTestService } from '../model/physical';

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

// 体测配置列表处理后格式
interface PhysicalConfigListResponseMap {
  list: PhysicalConfigListResponse[];
  currentYearInfo: PhysicalConfigListResponse | undefined;
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

// 体测配置
export class PhysicalConfigPresenter {
  // 新增体测配置
  static async add(params: AddPhysicalConfigParams): Promise<any> {
    const axiosRes = await PhysicalConfigService.add(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 体测配置年列表
  static async list(): Promise<PhysicalConfigListResponseMap> {
    const axiosRes = await PhysicalConfigService.list();
    const resData = axiosRes.data.data;
    const currentYear = resData.filter(item => {
      return item.tag;
    });

    let currentYearInfo; //当前录入年信息
    if (currentYear) {
      currentYearInfo = currentYear[0];
    }
    return {
      list: resData,
      currentYearInfo
    };
  }
  // 体测配置年份选择
  static async getYearList(): Promise<any> {
    const axiosRes = await PhysicalConfigService.getYearList();
    const resData = axiosRes.data.data;
    let temp = true; //是否所有年都不可选 如果有一个check为false则可选
    if (resData && resData.length) {
      resData.forEach((element: any) => {
        if (!element.check) {
          temp = false;
        }
      });
    }
    return {
      list: resData,
      tag: temp
    };
  }
  // 设置录入年份
  static async setYear(params: YearParams): Promise<any> {
    const axiosRes = await PhysicalConfigService.setYear(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 删除体测配置
  static async delYear(params: YearParams): Promise<any> {
    const axiosRes = await PhysicalConfigService.delYear(params);
    const resData = axiosRes.data.data;
    return resData;
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
  inputYear?: number;
}
const filter = (val: number | string) => {
  // return val?val:'-'
  return val;
};

// 体测列表及统计
export class PhysicalTestPresenter {
  // 课程体测列表
  static async list(params: PhysicalTestParams): Promise<any> {
    const axiosRes = await PhysicalTestService.list(params);
    const resData = axiosRes.data.data;
    const itemsResult = resData.items.map((element: any) => {
      let second = 0;
      let minutes = 0;
      // 男生取1000米成绩 女生取800米成绩
      if (element.gender === 1) {
        second = element.thousandMeters
          ? parseInt(String(element.thousandMeters / 60))
          : 0;
        minutes = element.thousandMeters ? element.thousandMeters % 60 : 0;
      } else {
        second = element.eightHundredMeters
          ? parseInt(String(element.eightHundredMeters / 60))
          : 0;
        minutes = element.eightHundredMeters
          ? element.eightHundredMeters % 60
          : 0;
      }

      const itemKeysArr = Object.keys(element);

      // 按Tag结尾过滤、按 值为4过滤 、去掉结尾的Tag
      const showFailTagArr = itemKeysArr
        .filter(item => {
          return item.endsWith('Tag');
        })
        .filter(item => {
          return element[item] === 4;
        })
        .map(item => {
          let temp = item.split('Tag');
          return temp[0];
        });

      return {
        // ...element,
        // year:element.year?`${element.year}级`:'-',
        showFailTagArr,
        totalScore: element.totalScore,
        organizationUserNumber: element.organizationUserNumber,
        year: element.year,
        inputYear: element.inputYear,
        sex: element.gender,
        key: element.id,
        height: filter(element.height),
        weight: filter(element.weight),
        vitalCapacity: filter(element.vitalCapacity),
        bmi: filter(element.bmi),
        fiftyMeters: filter(element.fiftyMeters),
        sitAndReach: filter(element.sitAndReach),
        sitUp: filter(element.sitUp),
        jump: filter(element.jump),
        pullUp: filter(element.pullUp),
        name: element.realName,
        runMinutes: second,
        runSeconds: minutes,
        leftEyeVision: {
          eyeVal: element.leftEyeVision,
          eyeAmetropia: element.leftEyeAmetropia,
          eyeStrandMirror: element.leftEyeStrandMirror
        },
        rightEyeVision: {
          eyeVal: element.rightEyeVision,
          eyeAmetropia: element.rightEyeAmetropia,
          eyeStrandMirror: element.rightEyeStrandMirror
        }
      };
    });
    return {
      ...resData,
      items: itemsResult
    };
  }
  // 课程体测列表统计
  static async count(
    params: PhysicalTestCountParams
  ): Promise<PhysicalTestCountResponse> {
    const axiosRes = await PhysicalTestService.count(params);
    const resData = axiosRes.data.data;

    return {
      ...resData,
      allSchoolReachRate: resData.allSchoolReachRate
        ? resData.allSchoolReachRate
        : 0,
      average: resData.average ? parseFloat(resData.average.toFixed(1)) : 0,
      averageForMan: resData.averageForMan
        ? parseFloat(resData.averageForMan.toFixed(1))
        : 0,
      averageForWoman: resData.averageForWoman
        ? parseFloat(resData.averageForWoman.toFixed(1))
        : 0
    };
  }
  // 全校课程体测列表
  static async schoolList(params: PhysicalTestAllParams): Promise<any> {
    const axiosRes = await PhysicalTestService.schoolList(params);
    const resData = axiosRes.data.data;
    const itemsResult = resData.items.map((element: any) => {
      let second = 0;
      let minutes = 0;
      // 男生取1000米成绩 女生取800米成绩
      if (element.gender === 1) {
        second = element.thousandMeters
          ? parseInt(String(element.thousandMeters / 60))
          : 0;
        minutes = element.thousandMeters ? element.thousandMeters % 60 : 0;
      } else {
        second = element.eightHundredMeters
          ? parseInt(String(element.eightHundredMeters / 60))
          : 0;
        minutes = element.eightHundredMeters
          ? element.eightHundredMeters % 60
          : 0;
      }

      const itemKeysArr = Object.keys(element);
      // 按Tag结尾过滤、按 值为4过滤 、去掉结尾的Tag
      const showFailTagArr = itemKeysArr
        .filter(item => {
          return item.endsWith('Tag');
        })
        .filter(item => {
          return element[item] === 4;
        })
        .map(item => {
          let temp = item.split('Tag');
          return temp[0];
        });

      return {
        // ...element,
        showFailTagArr, //需要标红的成绩
        totalScore: element.totalScore,
        organizationUserNumber: element.organizationUserNumber,
        // year:element.year?`${element.year}级`:'-',
        year: element.year,
        inputYear: element.inputYear,
        sex: element.gender,
        key: element.id,
        height: filter(element.height),
        weight: filter(element.weight),
        vitalCapacity: filter(element.vitalCapacity),
        bmi: filter(element.bmi),
        fiftyMeters: filter(element.fiftyMeters),
        sitAndReach: filter(element.sitAndReach),
        sitUp: filter(element.sitUp),
        jump: filter(element.jump),
        pullUp: filter(element.pullUp),
        name: element.realName,
        runMinutes: second,
        runSeconds: minutes,
        leftEyeVision: {
          eyeVal: element.leftEyeVision,
          eyeAmetropia: element.leftEyeAmetropia,
          eyeStrandMirror: element.leftEyeStrandMirror
        },
        rightEyeVision: {
          eyeVal: element.rightEyeVision,
          eyeAmetropia: element.rightEyeAmetropia,
          eyeStrandMirror: element.rightEyeStrandMirror
        }
      };
    });
    return {
      ...resData,
      items: itemsResult
    };
  }
  // 全校课程体测列表统计
  static async schoolCount(
    params: PhysicalTestCountAllParams
  ): Promise<PhysicalTestCountResponse> {
    const axiosRes = await PhysicalTestService.schoolCount(params);
    const resData = axiosRes.data.data;
    return {
      ...resData,
      allSchoolReachRate: resData.allSchoolReachRate
        ? resData.allSchoolReachRate
        : 0,
      average: resData.average ? parseFloat(resData.average.toFixed(1)) : 0,
      averageForMan: resData.averageForMan
        ? parseFloat(resData.averageForMan.toFixed(1))
        : 0,
      averageForWoman: resData.averageForWoman
        ? parseFloat(resData.averageForWoman.toFixed(1))
        : 0
    };
  }
  // 体测信息编辑
  static async edit(params: EditPhysicalTestParams): Promise<any> {
    const axiosRes = await PhysicalTestService.edit(params);
    const resData = axiosRes.data.data;
    return resData;
  }
}
