/**
 * @description: 课程模块相关接口
 */
import Axios from '../../config/axios';
import exportFile from '../../config/download';
import { onUploadProgress } from '@/utils/common';
import {
  HttpPromise,
  ListParamType,
  BaseObj,
  StringArray
} from '@/@types/index';

import ApiPrefix from '@/request/config/prefix';
const EDUCATION_URL = ApiPrefix.EDUCATION;
const AUTHORIZATION_URL = ApiPrefix.AUTHORIZATION;

// 课程项目相关的网络请求模块

/**
 * @interface PageParams -获取子账号列表参数
 * @property {number} page -页码
 * @property {number} size -每页数量
 */
// interface PageParams {
//   page: Number;
//   size: Number;
// }
/**
 * @interface UpdateProject -更新项目参数
 * @property {number} name -新项目名称
 * @property {number} id -项目id
 */
interface UpdateProject {
  name: string;
  id: string;
}

// 项目管理模块type start
interface ProjectItem {
  id: string;
  name: string;
}

interface ProjectResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: ProjectItem[];
}

interface AddProjectParams {
  name: string;
}

interface UpdateProjectParams {
  id: string;
  name: string;
}
interface DeleteProjectParams {
  id: string;
}

// 项目管理模块type end

// 项目管理网络请求
export class ProjectServices {
  /**
   * @description 查询项目列表
   */
  static list(params: ListParamType): HttpPromise<ProjectResponse> {
    return Axios(`${EDUCATION_URL}/projectSetting/list`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 添加项目
   */
  static add(params: AddProjectParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/projectSetting/save`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 修改项目
   */
  static update(params: UpdateProjectParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/projectSetting/update`, {
      method: 'put',
      data: params
    });
  }

  /**
   * @description 删除项目
   */
  static delete(params: DeleteProjectParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/projectSetting/del`, {
      method: 'delete',
      params
    });
  }
}

// 综合配置-班级配置模块type start
// 新增课程参数
interface CourseSaveParams {
  type: number | string;
  projectId: string;
  campusId: string;
  weekLabel: number;
  startDate: number;
  endDate: number;
  startTime: number;
  endTime: number;
  year: number;
  address?: string;
  registerStartTime?: number;
  registerEndTime?: number;
  teacherId: string;
  teacherName: string;
  limitPeopleNumber?: number;
  timeAllocationId?: string;
  timeAllocationName?: string;
  content?: string;
  collegeList?: string[];
  studentSelectionList?: string[];
  id?: string;
}
// 获取课程列表参数
interface GetCourseParams {
  page: number;
  size: number;
  projectId?: string;
  year?: number;
  weekLabel?: number;
  campusId?: number;
  teacherId?: number;
  teacherName?: number;
  type?: number;
  startTime?: number;
  endTime?: number;
}
// 课程列表单项数据信息
interface CourseItem {
  id: string;
  type: number;
  typeStr: string;
  projectId: string;
  projectName: string;
  year: number;
  teacherName: string;
  weekLabel: string;
  address: string;
  campusId: string;
  campusName: string;
  content: string;
  weekLabelType: number;
  startTime: number;
  startTimeStr: string;
  endTime: number;
  timeAllocationId: number;
  timeAllocationName: number;
  courseSelection: number;
  startDate: number;
  endDate: number;
  registerStartTime: number;
  registerEndTime: number;
  limitPeopleNumber: number;
  registeredPeopleNumber: number;
  createDateTime: number;
}
// 课程列表返回数据
interface CourseLIstResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: CourseItem[];
}
// 删除课程参数
interface DeleteCourseParams {
  id: number;
}
// 获取班级学生列表参数
interface GetStudentListParams {
  page: number;
  size: number;
  courseId: string;
}
// 班级学生单项信息
interface studentListItem {
  courseId: string;
  courseName: string;
  id: string;
  userId: string;
  name: null | string;
  number: string;
  sex: string;
  year: number;
}
// 班级学生相应数据
interface StudentListResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: studentListItem[];
}
// 删除班级学生参数
interface DeleteStudentParams {
  id: string;
}
// 删除班级全部学生参数
interface DeleteAllStudentParams {
  courseId: string;
}
interface AddStudentParams {
  courseId: string;
  userId: string;
}

// 查询班级学生参数
interface GetClassStudentParams {
  courseId: string;
}

// 班级学生信息
interface StudentItem {
  campusName: string;
  courseId: string;
  courseName: string;
  id: string;
  name: string;
  number: string;
  organizationName: string;
  sex: string;
  userId: string;
  year: number;
  orderNum: number;
}
// 下载班级模板参数
interface semesterParams {
  semesterId: string;
}
// 综合配置-班级配置模块type end

// 综合配置-班级配置网络请求
export class ClassServices {
  /**
   * @description 下载班级模板
   * @return {blob} blob
   */
  static exportClassTemplate(params: semesterParams): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/course/export`, params);
  }
  /**
   * @description 下载学生模板
   * @return {blob} blob
   */
  static exportStudentTemplate(params: semesterParams): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/course/student/export`, params);
  }
  /**
   * @description 下载班级列表
   * @return {blob} blob
   */
  static exportClassList(params: any): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/course/list/export`, params);
  }
  /**
   * @description 下载班级列表
   * @return {blob} blob
   */
  static exportStudentList(params: semesterParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/all/export`,
      params
    );
  }
  /**
   * @description 下载导入错误数据
   * @return {blob} blob
   */
  static downloadErrTemplate(params: any): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/course/exportErr`, params);
  }
  /**
   * @description 课程模板导入
   */
  static importCourse(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/course/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      // `onUploadProgress` 允许为上传处理进度事件
      onUploadProgress: onUploadProgress
    });
  }
  /**
   * @description 学生模板导入
   * @return {HttpResponse} result
   */
  static importStudent(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/course/student/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 导入重修名单
   * @return {HttpResponse} result
   */
  static importRepairList(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/course/student/rebuild/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 新增班级列表
   */
  static add(params: CourseSaveParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 查询班级列表
   */
  static list(params: GetCourseParams): HttpPromise<CourseLIstResponse> {
    return Axios(`${EDUCATION_URL}/course/list`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 更新班级信息
   */
  static update(params: CourseSaveParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/update`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 删除班级信息
   */
  static delete(params: DeleteCourseParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/del`, {
      method: 'delete',
      params
    });
  }
  /**
   * @description 班级学生列表信息
   */
  static studentList(
    data: GetStudentListParams
  ): HttpPromise<StudentListResponse> {
    return Axios(`${EDUCATION_URL}/course/registered/record/list`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 新增班级学生
   */
  static addStudent(data: AddStudentParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/registered/record/save`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 删除班级学生
   */
  static delStudent(params: DeleteStudentParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/registered/record/del`, {
      method: 'delete',
      params
    });
  }
  /**
   * @description 删除班级全部学生
   */
  static delAllStudent(params: DeleteAllStudentParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/registered/record/delAll`, {
      method: 'delete',
      data: params
    });
  }
  /**
   * @description 导出班级学生
   * @param  {courseId} 课程id
   * @return
   */
  static exportStudentByClass(params: any): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/export`,
      params
    );
  }

  // 新增学生 - 允许添加其他班级人员
  static addExistedStudent(params: AddStudentParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/course/registered/record/add`, {
      method: 'post',
      data: params
    });
  }

  // 查询班级所有学生
  static getClassStudentList(
    params: GetClassStudentParams
  ): HttpPromise<StudentItem[]> {
    return Axios(`${EDUCATION_URL}/course/registered/record/all`, {
      method: 'post',
      data: params
    });
  }
}

// 班级设置基础信息网络请求

// 班级设置基础下拉type start
interface BaseKeyResponse {
  id: string;
  name: string;
}
interface CampusResponse {
  name: string;
  organizationId: string;
  latitude: number;
  longitude: number;
  address: string;
  id: string;
}

interface TeacherParams {
  query: string;
}

interface TeacherResponse {
  id: string;
  name: string;
  phone: string;
}

interface StudentListParams {
  courseId: string;
  query: string;
}
interface StudentListResponse {
  id: string;
  name: string;
  studentNum: string;
}
interface studentSelectionListResponse {
  id: string;
  name: string;
  studentList: StudentListResponse[];
}

interface timeAllocationResponse {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}
interface CollegeResponse {
  id: string;
  name: string;
  parentId: string | null;
}

// 班级设置基础下拉type end
export class BaseCourseService {
  /**
   * @description 查询星期列表下拉项
   */
  static weekType(): HttpPromise<BaseObj> {
    return Axios(`${EDUCATION_URL}/base/weekType`, {
      method: 'get'
    });
  }
  /**
   * @description 查询课程类型下拉项
   */
  static courseType(): HttpPromise<BaseObj> {
    return Axios(`${EDUCATION_URL}/base/courseType`, {
      method: 'get'
    });
  }
  /**
   * @description 查询老师列表
   */
  static teacherList(params: TeacherParams): HttpPromise<TeacherResponse[]> {
    return Axios(`${EDUCATION_URL}/base/teacherList`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 查询基础学生列表
   */
  static studentList(
    params: StudentListParams
  ): HttpPromise<StudentListResponse[]> {
    return Axios(`${EDUCATION_URL}/base/studentList`, {
      method: 'get',
      params
    });
  }
  /**
   * @description 查询选课范围-学生名单
   */
  static studentSelectionList(): HttpPromise<studentSelectionListResponse[]> {
    return Axios(`${EDUCATION_URL}/base/studentSelectionList`, {
      method: 'get'
    });
  }
  /**
   * @description 查询时间设置列表
   */
  static allocationTime(): HttpPromise<timeAllocationResponse[]> {
    return Axios(`${EDUCATION_URL}/base/time/allocation`, {
      method: 'get'
    });
  }
  /**
   * @description 查询项目列表
   */
  static projectList(): HttpPromise<BaseKeyResponse[]> {
    return Axios(`${EDUCATION_URL}/base/projectList`, {
      method: 'get'
    });
  }
  /**
   * @description 查询校区列表
   */
  static campusList(): HttpPromise<CampusResponse[]> {
    return Axios(`${EDUCATION_URL}/base/campusList`, {
      method: 'get'
    });
  }
  /**
   * @description 查询学院列表
   */
  static collegeList(): HttpPromise<CollegeResponse[]> {
    return Axios(`${EDUCATION_URL}/base/collegeList`, {
      method: 'get'
    });
  }
  /**
   * @description 查询年级列表
   */
  static yearList(params: semesterParams): HttpPromise<StringArray> {
    return Axios(`${EDUCATION_URL}/base/yearList`, {
      method: 'get',
      params
    });
  }
}

interface updateActivityNumber {
  freshman: number;
  junior: number;
  senior: number;
  sophomore: number;
}
// 活动专题及活动配置
export class ActivityThemeConfiguration {
  /**
   * @description 获取每年级需要参加的活动数量
   */
  static getActivityNumber(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/get/activity/number`, {
      method: 'get'
    });
  }

  /**
   * @description 修改每个年级需要参加的活动数量
   */
  static updateActivityNumber(data: updateActivityNumber): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/update/activity/number`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 获取所有主题
   */
  static getAllTheme(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/topic/list`, {
      method: 'get'
    });
  }

  /**
   * @description 新增活动专题
   */
  static addThemeSpecial(data: any): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/topic/save?name=${data}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    });
  }

  /**
   * @description 编辑活动专题
   */
  static updateThemeSpecial(params: {
    name: string;
    id: string;
  }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/topic/update`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params
    });
  }

  /**
   * @description 删除活动专题
   */
  static delateThemeSpecial(params: { id: string }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/topic/delete`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params
    });
  }
}

