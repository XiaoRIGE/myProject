import {
  SemesterServiceModel,
  GetSchoolSettingSemesterQueryRequestData,
  CampusServiceModal,
  CollegeServiceModal,
  GradeSettingServiceModal,
  reViewServiceModal
} from '@/request/api/model/schoolSetting';
import { CampusInfo, HttpPromise } from '@/@types';
import moment from 'moment';

interface GetSchoolSettingSemesterQueryPresenterParms
  extends GetSchoolSettingSemesterQueryRequestData {}

interface GetSchoolSettingSemesterQueryPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: SchoolSettingSemesterInfoType[];
}

export interface CreateSchoolSettingSemesterRequestData {
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
}

export interface SchoolSettingSemesterInfoType {
  organizationId: string;
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
  id: string;
}

export interface UpdateSchoolSettingSemesterRequestData {
  id: string;
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
}

//校区
interface GetSchoolSettingCampusQueryPresenterParms {
  page: number;
  size: number;
  organizationId: string;
}

interface GetSchoolSettingCampusQueryPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: SchoolSettingCampusInfoType[];
}

export interface SchoolSettingCampusInfoType {
  name: string;
  organizationId: string;
  id: string;
}

const dateForm = (value: any) => {
  //日期转换
  const t = new Date(value);
  const year = t.getFullYear();
  let month = t.getMonth() + 1;
  let day = t.getDate();
  if (month.toString.length === 1) {
    month = parseInt(`0${month}`);
  }
  if (day.toString.length === 1) {
    day = parseInt(`0${day}`);
  }
  const hash = `${year}-` + `${month}-` + `${day}`;
  return hash;
};
/**
 * @description 学期模块的的网络请求
 */

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
interface semesterResponseMap {
  id: string;
  semesterInfo: string;
  current: number;
  weekStr: string;
  startDate: number;
  endDate: number;
}

export default class SemesterServicePresenter {
  /**
   * @description 学期列表请求
   */
  static async getSemesterList(
    data: GetSchoolSettingSemesterQueryPresenterParms
  ): Promise<GetSchoolSettingSemesterQueryPresenterResponse> {
    const axiosResponse = await SemesterServiceModel.getRoleInfoList(data);
    const resData = axiosResponse.data.data;

    let filteredData: GetSchoolSettingSemesterQueryPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map((item: any) => {
      item.index === 1 ? (item.index = '上学期') : (item.index = '下学期');
      item.yearRange = `${item.yearRange}学年`;
      item.startDate = dateForm(item.startDate);
      item.endDate = dateForm(item.endDate);
      return {
        organizationId: item.organizationId,
        startDate: item.startDate,
        endDate: item.endDate,
        yearRange: item.yearRange,
        index: item.index,
        id: item.id
      };
    });

    return filteredData;
  }

  static async createSemester(
    data: CreateSchoolSettingSemesterRequestData
  ): Promise<HttpPromise> {
    const axiosRes = await SemesterServiceModel.createSemester(data);
    return axiosRes;
  }

  static async updateSemester(
    data: UpdateSchoolSettingSemesterRequestData
  ): Promise<HttpPromise> {
    const axiosRes = await SemesterServiceModel.updateSemester(data);
    return axiosRes;
  }

  static async getSemesterTime(): Promise<HttpPromise> {
    const axiosRes = await SemesterServiceModel.getSemesterTime();
    return axiosRes;
  }

  static async deleteSemester(data: any): Promise<HttpPromise> {
    const axiosRes = await SemesterServiceModel.deleteSemester(data);
    return axiosRes;
  }

  // 获取全部学期
  static async getAllSemester(): Promise<semesterResponseMap[]> {
    const axiosRes = await SemesterServiceModel.getAllSemester();
    return axiosRes.data.data.map((item: semesterResponse) => {
      const semesterStr = item.index === 1 ? '上学期' : '下学期';
      const weekStr = item.weekIndex ? `第${item.weekIndex}周` : '';
      return {
        id: item.id,
        semesterInfo: `${item.yearRange}学年${semesterStr}`,
        current: item.current,
        weekStr,
        startDate: item.startDate,
        endDate: item.endDate
      };
    });
  }
}

export class CampusServicePresenter {
  /**
   * @description 校区列表请求
   */
  static async getCampusService(
    data: GetSchoolSettingCampusQueryPresenterParms
  ): Promise<GetSchoolSettingCampusQueryPresenterResponse> {
    const axiosResponse = await CampusServiceModal.getCampusService(data);
    const resData = axiosResponse.data.data;

    let filteredData: GetSchoolSettingCampusQueryPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map((item: any) => {
      return {
        name: item.name,
        organizationId: item.organizationId,
        id: item.id
      };
    });

    return filteredData;
  }

