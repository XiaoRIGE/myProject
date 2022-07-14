<template>
  <a-modal
    v-model:visible="showVisible"
    :width="760"
    centered
    :mask-closable="false"
    @cancel="closeDialog"
    @ok="handleSubmit"
  >
    <div class="run_function">
      <div>
        <p class="close_run_function">
          {{ dialogTitle }}
        </p>
      </div>
      <!-- 配置校区跑步时间时展示 -->
      <div v-show="dialogType === 'timeSet'" class="close_run_function">
        <span class="mr-16">学年：{{ defaultInfo.yearStr }}</span>
        <span>学期：{{ defaultInfo.semesterStr }}</span>
      </div>
      <div class="form-list">
        <a-form layout="inline" class="form-form">
          <!-- 配置特殊限制时展示 -->
          <div v-show="dialogType === 'specialSet'">
            <a-form-item
              label="应用院系"
              v-bind="validateInfos2.useDepartment"
              class="form-department"
            >
              <a-select
                v-model:value="runAstrictList.useDepartment"
                allow-clear
                mode="multiple"
                placeholder="请选择院系"
              >
                <a-select-option
                  v-for="(item, index) in collegeList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="学年"
              v-bind="validateInfos2.year"
              class="form-year"
            >
              <a-select
                v-model:value="runAstrictList.year"
                allow-clear
                placeholder="请选择学年"
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
            <a-form-item
              label="学期"
              v-bind="validateInfos2.semester"
              class="form-semester"
            >
              <a-select
                v-model:value="runAstrictList.semester"
                allow-clear
                placeholder="请选择学期"
              >
                <a-select-option :value="1">
                  上学期
                </a-select-option>
                <a-select-option :value="2">
                  下学期
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <a-form-item
            v-bind="validateInfos2.runTime"
            label="跑步日期"
            class="run-date"
          >
            <a-range-picker v-model:value="runAstrictList.runTime" allow-clear />
          </a-form-item>
          <a-form-item label="有效时段" v-bind="validateInfos.validTime">
            <a-checkbox
              v-model:checked="checkAll"
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              v-model:value="runAstrictList.validTime"
              class="checkbox-group"
            >
              <a-checkbox value="1">
                周一
              </a-checkbox>

              <a-checkbox value="2">
                周二
              </a-checkbox>

              <a-checkbox value="3">
                周三
              </a-checkbox>

              <a-checkbox value="4">
                周四
              </a-checkbox>

              <a-checkbox value="5">
                周五
              </a-checkbox>

              <a-checkbox value="6">
                周六
              </a-checkbox>
              <a-checkbox value="7">
                周日
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-row>
            <a-col :span="8">
              <a-form-item
                v-bind="validateInfos.customizationClassStartTime"
                :wrapper-col="{ offset: 14 }"
              >
                <a-time-picker
                  v-model:value="runAstrictList.customizationClassStartTime"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item v-bind="validateInfos.customizationClassEndTime">
                <a-time-picker
                  v-model:value="runAstrictList.customizationClassEndTime"
                  :disabled-hours="dissableHours"
                  :disabled-minutes="dissableMinutes"
                  :disabled-seconds="dissableSeconds"
                  placeholder="结束时间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item class="form-add-btn">
                <a-button @click="handleAddItem">
                  添加
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div
          v-for="(item, index) in timeArr"
          :key="index"
          class="update-week-message"
        >
          <div>
            <span class="mr-8">{{ getWeekTimeStr(item.week) }}</span>
            <span class="mr-8">
              {{ item.time && item.time[0] }}~
              {{ item.time && item.time[1] }}
            </span>
          </div>
          <div>
            <span class="delate-btn cursor" @click="handleDelete(index)">
              删除
            </span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import moment, { Moment } from 'moment';
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watchEffect,
  watch,
  inject
} from 'vue';
import { useForm } from '@ant-design-vue/use';
import { Modal, message } from 'ant-design-vue';
import { RunSettingRulePresenter } from '@/request/api/presenter/runSettings';
import { getWeekTimeStr , getDisableTime} from '@/utils/common';

