<template>
  <div class="content-wrap">
    <a-form :model="formState" layout="inline" label-align="left">
      <a-form-item label="题目名称">
        <a-input-search
          v-model:value="formState.title"
          placeholder="请输入关键词"
          @search="loadFirstPage"
        />
      </a-form-item>
      <a-form-item label="题型">
        <a-select
          v-model:value="formState.questionType"
          :options="selectOptionQuestionType"
          @change="loadFirstPage"
        ></a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
        <a-space :size="16">
          <a-button type="primary" @click="loadFirstPage">
            查询
          </a-button>
          <a-button @click="handleReset">
            重置
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <div class="mt-18 btn-group">
      <a-space :size="16">
        <a-button v-show="!isRowSelection" type="primary" @click="showModal">
          新建题目
        </a-button>
        <ImoortFileAsync
          :show-file-dialog="showFileDialog"
          :import-service="importTopic"
          :query-condition-service="extraTopicImport"
          :export-err="exportOtherErr"
          @importExcelSuccess="importExcelSuccess"
        >
          <a-button v-show="!isRowSelection" @click="handleImport">
            批量导入
          </a-button>
        </ImoortFileAsync>
        <a-button v-show="!isRowSelection" @click="exportTopicTemplate">
          下载题目模板
        </a-button>
        <a-button
          :class="isRowSelection ? 'del-class' : ''"
          :type="isRowSelection ? 'primary' : ''"
          @click="changeDeleteState"
        >
          批量删除
        </a-button>
        <a-button v-show="isRowSelection" @click="cancelDel">
          取消
        </a-button>
        <span v-show="isRowSelection">
          已选：
          <span class="warn-text">{{ howDelItem }}</span>
          项
        </span>
      </a-space>
    </div>
    <div class="content mt-18">
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        :row-selection="isRowSelection ? rowSelection : null"
        :loading="loading"
        row-key="id"
      >
        <template #questionType="{record}">
          <a-tag :color="getColor(record.questionType)">
            {{ record.questionStr }}
          </a-tag>
        </template>
        <template #operation="{record}">
          <a-space class="operation" :size="32">
            <a-button
              :disabled="isRowSelection"
              type="link"
              @click="update(record)"
            >
              编辑
            </a-button>
            <a-button
              :disabled="isRowSelection"
              type="link"
              @click="deleteQuestion(record.id)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>
    <TopicModal
      :visible="visible"
      :update-prop-data="updatePropData.data"
      :add-or-update="addOrUpdate"
      :is-teacher-appraise="true"
      @hide-modal="handleHideModal"
      @success-modal="handleModalSuccess"
    />
  </div>
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
import { computed, defineComponent, reactive, ref, unref } from 'vue';
import TopicModal from '../../TheoryExamination/TopicConfiguration/TopicModal/Index.vue';
import { TeacherEvaluateServicesPresenter } from '@/request/api/presenter/teacherEvaluation';
import { TeacherEvaluateServicesModal } from '@/request/api/model/teacherEvaluation';
import { useForm } from '@ant-design-vue/use';
import { usePagination } from '@/hooks/usePagination';
import { getModalHeadVNode } from '@/utils/common';
import { isString } from 'lodash';
import ImoortFileAsync from '@/components/global/ImportFileAsync.vue';

