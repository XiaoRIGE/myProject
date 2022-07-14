import {
  UserControlTeacherServiceModel,
  UserControlStudentServiceModel,
  UserControlManageServiceModel,
  GetuserControlTeacherListModelRequestData,
  GetuserControlStudentListModelRequestData,
  BannerServiceModal
} from '@/request/api/model/userControl';
import { HttpPromise } from '@/@types/index';
import moment from 'moment';

//查询教师列表
interface GetUserControTeacherListPresenterParams
  extends GetuserControlTeacherListModelRequestData {}

interface GetUserControTeacherListPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: UserControlTeacherInfoType[];
}

export interface UserControlTeacherInfoType {
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
}

//新增教师
interface createTeacherListPresenterParams {
  realName: string;
  gender: number;
  organizationId: string;
  mobile: string;
}

interface createTeacherListPresenterResponse {
  code: number;
  message: null;
  items: createTeacherInfoType[];
}

export interface createTeacherInfoType {
  realName: string;
  gender: number;
  mobile: string;
  organizationId: string;
  lockStatus: number;
  organizationVerified: number;
}

//修改教师
interface updateTeacherListPresenterParams {
  id: String;
  realName: String;
  gender: Number;
}

interface updateTeacherListPresenterResponse {
  code: number;
  message: null;
  items: updateTeacherInfoType[];
}

export interface updateTeacherInfoType {
  id: String;
  realName: String;
  gender: Number;
}

//查询学生
interface GetUserControStudentListPresenterParams
  extends GetuserControlStudentListModelRequestData {}

interface GetUserControStudentListPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: UserControlStudentInfoType[];
}

export interface UserControlStudentInfoType {
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
}

//新增学生
interface createStudentListPresenterParams {
  organizationUserNumber: string;
  realName: string;
  gender: number;
  organizationId: string;
  campusId: string;
  year: number;
  grade: string;
  parentOrganizationId: string;
  faceUrl: string;
}

interface createStudentListPresenterResponse {
  code: number;
  message: null;
  items: createStudentInfoType[];
}

export interface createStudentInfoType {
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
}

//修改教师
interface updateStudentListPresenterParams {
  id: string;
  organizationUserNumber: string;
  realName: string;
  gender: number;
  organizationId: string;
  campusId: string;
  year: number;
  parentOrganizationId: string;
  faceUrl: string;
}

interface updateStudentListPresenterResponse {
  code: number;
  message: null;
  items: updateStudentInfoType[];
}

export interface updateStudentInfoType {
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
}

//查询管理员

interface GetUserControManageListPresenterParams {
  page: Number;
  size: Number;
  searchCondition: null | string;
  mobile: null | string;
}

interface GetUserControManageListPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: UserControlManageInfoType[];
}

export interface UserControlManageInfoType {
  id: string;
  organizationUserNumber: null;
  realName: string;
  gender: number | string;
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
}
/**管理员、教师基本信息 */
interface getTeacherAndAdminListResponseData {
  realName: string;
  id: string;
}
/**
 * @description 用户管理教师模块请求 Presenter 层。
 */
export default class UserControlTeacherServicePresenter {
  /**
   * @description 用户管理教师查询列表
   */
  static async getUserTeacherList(
    getCollegeListPresenterParams: GetUserControTeacherListPresenterParams
  ): Promise<GetUserControTeacherListPresenterResponse> {
    const axiosResponse = await UserControlTeacherServiceModel.getUserTeacherList(
      getCollegeListPresenterParams
    );

    const resData = axiosResponse.data.data;

    let filteredData: GetUserControTeacherListPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map((item: any) => {
      item.gender === 1 ? (item.gender = '男') : (item.gender = '女');
      item.ifState = 1;
      //ifState为0:已锁定 ifState为1:未激活 ifState为2:已激活
      if (item.lockStatus === 0) {
        if (item.organizationVerified === 0) {
          item.ifState = 1;
        } else {
          item.ifState = 2;
        }
      } else {
        item.ifState = 0;
      }
      return {
        birthDay: item.birthDay,
        campusId: item.campusId,
        campusName: item.campusName,
        gender: item.gender,
        grade: item.grade,
        id: item.id,
        lockStatus: item.lockStatus,
        mobile: item.mobile,
        organizationId: item.organizationId,
        organizationName: item.organizationName,
        organizationUserNumber: item.organizationUserNumber,
        organizationVerified: item.organizationVerified,
        parentOrganizationId: item.parentOrganizationId,
        realName: item.realName,
        year: item.year,
        ifState: item.ifState
      };
    });

    return filteredData;
  }

  /**
   * @description 获取所有管理员和教师列表
   */
  static async getTeacherAndAdminList(): Promise<
    getTeacherAndAdminListResponseData[]
  > {
    const axiosResponse = await UserControlTeacherServiceModel.getTeacherAndAdminList();
    return axiosResponse.data.data;
  }

