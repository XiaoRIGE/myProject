import { AppStateType } from '@/store/modules/app/state';
import { AxiosPromise } from 'axios';

/** Store 中 state 的模块的类型 */
type ModuleType = {
  app: AppStateType;
};

/** Store 中 StateType 类型 */
export type StateType = ModuleType;

/** http请求响应格式 */
export declare interface ApiResponse {
  errCode: number;
  errMsg?: string;
  data?: any;
}

// ant-design-button 颜色
export type ButtonColorType =
  | 'primary'
  | 'danger'
  | 'dashed'
  | 'ghost'
  | 'default'
  | 'link';

// icon的类型
export type IconType = 'icon' | 'iconfont';

// 对话框打开类型
export type ModalOpenMode = 'edit' | 'add' | 'other';

/** 分页接口请求通用结构 */
export interface ListParamType {
  page: number;
  size: number;
}

/**
 * 接口响应通过格式。
 * @todo 移除该 `interface`。
 * @deprecated 该 `interface` 将会在后续版本移除，请尽快请改用 `HttpSuccessResponse`。
 */
export interface HttpResponse {
  status: number;
  statusText: string;
  data: {
    code: number;
    desc: string;
    [key: string]: any;
  };
}

/**
 * 接口响应通过格式。
 */
export interface HttpSuccessResponse<T = any> {
  code: number;
  message: string | null;
  data: T;
}

/**
 * API 模块的 Model 层中请求响应返回的 Promise 封装。
 */
export type HttpPromise<T = any> = AxiosPromise<HttpSuccessResponse<T>>;

/** 接口请求列表通用参数配置  */
export interface HttpListQuery {
  pageNum?: number;
  pageSize?: number;
  orderNum?: number;
  [key: string]: any;
}

/** 接口请求列表通用参数配置  */
export interface HttpListResponse<T = any> {
  pageNum: number;
  pageSize: number;
  total: number;
  items: T[];
}

export type ListResponse<T = any> = HttpPromise<HttpListResponse<T>>;

// 基础类型对象
export interface BaseObj {
  key: string;
  value: string;
}

export type StringArray = string[];

/**
 * 学期信息
 */
export interface CampusInfo {
  address: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  organizationId: string;
}

/**
 * 元素尺寸
 */
export interface ElementSize {
  width: number;
  height: number;
}

/**
 * 分页请求数据结构
 */
export type PaginationRequest<T = {}> = T & {
  /**
   * 当前页码
   */
  page: number;

  /**
   * 分页大小
   */
  size: number;
};

/**
 * 分页响应数据结构
 */
export type PaginationResponse<T = {}> = T &
  PaginationRequest & {
    /**
     * 总页数
     */
    total: number;
  };
