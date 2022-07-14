/**
 * @description: 学校设置模块接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';
import { onUploadProgress } from '@/utils/common';

import ApiPrefix from '@/request/config/prefix';
const EDUCATION_URL = ApiPrefix.EDUCATION;
const AUTHORIZATION_URL = ApiPrefix.AUTHORIZATION;

export interface GetSchoolSettingSemesterQueryRequestData {
  page: number;
  size: number;
}

export interface GetSchoolSettingSemesterQueryResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    organizationId: string;
    startDate: number;
    endDate: number;
    yearRange: string;
    index: number;
    id: string;
  }[];
}

export interface CreateSchoolSettingSemesterRequestData {
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
}

export interface CreateSchoolSettingSemesterResponseData {
  code: number;
  message: null;
  items: {
    organizationId: string;
    startDate: number;
    endDate: number;
    yearRange: string;
    index: number;
    id: string;
  }[];
}

export interface UpdateSchoolSettingSemesterRequestData {
  id: string;
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
}

export interface UpdateSchoolSettingSemesterResponseData {
  code: number;
  message: null;
  items: {
    organizationId: string;
    startDate: number;
    endDate: number;
    yearRange: string;
    index: number;
    id: string;
  }[];
}

interface delateSchoolSettingSemesterResponseData {
  items: {
    code: number;
    message: null;
    data: boolean;
  };
}

export interface GetSchoolSettingCampusQueryRequestData {
  page: number;
  size: number;
  organizationId: string;
}

export interface GetSchoolSettingCampusQueryResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    name: string;
    organizationId: string;
    id: string;
  }[];
}

interface CreateSchoolSettingCampusResponseData {
  code: number;
  message: null;
  data: {
    name: string;
    organizationId: string;
    id: string;
  };
}

interface UpdateSchoolSettingCampusResponseData {
  code: number;
  message: null;
  data: {
    name: string;
    organizationId: string;
    latitude: number;
    longitude: number;
    address: string;
    id: string;
  };
}

export interface GetCollegeListModelRequestData {
  page: number;
  size: number;
  parentId: string;
}

export interface GetCollegeListModelResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    id: string;
    name: string;
  }[];
}

interface CreateCollegeModelResponseData {
  code: number;
  message: null;
  data: {
    id: string;
    parentId: string;
    name: string;
  };
}

interface UpdateCollegeModelResponseData {
  code: number;
  message: null;
  data: {
    id: string;
    parentId: string;
    name: string;
  };
}

interface semesterResponse {
  current: number;
  startDate: number;
  endDate: number;
  id: string;
  organizationId: string;
  weekIndex: number | null;
  yearRange: string;
  index: number;
}

/**
 * @description 学期页面的的网络请求
 */

export class SemesterServiceModel {
  static getRoleInfoList(
    data: GetSchoolSettingSemesterQueryRequestData
  ): HttpPromise<GetSchoolSettingSemesterQueryResponseData> {
    return Axios(`${EDUCATION_URL}/semester/query`, {
      method: 'post',
      data
    });
  }

  static createSemester(
    data: CreateSchoolSettingSemesterRequestData
  ): HttpPromise<CreateSchoolSettingSemesterResponseData> {
    return Axios(`${EDUCATION_URL}/semester/create`, {
      method: 'post',
      data
    });
  }

  static updateSemester(
    data: UpdateSchoolSettingSemesterRequestData
  ): HttpPromise<UpdateSchoolSettingSemesterResponseData> {
    return Axios(`${EDUCATION_URL}/semester/update`, {
      method: 'post',
      data
    });
  }

  static getSemesterTime(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/system/time`, {
      method: 'get'
    });
  }

  static deleteSemester(
    data: any
  ): HttpPromise<delateSchoolSettingSemesterResponseData> {
    return Axios(`${EDUCATION_URL}/semester/delete?id=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post'
    });
  }

  // 获取全部学期
  static getAllSemester(): HttpPromise<semesterResponse[]> {
    return Axios(`${EDUCATION_URL}/semester/queryAll`, {
      method: 'get'
    });
  }
}

/**
 * @description 校区页面的的网络请求
 */
