import { FacePunchPointBasicInfo } from '@/@types/facePunch';
import Axios from '@/request-v2/config';

/**
 * 获取岗亭打卡点位列表
 * @param campusId 校区ID
 */
export const getFacePunchPointList = async (campusId: string) => {
  const result = await Axios.get(
    '/face-running/back/organization/location/list',
    {
      params: { campusId }
    }
  );
  const pointInfo: FacePunchPointBasicInfo[] = (result.data.data as any[]).map(
    pointInfo => ({
      pointId: pointInfo.id,
      pointName: pointInfo.name,
      deviceList: pointInfo.equipments.map((deviceInfo: any) => ({
        id: deviceInfo.id,
        serialNumber: deviceInfo.serialNo,
        status: deviceInfo.state
      }))
    })
  );

  return pointInfo;
};