interface dataSourceListAnswer {
  answerContent: string;
  id: string;
  tag: string;
}
interface dataSourceList {
  answerList: dataSourceListAnswer[];
  id: string;
  questionName: string;
  questionType: number;
  used: boolean;
}
export default defineComponent({
  name: 'SubjectConfiguration',
  components: { TopicModal, ImoortFileAsync },
  setup() {
    const formState = reactive({
      title: '',
      questionType: 0
    });
    const rulesRef = reactive({});
    const { resetFields } = useForm(formState, rulesRef);
    const loading = ref<boolean>(false);
    const showFileDialog = ref<boolean>(false);

    const selectOptionQuestionType = [
      {
        value: 0,
        label: '全部'
      },
      {
        value: 1,
        label: '单选'
      },
      {
        value: 2,
        label: '非固定选题'
      },
      {
        value: 3,
        label: '评分题'
      },
      {
        value: 4,
        label: '简答题'
      }
    ];

    const columns = [
      {
        dataIndex: 'questionName',
        title: '题目名称',
        ellipsis: true
      },
      {
        title: '题型',
        dataIndex: 'questionType',
        slots: { customRender: 'questionType' }
      },
      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource = ref<dataSourceList[]>([]);

    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const delIdList = ref<string[]>([]);

    const queryList = async () => {
      loading.value = true;
      delIdList.value = [];
      const data = {
        page: current.value,
        questionName: formState.title,
        questionType:
          formState.questionType === 0 ? null : formState.questionType,
        size: pageSize.value
      };
      try {
        const res = await TeacherEvaluateServicesPresenter.queryTeacherTopic(
          data
        );
        totalNum.value = res.total;
        dataSource.value = res.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    queryList();

    const loadFirstPage = () => {
      current.value = 1;
      queryList();
    };
    const handleReset = () => {
      resetFields();
      queryList();
    };

    const { pagination } = usePagination(
      queryList,
      pageSize,
      current,
      totalNum
    );

    const getColor = computed(() => {
      return (code: number) => {
        switch (code) {
          case 1:
            return 'cyan';
          case 2:
            return 'blue';
          case 3:
            return 'purple';
          case 4:
            return 'green';
        }
      };
    });

    const isRowSelection = ref<boolean>(false);
    const howDelItem = computed(() => {
      return delIdList.value.length || 0;
    });

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(delIdList),
        hideDefaultSelections: true,
        onChange: (changableRowKeys: any[]) => {
          for (let i = 0; i < changableRowKeys.length; i++) {
            delIdList.value[i] = changableRowKeys[i];
          }
          delIdList.value.length = changableRowKeys.length;
        }
      };
    });

    // 删除题目（单个/多个）
    const deleteQuestion = (val: string[] | string) => {
      const data = {
        idList: [] as string[]
      };
      if (isString(val)) {
        data.idList[0] = val;
      } else {
        data.idList = val;
      }
      const titleVnode = getModalHeadVNode('删除题目');
      Modal.confirm({
        title: titleVnode,
        content: '题目删除后不可恢复，不影响历史数据，是否继续？？',
        okText: '继续',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await TeacherEvaluateServicesPresenter.delTeacherTopic(data);
            queryList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: error.message
            });
          }
        }
      });
    };

    const changeDeleteState = () => {
      if (isRowSelection.value) {
        //当前处于批量删除状态
        if (delIdList.value.length === 0) {
          message.warning('请先勾选要删除的配置!');
          return;
        } else {
          deleteQuestion(delIdList.value);
        }
      } else {
        isRowSelection.value = true;
      }
    };

    const exportTopicTemplate = async () => {
      try {
        await TeacherEvaluateServicesModal.export();
      } catch (error) {
        console.log(error);
      }
    };

    const cancelDel = () => {
      isRowSelection.value = false;
    };

    const visible = ref<boolean>(false);
    const addOrUpdate = ref<boolean>(true);

    const updatePropData = reactive({
      data: {}
    });
    const update = (value: any) => {
      addOrUpdate.value = false;
      visible.value = true;
      updatePropData.data = value;
    };

    const showModal = () => {
      addOrUpdate.value = true;
      visible.value = true;
    };
    const handleHideModal = () => {
      visible.value = false;
      updatePropData.data = {};
    };
    const handleModalSuccess = () => {
      visible.value = false;
      queryList();
      updatePropData.data = {};
    };

    const handleImport = async () => {
      showFileDialog.value = true;
    };
    const importExcelSuccess = () => {
      queryList();
    };
    return {
      formState,
      selectOptionQuestionType,
      columns,
      dataSource,
      getColor,
      showModal,
      handleHideModal,
      handleModalSuccess,
      addOrUpdate,
      visible,
      changeDeleteState,
      isRowSelection,
      rowSelection,
      howDelItem,
      cancelDel,
      loadFirstPage,
      handleReset,
      pagination,
      deleteQuestion,
      exportTopicTemplate,
      update,
      updatePropData,
      handleImport,
      showFileDialog,
      importTopic: TeacherEvaluateServicesModal.importTopic,
      extraTopicImport: TeacherEvaluateServicesModal.extraTopicImport,
      exportOtherErr: TeacherEvaluateServicesModal.downloadExportErr,
      importExcelSuccess,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
.content-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
.mt-18 {
  margin-top: 18px;
}
.del-class {
  margin-left: -47px;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.operation .ant-btn) {
  padding: 0;
}
</style>
