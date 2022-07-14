<template>
  <div class="EvaluationConfiguration content-wrap">
    <div class="head-info">
      <div class="left">
        <span class="label">教师评价</span>
        <!-- :disabled="!isCurrentSemester" -->
        <a-switch
          v-model:checked="delivery"
          checked-children="开"
          un-checked-children="关"
          @click="handleClick"
        />
      </div>
      <div v-if="delivery" class="right">
        <span>插入位置：</span>
        <span>{{ positionStr }}</span>
        <!-- :disabled="!isCurrentSemester" -->
        <a-button type="link" @click="choosePosition">
          编辑
        </a-button>
      </div>
    </div>
  </div>
  <div class="content-wrap table-box">
    <a-form :model="searchForm" layout="inline" label-align="left">
      <a-form-item label="所属项目" class="min-width-350">
        <a-select
          v-model:value="searchForm.courseId"
          show-search
          :filter-option="filterOption"
          placeholder="请选择"
          mode="multiple"
          @change="loadFirstPage"
        >
          <a-select-option
            v-for="item in projectList"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <div class="btn-box">
        <a-button type="primary" @click="handleAdd">新建配置</a-button>
      </div>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      row-key="id"
    >
      <template #operation="{record}">
        <a-space :size="24">
          <!-- :disabled="!isCurrentSemester" -->
          <a @click="handelEdit(record)">编辑</a>
          <a class="warn-text cursor" @click="handleDelete(record.id)">
            删除
          </a>
        </a-space>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" title="教师评价插入位置" @ok="handleOk">
    <a-checkbox-group v-model:value="checkedList" :options="plainOptions" />
  </a-modal>
  <ModalConfig
    :show-visible="showVisible"
    :default-data="defaultData"
    @refresh="handleRefresh"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  TeacherEvaluationPresenter,
  ConfigListMap,
  ConfigItem
} from '@/request/api/presenter/teacherEvaluation.ts';
import ModalConfig from './ModalConfig/Index.vue';
import { useProjectStore } from '@/hooks/useStoreData.ts';
import { usePagination } from '@/hooks/usePagination.ts';
import { getModalHeadVNode } from '@/utils/common';
// import { useStore } from 'vuex';

interface ProjectItem {
  key: string;
  value: string;
}

