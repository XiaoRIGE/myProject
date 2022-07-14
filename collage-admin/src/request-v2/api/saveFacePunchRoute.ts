import { FacePunchRouteInfo } from '@/@types/facePunch';
import Axios from '@/request-v2/config';

export const saveFacePunchRoute = async (
  campusId: string,
  routeInfo: FacePunchRouteInfo
) => {
  const responsePointInfo = {
    id: routeInfo.routeId,
    mileage: routeInfo.mileage,
    part: routeInfo.segment,
    details: routeInfo.routeMap?.map(item => ({
      locationId: item.pointId,
      maxMinutes: item.maxTime,
      minMinutes: item.minTime
    }))
  };

  const result = await Axios.post('/face-running/back/route/info/save', {
    campusId,
    ...responsePointInfo
  });

  const operationResult: boolean = result.data.data;

  return operationResult;
};
