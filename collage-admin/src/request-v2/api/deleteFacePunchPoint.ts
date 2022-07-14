import Axios from '@/request-v2/config';

/**
 * 删除岗亭打卡指定点位
 * @param pointId 点位ID
 * @returns 操作结果
 */
export const deleteFacePunchPoint = async (pointId: string) => {
  const result = await Axios.post(
    '/face-running/back/organization/location/delete',
    { id: pointId }
  );

  const operationResult: boolean = result.data.data;

  return operationResult;
};
