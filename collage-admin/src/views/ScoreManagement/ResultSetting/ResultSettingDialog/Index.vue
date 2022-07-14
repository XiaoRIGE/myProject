<template>
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    placement="right"
    :closable="true"
    :visible="showVisible"
    :title="`${props.schoolYear}成绩配置`"
    width="800px"
    :mask-closable="false"
    :destroy-on-close="true"
    @close="onClose"
  >
    <div>
      <a-form layout="inline">
        <a-form-item class="form-item form-margin-left" label="考勤">
          <a-input-number
            v-model:value="data.sign"
            :min="0"
            :max="100"
            :step="1.0"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            @change="proportionChange(data.sign, 'sign')"
          />
          <a-checkbox
            v-model:checked="data.signStatus"
            :disabled="data.sign === 0"
            class="form-check"
          ></a-checkbox>
          考勤未达到
          <a-input-number
            v-model:value="data.signTag"
            :disabled="
              data.signStatus === false ||
                data.signStatus === 0 ||
                data.sign === 0
            "
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.signTag, 'signTag')"
          />
          时记为
          <a-input-number
            v-model:value="data.signGrade"
            :disabled="
              data.signStatus === false ||
                data.signStatus === 0 ||
                data.sign === 0
            "
            :min="0"
            :max="100"
            :step="1.0"
            @change="proportionPointChange(data.signGrade, 'signGrade')"
          />
          分
        </a-form-item>
        <a-form-item class="form-item form-margin-left" label="跑步">
          <a-input-number
            v-model:value="data.running"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.running, 'running')"
          />
          <a-checkbox
            v-model:checked="data.runningStatus"
            :disabled="data.running === 0"
            class="form-check"
          ></a-checkbox>
          跑步未达到学期目标
          <a-input-number
            v-model:value="data.runningTag"
            :disabled="
              data.runningStatus === false ||
                data.runningStatus === 0 ||
                data.running === 0
            "
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.runningTag, 'runningTag')"
          />
          时记为
          <a-input-number
            v-model:value="data.runningGrade"
            :disabled="
              data.runningStatus === false ||
                data.runningStatus === 0 ||
                data.running === 0
            "
            :min="0"
            :max="100"
            :step="1.0"
            @change="proportionPointChange(data.runningGrade, 'runningGrade')"
          />
          分
        </a-form-item>
        <a-form-item class="form-item" label="课外活动">
          <a-input-number
            v-model:value="data.activity"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.activity, 'activity')"
          />
          <a-checkbox
            v-model:checked="data.activityStatus"
            :disabled="data.activity === 0"
            class="form-check"
          ></a-checkbox>
          次数未达到
          <a-input-number
            v-model:value="data.activityTag"
            :disabled="
              data.activityStatus === false ||
                data.activityStatus === 0 ||
                data.activity === 0
            "
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.activityTag, 'activityTag')"
          />
          时记为
          <a-input-number
            v-model:value="data.activityGrade"
            :disabled="
              data.activityStatus === false ||
                data.activityStatus === 0 ||
                data.activity === 0
            "
            :min="0"
            :max="100"
            :step="1.0"
            @change="proportionPointChange(data.activityGrade, 'activityGrade')"
          />
          分
        </a-form-item>
        <a-form-item class="form-item" label="体质健康">
          <a-input-number
            v-model:value="data.fitness"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.fitness, 'fitness')"
          />
          <a-checkbox
            v-model:checked="data.fitnessStatus"
            :disabled="data.fitness === 0"
            class="form-check"
          ></a-checkbox>
          体测成绩未达到
          <a-input-number
            v-model:value="data.fitnessTag"
            :disabled="
              data.fitnessStatus === false ||
                data.fitnessStatus === 0 ||
                data.fitness === 0
            "
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="proportionChange(data.fitnessTag, 'fitnessTag')"
          />
          时记为
          <a-input-number
            v-model:value="data.fitnessGrade"
            :disabled="
              data.fitnessStatus === false ||
                data.fitnessStatus === 0 ||
                data.fitness === 0
            "
            :min="0"
            :max="100"
            :step="1.0"
            @change="proportionPointChange(data.fitnessGrade, 'fitnessGrade')"
          />
          分
        </a-form-item>
        <div class="physical-set-div">
          <a-form-item class="form-item" label="体测成绩配置">
            <div class="form-style">
              <a-radio-group
                v-model:value="data.fitnessSettingVO.fitnessStandard"
              >
                <a-radio :value="0" @click="standard">国家标准</a-radio>
                <a-radio :value="1">自定义</a-radio>
              </a-radio-group>
              <br />
              <a-form-item label="身高体重" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.heightPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.heightPercentage,
                      'heightPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="肺活量" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.vitalCapacityPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.vitalCapacityPercentage,
                      'vitalCapacityPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="坐位体前屈" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.sitAndReachPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.sitAndReachPercentage,
                      'sitAndReachPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="立定跳远" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.jumpPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.jumpPercentage,
                      'jumpPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="50米" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.fiftyMetersPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.fiftyMetersPercentage,
                      'fiftyMetersPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="800/1000米" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.runningPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.runningPercentage,
                      'runningPercentage'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="引体向上/仰卧起坐" class="margin-class">
                <a-input-number
                  v-model:value="data.fitnessSettingVO.pullUpAndSitUpPercentage"
                  :min="0"
                  :max="100"
                  :disabled="data.fitnessSettingVO.fitnessStandard === 0"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  :step="1.0"
                  @change="
                    physicalChange(
                      data.fitnessSettingVO.pullUpAndSitUpPercentage,
                      'pullUpAndSitUpPercentage'
                    )
                  "
                />
              </a-form-item>
            </div>
            <div class="physical-total">
              体测配置总和：{{ physicalSumTotal }}%
            </div>
          </a-form-item>
        </div>
        <a-form-item class="form-item" label="理论考试">
          <a-input-number
            v-model:value="data.theoryExamination"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="
              proportionChange(data.theoryExamination, 'theoryExamination')
            "
          />
        </a-form-item>
        <br />
        <a-form-item class="form-item" :label="data.normalName">
          <a-input-number
            v-model:value="data.coursePerformance"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="
              proportionChange(data.coursePerformance, 'coursePerformance')
            "
          />
        </a-form-item>
        <br />
        <a-form-item class="form-item" label="专项考试">
          <a-input-number
            v-model:value="data.specialExamination"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :step="1.0"
            @change="
              proportionChange(data.specialExamination, 'specialExamination')
            "
          />
        </a-form-item>
      </a-form>
      <div class="grade-total">学期成绩配置总和：{{ semesterSumTotal }}%</div>
    </div>
    <div v-if="activityStatus !== 6" class="bottom-submit">
      <a-button class="cancel" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" @click="onSubmit">
        保存
      </a-button>
    </div>
  </a-drawer>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { GradeSettingServicePresenter } from '@/request/api/presenter/schoolSetting';
