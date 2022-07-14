<template>
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    :header-style="{ position: 'sticky', top: '0', zIndex: '999' }"
    :title="
      `${activityStatus === 6 ? '活动详情' : props.addOrUpdate + '单次活动'}`
    "
    placement="right"
    :closable="true"
    :visible="showVisible"
    width="800px"
    :mask-closable="false"
    :destroy-on-close="true"
    @close="onClose"
  >
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="活动名称" name="name" v-bind="validateInfos.name">
            <a-input
              v-model:value="form.name"
              placeholder="请输入"
              :maxlength="40"
              :disabled="activityStatus === 6"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属专题" name="region">
            <div class="special-region">
              <a-select
                v-model:value="form.region"
                placeholder="请选择"
                :disabled="activityStatus === 6"
                allow-clear
              >
                <a-select-option
                  v-for="item in specialList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-popover placement="leftBottom" trigger="hover">
                <template #content>
                  <p>您可以到专题页面创建专题</p>
                </template>
                <a-avatar class="avatar">
                  !
                </a-avatar>
              </a-popover>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="背景图"
            name="fileList"
            v-bind="validateInfos.fileList"
          >
            <div class="clearfix">
              <a-upload
                v-model:file-list="form.fileList"
                :before-upload="beforeUpload"
                list-type="picture-card"
                :custom-request="doImgUpload"
                :disabled="activityStatus === 6"
                @preview="handlePreview"
              >
                <div v-if="form.fileList.length < 1">
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
              <span>图片尺寸：750*420，图片格式：.jpg .png，大小不超过2M</span>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
              >
                <img alt="example" class="background-img" :src="previewImage" />
              </a-modal>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="适用学院">
            <a-radio-group
              v-model:value="form.restrictOrganization"
              class="college-radio"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
            >
              <a-radio :value="0">
                全部
              </a-radio>
              <a-radio :value="1">
                部分
              </a-radio>
            </a-radio-group>
            <a-select
              v-if="form.restrictOrganization === 1"
              v-model:value="form.organizationList"
              mode="multiple"
              placeholder="请选择"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
              allow-clear
            >
              <a-select-option
                v-for="item in applyCollege"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="活动所在校区"
            name="campus"
            v-bind="validateInfos.campus"
          >
            <a-select
              v-model:value="form.campus"
              mode="multiple"
              placeholder="请选择"
              :disabled="activityStatus === 6 || activityStatus === 5"
              allow-clear
            >
              <a-select-option
                v-for="item in activityCampus"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="活动地点"
            name="activitySite"
            v-bind="validateInfos.activitySite"
          >
            <a-input
              v-model:value="form.activitySite"
              placeholder="请输入"
              :disabled="activityStatus === 6 || activityStatus === 5"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="活动时间"
            name="activityTime"
            v-bind="validateInfos.activityTime"
          >
            <div style="display:flex">
              <div class="activ-time-date">
                <a-date-picker
                  v-model:value="form.activityTime"
                  :disabled="activityStatus === 6 || activityStatus === 5"
                  :disabled-date="activityDisabledDate"
                  @change="onChange"
                />
              </div>
              <a-time-picker
                v-model:value="form.activityStartTime"
                :disabled="activityStatus === 6 || activityStatus === 5"
                format="HH:mm"
                placeholder="请选择"
                :disabled-hours="disabledStartHours"
                :disabled-minutes="disabledStartMinutes"
                @change="disStartHourChange"
              />
              <span class="activ-across">&nbsp;-&nbsp;</span>
              <a-time-picker
                v-model:value="form.activityEndTime"
                :disabled="activityStatus === 6 || activityStatus === 5"
                format="HH:mm"
                placeholder="请选择"
                :disabled-hours="disabledEndHours"
                :disabled-minutes="disabledEndMinutes"
                @openChange="endTimeOpen"
                @change="disEndHourChange"
              />
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="报名时间"
            name="applyTime"
            v-bind="validateInfos.applyTime"
          >
            <a-range-picker
              v-model:value="form.applyTime"
              :show-time="{ format: 'HH:mm' }"
              :disabled-date="getApplyTimeComputed"
              :disabled-time="disabledApplyTime"
              format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              :disabled="activityStatus === 6 || activityStatus === 5"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="发布日期"
            name="releaseDate"
            v-bind="validateInfos.releaseDate"
          >
            <a-date-picker
              v-model:value="form.releaseDate"
              :disabled-date="getPublishComputed"
              style="width: 100%"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5 ||
                  activityStatus === 2
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="负责老师"
            name="teacher"
            v-bind="validateInfos.teacher"
          >
            <a-select
              v-model:value="form.teacher"
              placeholder="请输入"
              mode="multiple"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
              allow-clear
            >
              <a-select-option
                v-for="item in teacherList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.realName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="开启签到方式">
            <a-radio-group
              v-model:value="form.openSign"
              :disabled="activityStatus === 6 || activityStatus === 5"
              style="width:167px"
            >
              <a-radio :value="2">
                自动
              </a-radio>
              <a-radio :value="1">
                手动
              </a-radio>
            </a-radio-group>
            <div class="interval-father">
              <div v-if="form.openSign === 2" class="interval-div">
                自动开启签到时间
                <a-input
                  v-model:value="form.motionSignTime"
                  style="width:250px"
                  :disabled="true"
                  :min="0"
                  :max="600"
                />
              </div>
              <div class="interval-div">
                学生两次签到需间隔
                <a-input-number
                  id="inputNumber"
                  v-model:value="form.interval"
                  :disabled="!currentSemester"
                  :min="0"
                  :max="600"
                />
                分钟
              </div>
            </div>
            <div v-if="form.openSign === 2">
              GPS签到范围设置
              <a-button
                v-if="!dataSource.length"
                type="primary"
                ghost
                @click="addSignAdress(1)"
              >
                + &nbsp;添加签到地点
              </a-button>
            </div>
            <div
              v-if="dataSource.length && form.openSign === 2"
              class="sign-table"
            >
              <a-table
                row-key="range"
                :data-source="dataSource"
                :columns="columns"
                :pagination="false"
              >
                <template #coordinates="{text}">
                  {{ text }}
                  <img
                    src="@/assets/copy.png"
                    class="copy-image"
                    @click="copy(text)"
                  />
                </template>
                <template
                  v-if="activityStatus !== 5 && activityStatus !== 6"
                  #operation="{}"
                >
                  <a class="update" @click="addSignAdress(2)">
                    编辑
                  </a>
                </template>
              </a-table>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否计入成绩">
            <a-radio-group
              v-model:value="form.result"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
            >
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="报名限制">
            <div class="performane-Limit">
              <a-radio-group
                v-model:value="form.performance"
                :disabled="
                  activityStatus === 6 ||
                    activityStatus === 3 ||
                    activityStatus === 4 ||
                    activityStatus === 5
                "
                style="width:215px"
              >
                <a-radio value="1">
                  无限制
                </a-radio>
                <a-radio value="2">
                  限制
                </a-radio>
              </a-radio-group>
              <a-input
                v-if="form.performance === '2'"
                v-model:value="form.performanceValue"
                :disabled="
                  activityStatus === 6 ||
                    activityStatus === 3 ||
                    activityStatus === 4 ||
                    activityStatus === 5
                "
                placeholder="请输入"
                :readonly="true"
                @click="performanceLimitInput"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="活动人数上限">
            <a-radio-group
              v-model:value="form.upperLimit"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
              style="width:167px"
            >
              <a-radio value="1">
                无限制
              </a-radio>
              <a-radio value="2">
                限制
              </a-radio>
            </a-radio-group>
            <a-input-number
              v-if="form.upperLimit === '2'"
              id="inputNumber"
              v-model:value="form.upperLimitNumber"
              :disabled="
                activityStatus === 6 ||
                  activityStatus === 3 ||
                  activityStatus === 4 ||
                  activityStatus === 5
              "
              :min="1"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="活动简介" name="brief">
            <a-textarea
              v-model:value="form.brief"
              :rows="4"
              placeholder="请输入"
              :disabled="activityStatus === 6"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div v-if="activityStatus !== 6" class="bottom-submit">
      <a-button class="cancel" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" @click="onSubmit">
        保存
      </a-button>
    </div>
  </a-drawer>
  <LimitListDialog
    :limit-list-dialog="limitListDialogVisible"
    :limit-id="applyLimitId"
    @change-visible="changeVisible"
    @limiting-condition="limitingCondition"
  />
  <ChooseLocation
    :show-visible="showChooseLocation"
    :default-position="defaultPosition"
    :radius="mapRadius"
    @handle-sure="handleSure"
    @handle-close="handleClose"
  />
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue';
import LimitListDialog from '../LimitListDialog/Index.vue';
import { useForm } from '@ant-design-vue/use';
import moment, { Moment } from 'moment';
import { OnceActivityListPresenter } from '@/request/api/presenter/course';
import { UserControlStudentServicePresenter } from '@/request/api/presenter/userControl';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { OnceActivityList } from '@/request/api/model/course';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import ChooseLocation from '@/components/global/ChooseLocation.vue';
import { copy } from '@/utils/common';

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

