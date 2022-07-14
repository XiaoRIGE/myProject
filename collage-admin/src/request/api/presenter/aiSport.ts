import { SportLimitTargetService, validTimeService } from '../model/aiSport';
import moment from 'moment';

// 运动限制与目标设置列表
interface querySportLimitListParams {
  semesterId: string;
  type: number;
}

interface sexInfoList {
  dayGoals: number;
  id: string;
  semesterGoals: number;
  sex: number;
  sexStr: string;
  weekGoals: number;
}
interface SemesterVO {
  limitGoalsInfoId: string;
  limitType: number;
  sexInfoList: sexInfoList[];
  sexType: number;
  sexTypeStr: string;
}
interface goalsInfoList {
  lastSemesterVO: SemesterVO;
  nextSemesterVO: SemesterVO;
  yearType: number;
}
interface querySportLimitListResponse {
  goalsInfoList: goalsInfoList[];
  limitGoalsId: string;
  limitType: number;
}
interface resetSportLimitListParams {
  limitGoalsInfoId: string;
}
interface updateSportLimitListParams {
  limitGoalsInfoId: string;
  limitGoalsInfoList: any[];
  sexType: number;
}

const year = [
  { year: '大一至大四' },
  { year: '大一' },
  { year: '大二' },
  { year: '大三' },
  { year: '大四' }
];
const changeYear = (data: number) => {
  switch (data) {
    case 0:
      return '男女一致';
    case 1:
      return '男';
    case 2:
      return '女';
  }
};

/**
 * @description 运动限制与目标设置列表数组过滤方法
 * @list 区分上下学期数组
 * @res 返回值数组的每一项
 * @semester 区分上下学期
 * @newArr 页面需要的新数组
 */
const goalsInfoListFor = (
  list: SemesterVO,
  res: goalsInfoList,
  semester: string,
  newArr: any
) => {
  list.sexInfoList.forEach((l: { sex: number }) => {
    //上学期的详情数组
    const type = list.sexType;
    const pushArr = {
      ...l,
      year: year[res.yearType].year,
      semester: semester,
      sexStr: type === 1 ? '男女一致' : changeYear(l.sex),
      limitGoalsInfoId: list.limitGoalsInfoId
    };
    newArr.push(pushArr);
  });
};

export class SportLimitTargetServicePresenter {
  /**
   * @description 运动限制与目标设置列表
   */
  static async getList(
    data: querySportLimitListParams
  ): Promise<querySportLimitListResponse> {
    const axiosRes = await SportLimitTargetService.queryList(data);
    const res = axiosRes.data.data.goalsInfoList;
    let newArr: any[] = [];

    res.forEach(e => {
      goalsInfoListFor(e.lastSemesterVO, e, '上学期', newArr);
      goalsInfoListFor(e.nextSemesterVO, e, '下学期', newArr);
    });

    const newRes = {
      limitGoalsId: axiosRes.data.data.limitGoalsId,
      limitType: axiosRes.data.data.limitType,
      goalsInfoList: newArr
    };

    return newRes;
  }

  /**
   * @description 运动限制与目标设置编辑
   */
  static async update(data: updateSportLimitListParams): Promise<any> {
    const axiosRes = await SportLimitTargetService.update(data);
    return axiosRes.data.data;
  }

  /**
   * @description 运动限制与目标设置重置
   */
  static async reset(data: resetSportLimitListParams): Promise<any> {
    const axiosRes = await SportLimitTargetService.reset(data);
    return axiosRes.data.data;
  }
}

interface validTimeListParams {
  campusId: string;
}
interface validTimeUpdateParams {
  endDate: string;
  id: string;
  startDate: string;
}
interface timeRuleVOList {
  endDate: string;
  id: string;
  semesterType: number;
  startDate: string;
  yearType: number;
}
interface validTimeListResponse {
  campusId: string;
  id: string;
  timeRuleVOList: timeRuleVOList[];
  type: number;
}
// 有效时间设置网络请求
export class validTimeServicePresenter {
  /**
   * @description 获取运动有效设置列表
   */
  static async getList(
    data: validTimeListParams
  ): Promise<validTimeListResponse> {
    const axiosRes = await validTimeService.queryList(data);
    const res = axiosRes.data.data;
    const arr = res.timeRuleVOList.map((value: any) => {
      let startDate = '';
      let endDate = '';
      if (value.startDate !== null && value.endDate !== null) {
        startDate = moment(value.startDate).format('YYYY-MM-DD');
        endDate = moment(value.endDate).format('YYYY-MM-DD');
      }

      return {
        ...value,
        startDate,
        endDate,
        semesterType: value.semesterType === 1 ? '上学期' : '下学期',
        yearType:
          value.yearType === 10 ? '大一至大四' : year[value.yearType].year
      };
    });
    const requestData = {
      ...res,
      timeRuleVOList: arr
    };

    return requestData;
  }

  /**
   * @description 切换全校规则
   */
  static async switch(data: { campusId: string }): Promise<any> {
    const axiosRes = await validTimeService.switch(data);
    return axiosRes.data.data;
  }

  /**
   * @description 编辑运动日期
   */
  static async update(data: validTimeUpdateParams): Promise<any> {
    const axiosRes = await validTimeService.update(data);
    return axiosRes.data.data;
  }

  /**
   * @description 重置有效时间
   */
  static async resetTime(data: { id: string }): Promise<any> {
    const axiosRes = await validTimeService.resetTime(data);
    return axiosRes.data.data;
  }
}
