<template>
  <a-modal
    v-model:visible="showBannerDialog"
    :mask-closable="false"
    :title="props.addOrUpdate === 0 ? '新建' : '编辑'"
    ok-text="提交"
    width="700px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :rules="rules"
      :model="formState"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="学年" v-bind="validateInfos.year">
        <a-select
          v-model:value="formState.year"
          placeholder="请选择"
          :disabled="props.addOrUpdate === 1 ? true : false"
          @change="yearSelectChange"
        >
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
      <a-form-item label="所属项目" v-bind="validateInfos.subject">
        <a-select
          v-if="props.addOrUpdate !== 2"
          v-model:value="formState.subject"
          :disabled="props.addOrUpdate === 0 ? false : true"
          placeholder="请输入"
          show-search
          :filter-option="filterOption"
          mode="multiple"
          allow-clear
        >
          <a-select-option
            v-for="item in projectList"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
        <a-select
          v-else
          v-model:value="formState.subject"
          :disabled="props.addOrUpdate === 0 || formState.year ? false : true"
          placeholder="请输入"
          mode="multiple"
          allow-clear
        >
          <a-select-option
            v-for="item in yearProjectList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="考试时间" v-bind="validateInfos.examTime">
        <a-range-picker
          v-model:value="formState.examTime"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
        />
      </a-form-item>
      <a-form-item
        v-if="props.addOrUpdate !== 2"
        label="答题时间"
        v-bind="validateInfos.answerTime"
      >
        <a-input-number
          v-model:value="formState.answerTime"
          :min="1"
          :max="999"
          @change="answerTimeChange(formState.answerTime)"
        ></a-input-number>
        分钟
      </a-form-item>
    </a-form>
    <!-- 单选题 -->
    <div v-if="props.addOrUpdate !== 2" class="bottom_div">
      <div class="item_div">
        <p class="babel_choice">
          单选题：
        </p>
        <div>
          共
          <a-input-number
            v-model:value="formState.data.oneChoiceTotal"
            :min="0"
            :max="300"
          ></a-input-number>
          道，
        </div>
        <div>
          含通用题
          <a-input-number
            v-model:value="formState.data.oneChoiceUniversal"
            :min="0"
            @change="countOneTopic('oneChoiceTotal', 'oneChoiceUniversal')"
          ></a-input-number>
          道，
        </div>
        <div>
          每题分值
          <a-input-number
            v-model:value="formState.data.oneChoicePoint"
            :min="0.1"
            :max="300"
          ></a-input-number>
          分
        </div>
      </div>
      <!-- 非固定选题 -->
      <div class="item_div">
        <p class="babel_choice">
          非固定选题：
        </p>
        <div>
          共
          <a-input-number
            v-model:value="formState.data.allChoiceTotal"
            :min="0"
            :max="300"
          ></a-input-number>
          道，
        </div>
        <div>
          含通用题
          <a-input-number
            v-model:value="formState.data.allChoiceUniversal"
            :min="0"
            @change="countOneTopic('allChoiceTotal', 'allChoiceUniversal')"
          ></a-input-number>
          道，
        </div>
        <div>
          每题分值
          <a-input-number
            v-model:value="formState.data.allChoicePoint"
            :min="0.1"
            :max="300"
          ></a-input-number>
          分
        </div>
      </div>
      <!-- 判断题 -->
      <div class="item_div">
        <p class="babel_choice">
          判断题：
        </p>
        <div>
          共
          <a-input-number
            v-model:value="formState.data.ifChoiceTotal"
            :min="0"
            :max="300"
          ></a-input-number>
          道，
        </div>
        <div>
          含通用题
          <a-input-number
            v-model:value="formState.data.ifChoiceUniversal"
            :min="0"
            @change="countOneTopic('ifChoiceTotal', 'ifChoiceUniversal')"
          ></a-input-number>
          道，
        </div>
        <div>
          每题分值
          <a-input-number
            v-model:value="formState.data.ifChoicePoint"
            :min="0.1"
            :max="300"
          ></a-input-number>
          分
        </div>
      </div>
      <div>
        <p class="babel_choice">总分：{{ totalPoint }}分</p>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import moment, { Moment } from 'moment';
