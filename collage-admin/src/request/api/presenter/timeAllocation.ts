import { HttpSuccessResponse } from '@/@types';
import { timeAllocationResponse,TimeAllocationService, createTimeRequestData, upDateTimeRequestData, deleteTimeRequestData  } from '@/request/api/model/timeAllocation'

export class timeAllocationServicePresenter {
  /**
   *  @description 查询作息时间列表
   */
   static async getLocationTimetList(): Promise<HttpSuccessResponse<timeAllocationResponse[]>> {
    const res = await TimeAllocationService.allocationTime();
    return res.data;
  }
  /**
   *  @description 新增作息时间
   */
   static async createTime(
     data:createTimeRequestData
   ): Promise<HttpSuccessResponse<{}>> {
    const res = await TimeAllocationService.createTime(data);
    return res.data;
  }
  /**
   *  @description 编辑作息时间
   */
   static async upDateTime(
     data:upDateTimeRequestData
   ): Promise<HttpSuccessResponse<{}>> {
    const res = await TimeAllocationService.upDateTime(data);
    return res.data;
  }
  /**
   *  @description 删除作息时间
   */
   static async deleteTime(
     data:any
   ): Promise<HttpSuccessResponse<{}>> {
    const res = await TimeAllocationService.deleteTime(data);
    return res.data;
  }
}