  /**
   * @description 新增教师
   */
  static async createTeacher(
    params: createTeacherListPresenterParams
  ): Promise<createTeacherListPresenterResponse> {
    const axiosResponse = await UserControlTeacherServiceModel.createTeacher(
      params
    );

    const resData = axiosResponse.data.data;

    let filteredData: createTeacherListPresenterResponse = {
      code: resData.code,
      message: resData.message,
      items: []
    };

    return filteredData;
  }

  /**
   * @description 修改教师
   */
  static async updateTeacher(
    params: updateTeacherListPresenterParams
  ): Promise<updateTeacherListPresenterResponse> {
    const axiosResponse = await UserControlTeacherServiceModel.updateTeacher(
      params
    );

    const resData = axiosResponse.data.data;

    let filteredData: updateTeacherListPresenterResponse = {
      code: resData.code,
      message: resData.message,
      items: []
    };

    return filteredData;
  }

  /**
   * @description 教师下载模板
   */
  static async exportTeacherExcelTemplate(): Promise<any> {
    const axiosResponse = await UserControlTeacherServiceModel.exportTeacherExcelTemplate();
    return axiosResponse;
  }

  static async deleteSTeacher(data: any): Promise<any> {
    const axiosResponse = await UserControlTeacherServiceModel.deleteSTeacher(
      data
    );
    return axiosResponse;
  }

  static async batchImportTeacher(data: any): Promise<any> {
    const axiosResponse = await UserControlTeacherServiceModel.batchImportTeacher(
      data
    );
    return axiosResponse;
  }

  static async exportTeacherErr(data: any): Promise<any> {
    const axiosResponse = await UserControlTeacherServiceModel.exportTeacherErr(
      data
    );
    return axiosResponse;
  }

  static async batchExportTeacher(data: any): Promise<any> {
    const axiosResponse = await UserControlTeacherServiceModel.batchExportTeacher(
      data
    );
    return axiosResponse;
  }
}

/**
 * @description 用户管理学生模块请求 Presenter 层。
 */
export class UserControlStudentServicePresenter {
  /**
   * @description 用户管理教师查询列表
   */
  static async getUserStudentList(
    getCollegeListPresenterParams: GetUserControStudentListPresenterParams
  ): Promise<GetUserControStudentListPresenterResponse> {
    const axiosResponse = await UserControlStudentServiceModel.getUserStudentList(
      getCollegeListPresenterParams
    );

    const resData = axiosResponse.data.data;

    let filteredData: GetUserControStudentListPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map(
      (item: UserControlStudentInfoType) => {
        item.ifState = 1;
        //ifState为0:已锁定 ifState为1:未激活 ifState为2:已激活
        if (item.lockStatus === 0) {
          if (item.organizationVerified === 0) {
            item.ifState = 1;
          } else {
            item.ifState = 2;
          }
        } else {
          item.ifState = 0;
        }
        item.gender === 1 ? (item.gender = '男') : (item.gender = '女');
        return {
          id: item.id,
          organizationUserNumber: item.organizationUserNumber,
          realName: item.realName,
          gender: item.gender,
          organizationId: item.organizationId,
          organizationName: item.organizationName,
          parentOrganizationId: item.parentOrganizationId,
          campusId: item.campusId,
          campusName: item.campusName,
          year: item.year,
          mobile: item.mobile,
          lockStatus: item.lockStatus,
          organizationVerified: item.organizationVerified,
          ifState: item.ifState
        };
      }
    );

    return filteredData;
  }

  /**
   * @description 新增学生
   */
  static async createStudent(
    params: createStudentListPresenterParams
  ): Promise<createStudentListPresenterResponse> {
    const axiosResponse = await UserControlStudentServiceModel.createStudent(
      params
    );
    const resData = axiosResponse.data.data;
    let filteredData: createStudentListPresenterResponse = {
      code: resData.code,
      message: resData.message,
      items: []
    };

    return filteredData;
  }

  /**
   * @description 修改学生
   */
  static async updateStudent(
    params: updateStudentListPresenterParams
  ): Promise<updateStudentListPresenterResponse> {
    const axiosResponse = await UserControlStudentServiceModel.updateStudent(
      params
    );

    const resData = axiosResponse.data.data;

    let filteredData: updateStudentListPresenterResponse = {
      code: resData.code,
      message: resData.message,
      items: []
    };

    return filteredData;
  }

  static async deleteStudent(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.deleteStudent(data);
    return axiosRes;
  }

