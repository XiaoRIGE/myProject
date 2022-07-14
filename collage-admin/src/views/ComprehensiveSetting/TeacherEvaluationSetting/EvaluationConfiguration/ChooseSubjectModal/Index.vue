<template>
  <a-modal
    v-model:visible="visible"
    title="添加题目"
    :mask-closable="false"
    ok-text="添加"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="flex-box">
      <span class="left">
        已选：
        <span class="warn-text">{{ selectedLength }}</span>
        项
      </span>
      <a-input-search
        v-model:value="keyWord"
        placeholder="请输入题目名称"
        @search="onSearch"
      />
    </div>

    <vxe-table
      ref="xTable1"
      border
      height="500"
      show-overflow
      :loading="loading"
      :data="filterSubjectList"
      :row-config="{ keyField: 'id', isHover: true }"
      :checkbox-config="{
        checkField: 'checked',
        trigger: 'row'
      }"
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column
        field="questionName"
        title="题目名称"
        show-overflow="title"
      ></vxe-column>
    </vxe-table>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  watch,
  computed,
  nextTick
} from 'vue';

import { VxeTableInstance, VxeTableEvents } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  TeacherEvaluationPresenter,
  TeacherEvaluationList
} from '@/request/api/presenter/teacherEvaluation';

const columns = [
  {
    title: '题目名称',
    dataIndex: 'name'
  }
];

interface subjectInfo {
  questionName: string;
  id: string;
}

export default defineComponent({
  name: 'ChooseSubjectModal',
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    // 题型
    subjectType: {
      type: String,
      required: true
    },
    // 已选题目id,需要过滤
    selectedSubject: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close-modal', 'add-subject'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false);
    watchEffect(() => {
      visible.value = props.showModal;
    });

    const keyWord = ref<string>('');

    const loading = ref<boolean>(false);
    const allSubjectList = ref<TeacherEvaluationList[]>([]); //所有题目集合

    const filterSubjectList = ref<TeacherEvaluationList[]>([]); //筛选题目集合
    const checkedList = ref<TeacherEvaluationList[]>([]); //已选题目（有序）
    const selectedLength = computed(() => checkedList.value.length);

    const xTable1 = ref({} as VxeTableInstance);

    const handleCancel = () => {
      emit('close-modal');
    };
    const handleOk = () => {
      emit('add-subject', checkedList.value);
    };

    // 过滤已有选项
    const filterSelectedSubject = () => {
      filterSubjectList.value = filterSubjectList.value.filter(
        (item: TeacherEvaluationList) => {
          return !props.selectedSubject.includes(item.id);
        }
      );
    };

    const selectedIds = ref<TeacherEvaluationList[]>([]); //已选中id集合

    // 关键词搜索
    const onSearch = () => {
      if (keyWord.value) {
        filterSubjectList.value = allSubjectList.value
          .filter((item: TeacherEvaluationList) => {
            return item.questionName.indexOf(keyWord.value) > -1;
          })
          .map((item: any) => {
            return {
              ...item,
              checked: selectedIds.value.includes(item.id)
            };
          });
      } else {
        filterSubjectList.value = allSubjectList.value.map((item: any) => {
          return {
            ...item,
            checked: selectedIds.value.includes(item.id)
          };
        });

        filterSelectedSubject(); //手动过滤已选择题目
      }

      // const $table = xTable1.value;
      // if ($table) {
      //   $table.loadData(XEUtils.clone(filterSubjectList.value, true));
      // }
    };

    // 获取所有题目
    const getSubjectList = async () => {
      try {
        loading.value = true;
        const {
          teacherEvaluationSingleChoiceList,
          teacherEvaluationMultipleChoiceList,
          teacherEvaluationScoreList,
          teacherEvaluationShortAnswerList
        } = await TeacherEvaluationPresenter.getQuestionList();

        //依据传入题型展示
        switch (props.subjectType) {
          case '1':
            allSubjectList.value = teacherEvaluationSingleChoiceList;
            break;
          case '2':
            allSubjectList.value = teacherEvaluationMultipleChoiceList;
            break;
          case '3':
            allSubjectList.value = teacherEvaluationScoreList;
            break;
          case '4':
            allSubjectList.value = teacherEvaluationShortAnswerList;
            break;
        }
        filterSubjectList.value = allSubjectList.value;

        filterSelectedSubject(); //手动过滤已选择题目
        checkedList.value = [];
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    getSubjectList();

    // new tabel
    watch(
      () => props.showModal,
      async (newVal: boolean) => {
        if (newVal) {
          await getSubjectList(); //接口获取所有题目

          nextTick(() => {
            const $table = xTable1.value;
            if ($table) {
              $table.loadData(XEUtils.clone(filterSubjectList.value, true));
            }
          });
        } else {
          // 关闭时清空已选和列表内容、搜索项
          checkedList.value = [];
          filterSubjectList.value = [];
          keyWord.value = '';
        }
      }
    );

    const selectAllChangeEvent: VxeTableEvents.CheckboxAll = ({ checked }) => {
      const $table = xTable1.value;
      const records = $table.getCheckboxRecords(); //获取当前选中的所有行信息（无序）
      selectedIds.value = records.map((item: any) => item.id);

      if (checked) {
        for (let index = 0; index < records.length; index++) {
          const element = records[index];
          const ids = checkedList.value.map(
            (item: TeacherEvaluationList) => item.id
          );
          if (!ids.includes(element.id)) {
            checkedList.value.push(element);
          }
        }
      } else {
        checkedList.value = [];
      }
    };

    const selectChangeEvent: VxeTableEvents.CheckboxChange = ({
      checked,
      row
    }) => {
      const ids = checkedList.value.map(
        (item: TeacherEvaluationList) => item.id
      );
      if (!ids.includes(row.id) && checked) {
        checkedList.value.push(row);
      } else if (!checked) {
        for (let index = 0; index < checkedList.value.length; index++) {
          const element = checkedList.value[index];

          if (element.id === row.id) {
            checkedList.value.splice(index, 1);
          }
        }
      }

      const $table = xTable1.value;
      const records = $table.getCheckboxRecords();
      selectedIds.value = records.map((item: any) => item.id);
    };

    return {
      visible,
      handleCancel,
      handleOk,
      keyWord,
      onSearch,

      columns,
      selectedLength,

      // func
      loading,

      xTable1,
      filterSubjectList,
      selectAllChangeEvent,
      selectChangeEvent
    };
  }
});
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
:deep(.ant-input-search) {
  max-width: 300px;
}
</style>
