<template>
  <div class="content">
    <div>
      <a-form layout="inline" label-align="left">
        <a-form-item label="学年">
          <a-select v-model:value="form.year" @change="handleYearChange">
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option :value="1">
              大一
            </a-select-option>
            <a-select-option :value="2">
              大二
            </a-select-option>
            <a-select-option :value="3">
              大三
            </a-select-option>
            <a-select-option :value="4">
              大四
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属项目">
          <a-select
            v-model:value="form.subject"
            placeholder="请选择"
            @change="handleChangeProject"
          >
            <a-select-option :value="''">
              全部
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

        <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
          <a-space :size="16">
            <a-button type="primary" @click="loadFirstPage">
              查询
            </a-button>
            <a-button @click="reset">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <div class="bottom_btn">
        <a-button
          v-show="!isRowSelection"
          type="primary"
          class="item_btn"
          @click="handelNewConfig"
        >
          新建配置
        </a-button>
        <a-button
          v-show="!isRowSelection"
          class="item_btn"
          @click="handleAllUpdate"
        >
          批量编辑
        </a-button>
        <a-button
          class="item_btn"
          :type="isRowSelection ? 'primary' : ''"
          @click="handleAllDel"
        >
          批量删除
        </a-button>
        <a-button v-show="isRowSelection" @click="cancelDel">
          取消
        </a-button>
        <span v-show="isRowSelection">
          已选：
          <span class="warn-text">{{ delIdList.length || 0 }}</span>
          项
        </span>
      </div>
    </div>

    <div class="table">
      <a-table
        :row-selection="isRowSelection ? rowSelection : null"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 1300 }"
        :pagination="pagination"
      >
        <template #time="record">
          起:&nbsp;{{ record.record.testTimeFrom }} 止:&nbsp;{{
            record.record.testTimeTo
          }}
        </template>
        <template #totalPoint="record">
          <span
            v-if="record.record.totalPoint !== 100"
            class="totalPoint_color"
          >
            {{ record.record.totalPoint }}
          </span>
          <span v-else>
            {{ record.record.totalPoint }}
          </span>
        </template>
        <template #oneChoice="record">
          共{{ record.record.singleChoiceCount }}题({{
            record.record.singleChoiceScore
          }}分/题)
          <br />
          含{{ record.record.singleChoiceCurrencyCount }}道通用题
        </template>
        <template #unset="record">
          共{{ record.record.multipleChoiceCount }}题({{
            record.record.multipleChoiceScore
          }}分/题)
          <br />
          含{{ record.record.multipleChoiceCurrencyCount }}道通用题
        </template>
        <template #isQuestion="record">
          共{{ record.record.judgeChoiceCount }}题({{
            record.record.judgeChoiceScore
          }}分/题)
          <br />
          含{{ record.record.judgeChoiceCurrencyCount }}道通用题
        </template>
        <template #operation="record">
          <a-space class="operation" :size="32">
            <a-button
              type="link"
              :disabled="isRowSelection"
              @click="handleTableUpdate(record)"
            >
              编辑
            </a-button>
            <a-button
              type="link"
              :disabled="isRowSelection"
              @click="handleTableDel(record.record.id)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>
  </div>

  <ConfigModal
    :visible="addConfigModal"
    :add-or-update="addOrUpdate"
    :update-record="updateRecord.data"
    @handle-close="handleModalClose"
    @handle-sure="handleModalSure"
  />
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, unref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { usePagination } from '@/hooks/usePagination';
import ConfigModal from './ConfigModal/Index.vue';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { useStore } from 'vuex';
import { TheoryExaminationServicePresenter } from '@/request/api/presenter/examination';

