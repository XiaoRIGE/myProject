import Axios from '../../config/axios';
import ApiPrefix from '@/request/config/prefix';
import { HttpPromise } from '@/@types';

const FASERUNNING_URL = ApiPrefix.FASERUNNING;

export interface IQueryList {
  campusId?: string;
  endTime?: string;
  locationId?: string;
  page: number;
  serialNo?: string;
  size: number;
  startTime?: string;
  state?: string;
  studentName?: string;
}

/**
 * 分页查询打卡记录列表
 * @param data
 * @returns
 */
export const queryRecordPage = (data: IQueryList): HttpPromise<any> => {
  return Axios(`${FASERUNNING_URL}/back/face/uploading/record/page`, {
    method: 'post',
    data
  });
};
