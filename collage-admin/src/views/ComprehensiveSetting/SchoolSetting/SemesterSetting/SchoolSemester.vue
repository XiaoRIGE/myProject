<!--
 * @Author: lyh
 * @Date: 2021-07-19 10:41:32
 * @LastEditTime: 2021-09-27 17:55:42
 * @LastEditors: Please set LastEditors
 * @Description: 学校设置 学期设置
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\SchoolSetting\SemesterSetting\SchoolSemester.vue
-->
<template>
  <div>
    <div v-if="semesterList.length > 0" class="test-wrap">
      <div class="new-project">
        <a-button type="primary" @click="showModal">
          新增学期
        </a-button>
      </div>
      <div class="curriculum-provision-table">
        <a-table
          :columns="columns"
          :data-source="semesterList"
          :loading="loading"
          row-key="id"
          :pagination="false"
        >
          <template #action="{record}">
            <a class="update" @click="upDate(record, 2)">编辑</a>
            <a class="delate" @click="delateSemester(record, index)">删除</a>
          </template>
        </a-table>
      </div>
    </div>
    <a-empty
      v-else
      class="nodata"
      :image-style="{
        height: '74px'
      }"
    >
      <template #description>
        <span>您还没添加任何学期，添加后才可以进行课程配置</span>
      </template>
      <a-button type="primary" @click="showModal">
        +&emsp;添加学期
      </a-button>
    </a-empty>

    <a-modal
      v-model:visible="visible"
      :mask-closable="false"
      title="请填写学期信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>
        <a-form
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
          name="courseForm"
        >
          <a-form-item label="学年" v-bind="validateInfos.region">
            <a-select v-model:value="formState.region" placeholder="请选择学年">
              <a-select-option :value="systemTimeAgo">
                {{ systemTimeAgo }}学年
              </a-select-option>
              <a-select-option :value="systemTimeLat">
                {{ systemTimeLat }}学年
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="学期">
            <a-radio-group v-model:value="formState.radioValue">
              <a-radio :value="1">
                上学期
              </a-radio>
              <a-radio :value="2">
                下学期
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-bind="validateInfos.semesterDate" label="选择日期">
            <a-space direction="vertical">
              <a-range-picker
                v-model:value="formState.semesterDate"
                @change="dataChange"
              />
            </a-space>
          </a-form-item>
        </a-form>
      </p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, UnwrapRef, onMounted } from 'vue';
import moment from 'moment';
import { message, Modal } from 'ant-design-vue';
import SemesterServicePresenter from '@/request/api/presenter/schoolSetting';
import { useForm } from '@ant-design-vue/use';
import { getModalHeadVNode } from '@/utils/common';

import { useStore } from 'vuex';
interface FormState {
  region: string | undefined;
  semesterDate: any;
  radioValue: number;
}
interface dataItem {
  organizationId: string;
  startDate: number;
  endDate: number;
  yearRange: string;
  index: number;
  id: string;
}

