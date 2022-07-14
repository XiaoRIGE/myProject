<template>
  <div class="test-wrap">
    <a-radio-group v-model:value="campus" button-style="solid">
      <a-radio-button
        v-for="item in campusList"
        :key="item.id"
        :value="item.name"
        @click="schoolRadio(item.id)"
      >
        {{ item.name }}
      </a-radio-button>
    </a-radio-group>
    <div v-if="isAllSchoolSameRef === 1" class="header">
      <div class="header-left">
        学校运动限制与目标设置：全校一致
      </div>
      <div class="header-right" @click="switchAllSchool(1)">
        切换为全校不同
      </div>
    </div>
    <div v-else class="header">
      <div class="header-left">
        学校运动限制与目标设置：全校不同
      </div>
      <div class="header-right" @click="switchAllSchool(2)">
        切换为全校一致
      </div>
    </div>

    <div>
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :pagination="false"
      >
        <template #date="{record}">
          <span v-if="record.startDate">
            {{ record.startDate }} ~ {{ record.endDate }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template #operation="{record}">
          <a class="update" @click="update(record)">编辑</a>
          <a @click="reset(record.id)">重置</a>
        </template>
      </a-table>
    </div>
  </div>

  <a-modal
    v-model:visible="visible"
    centered
    width="600px"
    title="编辑"
    @ok="modalOk"
    @cancel="modalCancel"
  >
    <div class="dialog_semester">
      学年：
      <span>{{ modalYear }}&nbsp;&nbsp;&nbsp;</span>
      学期：
      <span>{{ modalSemester }}</span>
    </div>

    <a-form
      class="modal-form"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="运动日期" v-bind="validateInfos.date">
        <a-space direction="vertical">
          <a-range-picker v-model:value="formState.date" />
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { validTimeServicePresenter } from '@/request/api/presenter/aiSport';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import moment from 'moment';
interface timeRuleVOList {
  endDate: string;
  id: string;
  semesterType: number;
  startDate: string;
  yearType: number;
}

const columns = ref([
  {
    title: '学年',
    dataIndex: 'yearType',
    key: 'yearType'
  },
  {
    title: '学期',
    dataIndex: 'semesterType',
    key: 'semesterType'
  },
  {
    title: '运动有效日期',
    dataIndex: 'date',
    key: 'date',
    slots: { customRender: 'date' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'operation' }
  }
]);

export default defineComponent({
  setup() {
    const campus = ref<string>('');
    const isAllSchoolSameRef = ref<number>(1);
    const visible = ref<boolean>(false);
    const campusList = ref([]);
    const modalYear = ref<string>('');
    const modalSemester = ref<string>('');

    const dataSource = ref<timeRuleVOList[]>([]);
    const formState = reactive({
      date: [] as any
    });

    const rulesRef = reactive({
      date: [
        {
          required: true,
          message: '请选择运动日期'
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(
      formState,
      rulesRef
    );

    const campusId = ref<string>('');
    const queryCampus = async () => {
      //获取全部校区
      try {
        const res = await CampusServicePresenter.queryAllCampus('');

        campusList.value = res.data.data;
        campus.value = res.data.data[0].name;
        campusId.value = res.data.data[0].id;
      } catch (error) {
        console.log(error);
      }
    };
    const requestList = async (campusId: string) => {
      const data = {
        campusId
      };
      try {
        const res = await validTimeServicePresenter.getList(data);
        dataSource.value = res.timeRuleVOList;
        isAllSchoolSameRef.value = res.type;
      } catch (error) {
        console.log(error);
      }
    };
    onMounted(async () => {
      await queryCampus();
      await requestList(campusId.value);
    });

    const schoolRadio = async (data: any) => {
      //点击切换校区
      campusId.value = data;
      requestList(data);
    };

    /**
     * @description 切换全校confirim方法
     * @school 区分全校状态
     * @requestData 校区id
     */
    const difConfirm = (school: string, requestData: { campusId: string }) => {
      let ifSchoolDif = 0;
      ifSchoolDif = school === '全校一致' ? 1 : 2;
      Modal.confirm({
        title: `是否确认切换为${school}`,
        content: '切换后原配置会保存',
        async onOk() {
          try {
            await validTimeServicePresenter.switch(requestData);
            isAllSchoolSameRef.value = ifSchoolDif;
            message.success('切换成功');
            requestList(campusId.value);
          } catch (error) {
            message.error(error.message);
          }
        }
      });
    };

    const switchAllSchool = (value: number) => {
      const data = {
        campusId: campusId.value
      };
      if (value === 1) {
        difConfirm('全校一致', data);
      } else {
        difConfirm('全校不同', data);
      }
    };

    const updateId = ref<string>('');
    const update = (data: any) => {
      visible.value = true;
      modalYear.value = data.yearType;
      modalSemester.value = data.semesterType;
      updateId.value = data.id;
      if (data.startDate !== '' && data.endDate !== '') {
        formState.date = [
          moment(data.startDate, 'YYYY/MM/DD'),
          moment(data.endDate, 'YYYY/MM/DD')
        ];
      }
    };

    const reset = (data: string) => {
      const requestData = {
        id: data,
        startDate: '1',
        endDate: '1'
      };
      const titleVnode = getModalHeadVNode('是否确定重置有效时间设置');
      Modal.confirm({
        title: titleVnode,
        content: '重置后，数据恢复至初始状态。',
        class: 'modal-class',
        async onOk() {
          try {
            await validTimeServicePresenter.resetTime(requestData);
            message.success('重置成功');
            requestList(campusId.value);
          } catch (error) {
            message.error(error.message);
          }
        }
      });
    };

    const modalOk = () => {
      const data = {
        endDate: moment(formState.date[1]).format('x'),
        id: updateId.value,
        startDate: moment(formState.date[0]).format('x')
      };
      validate()
        .then(async () => {
          visible.value = false;
          try {
            await validTimeServicePresenter.update(data);
            message.success('编辑成功');
            requestList(campusId.value);
            resetFields();
          } catch (error) {
            resetFields();
            message.error(error.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const modalCancel = () => {
      visible.value = false;
      resetFields();
    };

    return {
      campus,
      isAllSchoolSameRef,
      dataSource,
      columns,
      formState,
      visible,
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      validateInfos,
      campusList,
      modalYear,
      modalSemester,
      //事件
      switchAllSchool,
      update,
      reset,
      modalOk,
      modalCancel,
      schoolRadio
    };
  }
});
</script>
<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;

  .header {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 20px 0;

    .header-left {
      font-weight: 700;
    }
    .header-right {
      color: #1966fe;
      cursor: pointer;
    }
  }

  .update {
    margin-right: 24px;
  }
}
.dialog_semester {
  font-weight: 700;
  margin-bottom: 10px;
}
.modal-form {
  margin: 30px 0 0 -125px;
}
</style>