interface FileItem {
  type: string;
  size: number;
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url: string;
  preview?: string;
  originFileObj?: any;
}

const getStoreInfo = () => {
  const store = useStore();
  const specialList = computed(() => store.state.basic.SpecialList);
  const currentSemester = computed(
    () => store.state.basic.currentSemester.current
  ); //当前学期信息

  return {
    specialList,
    currentSemester
  };
};

const columns = ref([
  {
    title: '签到地点',
    dataIndex: 'sign',
    key: 'sign'
  },
  {
    title: '经纬度坐标',
    dataIndex: 'coordinates',
    key: 'coordinates',
    slots: { customRender: 'coordinates' }
  },
  {
    title: '有效范围',
    dataIndex: 'range',
    key: 'range'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'operation' }
  }
]);
export default defineComponent({
  components: {
    LimitListDialog,
    ChooseLocation
  },
  props: {
    isDrawerShow: {
      type: Boolean
    },
    addOrUpdate: {
      type: String,
      default: ''
    },
    updateList: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const range = (start: number, end: number) => {
      const result = [];

      for (let i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    };
    const dataSource = ref<any[]>([]);
    const { specialList, currentSemester } = getStoreInfo();
    const showChooseLocation = ref<boolean>(false);
    const defaultPosition = ref<number[]>([]);
    const mapRadius = ref<number>(100);
    const signName = ref<string>('');
    const form = reactive<any>({
      name: '',
      region: undefined,
      fileList: ref<FileItem[]>([]),
      campus: ref<string[]>([]), //校区
      activitySite: '', //地点
      activityTime: '',
      activityStartTime: moment('00:00', 'HH:mm'),
      activityEndTime: moment('23:59', 'HH:mm'),
      openSign: 2,
      applyTime: ref<any[]>([]), //报名时间
      releaseDate: '', //发布日期
      teacher: ref<string[]>([]), //负责老师
      performance: '1', //报名限制
      result: 1, //是否计入成绩
      performanceValue: '', //报名限制输入框
      upperLimit: '1', //活动人数上限单选
      upperLimitNumber: 1, //活动人数上限人数
      brief: '', //简介,
      interval: 60, //时间间隔
      restrictOrganization: 0, //适用学院
      organizationList: [], //使用学院list
      motionSignTime: ''
    });
    let limitId = '';

    const rules = reactive({
      name: [{ required: true, message: '请输入活动名称' }],
      campus: [{ required: true, message: '请选择校区' }],
      activitySite: [{ required: true, message: '请输入' }],
      fileList: [{ required: true, message: '请上传背景图' }],
      activityTime: [
        {
          required: true,
          message: '请选择活动时间'
        }
      ],
      applyTime: [
        {
          required: true,
          message: '请选择报名时间'
        }
      ],
      releaseDate: [
        {
          required: true,
          message: '请选择发布日期'
        }
      ],
      teacher: [
        {
          required: true,
          message: '请选择老师'
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(form, rules);
    const limitListDialogVisible = ref<boolean>(false);
    const drawerVisible = ref<boolean>(false);
    const showVisible = computed(() => {
      return props.isDrawerShow;
    });
    const previewVisible = ref<boolean>(false);
    const previewImage = ref<string | undefined>('');
    const activityCampus = ref([]);
    const teacherList = ref([]);
    const activityStatus = ref<number>(0); //1未发布，2已发布，3报名中，4报名结束，5进行中，6已结束

    watch(
      () => props.addOrUpdate,
      () => {
        if (props.addOrUpdate === '添加') {
          activityStatus.value = 0;
        } else {
          activityStatus.value = 0;
        }
      }
    );

    watchEffect(() => {
      if (form.activityTime) {
        form.motionSignTime = `${moment(form.activityTime).format(
          'YYYY-MM-DD'
        )} ${moment(form.activityStartTime).format('HH:mm')}`;
      } else {
        form.motionSignTime = '';
      }
    });

    const backGroundUrl = ref<string>('');
    const applyLimitId = ref<string>('');
    watch(
      () => props.updateList,
      () => {
        defaultPosition.value = [];
        dataSource.value = [];
        if (JSON.stringify(props.updateList) === '{}') {
          resetFields();
          return;
        }
        resetFields();
        const {
          name,
          activityTopicVO,
          campusInfoVOS,
          address,
          startTime,
          endTime,
          registerStartTime,
          registerEndTime,
          releaseDate,
          teacherRemoteVOS,
          includedResult,
          restrictionVO,
          limitPeopleNumber,
          brief,
          bgUrl,
          restrictOrganization,
          organizationInfoVOS,
          interval,
          attainabilityModeSwitch,
          locationLatitude,
          locationLongitude,
          signAddress,
          radius
        } = props.updateList;
        if (attainabilityModeSwitch === 2) {
          //自动情况
          dataSource.value = [
            {
              sign: signAddress,
              coordinates: `${locationLatitude},${locationLongitude}`,
              range: radius
            }
          ];
          defaultPosition.value = [locationLongitude, locationLatitude];
          mapRadius.value = radius;
          signName.value = signAddress;
        }
        form.openSign = attainabilityModeSwitch;
        const [activeTime, activeStartTime] = startTime.split(' ');
        form.activityTime = activeTime;
        form.activityStartTime = moment(activeStartTime, 'HH:mm');
        form.activityEndTime = moment(endTime, 'HH:mm');
        form.interval = interval;
        form.fileList[0] = {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: bgUrl
        };
        form.restrictOrganization = restrictOrganization;
        organizationInfoVOS.forEach((item: any) => {
          item.id && form.organizationList.push(item.id);
        });
        backGroundUrl.value = bgUrl;
        activityStatus.value = props.updateList.activityStatus;
        campusInfoVOS.forEach((item: any) => {
          item.name && form.campus.push(item.id);
        });
        form.name = name;
        form.activitySite = address;
        form.applyTime = [registerStartTime, registerEndTime];
        form.releaseDate = releaseDate;
        teacherRemoteVOS.forEach((item: any) => {
          item.realName && form.teacher.push(item.id);
        });
        form.result = includedResult;
        form.performance = restrictionVO === null ? '1' : '2';
        limitId = restrictionVO === null ? '' : restrictionVO.id;

        if (activityTopicVO !== null) {
          form.region = activityTopicVO.id;
        }
        if (restrictionVO !== null) {
          let sexstr = '不限性别';
          switch (restrictionVO.sex) {
            case 0:
              sexstr = '不限性别';
              break;
            case 1:
              sexstr = '仅男生';
              break;
            case 2:
              sexstr = '仅女生';
              break;
          }
          const applyLimitInput = `${restrictionVO.name}: ${
            restrictionVO.year
          }; ${sexstr};  每日次数上限:${
            restrictionVO.dayTime === 0 ? '不限' : restrictionVO.dayTime
          };每周次数上限:${
            restrictionVO.weekTime === 0 ? '不限' : restrictionVO.weekTime
          };学期次数上限:${
            restrictionVO.time === 0 ? '不限' : restrictionVO.time
          }`;
          form.performanceValue = applyLimitInput;
          applyLimitId.value = restrictionVO.name;
        }
        if (limitPeopleNumber === null || limitPeopleNumber === 0) {
          form.upperLimit = '1';
          form.upperLimitNumber = null;
          form.upperLimitNumber = 1;
        } else {
          form.upperLimit = '2';
          form.upperLimitNumber = limitPeopleNumber;
        }
        form.brief = brief;
      }
    );

    const applyCollege = ref([]); //适用学院列表
    onMounted(async () => {
      try {
        const { data } = await CampusServicePresenter.queryAllCampus('');
        activityCampus.value = data.data;
      } catch (error) {
        console.log(error);
      }

      try {
        const teacherData = await OnceActivityListPresenter.queryTeacherList();
        teacherList.value = teacherData;
      } catch (error) {
        console.log(error);
      }

      try {
        const res = await UserControlStudentServicePresenter.queryallOrganization(
          ''
        );
        applyCollege.value = res.data.data;
      } catch (error) {
        console.log(error);
      }
    });

    const handleCancel = () => {
      previewVisible.value = false;
    };

    const handlePreview = async (file: FileItem) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    const beforeUpload = async (file: any) => {
      const promiseSize = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image: any = new Image();
          image.src = reader.result;
          image.onload = () => {
            const w = image.width;
            const h = image.height;
            if (w !== 750 && h !== 420) {
              message.error('您只能上传尺寸750*420尺寸的图片!');
              form.fileList.value[0].status = 'error';
              resolve('失败');
            } else {
              resolve('成功');
            }
          };
        };
      });
      if (promiseSize === '成功') {
        const isJpgOrPng =
          file.type === 'image/jpg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpeg';
        if (!isJpgOrPng) {
          message.error('您只能上传jpg、png格式的图片!');
          form.fileList.value[0].status = 'error';
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传的图片大小不能超过2M!');
          form.fileList.value[0].status = 'error';
          return false;
        }
        return isJpgOrPng && isLt2M;
      } else {
        return false;
      }
    };

    const doImgUpload = async (options: any) => {
      const { onSuccess, file } = options;
      const formData = new FormData();
      formData.append('file', file as any);

      try {
        const res = await OnceActivityList.uploadPic(formData);
        backGroundUrl.value = res.data.data;
        onSuccess((response: any, file: any) => {
          console.log(file, 'response');
        });
      } catch (error) {
        message.error(error.message);
      }
    };

    const performanceLimitInput = () => {
      limitListDialogVisible.value = true;
    };

    const changeVisible = (visibele: boolean) => {
      limitListDialogVisible.value = visibele;
    };

    const limitingCondition = (limitingCondition: any) => {
      const {
        year,
        sex,
        time,
        id,
        name,
        dayTime,
        weekTime
      } = limitingCondition;
      limitId = id;
      let gender = '不限';
      switch (sex) {
        case 0:
          gender = '不限性别';
          break;
        case 1:
          gender = '仅男生';
          break;
        case 2:
          gender = '仅女生';
          break;
      }
      const applyLimitInput = `${name}: ${year}; ${gender}; 每日次数上限:${
        dayTime === 0 ? '不限' : dayTime
      };每周次数上限:${weekTime === 0 ? '不限' : weekTime};学期次数上限:${
        time === 0 ? '不限' : time
      }`;
      form.performanceValue = applyLimitInput;
    };

    const addOrUpdateRequest = async (requestData: any) => {
      if (props.addOrUpdate === '添加') {
        try {
          await OnceActivityListPresenter.addOnceActivity(requestData);
          message.success('创建成功');
          resetFields();
          backGroundUrl.value = '';
          emit('change-visible', '刷新');
        } catch (error) {
          message.error(error.message);
          console.log(error);
        }
      } else {
        try {
          await OnceActivityListPresenter.updateOnceActivity(requestData);
          message.success('编辑成功');
          resetFields();
          backGroundUrl.value = '';
          emit('change-visible', '刷新');
        } catch (error) {
          message.error(error.message);
          console.log(error);
        }
      }
    };

    const onSubmit = () => {
      const [locationLatitude, locationLongitude] = dataSource.value[0]
        ? dataSource.value[0].coordinates.split(',')
        : '';

      const requestData = {
        activityTopicId: form.region,
        address: form.activitySite,
        bgUrl: backGroundUrl.value,
        brief: form.brief,
        campusList: form.campus,
        endTime: 1,
        startTime: 1,
        includedResult: form.result,
        limitPeopleNumber:
          form.upperLimit === '1' ? null : form.upperLimitNumber,
        name: form.name,
        registerEndTime: Number(moment(form.applyTime[1]).format('x')),
        registerStartTime: Number(moment(form.applyTime[0]).format('x')),
        releaseDate: Number(moment(form.releaseDate).format('x')),
        restrictId: form.performance === '1' ? '' : limitId,
        teacherList: form.teacher,
        id: props.updateList.id,
        organizationList: form.organizationList,
        restrictOrganization: form.restrictOrganization,
        interval: form.interval,
        attainabilityModeSwitch: form.openSign,
        locationLatitude: Number(locationLatitude),
        locationLongitude: Number(locationLongitude),
        radius: mapRadius.value,
        signAddress: signName.value
      };

      validate()
        .then(async () => {
          //需求变更：拼接开始结束时间
          const startTime = Number(
            moment(
              `${moment(form.activityTime).format('YYYY-MM-DD')} ${moment(
                form.activityStartTime
              ).format('HH:mm')}`
            ).format('x')
          );
          const endTime = Number(
            moment(
              `${moment(form.activityTime).format('YYYY-MM-DD')} ${moment(
                form.activityEndTime
              ).format('HH:mm')}`
            ).format('x')
          );
          requestData.startTime = startTime;
          requestData.endTime = endTime;
          if (form.openSign === 2) {
            //自动
            if (dataSource.value.length) {
              //以添加签到地点
              addOrUpdateRequest(requestData);
            } else {
              message.error('请添加签到地点');
            }
          } else {
            //手动
            addOrUpdateRequest(requestData);
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    const onClose = () => {
      resetFields();

      emit('change-visible', '不刷新');
    };

    const activityDisabledDate = (current: Moment) => {
      return (
        current &&
        current <
          moment()
            .endOf('day')
            .subtract(1, 'days')
      );
    };

    const disStartHourArr = ref<number[]>([]); //限制活动开始时间小时数组
    const disStartMinutesArr = ref<number[]>([]); //限制活动开始时间分钟数组
    const disEndHourArr = ref<number[]>([]); //限制活动结束时间小时数组
    const disEndMinutesArr = ref<number[]>([]); //限制活动结束时间分钟数组
    const isNowDay = ref<boolean>(false); //true是今天
    const onChange = (val: any) => {
      const nowDay = moment().format('YYYY-MM-DD');
      const nowHour = Number(moment().format('H'));
      const nowHourAndM = moment().format('HH:mm');
      const nowMinutes = Number(moment().format('m'));

      if (moment(val).format('YYYY-MM-DD') === nowDay) {
        //选择的今天
        isNowDay.value = true;
        form.activityStartTime = moment(nowHourAndM, 'HH:mm');
        for (let i = 0; i < 25; i++) {
          disStartHourArr.value[i] = i;
        }
        disStartHourArr.value.splice(nowHour);

        if (Number(moment(val).format('HH')) === nowHour) {
          //选择的当前小时
          for (let i = 0; i < 61; i++) {
            disStartMinutesArr.value[i] = i;
          }
          disStartMinutesArr.value.splice(nowMinutes);
        } else {
          disStartMinutesArr.value = [];
        }
      } else {
        disStartHourArr.value = [];
        isNowDay.value = false;
      }
    };

    const nowHour = ref(Number(moment().format('H')));
    const nowMinutes = ref(Number(moment().format('m')));
    const disStartHourChange = (val: any) => {
      if (Number(moment(val).format('HH')) === nowHour.value) {
        //选择的当前小时
        for (let i = 0; i < 61; i++) {
          disStartMinutesArr.value[i] = i;
        }
        disStartMinutesArr.value.splice(nowMinutes.value);
      } else {
        disStartMinutesArr.value = [];
      }
    };
    const disEndHourChange = (val: any) => {
      const endHour = Number(moment(val).format('HH')); //活动结束时间的小时
      const startMinutes = Number(moment(form.activityStartTime).format('mm')); //活动开始时间的分钟
      const startHour = Number(moment(form.activityStartTime).format('HH')); //活动开始时间的小时
      if (form.activityStartTime) {
        //活动开始时间有值
        if (endHour === startHour) {
          for (let i = 0; i < 61; i++) {
            disEndMinutesArr.value[i] = i;
          }
          disEndMinutesArr.value.splice(startMinutes);
        } else {
          disEndMinutesArr.value = [];
        }
      }
    };
    const endTimeOpen = () => {
      //活动结束时间打开事件
      const startHour = Number(moment(form.activityStartTime).format('HH')); //活动结束时间的小时
      if (form.activityStartTime) {
        //活动开始时间有值
        for (let i = 0; i < 25; i++) {
          disEndHourArr.value[i] = i;
        }
        disEndHourArr.value.splice(startHour);
      }
    };

    const disabledStartHours = () => {
      return disStartHourArr.value;
    };
    const disabledStartMinutes = () => {
      return disStartMinutesArr.value;
    };
    const disabledEndHours = () => {
      return disEndHourArr.value;
    };
    const disabledEndMinutes = () => {
      return disEndMinutesArr.value;
    };

    const getApplyTimeComputed = (current: Moment) => {
      //报名时间
      const startDateTest = `${moment(form.activityTime).format(
        'YYYY-MM-DD'
      )} ${moment(form.activityStartTime, 'HH:mm').format('HH:mm')}`;
      const startDate = moment(startDateTest);

      if (current) {
        return (
          current <
            moment()
              .endOf('day')
              .subtract(1, 'days') ||
          current > startDate.startOf('day').add(1, 'days')
        );
      }
    };

    const getPublishComputed = (current: Moment) => {
      //发布时间
      if (form.applyTime.length !== 0) {
        const startDate = moment(form.applyTime[0]);
        if (current) {
          return (
            current <
              moment()
                .endOf('day')
                .subtract(1, 'days') || current > startDate.endOf('day')
          );
        }
      }
    };

    const disabledApplyTime = (_: Moment[], type: 'start' | 'end') => {
      const someIndex = 1;
      const applyIndex = 0;
      const arr = ref<any[]>([
        moment(
          `${moment(form.activityTime).format('YYYY-MM-DD')} ${moment(
            form.activityStartTime
          ).format('HH:mm')}`
        ),
        moment(
          `${moment(form.activityTime).format('YYYY-MM-DD')} ${moment(
            form.activityEndTime
          ).format('HH:mm')}`
        )
      ]);
      const startTime = arr.value[applyIndex]; //活动开始时间
      const endTime = arr.value[someIndex];
      const startTimeNowHour = Number(moment(startTime).format('H'));
      const startTimeNowMinutes = Number(moment(startTime).format('m'));

      const nowHour = Number(moment(endTime).format('H'));
      const nowMinutes = Number(moment(endTime).format('m'));
      let applyDay = ''; //报名日期
      let applyEndDay = ''; //报名结束日期
      let day = ''; //活动结束日期
      if (props.addOrUpdate === '编辑') {
        day = endTime;
        applyDay = form.applyTime[applyIndex];
        applyEndDay = form.applyTime[someIndex];
      } else {
        day = endTime === undefined ? '' : endTime.format('YYYY-MM-DD');
        applyDay =
          form.applyTime.length === 0
            ? ''
            : form.applyTime[0].format('YYYY-MM-DD');
        applyEndDay =
          form.applyTime.length === 0
            ? ''
            : form.applyTime[1].format('YYYY-MM-DD');
      }
      const applyHour = Number(moment(form.applyTime[0]).format('H')); //报名时间
      const applyEndHour = Number(moment(form.applyTime[1]).format('H')); //报名时间

      let isSameDay = 0; //活动时间 报名时间是否相同
      let isAcEndTime = 0; //活动结束时间等于报名结束时间1
      if (form.applyTime.length !== 0) {
        if (applyDay === day) {
          isSameDay = 1;
        }
        if (applyEndDay === day) {
          isAcEndTime = 1;
        }
      }
      if (type === 'start') {
        //在开始时处理禁用时间
        if (form.activityTime.length !== 0) {
          if (isSameDay === 1) {
            if (applyHour === startTimeNowHour) {
              //报名开始小时等于活动开始小时
              return {
                disabledHours: () =>
                  range(0, 60).splice(startTimeNowHour + 1, 24),
                disabledMinutes: () => range(startTimeNowMinutes - 1, 60)
              };
            } else {
              return {
                disabledHours: () =>
                  range(0, 60).splice(startTimeNowHour + 1, 24),
                disabledMinutes: () => []
              };
            }
          }
        }
      } else {
        //在结束时间禁用小时
        if (isAcEndTime === 1) {
          if (nowHour === applyEndHour) {
            //活动结束小时等于报名结束小时
            return {
              disabledHours: () => range(0, 60).splice(nowHour + 1, 24),
              disabledMinutes: () => range(nowMinutes, 60)
            };
          } else {
            return {
              disabledHours: () => range(0, 60).splice(nowHour + 1, 24),
              disabledMinutes: () => []
            };
          }
        }
      }

      return {
        disabledHours: () => [],
        disabledMinutes: () => []
      };
    };

    const handleSure = (
      circlePosition: any,
      circleName: string,
      radiusRef: number
    ) => {
      if (circlePosition && circleName && radiusRef) {
        dataSource.value = [
          {
            sign: circleName,
            coordinates: `${circlePosition.lat},${circlePosition.lng}`,
            range: radiusRef
          }
        ];
        signName.value = circleName;
        mapRadius.value = radiusRef;
      } else {
        dataSource.value = [];
      }
      showChooseLocation.value = false;
    };
    const handleClose = () => {
      showChooseLocation.value = false;
    };

    const addSignAdress = (value: number) => {
      //1添加 2编辑
      if (value === 2) {
        const arr = dataSource.value[0].coordinates.split(',');
        defaultPosition.value = [Number(arr[1]), Number(arr[0])];
        mapRadius.value = dataSource.value[0].range;
      }
      showChooseLocation.value = true;
    };

    return {
      drawerVisible,
      showVisible,
      form,
      rules,
      previewVisible,
      previewImage,
      handleCancel,
      handlePreview,
      performanceLimitInput,
      limitListDialogVisible,
      changeVisible,
      onSubmit,
      validateInfos,
      limitingCondition,
      onClose,
      moment,
      specialList,
      activityCampus,
      teacherList,
      beforeUpload,
      props,
      activityStatus,
      uploadPic: OnceActivityList.uploadPic,
      doImgUpload,
      applyLimitId,
      getApplyTimeComputed,
      getPublishComputed,
      disabledApplyTime,
      applyCollege,
      currentSemester,
      dataSource,
      columns,
      addSignAdress,
      showChooseLocation,
      defaultPosition,
      mapRadius,
      handleSure,
      handleClose,
      activityDisabledDate,
      onChange,
      disabledStartHours,
      disabledStartMinutes,
      disStartHourChange,
      disabledEndHours,
      disabledEndMinutes,
      disEndHourChange,
      endTimeOpen,
      copy
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
.performane-Limit {
  display: flex;
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
.special-region {
  display: flex;
}
.avatar {
  height: 31px;
  width: 35px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
  border-radius: 50%;
  background: white;
  border: 2px solid #555;
  line-height: 26px;
  margin-left: 20px;
}
.background-img {
  width: 100%;
}
.college-radio {
  margin-bottom: 10px;
}
.activ-time-date {
  width: 200px;
  margin-right: 10px;
}
.activ-across {
  line-height: 28px;
}
.interval-father {
  display: flex;
  margin-bottom: 15px;
}
.interval-div {
  margin-top: 10px;
  margin-right: 16px;
}
.sign-table {
  margin-top: 10px;
}
.copy-image {
  height: 15px;
  margin-bottom: 5px;
  margin-left: 5px;
}
</style>
