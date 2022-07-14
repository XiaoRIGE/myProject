/**
 * @description: 跑步模式设置相关接口
 */
import Axios from '../../config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';

import ApiPrefix from '@/request/config/prefix';
const RUNNING_URL = ApiPrefix.RUNNING;

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
interface patternListResponse {
  patternList: any[]; //todo 定义数组类型
  patternTypeStr: string;
  patternType: number;
}
// 经纬度对象
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

// 跑步模式设置模块接口
export class RunSettingService {
  /**
   *  @description 跑步模式新增
   */
  static addPattern(params: addPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/pattern/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 跑步模式详情
   */
  static patternInfo(
    params: patternInfoParams
  ): HttpPromise<patternInfoResponse> {
    return Axios(`${RUNNING_URL}/pattern/info`, {
      method: 'get',
      params
    });
  }
  /**
   *  @description 范围（点位、连线）列表
   */
  static list(params: patternListParams): HttpPromise<patternListResponse> {
    return Axios(`${RUNNING_URL}/pattern/list`, {
      method: 'get',
      params
    });
  }
  /**
   *  @description 范围跑步模式新增
   */
  static addArea(params: AddPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/scope/pattern/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 范围跑步模式删除
   */
  static delArea(params: DelPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/scope/pattern/del`, {
      method: 'delete',
      data: params
    });
  }
  /**
   *  @description 范围跑步模式编辑（修改名字）
   */
  static editAreaName(params: EditPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/scope/pattern/update`, {
      method: 'put',
      data: params
    });
  }
  /**
   * @description: 定点跑范围创建
   */

  static addPointPattern(params: addPointPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/pattern/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description: 定点跑范围修改(名字)
   */

  static editPointPattern(params: editPointPatternParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/pattern/update`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description: 定点跑范围删除
   */

  static delPointPattern(params: delPointParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/pattern/del`, {
      method: 'delete',
      data: params
    });
  }
  /**
   * @description: 定点跑点位创建
   */

  static addPoint(params: addPointParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/point/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description: 定点跑路线创建
   */

  static addRoute(params: addRouteParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/route/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description: 定点跑点位删除
   */

  static delPoint(params: delPointParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/point/del`, {
      method: 'delete',
      data: params
    });
  }
  /**
   * @description: 定点跑路线删除
   */

  static delRoute(params: delPointParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/fixedPoint/route/del`, {
      method: 'delete',
      data: params
    });
  }
}

interface SwitchParams {
  id?: string;
  organizationId: string;
  campusId: string;
  campusName: string;
  notice: string;
  enableStatus: number;
}
interface SearchInfoParams {
  campusId: string;
}

// 录入终端设置
export class EntryTerminalSettingsService {
  /**
   *  @description 开启/关闭APP跑步功能
   */
  static switch(params: SwitchParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/switch/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 跑步功能开关查询
   */
  static searchInfo(params: SearchInfoParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/switch/info`, {
      method: 'get',
      params
    });
  }
}

interface limitGoalsInfoParams {
  limitType: number;
  scoringType: number;
  semesterId: string;
}

interface specialLimitGoalsInffoParams {
  collegeId: string;
  page: number;
  schoolYear: number;
  semester: number;
  size: number;
}

interface DelateSpecialLimitGoalsInffoParams {
  groupId: string;
}

interface delateLimitGoalsInfoParams {
  limitGoalsInfoId: string;
  scoringType: number;
  sex: number;
}
// 学校跑步限制与目标设置设置
export class SchoolRunAstrictTargetSettingsService {
  /**
   *  @description 学校跑步限制与目标设置详情
   */
  static limitGoalsInfo(params: limitGoalsInfoParams): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/limitGoals/info`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 清除单个学校跑步限制与目标设置
   */
  static delateLimitGoalsInfo(
    params: delateLimitGoalsInfoParams
  ): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/limitGoals/del`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 编辑单个学校跑步限制与目标设置
   */
  static updateLimitGoalsInfo(params: any): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/limitGoals/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 特殊学校跑步限制与目标设置
   */
  static specialLimitGoalsInfo(
    params: specialLimitGoalsInffoParams
  ): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/special/limitGoals/list`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 新增特殊跑步限制
   */
  static addSpecialLimitGoalsInfo(params: any): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/special/limitGoals/save`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 编辑特殊跑步限制
   */
  static updateSpecialLimitGoalsInfo(params: any): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/special/limitGoals/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   *  @description 删除特殊跑步限制
   */
  static delateSpecialLimitGoalsInfo(
    params: DelateSpecialLimitGoalsInffoParams
  ): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/special/limitGoals/del`, {
      method: 'post',
      data: params
    });
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
interface runningTimeRuleVOList {
  id: string;
  index: number;
  runningTimeEnd: string;
  runningTimeStart: string;
  schoolYear: number;
  runningEffectiveTimeList: runningEffectiveTimeList[];
}
// 跑步规则相应数据
interface RunningRuleResponse {
  id: string;
  campusId: string;
  type: number;
  runningTimeRuleVOList: runningTimeRuleVOList[];
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
interface SpecialRunningRuleItems {
  groupId: string;
  index: number;
  organizationNames: string[];
  organizationIdList: string[];
  runningEffectiveTimeList: runningEffectiveTimeList[];
  runningTimeEnd: string;
  runningTimeStart: string;
  schoolYear: number;
}
// 特殊跑步规则相应信息
interface SpecialRunningRuleResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: SpecialRunningRuleItems[];
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
  // id:string;
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
export class RunSettingRuleService {
  /**
   *  @description 获取跑步时间规则
   */
  static getRunningRule(
    params: getRunningRuleParams
  ): HttpPromise<RunningRuleResponse> {
    return Axios(`${RUNNING_URL}/running/time/rule`, {
      method: 'get',
      params
    });
  }
  /**
   *  @description 更新跑步时间规则
   */
  static updateRunningRule(params: updateRunningRuleParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/running/time/rule/update`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 获取特殊跑步时间规则
   */
  static getSpecialRunningRule(
    params: getSpecialRunningRuleParams
  ): HttpPromise<SpecialRunningRuleResponse> {
    return Axios(`${RUNNING_URL}/running/time/rule/special/query`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 更新特殊跑步时间规则
   */
  static updateSpecialRunningRule(
    params: updateSpecialRunningRuleParams
  ): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/running/time/rule/special/update`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 新建特殊跑步时间规则
   */
  static addSpecialRunningRule(
    params: addSpecialRunningRuleParams
  ): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/running/time/rule/special/create`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 切换跑步时间限制规则
   */
  static switchRunningRule(params: switchRunningRuleParams): HttpPromise<null> {
    return Axios(
      `${RUNNING_URL}/running/time/rule/switch?campusId=${params.campusId}`,
      {
        method: 'post',
        data: params
      }
    );
  }
  /**
   *  @description 清除跑步时间限制规则
   */
  static clearRunningRule(params: clearRunningRuleParams): HttpPromise<null> {
    return Axios(`${RUNNING_URL}/running/time/rule/clear`, {
      method: 'post',
      data: params
    });
  }
  /**
   *  @description 删除特殊跑步时间规则
   */
  static deleteRunningRule(params: deleteRunningRuleParams): HttpPromise<null> {
    return Axios(
      `${RUNNING_URL}/running/time/rule/special/delete?groupId=${params.groupId}`,
      {
        method: 'post',
        data: params
      }
    );
  }
}

// 查询班级下学生的成绩请求参数
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
interface getStudentsRunningGradeByNameOrNumberResponse {
  grades: getStudentsRunningGradeByNameOrNumberList[];
  total: number;
  totalPage: number;
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
// 编辑请求参数
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
//获取学生学期目标信息
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
//导出跑步数据参数
interface importStudentsRunningGradeParams {
  courseId: string;
}
export class RunningConditionService {
  /**
   *  @description 查询班级下学生的跑步情况成绩
   */
  static getStudentsGrade(
    data: getStudentsGradeParams
  ): HttpPromise<getStudentsGradeResponse> {
    return Axios(`${RUNNING_URL}/back/getStudentsGrade`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 获取跑步数据详情
   */
  static getStudentRunningDetails(
    data: getStudentRunningDetailsParams
  ): HttpPromise<getStudentRunningDetailsResponse> {
    return Axios(`${RUNNING_URL}/back/getStudentRunningDetails`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 根据姓名或者学号查询学生成绩
   */
  static getStudentsRunningGradeByNameOrNumber(
    data: getStudentsRunningGradeByNameOrNumberParams
  ): HttpPromise<getStudentsRunningGradeByNameOrNumberResponse> {
    return Axios(`${RUNNING_URL}/back/getStudentsRunningGradeByNameOrNumber`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 获取课程跑步规则
   */
  static getRunningRule(
    data: getCourseRuleParams
  ): HttpPromise<getCourseRuleResponse> {
    return Axios(`${RUNNING_URL}/back/getRunningRule`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 导出学生跑步数据
   */
  static importStudentsRunningGrade(
    params: importStudentsRunningGradeParams
  ): Promise<any> {
    return exportFile(
      'get',
      `${RUNNING_URL}/back/importStudentsRunningGrade`,
      params
    );
  }

  /**
   *  @description 添加跑步详情
   */
  static addRunningDetails(data: getRunDetailParams): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/back/addRunningDetails`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 编辑跑步数据
   */
  static updateRunningDetails(data: updateRunningParams): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/back/modifyRunningDetails`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 删除跑步数据
   */
  static delateRunningDetails(data: delateRunningParams): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/back/deleteRunningDetails`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 获取路径详情
   */
  static getRunningDetailsRoutine(
    data: getRunningDetailsRoutineParams
  ): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/back/getRunningDetailsAppeal`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 修改路径详情
   */
  static modifyRunningDetailsRoutine(
    data: modifyRunningDetailsRoutineParams
  ): HttpPromise<any> {
    return Axios(`${RUNNING_URL}/back/modifyRunningDetailsRoutine`, {
      method: 'post',
      data
    });
  }

  /**
   *  @description 获取学生学期目标信息
   */
  static getStudentRunningInfo(
    data: getStudentRunningInfoParams
  ): HttpPromise<getStudentRunningInfoResponse> {
    return Axios(`${RUNNING_URL}/back/getStudentRunningInfo`, {
      method: 'post',
      data
    });
  }
}
