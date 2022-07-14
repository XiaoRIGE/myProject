import { getFacePunchPointList } from './getFacePunchPointList';
import { saveFacePunchPoint } from './saveFacePunchPoint';
import { getFacePunchPointDetail } from './getFacePunchPointDetail';
import { getFacePunchRouteList } from './getFacePunchRouteList';
import { saveFacePunchRoute } from './saveFacePunchRoute';
import { deleteFacePunchPoint } from './deleteFacePunchPoint';
import { deleteFacePunchRoute } from './deleteFacePunchRoute';

export * from './getFacePunchPointList';
export * from './saveFacePunchPoint';
export * from './getFacePunchPointDetail';
export * from './getFacePunchRouteList';
export * from './saveFacePunchRoute';
export * from './deleteFacePunchPoint';
export * from './deleteFacePunchRoute';

export default {
  getFacePunchPointList,
  saveFacePunchPoint,
  getFacePunchPointDetail,
  getFacePunchRouteList,
  saveFacePunchRoute,
  deleteFacePunchPoint,
  deleteFacePunchRoute
};
