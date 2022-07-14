<template>
  <div class="topic-modal">
    <a-modal
      v-model:visible="visibleRef"
      :title="props.addOrUpdate === true ? '新建题目' : '编辑题目'"
      :mask-closable="false"
      @ok="handleOk"
      @cancel="hideModal"
    >
      <a-form
        :model="formState"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item
          v-if="!props.isTeacherAppraise"
          label="所属项目"
          name="status"
          v-bind="validateInfos.status"
        >
          <a-select
            v-model:value="formState.status"
            placeholder="请输入"
            allow-clear
          >
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
        <a-form-item
          ref="name"
          label="题目名称"
          name="usernameOrNumber"
          v-bind="validateInfos.usernameOrNumber"
        >
          <a-textarea
            v-model:value="formState.usernameOrNumber"
            :maxlength="1000"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          label="题型"
          name="subjectType"
          v-bind="validateInfos.subjectType"
        >
          <a-radio-group
            v-if="!props.isTeacherAppraise"
            v-model:value="formState.subjectType"
          >
            <a-radio-button
              v-for="item in subjectTypeOptions"
              :key="item.value"
              :value="item.value"
              @click="handleSubjectType"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>

          <!-- 教师评价 -->
          <a-radio-group
            v-else
            v-model:value="formState.subjectType"
            :disabled="props.updatePropData.used"
          >
            <a-radio-button
              v-for="item in subjectTypeTeacherOptions"
              :key="item.value"
              :value="item.value"
              @click="handleSubjectType"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="!props.isTeacherAppraise"
          :label="formLabel(formState.subjectType)"
          name="answer"
          class="answer"
          v-bind="validateInfos.answer"
        >
          <!-- 单选题 -->
          <a-radio-group
            v-if="formState.subjectType === 1"
            v-model:value="formState.answer"
          >
            <div
              v-for="(item, index) in answerList"
              :key="index"
              class="answer-item"
            >
              <a-radio :value="item.answerLabel">
                {{ item.answerLabel }}
              </a-radio>
              <a-input
                v-model:value="answerList[index].answerVal"
                :maxlength="1000"
                placeholder="请输入答案"
              ></a-input>
              <svg
                v-show="answerList.length > 2"
                class="icon"
                aria-hidden="true"
                @click="delItem(index)"
              >
                <use xlink:href="#icondelete" />
              </svg>
            </div>
          </a-radio-group>

          <!-- 多选题 -->
          <a-checkbox-group
            v-if="formState.subjectType === 2"
            v-model:value="formState.answer"
          >
            <div
              v-for="(item, index) in answerList"
              :key="index"
              class="answer-item"
            >
              <a-checkbox :value="item.answerLabel">
                {{ item.answerLabel }}
              </a-checkbox>
              <a-input
                v-model:value="answerList[index].answerVal"
                class="checkbox-input"
                :maxlength="1000"
                placeholder="请输入答案"
              ></a-input>
              <svg
                v-show="answerList.length > 2"
                class="icon"
                aria-hidden="true"
                @click="delItem(index)"
              >
                <use xlink:href="#icondelete" />
              </svg>
            </div>
          </a-checkbox-group>

          <p
            v-show="answerList.length < 8 && formState.subjectType !== 3"
            class="color-blue"
            @click="handleAdd"
          >
            + 添加选项
          </p>

          <!-- 判断题 -->
          <a-radio-group
            v-if="formState.subjectType === 3"
            v-model:value="formState.answer"
          >
            <a-radio value="1">正确</a-radio>
            <a-radio value="2">错误</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 教师评价 -->
        <a-form-item
          v-else
          :label="formLabel(formState.subjectType)"
          name="answer"
          class="answer"
        >
          <!-- 单选题 -->
          <a-radio-group
            v-if="formState.subjectType === 1"
            v-model:value="formState.answer"
          >
            <div
              v-for="(item, index) in answerList"
              :key="index"
              class="answer-item"
            >
              <span>{{ item.answerLabel }}&emsp;</span>
              <a-input
                v-model:value="answerList[index].answerVal"
                :maxlength="1000"
                placeholder="请输入答案"
              ></a-input>
              <svg
                v-show="answerList.length > 2 && !props.updatePropData.used"
                class="icon"
                aria-hidden="true"
                @click="delItem(index)"
              >
                <use xlink:href="#icondelete" />
              </svg>
            </div>
          </a-radio-group>

          <!-- 多选题 -->
          <a-checkbox-group
            v-if="formState.subjectType === 2"
            v-model:value="formState.answer"
          >
            <div
              v-for="(item, index) in answerList"
              :key="index"
              class="answer-item"
            >
              <span>{{ item.answerLabel }}&emsp;</span>
              <a-input
                v-model:value="answerList[index].answerVal"
                :maxlength="1000"
                placeholder="请输入答案"
              ></a-input>
              <svg
                v-show="answerList.length > 2 && !props.updatePropData.used"
                class="icon"
                aria-hidden="true"
                @click="delItem(index)"
              >
                <use xlink:href="#icondelete" />
              </svg>
            </div>
          </a-checkbox-group>

          <p
            v-show="showAddItem"
            :class="props.updatePropData.used ? 'disabled' : 'color-blue'"
            @click="handleAdd"
          >
            + 添加选项
          </p>

          <div v-if="formState.subjectType === 4" class="grade-point">
            <a-input-number
              id="inputNumber"
              v-model:value="formState.pointAgo"
              :disabled="props.updatePropData.used"
              placeholder="请输入最小值"
              :min="-9999.99"
              :max="9999.99"
              @change="pointScopeChange('pointAgo', formState.pointAgo)"
            />
            ~
            <a-input-number
              id="inputNumber"
              v-model:value="formState.pointLater"
              :disabled="props.updatePropData.used"
              placeholder="请输入最大值"
              :min="-9999.99"
              :max="9999.99"
              @change="pointScopeChange('pointLater', formState.pointLater)"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  watchEffect
} from 'vue';
import { getTag } from '@/utils/common';
import { TheoryExaminationQuestionServicesPresenter } from '@/request/api/presenter/examination';
import {
  TeacherEvaluateServicesPresenter,
  AnswerList
} from '@/request/api/presenter/teacherEvaluation';
import { message, Modal } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useForm } from '@ant-design-vue/use';

