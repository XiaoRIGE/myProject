import Axios from '../../config/axios';
import ApiPrefix from '@/request/config/prefix';
import { HttpPromise } from '@/@types';

const LOCATION_URL = ApiPrefix.LOCATION;

export interface ILocaltionParams {
  campusId: string;
}

// /back/organization/location/list
// 查询点位列表

/**
 * 批量删除人脸
 * @param data
 * @returns
 */
export const getLocationList = (params: ILocaltionParams): HttpPromise<any> => {
  return Axios(`${LOCATION_URL}/back/organization/location/list`, {
    method: 'get',
    params
  });
};
