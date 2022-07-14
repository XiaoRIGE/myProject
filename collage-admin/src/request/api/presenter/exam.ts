import { ExamService } from '../model/exam';
import { HttpListResponse } from '@/@types/index';
import moment from 'moment';

/** 我的班级-理论考试信息请求参数 */
export interface getExamInfoParams {
  courseId: string;
  semesterId: string;
}
/** 我的班级-理论考试信息响应体Map */
export interface ExamInfoResponse {
  examTimeVal: string;
  completePeopleNum: number;
  theoryExaminationState: number;
  theoryTestConfigIdVal: string;
  hasTheoryExaminationVal: boolean;
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
/** 我的班级-理论考试列表响应体map */
export interface getExamListResponseMap {
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
  examStatusStr: string;
  EXAMSTATUS: string;
  totalGrade: string;
  totalGradeVal: number;
  time: string;
  duration: string;
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

export class NoticeServicePresenter {
  /**
   * @description 查询我的班级-理论考试信息
   */
  static async getExamInfo(data: getExamInfoParams): Promise<any> {
    const axiosRes = await ExamService.getExamInfo(data);
    const resData = axiosRes.data.data;
    let startDate = '';
    let endDate = '';
    if (
      resData.examinationTimeStart !== null &&
      resData.examinationTimeEnd !== null
    ) {
      startDate = moment(resData.examinationTimeStart).format(
        'YYYY-MM-DD HH:mm'
      );
      endDate = moment(resData.examinationTimeEnd).format('YYYY-MM-DD HH:mm');
    }

    return {
      examTimeVal: `${startDate}~${endDate}`,
      completePeopleNum: resData.completePeopleNum,
      theoryExaminationState: resData.theoryExaminationState,
      theoryTestConfigIdVal: resData.theoryTestConfigId,
      hasTheoryExaminationVal: resData.theoryTestConfigId ? true : false
    };
  }
  /**
   * @description 查询我的班级-理论考试列表
   */
  static async getExamList(
    data: getExamListParams
  ): Promise<HttpListResponse<getExamListResponseMap>> {
    const axiosRes = await ExamService.getExamList(data);

    const itemsMap = axiosRes.data.data.items.map(
      (item: getExamListResponse) => {
        let duration: any = '-'; //答题时长
        if (item.answerTime) {
          const hour: any = moment(item.answerTime).format('HH');
          const minutes = moment(item.answerTime).format('mm');
          const second = moment(item.answerTime).format('ss');
          duration = `${hour * 60 + Number(minutes)}分${second}秒`;
        }
        let time = '-'; //交卷时间
        if (item.handOverTime) {
          time = moment(item.handOverTime).format('YYYY-MM-DD HH:mm');
        }
        return {
          ...item,
          examStatusStr:
            item.state === 0
              ? '缺考'
              : item.state === 1
              ? '考试中'
              : '考试完成',
          EXAMSTATUS: String(item.state),
          totalGrade:
            item.achievement || item.achievement === 0
              ? String(item.achievement)
              : '-',
          totalGradeVal: item.achievement || 0,
          time,
          duration
        };
      }
    );

    return { ...axiosRes.data.data, items: itemsMap };
  }
  /**
   * @description 重新考试
   */
  static async resetExam(data: resetExamParams): Promise<null> {
    const axiosRes = await ExamService.resetExam(data);
    return axiosRes.data.data;
  }
  /**
   * @description 更改成绩
   */
  static async updateAchievement(data: updateAchievementParams): Promise<null> {
    const axiosRes = await ExamService.updateAchievement(data);
    return axiosRes.data.data;
  }
}
