import { FaceRunchRouteMapItem } from '@/@types/facePunch';

export interface RouteModalData {
  /**
   * 是否展示弹窗
   */
  visible: boolean;
  /**
   * 线路ID
   */
  routeId: string;

  /**
   * 线路图信息
   */
  routeMap: FaceRunchRouteMapItem[];

  /**
   * 里程数
   */
  mileage: number;

  /**
   * 段数
   */
  segment: number;
}
