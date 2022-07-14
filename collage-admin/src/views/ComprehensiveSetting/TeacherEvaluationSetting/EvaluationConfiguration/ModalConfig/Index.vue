<template>
  <a-modal
    v-model:visible="visible"
    :title="title + '配置'"
    :mask-closable="false"
    :width="700"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="所属项目" name="project">
        <a-select
          v-model:value="formState.project"
          show-search
          :filter-option="filterOption"
          placeholder="请选择"
          mode="multiple"
          @change="handelChange"
        >
          <a-select-option key="all" value="all">
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
      <a-form-item label="题型" name="subjectType">
        <a-radio-group v-model:value="formState.subjectType">
          <a-radio-button value="1">
            单选题 {{ subjectLength('1') }}
          </a-radio-button>
          <a-radio-button value="2">
            非固定选题 {{ subjectLength('2') }}
          </a-radio-button>
          <a-radio-button value="3">
            评分题 {{ subjectLength('3') }}
          </a-radio-button>
          <a-radio-button value="4">
            简答题 {{ subjectLength('4') }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-button class="add-btn" @click="handleShowModal">+ 添加题目</a-button>

      <div class="choose-subject">
        <div
          v-for="(item, index) in currentShowSubject"
          :key="index"
          class="subject-item"
        >
          <a-tooltip placement="top">
            <template #title>
              <span>{{ item.questionName }}</span>
            </template>
            <span class="subject-item-name">
              <span>{{ index + 1 }}</span>
              、{{ item.questionName }}
            </span>
          </a-tooltip>

          <svg class="icon" aria-hidden="true" @click="handleDelete(index)">
            <use xlink:href="#icondelete" />
          </svg>
        </div>
      </div>
    </a-form>
  </a-modal>
  <ChooseSubjectModal
    :show-modal="showModalRef"
    :subject-type="formState.subjectType"
    :selected-subject="currentShowSubjectIds"
    @closeModal="handleCloseModal"
    @addSubject="handleAddSubject"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  watch,
  computed,
  reactive
} from 'vue';
import ChooseSubjectModal from '../ChooseSubjectModal/Index.vue';
import { useProjectStore } from '@/hooks/useStoreData';
import {
  TeacherEvaluationPresenter,
  TeacherEvaluationList
} from '@/request/api/presenter/teacherEvaluation';
import { message, Modal } from 'ant-design-vue';

interface ProjectItem {
  key: string;
  value: string;
}

