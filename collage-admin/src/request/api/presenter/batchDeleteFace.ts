import Axios from '../../config/axios';
import ApiPrefix from '@/request/config/prefix';
import { HttpPromise } from '@/@types';

const FASERUNNING_URL = ApiPrefix.FASERUNNING;

export interface IBatchDeleteFace {
  year: string;
}

/**
 * 批量删除人脸
 * @param data
 * @returns
 */
export const batchDeleteFace = (data: IBatchDeleteFace): HttpPromise<any> => {
  return Axios(`${FASERUNNING_URL}/facePhoto/batchDeleteFace`, {
    method: 'post',
    data
  });
};
