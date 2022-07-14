import { NoticeService } from '../model/app';
import moment from 'moment';

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
  publishTime: string;
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
export class NoticeServicePresenter {
  /**
   * @description 获取学校通知列表
   */
  static async queryList(params: queryListParams): Promise<queryListResponse> {
    const axiosRes = await NoticeService.queryList(params);
    const res = axiosRes.data.data;

    const resItemMap = res.items.map(item => {
      return {
        ...item,
        publishTime: moment(item.publishTime).format('YYYY-MM-DD HH:mm')
      };
    });

    return {
      ...res,
      items: resItemMap
    };
  }

  /**
   * @description 删除学校通知
   */
  static async delete(data: delItemParams): Promise<any> {
    const axiosRes = await NoticeService.delItem(data);
    return axiosRes.data.data;
  }

  /**
   * @description 新增学校通知
   */
  static async add(data: addItemParams): Promise<any> {
    const axiosRes = await NoticeService.addItem(data);
    return axiosRes.data.data;
  }

  /**
   * @description 编辑学校通知
   */
  static async edit(data: editItemParams): Promise<any> {
    const axiosRes = await NoticeService.editItem(data);
    return axiosRes.data.data;
  }
}