  static async createCampus(data: {
    name: string;
    prganizationId: string;
  }): Promise<HttpPromise> {
    const axiosRes = await CampusServiceModal.createCampus(data);
    return axiosRes;
  }

  static async updateCampus(data: {
    id: string;
    name: string;
    prganizationId: string;
  }): Promise<HttpPromise> {
    const axiosRes = await CampusServiceModal.updateCampus(data);
    return axiosRes;
  }

  static async delateCampus(data: any): Promise<HttpPromise> {
    const axiosRes = await CampusServiceModal.delateCampus(data);
    return axiosRes;
  }

  static async queryAllCampus(data: any): Promise<HttpPromise> {
    const axiosRes = await CampusServiceModal.queryAllCampus(data);
    return axiosRes;
  }

  static async getCampusList(): Promise<CampusInfo[]> {
    const response = await CampusServiceModal.queryAllCampus('');
    return response.data.data;
  }
}

//学院
interface GetSchoolSettingCollegeQueryPresenterParms {
  page: number;
  size: number;
  parentId: string;
}

interface GetSchoolSettingCollegeQueryPresenterResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  items: SchoolSettingCollegeInfoType[];
}

export interface SchoolSettingCollegeInfoType {
  name: string;
  id: string;
}
export class CollegeServicePresenter {
  /**
   * @description 学院列表请求
   */
  static async getCampusService(
    data: GetSchoolSettingCollegeQueryPresenterParms
  ): Promise<GetSchoolSettingCollegeQueryPresenterResponse> {
    const axiosResponse = await CollegeServiceModal.getCollegeList(data);
    const resData = axiosResponse.data.data;

    let filteredData: GetSchoolSettingCollegeQueryPresenterResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: []
    };

    filteredData.items = resData.items.map((item: any) => {
      return {
        name: item.name,
        id: item.id
      };
    });

