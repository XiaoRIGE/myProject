/**
 * @description: 班级模块相关接口
 */
import Axios from '../../config/axios';
import exportFile from '../../config/download';
import { HttpPromise } from '@/@types/index';
import ApiPrefix from '@/request/config/prefix';
const EDUCATION_URL = ApiPrefix.EDUCATION;

const AIMOVEMENT_URL = ApiPrefix.AIMOVEMENT;

// 班级信息
interface ClassItem {
  year: number;
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  status: number;
  address: string;
  registeredPeopleNumber: number;
}
// 获取考勤列表参数
interface GetClassRecordParams {
  page: number;
  size: number;
  courseId: string;
  query: string;
}
//学生考勤结果
interface AttainabilityRecordList {
  id: string;
  weekNumber: number;
  weekNumberStr: string;
  singDate: number;
  signType: number;
  signTypeStr: string;
}
// 学生考勤信息
interface studentRecordItem {
  id: string;
  userId: string;
  name: string;
  number: string;
  sex: string;
  signNumber: number | null;
  signNumberStr: string;
  achievement: number;
  attainabilityRecordList: AttainabilityRecordList[];
}
// 考勤信息
interface AttainabilityList {
  pageNum: number;
  pageSize: number;
  total: number;
  items: studentRecordItem[];
}
// 考勤列表相应数据
interface ClassRecordResponse {
  attainabilityType: number;
  frequency: number | null;
  attendanceNumber: number;
  attainabilityList: AttainabilityList;
}
// 修改签到状态参数
interface UpdateSineTypeParams {
  id: string;
  signType: number;
}
// 导出考勤列表参数
interface ExportSineTypeParams {
  courseId: string;
}
// 获取课程管理员列表
interface GetRoleListParams {
  courseId: string;
}

// 课程管理员信息
interface RoleItem {
  id: string;
  userId: string;
  userName: string;
}

// 删除课程管理员参数
interface DelRoleParams {
  id: string;
}

// 新增课程管理员参数
interface AddRoleParams {
  courseId: string;
  userId: string;
}
// 班级下拉参数
interface GetListParams {
  semesterId: string;
}

// 课外活动列表参数
interface GetActivityListParams {
  page: number;
  size: number;
  courseId: string;
}

// 查询学生课外活动参数
interface QueryActivityListParams {
  page: number;
  size: number;
  param: string;
  type: number | string;
}

// 课外活动列表返回学生信息
interface studentActivityItem {
  key: number;
  name: string;
  number: number;
  sex: number;
  signedTimes: number;
  totalTimes: number;
}

