/**
 * @description: app配置 相关接口
 */
import Axios from '@/request/config/axios';
import { HttpPromise } from '@/@types/index';
import ApiPrefix from '@/request/config/prefix';

const AUTHORIZATION_URL = ApiPrefix.AUTHORIZATION;
// 获取通知列表参数
interface queryListParams {
  offsetPage: number;
  page: number;
  query: string;
  size: number;
}

// 通知信息
interface Item {
  article: string;
  author: string;
  authorName: string;
  id: string;
  publishTime: number;
  readNumber: number;
  status: number;
  title: string;
  updateTime: number;
  urls: string[];
}
// 通知列表响应体
interface queryListResponse {
  items: Item[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 删除通知参数
interface delItemParams {
  id: string;
}

// 新增通知参数
interface addItemParams {
  article: string;
  author: string;
  authorName: string;
  organizationMessageImageList: string[];
  readNumber: number;
  title: string;
}

// 编辑通知参数
interface editItemParams {
  article: string;
  author: string;
  authorName: string;
  id: string;
  organizationMessageImageList: string[];
  readNumber: number;
  title: string;
}

// 学校通知网络请求
export class NoticeService {
  /**
   * @description 获取学校通知列表
   */
  static queryList(data: queryListParams): HttpPromise<queryListResponse> {
    return Axios(`${AUTHORIZATION_URL}/back/message/page`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 删除学校通知
   */
  static delItem(data: delItemParams): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/back/message/del`, {
      method: 'delete',
      data
    });
  }
  /**
   * @description 新增学校通知
   */
  static addItem(data: addItemParams): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/back/message/save`, {
      method: 'post',
      data
    });
  }
  /**
   * @description 编辑学校通知
   */
  static editItem(data: editItemParams): HttpPromise<any> {
    return Axios(`${AUTHORIZATION_URL}/back/message/update`, {
      method: 'post',
      data
    });
  }
}
