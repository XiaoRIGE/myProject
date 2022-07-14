/**
 * 岗亭打卡 - 单一的点位信息 (不存在设备列表信息)
 */
interface FacePunchOnlyPointInfo {
  /**
   * 点位ID
   */
  pointId?: string;

  /**
   * 点位名称
   */
  pointName: string;
}

/**
 * 岗亭打卡 - 点位基础信息
 */
export interface FacePunchPointBasicInfo extends FacePunchOnlyPointInfo {
  /**
   * 设备列表
   */
  deviceList: FacePunchDeviceBasicInfo[];
}

/**
 * 岗亭打卡 - 点位完整信息
 */
export interface FacePunchPointInfo extends FacePunchOnlyPointInfo {
  /**
   * 设备列表
   */
  deviceList: FacePunchDeviceInfo[];

  /**
   * 资源列表
   */
  assetList?: FacePunchPointAssetInfo[];
}

/**
 * 岗亭打卡 - 设备基础信息
 */
export interface FacePunchDeviceBasicInfo {
  /**
   * 设备ID
   */
  deviceId?: string;

  /**
   * 设备序列号
   */
  serialNumber: string;

  /**
   * 设备状态
   */
  status?: number;
}

/**
 * 岗亭打卡 - 设备完整信息
 */
export interface FacePunchDeviceInfo extends FacePunchDeviceBasicInfo {
  /**
   * 设备账号
   */
  account: string;

  /**
   * 设备密码
   */
  password: string;
}

/**
 * 岗亭打卡 - 设备状态
 */
export enum FaceDeivceStatus {
  RUNNING,
  OUTLINE,
  DORMANT
}

/**
 * 岗亭打卡 - 点位资源信息
 */
interface FacePunchPointAssetInfo {
  /**
   * 图片地址
   */
  url: string;
}

/**
 * 路线图单项点位信息
 */
export interface FaceRunchRouteMapItem {
  /**
   * 点位ID
   */
  pointId: string;

  /**
   * 点位名称
   */
  pointName?: string;

  /**
   * 最小抵达耗时
   */
  minTime: number;

  /**
   * 最大抵达耗时
   */
  maxTime: number;
}

export interface FacePunchRouteInfo {
  /**
   * 线路ID
   */
  routeId?: string;

  /**
   * 线路里程数
   */
  mileage: number;

  /**
   * 线路图
   */
  routeMap: FaceRunchRouteMapItem[];

  /**
   * 计入段数
   */
  segment: number;
}