  static async exportStudentExcelTemplate(): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.exportStudentExcelTemplate();
    return axiosRes;
  }

  static async batchImportStudent(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.batchImportStudent(
      data
    );
    return axiosRes;
  }

  static async batchExportStudent(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.batchExportStudent(
      data
    );
    return axiosRes;
  }

  static async exportErr(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.exportErr(data);
    return axiosRes;
  }

  static async queryallOrganization(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.queryallOrganization(
      data
    );
    return axiosRes;
  }

  static async resetStudent(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlStudentServiceModel.resetStudent(data);
    return axiosRes;
  }
}

export interface CreateManageRequestData {
  realName: String;
  gender: number;
  organizationId: String;
  mobile: String;
}

export interface UpdateManageRequestData {
  id: string;
  realName: string;
  gender: number;
}
/**
 * @description 用户管理管理员请求 Presenter 层。
 */
export class UserControlManageServicePresenter {
  /**
   * @description 用户管理管理员查询列表
   */
  static async getUserManageList(
    getCollegeListPresenterParams: GetUserControManageListPresenterParams
  ): Promise<GetUserControManageListPresenterResponse> {
    const axiosResponse = await UserControlManageServiceModel.queryManagerList(
      getCollegeListPresenterParams
    );

    const resData = axiosResponse.data.data;

    let filteredData: GetUserControManageListPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map(
      (item: UserControlManageInfoType) => {
        item.ifState = 1;
        //ifState为0:已锁定 ifState为1:未激活 ifState为2:已激活
        if (item.lockStatus === 0) {
          if (item.organizationVerified === 0) {
            item.ifState = 1;
          } else {
            item.ifState = 2;
          }
        } else {
          item.ifState = 0;
        }
        item.gender === 1 ? (item.gender = '男') : (item.gender = '女');

        return {
          id: item.id,
          organizationUserNumber: item.organizationUserNumber,
          realName: item.realName,
          gender: item.gender,
          organizationId: item.organizationId,
          organizationName: item.organizationName,
          parentOrganizationId: item.parentOrganizationId,
          campusId: item.campusId,
          campusName: item.campusName,
          birthDay: item.birthDay,
          year: item.year,
          mobile: item.mobile,
          lockStatus: item.lockStatus,
          organizationVerified: item.organizationVerified,
          ifState: item.ifState
        };
      }
    );

    return filteredData;
  }

  static async createManage(
    data: CreateManageRequestData
  ): Promise<HttpPromise> {
    const axiosRes = await UserControlManageServiceModel.createManage(data);
    return axiosRes;
  }

  static async updateManage(
    data: UpdateManageRequestData
  ): Promise<HttpPromise> {
    const axiosRes = await UserControlManageServiceModel.updateManage(data);
    return axiosRes;
  }

  static async deleteManage(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlManageServiceModel.deleteManage(data);
    return axiosRes;
  }

  static async batchExportManage(data: any): Promise<HttpPromise> {
    const axiosRes = await UserControlManageServiceModel.batchExportManage(
      data
    );
    return axiosRes;
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
 * @description 用户管理管理员请求 Presenter 层。
 */
export class BannerServiceModalPresenter {
  static async getBanner(
    data: getBannerRequestData
  ): Promise<getBannerResponseData[]> {
    const axiosRes = await BannerServiceModal.getBanner(data);
    const axiosArr = axiosRes.data.data;
    let count = 0; //共几张开启
    axiosArr.forEach((key, index, arr) => {
      key.createdDate = moment(key.createdDate).format('YYYY-MM-DD HH:mm');
      key.openStatus = !key.open ? false : true;

      index === 0 ? (key.isUp = 0) : (key.isUp = 1);
      key.isDown = 0;

      if (key.open === 1) {
        count++;
      }
      arr[0].isDown = count === 1 ? 1 : 0; //如果只有一张开启 不显示下箭头
      if (key.open === 0 && index > 0) {
        arr[index - 1].isDown = 1;
        return;
      }
      if ((index = arr.length - 1)) {
        //最后一张是开启 这张不显示下箭头
        if (key.open === 1) {
          arr[arr.length - 1].isDown = 1;
        }
      }
    });
    return axiosRes.data.data;
  }

  static async addBanner(data: addBannerRequestParams): Promise<null> {
    const axiosRes = await BannerServiceModal.addBanner(data);
    return axiosRes.data.data;
  }

  static async delBanner(data: delBannerRequestParams): Promise<null> {
    const axiosRes = await BannerServiceModal.delBanner(data);
    return axiosRes.data.data;
  }

  static async switchBanner(data: switchBannerRequestParams): Promise<null> {
    const axiosRes = await BannerServiceModal.switchBanner(data);
    return axiosRes.data.data;
  }

  static async moveBanner(data: moveBannerRequestParams): Promise<null> {
    const axiosRes = await BannerServiceModal.moveBanner(data);
    return axiosRes.data.data;
  }

  static async updateBanner(data: updateBannerRequestParams): Promise<null> {
    const axiosRes = await BannerServiceModal.updateBanner(data);
    return axiosRes.data.data;
  }
}
