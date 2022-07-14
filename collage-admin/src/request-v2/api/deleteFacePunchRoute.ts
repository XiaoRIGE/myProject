import Axios from '@/request-v2/config';

/**
 * 删除岗亭打卡指定线路
 * @param routeId 线路ID
 * @returns 操作结果
 */
export const deleteFacePunchRoute = async (routeId: string) => {
  const result = await Axios.post('/face-running/back/route/info/delete', {
    id: routeId
  });

  const operationResult: boolean = result.data.data;

  return operationResult;
};