interface createLimitParams {
  name: string;
  semesterId: string;
  sex: number;
  time: number;
  year: number[];
}
interface updateLimitParams {
  id: string;
  name?: string;
  semesterId: string;
  sex: number;
  time: number;
  year: number[];
}
interface updateLimitResponse {
  id: string;
  name: string;
  semesterId: string;
  sex: number;
  time: number;
  year: number[];
}
interface delLimitParams {
  id: string;
}

interface getActivityListParams {
  page: number;
  restrictionId: string;
  size: number;
}
interface getActivityListResponseItem {
  endTime: string;
  id: string;
  name: string;
  startTime: string;
  state: number;
  stateName: string;
}
interface getActivityListResponse {
  items: getActivityListResponseItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface getRestrictionParams {
  semesterId: string;
}
// 活动限制管理
export class ActivityLimitManage {
  /**
   * @description 获取限制列表
   */
  static getRestriction(params: getRestrictionParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/restriction/get`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 创建限制
   */
  static create(data: createLimitParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/restriction/create`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 修改限制
   */
  static update(data: updateLimitParams): HttpPromise<updateLimitResponse> {
    return Axios(`${EDUCATION_URL}/restriction/mod`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 获取使用此限制的活动列表
   */
  static getLimitActivityList(
    data: getActivityListParams
  ): HttpPromise<getActivityListResponse> {
    return Axios(`${EDUCATION_URL}/restriction/getActivityList`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 删除限制
   */
  static delate(data: delLimitParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/restriction/del`, {
      method: 'post',
      data
    });
  }
}

interface getOnceActivityParams {
  activityStatus: number;
  activityTopicId: string;
  endTime: number;
  page: number;
  simpleActivityName: string;
  size: number;
  startTime: number;
}
interface updateOnceActivityParams {
  activityTopicId: string;
  address: string;
  bgUrl: string;
  brief: string;
  campusList: string[];
  endTime: number;
  includedResult: number;
  limitPeopleNumber: number;
  name: string;
  registerEndTime: number;
  registerStartTime: number;
  releaseDate: number;
  restrictId: string;
  startTime: number;
  teacherList: string[];
}
interface addOnceActivityParams {
  activityTopicId: string | undefined;
  address: string;
  bgUrl: string;
  brief: string;
  campusList: string[];
  endTime: number;
  includedResult: number;
  limitPeopleNumber: number;
  name: string;
  registerEndTime: number;
  registerStartTime: number;
  releaseDate: number;
  restrictId: string;
  startTime: number;
  teacherList: string[];
}
interface delOnceActivityParams {
  simpleActivityId: string;
}
interface getStudentParams {
  activityId: string;
  studentNumber: string;
}
interface getStudentResponse {
  campusId: string;
  campusName: string;
  name: string;
  sex: number;
  signId: string;
  signState: number;
  studentNumber: string;
  userId: string;
  year: number;
}
interface getQueryStudentParams {
  nameOrganizationNum: string;
  restrictionId: string;
}
interface getQueryStudentResponse {
  birthDay: string;
  campusId: string;
  campusName: string;
  dataStatus: number;
  gender: number;
  id: string;
  lockStatus: number;
  mobile: string;
  organizationId: string;
  organizationName: string;
  organizationUserNumber: string;
  organizationVerified: number;
  parentOrganizationId: string;
  realName: string;
  year: number;
}
interface delStudentParams {
  activityId: string;
  studentId: string;
}
interface updateSignTypeParams {
  activityId: string;
  courseUserId: string;
  signType: number;
  userId: string;
}
// 单次活动相关接口
export class OnceActivityList {
  /**
   * @description 查询单次活动列表
   */
  static getOnceActivity(data: getOnceActivityParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/simple/querry`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 编辑单次活动列表
   */
  static updateOnceActivity(data: updateOnceActivityParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/activity/simple/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 新增单次活动
   */
  static addOnceActivity(data: addOnceActivityParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/activity/simple/create`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 删除单次活动
   */
  static delOnceActivity(params: delOnceActivityParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/activity/simple/delete`, {
      method: 'delete',
      params
    });
  }

  /**
   * @description 下载模板
   */
  //todo
  static exportOnceActivityTemplate(): Promise<any> {
    return exportFile('get', `${EDUCATION_URL}/activity/simple/temp`);
  }

  /**
   * @description 单次活动导入
   */
  static importOnceActivity(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/activity/simple/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 下载导入错误数据
   * @return {blob} blob
   */
  static downloadErrTemplate(params: any): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/activity/exportErr`, params);
  }

  /**
   * @description 上传图片接口
   */
  static uploadPic(data: FormData): Promise<any> {
    return Axios(`${EDUCATION_URL}/upload/pic`, {
      method: 'post',
      data
    });
  }

  /**
   * @description getStudent
   */
  static getStudent(
    data: getQueryStudentParams
  ): HttpPromise<getQueryStudentResponse[]> {
    return Axios(`${EDUCATION_URL}/activity/getStudent`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 获取学生列表
   */
  static getStudentList(
    params: getStudentParams
  ): HttpPromise<getStudentResponse[]> {
    return Axios(`${EDUCATION_URL}/activity/getStudentList`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 手动修改考勤状态
   */
  static updateSignType(data: updateSignTypeParams): HttpPromise<any> {
    return Axios(
      `${EDUCATION_URL}/activity/app/attainability/record/updateSignType`,
      {
        method: 'post',
        data
      }
    );
  }

  /**
   * @description 教师添加学生
   */
  static importStudent(data: any): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/activity/importStudent`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 教师删除学生
   */
  static delStudent(data: delStudentParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/activity/delStudent`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 查所有教师
   */
  static queryTeacherList(): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/teacher/queryList/all`, {
      method: 'get'
    });
  }
}