export default defineComponent({
  name: 'EvaluationConfiguration',
  components: { ModalConfig },
  setup() {
    // 教师评价配置信息
    const delivery = ref<boolean>(false); //配置开关
    const positionStr = ref<string>(''); //配置插入位置

    // const store = useStore();
    // const isCurrentSemester = computed(
    //   () => store.state.basic.currentSemester.current === 1
    // ); //是否当前学期

    // 切换教师评价开关
    const switchEvaluationConfig = async () => {
      try {
        const {
          evaluationSwitch,
          positionListStr
        } = await TeacherEvaluationPresenter.switchEvaluation();
        delivery.value = evaluationSwitch;
        positionStr.value = positionListStr;
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '切换失败',
          content: `${error?.message}`
        });
      }
    };
    // 开启教师评价
    const confirmOpen = () => {
      Modal.confirm({
        title: '开启教师评价',
        content:
          '开启后，学生可在app【我的-教师评价】进行教师评价，并且可将教师评价插入在「理论考试前」和「查看成绩前」让学生完成教师评价',
        onOk() {
          switchEvaluationConfig();
        },
        onCancel() {
          delivery.value = false;
        }
      });
    };
    // 关闭教师评价
    const confirmClose = () => {
      Modal.confirm({
        title: '关闭教师评价',
        content: '关闭后，学生在app将无法进行教师评价，是否禁用？',
        onOk() {
          switchEvaluationConfig();
        },
        onCancel() {
          delivery.value = true;
        }
      });
    };
    // 切换教师评价开关
    const handleClick = (checked: boolean | string | number) => {
      if (checked) {
        confirmOpen();
      } else {
        confirmClose();
      }
    };

    const visible = ref<boolean>(false); //选择插入位置弹窗
    const choosePosition = () => {
      visible.value = true;
    };

    const plainOptions = ['理论考试前', '查看成绩前'];
    const checkedList = ref<string[]>([]); //选中的插入位置

    // 编辑教师评价插入位置
    const handleOk = async () => {
      try {
        const params = {
          positionOne: checkedList.value.includes('理论考试前'),
          positionTwo: checkedList.value.includes('查看成绩前')
        };
        const {
          evaluationSwitch,
          positionListStr,
          positionList
        } = await TeacherEvaluationPresenter.editEvaluationPosition(params);
        delivery.value = evaluationSwitch;
        positionStr.value = positionListStr;
        checkedList.value = positionList;

        visible.value = false;
      } catch (error) {
        console.log(error);
      }
    };
    // 获取教师评价开关配置信息
    const getEvaluationConfig = async () => {
      try {
        const {
          evaluationSwitch,
          positionListStr,
          positionList
        } = await TeacherEvaluationPresenter.getEvaluation();
        delivery.value = evaluationSwitch;
        positionStr.value = positionListStr;
        checkedList.value = positionList;
      } catch (error) {
        console.log(error);
      }
    };
    getEvaluationConfig();

    // 搜索项
    const searchForm = reactive({
      courseId: []
    });

    const columns = [
      {
        title: '所属项目',
        dataIndex: 'name',
        key: 'name',
        slots: { customRender: 'name' },
        ellipsis: true
      },
      {
        title: '单选题',
        dataIndex: 'singleChoiceLength',
        key: 'singleChoiceLength'
      },
      {
        title: '非固定选题',
        dataIndex: 'multipleChoiceLength',
        key: 'multipleChoiceLength'
      },
      {
        title: '评分题',
        dataIndex: 'scoringQuestionsLength',
        key: 'scoringQuestionsLength'
      },
      {
        title: '简答题',
        dataIndex: 'shortAnswerQuestionsLength',
        key: 'shortAnswerQuestionsLength'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource = ref<ConfigListMap[]>([]);

    const loading = ref<boolean>(false);
    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const totalNumRef = ref<number>(0);

    // 查询配置列表
    const queryList = async () => {
      loading.value = true;
      const params = {
        page: currentRef.value,
        projectId: searchForm.courseId.join(','),
        size: pageSizeRef.value
      };
      try {
        const res = await TeacherEvaluationPresenter.getConfigList(params);
        dataSource.value = res.items;
        totalNumRef.value = res.total;
      } catch (error) {
        message.error(error.message);
      } finally {
        loading.value = false;
      }
    };
    queryList();

    // 删除配置
    const onDelete = async (id: string) => {
      try {
        const params = {
          id
        };
        await TeacherEvaluationPresenter.deleteConfig(params);
        message.success('删除成功！');
        queryList();
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '删除失败！',
          content: error?.message
        });
      }
    };

    // 删除确认弹窗
    const handleDelete = (id: string) => {
      const titleVNode = getModalHeadVNode('删除配置');
      Modal.confirm({
        title: titleVNode,
        content:
          '确认删除后，如果已启用教师评价，该配置中项目关联的学生无法进行教师评价，如果已产生教师评价结果，不会影响已完成的教师评价结果，仅影响未来学生的教师评价，请确认是否继续？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onDelete(id);
        }
      });
    };

    const loadFirstPage = () => {
      currentRef.value = 1;
      queryList();
    };

    const handleSearch = () => {
      queryList();
    };
    const { pagination } = usePagination(
      handleSearch,
      pageSizeRef,
      currentRef,
      totalNumRef
    );

    const { projectList } = useProjectStore();

    const filterFn = (input: string, option: any, items: ProjectItem[]) => {
      const newArray = items.filter(
        (item: ProjectItem) => item.key === option.key
      );

      if (newArray.length) {
        for (const key in newArray) {
          const element = newArray[key];

          return element.value.indexOf(input.toLowerCase()) >= 0;
        }
      }
    };
    const showVisible = ref<boolean>(false);
    // 编辑数据
    const defaultData = reactive({
      projectListVOList: [],
      id: '',
      teacherEvaluationSingleChoiceList: [],
      teacherEvaluationMultipleChoiceList: [],
      teacherEvaluationScoreList: [],
      teacherEvaluationShortAnswerList: []
    });

    const handleAdd = () => {
      showVisible.value = true;
      defaultData.id = '';
    };
    const handleRefresh = (shouldRefresh: boolean) => {
      if (shouldRefresh) {
        handleSearch();
      }
      showVisible.value = false;
      defaultData.id = '';
    };

    const onEdit = (record: any) => {
      const {
        id,
        projectListVOList,
        teacherEvaluationSingleChoiceList,
        teacherEvaluationMultipleChoiceList,
        teacherEvaluationScoreList,
        teacherEvaluationShortAnswerList
      } = record;
      defaultData.id = id;
      defaultData.projectListVOList = projectListVOList.map(
        (item: { id: string; name: string }) => item.id
      );
      defaultData.teacherEvaluationSingleChoiceList = teacherEvaluationSingleChoiceList;
      defaultData.teacherEvaluationMultipleChoiceList = teacherEvaluationMultipleChoiceList;
      defaultData.teacherEvaluationScoreList = teacherEvaluationScoreList;
      defaultData.teacherEvaluationShortAnswerList = teacherEvaluationShortAnswerList;

      showVisible.value = true;
    };

    const handelEdit = (record: ConfigItem) => {
      const titleVNode = getModalHeadVNode('编辑配置');
      Modal.confirm({
        title: titleVNode,
        content:
          '如果移除原有所属项目、新增/删除此配置的题目，会造成当前学期学生教师评价结果不一致，请确认是否继续编辑？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onEdit(record);
        }
      });
    };

    // 下拉关键字过滤
    const filterOption = (input: string, option: any) => {
      return filterFn(input, option, projectList.value);
    };

    return {
      delivery,
      positionStr,
      // isCurrentSemester,//以后自定义菜单权限后可能会用到
      choosePosition,
      visible,
      plainOptions,
      checkedList,
      handleOk,

      handleClick,
      searchForm,
      pagination,
      projectList,
      filterOption,
      loadFirstPage,
      handleAdd,
      handleRefresh,
      showVisible,

      columns,
      dataSource,
      handleDelete,
      handelEdit,
      defaultData
    };
  }
});
</script>

<style lang="less" scoped>
.EvaluationConfiguration {
  margin-bottom: 4px;
  .head-info {
    display: flex;
    align-items: center;
    .left {
      margin-right: 96px;
      .label {
        display: inline-block;
        margin-right: 24px;
      }
    }
  }
}
.table-box {
  .btn-box {
    margin: 16px 0;
  }
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
</style>
