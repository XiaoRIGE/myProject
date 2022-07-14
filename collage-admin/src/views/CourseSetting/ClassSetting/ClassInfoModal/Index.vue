<template>
  <a-modal
    :visible="showVisible"
    :mask-closable="false"
    :keyboard="false"
    title="请填写班级信息"
    width="680px"
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
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-row>
        <a-col :span="24">
          <a-form-item
            label="课程类型"
            v-bind="validateInfos.courseType"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-radio-group
              v-model:value="classForm.courseType"
              :options="courseTypeOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="项目" v-bind="validateInfos.projectName">
            <a-select
              v-model:value="classForm.projectName"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in projectList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="年级" v-bind="validateInfos.grade">
            <a-select
              v-model:value="classForm.grade"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in gradeList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="校区"
            v-bind="validateInfos.campus"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-select
              v-model:value="classForm.campus"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in campusList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="任课教师"
            v-bind="validateInfos.teacher"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-select
              v-model:value="classForm.teacher"
              allow-clear
              :show-search="true"
              :show-arrow="false"
              :label-in-value="false"
              placeholder="请输入姓名或电话"
              :filter-option="false"
              :not-found-content="fetching ? undefined : '暂无数据'"
              @search="fetchUser"
            >
              <template v-if="fetching" #notFoundContent>
                <a-spin size="small" />
              </template>
              <a-select-option
                v-for="d in optionalData.teacherList"
                :key="d.key"
                :value="d.key"
              >
                {{ d.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="上课类型"
            v-bind="validateInfos.alternateWeekType"
          >
            <a-select
              v-model:value="classForm.alternateWeekType"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in alternateWeekTypeList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="上课星期"
            v-bind="validateInfos.week"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-radio-group
              v-model:value="classForm.week"
              :disabled="editinfo.data.disableStatus === 1"
            >
              <a-space :size="16">
                <a-radio-button value="1">
                  周一
                </a-radio-button>
                <a-radio-button value="2">
                  周二
                </a-radio-button>
                <a-radio-button value="3">
                  周三
                </a-radio-button>
                <a-radio-button value="4">
                  周四
                </a-radio-button>
                <a-radio-button value="5">
                  周五
                </a-radio-button>
                <a-radio-button value="6">
                  周六
                </a-radio-button>
                <a-radio-button value="7">
                  周日
                </a-radio-button>
              </a-space>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="上课时间"
            v-bind="validateInfos.classTime"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-select
              v-model:value="classForm.classTime"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option value="0">
                自定义
              </a-select-option>
              <a-select-option
                v-for="item in optionalData.allocationTimeList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- 自定义上课时间 -->
        <a-col v-show="classForm.classTime === '0'" :span="12">
          <a-form-item
            v-bind="validateInfos.customizationClassStartTime"
            :wrapper-col="{ span: 12, offset: 6 }"
          >
            <a-time-picker
              v-model:value="classForm.customizationClassStartTime"
              placeholder="开始时间"
            />
          </a-form-item>
        </a-col>
        <a-col v-show="classForm.classTime === '0'" :span="12">
          <a-form-item
            v-bind="validateInfos.customizationClassEndTime"
            :wrapper-col="{ span: 12 }"
          >
            <a-time-picker
              v-model:value="classForm.customizationClassEndTime"
              placeholder="结束时间"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="上课日期"
            v-bind="validateInfos.classDateRange"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-range-picker
              v-model:value="classForm.classDateRange"
              :disabled="editinfo.data.disableStatus === 1"
              :disabled-date="getDisableDateByCurrentSemester"
              value-format="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上课地点" v-bind="validateInfos.classArea">
            <a-input
              v-model:value="classForm.classArea"
              :maxlength="30"
              allow-clear
              placeholder="请输入"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="人数上限" v-bind="validateInfos.maxNum">
            <a-input-number
              v-model:value="classForm.maxNum"
              :max="9999"
              placeholder="请输入"
            />
            <span>人</span>
          </a-form-item>
        </a-col>
        <a-col v-if="classForm.courseType === '1'" :span="24">
          <a-form-item
            label="选课日期"
            v-bind="validateInfos.chooseClassTime"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <!-- :disabled-date="dissableHalfYear" -->
            <!-- value-format="YYYY-MM-DD" -->
            <a-range-picker
              v-model:value="classForm.chooseClassTime"
              :disabled-date="disableDate"
              :show-time="{
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('23:59:59', 'HH:mm:ss')
                ]
              }"
              :placeholder="['开始日期', '结束日期']"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="classForm.courseType === '1'" :span="12">
          <a-form-item label="选课范围" v-bind="validateInfos.college">
            <!--  :show-checked-strategy="SHOW_PARENT" -->
            <a-tree-select
              v-model:value="classForm.college"
              style="width: 100%"
              :tree-data="collegeTreeData"
              tree-checkable
              allow-clear
              placeholder="请选择学院"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="classForm.courseType === '1'" :span="12">
          <a-form-item
            v-bind="validateInfos.student"
            :wrapper-col="{ span: 21, offset: 3 }"
          >
            <!-- :show-checked-strategy="SHOW_PARENT" -->
            <a-tree-select
              v-model:value="classForm.student"
              style="width: 100%"
              :tree-data="studentTreeData"
              tree-checkable
              allow-clear
              placeholder="请选择学生"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="备注"
            v-bind="validateInfos.remark"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <a-textarea
              v-model:value="classForm.remark"
              :show-count="true"
              :maxlength="100"
              :rows="3"
              allow-clear
              placeholder="请输入备注"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRaw,
  Ref,
  toRefs,
  watchEffect
} from 'vue';
import { useForm } from '@ant-design-vue/use';
import moment, { Moment } from 'moment';
import { message } from 'ant-design-vue';
import {
  BaseCourseServicePresenter,
  ClassServicePresenter
} from '@/request/api/presenter/course';
import { debounced } from '@/utils/common';
import { useStore } from 'vuex';
// import { TreeSelect } from 'ant-design-vue';
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
interface FormState {
  campus: string | undefined;
  projectName: string | undefined;
  courseType: string | number;
  grade: string | undefined;
  teacher: string | undefined;
  alternateWeekType: undefined | string;
  week: string | undefined;
  classTime: string | undefined;
  classArea: string;
  classDateRange: Array<Moment>;
  chooseClassTime: Array<Moment>;
  customizationClassStartTime?: Moment | null;
  customizationClassEndTime?: Moment | null;
  college: Array<string>;
  student: Array<string>;
  maxNum: string | undefined | number;
  remark: string;
  id?: string;
}
interface baseMap {
  key: string;
  value: string;
  [key: string]: any;
}

