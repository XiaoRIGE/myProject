import {
  RunSettingService,
  EntryTerminalSettingsService,
  SchoolRunAstrictTargetSettingsService,
  RunSettingRuleService,
  RunningConditionService
} from '../model/runSettings';

import { HttpPromise } from '@/@types/index';
import { numFormatYearStr, getWeekTimeStr } from '@/utils/common';
import moment from 'moment';

interface addPatternParams {
  organizationId: string;
  campusId: string;
  freePattern: number;
  scopePattern: number;
  scopePercentage: number;
  fixedPointPattern: number;
  fixedPointPercentage: number;
  fixedPointOrder: number;
  fixedPointNumber: number;
}
interface patternInfoParams {
  campusId: string;
}
interface patternInfoResponse {
  organizationId: string;
  campusId: string;
  freePattern: number;
  scopePattern: number;
  scopePercentage: number;
  fixedPointPattern: number;
  fixedPointPercentage: number;
  fixedPointOrder: number;
  fixedPointNumber: number;
  id: string;
}
interface patternListParams {
  patternId: string;
  patternType: number;
}
interface accurateLatitude {
  longitude: number;
  accurateLongitude: number;
  latitude: number;
  accurateLatitude: number;
}
interface AddPatternParams {
  patternId: string;
  patternType: number;
  invalid: number;
  name: string;
  coordinateSaveVOList: accurateLatitude[];
}
interface DelPatternParams {
  id: string;
}
interface EditPatternParams {
  id: string;
  name: string;
}
// 新增定点跑范围参数
interface addPointPatternParams {
  coordinateSaveVOList: accurateLatitude[];
  invalid: number;
  name: string;
  patternId: string;
}
// 编辑定点跑范围参数
interface editPointPatternParams {
  // fixedPointType:number;
  id: string;
  name: string;
  patternId: string;
}
// 删除定点跑范围参数
interface delPointParams {
  id: string;
}
// 定点跑点位创建
interface addPointParams {
  coordinateSaveVOList: accurateLatitude[];
  patternId: string;
}
// 连线信息
interface fixedPointPatternSaveVOList {
  coordinateSaveVOList: accurateLatitude[];
  distance: number;
}

