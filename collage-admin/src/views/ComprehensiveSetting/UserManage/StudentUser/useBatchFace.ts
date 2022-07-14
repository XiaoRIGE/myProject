import { ref } from 'vue';
import {
  batchDeleteFace,
  IBatchDeleteFace
} from '@/request/api/presenter/batchDeleteFace';
import { message } from 'ant-design-vue';

export default function useBatchFace() {
  const batchDeleteState = ref<boolean>(false);

  /**
   * 批量删除人脸弹框
   */
  const deleteHandle = () => {
    batchDeleteState.value = true;
  };

  /**
   * 删除确认操作
   * @param year 删除年份
   */
  const deleteHandleOk = async (year: string) => {
    const data: IBatchDeleteFace = {
      year
    };
    const result = await batchDeleteFace(data);
    if (result.data.data) {
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  };

  return {
    batchDeleteState,
    deleteHandle,
    deleteHandleOk
  };
}
