<template>
  <div class="test-wrap">
    <a-form :model="formState" layout="inline" label-align="left">
      <a-form-item label="题目名称">
        <a-input-search
          v-model:value="formState.title"
          placeholder="请输入关键词"
          @search="handleSearch"
        />
      </a-form-item>
      <a-form-item label="所属项目">
        <a-select
          v-model:value="formState.project"
          placeholder="请输入"
          @change="handleSearch"
        >
          <a-select-option :value="''">
            全部
          </a-select-option>
          <a-select-option :value="'general_project_id'">
            通用项目
          </a-select-option>
          <a-select-option
            v-for="item in projectList"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="题型">
        <a-select
          v-model:value="formState.questionType"
          :options="selectOption2"
          @change="handleSearch"
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
      <a-space v-show="!isDeleteState" :size="16">
        <a-button type="primary" @click="showModal">
          新建题目
        </a-button>

        <ImoortFileAsync
          :show-file-dialog="showFileDialog"
          :import-service="importTopic"
          :query-condition-service="extraTopicImport"
          :export-err="exportOtherErr"
          @importExcelSuccess="importExcelSuccess"
        >
          <a-button @click="handleImport">
            批量导入
          </a-button>
        </ImoortFileAsync>
        <a-button @click="exportTopicTemplate">
          下载题目模板
        </a-button>
        <a-button @click="changeDeleteState">
          批量删除
        </a-button>
      </a-space>
      <a-space v-show="isDeleteState" :size="16">
        <a-button type="primary" @click="handleDelete">
          批量删除
        </a-button>
        <a-button @click="handleCancelDelete">
          取消
        </a-button>
        <span>
          已选：
          <span class="warn-text">{{ selectedRowKeysRef.length || 0 }}</span>
          项
        </span>
      </a-space>
    </div>
    <div class="content mt-18">
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        :row-selection="rowSelection"
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
              type="link"
              :disabled="isDeleteState"
              @click="updateQuestion(record)"
            >
              编辑
            </a-button>
            <a-button
              type="link"
              :disabled="isDeleteState"
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
      @hide-modal="handleHideModal"
      @success-modal="handleModalSuccess"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, ref, unref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { usePagination } from '@/hooks/usePagination';
import { message, Modal } from 'ant-design-vue';
import { getModalHeadVNode } from '@/utils/common';
import TopicModal from './TopicModal/Index.vue';
import { TheoryExaminationQuestionServicesPresenter } from '@/request/api/presenter/examination';
import { TheoryExaminationQuestionServicesModal } from '@/request/api/model/examination';
import { useStore } from 'vuex';
import { isString } from 'lodash';
import ImoortFileAsync from '@/components/global/ImportFileAsync.vue';

