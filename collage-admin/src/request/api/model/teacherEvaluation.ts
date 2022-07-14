import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';
import { onUploadProgress } from '@/utils/common';
import ApiPrefix from '@/request/config/prefix';

const EDUCATION_URL = ApiPrefix.EDUCATION;

/** 教师评价开关响应体 */
interface EvaluationResponse {
  evaluationSwitch: boolean;
  positionOne: boolean;
  positionTwo: boolean;
  semesterId: string;
}
/** 编辑教师评价插入位置请求参数 */
interface EditEvaluationPositionParams {
  positionOne: boolean;
  positionTwo: boolean;
}
/**题目信息 */
export interface TeacherEvaluationList {
  answerList: AnswerList[];
  id: string;
  questionName: string;
  questionType: number;
  used: boolean;
}
/**答案信息 */
export interface AnswerList {
  answerContent: string;
  id: string;
  tag: string;
}
/**题目列表响应体 */
interface QuestionListResponse {
  teacherEvaluationMultipleChoiceList: TeacherEvaluationList[];
  teacherEvaluationScoreList: TeacherEvaluationList[];
  teacherEvaluationShortAnswerList: TeacherEvaluationList[];
  teacherEvaluationSingleChoiceList: TeacherEvaluationList[];
}

/**获取配置列表参数 */
interface GetConfigListParams {
  page: number;
  projectId: string;
  size: number;
}
/**获取配置列表响应值 */
export interface GetConfigListResponse {
  items: ConfigItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
/**单个教师评价配置信息 */
export interface ConfigItem {
  id: string;
  projectListVOList: ProjectListVOList[];
  schoolId: string;
  teacherEvaluationMultipleChoiceList: TeacherEvaluationList[];
  teacherEvaluationScoreList: TeacherEvaluationList[];
  teacherEvaluationShortAnswerList: TeacherEvaluationList[];
  teacherEvaluationSingleChoiceList: TeacherEvaluationList[];
}
/** 项目信息 */
export interface ProjectListVOList {
  id: string;
  name: string;
}
/** 新增教师评价配置参数 */
interface AddConfigParams {
  projectId: string[];
  questionId: string[];
}
/**编辑教师评价配置参数 */
interface updateConfigParams {
  id: string;
  projectId: string[];
  questionId: string[];
}
/** 删除教师评价配置参数 */
interface deleteConfigParams {
  id: string;
}

export class teacherEvaluationServices {
  /**
   * @description 教师评价开关-查询
   */
  static getEvaluation(): HttpPromise<EvaluationResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/get`, {
      method: 'get'
    });
  }
  /**
   * @description 切换教师评价开关
   */
  static switchEvaluation(): HttpPromise<EvaluationResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/switch`, {
      method: 'post'
    });
  }
  /**
   * @description 修改教师评价插入位置
   */
  static editEvaluationPosition(
    params: EditEvaluationPositionParams
  ): HttpPromise<EvaluationResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/position`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 教师评价题目-教师评价配置中查询全部题目
   */
  static getQuestionList(): HttpPromise<QuestionListResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/question/all`, {
      method: 'get'
    });
  }
  /**
   * @description 教师评价配置列表
   */
  static getConfigList(
    params: GetConfigListParams
  ): HttpPromise<GetConfigListResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/config/query/page`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 教师评价配置-新增
   */
  static addConfig(params: AddConfigParams): HttpPromise<boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/config/add`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 教师评价配置-更新
   */
  static updateConfig(params: updateConfigParams): HttpPromise<boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/config/update`, {
      method: 'post',
      data: params
    });
  }

  /**
   * @description 教师评价配置-删除
   */
  static deleteConfig(params: deleteConfigParams): HttpPromise<boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/config/delete`, {
      method: 'delete',
      params
    });
  }
}

/** 教师评价题目管理添加answerList数组 */
interface addTeacherTopicParamsAnswerList {
  answerContent: string;
  id: string;
  tag: string;
}
/** 教师评价题目管理添加请求体 */
interface addTeacherTopicParams {
  answerList: addTeacherTopicParamsAnswerList[];
  questionName: string;
  questionType: number;
  scoreLowerLimit: number | undefined;
  scoreUpperLimit: number | undefined;
}
/** 教师评价题目管理列表请求体 */
interface queryTeacherTopicParams {
  page: number;
  questionName: string;
  questionType: number | null;
  size: number;
}
/** 教师评价题目管理列表响应体Item answerList */
interface queryTeacherTopicResponseAnswerList {
  answerContent: string;
  id: string;
  tag: string;
}
/** 教师评价题目管理列表响应体Item */
interface queryTeacherTopicResponseItem {
  answerList: queryTeacherTopicResponseAnswerList[];
  id: string;
  questionName: string;
  questionType: number;
  used: boolean;
}
/** 教师评价题目管理列表响应体 */
interface queryTeacherTopicResponse {
  items: queryTeacherTopicResponseItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
/** 教师评价题目管理删除请求体 */
interface delTeacherTopicParams {
  idList: string[];
}
/** 教师评价题目管理修改请求体 */
interface updateTeacherTopicParams {
  answerList: queryTeacherTopicResponseAnswerList[];
  id: string;
  questionName: string;
  questionType: number;
  scoreLowerLimit: number | undefined;
  scoreUpperLimit: number | undefined;
}
/** 教师评价题目管理导入响应体 */
interface importTopicResponse {
  key: string;
}
// 理论考试考题网络请求
export class TeacherEvaluateServicesModal {
  /**
   * @description 教师评价题目 新增
   */
  static addTeacherTopic(data: addTeacherTopicParams): HttpPromise<Boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/question/add`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 教师评价题目 列表
   */
  static queryTeacherTopic(
    data: queryTeacherTopicParams
  ): HttpPromise<queryTeacherTopicResponse> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/question/query/page`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 教师评价题目 删除
   */
  static delTeacherTopic(data: delTeacherTopicParams): HttpPromise<Boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/question/delete/batch`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 教师评价题目 编辑
   */
  static updateTeacherTopic(
    data: updateTeacherTopicParams
  ): HttpPromise<Boolean> {
    return Axios(`${EDUCATION_URL}/teacher/evaluation/question/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 教师评价题目 下载模板
   */
  static export(): Promise<any> {
    return exportFile(
      'get',
      `${EDUCATION_URL}/teacher/evaluation/question/temp`
    );
  }

  /**
   * @description 教师评价题目 导入题目
   */
  static importTopic(data: any): HttpPromise<importTopicResponse> {
    return Axios(`/education/teacher/evaluation/question/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  /**
   * @description 教师评价题目 导入题目情况
   */
  static extraTopicImport(params: { key: string }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/import/getFileStatus`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 教师评价题目 下载错误信息
   */
  static downloadExportErr(data: any): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/teacher/evaluation/question/error/export`,
      data
    );
  }
}