interface runAstrictList {
  runTime: Moment[];
  validTime: string[];
  useDepartment: any[];
  year: any;
  semester: any;
  customizationClassStartTime: string;
  customizationClassEndTime: string;
}

interface runningEffectiveTimeList {
  endTime: string | number;
  startTime: string | number;
  weeks: string;
  id?: string;
}

interface BaseParams {
  index: number;
  runningTimeEnd: string;
  runningTimeStart: string;
  organizationList: string[];
  schoolYear: string;
  runningEffectiveTimeList: runningEffectiveTimeList[];
}

export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    dialogType: {
      //编辑校区跑步时间 timeSet  特殊跑步时间限制 specialSet
      type: String,
      required: true
    },
    isEditDialog: {
      //是否编辑
      type: Boolean,
      default: false
    },
    campusId: {
      //校区id
      type: String,
      required: true
    },
    defaultInfo: {
      //编辑时回显数据
      type: Object,
      default: () => {
        return {
          yearStr: '',
          semesterStr: '',
          id: '',
          yearVal: '',
          semesterVal: ''
        };
      }
    }
  },
  emits: ['change-visible-false', 'refresh'],

  setup(props, { emit }) {
    // const collegeList = ref<any[]>([]); //学院下拉列表
    const collegeList = inject('collegeList'); //学院下拉列表 inject接收

    const runAstrictList: runAstrictList = reactive({
      runTime: [],
      validTime: [],
      useDepartment: [],
      year: undefined, //大一
      semester: undefined, //上学期
      customizationClassStartTime: '',
      customizationClassEndTime: ''
    });

    const showVisible = computed(() => {
      return props.visible;
    });

    const timeArr = ref<any[]>([]); //有效时段配置


    const dissableHours = () => {
      return getDisableTime(runAstrictList.customizationClassStartTime,runAstrictList.customizationClassEndTime);
    };

    const dissableMinutes = () => {
      return getDisableTime(runAstrictList.customizationClassStartTime,runAstrictList.customizationClassEndTime,'minutes');
    };

    const dissableSeconds = () => {
      return getDisableTime(runAstrictList.customizationClassStartTime,runAstrictList.customizationClassEndTime,'second');
    };

    // 删除某个有效时间配置信息
    const handleDelete = (index: number) => {
      timeArr.value.splice(index, 1);
    };

    const dialogTitle = ref<string>('编辑校区跑步时间限制');

    const checkAll = ref<boolean>(false); //是否全选

    const plainOptions = ['1', '2', '3', '4', '5', '6', '7'];

    const indeterminate = ref<boolean>(true);

    // 切换全选
    const onCheckAllChange = (e: any) => {
      runAstrictList.validTime = e.target.checked ? plainOptions : [];
      indeterminate.value = false;
    };

    watch(
      () => runAstrictList.validTime,
      val => {
        indeterminate.value = !!val.length && val.length < plainOptions.length;
        checkAll.value = val.length === plainOptions.length;
      }
    );

    watchEffect(() => {
      if (props.dialogType === 'timeSet') {
        dialogTitle.value = '编辑校区跑步时间限制';
      } else if (props.dialogType === 'specialSet' && props.isEditDialog) {
        dialogTitle.value = '编辑特殊跑步时间限制';
      } else if (props.dialogType === 'specialSet' && !props.isEditDialog) {
        dialogTitle.value = '添加特殊跑步时间限制';
      }
    });

    // 传入编辑数据回显
    watch(
      () => props.defaultInfo,
      () => {
        const { yearVal, semesterVal, schoolIdArr, runDate, effectiveTimeVal } =
          props.defaultInfo;

        runAstrictList.year = yearVal;
        runAstrictList.semester = semesterVal;
        runAstrictList.useDepartment = schoolIdArr;
        runAstrictList.runTime = runDate; //跑步日期

        // 有效时段回显
        timeArr.value = effectiveTimeVal.map((item: any) => {
          return {
            week: item.weeks.split(','),
            time: [item.startTime, item.endTime],
            startTimestamp: item.startTimestamp,
            endTimestamp: item.endTimestamp
          };
        });
      },
      {
        immediate: true,
        deep: true
      }
    );

    // 时段表单规则
    const rulesRef = reactive({
      customizationClassStartTime: [
        { required: true, message: '请选择开始时间' }
      ],
      customizationClassEndTime: [
        { required: true, message: '请选择结束时间' }
      ],
      validTime: [{ required: true, message: '请选择有效时段' }]
    });

    // 自定义检验规则
    const validateCollege = async (rule: any, value: string) => {
      if (props.dialogType === 'specialSet') {
        // 需要校验
        if (!value.length) {
          return Promise.reject('请选择应用院系');
        }
      } else {
        // 不需要校验
        return Promise.resolve();
      }
    };

    const validateYear = async (rule: any, value: string) => {
      if (props.dialogType === 'specialSet') {
        // 需要校验
        if (!value) {
          return Promise.reject('请选择应用学年');
        }
      } else {
        // 不需要校验
        return Promise.resolve();
      }
    };

    const validateTerm = async (rule: any, value: string) => {
      if (props.dialogType === 'specialSet') {
        // 需要校验
        if (!value) {
          return Promise.reject('请选择应用学期');
        }
      } else {
        // 不需要校验
        return Promise.resolve();
      }
    };

    // 跑步日期有效规则
    const rulesDateRef = reactive({
      runTime: [{ required: true, message: '请选择跑步日期' }],
      useDepartment: [
        { validator: validateCollege, required: true, trigger: 'change' }
      ],
      year: [{ validator: validateYear, required: true, trigger: 'change' }],
      semester: [{ validator: validateTerm, required: true, trigger: 'change' }]
    });

    const {
      validate: validate2,
      validateInfos: validateInfos2,
      resetFields: resetFields2
    } = useForm(runAstrictList, rulesDateRef);


    const { validate, validateInfos, resetFields } = useForm(
      runAstrictList,
      rulesRef
    );

    const removeValidata = () => {
      resetFields2();
      resetFields();
      timeArr.value = [];
    };

    /**
     * @description: 将当前选择的星期和时间组合起来展示到列表
     */
    const handleAddItem = () => {
      validate().then(() => {
        timeArr.value.push({
          week: runAstrictList.validTime,
          time: [
            moment(runAstrictList.customizationClassStartTime).format('LTS'), //格式化为 '18:06'类型的格式
            moment(runAstrictList.customizationClassEndTime).format('LTS')
          ],
          startTimestamp: moment(
            runAstrictList.customizationClassStartTime
          ).format('x'),
          endTimestamp: moment(runAstrictList.customizationClassEndTime).format(
            'x'
          )
        });
      });
    };

    // 编辑校区跑步时间限制
    const editRunningRule = async (baseParams: BaseParams) => {
      const params = {
        id: props.defaultInfo.id,
        ...baseParams
      };
      try {
        await RunSettingRulePresenter.updateRunningRule(params);
        message.success('编辑成功');
        removeValidata();
        emit('refresh', 'refreshTable');
      } catch (error) {
        console.log('error', error);
        Modal.error({
          title: '编辑失败',
          content: error?.message
        });
      }
    };

    // 编辑特殊跑步时间限制
    const editSpecialRunningRule = async (baseParams: BaseParams) => {
      const params = {
        groupId: props.defaultInfo.id,
        ...baseParams
      };
      try {
        await RunSettingRulePresenter.updateSpecialRunningRule(params);
        message.success('编辑成功');
        removeValidata();
        emit('refresh', 'refreshSpecialTable');
      } catch (error) {
        console.log('error', error);
        Modal.error({
          title: '编辑失败',
          content: error?.message
        });
      }
    };

    // 新增特殊跑步时间规则
    const addSpecialRunningRule = async (baseParams: BaseParams) => {
      const params = {
        ...baseParams,
        campusId: props.campusId
      };
      try {
        await RunSettingRulePresenter.addSpecialRunningRule(params);
        message.success('新增成功');
        removeValidata();
        emit('refresh', 'refreshSpecialTable');
      } catch (error) {
        console.log('error', error);
        Modal.error({
          title: '新增失败',
          content: error?.message
        });
      }
    };

    // 提交表单
    const handleSubmit = () => {
      validate2().then(() => {
        // 校验是否添加了有效时段
        if (!timeArr.value.length) {
          message.warning('请先添加有效时段信息');
        }
        const effectRange = timeArr.value.map((item: any) => {
          return {
            weeks: item.week.join(','),
            startTime: Number(item.startTimestamp),
            endTime: Number(item.endTimestamp)
          };
        });

        const baseParams = {
          organizationList: runAstrictList.useDepartment, //应用院系
          schoolYear: runAstrictList.year, //学年
          index: runAstrictList.semester, //学期
          runningTimeStart: moment(runAstrictList.runTime[0]).format('x'),
          runningTimeEnd: moment(runAstrictList.runTime[1]).format('x'),
          runningEffectiveTimeList: effectRange
        };

        if (props.isEditDialog) {
          if (props.dialogType === 'timeSet') {
            editRunningRule(baseParams); //编辑校区跑步时间限制
          }
          if (props.dialogType === 'specialSet') {
            editSpecialRunningRule(baseParams); //调用编辑特殊跑步接口
          }
        } else {
          addSpecialRunningRule(baseParams); //调用新增特殊跑步接口
        }
      });
    };

    const closeDialog = () => {
      emit('change-visible-false', false);
      removeValidata();
    };

    return {
      collegeList,
      showVisible,
      dialogTitle,
      checkAll,
      plainOptions,
      indeterminate,
      closeDialog,
      runAstrictList,
      timeArr,
      handleAddItem,
      onCheckAllChange,
      validateInfos,
      validateInfos2,
      handleDelete,
      dissableHours,
      dissableMinutes,
      dissableSeconds,
      handleSubmit,
      getWeekTimeStr
    };
  }
});
</script>
<style lang="less" scoped>
.run_function {
  .close_run_function:nth-of-type(1) {
    margin-bottom: 30px;
    font-size: 18px;
  }
  .close_run_function {
    font-weight: 600;
  }
  .form-list {
    margin-top: 20px;
    padding-left: 15px;
    .form-form {
      position: relative;
      margin-bottom: 50px;
      .form-add-btn {
        position: absolute;
        right: 20px;
      }
    }
    .form-department {
      width: 100%;
      margin-bottom: 10px;
    }
    .form-year {
      width: 100%;
      padding-left: 27px;
      margin-bottom: 10px;
    }
    .form-semester {
      width: 100%;
      padding-left: 27px;
      margin-bottom: 10px;
    }
    .start-time {
      position: relative;
      left: 70px;
      top: -13px;
    }
  }

  .update-week-message {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    padding-right: 35px;

    .update-btn {
      margin-right: 15px;
      color: #459ae9;
    }

    .delate-btn {
      color: #ea574f;
    }
  }
  .form-useDepartment {
    width: 100%;
  }
}
.mr-8 {
  margin-right: 16px;
  display: inline-block;
}
.mr-16 {
  margin-right: 16px;
  display: inline-block;
}
:deep(.form-department .ant-form-item-control-wrapper) {
  width: 77%;
}
:deep(.form-year .ant-form-item-control-wrapper) {
  width: 80%;
}
:deep(.form-semester .ant-form-item-control-wrapper) {
  width: 80%;
}
:deep(.ant-form-inline .ant-form-item) {
  margin-right: 0;
}
:deep(.ant-form-inline .ant-form-item-with-help) {
  margin-bottom: 0;
}
</style>