import { useStore } from 'vuex';
import { TheoryExaminationServicePresenter } from '@/request/api/presenter/examination';
import { message, Modal } from 'ant-design-vue';
import { getModalHeadVNode } from '@/utils/common';
interface ProjectItem {
  key: string;
  value: string;
}
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
      type: Boolean
    },
    addOrUpdate: {
      //0新建 1编辑 2批量
      type: Number,
      default: 0
    },
    updateRecord: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['handle-sure', 'handle-close'],
  setup(props, { emit }) {
    const { projectList } = getStoreInfo();
    const yearProjectList = ref<any>([]);

    const showBannerDialog = computed(() => {
      return props.visible;
    });
    const formState = reactive<any>({
      subject: [],
      year: undefined,
      examTime: ref<Moment[]>([]),
      answerTime: 120,
      data: {
        oneChoiceTotal: 0,
        oneChoiceUniversal: 0,
        oneChoicePoint: 1,
        allChoiceTotal: 0,
        allChoiceUniversal: 0,
        allChoicePoint: 1,
        ifChoiceTotal: 0,
        ifChoiceUniversal: 0,
        ifChoicePoint: 1
      }
    });
    const rules = {
      subject: [
        {
          required: true,
          message: '请选择项目'
        }
      ],
      year: [
        {
          required: true,
          message: '请选择学年'
        }
      ],
      examTime: [
        {
          required: true,
          message: '请选择考试时间'
        }
      ],
      answerTime: [
        {
          required: true,
          message: '请输入答题时长'
        }
      ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);
    watch(
      () => props.updateRecord,
      () => {
        if (JSON.stringify(props.updateRecord) === '{}') {
          return;
        }
        const item = props.updateRecord;
        if (props.addOrUpdate === 1) {
          //编辑
          formState.subject[0] = item.projectId;
          formState.year = item.schoolYear;
          formState.examTime[0] = moment(item.testTimeFrom);
          formState.examTime[1] = moment(item.testTimeTo);
          formState.answerTime = item.testTime;

          formState.data.oneChoiceTotal = item.singleChoiceCount;
          formState.data.oneChoiceUniversal = item.singleChoiceCurrencyCount;
          formState.data.oneChoicePoint = item.singleChoiceScore;
          formState.data.allChoiceTotal = item.multipleChoiceCount;
          formState.data.allChoiceUniversal = item.multipleChoiceCurrencyCount;
          formState.data.allChoicePoint = item.multipleChoiceScore;
          formState.data.ifChoiceTotal = item.judgeChoiceCount;
          formState.data.ifChoiceUniversal = item.judgeChoiceCurrencyCount;
          formState.data.ifChoicePoint = item.judgeChoiceScore;
        }
      }
    );

    const totalPoint = computed(() => {
      const item = formState.data;
      const oneChoice = item.oneChoiceTotal * item.oneChoicePoint;
      const allChoice = item.allChoiceTotal * item.allChoicePoint;
      const ifChoice = item.ifChoiceTotal * item.ifChoicePoint;
      return (oneChoice + allChoice + ifChoice).toFixed(1);
    });

    //value1总题数 value2通用题数
    const countOneTopic = (value1: string, value2: string) => {
      if (formState.data[value2] > formState.data[value1]) {
        formState.data[value2] = formState.data[value1];
      }
    };

    const addExamRequest = async (data: any) => {
      try {
        await TheoryExaminationServicePresenter.addExam(data);
        emit('handle-sure', false);
        message.success('创建成功');
        resetFields();
      } catch (error) {
        Modal.error({
          title: '创建失败',
          content: `${error.message}`
        });
      }
    };

    const updateExamRequest = async (data: any) => {
      try {
        await TheoryExaminationServicePresenter.updateExam(data);
        emit('handle-sure', false);
        message.success('编辑成功');
        resetFields();
      } catch (error) {
        Modal.error({
          title: '编辑失败',
          content: `${error.message}`
        });
      }
    };

    const handleCancel = () => {
      emit('handle-close', true);
      resetFields();
    };
    const handleOk = () => {
      validate()
        .then(async () => {
          const data = {
            id: '',
            projectId: '',
            judgeChoiceCount: formState.data.ifChoiceTotal,
            judgeChoiceCurrencyCount: formState.data.ifChoiceUniversal,
            judgeChoiceScore: formState.data.ifChoicePoint,
            multipleChoiceCount: formState.data.allChoiceTotal,
            multipleChoiceCurrencyCount: formState.data.allChoiceUniversal,
            multipleChoiceScore: formState.data.allChoicePoint,
            projectList: formState.subject,
            schoolYear: formState.year,
            singleChoiceCount: formState.data.oneChoiceTotal,
            singleChoiceCurrencyCount: formState.data.oneChoiceUniversal,
            singleChoiceScore: formState.data.oneChoicePoint,
            testTime: formState.answerTime,
            testTimeFrom: Number(moment(formState.examTime[0]).format('x')),
            testTimeTo: Number(moment(formState.examTime[1]).format('x'))
          };
          if (props.addOrUpdate === 0) {
            //新建
            try {
              await TheoryExaminationServicePresenter.checkConfig(data);
              addExamRequest(data);
            } catch (error) {
              const titleVnode = getModalHeadVNode('题库中没有足够的题目');
              Modal.confirm({
                title: titleVnode,
                content: error.message,
                class: 'modal-class',
                async onOk() {
                  addExamRequest(data);
                }
              });
            }
          }
          if (props.addOrUpdate === 1) {
            //单个编辑
            data.id = props.updateRecord.id;
            data.projectId = props.updateRecord.projectId;

            try {
              await TheoryExaminationServicePresenter.updateCheckConfig(data);
              updateExamRequest(data);
            } catch (error) {
              const titleVnode = getModalHeadVNode('题库中没有足够的题目');
              Modal.confirm({
                title: titleVnode,
                content: error.message,
                class: 'modal-class',
                async onOk() {
                  updateExamRequest(data);
                }
              });
            }
          }
          if (props.addOrUpdate === 2) {
            //批量编辑
            const batchData = {
              projectList: [] as any,
              schoolYear: formState.year,
              testTimeFrom: Number(moment(formState.examTime[0]).format('x')),
              testTimeTo: Number(moment(formState.examTime[1]).format('x'))
            };
            for (const item in yearProjectList.value) {
              batchData.projectList[item] = yearProjectList.value[item].id;
            }
            try {
              await TheoryExaminationServicePresenter.updateBatchExam(
                batchData
              );
              emit('handle-sure', false);
              message.success('编辑成功');
              resetFields();
            } catch (error) {
              Modal.error({
                title: '编辑失败',
                content: `${error.message}`
              });
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    const yearSelectChange = async (value: any) => {
      if (props.addOrUpdate === 2) {
        //批量
        formState.subject = [];
        const data = {
          schoolYear: value
        };
        try {
          const res = await TheoryExaminationServicePresenter.queryYearSubjectList(
            data
          );
          yearProjectList.value = res;
        } catch (error) {
          message.error(error.message);
        }
      }
    };

    const answerTimeChange = (val: number) => {
      formState.answerTime = val.toFixed();
    };
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

    return {
      handleCancel,
      handleOk,
      showBannerDialog,
      formState,
      validateInfos,
      totalPoint,
      countOneTopic,
      props,
      projectList,
      yearProjectList,
      rules,
      yearSelectChange,
      answerTimeChange,
      filterOption
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker) {
  width: 100% !important;
}
.bottom_div {
  width: 100%;
  background-color: rgba(249, 249, 249, 1);
  padding: 25px 10px 10px 10px;

  .item_div {
    margin-bottom: 10px;
    display: flex;
    line-height: 33px;
  }
}
.babel_choice {
  width: 100px;
  text-align: right;
}
</style>
