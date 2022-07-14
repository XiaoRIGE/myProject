import { reactive, Ref } from 'vue';

/**
 * @param cb 切换页码回调
 * @param pageSize 默认每页请求数量
 * @param current 当前页码
 * @param totalNum 总条数
 * @returns 页码配置
 */
export const usePagination = function usePagination(
  cb: () => any,
  pageSize: Ref,
  current: Ref,
  totalNum: Ref
) {
  /**
   * @description: 分页配置
   */
  const pagination = reactive({
    showTotal: (total: number) => `共计 ${total} 条数据`,
    current,
    total: totalNum,
    defaultPageSize: pageSize,
    onChange: async (currentVal: number) => {
      current.value = currentVal;
      cb();
    }
  });
  return {
    pagination
  };
};
