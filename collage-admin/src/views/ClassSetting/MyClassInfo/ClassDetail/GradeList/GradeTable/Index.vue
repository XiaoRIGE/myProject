<template>
  <div class="grade-table">
    <a-empty
      v-if="!hasConfig"
      class="nodata"
      :image-style="{
        height: '74px'
      }"
    >
      <template #description>
        <span>该学期暂未进行成绩配置</span>
      </template>
    </a-empty>
    <a-table
      v-else
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 1200 }"
      :pagination="false"
      :loading="loading"
      bordered
      :locale="{ emptyText: '该班级暂无学生' }"
      row-key="id"
    >
      <template #name="{ record }">
        <div class="ellipsis cursor" @click="edit(record.key)">
          <div>{{ record.name }}({{ record.sexStr }})</div>
          <div>{{ record.number }}</div>
        </div>
      </template>
      <template #total="{ record }">
        <div
          :class="record.total < 60 ? 'warn-text cursor' : 'cursor'"
          class="bold"
          @click="edit(record.key)"
        >
          {{ record.total }}
        </div>
      </template>
      <template #content="{ text,record }">
        <div class="ellipsis" @click="edit(record.key)">
          <a-tooltip :title="text">
            {{ text }}
          </a-tooltip>
        </div>
      </template>
      <!-- 存在只是为了绑定点击事件 = =。 -->
      <template #running="{ record,text }">
        <span class="cursor" @click="edit(record.key)">
          {{ getShowStr(text) }}
        </span>
      </template>
      <template #activity="{ record,text }">
        <span class="cursor" @click="edit(record.key)">
          {{ getShowStr(text) }}
        </span>
      </template>
      <template #fitness="{ record,text }">
        <span class="cursor" @click="edit(record.key)">
          {{ getShowStr(text) }}
        </span>
      </template>
      <template #additionalPoints="{ record,text }">
        <span class="cursor" @click="edit(record.key)">
          {{ getShowStr(text) }}
        </span>
      </template>
      <!-- 可编辑列 -->
      <template v-for="col in canEditColumnKeyArr" #[col]="{ text, record }">
        <div :key="col">
          <!--编辑模式 输入框是单个数字输入框 -->
          <a-input-number
            v-if="
              editableData[record.key] &&
                [
                  'sign',
                  'theoryExamination',
                  'coursePerformance',
                  'additionalPoints'
                ].includes(col)
            "
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <!--编辑模式 输入框是input -->
          <a-input
            v-else-if="editableData[record.key] && col === 'content'"
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <!-- 非编辑模式(非动态科目列) -->
          <template v-else-if="!subjectColumnKeyArr.includes(col)">
            <span class="cursor" @click="edit(record.key)">
              {{ getShowStr(text) }}
            </span>
          </template>
          <!-- 动态科目列 -->
          <div v-if="subjectColumnKeyArr.includes(col)">
            <!-- 编辑状态 -->
            <div v-if="editableData[record.key]" class="flex-box">
              <!-- 区分测试类型为时间、数值、技评 -->
              <div
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType ===
                    'TIME'
                "
                class="flex-box"
              >
                <a-input-number
                  v-model:value="
                    editableData[record.key].subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].minuteVal
                  "
                  :min="0"
                  :max="999"
                  :step="1"
                  :formatter="value => `${value}分`"
                  :parser="value => value.replace('分', '')"
                  style="margin: -5px 5px -5px 0"
                />
                <a-input-number
                  v-model:value="
                    editableData[record.key].subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].secondVal
                  "
                  :min="0"
                  :max="59.99"
                  :step="1"
                  :formatter="value => `${value}秒`"
                  :parser="value => value.replace('秒', '')"
                  style="margin: -5px 0"
                />
              </div>

              <a-input-number
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType ===
                    'ENUM'
                "
                v-model:value="
                  editableData[record.key].subjectSettingListVO[
                    getIndex(col, record.subjectSettingListVO)
                  ].value
                "
                style="margin: -5px 0"
              />
              <a-input-number
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType ===
                    'RATING'
                "
                v-model:value="
                  editableData[record.key].subjectSettingListVO[
                    getIndex(col, record.subjectSettingListVO)
                  ].value
                "
                :max="100"
                :min="0"
                style="margin: -5px 0"
              />
              <!-- 技评类型不展示得分项 -->
              <span
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType !==
                    'RATING'
                "
              >
                <span>&nbsp;|&nbsp;</span>
                <!-- 接口得分 -->
                <span>
                  {{
                    record.subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].grade || '/'
                  }}
                </span>
              </span>
              <!-- 数值和技评计算得分方法 暂时注释 这一版本不上线动态计算成绩功能 -->
              <!-- <span
                v-if="
                  ['RATING', 'ENUM'].includes(
                    subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType
                  )
                "
              >
                {{
                  getRealScore(
                    editableData[record.key].subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].value,
                    record.sex,
                    col
                  )
                }}
              </span> -->
              <!-- 根据时间计算得分 -->
              <!-- <span
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType ===
                    'TIME'
                "
              >
                {{
                  getRealScore(
                    editableData[record.key].subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].minuteVal *
                      60 +
                      editableData[record.key].subjectSettingListVO[
                        getIndex(col, record.subjectSettingListVO)
                      ].secondVal,
                    record.sex,
                    col
                  )
                }}
              </span> -->
            </div>
            <!-- 非编辑状态 -->
            <template v-else>
              <!-- 计分方式为时间 -->
              <div
                v-if="
                  subjectRuleArr[getIndex(col, subjectRuleArr)].subjectType ===
                    'TIME'
                "
                class="cursor"
                @click="edit(record.key)"
              >
                <!-- 该专项没有时间记录 -->
                <span
                  v-if="
                    record.subjectSettingListVO[
                      getIndex(col, record.subjectSettingListVO)
                    ].value === null
                  "
                >
                  /
                </span>
                <!-- 该专项有时间记录 -->
                <span v-else>
                  {{
                    parseInt(
                      record.subjectSettingListVO[
                        getIndex(col, record.subjectSettingListVO)
                      ].value / 60
                    ) +
                      `
                      '
                      ${
                        isInteger(
                          record.subjectSettingListVO[
                            getIndex(col, record.subjectSettingListVO)
                          ].value % 60
                        )
                          ? record.subjectSettingListVO[
                            getIndex(col, record.subjectSettingListVO)
                          ].value % 60
                          : (
                            record.subjectSettingListVO[
                              getIndex(col, record.subjectSettingListVO)
                            ].value % 60
                          ).toFixed(2)
                      }
                      `
                  }}
                </span>
                <span>&nbsp;|&nbsp;</span>
                <span>
                  {{
                    getShowStr(
                      record.subjectSettingListVO[
                        getIndex(col, record.subjectSettingListVO)
                      ].grade
                    )
                  }}
                </span>
              </div>

              <!-- 计分方式为数值或技评 -->
              <div v-else class="cursor" @click="edit(record.key)">
                <span>
                  {{
                    getShowStr(
                      record.subjectSettingListVO[
                        getIndex(col, record.subjectSettingListVO)
                      ].value
                    )
                  }}
                </span>
                <!-- 技评类型不展示得分项 -->
                <span
                  v-if="
                    subjectRuleArr[getIndex(col, subjectRuleArr)]
                      .subjectType !== 'RATING'
                  "
                >
                  <span>&nbsp;|&nbsp;</span>
                  <span>
                    {{
                      getShowStr(
                        record.subjectSettingListVO[
                          getIndex(col, record.subjectSettingListVO)
                        ].grade
                      )
                    }}
                  </span>
                </span>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-space :size="16">
              <a @click="save(record.key)">保存</a>
              <a-popconfirm
                placement="topRight"
                title="退出后不保存当前录入，确定退出编辑状态吗?"
                @confirm="cancel(record.key)"
              >
                <a>取消</a>
              </a-popconfirm>
            </a-space>
          </span>
          <span v-else>
            <a-tooltip v-if="isApproved || !isCurrentSemester" placement="top">
              <template #title>
                <span>成绩已复核，不可编辑</span>
              </template>
              <a-button type="link" disabled>
                编辑
              </a-button>
            </a-tooltip>
            <a-tooltip v-else-if="isLocked" placement="top">
              <template #title>
                <span>成绩已锁定，不可编辑</span>
              </template>
              <a-button type="link" disabled>
                编辑
              </a-button>
            </a-tooltip>
            <a-button v-else type="link" @click="edit(record.key)">
              编辑
            </a-button>
          </span>
        </div>
      </template>
    </a-table>
    <a-pagination
      v-model:current="current"
      v-model:pageSize="pageSize"
      class="pagination"
      :total="totalNum"
      :show-total="total => `共 ${total} 条`"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  createVNode,
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  watch,
  watchEffect
} from 'vue';
import { GradePresenter } from '@/request/api/presenter/class';
import {
  computeSubjectAchievement,
  computeSubjectGrade,
  getMaxScoreByRule,
  isInteger
} from '@/utils/common';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
interface DataItem {
  key: string;
  name: string;
  sexStr: string;
  number: number;
  year: string;
  total: number;
  sign: number | null;
  running: number;
  activity: number;
  fitness: number;
  theoryExamination: number | null;
  additionalPoints: number;
  content: string;
  subjectSettingListVO: any[];
}
interface columnItem {
  subjectType: string;
  title: string;
  key: string;
  proportion: number;
}

