import { reactive, ref, toRefs, watch } from 'vue';
import { Moment } from 'moment';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { getLocationList } from '@/request/api/presenter/localtionList';

interface FormState {
  schoolArea: string;
  point: string[];
  state: string;
  date: Moment[];
  studentText: string;
}

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

interface SchoolArea {
  value: string;
  label: string;
  id: string;
}

export default function useTableConfig() {
  const columns = [
    {
      title: '时间',
      dataIndex: 'uploadingTime',
      key: 'uploadingTime',
      slots: { customRender: 'timer' }
    },
    {
      title: '学生',
      dataIndex: 'name',
      key: 'name',
      slots: { customRender: 'namenumber' }
    },
    {
      title: '点位',
      dataIndex: 'locationName',
      key: 'locationName'
    },
    {
      title: '设备序列号',
      key: 'serialNo',
      dataIndex: 'serialNo'
    },
    {
      title: '处理状态',
      key: 'action',
      slots: { customRender: 'action' }
    }
  ];

  const FACESTATE = reactive([
    {
      label: '全部',
      value: ''
    },
    {
      label: '暂未处理',
      value: '1'
    },
    {
      label: '有效',
      value: '2'
    },
    {
      label: '无效',
      value: '3'
    },
    {
      label: '重复打卡',
      value: '4'
    }
  ]);

  const stateData = reactive({
    schoolArea: [] as SchoolArea[],
    formData: {
      schoolArea: '',
      point: [],
      state: '',
      date: [],
      studentText: ''
    } as FormState,
    options: [] as Option[]
  });

  const resetForm = () => {
    stateData.formData.schoolArea = '';
    stateData.formData.date = [];
    stateData.formData.studentText = '';
    stateData.formData.point = [];
    stateData.formData.state = '';
  };

  const getAreaData = (list: any[]): SchoolArea[] => {
    const arr: SchoolArea[] = [];
    list.forEach((item: any) => {
      arr.push({ label: item.name, value: item.organizationId, id: item.id });
    });
    arr.unshift({ label: '全部', value: '', id: '' });
    return arr;
  };

  const getSchoolArea = async () => {
    const { data } = await CampusServicePresenter.queryAllCampus('');
    stateData.schoolArea = getAreaData(data.data);
  };

  const dealwidthPointData = (list: any[]): Option[] => {
    const arr = [] as Option[];
    list.forEach((item: any) => {
      const obj = {} as any;
      const children = [] as any;
      obj.label = item.name;
      obj.value = item.id;
      item.equipments.forEach((items: any) => {
        children.push({ label: items.serialNo, value: items.id });
      });
      obj.children = children;
      arr.push(obj);
    });

    return arr;
  };

  const getPonitList = async () => {
    const result = await getLocationList({
      campusId: stateData.formData.schoolArea
    });
    stateData.options.length = 0;
    stateData.options.push(...dealwidthPointData(result.data.data));
  };

  getSchoolArea();

  watch(
    () => stateData.formData.schoolArea,
    (value: string) => {
      if (value) {
        getPonitList();
      } else {
        stateData.options.length = 0;
        stateData.options.push(
          ...[
            {
              value: '',
              label: '全部',
              children: [
                {
                  value: '',
                  label: '全部'
                }
              ]
            }
          ]
        );
      }
    }
  );

  return {
    columns,
    resetForm,
    FACESTATE,
    ...toRefs(stateData),
    value: ref<string[]>([])
  };
}
