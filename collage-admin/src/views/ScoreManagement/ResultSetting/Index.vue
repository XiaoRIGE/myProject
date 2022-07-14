<!--
 * @Author: lyh
 * @Date: 2021-11-09 14:14:03
 * @LastEditTime: 2022-05-05 17:13:10
 * @LastEditors: Please set LastEditors
 * @Description: 成绩设置
 * @FilePath: \collage-admin\src\views\ScoreManagement\ResultSetting\Index.vue
-->
<template>
  <div class="content">
    单项成绩显示方式：
    <span v-if="appGradeShowSetting.oneShow">百分制</span>
    <span v-else>小分制</span>
    &emsp;&emsp; App成绩显示设置：
    <span v-if="appGradeShowSetting.appGradeShow === 1">仅展示总分</span>
    <span v-if="appGradeShowSetting.appGradeShow === 0">不展示分数</span>
    <span v-if="appGradeShowSetting.appGradeShow === 2">展示所有分数</span>
    <span class="update" @click="showAllUpdateModal">&emsp;编辑</span>
    <div class="table">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataRef"
        :pagination="false"
        :loading="loading"
        bordered
      >
        <template #schoolYear="{ text}">
          <span class="font-weight">
            {{ text }}
          </span>
        </template>
        <template #semesterType="{ text}">
          <span class="font-weight">
            {{ text }}
          </span>
        </template>
        <template #total="{ text}">
          <span v-if="text === null">-</span>
          <span
            v-else
            :style="text === 100 ? '' : 'color:#FF3939'"
            class="font-weight"
          >
            {{ text }}%
          </span>
        </template>
        <template #sign="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #running="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #activity="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #fitness="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #theoryExamination="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #specialExamination="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #coursePerformance="{ text}">
          <span v-if="text === '-'">-</span>
          <span v-else>{{ text }}%</span>
        </template>
        <template #operation="{record }">
          <a class="table-update" @click="update(record)">编辑</a>
          <a @click="reset(record)">重置</a>
        </template>
      </a-table>
    </div>
  </div>

  <ResultSettingDialog
    :is-drawer-show="isDrawerShowRef"
    :result-setting-data="resultSettingDialogData.data"
    :school-year="schoolYearRef"
    @change-visible="changeVisible"
  />

  <a-modal
    v-model:visible="allUpdateVisibleRef"
    class="all-update-modal"
    title="编辑"
    @ok="handleOk"
  >
    <a-form layout="inline">
      <a-form-item label="单项成绩显示方式">
        <a-select v-model:value="singleShowType" placeholder="请选择">
          <a-select-option :value="0">小分制</a-select-option>
          <a-select-option :value="1">百分制</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="App成绩显示设置">
        <a-select v-model:value="appShowType" placeholder="请选择">
          <a-select-option :value="0">不展示分数</a-select-option>
          <a-select-option :value="1">仅展示总分</a-select-option>
          <a-select-option :value="2">展示所有分数</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { getModalHeadVNode } from '@/utils/common';
import ResultSettingDialog from './ResultSettingDialog/Index.vue';
import { GradeSettingServicePresenter } from '@/request/api/presenter/schoolSetting';