    return filteredData;
  }

  static async createCollege(data: {
    name: string;
    parentId: string;
  }): Promise<HttpPromise> {
    const axiosRes = await CollegeServiceModal.createCollege(data);
    return axiosRes;
  }

  static async updateCollege(data: {
    id: string;
    name: string;
    parentId: string;
  }): Promise<HttpPromise> {
    const axiosRes = await CollegeServiceModal.updateCollege(data);
    return axiosRes;
  }

  static async delate(data: any): Promise<HttpPromise> {
    const axiosRes = await CollegeServiceModal.delate(data);
    return axiosRes;
  }

  // 查询学校接口
  static async querySchool(): Promise<any> {
    const axiosRes = await CollegeServiceModal.querySchool();
    return axiosRes;
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
export class GradeSettingServicePresenter {
  /**
   * @description 成绩设置
   */
  static async getGradeList(): Promise<any> {
    const axiosResponse = await GradeSettingServiceModal.getGradeList();
    const resData = axiosResponse.data.data;
    const resArr = resData.map((item: any) => {
      //年级 schoolyear
      let year = '';
      switch (item.schoolYear) {
        case 1:
          year = '大一';
          break;
        case 2:
          year = '大二';
          break;
        case 3:
          year = '大三';
          break;
        case 4:
          year = '大四';
          break;
      }

      return {
        ...item,
        schoolYear: year,
        semesterType: item.semesterType === 1 ? '上学期' : '下学期',
        sign: item.sign === null ? '-' : item.sign,
        running: item.running === null ? '-' : item.running,
        activity: item.activity === null ? '-' : item.activity,
        coursePerformance:
          item.coursePerformance === null ? '-' : item.coursePerformance,
        fitness: item.fitness === null ? '-' : item.fitness,
        theoryExamination:
          item.theoryExamination === null ? '-' : item.theoryExamination,
        specialExamination:
          item.specialExamination === null ? '-' : item.specialExamination
      };
    });
    return resArr;
  }

  //成绩显示查询
  static async showGrade(): Promise<showGradeResponse> {
    const axiosResponse = await GradeSettingServiceModal.showGrade();
    return axiosResponse.data.data;
  }

  //成绩显示编辑
  static async updateShowGrade(data: updateShowGradeRequest): Promise<null> {
    const axiosResponse = await GradeSettingServiceModal.updateShowGrade(data);
    return axiosResponse.data.data;
  }

  //成绩配置编辑
  static async updateGradeSetting(data: any): Promise<null> {
    const axiosResponse = await GradeSettingServiceModal.updateGradeSetting(
      data
    );
    return axiosResponse.data.data;
  }

  //成绩配置重置
  static async resetGradeSetting(data: string): Promise<null> {
    const axiosResponse = await GradeSettingServiceModal.resetGradeSetting(
      data
    );
    return axiosResponse.data.data;
  }
}
interface ReviewCrouseParams {
  courseId: string;
}
interface ReviewCrouseResponse {
  surplusCount: number;
  totalCount: number;
}
interface ReviewCrouseResponseMap {
  surplusCount: number;
  totalCount: number;
  finishedCount: number;
  process: number;
}
interface queryAllSchoolList {
  courseI: string;
  courseName: string;
  organizationId: string;
  reviewStatus: any;
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
interface queryAllSchoolListRequest {
  semesterId: string;
  courseId: string;
  courseName: string;
  organizationId: string;
  reviewStatus: any;
  page: number;
}

export class reViewServicePresenter {
  /**
   * @description 成绩复核
   */
  //复核全校
  static async reViewAllSchool(): Promise<ReviewCrouseResponse> {
    const axiosResponse = await reViewServiceModal.reViewAllSchool();
    return axiosResponse.data.data;
  }

  //获取复核列表
  static async queryAllSchoolList(
    data: queryAllSchoolListRequest
  ): Promise<queryAllSchoolListResponse> {
    const axiosResponse = await reViewServiceModal.queryAllSchoolList(data);
    return axiosResponse.data.data;
  }

  //获取复核全校进度
  static async getReViewAllSchoolProgress(): Promise<ReviewCrouseResponseMap> {
    const axiosResponse = await reViewServiceModal.getReViewAllSchoolProgress();

    const { totalCount, surplusCount } = axiosResponse.data.data;

    const finishedCount = totalCount - surplusCount; //已复核人数

    const process = Number(((finishedCount / totalCount) * 100).toFixed(2));

    return {
      totalCount,
      surplusCount,
      finishedCount,
      process
    };
  }

  //复核、锁定状态、生成日志查询
  static async queryAllschoolState(): Promise<queryAllschoolStateResponse> {
    const axiosResponse = await reViewServiceModal.queryAllschoolState();
    let time = axiosResponse.data.data.scoreGenerationTime;
    axiosResponse.data.data.scoreGenerationTime = moment(time).format(
      'YYYY-MM-DD hh-mm-ss'
    );
    return axiosResponse.data.data;
  }

  //锁定成绩
  static async lockAllschoolGrade(): Promise<null> {
    const axiosResponse = await reViewServiceModal.lockAllschoolGrade();
    return axiosResponse.data.data;
  }

  //生成全校成绩
  static async createAllSchoolGrade(): Promise<null> {
    const axiosResponse = await reViewServiceModal.createAllSchoolGrade();
    return axiosResponse.data.data;
  }

  //导出全校成绩
  static async exportAllSchoolGrade(data: {
    semesterId: string;
  }): Promise<null> {
    const axiosResponse = await reViewServiceModal.exportAllSchoolGrade(data);
    return axiosResponse.data.data;
  }
  //导出后获取文件路径
  static async getFilePath(params: { key: any }): Promise<string> {
    const axiosResponse = await reViewServiceModal.getFilePath(params);
    return axiosResponse.data.data;
  }

  //复核班级
  static async reViewCrouse(
    params: ReviewCrouseParams
  ): Promise<ReviewCrouseResponse> {
    const axiosResponse = await reViewServiceModal.reViewCrouse(params);
    return axiosResponse.data.data;
  }
  //取消班级复核
  static async cancelReViewCrouse(params: ReviewCrouseParams): Promise<null> {
    const axiosResponse = await reViewServiceModal.cancelReViewCrouse(params);
    return axiosResponse.data.data;
  }
  //获取班级复核进度
  static async getReViewProgress(
    params: ReviewCrouseParams
  ): Promise<ReviewCrouseResponseMap> {
    const axiosResponse = await reViewServiceModal.getReViewProgress(params);

    const { totalCount, surplusCount } = axiosResponse.data.data;

    const finishedCount = totalCount - surplusCount; //已复核人数

    const process = Number(((finishedCount / totalCount) * 100).toFixed(2));

    return {
      totalCount,
      surplusCount,
      finishedCount,
      process
    };
  }

  //取消班级复核
  static async getReviewStatus(
    params: ReviewCrouseParams
  ): Promise<ReviewStatusResponse> {
    const axiosResponse = await reViewServiceModal.getReviewStatus(params);
    return axiosResponse.data.data;
  }
}
