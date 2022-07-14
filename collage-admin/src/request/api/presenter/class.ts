import moment from 'moment';
import {
  MyClassService,
  AImovementService,
  GradeService
} from '../model/class';
import { secondToMinutes } from '@/utils/common';

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

export class MyClassServicePresenter {
  //   班级下拉列表
  static async getList(params: GetListParams): Promise<ClassItem[]> {
    const axiosRes = await MyClassService.list(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 获取课程管理员
  static async getRoleList(data: GetRoleListParams): Promise<RoleItem[]> {
    const axiosRes = await MyClassService.getRoleList(data);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 删除课程管理员
  static async delRole(params: DelRoleParams): Promise<null> {
    const axiosRes = await MyClassService.delRole(params);
    const resData = axiosRes.data.data;
    return resData;
  }

  // 新增课程管理员
  static async addRole(params: AddRoleParams): Promise<null> {
    const axiosRes = await MyClassService.addRole(params);
    const resData = axiosRes.data.data;
    return resData;
  }

  //   课程考勤列表
  //   ClassRecordResponse
  static async getRecordList(params: GetClassRecordParams): Promise<any> {
    const axiosRes = await MyClassService.getRecordList(params);
    const resData = axiosRes.data.data;

    const { attainabilityType, attendanceNumber, frequency } = resData;
    // 数据处理
    let temp = [];
    if (resData.attainabilityList?.items) {
      temp = resData.attainabilityList.items.map(
        (item: studentRecordItem, index: number) => {
          const objInfo: any = {};
          // 考情数据
          if (item?.attainabilityRecordList?.length) {
            item.attainabilityRecordList.forEach(
              (element: AttainabilityRecordList) => {
                // 自定义列名 + 具体值信息
                objInfo[`signTypeStr${item.id}${element.weekNumber}`] =
                  element.signTypeStr;
                objInfo[`columeId${item.id}${element.weekNumber}`] = element.id;
                objInfo[`weekNumber${item.id}${element.weekNumber}`] =
                  element.weekNumber;
              }
            );
          }
          return {
            ...item,
            studentIndex: index + 1,
            ...objInfo
          };
        }
      );
    }

    return {
      attainabilityList: temp,
      attainabilityType,
      attendanceNumber,
      frequency,
      code: axiosRes.data.code,
      message: axiosRes.data.message
    };
  }
  //   修改签到状态
  static async updateSineType(params: UpdateSineTypeParams): Promise<null> {
    const axiosRes = await MyClassService.updateSineType(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  //   查询课外活动考勤列表
  static async getActivityList(params: GetActivityListParams): Promise<any> {
    const axiosRes = await MyClassService.getActivityList(params);
    const resData = axiosRes.data.data;
    const { items, pageNum, pageSize, total } = resData;
    const newItems = items.map((item, index) => {
      const obj = { ...item };
      obj.key = (pageNum - 1) * 10 + index + 1;
      return obj;
    });
    return { items: newItems, pageNum, pageSize, total };
  }
  //   查询学生课外活动考勤列表
  static async queryActivityList(
    params: QueryActivityListParams
  ): Promise<any> {
    const axiosRes = await MyClassService.queryActivityList(params);
    const resData = axiosRes.data.data;
    const { items, pageNum, pageSize, total } = resData;
    const newItems = items.map((item, index) => {
      const obj = { ...item };
      obj.key = (pageNum - 1) * 10 + index + 1;
      return obj;
    });
    return { items: newItems, pageNum, pageSize, total };
  }
  //   学生所在班级列表查询
  static async queryStudentInClassList(
    data: StudentInClassParams
  ): Promise<StudentInClassListResponse> {
    const axiosRes = await MyClassService.queryStudentInClassList(data);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 删除学生所在班级
  static async delStudentInClass(
    params: DelStudentInClassParams
  ): Promise<null> {
    const axiosRes = await MyClassService.delStudentInClass(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 查询学生可变更的所有班级
  static async queryStudentInClassAll(
    params: QueryStudentInClassAllParams
  ): Promise<QueryStudentInClassAllItem[]> {
    const axiosRes = await MyClassService.queryStudentInClassAll(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 学生变更班级
  static async updateStudentInClass(
    params: UpdateStudentInClassParams
  ): Promise<null> {
    const axiosRes = await MyClassService.updateStudentInClass(params);
    const resData = axiosRes.data.data;
    return resData;
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
  keepTime: string;
  projectName: string;
  recordId: string;
  startTime: string;
  totalScore: number;
}
interface GetExerciseRecordResponse {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: SportsRecord[];
}
/**风险清单信息 */
interface ModifyDangerTextVO {
  id: string;
  text: string;
}

// AI运动网络请求
export class AImovementPresenter {
  //   查询班级学生AI运动信息列表
  static async getList(
    params: GetAImovementListParams
  ): Promise<GetAImovementListResponse> {
    const axiosRes = await AImovementService.list(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  //   获取锻炼者运动数据列表
  static async getExerciseRecordList(
    params: GetUserSportInfoParams
  ): Promise<GetExerciseRecordResponse> {
    const axiosRes = await AImovementService.getExerciseRecordList(params);
    const resData = axiosRes.data.data;
    const tempData = resData.items.map(item => {
      return {
        ...item,
        keepTime: secondToMinutes(item.keepTime),
        startTime: moment(Number(item.startTime)).format('YYYY-MM-DD HH:mm')
      };
    });
    return {
      ...resData,
      items: tempData
    };
  }

  // 查询风险清单文本
  static async getRisk(): Promise<ModifyDangerTextVO> {
    const axiosRes = await AImovementService.getRiskText();
    const resData = axiosRes.data.data;
    return resData;
  }

  // 编辑风险清单文本
  static async editRisk(params: ModifyDangerTextVO): Promise<null> {
    const axiosRes = await AImovementService.editRisk(params);
    const resData = axiosRes.data.data;
    return resData;
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
  // pageNum: number;
  // pageSize: number;
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
// getGradeHeadResponse
export class GradePresenter {
  // 查询我的班级-学生成绩列表表头
  static async getGradeHead(params: getGradeHeadParams): Promise<any> {
    const axiosRes = await GradeService.getGradeHead(params);
    const {
      sign,
      running,
      activity,
      fitness,
      theoryExamination,
      coursePerformance,
      normalName,
      subjectSettingListVO,
      singleShowType
    } = axiosRes.data.data;

    // 固定列权重
    const columnWeight = [
      sign,
      theoryExamination,
      coursePerformance,
      running,
      activity,
      fitness
    ];
    // 固定列
    let baseColumnData = [
      {
        key: 'sign',
        proportion: 0,
        title: '考勤',
        type: 0
      },
      {
        key: 'theoryExamination',
        proportion: 0,
        title: '理论考试',
        type: 0
      },
      // 名字是动态的 不同学校可能不一样
      {
        key: 'coursePerformance',
        proportion: 0,
        title: '课堂表现',
        type: 0
      },
      {
        key: 'running',
        proportion: 0,
        title: '跑步',
        type: 0
      },
      {
        key: 'activity',
        proportion: 0,
        title: '课外活动',
        type: 0
      },
      {
        key: 'fitness',
        proportion: 0,
        title: '体质健康',
        type: 0
      }
    ];

    if (normalName) {
      baseColumnData[2].title = normalName;
    }

    baseColumnData.forEach((item, index) => {
      item.proportion = columnWeight[index] || 0;
    });

    // 权重为0的列不展示
    baseColumnData = baseColumnData.filter(item => {
      return item.proportion !== 0;
    });

    // 动态列
    const dynamicColumnData =
      subjectSettingListVO && subjectSettingListVO.length
        ? subjectSettingListVO.map(item => {
            return {
              ...item,
              key: item.id,
              proportion: item.proportion,
              title: item.title,
              type: 1
            };
          })
        : [];

    // 动态列的key
    const dynamicColumnKeyArr =
      subjectSettingListVO && subjectSettingListVO.length
        ? subjectSettingListVO.map(item => {
            return item.id;
          })
        : [];

    return {
      baseColumnData,
      dynamicColumnData,
      dynamicColumnKeyArr,
      singleShowType
    };
  }
  /**
   * @description 查询我的班级-学生成绩
   */
  static async getGradeList(
    params: getGradeListParams
  ): Promise<getGradeListResponse> {
    const axiosRes = await GradeService.getGradeList(params);
    const { items, total } = axiosRes.data.data;
    // 处理专项成绩没有的情况
    const itemsResult =
      items && items.length
        ? items.map(item => {
            return {
              ...item,
              key: item.id,
              subjectSettingListVO: item.subjectSettingListVO
                ? item.subjectSettingListVO.map(itemX => {
                    if (itemX.value !== null && itemX.subjectType === 'TIME') {
                      // 如果测试类型为时间 将值处理为分秒的格式,并且将毫秒转秒
                      let source = String(Number(itemX.value) / 1000);
                      let minutes = 0;
                      let second = 0;
                      minutes = Math.floor(Number(source) / 60);
                      second = Number((Number(source) % 60).toFixed(2));
                      return {
                        ...itemX,
                        minuteVal: minutes,
                        secondVal: second,
                        value: source
                      };
                    } else {
                      return {
                        ...itemX
                      };
                    }
                  })
                : []
            };
          })
        : [];

    return {
      items: itemsResult,
      total: total
    };
  }

  /**
   * @description 编辑学生成绩
   */
  static async updateGrade(params: updateGradeParams): Promise<null> {
    const axiosRes = await GradeService.updateGrade(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  /**
   * @description 查询市小分制还是百分制
   */
  static async getSingleShowType(): Promise<boolean> {
    const axiosRes = await GradeService.getSingleShowType();
    const resData = axiosRes.data.data;
    return resData === 1;
  }
}