// DataItem
let data: any[] = [];

// table列
const getColumn = () => {
  const menuWidth: any = {
    TIME: 180,
    RATING: 85,
    ENUM: 120
  };

  const getVNodeByword = (str: string | number) => {
    return createVNode('div', {}, str);
  };

  const getColumnConfig = (columnList: columnItem[]) => {
    if (!columnList.length) return [];
    return columnList.map((item: columnItem) => {
      const childVNode1 = getVNodeByword(item.title);
      const childVNode2 = getVNodeByword(`${item.proportion}%`);
      const vNode = createVNode('div', {}, [childVNode1, childVNode2]);
      return {
        // title: `${item.title} ${item.proportion}%`,
        title: () => {
          return vNode;
        },
        dataIndex: item.key,
        width: menuWidth[item.subjectType] ? menuWidth[item.subjectType] : 85,
        slots: { customRender: item.key }
      };
    });
  };

  // 固定成绩列 （权重动态分配）
  const baseColumnDefaultData: columnItem[] = [];
  // 动态科目列
  const dynamicColumnDefaultData: columnItem[] = [];

  const baseColumn1 = getColumnConfig(baseColumnDefaultData); //固定成绩列
  const baseColumn2 = getColumnConfig(dynamicColumnDefaultData); //动态科目列

  const baseStartColumn = [
    {
      title: '学生',
      dataIndex: 'name',
      fixed: 'left',
      width: 115,
      slots: { customRender: 'name' }
    },
    // {
    //   title: '年级',
    //   dataIndex: 'year',
    //   fixed: 'left',
    //   width: 80,
    //   slots: { customRender: 'year' }
    // },
    {
      title: '总分',
      dataIndex: 'total',
      fixed: 'left',
      width: 55,
      slots: { customRender: 'total' }
    }
  ];

  const baseEndStartColumn = [
    {
      title: '附加分',
      dataIndex: 'additionalPoints',
      width: 80,
      slots: { customRender: 'additionalPoints' }
    },
    {
      title: '备注',
      dataIndex: 'content',
      width: 80,
      ellipsis: true,
      slots: { customRender: 'content' }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      slots: { customRender: 'operation' }
    }
  ];

  return {
    baseStartColumn,
    baseColumn1: ref(baseColumn1),
    baseColumn2: ref(baseColumn2),
    baseEndStartColumn,
    getColumnConfig
  };
};

