/**
 * @description: 理论考试模块相关接口
 */
import Axios from '../../config/axios';
import { HttpPromise, ListResponse } from '@/@types/index';
import ApiPrefix from '@/request/config/prefix';

const EDUCATION_URL = ApiPrefix.EDUCATION;

/** 我的班级-理论考试信息请求参数 */
export interface getExamInfoParams {
  courseId: string;
  semesterId: string;
}
/** 我的班级-理论考试信息响应体 */
export interface ExamInfoResponse {
  completePeopleNum: number;
  examinationTimeEnd: number;
  examinationTimeStart: number;
  theoryExaminationState: number;
  theoryTestConfigId: string;
}

/** 我的班级-理论考试列表信息 */
interface getExamListParams {
  courseId: string;
  offsetPage: number;
  page: number;
  query: string;
  size: number;
  state: number | null;
  theoryTestConfigId: string;
}
/** 我的班级-理论考试列表响应体 */
interface getExamListResponse {
  achievement: number;
  answerTime: number;
  campusName: string;
  handOverTime: number;
  id: string;
  mobile: string;
  name: string;
  number: string;
  organizationId: string;
  organizationName: string;
  sex: number;
  sexStr: string;
  state: number;
  theoryExaminationInfo: string;
  userId: string;
  year: number;
}

/** 重新考试参数 */
interface resetExamParams {
  theoryExaminationInfoId: string;
}

/** 修改理论考试成绩 */
interface updateAchievementParams {
  achievement: number;
  courseId: string;
  theoryTestConfigId: string;
  userId: string;
}

export class ExamService {
  /**
   * @description 查询我的班级-理论考试信息
   */
  static getExamInfo(params: getExamInfoParams): HttpPromise<ExamInfoResponse> {
    return Axios(`${EDUCATION_URL}/back/theoryExamination/head`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 查询我的班级-理论考试列表信息
   */
  static getExamList(
    params: getExamListParams
  ): ListResponse<getExamListResponse> {
    return Axios(`${EDUCATION_URL}/back/theoryExamination/page`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 理论考试-重新考试
   */
  static resetExam(params: resetExamParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/back/theoryExamination/reset`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 理论考试-编辑成绩
   */
  static updateAchievement(params: updateAchievementParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/back/theoryExamination/updateAchievement`, {
      method: 'post',
      data: params
    });
  }
}