export class CampusServiceModal {
  static getCampusService(
    data: GetSchoolSettingCampusQueryRequestData
  ): HttpPromise<GetSchoolSettingCampusQueryResponseData> {
    return Axios(`${EDUCATION_URL}/campus/query`, {
      method: 'post',
      data
    });
  }

  static createCampus(data: {
    name: string;
    prganizationId: string;
  }): HttpPromise<CreateSchoolSettingCampusResponseData> {
    return Axios(`${EDUCATION_URL}/campus/create`, {
      method: 'post',
      data
    });
  }

  static updateCampus(data: {
    id: string;
    name: string;
    prganizationId: string;
  }): HttpPromise<UpdateSchoolSettingCampusResponseData> {
    return Axios(`${EDUCATION_URL}/campus/update`, {
      method: 'post',
      data
    });
  }

  static delateCampus(data: any): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/campus/delete?id=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post'
    });
  }

  static queryAllCampus(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/campus/queryAll?id=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post'
    });
  }
}

/**
 * @description 学院页面的的网络请求
 */
export class CollegeServiceModal {
  static getCollegeList(
    getCollegeListParams: GetCollegeListModelRequestData
  ): HttpPromise<GetCollegeListModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/organization/query`, {
      method: 'post',
      data: getCollegeListParams
    });
  }

  static createCollege(data: {
    name: string;
    parentId: string;
  }): HttpPromise<CreateCollegeModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/organization/create`, {
      method: 'post',
      data
    });
  }

  static updateCollege(data: {
    id: string;
    name: string;
    parentId: string;
  }): HttpPromise<UpdateCollegeModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/organization/update`, {
      method: 'post',
      data
    });
  }

  static delate(data: any): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/organization/delete?id=${data}`, {
      method: 'post'
    });
  }

  static querySchool(): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/organization/querySchool`, {
      method: 'get'
    });
  }
}

interface showGradeResponse {
  appShowType: number;
  id: string;
  singleShowType: number;
}
interface updateShowGradeRequest {
  appShowType: number;
  id: string;
  singleShowType: number;
}
/**
 * @description 成绩设置的的网络请求
 */
export class GradeSettingServiceModal {
  static getGradeList(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/grade/setting/query`, {
      method: 'post'
    });
  }

  //成绩显示查询
  static showGrade(): HttpPromise<showGradeResponse> {
    return Axios(`${EDUCATION_URL}/grade/show/query`, {
      method: 'post'
    });
  }

  //成绩显示编辑
  static updateShowGrade(data: updateShowGradeRequest): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/grade/update/show/type`, {
      method: 'post',
      data
    });
  }

  //成绩配置编辑
  static updateGradeSetting(data: any): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/grade/setting/update`, {
      method: 'post',
      data
    });
  }

  //成绩配置重置
  static resetGradeSetting(data: string): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/grade/setting/reSet?id=${data}`, {
      method: 'post'
    });
  }
}

interface ReviewCrouseParams {
  courseId: string;
}
interface ReviewCrouseResponse {
  surplusCount: number;
  totalCount: number;
}
interface queryAllSchoolList {
  courseI: string;
  courseName: string;
  organizationId: string;
  reviewStatus: any;
  page: number;
}
interface queryAllSchoolListRequest {
  semesterId: string;
  courseId: string;
  courseName: string;
  organizationId: string;
  reviewStatus: number;
  page: number;
}
interface ReviewStatusResponse {
  generateFlag: boolean;
  lockStatus: boolean;
  reviewFlag: boolean;
  scoreGenerationTime: Date;
}
interface queryAllSchoolListResponseList {
  courseId: string;
  courseName: string;
  organizationId: string;
  reviewStatus: number;
  page: number;
}
interface queryAllSchoolListResponse {
  reviewPageVOS: queryAllSchoolListResponseList[];
  total: number;
}
interface queryAllschoolStateResponse {
  generateFlag: boolean;
  lockStatus: boolean;
  reviewFlag: boolean;
  scoreGenerationTime: string;
}

interface importClassParams {
  courseId: string;
  semesterId: string;
}
/**
 * @description 复核情况的的网络请求
 */
export class reViewServiceModal {
  //复核全校
  static reViewAllSchool(): HttpPromise<ReviewCrouseResponse> {
    return Axios(`${EDUCATION_URL}/review/allSchool`, {
      method: 'post'
    });
  }

  //获取复核列表
  static queryAllSchoolList(
    data: queryAllSchoolListRequest
  ): HttpPromise<queryAllSchoolListResponse> {
    return Axios(`${EDUCATION_URL}/review/course/queryList`, {
      method: 'post',
      data
    });
  }

  //复核、锁定状态、生成日志查询
  static queryAllschoolState(): HttpPromise<queryAllschoolStateResponse> {
    return Axios(`${EDUCATION_URL}/review/status`, {
      method: 'post'
    });
  }

  //锁定成绩
  static lockAllschoolGrade(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/review/lock`, {
      method: 'post'
    });
  }

  //生成全校成绩
  static createAllSchoolGrade(): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/generate/allSchool`, {
      method: 'post'
    });
  }

  //导出全校成绩
  static exportAllSchoolGrade(data: { semesterId: string }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/review/allSchool/export`, {
      method: 'post',
      data
    });
  }
  //导出后获取文件路径
  static getFilePath(params: { key: string }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/getFilePath`, {
      method: 'get',
      params
    });
  }

  //下载模板
  static export(): Promise<any> {
    return exportFile('get', `${EDUCATION_URL}/grade/settings/export`);
  }

  //下载其他成绩模板
  static exportOtherGrade(data: { semesterId: string }): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/all/export`,
      data
    );
  }

  //导入附加成绩
  static importGrade(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/grade/setting/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  //附加分导入情况
  static extraPointImport(): Promise<any> {
    return Axios(`${EDUCATION_URL}/grade/setting/importExtra/process`, {
      method: 'get'
    });
  }

  //导入其他成绩
  static importOtherGrade(data: any): Promise<any> {
    return Axios(
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/import/all`,
      {
        method: 'post',
        data,
        timeout: 180000, //该接口时间可能很长，延长超时时间
        onUploadProgress: onUploadProgress
      }
    );
  }

  //查询全校成绩导入情况
  static isQueryGradeImport(): Promise<any> {
    return Axios(
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/result/all`,
      {
        method: 'get'
      }
    );
  }

  //下载错误信息 (导入其他成绩  全校班级)
  static downloadExportErr(data: any): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/grade/exportErr`,
      data
    );
  }

  //下载错误信息
  static downloadErrTemplate(data: any): Promise<any> {
    return exportFile('post', `${EDUCATION_URL}/grade/setting/exportErr`, data);
  }

  // 获取复核全校进度
  static getReViewAllSchoolProgress(): HttpPromise<ReviewCrouseResponse> {
    return Axios(`${EDUCATION_URL}/review/allSchool/count`, {
      method: 'get'
    });
  }

  // 复核班级
  static reViewCrouse(
    params: ReviewCrouseParams
  ): HttpPromise<ReviewCrouseResponse> {
    return Axios(`${EDUCATION_URL}/review/course`, {
      method: 'post',
      data: params
    });
  }

  // 取消班级复核
  static cancelReViewCrouse(params: ReviewCrouseParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/review/course/cancel`, {
      method: 'post',
      data: params
    });
  }

  // 获取复核进度
  static getReViewProgress(
    params: ReviewCrouseParams
  ): HttpPromise<ReviewCrouseResponse> {
    return Axios(`${EDUCATION_URL}/review/course/count`, {
      method: 'post',
      data: params
    });
  }

  // 获取单个班级的复核状态
  static getReviewStatus(
    params: ReviewCrouseParams
  ): HttpPromise<ReviewStatusResponse> {
    return Axios(`${EDUCATION_URL}/review/course/getReviewAndLockStatus`, {
      method: 'get',
      params
    });
  }

  //下载成绩导入模板（班级）
  static exportClassTemplate(data: importClassParams): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/course/export`,
      data
    );
  }

  //导入其他成绩（班级）
  static importClassGrade(data: importClassParams): Promise<any> {
    return Axios(
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/import/course`,
      {
        method: 'post',
        data,
        timeout: 180000, //该接口时间可能很长，延长超时时间
        onUploadProgress: onUploadProgress
      }
    );
  }

  //班级查询成绩导入情况
  static queryClassImportResult(): Promise<any> {
    return Axios(
      `${EDUCATION_URL}/course/registered/record/examinationOrCoursePerformanceExcel/result/course`,
      {
        method: 'get'
      }
    );
  }
}
