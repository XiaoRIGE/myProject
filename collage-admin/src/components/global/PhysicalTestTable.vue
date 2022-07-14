<!--
 * @Author: srj
 * @Date: 2021-08-11 11:33:30
 * @LastEditTime: 2021-10-15 14:12:16
 * @LastEditors: Please set LastEditors
 * @Description: 体测列表
 * @FilePath: \collage-admin\src\components\global\PhysicalTestTable.vue
-->
<template>
  <a-table
    :columns="columnsResult"
    :data-source="dataSource"
    :pagination="false"
    :loading="loading"
    :scroll="{ x: 2400 }"
    bordered
  >
    <!-- 姓名 -->
    <template #name="{ text,record }">
      <div>{{ text }}({{ record.sex === 1 ? '男' : '女' }})</div>
      <div>
        {{ record.organizationUserNumber }}
      </div>
    </template>
    <!-- 年级 -->
    <template #year="{ text,record }">
      <div>
        {{ text ? `${text}级` : '-' }}
      </div>
      <div>
        {{ getUserYear(record.inputYear, record.year) }}
      </div>
    </template>
    <!-- 体测总分 -->
    <template #totalScore="{ text }">
      <div v-if="text" class="grade-box">
        <span class="point" :style="{ background: getColorByGrade(text) }" />
        <span>{{ text }}</span>
      </div>
      <span v-else>-</span>
    </template>
    <!-- bmi -->
    <template #bmi="{ text, record }">
      <span v-if="editableData[record.key]">{{ BMIval(record.key) }}</span>
      <span
        v-else
        :class="showWarn('bmi', record.showFailTagArr) ? 'warn-text' : ''"
      >
        {{ text ? text : '-' }}
      </span>
    </template>
    <!-- 可编辑列 -->
    <template
      v-for="col in [
        'height',
        'weight',
        'vitalCapacity',
        'fiftyMeters',
        'sitAndReach',
        'sitUp',
        'jump',
        'pullUp',
        'eightHundredMeters',
        'thousandMeters',
        'eightOrthousand',
        'leftEyeVision',
        'rightEyeVision'
      ]"
      #[col]="{ text, record }"
    >
      <!-- 步进器为0.1的列 -->
      <div
        v-if="
          [
            'height',
            'weight',
            'vitalCapacity',
            'fiftyMeters',
            'sitAndReach',
            'jump'
          ].includes(col)
        "
        :key="col"
      >
        <!--  :min="col === 'sitAndReach' ? -30 : 0" -->
        <a-input-number
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key][col]"
          :min="getRange('start', col)"
          :max="getRange('end', col)"
          :step="0.1"
          :precision="1"
          class="margin-6"
          @change="handleChange(col, record.key, editableData[record.key][col])"
        />
        <span
          v-else
          :class="showWarn(col, record.showFailTagArr) ? 'warn-text' : ''"
        >
          {{ text ? text : '-' }}
        </span>
      </div>
      <!-- 步进器为1的列 引体向上、仰卧起坐-->
      <div v-if="['pullUp', 'sitUp'].includes(col)" :key="col">
        <a-input-number
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key][col]"
          :min="0"
          :max="99"
          :step="1"
          :precision="0"
          class="margin-6"
          :disabled="
            (col === 'pullUp' && record.sex === 2) ||
              (col === 'sitUp' && record.sex === 1)
          "
          @change="handleChange(col, record.key, editableData[record.key][col])"
        />
        <span
          v-else
          :class="showWarn(col, record.showFailTagArr) ? 'warn-text' : ''"
        >
          {{ text ? text : '-' }}
        </span>
      </div>
      <!-- 800 || 1000米 -->
      <div
        v-if="
          ['eightHundredMeters', 'thousandMeters', 'eightOrthousand'].includes(
            col
          )
        "
        :key="col"
      >
        <template v-if="editableData[record.key]">
          <a-row class="table-editrow" :gutter="[8, 0]">
            <a-col :span="12">
              <a-input-number
                v-model:value="editableData[record.key].runMinutes"
                :min="0"
                :max="9"
                :step="1"
                class="margin-6"
                :formatter="value => `${value}分`"
                :parser="value => value.replace('分', '')"
                @change="
                  handleChange(
                    'runMinutes',
                    record.key,
                    editableData[record.key].runMinutes
                  )
                "
              />
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model:value="editableData[record.key].runSeconds"
                :min="0"
                :max="59"
                :step="1"
                class="margin-6"
                :formatter="value => `${value}秒`"
                :parser="value => value.replace('秒', '')"
                @change="
                  handleChange(
                    'runSeconds',
                    record.key,
                    editableData[record.key].runSeconds
                  )
                "
              />
            </a-col>
          </a-row>
        </template>
        <template v-else>
          <span v-if="record.runMinutes === 0 && record.runSeconds === 0">
            -
          </span>
          <span
            v-else
            :class="
              showWarn('thousandMeters', record.showFailTagArr) ||
                showWarn('eightHundredMeters', record.showFailTagArr)
                ? 'warn-text'
                : ''
            "
          >
            {{ record.runMinutes }}′{{ record.runSeconds }}″
          </span>
        </template>
      </div>
      <!-- 视力列 -->
      <div v-if="['leftEyeVision', 'rightEyeVision'].includes(col)" :key="col">
        <a-row
          v-if="editableData[record.key]"
          class="table-editrow"
          :gutter="[8, 0]"
        >
          <a-col :span="8">
            <a-input-number
              v-model:value="editableData[record.key][col].eyeVal"
              :min="3.0"
              :max="5.3"
              :step="0.1"
              :precision="1"
              class="with100 margin-6"
              @change="
                handleChange(
                  col,
                  record.key,
                  editableData[record.key][col].eyeVal
                )
              "
            />
          </a-col>
          <a-col :span="8">
            <!-- 屈光不正 -->
            <a-select
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][col].eyeAmetropia"
              class="with100 margin-6"
            >
              <a-select-option
                :value="0"
                :disabled="editableData[record.key][col].eyeVal < 5.0"
              >
                正常
              </a-select-option>
              <a-select-option
                :value="1"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                近视
              </a-select-option>
              <a-select-option
                :value="2"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                远视
              </a-select-option>
              <a-select-option
                :value="3"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                其他
              </a-select-option>
              <a-select-option :value="9">
                未测
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8">
            <!-- 串镜 -->
            <a-select
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][col].eyeStrandMirror"
              class="with100 margin-6"
            >
              <a-select-option
                :value="0"
                :disabled="editableData[record.key][col].eyeVal < 5.0"
              >
                正常
              </a-select-option>
              <a-select-option
                :value="-1"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                正↓负↑
              </a-select-option>
              <a-select-option
                :value="1"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                正↑负↓
              </a-select-option>
              <a-select-option
                :value="2"
                :disabled="editableData[record.key][col].eyeVal >= 5.0"
              >
                其他
              </a-select-option>
              <a-select-option :value="9">
                未测
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <template v-else>
          <div v-if="text.eyeVal">
            <span>{{ text.eyeVal }}</span>
            &nbsp;
            <span>{{ getEyeInfoByVal(1, text.eyeAmetropia) }}</span>
            &nbsp;
            <span>{{ getEyeInfoByVal(2, text.eyeStrandMirror) }}</span>
          </div>
          <span v-else>-</span>
        </template>
      </div>
    </template>
    <template #operation="{ record }">
      <div class="editable-row-operations">
        <span v-if="editableData[record.key]">
          <a-space :size="24">
            <!-- 根据当前学生信息完整度展示DOM -->
            <a-popconfirm
              v-if="showPopup(record.key)"
              title="未录完该学生体测数据，确认保存当前录入吗?"
              cancel-text="继续录入"
              ok-text="确定保存"
              @confirm="save(record.key)"
            >
              <a>保存</a>
            </a-popconfirm>
            <a v-else @click="save(record.key)">保存</a>
            <a-popconfirm
              title="退出后不保存当前录入，确定退出编辑状态吗?"
              @confirm="cancel(record.key)"
            >
              <a>取消</a>
            </a-popconfirm>
          </a-space>
        </span>
        <span v-else>
          <a @click="edit(record.key)">编辑</a>
        </span>
      </div>
    </template>
  </a-table>
  <a-pagination
    v-model:current="current"
    v-model:pageSize="pageSize"
    :page-size-options="pageSizeOptions"
    class="pagination"
    :pagination="{ pageSize: 100 }"
    :total="totalNum"
    show-size-changer
    show-quick-jumper
    :show-total="total => `共 ${total} 条`"
    @showSizeChange="onShowSizeChange"
    @change="onChange"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  watch,
  watchEffect
} from 'vue';
import { getColorByGrade, getEyeInfoByVal, debounced } from '@/utils/common';
import { message, Modal, notification } from 'ant-design-vue';
import { PhysicalTestPresenter } from '@/request/api/presenter/physical';
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left',
    width: 120,
    slots: { customRender: 'name' }
  },
  {
    title: '年级',
    dataIndex: 'year',
    fixed: 'left',
    width: 90,
    slots: { customRender: 'year' }
  },
  {
    title: '体测总分',
    dataIndex: 'totalScore',
    fixed: 'left',
    width: 90,
    slots: { customRender: 'totalScore' }
  },
  {
    title: 'BMI',
    dataIndex: 'bmi',
    slots: { customRender: 'bmi' }
  },
  {
    title: '身高(cm)',
    dataIndex: 'height',
    slots: { customRender: 'height' }
  },
  {
    title: '体重(kg)',
    dataIndex: 'weight',
    slots: { customRender: 'weight' }
  },

  {
    title: '肺活量(ml)',
    dataIndex: 'vitalCapacity',
    slots: { customRender: 'vitalCapacity' }
  },
  {
    title: '50米(秒)',
    dataIndex: 'fiftyMeters',
    slots: { customRender: 'fiftyMeters' }
  },
  {
    title: '坐位体前屈(cm)',
    dataIndex: 'sitAndReach',
    slots: { customRender: 'sitAndReach' }
  },
  {
    title: '立定跳远(cm)',
    dataIndex: 'jump',
    slots: { customRender: 'jump' }
  },
  {
    title: '引体向上(次)',
    dataIndex: 'pullUp',
    slots: { customRender: 'pullUp' },
    forSex: 1
  },
  {
    title: '仰卧起坐(次)',
    dataIndex: 'sitUp',
    slots: { customRender: 'sitUp' },
    forSex: 2
  },
  {
    title: '800/1000米(分′秒″)',
    dataIndex: 'eightOrthousand',
    width: 220,
    slots: { customRender: 'eightOrthousand' },
    forSex: 0
  },
  {
    title: '800米(分′秒″)',
    dataIndex: 'eightHundredMeters',
    width: 220,
    slots: { customRender: 'eightHundredMeters' },
    forSex: 2
  },
  {
    title: '1000米(分′秒″)',
    dataIndex: 'thousandMeters',
    width: 220,
    slots: { customRender: 'thousandMeters' },
    forSex: 1
  },
  {
    title: '左眼视力',
    dataIndex: 'leftEyeVision',
    width: '15%',
    slots: { customRender: 'leftEyeVision' }
  },
  {
    title: '右眼视力',
    dataIndex: 'rightEyeVision',
    width: '15%',
    slots: { customRender: 'rightEyeVision' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 150,
    slots: { customRender: 'operation' }
  }
];
interface EyeInfo {
  eyeVal: number;
  eyeAmetropia: number;
  eyeStrandMirror: number;
}
interface DataItem {
  key: string;
  sex: number;
  name: string;
  year: string;
  totalScore: number;
  weight: number | undefined;
  height: number | undefined;
  vitalCapacity: number | undefined; //肺活量
  bmi: number | undefined;
  fiftyMeters: number | undefined;
  sitAndReach: number | undefined; //坐位体前屈
  sitUp: number | undefined; //仰卧起坐
  jump: number | undefined; //立定跳远
  pullUp: number | undefined; //引体向上
  runMinutes: number | undefined; //跑步分钟 (800/1000)
  runSeconds: number | undefined; //跑步秒
  leftEyeVision: EyeInfo;
  rightEyeVision: EyeInfo;
}
type ItemType =
  | 'weight'
  | 'height'
  | 'vitalCapacity'
  | 'bmi'
  | 'fiftyMeters'
  | 'sitAndReach'
  | 'sitUp'
  | 'jump'
  | 'pullUp'
  | 'runMinutes'
  | 'runSeconds'
  | 'leftEyeVision'
  | 'rightEyeVision';

