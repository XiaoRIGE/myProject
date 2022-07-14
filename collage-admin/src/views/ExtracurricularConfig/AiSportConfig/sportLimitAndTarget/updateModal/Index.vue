<template>
  <a-modal
    v-model:visible="visible"
    centered
    width="700px"
    title="编辑"
    @ok="saveAppDialog"
    @cancel="closeAppDialog"
  >
    <div class="dialog_semester">
      学年：
      <span>{{ props.updateMen.year }}&nbsp;&nbsp;&nbsp;</span>
      学期：
      <span>{{ semester }}</span>
    </div>

    <a-form
      class="modal-form"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="性别">
        <a-select
          v-model:value="formState.isGenderSame"
          placeholder="请选择"
          style="width: 150px"
        >
          <a-select-option value="1">
            男女一致
          </a-select-option>
          <a-select-option value="2">
            男女不同
          </a-select-option>
        </a-select>
      </a-form-item>
      <div v-if="formState.isGenderSame === '1'">
        <a-form-item label="每日分数上限">
          <a-input-number
            v-model:value="formState.dayPoint"
            :min="0"
            :max="10000000"
          />
        </a-form-item>
        <a-form-item label="每周分数上限">
          <a-input-number
            v-model:value="formState.weekPoint"
            :min="0"
            :max="10000000"
          />
        </a-form-item>
        <a-form-item label="学期分数上限">
          <a-input-number
            v-model:value="formState.semesterPoint"
            :min="0"
            :max="10000000"
          />
        </a-form-item>
      </div>

      <div v-else class="gender-no-same">
        <div class="gender-item">
          男生
          <a-form-item label="每日分数上限">
            <a-input-number
              v-model:value="formState.MenDayPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
          <a-form-item label="每周分数上限">
            <a-input-number
              v-model:value="formState.MenWeekPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
          <a-form-item label="学期分数上限">
            <a-input-number
              v-model:value="formState.MenSemesterPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
        </div>
        <div class="gender-item">
          女生
          <a-form-item label="每日分数上限">
            <a-input-number
              v-model:value="formState.WomenDayPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
          <a-form-item label="每周分数上限">
            <a-input-number
              v-model:value="formState.WomenWeekPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
          <a-form-item label="学期分数上限">
            <a-input-number
              v-model:value="formState.WomenSemesterPoint"
              :min="0"
              :max="10000000"
            />
          </a-form-item>
        </div>
      </div>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { SportLimitTargetServicePresenter } from '@/request/api/presenter/aiSport';
import { message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';

interface formState {
  isGenderSame: string;
  dayPoint: null | number;
  weekPoint: null | number;
  semesterPoint: null | number;
  MenDayPoint: null | number;
  MenWeekPoint: null | number;
  MenSemesterPoint: null | number;
  WomenDayPoint: null | number;
  WomenWeekPoint: null | number;
  WomenSemesterPoint: null | number;
}
export default defineComponent({
  props: {
    showVisible: {
      type: Boolean,
      default: false
    },
    updateMen: {
      type: Object,
      default: () => {
        return {};
      }
    },
    updateWomen: {
      type: Object,
      default: () => {
        return {};
      }
    },
    limitId: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false);
    const formState = reactive<formState>({
      isGenderSame: '1',
      dayPoint: null,
      weekPoint: null,
      semesterPoint: null,
      MenDayPoint: null,
      MenWeekPoint: null,
      MenSemesterPoint: null,
      WomenDayPoint: null,
      WomenWeekPoint: null,
      WomenSemesterPoint: null
    });
    const { resetFields } = useForm(formState, {});

    watch(
      () => props.showVisible,
      () => {
        if (props.showVisible) {
          visible.value = true;
        }
      }
    );
    const semester = ref<string>('');
    watch(
      () => props.updateMen,
      () => {
        semester.value = props.updateMen.semester;
        const men = props.updateMen;
        if (props.updateMen.sexStr === '男女一致') {
          formState.isGenderSame = '1';
          formState.dayPoint = men.dayGoals;
          formState.weekPoint = men.weekGoals;
          formState.semesterPoint = men.semesterGoals;
        } else {
          formState.isGenderSame = '2';
          formState.MenDayPoint = men.dayGoals;
          formState.MenWeekPoint = men.weekGoals;
          formState.MenSemesterPoint = men.semesterGoals;
        }
      }
    );
    watch(
      () => props.updateWomen,
      () => {
        semester.value = props.updateMen.semester;
        const women = props.updateWomen;

        formState.isGenderSame = '2';
        formState.WomenDayPoint = women.dayGoals;
        formState.WomenWeekPoint = women.weekGoals;
        formState.WomenSemesterPoint = women.semesterGoals;
      }
    );
    const saveAppDialog = async () => {
      const requestDataSame = {
        //男女一致参数
        limitGoalsInfoId: props.updateMen.limitGoalsInfoId,
        sexType: 1,
        limitGoalsInfoList: [
          {
            dayGoals: formState.dayPoint,
            semesterGoals: formState.semesterPoint,
            sex: 1,
            weekGoals: formState.weekPoint
          }
        ]
      };
      const requestDataNoSame = {
        //男女不同参数
        limitGoalsInfoId: props.updateMen.limitGoalsInfoId,
        sexType: 2,
        limitGoalsInfoList: [
          {
            dayGoals: formState.MenDayPoint,
            semesterGoals: formState.MenSemesterPoint,
            sex: 1,
            weekGoals: formState.MenWeekPoint
          },
          {
            dayGoals: formState.WomenDayPoint,
            semesterGoals: formState.WomenSemesterPoint,
            sex: 2,
            weekGoals: formState.WomenWeekPoint
          }
        ]
      };

      try {
        if (formState.isGenderSame === '1') {
          await SportLimitTargetServicePresenter.update(requestDataSame);
        } else {
          await SportLimitTargetServicePresenter.update(requestDataNoSame);
        }
        emit('close', true);
        visible.value = false;
        resetFields();
      } catch (error) {
        message.error(error.message);
      }
    };
    const closeAppDialog = () => {
      emit('close', false);
      visible.value = false;
    };

    return {
      visible,
      props,
      closeAppDialog,
      saveAppDialog,
      formState,
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      semester
    };
  }
});
</script>
<style lang="less" scoped>
.dialog_semester {
  font-weight: 700;
  margin-bottom: 10px;
}
.modal-form {
  margin: 30px 0 0 60px;
}
.gender-no-same {
  display: flex;
  justify-content: space-evenly;
}
.gender-item {
  width: 235px;
  text-align: center;
}
</style>
