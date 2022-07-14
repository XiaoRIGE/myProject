/**
 * @description: 考试模块相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import exportFile from '../../config/download';
import { onUploadProgress } from '@/utils/common';

import ApiPrefix from '@/request/config/prefix';
const EDUCATION_URL = ApiPrefix.EDUCATION;

// 获取科目列表参数
interface GetExaminationListParams {
  page: number;
  projectId: string;
  size: number;
  subjectType: string | null;
  title: string;
}
// 科目列表响应结构
interface GetExaminationListResponse {
  items: Item[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface Item {
  dataGroupType: string;
  dataGroupTypeName: string;
  id: string;
  projectId: string;
  projectName: string;
  ratingType: string;
  ratingTypeName: string;
  subjectRatingRule: Array<SubjectRatingRuleVOList[]>;
  subjectType: string;
  subjectTypeName: string;
  title: string;
  deleteFlag: boolean;
}
interface SubjectRatingRuleVOList {
  grade: number;
  id: string;
  value: string;
}
// 新增科目参数
interface AddExaminationListParams {
  title: string;
  projectId: string;
  subjectType: string;
  dataGroupType?: string;
  description?: string;
  id?: string;
  ratingType?: string;
  subjectRatingRule?: Array<SubjectRatingRuleBOList[]>;
}

interface SubjectRatingRuleBOList {
  grade: number;
  id?: string;
  value: string;
}
//新增|编辑科目响应结构
interface OperationExaminationListResponse {
  code: number;
  data: null;
  message: string;
}
// 编辑科目参数
interface UpdateExaminationListParams {
  dataGroupType: string;
  description?: string;
  id: string;
  projectId: string;
  ratingType: string;
  subjectRatingRule: Array<SubjectRatingRuleBOList[]>;
  subjectType: string;
  title: string;
}
// 删除科目参数
interface DeleteExaminationListParams {
  id: string;
}

// 科目管理
export class SubjectService {
  /**
   * @description 查询科目列表
   */
  static getList(
    params: GetExaminationListParams
  ): HttpPromise<GetExaminationListResponse> {
    return Axios(`${EDUCATION_URL}/projectSubject/query`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 新增科目
   */
  static add(
    params: AddExaminationListParams
  ): HttpPromise<OperationExaminationListResponse> {
    return Axios(`${EDUCATION_URL}/projectSubject/save`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 更新科目
   */
  static update(
    params: UpdateExaminationListParams
  ): HttpPromise<OperationExaminationListResponse> {
    return Axios(`${EDUCATION_URL}/projectSubject/update`, {
      method: 'post',
      data: params
    });
  }
  /**
   * @description 删除科目
   */
  static delete(
    params: DeleteExaminationListParams
  ): HttpPromise<OperationExaminationListResponse> {
    return Axios(`${EDUCATION_URL}/projectSubject/delete`, {
      method: 'delete',
      params
    });
  }
  /**
   * @description 下载科目模板
   */
  static getTemplate(): Promise<any> {
    return exportFile('get', `${EDUCATION_URL}/projectSubject/temp`);
  }
  /**
   * @description 导入科目模板
   */
  static importTemplate(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/projectSubject/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }
  /**
   * @description 下载错误模板
   */
  static getErrFile(params: any): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/projectSubject/exportErr`,
      params
    );
  }
}

interface queryExaminationList {
  page: number;
  projectId: string | undefined;
  semesterSchool: string | undefined;
  size: number;
}
interface projectSettingBos {
  percentage: number;
  subjectId: string;
  subjectName: string;
}
interface queryExaminationListItem {
  id: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  projectSettingBos: projectSettingBos[];
  semesterSchool: string;
}
interface queryExaminationListResponse {
  items: queryExaminationListItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface ProjectSettingBo {
  percentage: number;
  subjectId: string;
  subjectName: string;
}
interface addExaminationRequestData {
  projectId: string;
  projectName: string;
  projectSettingBos: ProjectSettingBo[];
  semesterSchool: string;
}
interface subjectRatingRule {
  grade: number;
  id: string;
  value: string;
}
interface getProjectSubjectResponse {
  dataGroupType: string;
  dataGroupTypeName: string;
  id: string;
  projectId: string;
  projectName: string;
  ratingType: string;
  ratingTypeName: string;
  subjectRatingRule: subjectRatingRule[];
  subjectType: string;
  subjectTypeName: string;
  title: string;
}
interface updateExamination {
  id: string;
  projectId: any;
  projectName: string;
  projectSettingBos: projectSettingBos[];
  semesterSchool: string;
}
interface DeleteExaminationParams {
  id: string;
}
interface getProjectSubject {
  projectId: string;
}
// 专项考试 考试设置网络请求
export class ExaminationServicesModal {
  /**
   * @description 考试设置查询列表
   */
  static queryExaminationList(
    data: queryExaminationList
  ): HttpPromise<queryExaminationListResponse> {
    return Axios(`${EDUCATION_URL}/project/settings/queryList`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 根据项目获取科目
   */
  static getProjectSubject(
    params: getProjectSubject
  ): HttpPromise<getProjectSubjectResponse[]> {
    return Axios(`${EDUCATION_URL}/projectSubject/get`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 新增
   */
  static addExamination(data: addExaminationRequestData): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/project/settings/add`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 修改
   */
  static updateExamination(data: updateExamination): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/project/settings/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 删除
   */
  static delExamination(params: DeleteExaminationParams): HttpPromise<null> {
    return Axios(`${EDUCATION_URL}/project/settings/del`, {
      method: 'delete',
      params
    });
  }

  /**
   * @description 下载模板
   */
  static export(): Promise<any> {
    return exportFile('get', `${EDUCATION_URL}/project/settings/export`);
  }

  /**
   * @description 批量导入
   */
  static import(data: any): Promise<any> {
    return Axios(`${EDUCATION_URL}/project/settings/import`, {
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
    return exportFile(
      'post',
      `${EDUCATION_URL}/project/settings/exportErr`,
      params
    );
  }
}

interface queryTheoryExaminationParams {
  page: number;
  projectId: string;
  schoolYear: number | undefined;
  size: number;
}
interface queryTheoryExaminationItem {
  id: string;
  judgeChoiceCount: number;
  judgeChoiceCurrencyCount: number;
  judgeChoiceScore: number;
  multipleChoiceCount: number;
  multipleChoiceCurrencyCount: number;
  multipleChoiceScore: number;
  projectId: string;
  projectName: string;
  schoolYear: number;
  singleChoiceCount: number;
  singleChoiceCurrencyCount: number;
  singleChoiceScore: number;
  testTime: number;
  testTimeFrom: string;
  testTimeTo: string;
}
interface queryTheoryExaminationResponse {
  items: queryTheoryExaminationItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface addExamParams {
  judgeChoiceCount: number;
  judgeChoiceCurrencyCount: number;
  judgeChoiceScore: number;
  multipleChoiceCount: number;
  multipleChoiceCurrencyCount: number;
  multipleChoiceScore: number;
  projectList: any[];
  schoolYear: number;
  singleChoiceCount: number;
  singleChoiceCurrencyCount: number;
  singleChoiceScore: number;
  testTime: number;
  testTimeFrom: number;
  testTimeTo: number;
}
interface delExamParams {
  idList: any[];
}
interface updateExamParams {
  id: string;
  judgeChoiceCount: number;
  judgeChoiceCurrencyCount: number;
  judgeChoiceScore: number;
  multipleChoiceCount: number;
  multipleChoiceCurrencyCount: number;
  multipleChoiceScore: number;
  projectId: string;
  singleChoiceCount: number;
  singleChoiceCurrencyCount: number;
  singleChoiceScore: number;
  testTime: number;
  testTimeFrom: number;
  testTimeTo: number;
}
interface updateBatchExamParams {
  projectList: any[];
  schoolYear: number;
  testTimeFrom: number;
  testTimeTo: number;
}
interface queryYearSubjectListParams {
  schoolYear: number;
}
// 理论考试设置网络请求
export class TheoryExaminationServicesModal {
  /**
   * @description 理论考试查询列表
   */
  static queryList(
    data: queryTheoryExaminationParams
  ): HttpPromise<queryTheoryExaminationResponse> {
    return Axios(`${EDUCATION_URL}/theorytest/config/query/page`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 添加理论考试
   */
  static addExam(data: addExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/add`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 删除理论考试
   */
  static delExam(data: delExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/delete/batch`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 单个编辑理论考试
   */
  static updateExam(data: updateExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 批量编辑理论考试
   */
  static updateBatchExam(data: updateBatchExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/update/batch`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 根据学年,级联项目列表
   */
  static queryYearSubjectList(
    params: queryYearSubjectListParams
  ): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/project/list`, {
      method: 'get',
      params
    });
  }

  /**
   * @description 新增时检查项目考题数量是否足够
   */
  static checkConfig(data: addExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/check/number`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 编辑时检查项目考题数量是否足够
   */
  static updateCheckConfig(data: updateExamParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/config/check/number/single`, {
      method: 'post',
      data
    });
  }
}

interface queryTheoryExaminationQuestionParams {
  page: number;
  projectId: string;
  questionName: string;
  questionType: any;
  size: number;
}
interface queryTheoryExaminationQuestionResponseItemTheoryTestAnswerVOS {
  answerContent: string;
  correct: boolean;
  id: string;
  questionId: string;
  tag: string;
}
interface queryTheoryExaminationQuestionResponseItem {
  id: string;
  projectId: string;
  projectName: string;
  questionName: string;
  questionType: any;
  theoryTestAnswerVOS: queryTheoryExaminationQuestionResponseItemTheoryTestAnswerVOS[];
}
interface queryTheoryExaminationQuestionResponse {
  items: queryTheoryExaminationQuestionResponseItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}

interface addExamQuestionParamsAnswerList {
  answerContent: string;
  correct: boolean;
  tag: string;
}
interface addExamQuestionParams {
  answerList: any;
  projectId: any;
  questionName: string;
  questionType: number;
}
interface delExamQuestionParams {
  idList: string[];
}
interface updateExamQuestionParams {
  answerList: any;
  projectId: any;
  id: string;
  questionName: string;
  questionType: number;
}
interface importTopicResponse {
  key: string;
}
// 理论考试考题网络请求
export class TheoryExaminationQuestionServicesModal {
  /**
   * @description 理论考试考题查询列表
   */
  static queryList(
    data: queryTheoryExaminationQuestionParams
  ): HttpPromise<queryTheoryExaminationQuestionResponse> {
    return Axios(`${EDUCATION_URL}/theorytest/question/query/page`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 添加理论考试试题
   */
  static addExamQuestion(data: addExamQuestionParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/question/add`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 批量删除理论考试试题
   */
  static delExamQuestion(data: delExamQuestionParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/question/delete/batch`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 更新理论考试试题
   */
  static updateExamQuestion(data: updateExamQuestionParams): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/theorytest/question/update`, {
      method: 'post',
      data
    });
  }

  /**
   * @description 下载模板
   */
  static export(): Promise<any> {
    return exportFile('get', `${EDUCATION_URL}/theorytest/question/temp`);
  }

  //导入题目
  static importTopic(data: any): HttpPromise<importTopicResponse> {
    return Axios(`${EDUCATION_URL}/theorytest/question/import`, {
      method: 'post',
      data,
      timeout: 180000, //该接口时间可能很长，延长超时时间
      onUploadProgress: onUploadProgress
    });
  }

  //导入题目情况
  static extraTopicImport(params: { key: string }): HttpPromise<any> {
    return Axios(`${EDUCATION_URL}/import/getFileStatus`, {
      method: 'get',
      params
    });
  }

  //下载错误信息
  static downloadExportErr(data: any): Promise<any> {
    return exportFile(
      'post',
      `${EDUCATION_URL}/theorytest/question/error/export`,
      data
    );
  }
}
