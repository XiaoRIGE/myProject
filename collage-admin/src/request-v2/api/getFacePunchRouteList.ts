import { PaginationRequest, PaginationResponse } from '@/@types';
import {
  FacePunchPointBasicInfo,
  FacePunchRouteInfo
} from '@/@types/facePunch';
import Axios from '@/request-v2/config';

/**
 * 获取岗亭打卡线路列表
 * @param campusId 校区ID
 * @param paginationConfig 分页配置
 * @returns 岗亭打卡线路列表
 */
export const getFacePunchRouteList = async (
  campusId: string,
  paginationConfig: PaginationRequest
) => {
  const res = await Axios.post('/face-running/back/route/info/page', {
    campusId,
    ...paginationConfig
  });

  const responseData = res.data.data;

  const routeInfo: PaginationResponse<{ routeList: FacePunchRouteInfo[] }> = {
    page: responseData.pageNum,
    size: responseData.pageSize,
    total: responseData.total,
    routeList: (responseData.items as any[]).map(routeInfo => ({
      segment: routeInfo.part,
      routeId: routeInfo.id,
      mileage: routeInfo.mileage,
      routeMap: (routeInfo.details as any[]).map(routeMapInfo => ({
        pointId: routeMapInfo.locationId,
        pointName: routeMapInfo.locationName,
        minTime: routeMapInfo.minMinutes,
        maxTime: routeMapInfo.maxMinutes
      }))
    }))
  };

  return routeInfo;
};
