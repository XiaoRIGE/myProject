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
      <div class="dialog_header">{{ addOrUpdate }}特殊跑步限制与目标设置</div>
      <a-form
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="应用院系" :wrapper-col="{ span: 6, offset: 0.5 }">
          <a-select
            v-model:value="newTestList.collegeList"
            mode="tags"
            style="width: 100%"
            placeholder="请选择院系"
            :disabled="addOrUpdate === '编辑' ? true : false"
          >
            <a-select-option v-for="item in college" :key="item.key">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学年" :wrapper-col="{ span: 6, offset: 0.5 }">
          <a-select
            v-model:value="newTestList.schoolYear"
            :disabled="addOrUpdate === '编辑' ? true : false"
            placeholder="请选择"
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
        <a-form-item label="学期" :wrapper-col="{ span: 6, offset: 0.5 }">
          <a-select
            v-model:value="newTestList.semester"
            :disabled="addOrUpdate === '编辑' ? true : false"
            placeholder="请选择"
          >
            <a-select-option :value="1">
              上学期
            </a-select-option>
            <a-select-option :value="2">
              下学期
            </a-select-option>
          </a-select>
        </a-form-item>
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
                newTestList.specialLimitGoalsInfoList[0].averageSpeedStart
              "
              value-format="mm:ss"
              format="mm:ss"
            />
            -
            <a-time-picker
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].averageSpeedEnd
              "
              value-format="mm:ss"
              format="mm:ss"
            />
            /KM
          </a-form-item>
          <a-form-item label="平均步频">
            <a-input-number
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].averageCadenceStart
              "
              :min="0"
              :max="999"
              @change="averageCadenChange"
            />
            -
            <a-input-number
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].averageCadenceEnd
              "
              :min="1"
              :max="999"
              @change="averageCadenChange"
            />
            SPM
          </a-form-item>
          <a-form-item v-if="isMileageMessage1 === '段数'" label="每段有效里程">
            <a-input-number
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0]
                  .effectiveParagraphMileage
              "
              :min="1"
              :max="99"
            />
            KM
          </a-form-item>
          <a-form-item
            :label="
              isMileageMessage1 === '里程' ? '每次有效里程范围' : '每次有效段数'
            "
          >
            <a-input-number
              v-if="isMileageMessage1 === '里程'"
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].effectiveMileageStart
              "
              :min="1"
              :max="99"
              :step="1.0"
              @change="averageCadenChange"
            />
            <a-input-number
              v-else
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].effectiveParagraphStart
              "
              :min="1"
              :max="99"
              :step="1.0"
              @change="averageCadenChange"
            />
            -
            <a-input-number
              v-if="isMileageMessage1 === '里程'"
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].effectiveMileageEnd
              "
              :min="1"
              :max="99"
              :step="1.0"
              @change="averageCadenChange"
            />
            <a-input-number
              v-else
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].effectiveParagraphEnd
              "
              :min="1"
              :max="99"
              :step="1.0"
              @change="averageCadenChange"
            />
            <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`每日${isMileageMessage1}上限`">
            <a-input-number
              v-if="isMileageMessage1 === '里程'"
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].dailyMileage
              "
              :min="1"
              :max="999"
            />
            <a-input-number
              v-else
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].dailyParagraph
              "
              :min="1"
              :max="999"
            />
            <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`每周${isMileageMessage1}上限`">
            <a-input-number
              v-if="isMileageMessage1 === '里程'"
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].weeklyMileage
              "
              :min="1"
              :max="999"
            />
            <a-input-number
              v-else
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].weeklyParagraph
              "
              :min="1"
              :max="999"
            />
            <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
              KM
            </span>
            <span v-else class="limitUnits">段</span>
          </a-form-item>
          <a-form-item :label="`学期${isMileageMessage1}上限`">
            <a-input-number
              v-if="isMileageMessage1 === '里程'"
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].semesterMileage
              "
              :min="1"
              :max="9999"
            />
            <a-input-number
              v-else
              v-model:value="
                newTestList.specialLimitGoalsInfoList[0].semesterParagraph
              "
              :min="1"
              :max="9999"
            />
            <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
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
                v-model:value="newTestListDiffrerent.men.averageSpeedStart"
                value-format="mm:ss"
                format="mm:ss"
              />
              -
              <a-time-picker
                v-model:value="newTestListDiffrerent.men.averageSpeedEnd"
                value-format="mm:ss"
                format="mm:ss"
              />
              /KM
            </a-form-item>
            <a-form-item label="平均步频">
              <a-input-number
                v-model:value="newTestListDiffrerent.men.averageCadenceStart"
                :min="0"
                :max="999"
              />
              -
              <a-input-number
                v-model:value="newTestListDiffrerent.men.averageCadenceEnd"
                :min="1"
                :max="999"
              />
              SPM
            </a-form-item>
            <a-form-item
              v-if="isMileageMessage1 === '段数'"
              label="每段有效里程"
            >
              <a-input-number
                v-model:value="
                  newTestListDiffrerent.men.effectiveParagraphMileage
                "
                :min="1"
                :max="99"
              />
              KM
            </a-form-item>
            <a-form-item
              :label="
                isMileageMessage1 === '里程'
                  ? '每次有效里程范围'
                  : '每次有效段数'
              "
            >
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.men.effectiveMileageStart"
                :min="1"
                :max="99"
                :step="1.0"
              />
              <a-input-number
                v-else
                v-model:value="
                  newTestListDiffrerent.men.effectiveParagraphStart
                "
                :min="1"
                :max="99"
                :step="1.0"
              />
              -
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.men.effectiveMileageEnd"
                :min="1"
                :max="99"
                :step="1.0"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.men.effectiveParagraphEnd"
                :min="1"
                :max="99"
                :step="1.0"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每日${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.men.dailyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.men.dailyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每周${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.men.weeklyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.men.weeklyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`学期${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.men.semesterMileage"
                :min="1"
                :max="9999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.men.semesterParagraph"
                :min="1"
                :max="9999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
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
                v-model:value="newTestListDiffrerent.women.averageSpeedStart"
                value-format="mm:ss"
                format="mm:ss"
              />
              -
              <a-time-picker
                v-model:value="newTestListDiffrerent.women.averageSpeedEnd"
                value-format="mm:ss"
                format="mm:ss"
              />
              /KM
            </a-form-item>
            <a-form-item label="平均步频">
              <a-input-number
                v-model:value="newTestListDiffrerent.women.averageCadenceStart"
                :min="0"
                :max="999"
              />
              -
              <a-input-number
                v-model:value="newTestListDiffrerent.women.averageCadenceEnd"
                :min="1"
                :max="999"
              />
              SPM
            </a-form-item>
            <a-form-item
              v-if="isMileageMessage1 === '段数'"
              label="每段有效里程"
            >
              <a-input-number
                v-model:value="
                  newTestListDiffrerent.women.effectiveParagraphMileage
                "
                :min="1"
                :max="99"
              />
              KM
            </a-form-item>
            <a-form-item
              :label="
                isMileageMessage1 === '里程'
                  ? '每次有效里程范围'
                  : '每次有效段数'
              "
            >
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="
                  newTestListDiffrerent.women.effectiveMileageStart
                "
                :min="1"
                :max="99"
              />
              <a-input-number
                v-else
                v-model:value="
                  newTestListDiffrerent.women.effectiveParagraphStart
                "
                :min="1"
                :max="99"
              />
              -
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.women.effectiveMileageEnd"
                :min="1"
                :max="99"
              />
              <a-input-number
                v-else
                v-model:value="
                  newTestListDiffrerent.women.effectiveParagraphEnd
                "
                :min="1"
                :max="99"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每日${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.women.dailyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.women.dailyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`每周${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.women.weeklyMileage"
                :min="1"
                :max="999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.women.weeklyParagraph"
                :min="1"
                :max="999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
                KM
              </span>
              <span v-else class="limitUnits">段</span>
            </a-form-item>
            <a-form-item :label="`学期${isMileageMessage1}上限`">
              <a-input-number
                v-if="isMileageMessage1 === '里程'"
                v-model:value="newTestListDiffrerent.women.semesterMileage"
                :min="1"
                :max="9999"
              />
              <a-input-number
                v-else
                v-model:value="newTestListDiffrerent.women.semesterParagraph"
                :min="1"
                :max="9999"
              />
              <span v-if="isMileageMessage1 === '里程'" class="limitUnits">
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
import {
  computed,
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  watch
} from 'vue';
import { BaseCourseServicePresenter } from '@/request/api/presenter/course';
import { SchoolRunAstrictTargetSettingsServicePresenter } from '@/request/api/presenter/runSettings';
import { useForm } from '@ant-design-vue/use';
import { message } from 'ant-design-vue';
import moment, { Moment } from 'moment';
// import { getDisableTime } from '@/utils/common';
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
    isMileageMessage1: {
      type: String,
      default: ''
    },
    addOrUpdate: {
      type: String,
      default: ''
    },
    formDataList: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['change-visible', 'add-success'],

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
    const newTestList: any = reactive({
      collegeList: [],
      schoolYear: 1,
      scoringType: 0,
      groupId: '',
      semester: 1,
      sexType: 1,
      specialLimitGoalsInfoList: [
        {
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
          groupId: '',
          id: '',
          name: '',
          schoolYear: '',
          semesterMileage: 60,
          semesterParagraph: 40,
          semesterStr: '',
          sex: 0,
          sexStr: 0,
          weeklyMileage: 25,
          weeklyParagraph: 12
        }
      ]
    });

    const newTestListDiffrerent: any = reactive({
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

    const { resetFields } = useForm(newTestList, {});

    watch(
      () => props.addOrUpdate,
      () => {
        if (props.addOrUpdate === '添加') {
          newTestList.collegeList = [];
          newTestList.schoolYear = 1;
          newTestList.scoringType = 0;
          newTestList.groupId = '';
          newTestList.semester = 1;
          newTestList.specialLimitGoalsInfoList = [
            {
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
              gender: '男女一致',
              groupId: '',
              id: '',
              name: '',
              schoolYear: '大一',
              semesterMileage: 60,
              semesterParagraph: 40,
              semesterStr: '下学期',
              sex: 0,
              sexStr: 0,
              weeklyMileage: 25,
              weeklyParagraph: 12
            }
          ];
          (newTestListDiffrerent.men = {
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
            (newTestListDiffrerent.women = {
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
        }
      }
    );
    watch(
      () => props.formDataList,
      () => {
        if (JSON.stringify(props.formDataList) === '{}') {
          resetFields();
          return;
        }
        if (props.addOrUpdate === '编辑') {
          if (JSON.stringify(props.formDataList.elsePeople) === '{}') {
            //判断传入的数据是男女一致
            newTestList.collegeList = props.formDataList.name;
            newTestList.schoolYear = props.formDataList.schoolYear;
            newTestList.semester = props.formDataList.semesterStr;
            newTestList.groupId = props.formDataList.groupId;
            const number = JSON.stringify(props.formDataList);
            const number1 = JSON.parse(number);
            newTestList.specialLimitGoalsInfoList[0] = number1;

            (newTestListDiffrerent.men = {
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
              (newTestListDiffrerent.women = {
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
            const number = JSON.stringify(props.formDataList);
            const number1 = JSON.parse(number);
            newTestList.collegeList = props.formDataList.name;
            newTestList.groupId = props.formDataList.groupId;
            if (props.formDataList.gender === '男') {
              newTestListDiffrerent.men = number1;
              newTestListDiffrerent.women = number1.elsePeople;
            } else {
              newTestListDiffrerent.men = number1.elsePeople;
              newTestListDiffrerent.women = number1;
            }

            newTestList.specialLimitGoalsInfoList = [
              {
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
                groupId: '',
                id: '',
                name: '',
                schoolYear: '',
                semesterMileage: 60,
                semesterParagraph: 40,
                semesterStr: '',
                sex: 0,
                sexStr: 0,
                weeklyMileage: 25,
                weeklyParagraph: 12
              }
            ];
          }
        }
      }
    );
    const isSameMen = ref(true); //男女是否一致
    const college = ref([]); //学院列表

    const switchCollege = async () => {
      const data: any = await BaseCourseServicePresenter.getCollegetList();
      college.value = data;
    };
    switchCollege();

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
      const requestDifrenentData: any = {
        collegeList: newTestList.collegeList,
        schoolYear: newTestList.schoolYear,
        scoringType: newTestList.scoringType,
        semester: newTestList.semester,
        sexType: newTestList.sexType,
        specialLimitGoalsInfoList: []
      };

      const specialNewList = newTestList.specialLimitGoalsInfoList;
      const requestSameData: any = {
        //请求添加男女一致数据
        collegeList: newTestList.collegeList,
        schoolYear: newTestList.schoolYear,
        scoringType: newTestList.scoringType,
        semester: newTestList.semester,
        sexType: newTestList.sexType,
        specialLimitGoalsInfoList: [
          {
            averageCadenceEnd: specialNewList[0].averageCadenceEnd,
            averageCadenceStart: specialNewList[0].averageCadenceStart,
            averageSpeedEnd: specialNewList[0].averageSpeedEnd,
            averageSpeedStart: specialNewList[0].averageSpeedStart,
            dailyMileage: specialNewList[0].dailyMileage,
            dailyParagraph: specialNewList[0].dailyParagraph,
            effectiveMileageEnd: specialNewList[0].effectiveMileageEnd,
            effectiveMileageStart: specialNewList[0].effectiveMileageStart,
            effectiveParagraphEnd: specialNewList[0].effectiveParagraphEnd,
            effectiveParagraphMileage:
              specialNewList[0].effectiveParagraphMileage,
            effectiveParagraphStart: specialNewList[0].effectiveParagraphStart,
            semesterMileage: specialNewList[0].semesterMileage,
            semesterParagraph: specialNewList[0].semesterParagraph,
            sex: specialNewList[0].sex,
            weeklyMileage: specialNewList[0].weeklyMileage,
            weeklyParagraph: specialNewList[0].weeklyParagraph
          }
        ]
      };
      const diffreentListMen = newTestListDiffrerent.men;
      const diffreentListWomen = newTestListDiffrerent.women;
      const updateRequestData = {
        //编辑男女不同数据
        groupId: newTestList.groupId,
        scoringType: props.isMileageMessage1 === '里程' ? 1 : 2,
        sexType: 2,
        specialLimitGoalsInfoList: [
          {
            averageCadenceEnd: diffreentListMen.averageCadenceEnd,
            averageCadenceStart: diffreentListMen.averageCadenceStart,
            averageSpeedEnd: timeToSec(diffreentListMen.averageSpeedEnd),
            averageSpeedStart: timeToSec(diffreentListMen.averageSpeedStart),
            dailyMileage: diffreentListMen.dailyMileage,
            dailyParagraph: diffreentListMen.dailyParagraph,
            effectiveMileageEnd: diffreentListMen.effectiveMileageEnd,
            effectiveMileageStart: diffreentListMen.effectiveMileageStart,
            effectiveParagraphEnd: diffreentListMen.effectiveParagraphEnd,
            effectiveParagraphMileage:
              diffreentListMen.effectiveParagraphMileage,
            effectiveParagraphStart: diffreentListMen.effectiveParagraphStart,
            semesterMileage: diffreentListMen.semesterMileage,
            semesterParagraph: diffreentListMen.semesterParagraph,
            sex: 1,
            weeklyMileage: diffreentListMen.weeklyMileage,
            weeklyParagraph: diffreentListMen.weeklyParagraph
          },
          {
            averageCadenceEnd: diffreentListWomen.averageCadenceEnd,
            averageCadenceStart: diffreentListWomen.averageCadenceStart,
            averageSpeedEnd: timeToSec(diffreentListWomen.averageSpeedEnd),
            averageSpeedStart: timeToSec(diffreentListWomen.averageSpeedStart),
            dailyMileage: diffreentListWomen.dailyMileage,
            dailyParagraph: diffreentListWomen.dailyParagraph,
            effectiveMileageEnd: diffreentListWomen.effectiveMileageEnd,
            effectiveMileageStart: diffreentListWomen.effectiveMileageStart,
            effectiveParagraphEnd: diffreentListWomen.effectiveParagraphEnd,
            effectiveParagraphMileage:
              diffreentListWomen.effectiveParagraphMileage,
            effectiveParagraphStart: diffreentListWomen.effectiveParagraphStart,
            semesterMileage: diffreentListWomen.semesterMileage,
            semesterParagraph: diffreentListWomen.semesterParagraph,
            sex: 2,
            weeklyMileage: diffreentListWomen.weeklyMileage,
            weeklyParagraph: diffreentListWomen.weeklyParagraph
          }
        ]
      };

      const updateList = newTestList.specialLimitGoalsInfoList;

      const updateDifPeopleRequestData = {
        //编辑男女一致数据
        groupId: newTestList.groupId,
        scoringType: props.isMileageMessage1 === '里程' ? 1 : 2,
        sexType: 1,
        specialLimitGoalsInfoList: [
          {
            averageCadenceEnd: updateList[0].averageCadenceEnd,
            averageCadenceStart: updateList[0].averageCadenceStart,
            averageSpeedEnd: timeToSec(updateList[0].averageSpeedEnd),
            averageSpeedStart: timeToSec(updateList[0].averageSpeedStart),
            dailyMileage: updateList[0].dailyMileage,
            dailyParagraph: updateList[0].dailyParagraph,
            effectiveMileageEnd: updateList[0].effectiveMileageEnd,
            effectiveMileageStart: updateList[0].effectiveMileageStart,
            effectiveParagraphEnd: updateList[0].effectiveParagraphEnd,
            effectiveParagraphMileage: updateList[0].effectiveParagraphMileage,
            effectiveParagraphStart: updateList[0].effectiveParagraphStart,
            semesterMileage: updateList[0].semesterMileage,
            semesterParagraph: updateList[0].semesterParagraph,
            sex: 1,
            weeklyMileage: updateList[0].weeklyMileage,
            weeklyParagraph: updateList[0].weeklyParagraph
          },
          {
            averageCadenceEnd: updateList[0].averageCadenceEnd,
            averageCadenceStart: updateList[0].averageCadenceStart,
            averageSpeedEnd: timeToSec(updateList[0].averageSpeedEnd),
            averageSpeedStart: timeToSec(updateList[0].averageSpeedStart),
            dailyMileage: updateList[0].dailyMileage,
            dailyParagraph: updateList[0].dailyParagraph,
            effectiveMileageEnd: updateList[0].effectiveMileageEnd,
            effectiveMileageStart: updateList[0].effectiveMileageStart,
            effectiveParagraphEnd: updateList[0].effectiveParagraphEnd,
            effectiveParagraphMileage: updateList[0].effectiveParagraphMileage,
            effectiveParagraphStart: updateList[0].effectiveParagraphStart,
            semesterMileage: updateList[0].semesterMileage,
            semesterParagraph: updateList[0].semesterParagraph,
            sex: 2,
            weeklyMileage: updateList[0].weeklyMileage,
            weeklyParagraph: updateList[0].weeklyParagraph
          }
        ]
      };
      //转时间戳
      requestSameData.specialLimitGoalsInfoList[0].averageSpeedStart = timeToSec(
        requestSameData.specialLimitGoalsInfoList[0].averageSpeedStart
      );
      requestSameData.specialLimitGoalsInfoList[0].averageSpeedEnd = timeToSec(
        requestSameData.specialLimitGoalsInfoList[0].averageSpeedEnd
      );
      if (schoolUpdateData.data.gender === '男女一致') {
        //男女一致在数组中push一个相同数组
        const number = JSON.stringify(
          requestSameData.specialLimitGoalsInfoList[0]
        );
        const number1 = JSON.parse(number);
        requestSameData.sexType = 1;
        requestSameData.specialLimitGoalsInfoList.push(number1);
        requestSameData.specialLimitGoalsInfoList[0].sex = 1;
        requestSameData.specialLimitGoalsInfoList[1].sex = 2;
      } else {
        //男女不同在requestDifrenentData中添加requestDifrenentData男和女
        requestSameData.sexType = 2;
        requestDifrenentData.specialLimitGoalsInfoList.push(
          newTestListDiffrerent.men
        );
        requestDifrenentData.specialLimitGoalsInfoList.push(
          newTestListDiffrerent.women
        );
        requestDifrenentData.specialLimitGoalsInfoList[0].sex = 1; //男女不同也要在sex中添加1,2
        requestDifrenentData.specialLimitGoalsInfoList[1].sex = 2;
      }
      if (props.isMileageMessage1 === '里程') {
        requestSameData.scoringType = 1;
        requestDifrenentData.scoringType = 1;
      } else {
        requestSameData.scoringType = 2;
        requestDifrenentData.scoringType = 2;
      }
      requestDifrenentData.sexType = requestSameData.sexType; //男女不同添加性别字段
      const difSpecialList = requestDifrenentData.specialLimitGoalsInfoList;
      for (let i = 0; i < difSpecialList.length; i++) {
        //转换男女不同的时间戳
        difSpecialList[i].averageSpeedStart = timeToSec(
          difSpecialList[i].averageSpeedStart
        );
        difSpecialList[i].averageSpeedEnd = timeToSec(
          difSpecialList[i].averageSpeedEnd
        );
      }
      try {
        if (schoolUpdateData.data.gender === '男女一致') {
          if (props.addOrUpdate === '添加') {
            await SchoolRunAstrictTargetSettingsServicePresenter.addSpecialLimitGoalsInfo(
              requestSameData
            );
          } else {
            await SchoolRunAstrictTargetSettingsServicePresenter.updateSpecialLimitGoalsInfo(
              updateDifPeopleRequestData
            );
          }
        } else {
          if (props.addOrUpdate === '添加') {
            await SchoolRunAstrictTargetSettingsServicePresenter.addSpecialLimitGoalsInfo(
              requestDifrenentData
            );
          } else {
            updateRequestData.sexType = 2;
            await SchoolRunAstrictTargetSettingsServicePresenter.updateSpecialLimitGoalsInfo(
              updateRequestData
            );
          }
        }
        message.success(`${props.addOrUpdate}成功`);
        if (schoolUpdateData.data.gender === '男女一致') {
          requestSameData.specialLimitGoalsInfoList.pop(); //将数组组后一个删除
        }
        emit('add-success', true);
        emit('change-visible', false);
      } catch (error) {
        if (schoolUpdateData.data.gender === '男女一致') {
          requestSameData.specialLimitGoalsInfoList.pop(); //将数组组后一个删除
        }
        message.error(error.message);
      }
    };

    const closeAppDialog = () => {
      //取消
      emit('change-visible', false);
    };

    const averageCadenChange = () => {
      if (
        newTestList.specialLimitGoalsInfoList[0].averageCadenceEnd <
        newTestList.specialLimitGoalsInfoList[0].averageCadenceStart
      ) {
        newTestList.specialLimitGoalsInfoList[0].averageCadenceEnd =
          newTestList.specialLimitGoalsInfoList[0].averageCadenceStart;
      }
      if (
        newTestList.specialLimitGoalsInfoList[0].effectiveMileageEnd <
        newTestList.specialLimitGoalsInfoList[0].effectiveMileageStart
      ) {
        newTestList.specialLimitGoalsInfoList[0].effectiveMileageEnd =
          newTestList.specialLimitGoalsInfoList[0].effectiveMileageStart;
      }
      if (
        newTestList.specialLimitGoalsInfoList[0].effectiveParagraphEnd <
        newTestList.specialLimitGoalsInfoList[0].effectiveParagraphStart
      ) {
        newTestList.specialLimitGoalsInfoList[0].effectiveParagraphEnd =
          newTestList.specialLimitGoalsInfoList[0].effectiveParagraphStart;
      }
    };

    const menSame = () => {
      //男女一致
      isSameMen.value = true;
    };
    const noMenSame = () => {
      //男女不同
      isSameMen.value = false;
    };
    //reacc.datelong    reacc.datelong1
    // const reacc = reactive({
    //   datelong: moment(
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedStart,
    //     'HH:MM:ss'
    //   ),
    //   datelong1: moment(
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedEnd,
    //     'HH:MM:ss'
    //   )
    // });
    // const dissableHours = () => {
    //   return getDisableTime(
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedStart,
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedEnd
    //   );
    // };

    // const dissableMinutes = () => {
    //   return getDisableTime(
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedStart,
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedEnd,
    //     'minutes'
    //   );
    // };

    // const dissableSeconds = () => {
    //   return getDisableTime(
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedStart,
    //     newTestList.specialLimitGoalsInfoList[0].averageSpeedEnd,
    //     'second'
    //   );
    // };

    return {
      showVisible,
      saveAppDialog,
      closeAppDialog,
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      formState,
      schoolUpdateData,
      menSame,
      noMenSame,
      isSameMen,
      college,
      newTestList,
      newTestListDiffrerent,
      averageCadenChange
      // dissableHours,
      // dissableMinutes,
      // dissableSeconds
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