export default defineComponent({
  name: 'ModalConfig',
  components: { ChooseSubjectModal },
  props: {
    showVisible: {
      type: Boolean,
      required: true
    },
    defaultData: {
      type: Object,
      required: true
    }
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const visible = ref<boolean>(true);

    const title = computed(() => {
      if (props.defaultData?.id) {
        return '编辑';
      } else {
        return '新建';
      }
    });
    watchEffect(() => {
      visible.value = props.showVisible;
    });

    const formRef = ref();

    const formState: { subjectType: string; project: string[] } = reactive({
      subjectType: '1',
      project: []
    });
    const resetForm = () => {
      // bug 如果第一次是通过编辑点开，则后面resetFile会重置为编辑时传入信息
      // formRef.value.resetFields({ subjectType: '1', project: [] });

      formState.subjectType = '1';
      formState.project = [];
    };
    const rules = {
      project: [
        {
          type: 'array',
          required: true,
          message: '请选择所属项目',
          trigger: 'change'
        }
      ]
    };

    const showModalRef = ref<boolean>(false);
    const chooseSubject: any = reactive({
      subjectA: [],
      subjectB: [],
      subjectC: [],
      subjectD: []
    });

    // 编辑数据回显
    watch(
      () => props.defaultData,
      newVal => {
        if (newVal && newVal.id) {
          const {
            projectListVOList,
            teacherEvaluationSingleChoiceList,
            teacherEvaluationMultipleChoiceList,
            teacherEvaluationScoreList,
            teacherEvaluationShortAnswerList
          } = newVal;

          formState.project = [...projectListVOList];
          chooseSubject.subjectA = [...teacherEvaluationSingleChoiceList];
          chooseSubject.subjectB = [...teacherEvaluationMultipleChoiceList];
          chooseSubject.subjectC = [...teacherEvaluationScoreList];
          chooseSubject.subjectD = [...teacherEvaluationShortAnswerList];
        }
      },
      {
        deep: true
      }
    );

    // 选择题目数量
    const subjectLength = computed(() => {
      return (type: string) => {
        switch (type) {
          case '1':
            return `(${chooseSubject.subjectA.length})`;

          case '2':
            return `(${chooseSubject.subjectB.length})`;

          case '3':
            return `(${chooseSubject.subjectC.length})`;

          case '4':
            return `(${chooseSubject.subjectD.length})`;
        }
      };
    });

    // 重置已选的所有题目
    const resetChooseSubject = () => {
      chooseSubject.subjectA = [];
      chooseSubject.subjectB = [];
      chooseSubject.subjectC = [];
      chooseSubject.subjectD = [];
    };

    // 获取选择题目的id
    const getSubjectId = (arr: TeacherEvaluationList[]) => {
      return arr.map((item: TeacherEvaluationList) => item.id);
    };

    // 提交配置信息
    const submit = async () => {
      try {
        const questionId = [
          ...getSubjectId(chooseSubject.subjectA),
          ...getSubjectId(chooseSubject.subjectB),
          ...getSubjectId(chooseSubject.subjectC),
          ...getSubjectId(chooseSubject.subjectD)
        ];

        if (questionId.length === 0) {
          message.warning('您还未配置题目信息，请先添加题目！');
          return;
        }

        if (!props.defaultData?.id) {
          // 新增配置
          const params = {
            projectId: formState.project,
            questionId
          };

          await TeacherEvaluationPresenter.addConfig(params);
        } else {
          // 编辑配置
          const params = {
            projectId: formState.project,
            questionId,
            id: props.defaultData.id
          };

          await TeacherEvaluationPresenter.updateConfig(params);
        }

        message.success(`${title.value}配置成功`);
        resetForm();
        resetChooseSubject();
        emit('refresh', true);
      } catch (error) {
        console.log(error);
        Modal.error({
          title: `${title.value}失败`,
          content: error?.message
        });
      }
    };

    const handleCancel = () => {
      resetForm();
      resetChooseSubject();
      emit('refresh', false);
    };

    const handleOk = () => {
      formRef.value
        .validate()
        .then(() => {
          submit();
        })
        .catch((error: any) => {
          console.log('error', error);
        });
    };

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

    // 下拉关键字过滤
    const filterOption = (input: string, option: any) => {
      return filterFn(input, option, projectList.value);
    };

    const handelChange = () => {
      // 如果选了全部，手动将所有选项选中
      if (formState.project.includes('all')) {
        formState.project = projectList.value.map((item: any) => item.key);
      }
    };

    const getResourceBySubjectType = () => {
      let subjectType = 'subjectA';
      switch (formState.subjectType) {
        case '1':
          subjectType = 'subjectA';
          break;
        case '2':
          subjectType = 'subjectB';
          break;
        case '3':
          subjectType = 'subjectC';
          break;
        case '4':
          subjectType = 'subjectD';
          break;
      }
      return subjectType;
    };

    // 当前题型下选择的题目
    const currentShowSubject = computed(() => {
      return chooseSubject[getResourceBySubjectType()];
    });

    // 当前题型下选择的题目id
    const currentShowSubjectIds = computed(() => {
      return getSubjectId(currentShowSubject.value);
    });

    const handleDelete = (index: number) => {
      chooseSubject[getResourceBySubjectType()].splice(index, 1);
    };

    const handleShowModal = () => {
      showModalRef.value = true;
    };

    // 关闭选题弹窗
    const handleCloseModal = () => {
      showModalRef.value = false;
    };

    // 选择题目回调
    const handleAddSubject = (selectedSubjectArr: TeacherEvaluationList[]) => {
      handleCloseModal();

      if (selectedSubjectArr && selectedSubjectArr.length) {
        chooseSubject[getResourceBySubjectType()] = [
          ...chooseSubject[getResourceBySubjectType()],
          ...selectedSubjectArr
        ];
      }
    };

    return {
      visible,
      handleCancel,
      handleOk,
      title,
      formState,
      formRef,
      rules,
      subjectLength,

      projectList,
      filterOption,
      handelChange,

      showModalRef,
      handleShowModal,
      handleCloseModal,
      handleAddSubject,
      handleDelete,
      currentShowSubject,
      currentShowSubjectIds
    };
  }
});
</script>

<style lang="less" scoped>
.add-btn {
  margin-left: 80px;
  margin-bottom: 16px;
  width: 402px;
}
.choose-subject {
  max-height: 240px;
  overflow: auto;
  .subject-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 80px;
    &-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 90%;
    }
  }
}
.icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
