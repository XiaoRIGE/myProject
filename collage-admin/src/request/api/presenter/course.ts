import {
  ProjectServices,
  BaseCourseService,
  ClassServices,
  ActivityThemeConfiguration,
  ActivityLimitManage,
  OnceActivityList
} from '../model/course';
import { ListParamType, HttpPromise, BaseObj } from '@/@types/index';
import moment from 'moment';

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

// 项目（课程）管理模块
export class ProjectServicePresenter {
  // 获取项目列表
  static async getList(params: ListParamType): Promise<ProjectResponse> {
    const axiosRes = await ProjectServices.list(params);
    const resData = axiosRes.data.data;
    let filterData: ProjectResponse = {
      pageNum: resData.pageNum,
      pageSize: resData.pageSize,
      total: resData.total,
      items: resData.items
    };
    return filterData;
  }

  // 添加项目
  static async add(params: AddProjectParams): Promise<HttpPromise> {
    const axiosRes = await ProjectServices.add(params);
    return axiosRes;
  }

  // 更新项目
  static async update(params: UpdateProjectParams): Promise<HttpPromise> {
    const axiosRes = await ProjectServices.update(params);
    return axiosRes;
  }

  // 更新项目名字
  static async delete(params: DeleteProjectParams): Promise<HttpPromise> {
    const axiosRes = await ProjectServices.delete(params);
    return axiosRes;
  }
}

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
// 界面需要的时间下拉数据格式类型
interface timeAllocationSelectResponse {
  key: string;
  value: string;
  startTime: number;
  endTime: number;
}
interface CollegeResponse {
  id: string;
  name: string;
  parentId: string | null;
}
interface BaseItem {
  key: string;
  value: string;
  title: string;
}
interface semesterParams {
  semesterId: string;
}

// 班级设置基础下拉type end