import { Modal } from 'ant-design-vue';

export default defineComponent({
  props: {
    isDrawerShow: {
      type: Boolean
    },
    schoolYear: {
      type: String,
      default: ''
    },
    resultSettingData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const gradeForm = reactive<any>({
      data: {
        activity: 0, //活动
        activityGrade: 0, //活动标准：未达到多少的默认分数
        activityStatus: 0, //活动标准勾选状态：0表示不启用 1表示启用
        activityTag: 0, //活动标准：未达到多少记为0
        coursePerformance: 0, //课堂表现
        fitness: 0, //体质健康
        fitnessGrade: 0, //体质健康标准：未达到多少的默认分数
        fitnessSettingVO: {
          fitnessStandard: 0, //0国家标准 1自定义
          fiftyMetersPercentage: 20, //50m占比
          gradeSettingId: '', //成绩配置id
          heightPercentage: 15, //身高体重
          jumpPercentage: 10, //立定跳远占比
          pullUpAndSitUpPercentage: 10, //引体向上/仰卧起坐占比
          runningPercentage: 20, //800/1000占比
          sitAndReachPercentage: 10, //坐位体前屈占比
          vitalCapacityPercentage: 15 //肺活量占比
        },
        fitnessStatus: 0, //体质健康勾选状态：0表示不启用 1表示启用
        fitnessTag: 0, //体质健康标准：未达到多少记为0
        id: '',
        organizationId: '',
        normalName: '', //课堂表现
        running: 0, //跑步
        runningGrade: 0, //跑步标准：未达到多少的默认分数
        runningStatus: 0, //跑步标准勾选状态：0表示不启用 1表示启用
        runningTag: 0, //跑步标准：未达到多少记为0
        schoolYear: '',
        semesterType: '',
        sign: 0, //考勤
        signGrade: 0, //考勤标准：未达到多少的默认分数，允许小数点后两位
        signStatus: 0, //考勤标准勾选状态：0表示不启用 1表示启用
        signTag: 0, //考勤标准：未达到多少记为0
        specialExamination: 0, //专项考试
        theoryExamination: 0, //理论考试
        total: 0
      }
    });

    const { resetFields } = useForm(gradeForm, {});

    watch(
      () => props.resultSettingData,
      () => {
        resetFields();
        if (props.resultSettingData.activity === '-') {
          //活动为‘-’表示当前学期未配置
          gradeForm.data.id = props.resultSettingData.id;
          gradeForm.data.normalName = props.resultSettingData.normalName;
          return;
        }
        gradeForm.data = JSON.parse(JSON.stringify(props.resultSettingData));
      },
      { deep: true }
    );
    const showVisible = computed(() => {
      return props.isDrawerShow;
    });

    //点击国家标准
    const standard = () => {
      const item = gradeForm.data.fitnessSettingVO;
      item.heightPercentage = 15;
      item.vitalCapacityPercentage = 15;
      item.sitAndReachPercentage = 10;
      item.jumpPercentage = 10;
      item.fiftyMetersPercentage = 20;
      item.runningPercentage = 20;
      item.pullUpAndSitUpPercentage = 10;
    };

    //计算体测配置总和
    const physicalSumTotal = computed(() => {
      const item = gradeForm.data.fitnessSettingVO;
      const physicalTotalRef =
        item.heightPercentage +
        item.vitalCapacityPercentage +
        item.sitAndReachPercentage +
        item.jumpPercentage +
        item.fiftyMetersPercentage +
        item.runningPercentage +
        item.pullUpAndSitUpPercentage;
      return Number(physicalTotalRef).toFixed(1);
    });

    //学期成绩配置总和
    const semesterSumTotal = computed(() => {
      const semesterTotalRef =
        gradeForm.data.sign +
        gradeForm.data.running +
        gradeForm.data.activity +
        gradeForm.data.fitness +
        gradeForm.data.specialExamination +
        gradeForm.data.coursePerformance +
        gradeForm.data.theoryExamination;
      return Number(semesterTotalRef).toFixed(1);
    });

    const onClose = () => {
      emit('change-visible', 0);
    };

    const onSubmit = async () => {
      const requestData = gradeForm.data;
      delete requestData.schoolYear;
      delete requestData.semesterType;
      requestData.signStatus = Number(requestData.signStatus);
      requestData.activityStatus = Number(requestData.activityStatus);
      requestData.fitnessStatus = Number(requestData.fitnessStatus);
      requestData.runningStatus = Number(requestData.runningStatus);

      //权重为0 对应的status为0
      requestData.signStatus =
        requestData.sign === 0 ? 0 : requestData.signStatus;
      requestData.runningStatus =
        requestData.running === 0 ? 0 : requestData.runningStatus;
      requestData.activityStatus =
        requestData.activity === 0 ? 0 : requestData.activityStatus;
      requestData.fitnessStatus =
        requestData.fitness === 0 ? 0 : requestData.fitnessStatus;

      if (physicalSumTotal.value !== '100.0') {
        Modal.error({
          title: '保存失败',
          content: '体测配置总和应为100%'
        });
        return;
      }
      try {
        await GradeSettingServicePresenter.updateGradeSetting(requestData);
        emit('change-visible', 1);
      } catch (error) {
        Modal.error({
          title: '编辑失败',
          content: `${error.message}`
        });
      }
    };

    const proportionChange = (value: number, name: string) => {
      gradeForm.data[name] = Number(value.toFixed(1));
    };

    const proportionPointChange = (value: number, name: string) => {
      gradeForm.data[name] = Number(value.toFixed(2));
    };

    const physicalChange = (value: number, name: string) => {
      gradeForm.data.fitnessSettingVO[name] = Number(value.toFixed(1));
    };

    return {
      showVisible,
      onClose,
      props,
      physicalSumTotal,
      semesterSumTotal,
      //表单
      ...toRefs(gradeForm),
      standard,
      onSubmit,
      proportionChange,
      proportionPointChange,
      physicalChange
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.performane-Limit .ant-radio-group-default) {
  width: 190px;
  line-height: 32px;
}
:deep(.ant-select-enabled) {
  max-height: 87px;
  overflow: auto;
}

.bottom-submit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
  .cancel {
    margin-right: 8px;
  }
}
.form-check {
  margin-left: 20px;
}
.form-item {
  margin-top: 20px;
}
.form-margin-left {
  margin-left: 27px;
}
.physical-set-div {
  margin-top: 20px;
  padding: 0 20px 0 20px;
  background: rgba(248, 248, 248, 1);
  .form-style {
    position: relative;
    left: 107px;
    top: -37px;
  }
  .margin-class {
    margin-top: 10px;
  }
}

.grade-total {
  border-top: 1px solid #e9e9e9;
  margin-top: 30px;
  padding-top: 30px;
  font-size: 18px;
  font-weight: 700;
}
.physical-total {
  position: absolute;
  right: -622px;
  top: 117px;
}
</style>
