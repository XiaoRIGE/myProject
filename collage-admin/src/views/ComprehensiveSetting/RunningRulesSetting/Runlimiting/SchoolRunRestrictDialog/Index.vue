<template>
  <a-modal
    v-model:visible="showVisible"
    centered
    :mask-closable="false"
    :closable="false"
    width="900px"
    @ok="saveAppDialog"
    @cancel="closeAppDialog"
  >
    <div class="run_function">
      <div class="dialog_header">
        编辑校区跑步限制与目标设置
      </div>
      <div class="dialog_semester">
        学年：
        <span>
          {{ newAddRunLimitSettingSameList.data.year }}&nbsp;&nbsp;&nbsp;
        </span>
        学期：
        <span>{{ newAddRunLimitSettingSameList.data.semester }}</span>
      </div>
      <a-form
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="性别" :wrapper-col="{ span: 6, offset: 0.5 }">
          <a-select
            v-model:value="schoolUpdateData.data.gender"
            placeholder="请选择"
          >
            <a-select-option value="男女一致" @click="menSame">
              男女一致
            </a-select-option>
            <a-select-option value="男女不同" @click="noMenSame">
              男女不同
            </a-select-option>
          </a-select>
        </a-form-item>
        <div v-if="isSameMen === true">
          <a-form-item label="平均配速范围">
            <a-time-picker
              v-model:value="
                newAddRunLimitSettingSameList.data.averageSpeedStart
              "
              placeholder="请选择"
              value-format="mm:ss"
              format="mm:ss"
            />
            -
            <a-time-picker
              v-model:value="newAddRunLimitSettingSameList.data.averageSpeedEnd"
              placeholder="请选择"
              value-format="mm:ss"
              format="mm:ss"
            />
            /KM
          </a-form-item>
          <a-form-item label="平均步频">
            <a-input-number
              v-model:value="
                newAddRunLimitSettingSameList.data.averageCadenceStart
              "
              :min="0"
              :max="999"
              @change="averageCadenChange"
            />
            -
            <a-input-number
              v-model:value="
                newAddRunLimitSettingSameList.data.averageCadenceEnd
              "
              :min="0"
              :max="999"
              @change="averageCadenChange"
            />
            SPM
          </a-form-item>
          <a-form-item v-if="isMileageMessage === '段数'" label="每段有效里程">
            <a-input-number
              v-model:value="
                newAddRunLimitSettingSameList.data.effectiveParagraphMileage
              "
              :min="1"
              :max="999"
            />
            KM
          </a-form-item>
          <a-form-item
            :label="
              isMileageMessage === '里程' ? '每次有效里程范围' : '每次有效段数'
            "
          >
            <a-input-number
              v-if="isMileageMessage === '里程'"
              v-model:value="
                newAddRunLimitSettingSameList.data.effectiveMileageStart
              "
              :min="1"
              :max="99"
              @change="averageCadenChange"
            />
            <a-input-number
              v-else
              v-model:value="
                newAddRunLimitSettingSameList.data.effectiveParagraphStart
              "
              :min="1"
              :max="99"
              @change="averageCadenChange"
            />
            -
            <a-input-number
              v-if="isMileageMessage === '里程'"
              v-model:value="
                newAddRunLimitSettingSameList.data.effectiveMileageEnd
              "
              :min="1"
              :max="99"
              @change="averageCadenChange"
            />
            <a-input-number
              v-else
              v-model:value="
                newAddRunLimitSettingSameList.data.effectiveParagraphEnd
              "
              :min="1"
              :max="99"
              @change="averageCadenChange"
            />
            <span v-if="isMileageMessage === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`每日${isMileageMessage}上限`">
            <a-input-number
              v-if="isMileageMessage === '里程'"
              v-model:value="newAddRunLimitSettingSameList.data.dailyMileage"
              :min="1"
              :max="999"
            />
            <a-input-number
              v-else
              v-model:value="newAddRunLimitSettingSameList.data.dailyParagraph"
              :min="1"
              :max="999"
            />
            <span v-if="isMileageMessage === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`每周${isMileageMessage}上限`">
            <a-input-number
              v-if="isMileageMessage === '里程'"
              v-model:value="newAddRunLimitSettingSameList.data.weeklyMileage"
              :min="1"
              :max="999"
            />
            <a-input-number
              v-else
              v-model:value="newAddRunLimitSettingSameList.data.weeklyParagraph"
              :min="1"
              :max="999"
            />
            <span v-if="isMileageMessage === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`学期${isMileageMessage}上限`">
            <a-input-number
              v-if="isMileageMessage === '里程'"
              v-model:value="newAddRunLimitSettingSameList.data.semesterMileage"
              :min="1"
              :max="9999"
            />
            <a-input-number
              v-else
              v-model:value="
                newAddRunLimitSettingSameList.data.semesterParagraph
              "
              :min="1"
              :max="9999"
            />
            <span v-if="isMileageMessage === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
        </div>

        <div v-if="isSameMen === false" style="display:flex">
          <div class="gender_men">
            <div class="gender">
              男生
            </div>
            <a-form-item label="平均配速范围">
              <a-time-picker
                v-model:value="newAddRunLimitSettingList.men.averageSpeedStart"
                value-format="mm:ss"
                format="mm:ss"
              />
              -
              <a-time-picker
                v-model:value="newAddRunLimitSettingList.men.averageSpeedEnd"
                value-format="mm:ss"
                format="mm:ss"
              />
              /KM
            </a-form-item>
            <a-form-item label="平均步频">
              <a-input-number
                v-model:value="
                  newAddRunLimitSettingList.men.averageCadenceStart
                "
                :min="0"
                :max="999"
                @change="averageCadenChange"
              />
              -
              <a-input-number
                v-model:value="newAddRunLimitSettingList.men.averageCadenceEnd"
                :min="0"
                :max="999"
                @change="averageCadenChange"
              />
              SPM
            </a-form-item>
            <a-form-item
              v-if="isMileageMessage === '段数'"
              label="每段有效里程"
            >
              <a-input-number
                v-model:value="
                  newAddRunLimitSettingList.men.effectiveParagraphMileage
                "
                :min="1"
                :max="99"
              />
              KM
            </a-form-item>
            <a-form-item
              :label="
                isMileageMessage === '里程'
                  ? '每次有效里程范围'
                  : '每次有效段数'
              "
            >
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="
                  newAddRunLimitSettingList.men.effectiveMileageStart
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <a-input-number
                v-else
                v-model:value="
                  newAddRunLimitSettingList.men.effectiveParagraphStart
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              -
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="
                  newAddRunLimitSettingList.men.effectiveMileageEnd
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <a-input-number
                v-else
                v-model:value="
                  newAddRunLimitSettingList.men.effectiveParagraphEnd
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每日${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.men.dailyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newAddRunLimitSettingList.men.dailyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每周${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.men.weeklyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newAddRunLimitSettingList.men.weeklyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`学期${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.men.semesterMileage"
                :min="1"
                :max="9999"
              />
              <a-input-number
                v-else
                v-model:value="newAddRunLimitSettingList.men.semesterParagraph"
                :min="1"
                :max="9999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
          </div>
          <div class="gender_women">
            <div class="gender">
              女生
            </div>
            <a-form-item label="平均配速范围">
              <a-time-picker
                v-model:value="
                  newAddRunLimitSettingList.women.averageSpeedStart
                "
                value-format="mm:ss"
                format="mm:ss"
              />
              -
              <a-time-picker
                v-model:value="newAddRunLimitSettingList.women.averageSpeedEnd"
                value-format="mm:ss"
                format="mm:ss"
              />
              /KM
            </a-form-item>
            <a-form-item label="平均步频">
              <a-input-number
                v-model:value="
                  newAddRunLimitSettingList.women.averageCadenceStart
                "
                :min="0"
                :max="999"
                @change="averageCadenChange"
              />
              -
              <a-input-number
                v-model:value="
                  newAddRunLimitSettingList.women.averageCadenceEnd
                "
                :min="0"
                :max="999"
                @change="averageCadenChange"
              />
              SPM
            </a-form-item>
            <a-form-item
              v-if="isMileageMessage === '段数'"
              label="每段有效里程"
            >
              <a-input-number
                v-model:value="
                  newAddRunLimitSettingList.women.effectiveParagraphMileage
                "
                :min="1"
                :max="99"
              />
              KM
            </a-form-item>
            <a-form-item
              :label="
                isMileageMessage === '里程'
                  ? '每次有效里程范围'
                  : '每次有效段数'
              "
            >
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="
                  newAddRunLimitSettingList.women.effectiveMileageStart
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <a-input-number
                v-else
                v-model:value="
                  newAddRunLimitSettingList.women.effectiveParagraphStart
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              -
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="
                  newAddRunLimitSettingList.women.effectiveMileageEnd
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <a-input-number
                v-else
                v-model:value="
                  newAddRunLimitSettingList.women.effectiveParagraphEnd
                "
                :min="1"
                :max="99"
                @change="averageCadenChange"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每日${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.women.dailyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newAddRunLimitSettingList.women.dailyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每周${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.women.weeklyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newAddRunLimitSettingList.women.weeklyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`学期${isMileageMessage}上限`">
              <a-input-number
                v-if="isMileageMessage === '里程'"
                v-model:value="newAddRunLimitSettingList.women.semesterMileage"
                :min="1"
                :max="9999"
              />
              <a-input-number
                v-else
                v-model:value="
                  newAddRunLimitSettingList.women.semesterParagraph
                "
                :min="1"
                :max="9999"
              />
              <span v-if="isMileageMessage === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
          </div>
        </div>
      </a-form>
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
  UnwrapRef,
  watch
} from 'vue';
import { SchoolRunAstrictTargetSettingsServicePresenter } from '@/request/api/presenter/runSettings';
import { message } from 'ant-design-vue';
interface FormState {
  name: string;
  region: string | undefined;
  date1: Moment | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
}
export default defineComponent({
  props: {
    closeAppVisible: {
      type: Boolean
    },
    whoClick: {
      type: String,
      default: ''
    },
    isMileageMessage: {
      type: String,
      default: ''
    },
    formDataList: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['change-visible', 'update-success'],

  setup(props, { emit }) {
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: ''
    });
    const schoolUpdateData = reactive({
      data: {
        gender: '男女一致'
      }
    });

    const newAddRunLimitSettingList = reactive({
      men: {
        averageCadenceEnd: 300,
        averageCadenceStart: 0,
        averageSpeedEnd: '11:30',
        averageSpeedStart: '03:30',
        dailyMileage: 5,
        dailyParagraph: 2,
        effectiveMileageEnd: 5,
        effectiveMileageStart: 2,
        effectiveParagraphEnd: 2,
        effectiveParagraphMileage: 5,
        effectiveParagraphStart: 1,
        gender: '',
        id: '',
        limitGoalsInfoId: '',
        semester: '',
        semesterMileage: 60,
        semesterParagraph: 40,
        sex: 1,
        sexStr: '男',
        weeklyMileage: 25,
        weeklyParagraph: 12,
        year: ''
      },
      women: {
        averageCadenceEnd: 300,
        averageCadenceStart: 0,
        averageSpeedEnd: '11:30',
        averageSpeedStart: '03:30',
        dailyMileage: 5,
        dailyParagraph: 2,
        effectiveMileageEnd: 5,
        effectiveMileageStart: 2,
        effectiveParagraphEnd: 2,
        effectiveParagraphMileage: 5,
        effectiveParagraphStart: 1,
        gender: '',
        id: '',
        limitGoalsInfoId: '',
        semester: '',
        semesterMileage: 60,
        semesterParagraph: 40,
        sex: 1,
        sexStr: '男',
        weeklyMileage: 25,
        weeklyParagraph: 12,
        year: ''
      }
    });

    const newAddRunLimitSettingSameList = reactive({
      data: {
        averageCadenceEnd: 300,
        averageCadenceStart: 0,
        averageSpeedEnd: '11:30',
        averageSpeedStart: '03:30',
        dailyMileage: 5,
        dailyParagraph: 2,
        effectiveMileageEnd: 5,
        effectiveMileageStart: 2,
        effectiveParagraphEnd: 2,
        effectiveParagraphMileage: 5,
        effectiveParagraphStart: 1,
        gender: '',
        id: '',
        limitGoalsInfoId: '',
        semester: '',
        semesterMileage: 60,
        semesterParagraph: 40,
        sex: 1,
        sexStr: '男',
        weeklyMileage: 25,
        weeklyParagraph: 12,
        year: ''
      }
    });

    const setDataValue = (setValue: any, number: any) => {
      return setValue === null ? number : setValue;
    };

    watch(
      () => props.formDataList,
      () => {
        const updateMen = newAddRunLimitSettingList.men;
        const upWoMen = newAddRunLimitSettingList.women;
        const propMenList = props.formDataList;
        newAddRunLimitSettingSameList.data.limitGoalsInfoId =
          props.formDataList.limitGoalsInfoId;
        if (JSON.stringify(props.formDataList.elsePeople) === '{}') {
          //判断数据是否是男女不同 如果是男女一致执行
          const isNull = newAddRunLimitSettingSameList.data;
          isNull.year = propMenList.year;
          isNull.semester = propMenList.semester;
          //平均步频下
          isNull.averageCadenceEnd = setDataValue(
            propMenList.averageCadenceEnd,
            300
          );
          //平均步频上
          isNull.averageCadenceStart = setDataValue(
            propMenList.averageCadenceStart,
            0
          );
          // 平均配速上
          if (propMenList.averageSpeedStart === 'Invalid date') {
            isNull.averageSpeedStart = '03:30';
          } else {
            isNull.averageSpeedStart = propMenList.averageSpeedStart;
          }
          // 平均配速下
          if (propMenList.averageSpeedEnd === 'Invalid date') {
            isNull.averageSpeedEnd = '03:30';
          } else {
            isNull.averageSpeedEnd = propMenList.averageSpeedEnd;
          }
          //每次有效里程范围上
          isNull.effectiveMileageStart = setDataValue(
            propMenList.effectiveMileageStart,
            2
          );
          //每次有效里程范围下
          isNull.effectiveMileageEnd = setDataValue(
            propMenList.effectiveMileageEnd,
            5
          );
          //每日里程上限
          isNull.dailyMileage = setDataValue(propMenList.dailyMileage, 5);
          //每周里程上限
          isNull.weeklyMileage = setDataValue(propMenList.weeklyMileage, 25);
          //学期目标里程
          isNull.semesterMileage = setDataValue(
            propMenList.semesterMileage,
            60
          );
          //每段有效里程
          isNull.effectiveParagraphMileage = setDataValue(
            propMenList.effectiveParagraphMileage,
            5
          );
          //每次有效段数上
          isNull.effectiveParagraphStart = setDataValue(
            propMenList.effectiveParagraphStart,
            1
          );
          //每次有效段数下
          isNull.effectiveParagraphEnd = setDataValue(
            propMenList.effectiveParagraphEnd,
            2
          );
          //每日段数上限
          isNull.dailyParagraph = setDataValue(propMenList.dailyParagraph, 2);
          //每周段数上限
          isNull.weeklyParagraph = setDataValue(
            propMenList.weeklyParagraph,
            12
          );
          //学期段数上限
          isNull.semesterParagraph = setDataValue(
            propMenList.semesterParagraph,
            40
          );

          (newAddRunLimitSettingList.men = {
            averageCadenceEnd: 300,
            averageCadenceStart: 0,
            averageSpeedEnd: '11:30',
            averageSpeedStart: '03:30',
            dailyMileage: 5,
            dailyParagraph: 2,
            effectiveMileageEnd: 5,
            effectiveMileageStart: 2,
            effectiveParagraphEnd: 2,
            effectiveParagraphMileage: 5,
            effectiveParagraphStart: 1,
            gender: '',
            id: '',
            limitGoalsInfoId: '',
            semester: '',
            semesterMileage: 60,
            semesterParagraph: 40,
            sex: 1,
            sexStr: '男',
            weeklyMileage: 25,
            weeklyParagraph: 12,
            year: ''
          }),
            (newAddRunLimitSettingList.women = {
              averageCadenceEnd: 300,
              averageCadenceStart: 0,
              averageSpeedEnd: '11:30',
              averageSpeedStart: '03:30',
              dailyMileage: 5,
              dailyParagraph: 2,
              effectiveMileageEnd: 5,
              effectiveMileageStart: 2,
              effectiveParagraphEnd: 2,
              effectiveParagraphMileage: 5,
              effectiveParagraphStart: 1,
              gender: '',
              id: '',
              limitGoalsInfoId: '',
              semester: '',
              semesterMileage: 60,
              semesterParagraph: 40,
              sex: 1,
              sexStr: '男',
              weeklyMileage: 25,
              weeklyParagraph: 12,
              year: ''
            });
        } else {
          newAddRunLimitSettingSameList.data.year = propMenList.year;
          newAddRunLimitSettingSameList.data.semester = propMenList.semester;
          if (props.formDataList.gender === '男') {
            //判断男列表中数据为null给默认值
            newAddRunLimitSettingList.women = propMenList.elsePeople;
            const upWoMen = newAddRunLimitSettingList.women;
            updateMen.averageCadenceEnd = setDataValue(
              propMenList.averageCadenceEnd,
              300
            );
            updateMen.averageCadenceStart = setDataValue(
              propMenList.averageCadenceStart,
              0
            );
            updateMen.averageSpeedEnd =
              propMenList.averageSpeedEnd === 'Invalid date'
                ? '11:30'
                : propMenList.averageSpeedEnd;
            updateMen.averageSpeedStart =
              propMenList.averageSpeedStart === 'Invalid date'
                ? '03:30'
                : propMenList.averageSpeedStart;
            updateMen.dailyMileage = setDataValue(propMenList.dailyMileage, 5);
            updateMen.dailyParagraph = setDataValue(
              propMenList.dailyParagraph,
              2
            );
            updateMen.effectiveMileageEnd = setDataValue(
              propMenList.effectiveMileageEnd,
              5
            );
            updateMen.effectiveMileageStart = setDataValue(
              propMenList.effectiveMileageStart,
              2
            );
            updateMen.effectiveParagraphEnd = setDataValue(
              propMenList.effectiveParagraphEnd,
              2
            );
            updateMen.effectiveParagraphMileage = setDataValue(
              propMenList.effectiveParagraphMileage,
              5
            );
            updateMen.effectiveParagraphStart = setDataValue(
              propMenList.effectiveParagraphStart,
              1
            );
            updateMen.gender = propMenList.gender;
            updateMen.id = propMenList.id;
            updateMen.limitGoalsInfoId = propMenList.limitGoalsInfoId;
            updateMen.semester = propMenList.semester;

            updateMen.semesterMileage = setDataValue(
              propMenList.semesterMileage,
              60
            );
            updateMen.semesterParagraph = setDataValue(
              propMenList.semesterParagraph,
              40
            );

            updateMen.sex = propMenList.sex;
            updateMen.sexStr = propMenList.sexStr;

            updateMen.weeklyMileage = setDataValue(
              propMenList.weeklyMileage,
              25
            );
            updateMen.weeklyParagraph = setDataValue(
              propMenList.weeklyParagraph,
              12
            );
            updateMen.year = propMenList.year;
            //判断女列表中值为null 给默认值
            const womenElse = propMenList.elsePeople;
            upWoMen.averageCadenceEnd = setDataValue(
              womenElse.averageCadenceEnd,
              300
            );
            upWoMen.averageCadenceStart = setDataValue(
              womenElse.averageCadenceStart,
              0
            );

            newAddRunLimitSettingList.women.averageSpeedEnd =
              propMenList.elsePeople.averageSpeedEnd === 'Invalid date'
                ? '11:30'
                : propMenList.elsePeople.averageSpeedEnd;
            newAddRunLimitSettingList.women.averageSpeedStart =
              propMenList.elsePeople.averageSpeedStart === 'Invalid date'
                ? '03:30'
                : propMenList.elsePeople.averageSpeedStart;

            upWoMen.dailyMileage = setDataValue(womenElse.dailyMileage, 0);
            upWoMen.dailyParagraph = setDataValue(womenElse.dailyParagraph, 2);
            upWoMen.effectiveMileageEnd = setDataValue(
              womenElse.effectiveMileageEnd,
              5
            );
            upWoMen.effectiveMileageStart = setDataValue(
              womenElse.effectiveMileageStart,
              2
            );
            upWoMen.effectiveParagraphEnd = setDataValue(
              womenElse.effectiveParagraphEnd,
              2
            );
            upWoMen.effectiveParagraphMileage = setDataValue(
              womenElse.effectiveParagraphMileage,
              5
            );
            upWoMen.effectiveParagraphStart = setDataValue(
              womenElse.effectiveParagraphStart,
              1
            );
            upWoMen.gender = womenElse.gender;
            upWoMen.id = womenElse.id;
            upWoMen.limitGoalsInfoId = womenElse.limitGoalsInfoId;
            upWoMen.semester = womenElse.semester;
            upWoMen.semesterMileage = setDataValue(
              womenElse.semesterMileage,
              60
            );
            upWoMen.semesterParagraph = setDataValue(
              womenElse.semesterParagraph,
              40
            );
            upWoMen.sex = womenElse.sex;
            upWoMen.sexStr = womenElse.sexStr;
            upWoMen.weeklyMileage = setDataValue(womenElse.weeklyMileage, 25);
            upWoMen.weeklyParagraph = setDataValue(
              womenElse.weeklyParagraph,
              12
            );
            upWoMen.year = womenElse.year;
          } else {
            newAddRunLimitSettingList.men = propMenList.elsePeople;
            const upMen = newAddRunLimitSettingList.men;

            upWoMen.averageCadenceEnd =
              propMenList.averageCadenceEnd === null
                ? 300
                : propMenList.averageCadenceEnd;
            upWoMen.averageCadenceStart =
              propMenList.averageCadenceStart === null
                ? 0
                : propMenList.averageCadenceStart;
            upWoMen.averageSpeedEnd =
              propMenList.averageSpeedEnd === 'Invalid date'
                ? '11:30'
                : propMenList.averageSpeedEnd;
            upWoMen.averageSpeedStart =
              propMenList.averageSpeedStart === 'Invalid date'
                ? '03:30'
                : propMenList.averageSpeedStart;
            upWoMen.dailyMileage =
              propMenList.dailyMileage === null ? 5 : propMenList.dailyMileage;
            upWoMen.dailyParagraph =
              propMenList.dailyParagraph === null
                ? 2
                : propMenList.dailyParagraph;
            upWoMen.effectiveMileageEnd =
              propMenList.effectiveMileageEnd === null
                ? 5
                : propMenList.effectiveMileageEnd;
            upWoMen.effectiveMileageStart =
              propMenList.effectiveMileageStart === null
                ? 2
                : propMenList.effectiveMileageStart;
            upWoMen.effectiveParagraphEnd =
              propMenList.effectiveParagraphEnd === null
                ? 2
                : propMenList.effectiveParagraphEnd;
            upWoMen.effectiveParagraphMileage =
              propMenList.effectiveParagraphMileage === null
                ? 5
                : propMenList.effectiveParagraphMileage;
            upWoMen.effectiveParagraphStart =
              propMenList.effectiveParagraphStart === null
                ? 1
                : propMenList.effectiveParagraphStart;
            upWoMen.gender = propMenList.gender;
            upWoMen.id = propMenList.id;
            upWoMen.limitGoalsInfoId = propMenList.limitGoalsInfoId;
            upWoMen.semester = propMenList.semester;
            upWoMen.semesterMileage =
              propMenList.semesterMileage === null
                ? 60
                : propMenList.semesterMileage;
            upWoMen.semesterParagraph =
              propMenList.semesterParagraph === null
                ? 40
                : propMenList.semesterParagraph;
            upWoMen.sex = propMenList.sex;
            upWoMen.sexStr = propMenList.sexStr;
            upWoMen.weeklyMileage =
              propMenList.weeklyMileage === null
                ? 25
                : propMenList.weeklyMileage;
            upWoMen.weeklyParagraph =
              propMenList.weeklyParagraph === null
                ? 12
                : propMenList.weeklyParagraph;
            upWoMen.year = propMenList.year;

            //判断男列表中值为null 给默认值
            const meElse = propMenList.elsePeople;
            upMen.averageCadenceEnd = setDataValue(
              meElse.averageCadenceEnd,
              300
            );
            upMen.averageCadenceStart = setDataValue(
              meElse.averageCadenceStart,
              300
            );

            newAddRunLimitSettingList.men.averageSpeedEnd =
              propMenList.elsePeople.averageSpeedEnd === 'Invalid date'
                ? '11:30'
                : propMenList.elsePeople.averageSpeedEnd;
            newAddRunLimitSettingList.men.averageSpeedStart =
              propMenList.elsePeople.averageSpeedStart === 'Invalid date'
                ? '03:30'
                : propMenList.elsePeople.averageSpeedStart;

            upMen.dailyMileage = setDataValue(meElse.dailyMileage, 0);
            upMen.dailyParagraph = setDataValue(meElse.dailyParagraph, 2);
            upMen.effectiveMileageEnd = setDataValue(
              meElse.effectiveMileageEnd,
              5
            );
            upMen.effectiveMileageStart = setDataValue(
              meElse.effectiveMileageStart,
              2
            );
            upMen.effectiveParagraphEnd = setDataValue(
              meElse.effectiveParagraphEnd,
              2
            );
            upMen.effectiveParagraphMileage = setDataValue(
              meElse.effectiveParagraphMileage,
              5
            );
            upMen.effectiveParagraphStart = setDataValue(
              meElse.effectiveParagraphStart,
              1
            );
            upMen.gender = meElse.gender;
            upMen.id = meElse.id;
            upMen.limitGoalsInfoId = meElse.limitGoalsInfoId;
            upMen.semester = meElse.semester;
            upMen.semesterMileage = setDataValue(meElse.semesterMileage, 60);
            upMen.semesterParagraph = setDataValue(
              meElse.semesterParagraph,
              40
            );
            upMen.sex = meElse.sex;
            upMen.sexStr = meElse.sexStr;
            upMen.weeklyMileage = setDataValue(meElse.weeklyMileage, 25);
            upMen.weeklyParagraph = setDataValue(meElse.weeklyParagraph, 12);
            upMen.year = meElse.year;
          }

          const newSameList = newAddRunLimitSettingSameList.data;
          //男女不同切换到男女一致赋初始值
          newSameList.averageCadenceEnd = 300;
          newSameList.averageCadenceStart = 0;
          newSameList.averageSpeedEnd = '11:30';
          newSameList.averageSpeedStart = '03:30';
          newSameList.dailyMileage = 5;
          newSameList.dailyParagraph = 2;
          newSameList.effectiveMileageEnd = 5;
          newSameList.effectiveMileageStart = 2;
          newSameList.effectiveParagraphEnd = 2;
          newSameList.effectiveParagraphMileage = 5;
          newSameList.effectiveParagraphStart = 1;
          newSameList.semesterMileage = 60;
          newSameList.semesterParagraph = 40;
          newSameList.weeklyMileage = 25;
          newSameList.weeklyParagraph = 12;
        }
      }
    );
    const isSameMen = ref(true); //男女是否一致

    const showVisible = computed(() => {
      if (props.whoClick === '男女一致') {
        schoolUpdateData.data.gender = '男女一致';
        isSameMen.value = true;
      } else {
        if (props.whoClick === '男女一致') {
          schoolUpdateData.data.gender = '男女一致';
          isSameMen.value = true;
        } else {
          schoolUpdateData.data.gender = '男女不同';
          isSameMen.value = false;
        }
      }
      return props.closeAppVisible;
    });
    const timeToSec = (time: string) => {
      // return moment(time, 'HH:mm:ss').format('x');
      return moment(time, 'mm:ss').format('x');
    };
    const saveAppDialog = async () => {
      //保存
      const newData = newAddRunLimitSettingSameList.data;
      const updateData = {
        limitGoalsInfoId: newData.limitGoalsInfoId,
        limitGoalsInfoList: [
          {
            averageCadenceEnd: newData.averageCadenceEnd,
            averageCadenceStart: newData.averageCadenceStart,
            averageSpeedEnd: timeToSec(newData.averageSpeedEnd),
            averageSpeedStart: timeToSec(newData.averageSpeedStart),
            dailyMileage: newData.dailyMileage,
            dailyParagraph: newData.dailyParagraph,
            effectiveMileageEnd: newData.effectiveMileageEnd,
            effectiveMileageStart: newData.effectiveMileageStart,
            effectiveParagraphEnd: newData.effectiveParagraphEnd,
            effectiveParagraphMileage: newData.effectiveParagraphMileage,
            effectiveParagraphStart: newData.effectiveParagraphStart,
            semesterMileage: newData.semesterMileage,
            semesterParagraph: newData.semesterParagraph,
            sex: 0,
            weeklyMileage: newData.weeklyMileage,
            weeklyParagraph: newData.weeklyParagraph
          }
        ],
        sexType: 0
      };

      const difMen = newAddRunLimitSettingList.men;
      const difWomen = newAddRunLimitSettingList.women;
      const updateDataDifferent = {
        limitGoalsInfoId: newData.limitGoalsInfoId,
        limitGoalsInfoList: [
          {
            averageCadenceEnd: difMen.averageCadenceEnd,
            averageCadenceStart: difMen.averageCadenceStart,
            averageSpeedEnd: timeToSec(difMen.averageSpeedEnd),
            averageSpeedStart: timeToSec(difMen.averageSpeedStart),
            dailyMileage: difMen.dailyMileage,
            dailyParagraph: difMen.dailyParagraph,
            effectiveMileageEnd: difMen.effectiveMileageEnd,
            effectiveMileageStart: difMen.effectiveMileageStart,
            effectiveParagraphEnd: difMen.effectiveParagraphEnd,
            effectiveParagraphMileage: difMen.effectiveParagraphMileage,
            effectiveParagraphStart: difMen.effectiveParagraphStart,
            semesterMileage: difMen.semesterMileage,
            semesterParagraph: difMen.semesterParagraph,
            sex: 1,
            weeklyMileage: difMen.weeklyMileage,
            weeklyParagraph: difMen.weeklyParagraph
          },
          {
            averageCadenceEnd: difWomen.averageCadenceEnd,
            averageCadenceStart: difWomen.averageCadenceStart,
            averageSpeedEnd: timeToSec(difWomen.averageSpeedEnd),
            averageSpeedStart: timeToSec(difWomen.averageSpeedStart),
            dailyMileage: difWomen.dailyMileage,
            dailyParagraph: difWomen.dailyParagraph,
            effectiveMileageEnd: difWomen.effectiveMileageEnd,
            effectiveMileageStart: difWomen.effectiveMileageStart,
            effectiveParagraphEnd: difWomen.effectiveParagraphEnd,
            effectiveParagraphMileage: difWomen.effectiveParagraphMileage,
            effectiveParagraphStart: difWomen.effectiveParagraphStart,
            semesterMileage: difWomen.semesterMileage,
            semesterParagraph: difWomen.semesterParagraph,
            sex: 2,
            weeklyMileage: difWomen.weeklyMileage,
            weeklyParagraph: difWomen.weeklyParagraph
          }
        ],
        sexType: 2
      };

      if (isSameMen.value === true) {
        //男女一致
        updateData.sexType = 1;
        const number = JSON.stringify(updateData.limitGoalsInfoList[0]);
        const number1 = JSON.parse(number);
        updateData.limitGoalsInfoList.push(number1);
        updateData.limitGoalsInfoList[0].sex = 1;
        updateData.limitGoalsInfoList[1].sex = 2;
      } else {
        //男女不同
        updateData.sexType = 2;
      }
      try {
        if (isSameMen.value === true) {
          await SchoolRunAstrictTargetSettingsServicePresenter.updateLimitGoalsInfo(
            updateData
          );
        } else {
          await SchoolRunAstrictTargetSettingsServicePresenter.updateLimitGoalsInfo(
            updateDataDifferent
          );
        }
        message.success('更新成功');
        emit('update-success', true);
      } catch (error) {
        message.error('更新失败');
        console.log(error);
      }
    };

    const averageCadenChange = () => {
      //改变input对比值
      const sameList = newAddRunLimitSettingSameList.data;
      const menList = newAddRunLimitSettingList.men;
      const woList = newAddRunLimitSettingList.women;
      if (sameList.averageCadenceEnd < sameList.averageCadenceStart) {
        sameList.averageCadenceEnd = sameList.averageCadenceStart;
      }
      if (sameList.effectiveParagraphEnd < sameList.effectiveParagraphStart) {
        sameList.effectiveParagraphEnd = sameList.effectiveParagraphStart;
      }
      if (sameList.effectiveMileageEnd < sameList.effectiveMileageStart) {
        sameList.effectiveMileageEnd = sameList.effectiveMileageStart;
      }
      if (menList.averageCadenceEnd < menList.averageCadenceStart) {
        menList.averageCadenceEnd = menList.averageCadenceStart;
      }
      if (menList.effectiveMileageEnd < menList.effectiveMileageStart) {
        menList.effectiveMileageEnd = menList.effectiveMileageStart;
      }
      if (menList.effectiveParagraphEnd < menList.effectiveParagraphStart) {
        menList.effectiveParagraphEnd = menList.effectiveParagraphStart;
      }
      if (woList.averageCadenceEnd < woList.averageCadenceStart) {
        woList.averageCadenceEnd = woList.averageCadenceStart;
      }
      if (woList.effectiveMileageEnd < woList.effectiveMileageStart) {
        woList.effectiveMileageEnd = woList.effectiveMileageStart;
      }
      if (woList.effectiveParagraphEnd < woList.effectiveParagraphStart) {
        woList.effectiveParagraphEnd = woList.effectiveParagraphStart;
      }
    };

    const closeAppDialog = () => {
      //取消
      emit('change-visible', false);
    };

    const menSame = () => {
      //男女一致
      isSameMen.value = true;
    };
    const noMenSame = () => {
      //男女不同
      isSameMen.value = false;
    };

    return {
      showVisible,
      saveAppDialog,
      closeAppDialog,
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      formState,
      schoolUpdateData,
      newAddRunLimitSettingList,
      newAddRunLimitSettingSameList,
      menSame,
      noMenSame,
      isSameMen,
      averageCadenChange
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-modal) {
  width: 726px;
}
:deep(.ant-time-picker) {
  width: 100px;
}
.dialog_header {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}
.dialog_semester {
  font-weight: 700;
  margin-bottom: 10px;
}
.gender {
  text-align: center;
}
.gender_men {
  width: 500px;
}
.gender_women {
  width: 500px;
}
.limitUnits {
  padding-left: 7px;
}
</style>