// 课外活动列表返回参数
interface studentActivitylist {
  items: studentActivityItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
// 导出课外活动列表参数
interface ExportActivityParams {
  courseId: string;
}
// 学生查询班级请求参数
interface StudentInClassParams {
  page: number;
  semesterId: string;
  size: number;
  stuNumber: string;
}
// 学生所在班级item
interface StudentInClassItem {
  id: string;
  courseId: string;
  orderNum: number;
  courseName: string;
  signNumberStr: string;
}
// 学生所在班级返回信息
interface StudentInClassListResponse {
  userId: string;
  number: string;
  name: string;
  sex: number;
  sexStr: string;
  year: number;
  organizationName: string;
  mobile: string;
  campusName: string;
  organizationId: string;
  studentClassQueryVOS: StudentInClassItem[];
  total: number;
}
//删除学生所在班级参数
interface DelStudentInClassParams {
  id: string;
  semesterId: string;
}
// 查询学生可变更的所有班级参数
interface QueryStudentInClassAllParams {
  userId: string;
  semesterId: string;
  courseId: string;
}
// 查询学生可变更的所有班级返回
interface QueryStudentInClassAllItem {
  id: string;
  name: string;
}

// 学生变更班级参数
interface UpdateStudentInClassParams {
  changeCourseId: string;
  id: string;
  userId: string;
  semesterId: string;
  courseId: string;
}

// 班级管理网络请求
export class MyClassService {
  /**
   * @description 查询班级下拉列表
   */
  static list(params: GetListParams): HttpPromise<ClassItem[]> {
    return Axios(`${EDUCATION_URL}/base/courseList`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 查询课程管理员列表
   */
  static getRoleList(data: GetRoleListParams): HttpPromise<RoleItem[]> {
    return Axios(`${EDUCATION_URL}/course/role/list`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 删除课程管理员
   */
  static delRole(data: DelRoleParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/role/del`, {
      method: 'delete',
      data
    });
  }
  /**
   * @description 新增课程管理员
   */
  static addRole(data: AddRoleParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/role/save`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 查询课程考勤列表
   */
  static getRecordList(
    data: GetClassRecordParams
  ): HttpPromise<ClassRecordResponse> {
    return Axios(`${EDUCATION_URL}/attainability/record/list`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 修改签到状态
   */
  static updateSineType(data: UpdateSineTypeParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/attainability/record/updateSignType`, {
      method: 'put',
      data
    });
  }
  /**
   * @description 课程考勤列表导出
   * @return {blob} blob
   */
  static exportClassRecordList(params: ExportSineTypeParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/attainability/record/export`,
      params
    );
  }
  /**
   * @description 查询课外活动考勤列表
   */
  static getActivityList(
    data: GetActivityListParams
  ): HttpPromise<studentActivitylist> {
    return Axios(`${EDUCATION_URL}/activity/getSignUpStatistics`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 查询学生课外活动考勤列表
   */
  static queryActivityList(
    data: QueryActivityListParams
  ): HttpPromise<studentActivitylist> {
    return Axios(`${EDUCATION_URL}/activity/querySignUpStatistics`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 课外活动考勤列表导出
   * @return {blob} blob
   */
  static exportStudentActivityList(params: ExportActivityParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/activity/importSignUpStatistics`,
      params
    );
  }
  /**
   * @description 学生所在班级列表查询
   */
  static queryStudentInClassList(
    data: StudentInClassParams
  ): HttpPromise<StudentInClassListResponse> {
    return Axios(`${EDUCATION_URL}/student/classes/query`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 删除学生所在班级
   */
  static delStudentInClass(data: DelStudentInClassParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/student/classes/del`, {
      method: 'delete',
      data
    });
  }
  /**
   * @description 查询学生可变更的所有班级
   */
  static queryStudentInClassAll(
    data: QueryStudentInClassAllParams
  ): HttpPromise<QueryStudentInClassAllItem[]> {
    return Axios(`${EDUCATION_URL}/student/classes/queryAll`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 学生变更班级
   */
  static updateStudentInClass(
    data: UpdateStudentInClassParams
  ): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/student/classes/changeClass`, {
      method: 'post',
      data
    });
  }
}

interface GetAImovementListParams {
  courseId: string;
  page: number;
  queryItem: string;
  size: number;
}
// 学生运动信息
interface AImovementListItem {
  grade: number;
  name: string;
  number: string;
  semesterTarget: number;
  sex: string;
  userId: string;
  validGrade: number;
}
interface GetAImovementListResponse {
  total: number;
  totalPage: number;
  grades: AImovementListItem[];
}
interface GetUserSportInfoParams {
  page: number;
  semesterId: string;
  size: number;
  userId: string;
}

interface SportsRecord {
  effivtiveScore: number;
  keepTime: number;
  projectName: string;
  recordId: string;
  startTime: number;
  totalScore: number;
}
interface GetExerciseRecordResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: SportsRecord[];
}
/** 风险清单信息 */
interface ModifyDangerTextVO {
  id: string;
  text: string;
}

// AI运动网络请求
export class AImovementService {
  /**
   * @description 查询班级学生AI运动信息列表
   */
  static list(
    params: GetAImovementListParams
  ): HttpPromise<GetAImovementListResponse> {
    return Axios(`${AIMOVEMENT_URL}/sport/getStudentGrade`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 获取锻炼者运动数据列表
   */
  static getExerciseRecordList(
    params: GetUserSportInfoParams
  ): HttpPromise<GetExerciseRecordResponse> {
    return Axios(`${AIMOVEMENT_URL}/sport/getGradeDetail`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 查询风险清单文本
   */
  static getRiskText(): HttpPromise<ModifyDangerTextVO> {
    return Axios(`${AIMOVEMENT_URL}/sport/danger/text`, {
      method: 'post'
    });
  }
  /**
   * @description 编辑风险清单文本
   */
  static editRisk(data: ModifyDangerTextVO): HttpPromise<null> {
    return Axios(`${AIMOVEMENT_URL}/sport/update/text`, {
      method: 'post',
      data
    });
  }
}

interface getGradeHeadParams {
  courseId: string;
}

interface getGradeHeadResponse {
  activity: number;
  activityGrade: number;
  activityNumber: number;
  activityStatus: number;
  activityTag: number;
  coursePerformance: number;
  normalName: string;
  fitness: number;
  fitnessGrade: number;
  fitnessStatus: number;
  fitnessTag: number;
  frequency: number;
  manSemesterMileage: number;
  running: number;
  runningGrade: number;
  runningStatus: number;
  runningTag: number;
  sign: number;
  signGrade: number;
  signStatus: number;
  signTag: number;
  singleShowType: number;
  specialExamination: number;
  subjectSettingListVO: SubjectSettingListVO[];
  theoryExamination: number;
  womanSemesterMileage: number;
}

interface SubjectSettingListVO {
  actualProportion: number;
  dataGroupType: string;
  id: string;
  proportion: number;
  ratingType: string;
  subjectRatingRuleDOList: SubjectRatingRuleDOList[];
  subjectType: string;
  title: string;
}

interface SubjectRatingRuleDOList {
  grade: number;
  sex: number;
  value: string;
}

interface getGradeListParams {
  courseId: string;
  offsetPage: number;
  page: number;
  query: string;
  size: number;
}
interface getGradeListResponse {
  items: Item[];
  pageNum: number;
  pageSize: number;
  total: number;
}

interface Item {
  activity: number;
  additionalPoints: number;
  content: string;
  fitness: number;
  id: string;
  name: string;
  number: string;
  running: number;
  sex: number;
  sexStr: string;
  sign: number;
  subjectSettingListVO: SubjectSettingItem[];
  theoryExamination: number;
  total: number;
  userId: string;
  year: number;
}

interface SubjectSettingItem {
  grade: number;
  id: string;
  maxGrade: number;
  proportion: number;
  subjectType: string;
  value: string;
}

interface updateGradeParams {
  courseId: string;
  id: string;
  sign: number;
  subjectSettingListVO: SubjectSetting[];
  theoryExamination: number;
  userId: string;
}

interface SubjectSetting {
  id: string;
  value: string;
}
// 我的班级-成绩模块
export class GradeService {
  /**
   * @description 查询我的班级-学生成绩列表表头
   */
  static getGradeHead(
    params: getGradeHeadParams
  ): HttpPromise<getGradeHeadResponse> {
    return Axios(`${EDUCATION_URL}/course/registered/record/grade/head`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 查询我的班级-学生成绩列表
   */
  static getGradeList(
    params: getGradeListParams
  ): HttpPromise<getGradeListResponse> {
    return Axios(`${EDUCATION_URL}/course/registered/record/grade/list`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 编辑学生成绩
   */
  static updateGrade(params: updateGradeParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/registered/record/grade/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 导出所有成绩
   * @return {blob} blob
   */
  static exportUserAllGrade(params: getGradeHeadParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/export/userAllGrade`,
      params
    );
  }

  /**
   * @description 导出总成绩
   * @return {blob} blob
   */
  static exportUserTotalGrade(params: getGradeHeadParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/export/userTotalGrade`,
      params
    );
  }

  /**
   * @description 展示小分制或百分制:0小分制 1百分制
   */
  static getSingleShowType(): HttpPromise<number> {
    return Axios(`${EDUCATION_URL}/course/registered/record/singleShowType`, {
      method: 'get'
    });
  }
}