// 创建连线
interface addRouteParams {
  patternId: string;
  fixedPointPatternSaveVOList: fixedPointPatternSaveVOList[];
}
// 跑步模式设置相关接口
export class RunSettingServicePresenter {
  /**
   *  @description 获取校区跑步模式配置信息
   */
  static async patternInfo(
    params: patternInfoParams
  ): Promise<patternInfoResponse> {
    const axiosRes = await RunSettingService.patternInfo(params);
    return axiosRes.data.data;
  }
  /**
   *  @description 配置跑步模式
   */
  static async addPattern(params: any): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.addPattern(params);
    return axiosRes;
  }

  /**
   *  @description 范围跑步模式新增
   */
  static async addPatternArea(params: any): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.addArea(params);
    return axiosRes;
  }
  /**
   *  @description 范围（点位、连线）列表
   */
  static async PatternList(params: patternListParams): Promise<any> {
    const axiosRes = await RunSettingService.list(params);

    const result = axiosRes.data.data;
    let areaData: any = []; //最终返回template的区域数据
    let areaInvalidData: any = [];
    let pointData: any = [];
    let lineData: any = [];

    let areaDataArr: any = []; //接口筛选出来的区域数据
    let areaInvalidDataArr: any = [];
    let pointDataArr: any = [];
    let lineDataArr: any = [];

    if (params.patternType === 1) {
      //范围跑数据

      if (result.patternList) {
        // 抽取有限范围
        areaDataArr = result.patternList.filter((item: any) => {
          return item.invalid === 1;
        });
        // 抽取无效范围
        areaInvalidDataArr = result.patternList.filter((item: any) => {
          return item.invalid === 0;
        });
      }
    } else if (params.patternType === 2) {
      //定点跑 - 范围、点位、连线数据

      if (result.patternList) {
        // 范围数据
        let pointAreaData = result.patternList.filter((item: any) => {
          return item.fixedPointType === 1;
        });
        if (pointAreaData && pointAreaData.length) {
          let resultArr = pointAreaData[0].fixedPointPatternList;

          if (resultArr) {
            // 抽取有限范围
            areaDataArr = resultArr.filter((item: any) => {
              return item.invalid === 1;
            });
            // 抽取无效范围
            areaInvalidDataArr = resultArr.filter((item: any) => {
              return item.invalid === 0;
            });
          }
        }

        // 点位数据
        let pointTempDataArr = result.patternList.filter((item: any) => {
          return item.fixedPointType === 2;
        });

        if (pointTempDataArr && pointTempDataArr.length) {
          pointDataArr = pointTempDataArr[0].fixedPointPatternList;
          // 后端返回点位的时候数据格式不一致 做map处理
          if (pointDataArr && pointDataArr.length) {
            pointDataArr = pointDataArr.map((item: any) => {
              const coordinateInfoList = [];
              coordinateInfoList.push(item.coordinateInfo);
              return {
                ...item,
                coordinateInfoList
              };
            });
          }
        }

        // 连线数据
        let lineTempDataArr = result.patternList.filter((item: any) => {
          return item.fixedPointType === 3;
        });
        if (lineTempDataArr && lineTempDataArr.length) {
          lineDataArr = lineTempDataArr[0].fixedPointPatternList;
        }
      }
    }

    areaData = formatData(areaDataArr);
    areaInvalidData = formatData(areaInvalidDataArr);
    pointData = formatData(pointDataArr);
    lineData = formatData(lineDataArr);

    function formatData(data: any) {
      let tempdata: any = [];
      if (data && data.length) {
        tempdata = data.map((item: any) => {
          const coordinateInfoList = item.coordinateInfoList.map(
            (itemx: any) => {
              return {
                // Q: itemx.accurateLongitude,
                Q: itemx.accurateLatitude,
                // R: itemx.accurateLatitude,
                R: itemx.accurateLongitude,
                lat: itemx.latitude,
                lng: itemx.longitude
              };
            }
          );
          return {
            mapData: [...coordinateInfoList],
            listData: { ...item }
          };
        });
      }

      const dataForMap = tempdata.map((item: any) => {
        return item.mapData;
      });
      const dataForList = tempdata.map((item: any) => {
        return item.listData;
      });
      return {
        dataForMap,
        dataForList
      };
    }

    return {
      areaData,
      areaInvalidData,
      pointData,
      lineData
    };
  }
  /**
   *  @description 范围跑步模式编辑（修改名字）
   */
  static async updatePattern(params: EditPatternParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.editAreaName(params);
    return axiosRes;
  }
  /**
   *  @description 范围跑步模式删除
   */
  static async deletePattern(params: DelPatternParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.delArea(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑范围创建
   */
  static async addPointPattern(
    params: addPointPatternParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.addPointPattern(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑范围修改(名字)
   */
  static async editPointPattern(
    params: editPointPatternParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.editPointPattern(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑范围删除
   */
  static async delPointPattern(params: delPointParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.delPointPattern(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑点位创建
   */
  static async addPoint(params: addPointParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.addPoint(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑线路创建
   */
  static async addRoute(params: addRouteParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.addRoute(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑点位删除
   */
  static async delPoint(params: delPointParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.delPoint(params);
    return axiosRes;
  }
  /**
   *  @description 定点跑路线删除
   */
  static async delRoute(params: delPointParams): Promise<HttpPromise> {
    const axiosRes = await RunSettingService.delRoute(params);
    return axiosRes;
  }
}

export interface SwitchParams {
  id?: string;
  organizationId: string;
  campusId: string;
  campusName: string;
  notice: string;
  enableStatus: number;
  faceRunningStatus: boolean;
}
interface SearchInfoParams {
  campusId: string;
}

// 录入终端设置相关接口
export class EnteringTerminalServicePresenter {
  /**
   *  @description 跑步功能开关查询
   */
  static async searchInfo(params: SearchInfoParams): Promise<HttpPromise> {
    const axiosRes = await EntryTerminalSettingsService.searchInfo(params);
    return axiosRes;
  }

  /**
   *  @description 开启/关闭APP跑步功能
   */
  static async switch(params: SwitchParams): Promise<HttpPromise> {
    const axiosRes = await EntryTerminalSettingsService.switch(params);
    return axiosRes;
  }
}

// 学校跑步限制与目标设置
interface limitGoalsInfoParams {
  limitType: number;
  scoringType: number;
  semesterId: string;
}
interface limitGoalsInfoResponse {
  code: number;
  message: string;
  baseVO: {
    limitGoalsId: string;
    limitType: number;
    limitTypeStr: string;
    scoringType: number;
    scoringTypeStr: string;
  };
  goalsInfoList: [any];
}
interface specialLimitGoalsInfoParams {
  collegeId: string;
  page: number;
  schoolYear: number;
  semester: number;
  size: number;
}

interface delateLimitGoalsInfoParams {
  limitGoalsInfoId: string;
  scoringType: number;
  sex: number;
}

const formateDate = (timestamp: any) => {
  // return moment(timestamp).format('HH:mm:ss');
  return moment(timestamp).format('mm:ss');
};
export class SchoolRunAstrictTargetSettingsServicePresenter {
  /**
   *  @description 学校跑步限制与目标设置设置
   */
  static async limitGoalsInfo(
    params: limitGoalsInfoParams
  ): Promise<limitGoalsInfoResponse> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.limitGoalsInfo(
      params
    );
    const resData: any = axiosRes.data.data;
    for (let i = 0; i < resData.goalsInfoList.length; i++) {
      for (
        let k = 0;
        k < resData.goalsInfoList[i].lastSemesterGoalsInfoVO.sexInfoList.length;
        k++
      ) {
        const lastData =
          resData.goalsInfoList[i].lastSemesterGoalsInfoVO.sexInfoList[k];
        const lastVo =
          resData.goalsInfoList[i].lastSemesterGoalsInfoVO.sexTypeStr;
        lastData.averageSpeedStart = formateDate(lastData.averageSpeedStart);
        lastData.averageSpeedEnd = formateDate(lastData.averageSpeedEnd);
        lastData.limitGoalsInfoId =
          resData.goalsInfoList[i].lastSemesterGoalsInfoVO.limitGoalsInfoId; //把limitGoalsInfoId赋给每个子元素
        if (i === 0) {
          if (resData.baseVO.limitTypeStr === '全校一致') {
            if (lastVo === '男女一致') {
              lastData.gender = lastVo;
            } else {
              lastData.gender = lastData.sexStr;
            }
            lastData.semester = '上学期';
            lastData.year = '大一至大四';
          } else {
            if (lastVo === '男女一致') {
              lastData.gender = lastVo;
            } else {
              lastData.gender = lastData.sexStr;
            }
            lastData.semester = '上学期';
            lastData.year = '大一';
          }
        } else if (i === 1) {
          if (lastVo === '男女一致') {
            lastData.gender = lastVo;
          } else {
            lastData.gender = lastData.sexStr;
          }
          lastData.semester = '上学期';
          lastData.year = '大二';
        } else if (i === 2) {
          if (lastVo === '男女一致') {
            lastData.gender = lastVo;
          } else {
            lastData.gender = lastData.sexStr;
          }
          lastData.semester = '上学期';
          lastData.year = '大三';
          lastData.gender = lastVo;
        } else if (i === 3) {
          if (lastVo === '男女一致') {
            lastData.gender = lastVo;
          } else {
            lastData.gender = lastData.sexStr;
          }
          lastData.semester = '上学期';
          lastData.year = '大四';
          lastData.gender = lastVo;
        }
      }
      for (
        let k = 0;
        k < resData.goalsInfoList[i].nextSemesterGoalsInfoVO.sexInfoList.length;
        k++
      ) {
        const nextData =
          resData.goalsInfoList[i].nextSemesterGoalsInfoVO.sexInfoList[k];
        const nextVo =
          resData.goalsInfoList[i].nextSemesterGoalsInfoVO.sexTypeStr;
        // if (
        //   resData.goalsInfoList[i].nextSemesterGoalsInfoVO.sexTypeStr ===
        //   '男女不同'
        // ) {
        //   //如果当前数据男女不同在男数据下加一条女的数据 else 反的
        //   if(nextData.sexStr === '男') {

        //   }
        // }

        nextData.averageSpeedStart = formateDate(nextData.averageSpeedStart);
        nextData.averageSpeedEnd = formateDate(nextData.averageSpeedEnd);
        nextData.limitGoalsInfoId =
          resData.goalsInfoList[i].nextSemesterGoalsInfoVO.limitGoalsInfoId; //把limitGoalsInfoId赋给每个子元素
        if (i === 0) {
          if (resData.baseVO.limitTypeStr === '全校一致') {
            if (nextVo === '男女一致') {
              nextData.gender = nextVo;
            } else {
              nextData.gender = nextData.sexStr;
            }
            nextData.semester = '下学期';
            nextData.year = '大一至大四';
          } else {
            if (nextVo === '男女一致') {
              nextData.gender = nextVo;
            } else {
              nextData.gender = nextData.sexStr;
            }
            nextData.semester = '下学期';
            nextData.year = '大一';
          }
        } else if (i === 1) {
          if (nextVo === '男女一致') {
            nextData.gender = nextVo;
          } else {
            nextData.gender = nextData.sexStr;
          }
          nextData.semester = '下学期';
          nextData.year = '大二';
        } else if (i === 2) {
          if (nextVo === '男女一致') {
            nextData.gender = nextVo;
          } else {
            nextData.gender = nextData.sexStr;
          }
          nextData.semester = '下学期';
          nextData.year = '大三';
        } else if (i === 3) {
          if (nextVo === '男女一致') {
            nextData.gender = nextVo;
          } else {
            nextData.gender = nextData.sexStr;
          }
          nextData.semester = '下学期';
          nextData.year = '大四';
        }
      }
    }
    return resData;
  }

  /**
   *  @description 清除单个学校跑步限制与目标设置
   */
  static async delateLimitGoalsInfo(
    params: delateLimitGoalsInfoParams
  ): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.delateLimitGoalsInfo(
      params
    );

    return axiosRes;
  }

  /**
   *  @description 更新单个学校跑步限制与目标设置
   */
  static async updateLimitGoalsInfo(params: any): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.updateLimitGoalsInfo(
      params
    );
    return axiosRes;
  }

  /**
   *  @description 特殊学校跑步限制与目标设置设置
   */
  static async specialLimitGoalsInfo(
    params: specialLimitGoalsInfoParams
  ): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.specialLimitGoalsInfo(
      params
    );
    const resData: any = axiosRes.data.data;
    for (let i = 0; i < resData.items.length; i++) {
      const resDataI = resData.items[i].goalsInfoVO.sexInfoList;
      for (let k = 0; k < resDataI.length; k++) {
        resDataI[k].name = resData.items[i].collegeName;
        resDataI[k].semesterStr = resData.items[i].semesterStr;
        resDataI[k].gender = resData.items[i].goalsInfoVO.sexTypeStr;
        resDataI[k].groupId = resData.items[i].groupId;
        resDataI[k].averageSpeedStart = formateDate(
          resDataI[k].averageSpeedStart
        );
        resDataI[k].averageSpeedEnd = formateDate(resDataI[k].averageSpeedEnd);
        if (resData.items[i].schoolYear === 1) {
          resDataI[k].schoolYear = '大一';
        } else if (resData.items[i].schoolYear === 2) {
          resDataI[k].schoolYear = '大二';
        } else if (resData.items[i].schoolYear === 3) {
          resDataI[k].schoolYear = '大三';
        } else {
          resDataI[k].schoolYear = '大四';
        }
        if (resData.items[i].goalsInfoVO.sexTypeStr !== '男女一致') {
          resDataI[k].gender = '男';
          resDataI[1].gender = '女';
        }
      }
    }
    return resData;
  }

  /**
   *  @description 新增特殊跑步限制
   */
  static async addSpecialLimitGoalsInfo(params: any): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.addSpecialLimitGoalsInfo(
      params
    );
    const resData: any = axiosRes.data.data;
    return resData;
  }

  /**
   *  @description 编辑特殊跑步限制
   */
  static async updateSpecialLimitGoalsInfo(params: any): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.updateSpecialLimitGoalsInfo(
      params
    );
    return axiosRes;
  }

  /**
   *  @description 删除特殊跑步限制
   */
  static async delateSpecialLimitGoalsInfo(params: {
    groupId: string;
  }): Promise<any> {
    const axiosRes = await SchoolRunAstrictTargetSettingsService.delateSpecialLimitGoalsInfo(
      params
    );
    return axiosRes;
  }
}

// 获取跑步规则参数
interface getRunningRuleParams {
  campusId: string;
}

// 具体跑步信息
interface runningEffectiveTimeList {
  endTime: string | number;
  startTime: string | number;
  weeks: string;
  id?: string;
}
// 某学年某学期跑步规则信息
interface RunningTimeRuleVOListMap {
  id: string;
  year: string;
  semester: string;
  runDate: string;
  // effectiveTime: string;
  effectiveTime: string[];
}
// 跑步规则相应数据
interface RunningRuleResponse {
  id: string;
  campusId: string;
  type: number;
  runningTimeRuleVOList: RunningTimeRuleVOListMap[];
}

// 更新跑步时间规则请求参数
interface updateRunningRuleParams {
  id: string;
  runningTimeEnd: string;
  runningTimeStart: string;
  runningEffectiveTimeList: runningEffectiveTimeList[];
}

// 获取特殊跑步规则请求参数
interface getSpecialRunningRuleParams {
  campusId: string;
  index: number | string;
  organizationId: string;
  schoolYear: number | string;
  page: number;
  size: number;
}
// 跑步详情信息
interface SpecialRunningRuleItemsMap {
  id: string;
  year: string;
  semester: string;
  runDate: string;
  // effectiveTime: string;
  effectiveTime: string[]; //有效时段字符串数组
  effectiveTimeVal: runningEffectiveTimeList[];
  school: string;
  // runningEffectiveTimeList:runningEffectiveTimeList[]
}
// 特殊跑步规则相应信息
interface SpecialRunningRuleResponseMap {
  total: number;
  items: SpecialRunningRuleItemsMap[];
}

// 更新特殊跑步规则请求参数
interface updateSpecialRunningRuleParams {
  groupId: string;
  runningTimeEnd: string;
  runningTimeStart: string;
  runningEffectiveTimeList: runningEffectiveTimeList[];
}
// 新增特殊跑步规则请求参数
interface addSpecialRunningRuleParams {
  campusId: string;
  // id: string;
  index: number;
  organizationList: string[];
  runningEffectiveTimeList: runningEffectiveTimeList[];
  runningTimeEnd: string;
  runningTimeStart: string;
  schoolYear: string;
}
// 切换跑步时间限制规则参数
interface switchRunningRuleParams {
  campusId: string;
}
// 清除跑步时间限制规则
interface clearRunningRuleParams {
  id: string;
}
// 删除特殊跑步时间规则
interface deleteRunningRuleParams {
  groupId: string;
}

// 跑步时间限制
export class RunSettingRulePresenter {
  /**
   *  @description 获取跑步时间规则
   */
  static async getRunningRule(
    params: getRunningRuleParams
  ): Promise<RunningRuleResponse> {
    const axiosRes = await RunSettingRuleService.getRunningRule(params);

    const data = axiosRes.data.data;

    let result: RunningTimeRuleVOListMap[] = [];
    let campusId: string = '';
    let id: string = '';
    let type: number = 1;
    if (data) {
      result = data.runningTimeRuleVOList.map((item: any) => {
        const dateRangeSte = item.runningTimeStart
          ? `${moment(item.runningTimeStart).format('YYYY-MM-DD')}~${moment(
              item.runningTimeEnd
            ).format('YYYY-MM-DD')}`
          : '- -'; //跑步日期展示字符串

        const effectiveTimeStr = item.runningEffectiveTimeList.length
          ? item.runningEffectiveTimeList.map((itemX: any) => {
              const weekArr = itemX.weeks.split(',');
              const weekStr = getWeekTimeStr(weekArr);
              return `${weekStr}   ${itemX.startTime}~${itemX.endTime}`;
            })
          : ['- -']; //有效时段展示字符串
        return {
          id: item.id,
          year: numFormatYearStr(item.schoolYear),
          semester: item.index === 1 ? '上学期' : '下学期',
          runDate: dateRangeSte,
          effectiveTime: effectiveTimeStr,
          effectiveTimeVal: item.runningEffectiveTimeList
        };
      });
      campusId = data.campusId;
      id = data.id;
      type = data.type;
    }

    return {
      campusId,
      id,
      type,
      runningTimeRuleVOList: result
    };
  }

  /**
   *  @description 更新跑步时间规则
   */
  static async updateRunningRule(
    params: updateRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.updateRunningRule(params);
    return axiosRes;
  }

  /**
   * @description: 新建特殊跑步时间规则
   */

  static async addSpecialRunningRule(
    params: addSpecialRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.addSpecialRunningRule(params);
    return axiosRes;
  }

  /**
   * @description: 更新特殊跑步时间规则
   */

  static async updateSpecialRunningRule(
    params: updateSpecialRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.updateSpecialRunningRule(
      params
    );
    return axiosRes;
  }

  /**
   * @description: 切换跑步时间限制规则
   */

  static async switchRunningRule(
    params: switchRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.switchRunningRule(params);
    return axiosRes;
  }

  /**
   * @description: 清除跑步时间限制规则
   */

  static async clearRunningRule(
    params: clearRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.clearRunningRule(params);
    return axiosRes;
  }

  /**
   * @description: 删除特殊跑步时间规则
   */

  static async deleteRunningRule(
    params: deleteRunningRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunSettingRuleService.deleteRunningRule(params);
    return axiosRes;
  }

  /**
   * @description: 获取特殊跑步时间规则
   */

  static async getSpecialRunningRule(
    params: getSpecialRunningRuleParams
  ): Promise<SpecialRunningRuleResponseMap> {
    const axiosRes = await RunSettingRuleService.getSpecialRunningRule(params);
    const items = axiosRes.data.data.items.map(item => {
      const dateRangeSte = item.runningTimeStart
        ? `${moment(item.runningTimeStart).format('YYYY-MM-DD')}~${moment(
            item.runningTimeEnd
          ).format('YYYY-MM-DD')}`
        : '- -'; //跑步日期展示字符串

      const effectiveTimeStr = item.runningEffectiveTimeList.length
        ? item.runningEffectiveTimeList.map((itemX: any) => {
            const weekArr = itemX.weeks.split(',');
            const weekStr = getWeekTimeStr(weekArr);
            return `${weekStr}   ${itemX.startTime}~${itemX.endTime}`;
          })
        : ['- -']; //有效时段展示字符串

      return {
        id: item.groupId,
        year: numFormatYearStr(item.schoolYear),
        yearVal: item.schoolYear,
        semester: item.index === 1 ? '上学期' : '下学期',
        semesterVal: item.index,
        runDate: dateRangeSte,
        effectiveTime: effectiveTimeStr,
        effectiveTimeVal: item.runningEffectiveTimeList,
        school: item.organizationNames.join(','),
        schoolIdArr: item.organizationIdList
      };
    });
    const { total } = axiosRes.data.data;

    return {
      total,
      items
    };
  }
}

// 查询班级下学生的跑步情况请求参数
interface getStudentsGradeParams {
  courseId: string;
  page: number;
  size: number;
}
interface getStudentsGradeListResponse {
  grade: number;
  mileage: number;
  name: string;
  number: string;
  operationGrade: number;
  operationMileage: number;
  operationPart: number;
  part: number;
  sex: string;
  userId: string;
}
interface getStudentsGradeResponse {
  grades: getStudentsGradeListResponse[];
  total: number;
  totalPage: number;
}
// 查询班级下学生的跑步数据详情请求参数
interface getStudentRunningDetailsParams {
  page: number;
  semesterId: string;
  size: number;
  userId: string;
}
interface getStudentRunningDetailsList {
  effectiveMileage: number;
  effectivePart: number;
  endTime: string;
  id: string;
  keepTime: string;
  operationMileage: number;
  operationPart: number;
  runningType: number;
  runningTypeName: string;
  startTime: string;
  totalMileage: number;
  totalPart: number;
  uneffectiveReason: string;
}
interface getStudentRunningDetailsResponse {
  gradeDetails: getStudentRunningDetailsList[];
  total: number;
  totalPage: number;
}
// 根据姓名或者学号查询学生成绩请求参数
interface getStudentsRunningGradeByNameOrNumberParams {
  courseId: string;
  page: number;
  queryParam: string;
  size: number;
}
interface getStudentsRunningGradeByNameOrNumberList {
  grade: number;
  mileage: number;
  name: string;
  number: string;
  operationGrade: number;
  operationMileage: number;
  operationPart: number;
  part: number;
  sex: string;
  userId: string;
}
//根据姓名或者学号查询学生成绩响应
interface getStudentsRunningGradeByNameOrNumberResponse {
  grades: getStudentsRunningGradeByNameOrNumberList[];
  total: number;
  totalPage: number;
}
interface gradeDetails {
  effectiveMileage: number;
  effectivePart: any;
  endTime: string;
  id: string;
  keepTime: string;
  operationMileage: any;
  operationPart: any;
  runningType: number;
  runningTypeName: string;
  startTime: string;
  totalMileage: number;
  totalPart: any;
  uneffectiveReason: string;
}
interface getStudentRunningDetailsResponseMap {
  code: number;
  data: {
    gradeDetails: gradeDetails[];
    totalPage: number;
  };
  message: any;
}
// 根据姓名或者学号查询学生成绩请求参数
interface getCourseRuleParams {
  semesterId: string;
  year: number;
}
interface getCourseRuleResponse {
  items: {
    scoringType: number;
    scoringTypeName: string;
    semesterMileage: number;
    semesterParagraph: number;
    sex: number;
  };
}
// 添加跑步详情请求参数
interface getRunDetailParams {
  mileage: number;
  part: number;
  semesterId: string;
  type: number;
  userId: string;
}
interface updateRunningParams {
  id: string;
  mileage: number;
  part: number;
  type: number;
}
interface delateRunningParams {
  id: string;
  type: number;
}
//获取跑步详情参数
interface getRunningDetailsRoutineParams {
  userId: string;
  type: number;
  id: string;
}
//经纬度信息
interface coordinateInfo {
  latitude: number;
  longitude: number;
  sort: number;
}
//修改路径详情参数
interface modifyRunningDetailsRoutineParams {
  id: string;
  mileage?: number;
  part?: number;
  type: number;
}
//获取学生学期目标信息参数
interface getStudentRunningInfoParams {
  page: number;
  semesterId: string;
  size: number;
  userId: string;
  type: number;
}
//获取学生学期目标信息返回值
interface getStudentRunningInfoResponse {
  appMileage: number;
  appPart: number;
  effictiveMileage: number;
  effictivePart: number;
  targetMileage: number;
  targetlPart: number;
  totalMileage: number;
  totalPart: number;
  averageCadenceEnd: number; // 平均步频
  averageCadenceStart: number;
  averageSpeedStart: string; // 平均配速
  averageSpeedEnd: string;
  effectiveMileageStart: number; // 有效里程范围
  effectiveMileageEnd: number;
  effectiveParagraphStart: number; // 有效段数范围
  effectiveParagraphEnd: number;
}
interface importStudentsRunningGradeParams {
  courseId: string;
}
export class RunningConditionPresenter {
  /**
   *  @description 查询班级下学生的跑步情况
   */
  static async getStudentsGrade(
    params: getStudentsGradeParams
  ): Promise<getStudentsGradeResponse> {
    const axiosRes = await RunningConditionService.getStudentsGrade(params);
    return axiosRes.data.data;
  }

  /**
   *  @description 获取跑步数据详情
   */
  static async getStudentRunningDetails(
    params: getStudentRunningDetailsParams
  ): Promise<getStudentRunningDetailsResponse> {
    const axiosRes = await RunningConditionService.getStudentRunningDetails(
      params
    );
    const data: any = axiosRes.data.data;
    for (let item in data.gradeDetails) {
      data.gradeDetails[item].year = moment(
        Number(data.gradeDetails[item].startTime)
      ).format('YYYY-MM-DD');
      if (data.gradeDetails[item].startTime !== null) {
        //开始时间不为空处理
        data.gradeDetails[item].startTime = moment(
          Number(data.gradeDetails[item].startTime)
        ).format('HH:mm');
        data.gradeDetails[item].endTime = moment(
          Number(data.gradeDetails[item].endTime)
        ).format('HH:mm');
      }

      const time = moment.duration(
        Number(data.gradeDetails[item].keepTime),
        'second'
      );
      if (data.gradeDetails[item].keepTime !== null) {
        data.gradeDetails[item].keepTimeVal = data.gradeDetails[item].keepTime;

        data.gradeDetails[item].keepTime = [
          time.hours(),
          time.minutes(),
          time.seconds()
        ].join(':');
      }
    }
    return axiosRes.data.data;
  }

  /**
   *  @description 根据姓名或者学号查询学生成绩
   */
  static async getStudentsRunningGradeByNameOrNumber(
    params: getStudentsRunningGradeByNameOrNumberParams
  ): Promise<getStudentsRunningGradeByNameOrNumberResponse> {
    const axiosRes = await RunningConditionService.getStudentsRunningGradeByNameOrNumber(
      params
    );
    return axiosRes.data.data;
  }

  /**
   *  @description 获取课程跑步规则
   */
  static async getRunningRule(
    params: getCourseRuleParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.getRunningRule(params);
    return axiosRes;
  }

  /**
   *  @description 导出学生跑步数据
   */
  static async importStudentsRunningGrade(
    params: importStudentsRunningGradeParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.importStudentsRunningGrade(
      params
    );
    return axiosRes;
  }

  /**
   *  @description 添加跑步详情
   */
  static async addRunningDetails(
    params: getRunDetailParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.addRunningDetails(params);
    return axiosRes;
  }

  /**
   *  @description 编辑跑步详情
   */
  static async updateRunningDetails(
    data: updateRunningParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.updateRunningDetails(data);
    return axiosRes;
  }

  /**
   *  @description 删除跑步详情
   */
  static async delateRunningDetails(
    data: delateRunningParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.delateRunningDetails(data);
    return axiosRes;
  }

  /**
   *  @description 跑步详情
   */
  static async getRunningDetailsRoutine(
    data: getRunningDetailsRoutineParams
  ): Promise<any> {
    const axiosRes = await RunningConditionService.getRunningDetailsRoutine(
      data
    );
    // 跑步路径信息
    const { routineLine } = axiosRes.data.data.detailsRoutineVO;
    const routineLineMap = routineLine?.map(
      (item: { longitude: any; latitude: any }) => {
        return [item.longitude, item.latitude];
      }
    );

    // 点位信息
    let signPointMap = <any>[];
    // 只有定点跑才需要在地图展示点位信息
    if (data.type === 2) {
      const { signPoint } = axiosRes.data.data.detailsRoutineVO;
      signPointMap = signPoint?.map(
        (item: { latitude: any; longitude: any }) => {
          return {
            Q: item.latitude,
            R: item.longitude,
            lat: item.latitude,
            lng: item.longitude
          };
        }
      );
    }

    // 有效范围
    const { effictiveRegion } = axiosRes.data.data.detailsRoutineVO;
    let effectiveRegionMap = effictiveRegion
      ? effictiveRegion.map((item: any) => {
          const coordinateInfoList = item.map((itemx: any) => {
            return {
              Q: itemx.latitude,
              R: itemx.longitude,
              lat: itemx.latitude,
              lng: itemx.longitude
            };
          });
          return [...coordinateInfoList];
        })
      : null;

    // 无效范围
    const { uneffictiveRegion } = axiosRes.data.data.detailsRoutineVO;

    let uneffictiveRegionMap = uneffictiveRegion
      ? uneffictiveRegion.map((item: any) => {
          const coordinateInfoList = item.map((itemx: any) => {
            return {
              Q: itemx.latitude,
              R: itemx.longitude,
              lat: itemx.latitude,
              lng: itemx.longitude
            };
          });
          return [...coordinateInfoList];
        })
      : null;

    const item = axiosRes.data.data;
    item.averageSpeedStart = moment(item.averageSpeedStart).format('HH:mm');
    item.averageSpeedEnd = moment(item.averageSpeedEnd).format('HH:mm');
    item.startTime = moment(Number(item.startTime)).format('YYYY-MM-DD HH:mm');
    item.endTime = moment(Number(item.endTime)).format('HH:mm');

    const time = moment.duration(
      Number(item.keepTime ? item.keepTime : '0'),
      'second'
    );
    item.runDuration = [time.hours(), time.minutes(), time.seconds()].join(':');

    return {
      ...axiosRes.data.data,
      routineLine: routineLineMap,
      signPoint: signPointMap,
      effictiveRegion: effectiveRegionMap,
      uneffictiveRegion: uneffictiveRegionMap
    };
  }

  /**
   *  @description 修改路径详情
   */
  static async modifyRunningDetailsRoutine(
    data: modifyRunningDetailsRoutineParams
  ): Promise<HttpPromise> {
    const axiosRes = await RunningConditionService.modifyRunningDetailsRoutine(
      data
    );
    return axiosRes;
  }

  /**
   *  @description 获取学生学期目标信息
   */
  static async getStudentRunningInfo(
    data: getStudentRunningInfoParams
  ): Promise<getStudentRunningInfoResponse> {
    const axiosRes = await RunningConditionService.getStudentRunningInfo(data);
    return axiosRes.data.data;
  }
}