export default defineComponent({
  setup() {
    const dateFormat = 'YYYY/MM/DD';
    let keyId = '';
    const visible = ref<boolean>(false);
    const systemTimeAgo = ref<string>('');
    const systemTimeLat = ref<string>('');
    const numberType = ref<number>(); //添加或编辑
    const startData = ref<string>('');
    const endData = ref<string>('');
    const formState: UnwrapRef<FormState> = reactive({
      region: undefined,
      radioValue: 1,
      semesterDate: []
    });
    const loading = ref<boolean>(false);
    const columns = [
      { title: '学年', dataIndex: 'yearRange', key: 'yearRange' },
      { title: '学期', dataIndex: 'index', key: 'index' },
      { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
      { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        slots: { customRender: 'action' }
      }
    ];
    const semesterList: Ref<dataItem[]> = ref([]);

    const rulesRef = reactive({
      region: [
        {
          required: true,
          message: '请选择学年信息'
        }
      ],
      semesterDate: [
        {
          required: true,
          message: '请选择开始结束日期'
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(
      formState,
      rulesRef
    );

    const store = useStore();

    const getSemesterList = async function getSemesterList(): Promise<void> {
      //请求学期设置列表接口
      loading.value = true;
      const data = {
        page: 1,
        size: 10
      };
      try {
        const res = await SemesterServicePresenter.getSemesterList(data);
        semesterList.value = res.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const newSemester = async function newSemester(data: any): Promise<void> {
      //新增学期接口
      try {
        await SemesterServicePresenter.createSemester(data);
        visible.value = false;
        await getSemesterList();
        resetFields();
        store.dispatch('basic/updateSemesterList');
      } catch (error) {
        message.error(error.message);
        visible.value = true;
      }
    };

    const updateSemester = async function updateSemester(
      data: any
    ): Promise<void> {
      //编辑学期接口
      try {
        await SemesterServicePresenter.updateSemester(data);
        visible.value = false;
        await getSemesterList();
        store.dispatch('basic/updateSemesterList');
      } catch (error) {
        message.error(error.message);
        visible.value = true;
      }
    };

    const getCurrentTime = async function getCurrentTime(): Promise<void> {
      //获取当前时间接口
      try {
        const res = await SemesterServicePresenter.getSemesterTime();
        const systemTime = parseInt(moment(res.data.data).format('YYYY'));
        systemTimeAgo.value = `${systemTime - 1}-${systemTime}`;
        systemTimeLat.value = `${systemTime}-${systemTime + 1}`;
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      await getSemesterList();
      getCurrentTime();
    });

    const showModal = () => {
      //新增学期dialog
      numberType.value = 1;
      formState.region = undefined;
      formState.radioValue = 1;
      formState.semesterDate = [];
      visible.value = true;
    };

    const dataChange = (data: string, dateString: any) => {
      //改变日期
      startData.value = dateString[0].replaceAll('/', '-');
      endData.value = dateString[1].replaceAll('/', '-');
    };

    const handleOk = async () => {
      //保存
      let region = '';
      if (formState.region !== undefined) {
        console.log(formState.region.substring(0, 9));
        region = formState.region.substring(0, 9);
      }
      const newData = {
        startDate: 1,
        endDate: 1,
        yearRange: formState.region,
        index: 1
      };

      const updateDate = {
        id: '',
        startDate: 1,
        endDate: 1,
        yearRange: region,
        index: 1
      };
      validate()
        .then(async () => {
          newData.index = formState.radioValue;
          updateDate.index = formState.radioValue;
          updateDate.id = keyId;

          newData.startDate = Date.parse(startData.value);
          newData.endDate = Date.parse(endData.value);
          updateDate.startDate = Date.parse(startData.value);
          updateDate.endDate = Date.parse(endData.value);

          if (numberType.value !== 1) {
            await updateSemester(updateDate);
            resetFields();
            return;
          }
          if (
            formState.region === undefined ||
            formState.semesterDate.length === 0
          ) {
            visible.value = true;
          } else {
            //判断学年选择日期都不为空执行
            await newSemester(newData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const handleCancel = () => {
      resetFields();
    };

    const upDate = function upDate(key: any, num: number) {
      //编辑
      keyId = key.id;
      if (key.index === '上学期') {
        formState.radioValue = 1;
      } else {
        formState.radioValue = 2;
      }
      numberType.value = num;
      startData.value = key.startDate.replaceAll('-', '/');
      endData.value = key.endDate.replaceAll('-', '/');
      formState.semesterDate = [
        moment(startData.value, dateFormat),
        moment(endData.value, dateFormat)
      ];
      visible.value = true;
      formState.region = key.yearRange;
    };

    const delateSemester = function delate(key: any) {
      //删除dialog

      const titleVnode = getModalHeadVNode('确认删除');
      Modal.confirm({
        title: titleVnode,
        content: '确认要删除该学期吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          const id = {
            id: key.id
          };
          try {
            await SemesterServicePresenter.deleteSemester(id.id);
            await getSemesterList();
            store.dispatch('basic/updateSemesterList');
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    return {
      systemTimeAgo,
      systemTimeLat,
      columns,
      upDate,
      delateSemester,
      visible,
      showModal,
      startData,
      endData,
      semesterList,
      handleOk,
      handleCancel,
      numberType,
      formState,
      dataChange,
      moment,
      validateInfos,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
.new-project {
  margin-bottom: 24px;
  float: left;
}
.curriculum-provision-table {
  width: 100%;
  margin: 48px 0 48px 0;

  .update {
    margin-right: 32px;
  }
  .delate {
    color: #ff4d4f;
  }
}
.nameLog {
  border-color: #ff4d4f;
}
.nodata {
  margin-top: 90px;
}
</style>
