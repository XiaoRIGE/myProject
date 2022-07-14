import { queryRecordPage } from '@/request/api/presenter/recordPage';
import { reactive, toRefs } from 'vue';

export default function useGetRecordPage(parms: any) {
  const statePage = reactive({
    dataList: [] as any[],
    total: 0 as number,
    pageSize: 0 as number,
    pageNum: 0 as number,
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10
    }
  });

  const getData = async (data: any) => {
    const result = await queryRecordPage(data);
    statePage.dataList = result.data.data.items;
    statePage.pagination.total = result.data.data.total;
    statePage.pagination.pageSize = result.data.data.pageSize;
    statePage.pagination.current = result.data.data.pageNum + 1;
  };

  const handleTableChange = (params: any) => {
    statePage.pagination.current = params.current;
    getData({
      campusId: '',
      endTime: '',
      locationId: '',
      page: statePage.pagination.current,
      serialNo: '',
      size: statePage.pagination.pageSize,
      startTime: '',
      state: '',
      studentName: ''
    });
  };

  getData({
    campusId: '',
    endTime: '',
    locationId: '',
    page: statePage.pagination.current,
    serialNo: '',
    size: statePage.pagination.pageSize,
    startTime: '',
    state: '',
    studentName: ''
  });

  const searchList = () => {
    getData({
      campusId: parms.value.schoolArea,
      endTime: +parms.value.date[1],
      locationId: parms.value.point[0],
      page: statePage.pagination.current,
      serialNo: parms.value.point[1],
      size: statePage.pagination.pageSize,
      startTime: +parms.value.date[0],
      state: parms.value.state,
      studentName: parms.value.studentText
    });
  };

  return {
    handleTableChange,
    searchList,
    ...toRefs(statePage)
  };
}
