import { FacePunchPointInfo } from '@/@types/facePunch';
import Axios from '@/request-v2/config';

/**
 * 保存岗亭打卡点位
 * @param campusId 校区ID
 * @param pointInfo 点位信息
 * @returns 操作结果
 */
export const saveFacePunchPoint = async (
  campusId: string,
  pointInfo: FacePunchPointInfo
) => {
  const responsePointInfo = {
    id: pointInfo.pointId,
    name: pointInfo.pointName,
    equipments: pointInfo.deviceList?.map(item => ({
      code: item.account,
      id: item.deviceId,
      pass: item.password,
      serialNo: item.serialNumber
    })),
    urls: pointInfo.assetList?.map((item, index) => ({
      adType: 1,
      content: item.url,
      contentType: 1,
      id: index
    }))
  };

  const result = await Axios.post(
    '/face-running/back/organization/location/save',
    {
      campusId,
      ...responsePointInfo
    }
  );

  const operationResult: boolean = result.data.data;

  return operationResult;
};