export default defineComponent({
  components: {
    ResultSettingDialog
  },
  setup() {
    const columns = ref<any>([
      {
        title: '年级',
        dataIndex: 'schoolYear',
        slots: { customRender: 'schoolYear' }
      },
      {
        title: '学期',
        dataIndex: 'semesterType',
        slots: { customRender: 'semesterType' }
      },
      {
        title: '总和',
        dataIndex: 'total',
        slots: { customRender: 'total' }
      },
      {
        title: '成绩权重',
        children: [
          {
            title: '考勤',
            dataIndex: 'sign',
            slots: { customRender: 'sign' }
          },
          {
            title: '跑步',
            dataIndex: 'running',
            slots: { customRender: 'running' }
          },
          {
            title: '课外活动',
            dataIndex: 'activity',
            slots: { customRender: 'activity' }
          },
          {
            title: '体质健康',
            dataIndex: 'fitness',
            slots: { customRender: 'fitness' }
          },
          {
            title: '理论考试',
            dataIndex: 'theoryExamination',
            slots: { customRender: 'theoryExamination' }
          },
          {
            title: '',
            dataIndex: 'coursePerformance',
            slots: { customRender: 'coursePerformance' }
          },
          {
            title: '专项考试',
            dataIndex: 'specialExamination',
            slots: { customRender: 'specialExamination' }
          }
        ]
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ]);

    const allUpdateVisibleRef = ref<boolean>(false);
    const isDrawerShowRef = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const resultSettingDialogData = reactive({
      data: {}
    });
    const dataRef = ref([]);
    const allUpdateFormState = reactive({
      singleShowType: 0,
      appShowType: 0,
      id: ''
    });
    const appGradeShowSetting = reactive({
      oneShow: 0,
      appGradeShow: 0
    });

    const getGradeList = async () => {
      loading.value = true;
      try {
        const res = await GradeSettingServicePresenter.getGradeList();
        dataRef.value = res;
        columns.value[3].children[5].title = res[0].normalName; //动态表头
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    const showGrade = async () => {
      try {
        const res = await GradeSettingServicePresenter.showGrade();
        allUpdateFormState.singleShowType = res.singleShowType;
        allUpdateFormState.appShowType = res.appShowType;
        allUpdateFormState.id = res.id;

        appGradeShowSetting.oneShow = res.singleShowType;
        appGradeShowSetting.appGradeShow = res.appShowType;
      } catch (error) {
        console.log(error);
      }
    };
    getGradeList();
    showGrade();

    const showAllUpdateModal = () => {
      allUpdateVisibleRef.value = true;
    };

    //编辑成绩显示保存
    const handleOk = async () => {
      const data = {
        appShowType: allUpdateFormState.appShowType,
        id: allUpdateFormState.id,
        singleShowType: allUpdateFormState.singleShowType
      };
      try {
        await GradeSettingServicePresenter.updateShowGrade(data);
        await showGrade();
        message.success('保存成功');
        allUpdateVisibleRef.value = false;
      } catch (error) {
        Modal.error({
          title: '编辑失败',
          content: `${error.message}`
        });
      }
    };

    const schoolYearRef = ref();
    //表格编辑
    const update = (data: any) => {
      resultSettingDialogData.data = {};
      setTimeout(() => {
        resultSettingDialogData.data = data;
        schoolYearRef.value = data.schoolYear + data.semesterType;
        isDrawerShowRef.value = true;
      }, 1);
    };
    //表格重置
    const reset = (data: any) => {
      const titleVnode = getModalHeadVNode('重置');
      Modal.confirm({
        title: titleVnode,
        content: '确定要重置吗',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await GradeSettingServicePresenter.resetGradeSetting(data.id);
            getGradeList();
            message.success('重置成功');
          } catch (error) {
            Modal.error({
              title: '重置失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const changeVisible = (data: number) => {
      //data 0关闭 data 1 刷新
      isDrawerShowRef.value = false;

      if (data === 1) {
        getGradeList();
        message.success('编辑成功');
      }
    };

    return {
      //表格
      dataRef,
      columns,
      reset,
      update,
      //全局状态
      allUpdateVisibleRef,
      showAllUpdateModal,
      loading,
      appGradeShowSetting,
      //表单
      ...toRefs(allUpdateFormState),
      //组件
      isDrawerShowRef,
      changeVisible,
      resultSettingDialogData,
      schoolYearRef,
      //事件
      handleOk
    };
  }
});
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;

  .update {
    color: #1966fe;
    cursor: pointer;
  }
  .table {
    margin-top: 25px;
    .table-update {
      margin-right: 20px;
    }
  }
}
:deep(.ant-form-item-control-wrapper) {
  width: 73%;
}
:deep(.ant-form-item) {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.font-weight {
  font-weight: 600;
}
</style>