const getStoreInfo = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  store.dispatch('basic/updateProjectList');
  return {
    projectList
  };
};
export default defineComponent({
  components: { TopicModal, ImoortFileAsync },
  setup() {
    const { projectList } = getStoreInfo();

    const formState = reactive({
      title: '',
      project: '',
      questionType: ''
    });

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
        title: '所属项目',
        dataIndex: 'projectName'
      },

      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource = ref<any>([]);

    const selectOption2 = [
      {
        value: '',
        label: '全部'
      },
      {
        value: '1',
        label: '单选'
      },
      {
        value: '2',
        label: '非固定选题'
      },
      {
        value: '3',
        label: '判断'
      }
    ];

    const rulesRef = reactive({});
    const { resetFields } = useForm(formState, rulesRef);
    const addOrUpdate = ref<boolean>(true);
    const showFileDialog = ref<boolean>(false);
    const selectedRowKeysRef = ref<string[]>([]); //当前选择删除项

    const loading = ref<boolean>(false);
    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const totalNumRef = ref<number>(0);
    const queryList = async () => {
      loading.value = true;
      selectedRowKeysRef.value = [];
      const data = {
        page: currentRef.value,
        projectId: formState.project,
        questionName: formState.title,
        questionType:
          formState.questionType === '' ? null : formState.questionType,
        size: pageSizeRef.value
      };
      try {
        const res = await TheoryExaminationQuestionServicesPresenter.queryList(
          data
        );
        dataSource.value = res.items;
        totalNumRef.value = res.total;
      } catch (error) {
        message.error(error.message);
      } finally {
        loading.value = false;
      }
    };
    queryList();

    const loadFirstPage = () => {
      currentRef.value = 1;
      queryList();
    };

    const handleSearch = () => {
      queryList();
    };

    const handleReset = () => {
      resetFields();
      loadFirstPage();
    };

    const visible = ref<boolean>(false);
    const showModal = () => {
      addOrUpdate.value = true;
      visible.value = true;
    };

    const { pagination } = usePagination(
      handleSearch,
      pageSizeRef,
      currentRef,
      totalNumRef
    );

    // 删除题目（单个/多个）
    const deleteQuestion = (val: string[] | string) => {
      const data = {
        idList: [] as any
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
            await TheoryExaminationQuestionServicesPresenter.delExamQuestion(
              data
            );
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

    const updatePropData = reactive({
      data: {}
    });
    const updateQuestion = (val: any) => {
      addOrUpdate.value = false;
      updatePropData.data = val;
      visible.value = true;
    };

    const isDeleteState = ref<boolean>(false); //批量删除选择状态
    // 改变批量删除选择状态
    const changeDeleteState = () => {
      isDeleteState.value = !isDeleteState.value;
    };
    // 取消批量删除
    const handleCancelDelete = () => {
      changeDeleteState();
      selectedRowKeysRef.value = [];
    };
    // 批量删除
    const handleDelete = () => {
      if (!selectedRowKeysRef.value.length) {
        message.warning('请先勾选要删除的题目!');
        return;
      }
      deleteQuestion(selectedRowKeysRef.value);
    };
    const rowSelection = computed(() => {
      if (isDeleteState.value) {
        return {
          selectedRowKeys: unref(selectedRowKeysRef),
          hideDefaultSelections: true,
          onChange: (selectedRowKeys: string[]) => {
            selectedRowKeysRef.value = selectedRowKeys;
          }
          // hideDefaultSelections: true//隐藏全选当页、反选当页
        };
      }
      return null;
    });

    const getColor = computed(() => {
      return (code: number) => {
        switch (code) {
          case 1:
            return 'cyan';
          case 2:
            return 'blue';
          case 3:
            return 'purple';
        }
      };
    });

    const handleModalSuccess = () => {
      visible.value = false;
      updatePropData.data = {};
      queryList();
    };
    const handleHideModal = () => {
      visible.value = false;
      updatePropData.data = {};
    };

    const exportTopicTemplate = async () => {
      try {
        await TheoryExaminationQuestionServicesModal.export();
      } catch (error) {
        message.error(error.message);
      }
    };

    const handleImport = async () => {
      showFileDialog.value = true;
    };

    const importExcelSuccess = () => {
      queryList();
    };

    return {
      formState,
      selectOption2,
      loadFirstPage,
      handleReset,
      handleSearch,
      handleHideModal,
      showModal,
      dataSource,
      pagination,
      columns,
      isDeleteState,
      changeDeleteState,
      handleCancelDelete,
      handleDelete,
      deleteQuestion,
      rowSelection,
      selectedRowKeysRef,
      getColor,
      handleModalSuccess,
      visible,
      projectList,
      updateQuestion,
      updatePropData,
      addOrUpdate,
      exportTopicTemplate,
      showFileDialog,
      handleImport,
      importTopic: TheoryExaminationQuestionServicesModal.importTopic,
      extraTopicImport: TheoryExaminationQuestionServicesModal.extraTopicImport,
      exportOtherErr: TheoryExaminationQuestionServicesModal.downloadExportErr,
      importExcelSuccess
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
.mt-18 {
  margin-top: 18px;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.operation .ant-btn) {
  padding: 0;
}
</style>