// 班级设置基础下拉数据模块
export class BaseCourseServicePresenter {
  // 获取项目(课程)列表下拉
  static async getProjectList(): Promise<BaseObj[]> {
    const axiosRes = await BaseCourseService.projectList();
    const resData = axiosRes.data.data;

    let result = resData.map((item: any) => {
      return {
        key: item.id,
        value: item.name
      };
    });
    return result;
  }
  // 获取年级列表下拉
  static async getGradeList(params: semesterParams): Promise<BaseObj[]> {
    const axiosRes = await BaseCourseService.yearList(params);
    const resData = axiosRes.data.data;

    let result = resData.map((item: string) => {
      return {
        key: item,
        value: item
      };
    });
    return result;
  }
  //   获取校区列表下拉
  static async getCampusList(): Promise<BaseObj[]> {
    const axiosRes = await BaseCourseService.campusList();
    const resData = axiosRes.data.data;

    let result = resData.map((item: any) => {
      return {
        key: item.id,
        value: item.name
      };
    });
    return result;
  }
  // 获取星期下拉
  static async getWeekType(): Promise<BaseObj> {
    const axiosRes = await BaseCourseService.weekType();
    const resData = axiosRes.data.data;
    return resData;
  }
  // 获取课程类型下拉
  static async getCourseType(): Promise<BaseObj> {
    const axiosRes = await BaseCourseService.courseType();
    const resData = axiosRes.data.data;
    return resData;
  }
  // 获取老师列表下拉
  static async getTeacherList(params: TeacherParams): Promise<BaseObj[]> {
    const axiosRes = await BaseCourseService.teacherList(params);
    const resData = axiosRes.data.data;
    if (resData && resData.length) {
      let result = resData.map((item: any) => {
        return {
          key: item.id,
          value: item.name
        };
      });
      return result;
    }
    return [];
  }
  // 获取学生列表下拉
  static async getStudentList(
    params: StudentListParams
  ): Promise<StudentListResponse[]> {
    const axiosRes = await BaseCourseService.studentList(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 获取查询选课范围-学生名单下拉
  static async getStudentSelectList(): Promise<BaseItem[]> {
    const axiosRes = await BaseCourseService.studentSelectionList();
    const resData = axiosRes.data.data;

    const result = resData.map((item: any) => {
      return {
        key: item.id,
        value: item.id,
        title: item.name
      };
    });
    return result;
  }
  // 获取查询时间设置列表下拉
  static async getLocationTimetList(): Promise<timeAllocationSelectResponse[]> {
    const axiosRes = await BaseCourseService.allocationTime();
    const resData = axiosRes.data.data;

    let result = resData.map((item: any) => {
      return {
        ...item,
        key: item.id,
        value: item.name
      };
    });
    return result;
  }

  // 获取学院列表下拉
  static async getCollegetList(): Promise<BaseItem[]> {
    const axiosRes = await BaseCourseService.collegeList();
    const resData = axiosRes.data.data;

    const result = resData.map((item: any) => {
      return {
        key: item.id,
        value: item.id,
        title: item.name
      };
    });
    return result;
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
// 综合配置-班级配置模块type end

//综合配置-班级配置模块
export class ClassServicePresenter {
  // 添加班级
  static async add(params: any): Promise<HttpPromise> {
    const axiosRes = await ClassServices.add(params);
    return axiosRes;
  }
  // 修改班级
  static async update(params: any): Promise<HttpPromise> {
    const axiosRes = await ClassServices.update(params);
    return axiosRes;
  }
  // 获取班级列表
  static async getList(params: any): Promise<CourseLIstResponse> {
    const axiosRes = await ClassServices.list(params);
    return axiosRes.data.data;
  }
  // 删除班级
  static async delete(params: DeleteCourseParams): Promise<HttpPromise> {
    const axiosRes = await ClassServices.delete(params);
    return axiosRes;
  }
  // 获取班级学生列表
  static async getStudentList(
    params: GetStudentListParams
  ): Promise<StudentListResponse> {
    const axiosRes = await ClassServices.studentList(params);
    return axiosRes.data.data;
  }
  //  删除班级学生
  static async delStudent(params: DeleteStudentParams): Promise<HttpPromise> {
    const axiosRes = await ClassServices.delStudent(params);
    return axiosRes;
  }
  // delAllStudent 删除班级全部学生
  static async delAllStudent(
    params: DeleteAllStudentParams
  ): Promise<HttpPromise> {
    const axiosRes = await ClassServices.delAllStudent(params);
    return axiosRes;
  }
  // 新增班级学生
  static async addStudent(params: AddStudentParams): Promise<HttpPromise> {
    const axiosRes = await ClassServices.addStudent(params);
    return axiosRes;
  }
  // 新增班级学生 - 允许添加其他班级人员
  static async addExistedStudent(
    params: AddStudentParams
  ): Promise<HttpPromise> {
    const axiosRes = await ClassServices.addExistedStudent(params);
    return axiosRes;
  }
  // 查询班级所有学生
  static async getAllStudent(
    params: GetClassStudentParams
  ): Promise<StudentItem[]> {
    const axiosRes = await ClassServices.getClassStudentList(params);
    return axiosRes.data.data;
  }
}

interface updateActivityNumber {
  freshman: number;
  junior: number;
  senior: number;
  sophomore: number;
}
interface getAllThemeItem {
  id: string;
  name: string;
  number: number;
}
interface getGradeListItem {
  freshman: number;
  junior: number;
  senior: number;
  sophomore: number;
}
interface updateThemeSpecialItem {
  name: string;
  id: string;
}
// 活动专题及活动配置
export class ActivityThemeConfigurationPresenter {
  //获取每年级需要参加的活动数量
  static async getGradeList(): Promise<getGradeListItem> {
    const axiosRes = await ActivityThemeConfiguration.getActivityNumber();
    return axiosRes.data.data;
  }

  //修改每个年级需要参加的活动数量
  static async updateActivityNumber(data: updateActivityNumber): Promise<null> {
    const axiosRes = await ActivityThemeConfiguration.updateActivityNumber(
      data
    );
    return axiosRes.data.data;
  }

  //获取所有主题
  static async getAllTheme(): Promise<getAllThemeItem[]> {
    const axiosRes = await ActivityThemeConfiguration.getAllTheme();
    return axiosRes.data.data;
  }

  //新增活动专题
  static async addThemeSpecial(data: string): Promise<null> {
    const axiosRes = await ActivityThemeConfiguration.addThemeSpecial(data);
    return axiosRes.data.data;
  }

  //编辑活动专题
  static async updateThemeSpecial(data: updateThemeSpecialItem): Promise<null> {
    const axiosRes = await ActivityThemeConfiguration.updateThemeSpecial(data);
    return axiosRes.data.data;
  }

  //删除活动专题
  static async delateThemeSpecial(data: { id: string }): Promise<null> {
    const axiosRes = await ActivityThemeConfiguration.delateThemeSpecial(data);
    return axiosRes.data.data;
  }
}

interface restrictionResponse {
  id: string;
  name: string;
  semesterId: string;
  sex: number;
  time: number;
  year: number[];
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
export class ActivityLimitManagePresenter {
  //获取限制列表
  static async getRestriction(params: getRestrictionParams): Promise<any> {
    const axiosRes = await ActivityLimitManage.getRestriction(params);
    const resData = axiosRes.data.data;
    let result = resData.map((item: any, index: any) => {
      return {
        key: `${index + 1}`,
        id: item.id,
        name: item.name,
        semesterId: item.semesterId,
        sex: item.sex,
        time: item.time,
        year: item.year,
        dayTime: item.dayTime,
        weekTime: item.weekTime
      };
    });
    return result;
  }

  //创建限制
  static async create(data: createLimitParams): Promise<null> {
    const axiosRes = await ActivityLimitManage.create(data);
    return axiosRes.data.data;
  }

  //获取使用此限制的活动列表
  static async getLimitActivityList(
    data: getActivityListParams
  ): Promise<getActivityListResponse> {
    const axiosRes = await ActivityLimitManage.getLimitActivityList(data);
    const resList = axiosRes.data.data.items;
    let result = resList.map((item: any) => {
      return {
        endTime: moment(Number(item.endTime)).format('YYYY-MM-DD HH:mm'),
        id: item.id,
        name: item.name,
        startTime: moment(Number(item.startTime)).format('YYYY-MM-DD HH:mm'),
        state: item.state,
        stateName: item.stateName,
        topicName: item.topicName
      };
    });
    const resultData = {
      items: result,
      pageNum: axiosRes.data.data.pageNum,
      pageSize: axiosRes.data.data.pageSize,
      total: axiosRes.data.data.total
    };
    return resultData;
  }

  //修改限制
  static async update(data: updateLimitParams): Promise<updateLimitResponse> {
    const axiosRes = await ActivityLimitManage.update(data);
    return axiosRes.data.data;
  }

  //删除限制
  static async delate(data: delLimitParams): Promise<null> {
    const axiosRes = await ActivityLimitManage.delate(data);
    return axiosRes.data.data;
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
  gender: number;
  dataStatus: number;
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
export class OnceActivityListPresenter {
  //查询单次活动列表
  static async getOnceActivity(data: getOnceActivityParams): Promise<any> {
    const axiosRes = await OnceActivityList.getOnceActivity(data);
    const resList = axiosRes.data.data.items;
    resList.forEach((item: any) => {
      item.endTime = moment(Number(item.endTime)).format('HH:mm');
      item.startTime = moment(Number(item.startTime)).format(
        'YYYY-MM-DD HH:mm'
      );
      item.registerStartTime = moment(Number(item.registerStartTime)).format(
        'YYYY-MM-DD HH:mm'
      );
      item.registerEndTime = moment(Number(item.registerEndTime)).format(
        'YYYY-MM-DD HH:mm'
      );
      item.releaseDate = moment(Number(item.releaseDate)).format('YYYY-MM-DD');
    });
    const resultData = {
      pageNum: axiosRes.data.data.pageNum,
      pageSize: axiosRes.data.data.pageSize,
      total: axiosRes.data.data.total,
      items: resList
    };
    return resultData;
  }

  //新增单次活动
  static async addOnceActivity(data: addOnceActivityParams): Promise<null> {
    const axiosRes = await OnceActivityList.addOnceActivity(data);
    return axiosRes.data.data;
  }

  //编辑单次活动
  static async updateOnceActivity(
    data: updateOnceActivityParams
  ): Promise<null> {
    const axiosRes = await OnceActivityList.updateOnceActivity(data);
    return axiosRes.data.data;
  }

  //删除单次活动
  static async delOnceActivity(params: delOnceActivityParams): Promise<null> {
    const axiosRes = await OnceActivityList.delOnceActivity(params);
    return axiosRes.data.data;
  }

  //下载模板
  static async exportOnceActivityTemplate(): Promise<null> {
    const axiosRes = await OnceActivityList.exportOnceActivityTemplate();
    return axiosRes;
  }

  //获取学生
  static async getStudent(
    data: getQueryStudentParams
  ): Promise<getQueryStudentResponse[]> {
    const axiosRes = await OnceActivityList.getStudent(data);
    return axiosRes.data.data;
  }

  //手动修改考勤状态
  static async updateSignType(data: updateSignTypeParams): Promise<any> {
    const axiosRes = await OnceActivityList.updateSignType(data);
    return axiosRes.data.data;
  }

  //教师添加学生
  static async importStudent(data: any): Promise<any> {
    const axiosRes = await OnceActivityList.importStudent(data);
    return axiosRes.data.data;
  }

  //教师删除学生
  static async delStudent(data: delStudentParams): Promise<any> {
    const axiosRes = await OnceActivityList.delStudent(data);
    return axiosRes.data.data;
  }

  //获取学生列表
  static async getStudentList(
    params: getStudentParams
  ): Promise<getStudentResponse[]> {
    const axiosRes = await OnceActivityList.getStudentList(params);
    return axiosRes.data.data;
  }

  //查所有教师
  static async queryTeacherList(): Promise<any> {
    const axiosRes = await OnceActivityList.queryTeacherList();
    return axiosRes.data.data;
  }
}