const getStoreInfo = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  store.dispatch('basic/updateProjectList');
  return {
    projectList
  };
};
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    updatePropData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    addOrUpdate: {
      type: Boolean,
      default: true
    },
    isTeacherAppraise: {
      //true教师评价 false理论考试
      type: Boolean,
      default: false
    }
  },
  emits: ['hide-modal', 'success-modal'],
  setup(props, { emit }) {
    const { projectList } = getStoreInfo();
    const visibleRef = ref<boolean>(false);
    const formState = reactive<any>({
      usernameOrNumber: '',
      status: undefined,
      subjectType: 1, //1单选 2多选 3判断 4评分 5简答
      answer: '',
      pointAgo: undefined,
      pointLater: undefined
    });
    watch(
      () => props.visible,
      () => {
        visibleRef.value = props.visible;
      }
    );

    // 项目下拉列表
    const selectOption = [
      {
        value: '0',
        label: '项目1'
      },
      {
        value: '1',
        label: '项目2'
      },
      {
        value: '2',
        label: '项目3'
      }
    ];

    // // 切换题型时清空之前答案
    const handleSubjectType = () => {
      formState.answer = '';
    };

    const subjectTypeOptions = [
      { label: '单选题', value: 1 },
      { label: '非固定选题', value: 2 },
      { label: '判断题', value: 3 }
    ];
    const subjectTypeTeacherOptions = [
      { label: '单选题', value: 1 },
      { label: '非固定选题', value: 2 },
      { label: '评分题', value: 4 },
      { label: '简答题', value: 5 }
    ];

    const answerList = ref([
      { answerVal: '', answerLabel: 'A' },
      { answerVal: '', answerLabel: 'B' },
      { answerVal: '', answerLabel: 'C' },
      { answerVal: '', answerLabel: 'D' }
    ]);

    const updateId = ref<string>('');
    watch(
      () => props.updatePropData,
      () => {
        if (JSON.stringify(props.updatePropData) === '{}') {
          answerList.value = [
            { answerVal: '', answerLabel: 'A' },
            { answerVal: '', answerLabel: 'B' },
            { answerVal: '', answerLabel: 'C' },
            { answerVal: '', answerLabel: 'D' }
          ];
          return;
        }
        const propData = props.updatePropData;
        formState.usernameOrNumber = propData.questionName;
        formState.subjectType = propData.questionType;
        updateId.value = propData.id;
        if (props.isTeacherAppraise) {
          //教师评价
          if (formState.subjectType === 4) formState.subjectType = 5;
          if (formState.subjectType === 3) formState.subjectType = 4;
          if (propData.answerList) {
            answerList.value = propData.answerList.map((item: AnswerList) => {
              return {
                answerVal: item.answerContent,
                answerLabel: item.tag
              };
            });
          }
          if (propData.scoreLowerLimit !== null) {
            formState.pointAgo = propData.scoreLowerLimit;
            formState.pointLater = propData.scoreUpperLimit;
          }
        } else {
          formState.status = propData.projectId;
          answerList.value = propData.theoryTestAnswerVOS.map(
            (item: any, index: number) => {
              if (item.correct) {
                if (propData.questionType === 1) {
                  formState.answer = item.tag;
                } else if (propData.questionType === 2) {
                  formState.answer += item.tag;
                } else if (propData.questionType === 3) {
                  formState.answer = Number(index) === 0 ? '1' : '2';
                }
              }
              return {
                answerVal: item.answerContent,
                answerLabel: item.tag
              };
            }
          );
        }
      }
    );
    const delItem = (index: number) => {
      answerList.value.splice(index, 1);
    };
    const handleAdd = () => {
      answerList.value.push({
        answerVal: '',
        answerLabel: ''
      });
    };

    const formLabel = computed(() => {
      return (val: any) => {
        switch (val) {
          case 1:
            return '答案';
          case 2:
            return '答案';
          case 3:
            return '答案';
          case 4:
            return '评分范围';
          case 5:
            return '';
        }
      };
    });

    // 删除、新增答案时重新对ABC排序
    watchEffect(() => {
      answerList.value.forEach((item, index) => {
        item.answerLabel = getTag(index);
      });
    });

    const rules = {
      status: [
        {
          required: true,
          message: '请选择所属项目'
        }
      ],
      usernameOrNumber: [
        {
          required: true,
          message: '请输入题目'
        }
      ],
      subjectType: [
        {
          required: true,
          message: '请选择题型'
        }
      ],
      answer: [
        {
          required: true,
          message: '请选择答案'
        }
      ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    // 拼接接口需要参数
    const getAnswerList = (): any => {
      if (formState.subjectType === 3) {
        // 判断题
        return [
          {
            answerContent: '正确',
            correct: formState.answer === '1' ? true : false,
            tag: 'A'
          },
          {
            answerContent: '错误',
            correct: formState.answer === '1' ? false : true,
            tag: 'B'
          }
        ];
      } else if (formState.subjectType === 1) {
        // 单选
        return answerList.value.map(item => {
          return {
            answerContent: item.answerVal,
            tag: item.answerLabel,
            correct: formState.answer === item.answerLabel
          };
        });
      } else if (formState.subjectType === 2) {
        // 多选
        return answerList.value.map(item => {
          return {
            answerContent: item.answerVal,
            tag: item.answerLabel,
            correct: formState.answer.includes(item.answerLabel)
          };
        });
      }
    };

    const isAnswerRule = () => {
      let isModalReturn = false;
      getAnswerList()?.forEach((item: AnswerList) => {
        if (item.answerContent === '') {
          isModalReturn = true;
        }
      });
      if (isModalReturn) {
        Modal.error({
          title: '保存失败',
          content: '答案不能为空'
        });
        return isModalReturn;
      }
    };

    const saveRequest = async (requestObject: any, addOrUpdate: boolean) => {
      const addUpdate = addOrUpdate === true ? '添加' : '编辑';
      try {
        await requestObject;
        message.success(`${addUpdate}成功`);
        visibleRef.value = false;
        resetFields();
        emit('success-modal');
      } catch (error) {
        Modal.error({
          title: `${addUpdate}失败`,
          content: error.message
        });
      }
    };
    const handleOk = () => {
      if (props.isTeacherAppraise) {
        rules.status = [];
        rules.answer = [];
      }
      validate()
        .then(async () => {
          if (formState.subjectType === 1 || formState.subjectType === 2) {
            //单选
            if (isAnswerRule()) return;
          }
          if (formState.subjectType === 4) {
            //评分题
            if (formState.pointAgo === null || formState.pointLater === null) {
              Modal.error({
                title: '保存失败',
                content: '评分范围不能为空'
              });
              return;
            }
          }

          if (props.isTeacherAppraise) {
            //教师评价
            const data = {
              answerList: getAnswerList(),
              id: updateId.value,
              questionName: formState.usernameOrNumber,
              questionType: formState.subjectType,
              scoreLowerLimit: formState.pointAgo,
              scoreUpperLimit: formState.pointLater
            };
            if (data.questionType === 4) data.questionType = 3;
            if (data.questionType === 5) data.questionType = 4;

            if (props.addOrUpdate) {
              //新增
              saveRequest(
                TeacherEvaluateServicesPresenter.addTeacherTopic(data),
                true
              );
            } else {
              //编辑
              saveRequest(
                TeacherEvaluateServicesPresenter.updateTeacherTopic(data),
                false
              );
            }
          } else {
            //理论考试
            const data = {
              answerList: getAnswerList(),
              projectId: formState.status,
              id: updateId.value,
              questionName: formState.usernameOrNumber,
              questionType: formState.subjectType
            };
            if (props.addOrUpdate) {
              //新建
              saveRequest(
                TheoryExaminationQuestionServicesPresenter.addExamQuestion(
                  data
                ),
                true
              );
            } else {
              //编辑
              saveRequest(
                TheoryExaminationQuestionServicesPresenter.updateExamQuestion(
                  data
                ),
                true
              );
            }
          }
        })
        .catch((error: any) => {
          console.log('error', error);
        });
    };

    const showAddItem = computed(() => {
      return (
        answerList.value.length < 8 &&
        formState.subjectType !== 3 &&
        formState.subjectType !== 4 &&
        formState.subjectType !== 5
      );
    });

    const hideModal = () => {
      resetFields();
      updateId.value = '';
      emit('hide-modal');
    };
    const pointScopeChange = (name: string, val: number) => {
      formState[name] = val.toFixed(2);
    };
    return {
      visibleRef,
      formState,
      validateInfos,
      subjectTypeOptions,
      subjectTypeTeacherOptions,
      answerList,
      delItem,
      handleAdd,
      rules,
      selectOption,
      handleOk,
      hideModal,
      projectList,
      props,
      handleSubjectType,
      formLabel,
      showAddItem,
      pointScopeChange
    };
  }
});
</script>

<style lang="less" scoped>
.answer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 4px;
}
.icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 8px;
}
:deep(.ant-checkbox-wrapper-checked) {
  display: flex;
  align-items: center;
}
:deep(.ant-checkbox-wrapper) {
  display: flex;
  align-items: center;
}
:deep(.answer .ant-form-item-children > div) {
  width: 100%;
}

:deep(.grade-point .ant-input-number) {
  width: 150px;
}
.checkbox-input {
  margin-left: 8px;
}
.disabled {
  pointer-events: none;
  color: gray;
}
</style>