const getStoreInfo = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  store.dispatch('basic/updateProjectList');
  return {
    projectList
  };
};
export default defineComponent({
  components: {
    ConfigModal
  },
  setup() {
    const { projectList } = getStoreInfo();

    const dataSource = ref<any>([]);

    const form = reactive({
      year: 0,
      subject: ''
    });
    const { resetFields } = useForm(form, reactive({}));

    const columns = [
      {
        title: '学年',
        dataIndex: 'schoolYear',
        width: 100,
        key: 'schoolYear'
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
        key: 'projectName'
      },
      {
        title: '考试时间',
        dataIndex: 'time',
        key: 'time',
        slots: { customRender: 'time' }
      },
      {
        title: '答题时长',
        dataIndex: 'testTime',
        width: 100,
        key: 'testTime'
      },
      {
        title: '总分',
        dataIndex: 'totalPoint',
        width: 100,
        key: 'totalPoint',
        slots: { customRender: 'totalPoint' }
      },
      {
        title: '单选题',
        dataIndex: 'oneChoice',
        key: 'oneChoice',
        slots: { customRender: 'oneChoice' }
      },
      {
        title: '非固定选题',
        dataIndex: 'unset',
        key: 'unset',
        slots: { customRender: 'unset' }
      },
      {
        title: '判断题',
        dataIndex: 'isQuestion',
        key: 'isQuestion',
        slots: { customRender: 'isQuestion' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 120,
        slots: { customRender: 'operation' }
      }
    ];

    const loading = ref<boolean>(false);
    const isRowSelection = ref<boolean>(false);
    const delIdList = ref<any[]>([]);

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

    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const totalNumRef = ref<number>(0);
    const queryList = async () => {
      delIdList.value = [];
      loading.value = true;
      const data = {
        page: currentRef.value,
        projectId: form.subject,
        schoolYear: form.year === 0 ? undefined : form.year,
        size: pageSizeRef.value
      };
      try {
        const res = await TheoryExaminationServicePresenter.queryList(data);
        dataSource.value = res.items;
        totalNumRef.value = res.total;
      } catch (error) {
        console.log(error.message);
      } finally {
        loading.value = false;
      }
    };
    queryList();
    const loadFirstPage = () => {
      currentRef.value = 1;
      queryList();
    };

    const handleYearChange = () => {
      loadFirstPage();
    };
    const handleChangeProject = () => {
      loadFirstPage();
    };

    const handleAllDel = () => {
      if (isRowSelection.value) {
        //当前处于批量删除状态
        if (delIdList.value.length === 0) {
          message.warning('请先勾选要删除的配置!');
          return;
        }
        const data = {
          idList: delIdList.value
        };
        const titleVnode = getModalHeadVNode('删除配置');
        Modal.confirm({
          title: titleVnode,
          content: '配置删除后不可恢复，不影响历史数据，是否继续？',
          class: 'modal-class',
          async onOk() {
            try {
              await TheoryExaminationServicePresenter.delExam(data);
              queryList();
            } catch (error) {
              Modal.error({
                title: '删除失败',
                content: `${error.message}`
              });
            }
            message.success('删除成功');
          }
        });
      } else {
        isRowSelection.value = true;
      }
    };

    const addConfigModal = ref<boolean>(false);
    const addOrUpdate = ref<number>(0); //0新建 1编辑 2批量
    const handelNewConfig = () => {
      addOrUpdate.value = 0;
      addConfigModal.value = true;
    };

    const handleSearch = () => {
      queryList();
    };

    const cancelDel = () => {
      isRowSelection.value = false;
    };

    const updateRecord = reactive<any>({
      data: {
        year: ''
      }
    });
    const handleTableUpdate = (value: any) => {
      updateRecord.data = value.record;
      switch (updateRecord.data.schoolYear) {
        case '大一':
          updateRecord.data.year = 1;
          break;
        case '大二':
          updateRecord.data.year = 2;
          break;
        case '大三':
          updateRecord.data.year = 3;
          break;
        case '大四':
          updateRecord.data.year = 4;
      }
      addOrUpdate.value = 1;
      addConfigModal.value = true;
    };

    const handleAllUpdate = () => {
      addOrUpdate.value = 2;
      addConfigModal.value = true;
    };

    const { pagination } = usePagination(
      handleSearch,
      pageSizeRef,
      currentRef,
      totalNumRef
    );

    const reset = () => {
      resetFields();
      loadFirstPage();
    };

    const handleModalSure = () => {
      addConfigModal.value = false;
      queryList();
    };
    const handleModalClose = () => {
      updateRecord.data = {};
      addConfigModal.value = false;
    };

    const handleTableDel = (value: string) => {
      const data = {
        idList: [value]
      };
      const titleVnode = getModalHeadVNode('删除配置');
      Modal.confirm({
        title: titleVnode,
        content: '配置删除后不可恢复，不影响历史数据，是否继续？',
        class: 'modal-class',
        async onOk() {
          try {
            await TheoryExaminationServicePresenter.delExam(data);
            queryList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
          message.success('删除成功');
        }
      });
    };

    return {
      //表格
      dataSource,
      columns,
      rowSelection,
      //表单
      form,
      projectList,
      updateRecord,
      //事件
      reset,
      handleAllDel,
      cancelDel,
      handelNewConfig,
      pagination,
      handleModalSure,
      handleModalClose,
      handleAllUpdate,
      handleTableUpdate,
      handleTableDel,
      handleYearChange,
      handleChangeProject,
      loadFirstPage,
      //状态
      loading,
      isRowSelection,
      addConfigModal,
      addOrUpdate,
      delIdList
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
  .bottom_btn {
    margin-top: 16px;

    .item_btn {
      margin-right: 14px;
    }
  }
  .state {
    position: relative;
    padding-left: 18px;
    .no-point {
      position: absolute;
      font-size: 60px;
      color: #1890ff;
      top: -43px;
    }
  }
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
.table {
  margin-top: 20px;
  .del_btn {
    margin-left: 20px;
    color: #ff4d4f;
  }
}
:deep(.operation .ant-btn) {
  padding: 0;
}
.totalPoint_color {
  color: #ff4d4f;
}
</style>
