/**
 * @description: 用户管理模块接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';

import ApiPrefix from '@/request/config/prefix';
import { onUploadProgress } from '@/utils/common';
const AUTHORIZATION_URL = ApiPrefix.AUTHORIZATION;

export interface GetuserControlTeacherListModelRequestData {
  page: number;
  size: number;
  searchCondition: null | string;
  mobile: null | string;
  year: null | string;
  organizationId: null | string;
}

export interface GetuserControlTeacherListModelResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    birthDay: null;
    campusId: null;
    campusName: null;
    gender: number | string;
    grade: null;
    id: string;
    lockStatus: number;
    mobile: string;
    organizationId: string;
    organizationName: string;
    organizationUserNumber: null;
    organizationVerified: number;
    parentOrganizationId: null;
    realName: string;
    year: null;
    ifState: number;
  }[];
}

/**管理员、教师基本信息 */
interface getTeacherAndAdminListResponseData {
  realName: string;
  id: string;
}

export interface CreateTeacherManageRequestData {
  realName: string;
  gender: number;
  organizationId: string;
  mobile: string;
}

export interface CreateTeacherManageResponseData {
  code: number;
  message: null;
  items: {
    realName: string;
    gender: number;
    mobile: string;
    organizationId: string;
    lockStatus: number;
    organizationVerified: number;
  }[];
}

export interface UpdateTeacherManageRequestData {
  id: String;
  realName: String;
  gender: Number;
}

export interface UpdateTeacherManageResponseData {
  code: number;
  message: null;
  items: {
    realName: string;
    gender: number;
    id: string;
  }[];
}

//学生

export interface GetuserControlStudentListModelRequestData {
  page: Number;
  size: Number;
  searchCondition: null | string;
  mobile: null | string;
  year: null | number;
  organizationId: null | string;
}

export interface GetuserControlStudentListModelResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    id: string;
    organizationUserNumber: string;
    realName: string;
    gender: number | string;
    organizationId: string;
    organizationName: string;
    parentOrganizationId: null;
    campusId: string;
    campusName: string;
    year: number;
    mobile: string;
    lockStatus: number;
    organizationVerified: number;
    ifState: number;
  }[];
}

export interface CreateStudentManageRequestData {
  organizationUserNumber: string;
  realName: string;
  gender: number;
  organizationId: string;
  campusId: string;
  year: number;
  grade: string;
  parentOrganizationId: string;
}

export interface CreateStudentManageResponseData {
  code: number;
  message: null;
  items: {
    id: string;
    organizationUserNumber: string;
    realName: string;
    gender: number;
    organizationId: string;
    parentOrganizationId: string;
    campusId: string;
    year: number;
    mobile: null;
    lockStatus: number;
    organizationVerified: number;
  }[];
}

export interface UpdateStudentManageRequestData {
  id: string;
  organizationUserNumber: string;
  realName: string;
  gender: number;
  organizationId: string;
  campusId: string;
  year: number;
  parentOrganizationId: string;
}

export interface UpdateStudentManageResponseData {
  code: number;
  message: null;
  items: {
    id: string;
    organizationUserNumber: string;
    realName: string;
    gender: number;
    organizationId: string;
    parentOrganizationId: string;
    campusId: string;
    year: number;
    mobile: null;
    lockStatus: number;
    organizationVerified: number;
  }[];
}

//管理员
export interface GetuserControlManageListModelRequestData {
  page: Number;
  size: Number;
  searchCondition: null | string;
  mobile: null | string;
}

export interface GetuserControlManageListModelResponseData {
  pageNum: number;
  pageSize: number;
  total: number;
  items: {
    id: string;
    organizationUserNumber: null;
    realName: string;
    gender: number;
    organizationId: string;
    organizationName: string;
    parentOrganizationId: null;
    campusId: null;
    campusName: null;
    birthDay: null;
    year: null;
    mobile: string;
    lockStatus: number;
    organizationVerified: number;
    ifState: number;
  }[];
}

