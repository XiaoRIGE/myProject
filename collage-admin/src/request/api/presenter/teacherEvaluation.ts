// 教师评价相关接口
import {
  TeacherEvaluateServicesModal,
  teacherEvaluationServices
} from '../model/teacherEvaluation';
/** 教师评价开关响应体 */
interface EvaluationResponse {
  evaluationSwitch: boolean;
  positionOne: boolean;
  positionTwo: boolean;
  semesterId: string;
}
/**教师评价开关 插入位置信息 */
interface EvaluationConfig extends EvaluationResponse {
  positionListStr: string;
  positionList: string[];
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
/**获取配置列表响应值 处理后信息 */
export interface GetConfigList {
  items: ConfigListMap[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface ConfigListMap extends ConfigItem {
  name: string;
  singleChoiceLength: number;
  multipleChoiceLength: number;
  scoringQuestionsLength: number;
  shortAnswerQuestionsLength: number;
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

export class TeacherEvaluationPresenter {
  /**
   * @description 教师评价开关-查询
   */
  static async getEvaluation(): Promise<EvaluationConfig> {
    const axiosRes = await teacherEvaluationServices.getEvaluation();
    const { positionOne, positionTwo } = axiosRes.data.data;
    let positionList: string[] = [];
    if (positionOne) {
      positionList.push('理论考试前');
    }
    if (positionTwo) {
      positionList.push('查看成绩前');
    }
    return {
      ...axiosRes.data.data,
      positionList,
      positionListStr: positionList.length ? positionList.join('、') : '暂无'
    };
  }
  /**
   * @description 切换教师评价开关
   */
  static async switchEvaluation(): Promise<EvaluationConfig> {
    const axiosRes = await teacherEvaluationServices.switchEvaluation();
    const { positionOne, positionTwo } = axiosRes.data.data;
    let positionList: string[] = [];
    if (positionOne) {
      positionList.push('理论考试前');
    }
    if (positionTwo) {
      positionList.push('查看成绩前');
    }
    return {
      ...axiosRes.data.data,
      positionList,
      positionListStr: positionList.length ? positionList.join('、') : '暂无'
    };
  }
  /**
   * @description 编辑教师评价插入位置
   */
  static async editEvaluationPosition(
    params: EditEvaluationPositionParams
  ): Promise<EvaluationConfig> {
    const axiosRes = await teacherEvaluationServices.editEvaluationPosition(
      params
    );
    const { positionOne, positionTwo } = axiosRes.data.data;
    let positionList: string[] = [];
    if (positionOne) {
      positionList.push('理论考试前');
    }
    if (positionTwo) {
      positionList.push('查看成绩前');
    }
    return {
      ...axiosRes.data.data,
      positionList,
      positionListStr: positionList.length ? positionList.join('、') : '暂无'
    };
  }
  /**
   * @description 查询所有题目列表
   */
  static async getQuestionList(): Promise<QuestionListResponse> {
    const axiosRes = await teacherEvaluationServices.getQuestionList();
    return axiosRes.data.data;
  }

  /**
   * @description 教师评价配置列表
   */
  static async getConfigList(
    params: GetConfigListParams
  ): Promise<GetConfigList> {
    const axiosRes = await teacherEvaluationServices.getConfigList(params);
    const axiosResMap = axiosRes.data.data.items.map((item: ConfigItem) => {
      const projectName = item.projectListVOList.map(
        (itemX: ProjectListVOList) => itemX.name
      );
      return {
        ...item,
        name: projectName.join('、'),
        singleChoiceLength: item.teacherEvaluationSingleChoiceList.length,
        multipleChoiceLength: item.teacherEvaluationMultipleChoiceList.length,
        scoringQuestionsLength: item.teacherEvaluationScoreList.length,
        shortAnswerQuestionsLength: item.teacherEvaluationShortAnswerList.length
      };
    });

    return {
      ...axiosRes.data.data,
      items: axiosResMap
    };
  }
  /**
   * @description 新增教师评价配置
   */
  static async addConfig(params: AddConfigParams): Promise<boolean> {
    const axiosRes = await teacherEvaluationServices.addConfig(params);
    return axiosRes.data.data;
  }
  /**
   * @description 编辑教师评价配置
   */
  static async updateConfig(params: updateConfigParams): Promise<boolean> {
    const axiosRes = await teacherEvaluationServices.updateConfig(params);
    return axiosRes.data.data;
  }
  /**
   * @description 删除教师评价配置
   */
  static async deleteConfig(params: deleteConfigParams): Promise<boolean> {
    const axiosRes = await teacherEvaluationServices.deleteConfig(params);
    return axiosRes.data.data;
  }
}

/** 教师评价题目管理添加请求体 */
interface addTeacherTopicParams {
  answerList: AnswerList[];
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
/** 教师评价题目管理删除响应体 */
interface delTeacherTopicParams {
  idList: string[];
}
/** 教师评价题目管理修改请求体 */
interface updateTeacherTopicParams {
  answerList: any;
  id: string;
  questionName: string;
  questionType: number;
  scoreLowerLimit: number | undefined;
  scoreUpperLimit: number | undefined;
}
export class TeacherEvaluateServicesPresenter {
  /**
   * @description 教师评价题目 添加
   */
  static async addTeacherTopic(data: addTeacherTopicParams): Promise<Boolean> {
    const axiosResponse = await TeacherEvaluateServicesModal.addTeacherTopic(
      data
    );

    return axiosResponse.data.data;
  }

  /**
   * @description 教师评价题目 列表
   */
  static async queryTeacherTopic(
    data: queryTeacherTopicParams
  ): Promise<queryTeacherTopicResponse> {
    const axiosResponse = await TeacherEvaluateServicesModal.queryTeacherTopic(
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
          questionStr = '评分题';
          break;
        case 4:
          questionStr = '简答题';
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
   * @description 教师评价题目 删除
   */
  static async delTeacherTopic(data: delTeacherTopicParams): Promise<Boolean> {
    const axiosResponse = await TeacherEvaluateServicesModal.delTeacherTopic(
      data
    );
    return axiosResponse.data.data;
  }

  /**
   * @description 教师评价题目 编辑
   */
  static async updateTeacherTopic(
    data: updateTeacherTopicParams
  ): Promise<Boolean> {
    const axiosResponse = await TeacherEvaluateServicesModal.updateTeacherTopic(
      data
    );
    return axiosResponse.data.data;
  }
}