interface TreeDataItem {
  value: string;
  key: string;
  title?: string;
  disabled?: boolean;
  children: Array<{
    value: string;
    key: string;
    title?: string;
  }>;
}

//树形数据
const useTree = () => {
  const studentTreeData: TreeDataItem[] = [
    {
      title: '全部学生',
      value: '0',
      key: '0',
      children: []
    }
  ];
  const collegeTreeData: TreeDataItem[] = [
    {
      title: '全部学院',
      value: '0',
      key: '0',
      children: []
    }
  ];

  return {
    studentTreeData,
    collegeTreeData
  };
};

// 初始化下拉数据
const useInitDate = (
  optionalData: any,
  collegeTreeData: any,
  studentTreeData: any
) => {
  const state = reactive({
    fetching: false
  });

  /**
   * @description 获取任课教师下拉列表
   * @params 名称或手机号
   */
  const getTeacherMap = async (params: string) => {
    const queryParams = {
      query: params
    };
    try {
      optionalData.teacherList = [];
      state.fetching = true;
      const data = await BaseCourseServicePresenter.getTeacherList(queryParams);
      optionalData.teacherList = data;
    } finally {
      state.fetching = false;
    }
  };

  /**
   * @description 获取时间设置下拉列表
   */
  const getallocationTimeMap = async () => {
    try {
      const data = await BaseCourseServicePresenter.getLocationTimetList();
      optionalData.allocationTimeList = data;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description 获取学院列表下拉列表
   */
  const getCollegeMap = async () => {
    try {
      const data = await BaseCourseServicePresenter.getCollegetList();
      collegeTreeData[0].children.push(...data);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description 获取学生名单下拉列表
   */
  const getstudentSelectionMap = async () => {
    try {
      const data = await BaseCourseServicePresenter.getStudentSelectList();
      studentTreeData[0].children.push(...data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = debounced((value: string) => {
    getTeacherMap(value);
  }, 500);

  const initData = () => {
    getallocationTimeMap();
    getCollegeMap();
    getstudentSelectionMap();
    fetchUser();
  };
  return {
    initData,
    fetchUser,
    state
  };
};

// 规则校验
const useRule = (classForm: FormState) => {
  const rulesRef = reactive({
    campus: [{ required: true, message: '请选择校区', trigger: 'change' }],
    projectName: [{ required: true, message: '请选择项目', trigger: 'change' }],
    courseType: [
      { required: true, message: '请选择课程类型', trigger: 'change' }
    ],
    grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
    teacher: [{ required: true, message: '请选择任课教师', trigger: 'change' }],
    alternateWeekType: [
      { required: true, message: '请选择上课类型', trigger: 'change' }
    ],
    week: [{ required: true, message: '请选择星期', trigger: 'change' }],
    classTime: [
      { required: true, message: '请选择上课时间', trigger: 'change' }
    ],
    classDateRange: [{ required: true, message: '请选择上课日期' }],
    college: [{ required: false, message: '' }],
    student: [{ required: false, message: '' }],
    chooseClassTime: [{ required: false, message: '' }],
    customizationClassStartTime: [{ required: false, message: '' }],
    customizationClassEndTime: [{ required: false, message: '' }]
  });

  watchEffect(() => {
    if (classForm.courseType === '2') {
      rulesRef.college = [{ required: false, message: '' }];
      rulesRef.student = [{ required: false, message: '' }];
      rulesRef.chooseClassTime = [{ required: false, message: '' }];
    } else if (classForm.courseType === '1') {
      rulesRef.college = [{ required: true, message: '请选择选课范围' }];
      rulesRef.student = [{ required: true, message: '请选择选课范围' }];
      rulesRef.chooseClassTime = [
        { required: true, message: '请选择选课日期' }
      ];
    }
    if (classForm.classTime === '0') {
      rulesRef.customizationClassStartTime = [
        { required: true, message: '请选择上课开始时间' }
      ];
      rulesRef.customizationClassEndTime = [
        { required: true, message: '请选择上课结束时间' }
      ];
    } else {
      rulesRef.customizationClassStartTime = [{ required: false, message: '' }];
      rulesRef.customizationClassEndTime = [{ required: false, message: '' }];
    }
  });
  return rulesRef;
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editinfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['change-visible', 'refresh-list'],

  setup(props, { emit }) {
    const { studentTreeData, collegeTreeData } = useTree();

    const teacherList: Ref<baseMap[]> = ref([]);
    const allocationTimeList: Ref<baseMap[]> = ref([]);
    const collegeList: Ref<baseMap[]> = ref([]);
    const studentList: Ref<baseMap[]> = ref([]);

    const store = useStore();
    const projectList = computed(() => store.state.basic.projectList);
    const gradeList = computed(() => store.state.basic.gradeList);
    const campusList = computed(() => store.state.basic.campusList);
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const alternateWeekTypeList = ref([
      { value: '单,双周', key: '0' },
      { value: '单周', key: '1' },
      { value: '双周', key: '2' }
    ]);

    const optionalData = reactive({
      teacherList,
      allocationTimeList,
      collegeList,
      studentList
    });

    const classForm: FormState = reactive({
      campus: undefined,
      projectName: undefined,
      courseType: '2',
      grade: undefined,
      teacher: undefined,
      alternateWeekType: '0',
      week: undefined,
      classTime: undefined,
      classArea: '',
      classDateRange: [],
      chooseClassTime: [],
      customizationClassStartTime: null,
      customizationClassEndTime: null,
      college: [],
      student: [],
      maxNum: undefined,
      remark: '',
      id: ''
    });

    // 学期范围外不可选
    const getDisableDateByCurrentSemester = computed(() => {
      const startDate = moment(currentSemester.value.startDate);
      const endDate = moment(currentSemester.value.endDate);
      return (current: Moment) => {
        return current > endDate || current < startDate;
      };
    });
    // 一年选择范围
    // const dissableFullYear = (current: Moment) => {
    //   const today = new Date();
    //   const year = today.getFullYear() + 1;
    //   const month = today.getMonth() + 1;
    //   const day = today.getDate();
    //   return (
    //     current > moment(new Date(`${year}/${month}/${day}`)) ||
    //     current < moment().endOf('day')
    //   );
    // };

    // 半年选择范围
    // const dissableHalfYear = (current: Moment) => {
    //   const today = new Date();
    //   const year = today.getFullYear();
    //   const month = today.getMonth() + 7;
    //   const day = today.getDate();
    //   return (
    //     current > moment(new Date(`${year}/${month}/${day}`)) ||
    //     current < moment().endOf('day')
    //   );
    // };
    // 上课时间结束之前
    const disableDate = computed(() => {
      return (current: Moment) => {
        let startDate = null;
        let endDate = null;
        if (
          !classForm.classDateRange ||
          classForm.classDateRange.length === 0
        ) {
          return false;
        }
        if (classForm.classDateRange && classForm.classDateRange.length) {
          [startDate, endDate] = classForm.classDateRange;
          console.log('startDate', startDate);
          return current > moment(endDate);
        }
      };
    });

    watchEffect(() => {
      const {
        id,
        type,
        projectId,
        campusId,
        year,
        teacherId,
        alternateWeekType,
        weekLabelType,
        timeAllocationId,
        address,
        limitPeopleNumber,
        content,
        startDate,
        endDate,
        registerStartTime,
        registerEndTime,
        startTime,
        endTime,
        courseSelection,
        courseSelectionUser
      } = props.editinfo.data;

      classForm.id = id;
      classForm.campus = campusId;
      classForm.projectName = projectId;
      classForm.classArea = address;
      classForm.remark = content;
      classForm.teacher = teacherId;
      if (limitPeopleNumber || limitPeopleNumber === 0) {
        classForm.maxNum = limitPeopleNumber;
      }
      if (alternateWeekType) {
        classForm.alternateWeekType = String(alternateWeekType);
      }

      if (type) {
        classForm.courseType = String(type);
      }
      if (year) {
        classForm.grade = String(year);
      }
      if (weekLabelType) {
        classForm.week = String(weekLabelType);
      }
      if (timeAllocationId) {
        classForm.classTime = timeAllocationId;
      } else if (startTime && endTime) {
        classForm.classTime = '0';
        classForm.customizationClassStartTime = moment(startTime);
        classForm.customizationClassEndTime = moment(endTime);
      }
      if (startDate) {
        classForm.classDateRange = [
          moment(moment(startDate).format('YYYY-MM-DD')),
          moment(moment(endDate).format('YYYY-MM-DD'))
        ];
      }
      if (registerStartTime) {
        classForm.chooseClassTime = [
          moment(moment(registerStartTime).format('YYYY-MM-DD HH:mm:ss')),
          moment(moment(registerEndTime).format('YYYY-MM-DD HH:mm:ss'))
        ];
      }
      if (courseSelection) {
        classForm.college = courseSelection.map((item: any) => item.id);
      }
      if (courseSelectionUser) {
        classForm.student = courseSelectionUser.map((item: any) => item.id);
      }
    });

    const courseTypeOptions = [
      { label: '选课', value: '1' },
      { label: '固定名单', value: '2' }
    ];

    const { initData, fetchUser, state } = useInitDate(
      optionalData,
      collegeTreeData,
      studentTreeData
    );

    initData();

    const showVisible = computed(() => {
      return props.visible;
    });

    const rulesRef = useRule(classForm);

    const { validate, validateInfos, resetFields } = useForm(
      classForm,
      rulesRef
    );
    const loading = ref<boolean>(false);

    // 取消输入信息
    const handleCancel = () => {
      resetFields();
      emit('change-visible', false);
    };

    const getinfoByKey = (
      value: string | number | undefined,
      key: string,
      srouce: baseMap[]
    ) => {
      const result = srouce.filter(element => {
        return element[key] === value;
      });
      return result[0];
    };

    // 新增班级
    const saveCourse = async () => {
      let startTimetemp = '';
      let endTimetemp = '';
      let timeAllocationName = '';
      // 上课时间为下拉选择
      if (classForm.classTime !== '0') {
        const classTimeInfo = getinfoByKey(
          classForm.classTime,
          'key',
          optionalData.allocationTimeList
        );
        timeAllocationName = classTimeInfo.value;
        startTimetemp = classTimeInfo.startTime;
        endTimetemp = classTimeInfo.endTime;
      } else {
        // 上课时间为自定义
        startTimetemp = moment(
          toRaw(classForm).customizationClassStartTime
        ).format('x');
        endTimetemp = moment(toRaw(classForm).customizationClassEndTime).format(
          'x'
        );
      }
      let teacherName = '';
      if (classForm.teacher) {
        const teacherInfo = getinfoByKey(
          classForm.teacher,
          'key',
          optionalData.teacherList
        );
        teacherName = teacherInfo.value;
      }
      const params = {
        type: toRaw(classForm).courseType,
        projectId: toRaw(classForm).projectName,
        campusId: toRaw(classForm).campus,
        alternateWeekType: Number(toRaw(classForm).alternateWeekType),
        weekLabel: toRaw(classForm).week,
        startDate: moment(toRaw(classForm).classDateRange[0]).format('x'),
        endDate: moment(toRaw(classForm).classDateRange[1]).format('x'),
        startTime: startTimetemp,
        endTime: endTimetemp,
        year: toRaw(classForm).grade,
        address: toRaw(classForm).classArea,
        registerStartTime: moment(toRaw(classForm).chooseClassTime[0]).format(
          'x'
        ),
        registerEndTime: moment(toRaw(classForm).chooseClassTime[1]).format(
          'x'
        ),
        teacherId: toRaw(classForm).teacher,
        teacherName,
        limitPeopleNumber: toRaw(classForm).maxNum,
        timeAllocationId: toRaw(classForm).classTime,
        timeAllocationName,
        collegeList: toRaw(classForm).college,
        studentSelectionList: toRaw(classForm).student,
        content: toRaw(classForm).remark,
        semesterId: currentSemester.value.id
      };
      loading.value = true;
      if (toRaw(classForm).id) {
        try {
          await ClassServicePresenter.update({
            ...params,
            id: toRaw(classForm).id
          });
          message.success('修改成功！');
          resetFields();
          emit('change-visible', false);
          emit('refresh-list');
        } catch (e) {
          console.log(e);
          message.error(`修改失败！${e?.message}`);
        } finally {
          loading.value = false;
        }
      } else {
        try {
          await ClassServicePresenter.add(params);
          message.success('新增成功！');
          resetFields();
          emit('change-visible', false);
          emit('refresh-list');
        } catch (e) {
          console.log(e);
          message.error(`新增失败！${e?.message}`);
        } finally {
          loading.value = false;
        }
      }
    };

    const handleOk = () => {
      validate()
        .then(() => {
          saveCourse();
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    return {
      projectList,
      gradeList,
      campusList,
      alternateWeekTypeList,
      courseTypeOptions,
      loading,
      handleCancel,
      validateInfos,
      classForm,
      showVisible,
      handleOk,
      optionalData,
      ...toRefs(state),
      fetchUser,
      studentTreeData,
      collegeTreeData,
      getDisableDateByCurrentSemester,
      moment,
      disableDate
      // SHOW_PARENT
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-input-number) {
  width: 90%;
  margin-right: 6px;
}
</style>
