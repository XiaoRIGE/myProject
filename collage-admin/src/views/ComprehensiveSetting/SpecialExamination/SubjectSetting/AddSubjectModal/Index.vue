<template>
  <!-- 添加班级管理员弹窗 -->
  <a-modal
    v-model:visible="showVisible"
    :mask-closable="false"
    :keyboard="false"
    :width="880"
    :title="editData.id ? '编辑科目' : '新建科目'"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
      >
        保存
      </a-button>
    </template>
    <a-form
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 21 }"
      class="scroll-y"
    >
      <a-form-item label="科目名称" v-bind="validateInfos.subjectName">
        <a-input
          v-model:value="subjectForm.subjectName"
          placeholder="请输入科目名称"
        />
      </a-form-item>
      <a-form-item label="所属项目" v-bind="validateInfos.projectId">
        <a-select v-model:value="subjectForm.projectId" placeholder="请选择">
          <a-select-option
            v-for="item in projectList"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </a-select-option>
          <a-select-option key="general_project_id" value="general_project_id">
            通用项目
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="测试类型" v-bind="validateInfos.testType">
        <a-select
          v-model:value="subjectForm.testType"
          placeholder="请选择"
          @change="testTypeChange"
        >
          <a-select-option
            v-for="item in testTypeList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 测试类型不为技评时展示 -->
      <a-row v-show="showConfig">
        <a-col :span="12">
          <a-form-item
            label="计分方式"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model:value="subjectForm.scoringType"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in scoringTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="计分规则"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model:value="subjectForm.scoringStandard"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in scoringStandardList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-show="showConfig" label="测试规则">
        <!-- 统一规则 -->
        <div v-show="subjectForm.scoringStandard === 'SEX_UNIFIED'">
          <span>统一规则</span>
          <RuleItem
            ref="RuleItem"
            :default-data="RuleItemData"
            :rule-type="subjectForm.testType"
          />
        </div>
        <div
          v-show="subjectForm.scoringStandard === 'SEX_SEPARATED'"
          class="rule-box"
        >
          <div class="left">
            <span>男生规则</span>
            <RuleItem
              ref="RuleItemMan"
              :default-data="RuleItemManData"
              :rule-type="subjectForm.testType"
              class="mr-24"
            />
          </div>
          <div class="right">
            <span>女生规则</span>
            <RuleItem
              ref="RuleItemWoman"
              :default-data="RuleItemWomanData"
              :rule-type="subjectForm.testType"
            />
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { useForm } from '@ant-design-vue/use';
import RuleItem from './RuleItem/Index.vue';
import { SubjectPresenter } from '@/request/api/presenter/examination';
import { message, Modal } from 'ant-design-vue';
import { deepCopy } from '@/utils/common';
// 测试规则数据
interface subjectRatingRule {
  id?: string;
  value: string;
  grade: number;
}

// 新建科目表单
interface SubjectForm {
  subjectName: string; //| undefined
  projectId: string; //| undefined
  testType: string; //| undefined
  scoringType: string; //| undefined
  scoringStandard: string; //| undefined
  subjectRatingRule: subjectRatingRule[][];
}
// 规则（组件需要格式）
interface RuleItem {
  grade: number;
  enumValue: string;
  minutesValue: number;
  secondValue: number;
}
// 规则（接口数据格式）
interface dataItem {
  value: string;
  grade: number;
}