export interface UpdateManageRequestData {
  id: string;
  realName: string;
  gender: number;
}

export interface UpdateManageResponseData {
  code: number;
  message: null;
  items: {
    id: string;
    realName: string;
    gender: number;
  }[];
}

export interface CreateManageRequestData {
  realName: String;
  gender: number;
  organizationId: String;
  mobile: String;
}

export interface CreateManageResponseData {
  code: number;
  message: null;
  items: {
    realName: String;
    gender: number;
    mobile: String;
    organizationId: String;
    lockStatus: number;
    organizationVerified: number;
  }[];
}
/**
 * @description 用户管理模块请求 Model 层
 */
export class UserControlTeacherServiceModel {
  /**
   * @description 获取教师用户列表接口
   */
  static getUserTeacherList(
    getUserTeacherListParams: GetuserControlTeacherListModelRequestData
  ): HttpPromise<GetuserControlTeacherListModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/teacher/query`, {
      method: 'post',
      data: getUserTeacherListParams
    });
  }

  /**
   * @description 获取所有管理员和教师列表
   */
  static getTeacherAndAdminList(): HttpPromise<
    getTeacherAndAdminListResponseData[]
  > {
    return Axios(`${AUTHORIZATION_URL}/teacher/queryList/all`, {
      method: 'get'
    });
  }

  /**
   * @description 新增教师用户
   */
  static createTeacher(
    params: CreateTeacherManageRequestData
  ): HttpPromise<CreateTeacherManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/teacher/create`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 更新教师用户
   */
  static updateTeacher(
    params: UpdateTeacherManageRequestData
  ): HttpPromise<UpdateTeacherManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/teacher/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 删除教师用户
   */
  static deleteSTeacher(params: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/teacher/delete?id=${params}`, {
      method: 'delete'
    });
  }

  /**
   * @description 教师下载模板
   */
  //todo
  static exportTeacherExcelTemplate(): Promise<any> {
    return exportFile('post', `${AUTHORIZATION_URL}/teacher/export/temp`);
  }

  /**
   * @description 批量导入模板接口
   */
  static batchImportTeacher(data: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/teacher/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 导出错误接口
   */
  static exportTeacherErr(params: any): Promise<any> {
    return exportFile(
      'post',
      `${AUTHORIZATION_URL}/teacher/exportErr`,
      params,
      '教师导出名单'
    );
  }

  /**
   * @description 批量导出模板接口
   */
  static batchExportTeacher(params: any): Promise<any> {
    return exportFile(
      'post',
      `${AUTHORIZATION_URL}/teacher/export`,
      params,
      '教师导出名单'
    );
  }
}

export class UserControlStudentServiceModel {
  /**
   * @description 获取学生用户列表接口
   */
  static getUserStudentList(
    getUserStudentListParams: GetuserControlStudentListModelRequestData
  ): HttpPromise<GetuserControlStudentListModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/student/query`, {
      method: 'post',
      data: getUserStudentListParams
    });
  }

  /**
   * @description 新增学生
   */
  static createStudent(
    params: CreateStudentManageRequestData
  ): HttpPromise<CreateStudentManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/student/create`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 修改学生
   */
  static updateStudent(
    params: UpdateStudentManageRequestData
  ): HttpPromise<UpdateStudentManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/student/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 删除学生用户
   */
  static deleteStudent(params: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/student/delete?id=${params}`, {
      method: 'delete'
    });
  }

  /**
   * @description 学生下载模板
   */
  //todo
  static exportStudentExcelTemplate(): Promise<any> {
    return exportFile('post', `${AUTHORIZATION_URL}/student/export/temp`);
  }

  /**
   * @description 批量导入模板接口
   */
  static batchImportStudent(data: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/student/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 导出错误接口
   */
  static exportErr(params: any): Promise<any> {
    return exportFile(
      'post',
      `${AUTHORIZATION_URL}/student/exportErr`,
      params,
      '学生导出名单'
    );
  }

  /**
   * @description 批量导出模板接口
   */
  static batchExportStudent(params: any): Promise<any> {
    return exportFile(
      'post',
      `${AUTHORIZATION_URL}/student/export`,
      params,
      '学生导出名单'
    );
  }

  /**
   * @description 查询所有学院接口
   * @return {HttpResponse} result
   */
  static queryallOrganization(data: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/organization/queryAll?id=${data}`, {
      method: 'post'
    });
  }

  /**
   * @description 设置学生未激活
   */
  static resetStudent(data: { id: string }): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/student/reset`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    });
  }
}