export default defineComponent({
  props: {
    // 性别  2:女 1：男 0：全部
    sex: {
      type: Number,
      default: 0
    },
    // 列表数据
    listData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    inputYear: {
      type: Number,
      default: null
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  emits: ['refresh-list'],
  setup(props, { emit }) {
    // 分页
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const totalNum = ref<number>(0);
    const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50']);
    const onShowSizeChange = (currentVal: number, pageSizeVal: number) => {
      current.value = currentVal;
      pageSize.value = pageSizeVal;
    };
    const onChange = (pageNumber: number) => {
      current.value = pageNumber;
    };
    watch([pageSize, current], () => {
      emit('refresh-list', {
        pageSize: pageSize.value,
        current: current.value
      });
    });

    const columnsResult = ref<any[]>([]);
    // 根据性别展示不同列
    const getColumn = () => {
      columnsResult.value = columns.filter((item: any) => {
        if (props.sex === 0) {
          return (
            item.dataIndex !== 'eightHundredMeters' &&
            item.dataIndex !== 'thousandMeters'
          );
        }
        return item.forSex === undefined || item.forSex === props.sex;
      });
    };

    getColumn();

    // 切换性别 重新生成列
    watch(
      () => props.sex,
      () => {
        getColumn();
      }
    );

    // const dataSource = ref<any>(data);//列表数据
    const dataSource = ref<any>([]); //列表数据
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

    watchEffect(() => {
      totalNum.value = props.listData.total;
      current.value = props.currentPage;
      dataSource.value = props.listData.items;
    });

    // 各项有效范围配置
    const EffectiveRange: any = {
      vitalCapacity: {
        name: '肺活量',
        range: [500, 9999]
      },
      fiftyMeters: {
        name: '50米',
        range: [5, 20]
      },
      sitAndReach: {
        name: '坐位体前屈',
        range: [-30, 40]
      },
      jump: {
        name: '立定跳远',
        range: [50, 400]
      },
      pullUp: {
        name: '引体向上',
        range: [0, 99]
      },
      sitUp: {
        name: '仰卧起坐',
        range: [0, 99]
      }
    };

    /**
     * @description: 根据key获取最大值和最小值
     * @param {string} type start最小值 end最大值
     * @param {string} key
     * @return {*}
     */
    const getRange = (type: string, key: string) => {
      if (Reflect.has(EffectiveRange, key)) {
        if (type === 'start') {
          return EffectiveRange[key].range[0];
        } else {
          return EffectiveRange[key].range[1];
        }
      }
      if (type === 'start') {
        return -Infinity;
      } else {
        return Infinity;
      }
    };

    /**
     * @description: 配置单项有效区间，错误时文案提示
     * @param {string} colName 校验列
     * @param {string} val 校验值
     */
    const getWarnMessageByItem = debounced((colName: ItemType, val: number) => {
      // 1000/800校验
      if (['runMinutes', 'runSeconds'].includes(colName)) {
        if (colName === 'runMinutes' && (val > 9 || val < 2)) {
          notification.warning({
            message: '输入值不合理',
            description:
              '800米/1000米分钟数应该输入在2~9之间的数值，请重新输入！'
          });
        }
        if (colName === 'runSeconds' && (val > 59 || val < 0)) {
          notification.warning({
            message: '输入值不合理',
            description:
              '800米/1000米秒数应该输入在0~59之间的数值，请重新输入！'
          });
        }
      } else {
        // 其他项校验
        Object.keys(EffectiveRange).forEach((item: any) => {
          const temp = EffectiveRange[item];
          if (
            item === colName &&
            (val > temp.range[1] || val < temp.range[0])
          ) {
            notification.warning({
              message: '输入值不合理',
              description: `【${temp.name}】应该输入在【${temp.range[0]}~${temp.range[1]}】之间的数值，请重新输入！`
            });
          }
        });
      }
    }, 1000);

    // 输入成绩校验
    const handleChange = (col: ItemType, key: number, val: number) => {
      if (!val && val !== 0) return; //空值不校验

      // 检查值是否在有效范围
      getWarnMessageByItem(col, val);

      // 视力列 结构特殊处理
      if (col === 'leftEyeVision' || col === 'rightEyeVision') {
        /**
         * 串镜和屈光不正联动
         * 视力5.0以下不能选择正常，5.0以上只能选择正常、未测
         */
        if (editableData[key][col].eyeVal >= 5.0) {
          editableData[key][col].eyeAmetropia = 0;
          editableData[key][col].eyeStrandMirror = 0;
        } else {
          editableData[key][col].eyeAmetropia = 1;
          editableData[key][col].eyeStrandMirror = 9;
        }
      }
    };

    /**
     * @description: 根据录入年和学生年级算学生属于大几
     */
    const getUserYear = computed(() => {
      return (inputYear = 0, year = 0) => {
        if (!inputYear && !year) {
          return '';
        }
        const temp = inputYear - year;
        if (temp <= 0) {
          return '录入大一';
        } else if (temp === 1) {
          return '录入大二';
        } else if (temp === 2) {
          return '录入大三';
        } else if (temp >= 3) {
          return '录入大四';
        }
      };
    });

    // BMI计算方法
    const BMIval = computed(() => {
      return (key: string) => {
        const currentItemData: any = editableData[key];
        // 没有身高和体重信息
        if (!currentItemData.height && !currentItemData.weight) {
          return 0;
        }
        const height = currentItemData.height / 100;
        const { weight } = currentItemData;
        const bmi = weight / (height * height);
        return Number(bmi.toFixed(2));
      };
    });

    /**
     * @description: 校验是否有项为空值
     * @param {string} key 当前编辑项的key
     * @return {Boolean}
     */
    const showPopup = computed(() => {
      return (key: string) => {
        const currentItemData: any = editableData[key];
        let hasEmpty = false;
        for (const key in currentItemData) {
          if (Object.prototype.hasOwnProperty.call(currentItemData, key)) {
            const element = currentItemData[key];

            // 男生不校验仰卧起坐 女生不校验引体向上
            if (
              (key === 'sitUp' && currentItemData.sex === 2 && !element) ||
              (key === 'pullUp' && currentItemData.sex === 1 && !element)
            ) {
              // console.log('为空的项', key);
              hasEmpty = true;
            }
            // 视力列空值判断
            if (
              (key === 'leftEyeVision' || key === 'rightEyeVision') &&
              !element?.eyeVal
            ) {
              // console.log('为空的项', key);
              hasEmpty = true;
            }
            if (
              !element &&
              key !== 'sex' &&
              key !== 'bmi' &&
              key !== 'runSeconds' &&
              key !== 'totalScore' &&
              key !== 'sitUp' &&
              key !== 'pullUp'
            ) {
              // console.log('为空的项', key);
              hasEmpty = true;
            }
          }
        }
        return hasEmpty;
      };
    });

    // 校验目标数组中是否包含某key
    const showWarn = (key: string, arr: string[]) => {
      return arr.includes(key);
    };

    const edit = (key: string) => {
      editableData[key] = JSON.parse(
        JSON.stringify(
          dataSource.value.filter((item: any) => key === item.key)[0]
        )
      );
    };

    const editPhysical = async (params: any, key: string) => {
      try {
        await PhysicalTestPresenter.edit(params);
        message.success('修改成功');
        delete editableData[key];
        emit('refresh-list', {
          pageSize: pageSize.value,
          current: current.value
        });
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '删除失败',
          content: error?.message
        });
      }
    };

    const save = (key: string) => {
      editableData[key].bmi = BMIval.value(key);

      const currentItemInfo = editableData[key];
      const leftEyeVisionInfo = currentItemInfo.leftEyeVision; //左眼视力
      const rightEyeVisionInfo = currentItemInfo.rightEyeVision; //右眼视力
      let Minutes = 0;
      let Seconds = 0;
      if (currentItemInfo.runMinutes) {
        Minutes = currentItemInfo.runMinutes;
      }
      if (currentItemInfo.runSeconds) {
        Seconds = currentItemInfo.runSeconds;
      }
      const runTime = Minutes * 60 + Seconds; //跑步时间s

      const params = {
        sex: currentItemInfo.sex,
        userId: currentItemInfo.key,
        year: parseInt(currentItemInfo.year),
        inputYear: props.inputYear,
        eyeInfo: {
          leftEyeAmetropia: leftEyeVisionInfo.eyeAmetropia,
          leftEyeStrandMirror: leftEyeVisionInfo.eyeStrandMirror,
          leftEyeVision: leftEyeVisionInfo.eyeVal,
          rightEyeAmetropia: rightEyeVisionInfo.eyeAmetropia,
          rightEyeStrandMirror: rightEyeVisionInfo.eyeStrandMirror,
          rightEyeVision: rightEyeVisionInfo.eyeVal
        },
        fitnessInfo: {
          eightHundredMeters: currentItemInfo.sex === 2 ? runTime : 0,
          thousandMeters: currentItemInfo.sex === 1 ? runTime : 0,
          fiftyMeters: currentItemInfo.fiftyMeters,
          height: currentItemInfo.height,
          jump: currentItemInfo.jump,
          pullUp: currentItemInfo.pullUp,
          sitAndReach: currentItemInfo.sitAndReach,
          sitUp: currentItemInfo.sitUp,
          vitalCapacity: currentItemInfo.vitalCapacity,
          weight: currentItemInfo.weight
        }
      };

      editPhysical(params, key);
    };
    const cancel = (key: string) => {
      delete editableData[key];
    };

    return {
      dataSource,
      columns,
      columnsResult,
      editableData,
      BMIval,
      showPopup,
      pageSize,
      current,
      totalNum,
      pageSizeOptions,
      getRange,
      onChange,
      onShowSizeChange,
      handleChange,
      edit,
      save,
      cancel,
      getColorByGrade,
      getEyeInfoByVal,
      getUserYear,
      showWarn
    };
  }
});
</script>

<style lang="less" scoped>
.table-editrow {
  :deep(.with100) {
    width: 100%;
  }
  :deep(.margin-6) {
    margin: -6px 0;
  }
}
.margin-6 {
  margin: -6px 0;
}
.grade-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .point {
    margin-right: 4px;
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
}
</style>