export default defineComponent({
  components: { RuleItem },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    editData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  emits: ['close', 'refresh-list'],
  setup(props, { emit }) {
    // 弹窗控制
    const showVisible = computed(() => {
      return props.visible;
    });

    // 获取store数据
    const getStoreInfo = () => {
      const store = useStore();
      const projectList = computed(() => store.state.basic.projectList);
      const testTypeList = computed(() => store.state.basic.testTypeList); //测试类型列表
      const scoringTypeList = computed(() => store.state.basic.scoringTypeList); //计分方式列表
      const scoringStandardList = computed(
        () => store.state.basic.scoringStandardList
      ); //计分标准列表

      const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

      store.dispatch('basic/updateProjectList');
      return {
        projectList,
        testTypeList,
        scoringTypeList,
        scoringStandardList,
        currentSemester
      };
    };

    const {
      projectList,
      testTypeList,
      scoringTypeList,
      scoringStandardList
    } = getStoreInfo();

    // 提交loading
    const loading = ref<boolean>(false);

    // 表单(默认数据)
    const subjectForm: SubjectForm = reactive({
      subjectName: '',
      projectId: (undefined as unknown) as string,
      testType: 'RATING',
      scoringType: 'RANGE',
      scoringStandard: 'SEX_UNIFIED',
      subjectRatingRule: []
    });

    // 切换测试类型联动
    const testTypeChange = () => {
      if (subjectForm.testType !== 'RATING') {
        subjectForm.scoringType = 'RANGE';
        subjectForm.scoringStandard = 'SEX_UNIFIED';
      }
    };

    const defaultRule = [
      {
        enumValue: '0',
        minutesValue: 0,
        secondValue: 0,
        grade: 0
      }
    ];
    // 测试规则源数据
    const RuleItemData = ref(deepCopy(defaultRule));
    const RuleItemManData = ref(deepCopy(defaultRule));
    const RuleItemWomanData = ref(deepCopy(defaultRule));

    const resetRuleData = () => {
      RuleItemData.value = deepCopy(defaultRule);
      RuleItemManData.value = deepCopy(defaultRule);
      RuleItemWomanData.value = deepCopy(defaultRule);
    };

    // 将源数据搁置遍历为组件需要数据格式
    const getRuleMapData = (dataSrouce: dataItem[], type = 'ENUM') => {
      return dataSrouce.map((item: dataItem) => {
        if (type === 'ENUM') {
          return {
            grade: item.grade,
            enumValue: item.value,
            minutesValue: 0,
            secondValue: 0
          };
        } else {
          const minutes = Math.floor(Number(item.value) / 60);
          const second = (Number(item.value) % 60).toFixed(2);
          return {
            grade: item.grade,
            enumValue: '0',
            minutesValue: minutes,
            secondValue: second
          };
        }
      });
    };

    // 编辑回填
    watch(
      () => props.editData,
      () => {
        const {
          id,
          title,
          projectId,
          subjectType,
          ratingType,
          dataGroupType,
          subjectRatingRule
        } = props.editData;

        if (!id) return;

        subjectForm.subjectName = title;
        subjectForm.projectId = projectId;
        subjectForm.testType = subjectType;
        subjectForm.scoringType = ratingType;
        subjectForm.scoringStandard = dataGroupType;

        // 根据计分规则判断回显
        if (dataGroupType === 'SEX_UNIFIED') {
          const [ruleInfo] = subjectRatingRule;
          if (ruleInfo && ruleInfo.length) {
            RuleItemData.value = getRuleMapData(ruleInfo, subjectType);
          }
        } else {
          const [manInfo, womanInfo] = subjectRatingRule;
          if (manInfo && manInfo.length) {
            RuleItemManData.value = getRuleMapData(manInfo, subjectType);
          }
          if (womanInfo && womanInfo.length) {
            RuleItemWomanData.value = getRuleMapData(womanInfo, subjectType);
          }
        }
      },
      {
        deep: true
      }
    );

    // 表单必填校验
    const ruleConfig = new Map();
    ruleConfig.set('subjectName', '请输入科目名称');
    ruleConfig.set('projectId', '请选择所属项目');
    ruleConfig.set('testType', '请选择测试类型');
    // ruleConfig.set('scoringType', '请选择计分方式');
    // ruleConfig.set('scoringStandard', '请选择计分规则');

    const validateItem = async (rule: any, value: string) => {
      if (!value) {
        let errStr = '请选择';
        const { field } = rule;
        if (ruleConfig.has(field)) {
          errStr = ruleConfig.get(field);
        }
        return Promise.reject(errStr);
      } else {
        return Promise.resolve();
      }
    };
    const validateScoringType = async (rule: any, value: string) => {
      if (value === '' && subjectForm.testType !== 'RATING') {
        return Promise.reject('请选择计分方式');
      } else {
        return Promise.resolve();
      }
    };
    const validateScoringStandard = async (rule: any, value: string) => {
      if (value === '' && subjectForm.testType !== 'RATING') {
        return Promise.reject('请选择计分规则');
      } else {
        return Promise.resolve();
      }
    };

    const rulesRef = reactive({
      subjectName: [{ validator: validateItem, trigger: 'blur' }],
      projectId: [{ validator: validateItem, trigger: 'change' }],
      testType: [{ validator: validateItem, trigger: 'change' }],
      scoringType: [{ validator: validateScoringType, trigger: 'change' }],
      scoringStandard: [
        { validator: validateScoringStandard, trigger: 'change' }
      ]
    });
    const { validateInfos, validate, resetFields } = useForm(
      subjectForm,
      rulesRef
    );

    // 展示额外表单（判断是否是技评）
    const showConfig = computed(() => subjectForm.testType !== 'RATING');

    // 关闭
    const handleCancel = () => {
      // 重置表单
      resetFields();
      // 重置规则数据
      resetRuleData();
      emit('close');
    };
    const RuleItem = ref(); //统一规则子组件实例
    const RuleItemMan = ref(); //统一规则子组件实例
    const RuleItemWoman = ref(); //统一规则子组件实例

    // 将数据格式化为接口要的类型
    const getRuleItemData = (srouceRef: any) => {
      return srouceRef.ruleListRef.map((item: RuleItem) => {
        if (subjectForm.testType === 'ENUM') {
          // 取数值成绩
          return {
            value: item.enumValue,
            grade: item.grade
          };
        } else {
          // 取时间成绩
          let totalMinutes = 0;
          const minutes = item.minutesValue;
          const second = item.secondValue;
          totalMinutes = minutes * 60 + Number(second);
          return {
            value: totalMinutes,
            grade: item.grade
          };
        }
      });
    };

    // 新增|编辑接口
    const saveData = async () => {
      try {
        const subjectRatingRule: any[] = [];
        // 为技评时需要该字段
        if (showConfig.value) {
          if (subjectForm.scoringStandard === 'SEX_UNIFIED') {
            subjectRatingRule.push(getRuleItemData(RuleItem.value));
          } else {
            subjectRatingRule.push(getRuleItemData(RuleItemMan.value));
            subjectRatingRule.push(getRuleItemData(RuleItemWoman.value));
          }
        }
        const params = {
          title: subjectForm.subjectName,
          projectId: subjectForm.projectId,
          subjectType: subjectForm.testType,
          ratingType: subjectForm.scoringType,
          dataGroupType: subjectForm.scoringStandard,
          subjectRatingRule,
          id: ''
        };
        if (!props.editData.id) {
          await SubjectPresenter.add(params as any);
          message.success('科目新增成功！');
        } else {
          params.id = props.editData.id;
          await SubjectPresenter.update(params);
          message.success('科目编辑成功！');
        }
        // 重置规则数据
        resetRuleData();
        resetFields();
        emit('refresh-list');
      } catch (error) {
        Modal.error({
          title: '操作失败',
          content: error?.message
        });
      }
    };

    const handleOk = () => {
      validate()
        .then(() => {
          saveData();
        })
        .catch(e => {
          console.log(e);
        });
    };

    return {
      showVisible,
      RuleItem,
      RuleItemMan,
      RuleItemWoman,
      RuleItemData,
      RuleItemManData,
      RuleItemWomanData,
      handleCancel,
      handleOk,
      loading,
      subjectForm,
      validateInfos,
      showConfig,
      testTypeChange,
      projectList,
      testTypeList,
      scoringTypeList,
      scoringStandardList
    };
  }
});
</script>

<style lang="less" scoped>
.addsubject {
  .rule-box {
    display: flex;
    justify-content: space-between;
  }
}
:deep(.rule-box) {
  display: flex;
  // justify-content: space-between;
}
:deep(.mr-24) {
  margin-right: 24px;
}
.scroll-y {
  max-height: 500px;
  padding-right: 20px;
  overflow-y: auto;
}
</style>