export class UserControlManageServiceModel {
  /**
   * @description 获取管理员用户列表接口
   */
  static queryManagerList(
    params: GetuserControlManageListModelRequestData
  ): HttpPromise<GetuserControlManageListModelResponseData> {
    return Axios(`${AUTHORIZATION_URL}/admin/query`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 新增管理员
   */
  static createManage(
    params: CreateManageRequestData
  ): HttpPromise<CreateManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/admin/create`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 修改管理员
   */
  static updateManage(
    params: UpdateManageRequestData
  ): HttpPromise<UpdateManageResponseData> {
    return Axios(`${AUTHORIZATION_URL}/admin/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 删除管理员用户
   */
  static deleteManage(params: any): Promise<any> {
    return Axios(`${AUTHORIZATION_URL}/admin/delete?id=${params}`, {
      method: 'delete'
    });
  }

  /**
   * @description 批量导出模板接口
   */
  static batchExportManage(params: any): Promise<any> {
    return exportFile(
      'post',
      `${AUTHORIZATION_URL}/admin/export`,
      params,
      '管理员导出名单'
    );
  }
}

interface getBannerRequestData {
  keyword: string;
}
interface getBannerResponseData {
  article: string;
  author: string;
  createdDate: any;
  id: string;
  open: number;
  openStatus: boolean;
  readNumber: number;
  title: string;
  urls: string[];
  isUp: number;
  isDown: number;
}
interface addBannerRequestParams {
  article: string;
  author: string;
  createdDate: number;
  open: number | undefined;
  readNumber: number;
  title: string;
  urls: string[];
}
interface delBannerRequestParams {
  id: string;
}
interface switchBannerRequestParams {
  id: string;
}
interface moveBannerRequestParams {
  id1: string;
  id2: string;
}
interface updateBannerRequestParams {
  article: string;
  author: string;
  createdDate: number;
  id: string;
  open: number | undefined;
  readNumber: number;
  title: string;
  urls: string[];
}
/**
 * @description banner配置页面的的网络请求
 */
export class BannerServiceModal {
  static getBanner(
    getBannerParams: getBannerRequestData
  ): HttpPromise<getBannerResponseData[]> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/list`, {
      method: 'post',
      data: getBannerParams
    });
  }

  static addBanner(addBannerParams: addBannerRequestParams): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/save`, {
      method: 'post',
      data: addBannerParams
    });
  }

  static delBanner(delBannerParams: delBannerRequestParams): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/delete`, {
      method: 'post',
      data: delBannerParams
    });
  }

  static switchBanner(
    switchBannerParams: switchBannerRequestParams
  ): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/update/status`, {
      method: 'post',
      data: switchBannerParams
    });
  }

  static moveBanner(
    moveBannerParams: moveBannerRequestParams
  ): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/move`, {
      method: 'post',
      data: moveBannerParams
    });
  }

  static updateBanner(
    updateBannerParams: updateBannerRequestParams
  ): HttpPromise<null> {
    return Axios(`${AUTHORIZATION_URL}/banner/detail/edit`, {
      method: 'post',
      data: updateBannerParams
    });
  }
}
