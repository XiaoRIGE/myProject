import { ApealManageService } from '../model/apeal';
import moment from 'moment';

interface queryApealListParams {
  appealTimeEnd: number;
  appealTimeStart: number;
  handleState: number;
  num: string;
  page: number;
  semesterId: string;
  size: number;
  appealTimeOrder?: number;
  handleTimeOrder?: number;
}
interface queryApealListResponseItem {
  appealTime: number;
  appealType: string;
  appealTypeStr: string;
  collegeName: string;
  handlePerson: string;
  handlePersonName: string;
  handleResult: string;
  handleState: number;
  handleStateStr: string;
  handleTime: number;
  id: string;
  name: string;
  studentNum: string;
  userId: string;
  year: number;
}
interface queryApealListResponse {
  items: queryApealListResponseItem[];
  pageNum: number;
  pageSize: number;
  total: number;
}
interface apealInfoResponse {
  appealReason: string;
  appealState: number;
  appealStateStr: string;
  appealTime: number | string;
  appealType: string;
  appealTypeStr: string;
  collegeName: string;
  effectiveMileage: number;
  effectivePart: number;
  endTime: number;
  handleResult: string;
  handleState: number;
  handleStateStr: string;
  handleTime: number | string;
  handlePersonName: string;
  id: string;
  keepTime: number;
  keepTimeVal: string;
  mobile: string;
  name: string;
  operationMileage: number;
  operationPart: number;
  runningDetailsId: string;
  runningType: number;
  runningTypeName: string;
  scoringType: number;
  startTime: number | string;
  studentNum: string;
  totalMileage: number;
  totalPart: number;
  url: string[][];
  userId: string;
  year: number;
}
interface passOrTurndownParams {
  id: string;
  result: string;
  state: number;
}
interface passOrTurndownResponse {
  code: number;
  data: boolean;
  message: string;
}
// 申诉管理列表
export class ApealManageServicePresenter {
  /**
   * @description 申诉管理列表
   */
  static async getList(
    data: queryApealListParams
  ): Promise<queryApealListResponse> {
    const axiosRes = await ApealManageService.queryList(data);
    const item = axiosRes.data.data;
    let arr = <any>[];
    if (item.items) {
      arr = item.items.map((item: any) => {
        return {
          ...item,
          appealTime: moment(item.appealTime).format('YYYY-MM-DD HH:mm'),
          handleTime: moment(item.handleTime).format('YYYY-MM-DD HH:mm')
        };
      });
    } else {
      arr = [];
    }

    const res = {
      items: arr,
      pageNum: item.pageNum,
      pageSize: item.pageSize,
      total: item.total
    };

    return res;
  }

  /**
   * @description 申诉详情
   */
  static async apealInfo(data: { id: string }): Promise<apealInfoResponse> {
    const axiosRes = await ApealManageService.apealInfo(data);
    const item = axiosRes.data.data;
    item.appealTime = moment(item.appealTime).format('YYYY-MM-DD HH:mm');
    item.handleTime = moment(item.handleTime).format('YYYY-MM-DD HH:mm');
    item.startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm');

    const time = moment.duration(Number(item.keepTime), 'second');
    if (item.keepTime !== null) {
      item.keepTimeVal = [time.hours(), time.minutes(), time.seconds()].join(
        ':'
      );
    }

    return axiosRes.data.data;
  }

  /**
   * @description 通过或驳回
   */
  static async passOrTurndown(
    data: passOrTurndownParams
  ): Promise<passOrTurndownResponse> {
    const axiosRes = await ApealManageService.passOrTurndown(data);
    return axiosRes.data.data;
  }
}
