import {
  FacePunchPointBasicInfo,
  FacePunchPointInfo
} from '@/@types/facePunch';
import Axios from '@/request-v2/config';

/**
 * 获取点位详情
 * @param pointId 点位ID
 * @returns 点位详情信息
 */
export const getFacePunchPointDetail = async (pointId: string) => {
  const result = await Axios.get(
    '/face-running/back/organization/location/detail',
    {
      params: { id: pointId }
    }
  );
  const responseData = result.data.data;

  const pointInfo: FacePunchPointInfo = {
    pointId: responseData.id,
    pointName: responseData.name,
    deviceList: (result.data.data.equipments as any[]).map(item => ({
      account: item.code,
      deviceId: item.id,
      password: item.pass,
      serialNumber: item.serialNo,
      status: item.state
    })),
    assetList:
      result.data.data?.urls !== null
        ? (result.data.data?.urls as any[]).map(item => ({
            url: item.content
          }))
        : []
  };

  console.log('pointInfo', pointInfo);

  return pointInfo;
};