export default defineComponent({
  props: {
    courseId: {
      type: String,
      required: true
    },
    keyword: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      required: true
    },
    isLocked: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const loading = ref<boolean>(false);

    const dataSource = ref(data);

    const store = useStore();
    const isCurrentSemester = computed(
      () => store.state.basic.currentSemester.current === 1
    ); //是否当前学期

    // column start
    const {
      baseStartColumn,
      baseColumn1,
      baseColumn2,
      baseEndStartColumn,
      getColumnConfig
    } = getColumn();

    const columns = ref([
      ...baseStartColumn,
      ...baseColumn1.value,
      ...baseColumn2.value,
      ...baseEndStartColumn
    ]);

    // 可编辑列的key
    const canEditColumnKeyArr = ref([
      'sign',
      'theoryExamination',
      'coursePerformance'
      // 暂时不可编辑附加分和备注（如果以后需要编辑，放开注释）
      // 'additionalPoints',
      // 'content'
    ]);

    // 科目列的key
    const subjectColumnKeyArr = ref<string[]>([]);

    // 格式化展示null
    const getShowStr = computed(() => {
      return (str: any) => {
        return str === null ? '/' : str;
      };
    });

    // 科目规则
    const subjectRuleArr = ref<any>([]);

    // 是否为百分制方式展示
    const isPercentageSys = ref<boolean>(false);

    // 该班级是否有成绩配置信息
    const hasConfig = ref<boolean>(false);

    // 获取表头
    const getGradeHead = async () => {
      try {
        loading.value = true;
        const params = {
          courseId: props.courseId //'402881f77b443dec017b4cceb8d50033'
        };
        const {
          baseColumnData,
          dynamicColumnData,
          dynamicColumnKeyArr,
          singleShowType
        } = await GradePresenter.getGradeHead(params);

        // 更新列之后要先清空行数据
        dataSource.value = [];

        // 更新固定成绩列
        baseColumn1.value = getColumnConfig(baseColumnData);
        // 更新科目列
        baseColumn2.value = getColumnConfig(dynamicColumnData);

        console.log('baseColumn2', baseColumn2.value);

        // 更新可编辑列

        canEditColumnKeyArr.value = [
          ...canEditColumnKeyArr.value,
          ...dynamicColumnKeyArr
        ];

        // 更新科目列KEY
        subjectColumnKeyArr.value = dynamicColumnKeyArr;

        // 更新科目规则
        subjectRuleArr.value = dynamicColumnData;

        // 更新是否为百分制
        isPercentageSys.value = singleShowType === 1 ? true : false;

        hasConfig.value = true;

        columns.value = [
          ...baseStartColumn,
          ...baseColumn2.value,
          ...baseColumn1.value,
          ...baseEndStartColumn
        ];
      } catch (error) {
        console.log(error);
        // 未配置成绩占比时不需要请求列表数据
        if (error?.code === 71009) {
          hasConfig.value = false;
          data = [];
        }
      } finally {
        loading.value = false;
      }
    };

    /**
     * @description: 根据id和数组信息返回索引信息
     * @param {string} id 列id
     * @param {any[]} srouce 学生所有科目成绩
     * @return {number} index 索引
     */
    const getIndex = (id: string, srouce: any[]) => {
      // const exitId = false
      let targetIndex = 0;
      if (!srouce.length) return targetIndex;
      srouce.forEach((item, index) => {
        if (item.id === id) {
          targetIndex = index;
        }
      });
      return targetIndex;
    };

    // 实时计算科目得分
    const getRealScore = computed(() => {
      return (target: number, sex: number, col: string) => {
        // 当前科目规则信息
        const currentSubject =
          subjectRuleArr.value[getIndex(col, subjectRuleArr.value)];

        const {
          subjectRatingRuleDOList,
          subjectType,
          ratingType,
          dataGroupType,
          proportion
        } = currentSubject;

        //科目最大得分
        const maxScore = getMaxScoreByRule(sex, subjectRatingRuleDOList);

        // 计算出来的得分
        const result = computeSubjectAchievement(
          target,
          sex,
          subjectRatingRuleDOList,
          subjectType,
          ratingType,
          dataGroupType
        );

        return computeSubjectGrade(
          result,
          maxScore,
          proportion,
          isPercentageSys.value
        );
      };
    });

    // column end

    // datasource start

    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const totalNum = ref<number>(0);

    // 获取学生成绩
    const getList = async () => {
      try {
        loading.value = true;
        const params = {
          courseId: props.courseId, //'402881f77b443dec017b4cceb8d50033',
          offsetPage: 0,
          page: current.value,
          query: props.keyword,
          size: pageSize.value
        };
        const { items, total } = await GradePresenter.getGradeList(params);
        dataSource.value = items;
        totalNum.value = total;
      } catch (error) {
        console.log(error);
        if (error.code === 40060) {
          message.error('该学校未配置考勤规则');
        }
      } finally {
        loading.value = false;
      }
    };

    const initList = async () => {
      await getGradeHead();
      await getList();
    };

    // initList();

    watchEffect(() => {
      initList();
    });

    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

    // 切换班级时，清空编辑数据
    watch(
      () => props.courseId,
      () => {
        for (const key in editableData) {
          if (Object.prototype.hasOwnProperty.call(editableData, key)) {
            delete editableData[key];
          }
        }
        current.value = 1;
      },
      {
        immediate: true
      }
    );
    let signChange: any = 0;
    let theoryExaminationChange: any = 0;

    const saveGrade = async (data: any, key: string) => {
      let saveSuccess = true;
      try {
        const params = {
          ...data,
          courseId: props.courseId
        };
        await GradePresenter.updateGrade(params);
        message.success('成绩修改成功！');
        delete editableData[key];
        getList();
      } catch (error) {
        console.log(error);
        saveSuccess = false;
        message.error(error?.message);
      }
      return saveSuccess;
    };

    // 保存成绩
    const save = async (key: string) => {
      Object.assign(
        dataSource.value.filter(item => key === item.key)[0],
        editableData[key]
      );
      const tempdata = editableData[key];
      //如果编辑列是时间类型 需要处理值
      if (tempdata.subjectSettingListVO.length) {
        tempdata.subjectSettingListVO = tempdata.subjectSettingListVO.map(
          item => {
            // if (!item.secondVal) {
            //   item.secondVal = 0;
            // }
            // if (!item.minuteVal) {
            //   item.minuteVal = 0;
            // }

            if (!item.secondVal && item.minuteVal !== null) {
              item.secondVal = 0;
            }
            if (item.secondVal !== null && !item.minuteVal) {
              item.minuteVal = 0;
            }

            return {
              ...item,
              value:
                item.subjectType !== 'TIME'
                  ? item.value
                  : item.secondVal === null && item.minuteVal === null
                  ? null
                  : (item.minuteVal * 60 + item.secondVal) * 1000
            };
          }
        );
      }
      //如果并未修改考勤信息 考勤传null
      if (editableData[key].sign === signChange) {
        editableData[key].sign = null;
      }

      //如果并未修改理论考试成绩 理论考试值传null
      if (editableData[key].theoryExamination === theoryExaminationChange) {
        editableData[key].theoryExamination = null;
      }

      const saveSuccess = await saveGrade(editableData[key], key);
      return saveSuccess;
    };
    const cancel = (key: string) => {
      delete editableData[key];
    };

    // 编辑的时候如果有未保存的列 先提交该行数据
    const checkHasEdit = async () => {
      let NoEditingStatus = true;
      if (Object.keys(editableData).length !== 0) {
        try {
          const [key] = Object.keys(editableData);
          const saveSuccess = await save(key);

          NoEditingStatus = saveSuccess;
        } catch (error) {
          console.log(error);
        }
      }
      return NoEditingStatus;
    };

    watch(current, () => {
      if (Object.keys(editableData).length !== 0) {
        message.warning('请先保存当前页数据');
        return false;
      }
      getList();
    });

    const edit = async (key: string) => {
      // 如果保存失败则下一行不进入编辑状态
      const NoEditingStatus = await checkHasEdit();
      if (!NoEditingStatus) return;

      // 已复核或非当前学期不能进行编辑
      if (props.isApproved || !isCurrentSemester.value) return;
      editableData[key] = JSON.parse(
        JSON.stringify(dataSource.value.filter(item => key === item.key)[0])
      );
      signChange = editableData[key].sign;
      theoryExaminationChange = editableData[key].theoryExamination;
    };
    return {
      pageSize,
      current,
      totalNum,
      hasConfig,
      loading,
      dataSource,
      getList,
      initList,
      columns,
      getShowStr,
      canEditColumnKeyArr,
      subjectColumnKeyArr,
      getIndex,
      isCurrentSemester,

      subjectRuleArr,
      getRealScore,
      editingKey: '',
      editableData,
      edit,
      save,
      cancel,

      isInteger
    };
  }
});
</script>

<style lang="less" scoped>
.grade-table {
  .flex-box {
    display: flex;
    align-items: center;
  }
  .bold {
    font-weight: 600;
    // font-size: 16px;
  }
}
:deep(.ant-table-bordered .ant-table-tbody > tr > td) {
  border-right: none;
}
:deep(.ant-table-thead > tr > th) {
  border-right: none;
}
:deep(.ant-input-number-input) {
  padding: 0 5.5px;
}
:deep(.ant-input-number) {
  width: 60px;
}
:deep(.ant-table-content .ant-table-thead > tr > th) {
  padding: 6px;
}
:deep(.ant-table-content .ant-table-tbody > tr > td) {
  padding: 6px;
}
:deep(.ant-btn) {
  padding: 0;
}
:deep(.ant-table-body) {
  overflow-x: auto !important;
}
</style>
