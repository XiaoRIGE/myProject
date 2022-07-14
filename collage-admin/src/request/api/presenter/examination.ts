// 考试模块相关接口
import {
  SubjectService,
  ExaminationServicesModal,
  TheoryExaminationServicesModal,
  TheoryExaminationQuestionServicesModal
} from '../model/examination';
import moment from 'moment';
import { numFormatYearStr } from '@/utils/common';

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
export class SubjectPresenter {
  // 新增科目
  static async add(
    params: AddExaminationListParams
  ): Promise<OperationExaminationListResponse> {
    const axiosRes = await SubjectService.add(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 查询科目列表
  static async getList(
    params: GetExaminationListParams
  ): Promise<GetExaminationListResponse> {
    const axiosRes = await SubjectService.getList(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 更新科目
  static async update(
    params: UpdateExaminationListParams
  ): Promise<OperationExaminationListResponse> {
    const axiosRes = await SubjectService.update(params);
    const resData = axiosRes.data.data;
    return resData;
  }
  // 删除科目
  static async delete(
    params: DeleteExaminationListParams
  ): Promise<OperationExaminationListResponse> {
    const axiosRes = await SubjectService.delete(params);
    const resData = axiosRes.data.data;
    return resData;
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
export class ExaminationServicePresenter {
  /**
   * @description 考试设置查询列表
   */
  static async queryExaminationList(
    data: queryExaminationList
  ): Promise<queryExaminationListResponse> {
    const axiosResponse = await ExaminationServicesModal.queryExaminationList(
      data
    );
    return axiosResponse.data.data;
  }

  /**
   * @description 根据项目获取科目
   */
  static async getProjectSubject(
    params: getProjectSubject
  ): Promise<getProjectSubjectResponse[]> {
    const axiosResponse = await ExaminationServicesModal.getProjectSubject(
      params
    );
    return axiosResponse.data.data;
  }

  /**
   * @description 新增
   */
  static async addExamination(data: any): Promise<any> {
    const axiosResponse = await ExaminationServicesModal.addExamination(data);
    return axiosResponse;
  }

  /**
   * @description 修改
   */
  static async updateExamination(data: updateExamination): Promise<any> {
    const axiosResponse = await ExaminationServicesModal.updateExamination(
      data
    );
    return axiosResponse;
  }

  /**
   * @description 删除
   */
  static async delExamination(params: DeleteExaminationParams): Promise<any> {
    const axiosResponse = await ExaminationServicesModal.delExamination(params);
    return axiosResponse;
  }
}

interface queryTheoryExaminationParams {
  page: number;
  projectId: any;
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
export class TheoryExaminationServicePresenter {
  /**
   * @description 理论考试查询列表
   */
  static async queryList(
    data: queryTheoryExaminationParams
  ): Promise<queryTheoryExaminationResponse> {
    const axiosResponse = await TheoryExaminationServicesModal.queryList(data);
    const res = axiosResponse.data.data.items;
    const newArr = res.map((item: any) => {
      let totalPoint =
        item.judgeChoiceCount * item.judgeChoiceScore +
        item.multipleChoiceCount * item.multipleChoiceScore +
        item.singleChoiceCount * item.singleChoiceScore;

      return {
        ...item,
        schoolYear: numFormatYearStr(item.schoolYear),
        testTimeFrom: moment(item.testTimeFrom).format('YYYY-MM-DD HH:mm'),
        testTimeTo: moment(item.testTimeTo).format('YYYY-MM-DD HH:mm'),
        totalPoint
      };
    });
    const responseData = {
      items: newArr,
      pageNum: axiosResponse.data.data.pageNum,
      pageSize: axiosResponse.data.data.pageSize,
      total: axiosResponse.data.data.total
    };
    return responseData;
  }

  /**
   * @description 添加理论考试
   */
  static async addExam(data: addExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.addExam(data);

    return axiosResponse.data.data;
  }

  /**
   * @description 删除理论考试
   */
  static async delExam(data: delExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.delExam(data);

    return axiosResponse.data.data;
  }

  /**
   * @description 单个编辑理论考试
   */
  static async updateExam(data: updateExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.updateExam(data);

    return axiosResponse.data.data;
  }

  /**
   * @description 批量编辑理论考试
   */
  static async updateBatchExam(data: updateBatchExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.updateBatchExam(
      data
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 根据学年,级联项目列表
   */
  static async queryYearSubjectList(
    params: queryYearSubjectListParams
  ): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.queryYearSubjectList(
      params
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 新增时检查项目考题数量是否足够
   */
  static async checkConfig(data: addExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.checkConfig(
      data
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 编辑时检查项目考题数量是否足够
   */
  static async updateCheckConfig(data: updateExamParams): Promise<any> {
    const axiosResponse = await TheoryExaminationServicesModal.updateCheckConfig(
      data
    );

    return axiosResponse.data.data;
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
export class TheoryExaminationQuestionServicesPresenter {
  /**
   * @description 理论考试考题查询列表
   */
  static async queryList(
    data: queryTheoryExaminationQuestionParams
  ): Promise<queryTheoryExaminationQuestionResponse> {
    const axiosResponse = await TheoryExaminationQuestionServicesModal.queryList(
      data
    );
    const arr = axiosResponse.data.data.items;
    const newArr = arr.map(item => {
      let questionStr = '';
      switch (item.questionType) {
        case 1:
          questionStr = '单选题';
          break;
        case 2:
          questionStr = '非固定选题';
          break;
        case 3:
          questionStr = '判断题';
          break;
      }
      return {
        ...item,
        questionStr
      };
    });

    const responseItem = {
      items: newArr,
      pageNum: axiosResponse.data.data.pageNum,
      pageSize: axiosResponse.data.data.pageSize,
      total: axiosResponse.data.data.total
    };

    return responseItem;
  }

  /**
   * @description 添加理论考试试题
   */
  static async addExamQuestion(data: addExamQuestionParams): Promise<any> {
    const axiosResponse = await TheoryExaminationQuestionServicesModal.addExamQuestion(
      data
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 批量删除理论考试试题
   */
  static async delExamQuestion(data: delExamQuestionParams): Promise<any> {
    const axiosResponse = await TheoryExaminationQuestionServicesModal.delExamQuestion(
      data
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 更新理论考试试题
   */
  static async updateExamQuestion(
    data: updateExamQuestionParams
  ): Promise<any> {
    const axiosResponse = await TheoryExaminationQuestionServicesModal.updateExamQuestion(
      data
    );

    return axiosResponse.data.data;
  }
}
