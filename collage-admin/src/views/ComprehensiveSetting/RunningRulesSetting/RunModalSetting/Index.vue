<template>
  <div v-if="schoolList && schoolList.length" class="run_container">
    <a-tabs v-model:activeKey="schoolKey" type="card">
      <a-tab-pane v-for="item in schoolList" :key="item.id" :tab="item.name" />
    </a-tabs>
    <!-- 跑步模式配置信息 -->
    <div class="test-wrap">
      <!-- 未配置有效跑步模式 -->
      <div v-if="!isContent">
        <div class="App_entering">
          <div class="App_dataEntering">
            跑步模式：暂未配置跑步模式
          </div>
        </div>
        <div class="content">
          <div class="content_message">
            <!-- 您还未开启任何跑步模式 -->
            <a-empty
              class="mt-24"
              :image-style="{
                height: '74px'
              }"
            >
              <template #description>
                <span>您还未开启任何跑步模式</span>
              </template>
            </a-empty>
          </div>
          <div class="content_btn">
            <a-button type="primary" @click="openRunModal">
              开启有效跑步模式
            </a-button>
          </div>
        </div>
      </div>
      <!-- 已经配置有效跑步模式 -->
      <div v-else>
        <div class="App_entering">
          <div class="App_dataEntering">
            已选跑步模式：{{ getCurrentRunSettingStr }}
            <a-button
              class="App_update_btn"
              type="primary"
              @click="openRunModal"
            >
              更改
            </a-button>
          </div>
        </div>
        <div class="content">
          <div class="content-wrap">
            <div class="content_sidebar">
              <a-tabs v-model:activeKey="RunModalActiveKey">
                <a-tab-pane :key="1" tab="范围跑">
                  <div class="content_all">
                    <div class="content_text">
                      学生跑步总里程不能超出有效区域范围{{
                        runSetting.scopePercentage
                      }}%，否则看作无效数据
                    </div>
                    <!-- 无范围配置信息 -->
                    <div
                      v-if="scopeRunList.length === 0"
                      class="content_content pt-100"
                    >
                      <p>
                        请点击添加按钮，在右侧地图区域配置范围跑有效、无效区域
                      </p>
                      <a-button
                        class="App_update_btn"
                        type="primary"
                        @click="handleEditStateChange"
                      >
                        添加
                      </a-button>
                    </div>
                    <!-- 存在范围配置信息 -->
                    <div v-else class="content_content">
                      <div
                        v-for="(item, index) in scopeRunList"
                        :key="item.name"
                        class="content_area"
                        :class="index === activeIndex ? 'active' : ''"
                        @click="switchHeightlightArea(index)"
                      >
                        <div class="areaname">
                          {{ index + 1 }}.{{ item.name }}
                          <p v-if="item.invalid === 0" class="none_area">
                            （无效范围）
                          </p>
                        </div>
                        <div v-if="isEditState">
                          <span
                            class="redirect"
                            @click="redirectName(item.name, item.id)"
                          >
                            重命名
                          </span>
                          <span
                            class="delate"
                            @click="showDeleteConfirm(item.name, item.id)"
                          >
                            删除
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane :key="2" tab="定点跑" force-render>
                  <div class="content_text">
                    定点跑需{{
                      runSetting.fixedPointNumber === 0 ? '不按顺序' : '按顺序'
                    }}经过{{
                      runSetting.fixedPointNumber
                    }}个点，且完成最小有效里程才能完成有效数据计入；
                    有效范围外的跑步里程不超过总里程的{{
                      runSetting.fixedPointPercentage
                    }}%，否则将此记录看做无效。
                  </div>
                  <a-radio-group v-model:value="drawType">
                    <a-radio-button value="effective">
                      范围
                    </a-radio-button>
                    <a-radio-button value="point">
                      点位
                    </a-radio-button>
                    <a-radio-button value="line">
                      线路
                    </a-radio-button>
                  </a-radio-group>
                  <!-- 无范围配置信息 -->
                  <div v-if="noListData" class="content_content pt-100">
                    <p v-show="drawType === 'effective'">
                      请点击添加按钮，在右侧地图区域配置范围跑有效、无效区域
                    </p>
                    <p v-show="drawType === 'point'">
                      请点击添加按钮，在右侧地图区域配置点位
                    </p>
                    <p v-show="drawType === 'line'">
                      请点击添加按钮，在右侧地图区域配置线路
                    </p>
                    <a-button
                      class="App_update_btn"
                      type="primary"
                      @click="handleEditStateChange"
                    >
                      添加
                    </a-button>
                  </div>
                  <!-- 定点跑范围数据 -->
                  <div
                    v-if="!noListData && drawType === 'effective'"
                    class="content_content"
                  >
                    <div
                      v-for="(item, index) in pointScopeList"
                      :key="item.name"
                      class="content_area"
                      :class="index === activeIndex ? 'active' : ''"
                      @click="switchHeightlightArea(index)"
                    >
                      <div class="areaname">
                        {{ index + 1 }}.{{ item.name }}
                        <p v-if="item.invalid === 0" class="none_area">
                          （无效范围）
                        </p>
                      </div>
                      <div v-if="isEditState">
                        <span
                          class="redirect"
                          @click="redirectName(item.name, item.id)"
                        >
                          重命名
                        </span>
                        <span
                          class="delate"
                          @click="showDeleteConfirm(item.name, item.id)"
                        >
                          删除
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 点位数据 -->
                  <div
                    v-if="!noListData && drawType === 'point'"
                    class="content_content"
                  >
                    <div
                      v-for="(item, index) in pointList"
                      :key="item.name"
                      class="content_area"
                      :class="index === activeIndex ? 'active' : ''"
                      @click="switchHeightlightArea(index, 'point')"
                    >
                      <div class="areaname">
                        {{ index + 1 }}.{{ `点位${index + 1}` }}
                      </div>
                      <div v-if="isEditState">
                        <span
                          class="delate"
                          @click="
                            showDeleteConfirm(
                              `点位${index + 1}`,
                              item.id,
                              'point'
                            )
                          "
                        >
                          删除
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 连线数据 -->
                  <div
                    v-if="!noListData && drawType === 'line'"
                    class="content_content"
                  >
                    <div
                      v-for="(item, index) in lineList"
                      :key="item.name"
                      class="content_area"
                      :class="index === activeIndex ? 'active' : ''"
                      @click="switchHeightlightArea(index, 'line')"
                    >
                      <div class="areaname">
                        {{ index + 1 }}.{{ `线路${index + 1}` }}
                      </div>
                      <div v-if="isEditState">
                        <span
                          class="delate"
                          @click="
                            showDeleteConfirm(
                              `线路${index + 1}`,
                              item.id,
                              'line'
                            )
                          "
                        >
                          删除
                        </span>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>

              <a-button
                v-if="isEditState"
                class="App_back_update"
                type="primary"
                @click="handlequitEdit"
              >
                退出编辑
              </a-button>
              <!-- 非编辑状态 && （定点跑类型-对应类型有数据 || 范围跑-有数据） -->
              <a-button
                v-if="!isEditState && hasList"
                class="App_back_update"
                type="primary"
                @click="handleEditStateChange"
              >
                编辑/添加
              </a-button>
            </div>
            <div class="content_right">
              <base-map
                ref="baseMapRef"
                :draw-type="drawType"
                :map-data="mapData"
                :is-edit-state="isEditState"
                :current-select-map-data="currentSelectMapData"
                @change-edit-state="handleEditStateChange"
                @save-area-info="handleSave"
                @save-point-info="handleSavaPoint"
                @save-line-info="handleSaveLine"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增区域弹窗 -->
    <a-modal
      v-model:visible="isAddDialog"
      title="请填写区域名称"
      @ok="addAreaName"
      @cancel="handleCancle"
    >
      <p>
        <a-form
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-item
            ref="name"
            v-bind="validateInfos.areaName"
            label="区域名称"
            name="name"
          >
            <a-input
              v-model:value="projectForm.areaName"
              :maxlength="30"
              placeholder="请输入"
            />
          </a-form-item>
        </a-form>
      </p>
    </a-modal>
    <!-- 修改区域弹窗 -->
    <a-modal
      v-model:visible="isUpdateDialog"
      title="修改区域名称"
      @ok="updateAreaNameOk"
    >
      <p>
        <a-form
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-item
            ref="name"
            v-bind="validateInfos.areaName"
            label="区域名称"
            name="name"
          >
            <a-input
              v-model:value="projectForm.areaName"
              :maxlength="30"
              placeholder="请输入"
            />
          </a-form-item>
        </a-form>
      </p>
    </a-modal>

    <OpenRunSetting
      :close-app-visible="closeAppVisible"
      :init-data="runSetting"
      @handle-save="saveCampusRunSetting"
      @change-visible="closeOpenRun"
    />
  </div>
  <a-empty
    v-else
    class="mt-24"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>暂时没有校区信息，请先创建校区</span>
    </template>
  </a-empty>
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
import { defineComponent, reactive, ref, Ref, computed, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { RunSettingServicePresenter } from '@/request/api/presenter/runSettings';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import OpenRunSetting from './OpenRunSetting/Index.vue';
import { getStorageData } from '@/utils/common';

interface areaItem {
  name: string;
  area: string | null;
}
interface SchoolItem {
  name: string;
  id: string;
  organizationId: string;
}

type drawType = 'effective' | 'invalid' | 'point' | 'line';

let isRepeat = false;

const projectForm = reactive({
  areaName: ''
});

const useCampusInfo = () => {
  const schoolKey = ref<string>(''); //当前选择校区
  const schoolList = ref<SchoolItem[]>([]);

  // 获取校区列表
  const getCampusList = async () => {
    const orgId = getStorageData('userInfo', 'schoolId');
    const { data } = await CampusServicePresenter.queryAllCampus(orgId);
    const schoolRes = data.data;
    schoolList.value = schoolRes;
    if (schoolRes && schoolRes.length) {
      schoolKey.value = schoolRes[0].id;
    }
  };

  getCampusList();
  return {
    schoolKey,
    schoolList
  };
};

const runSetting = reactive({
  //当前校区跑步模式配置
  freePattern: 0,
  scopePattern: 0,
  scopePercentage: 15,
  fixedPointPattern: 0,
  fixedPointPercentage: 15,
  fixedPointOrder: 0,
  fixedPointNumber: 3,
  id: ''
});

const RunModalActiveKey = ref<number>(1); // 1：范围跑 2：定点跑

watch(
  () => projectForm.areaName,
  () => {
    isRepeat = false;
  }
);

// 区域弹窗数据以及相关操作
const useDialogModule = () => {
  const closeAppVisible = ref<boolean>(false);

  // 展示有效范围弹窗
  const openRunModal = () => {
    closeAppVisible.value = true;
  };

  // 关闭有效范围弹窗
  const closeOpenRun = (visibele: boolean) => {
    closeAppVisible.value = visibele;
  };

  return {
    closeAppVisible,
    closeOpenRun,
    openRunModal
  };
};

// 区域名字新增、编辑、删除
const useAreaEdit = (getMapData: any) => {
  const isAddDialog = ref<boolean>(false);
  const isUpdateDialog = ref<boolean>(false);

  watch(
    () => isAddDialog.value,
    newVal => {
      if (!newVal) {
        projectForm.areaName = '';
      }
    }
  );

  const validatePass = async (rule: any, value: string) => {
    if (value === '') {
      return Promise.reject('请输入区域名称');
    } else {
      if (isRepeat) {
        return Promise.reject('区域名称已存在，请修改后重试');
      }
      return Promise.resolve();
    }
  };

  const rulesRef = reactive({
    areaName: [{ validator: validatePass, trigger: 'change' }]
  });

  const { validate, validateInfos } = useForm(projectForm, rulesRef);

  let tempData: any = [];
  let chooseAddAreaType = '';

  // 绘制区域完成回调
  const handleSave = async (data: any) => {
    isAddDialog.value = true;
    chooseAddAreaType = data.areaType;
    tempData = data.areaData.map((item: any) => {
      return {
        accurateLatitude: item.Q,
        accurateLongitude: item.R,
        latitude: item.lat,
        longitude: item.lng
      };
    });
  };

  // 保存点位信息
  const handleSavaPoint = async (data: any) => {
    try {
      const coordinateSaveVOList = data.map((item: any) => {
        return {
          accurateLatitude: item.Q,
          accurateLongitude: item.R,
          latitude: item.lat,
          longitude: item.lng
        };
      });
      const params = {
        patternId: runSetting.id,
        coordinateSaveVOList
      };
      const res = await RunSettingServicePresenter.addPoint(params);
      if (res.data.code === 0) {
        message.success('点位数据保存成功');
        isAddDialog.value = false;
        getMapData(RunModalActiveKey.value);
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message);
      isAddDialog.value = false;
      getMapData(RunModalActiveKey.value);
    }
  };

  // 保存连线信息
  const handleSaveLine = async (data: any) => {
    try {
      const fixedPointPatternSaveVOList = data.map((item: any) => {
        let distanceVal = 0;
        const coordinateSaveVOList = item.map((itemX: any) => {
          distanceVal = itemX.distance;
          return {
            accurateLatitude: itemX.Q,
            accurateLongitude: itemX.R,
            latitude: itemX.lat,
            longitude: itemX.lng
          };
        });
        return {
          coordinateSaveVOList,
          distance: distanceVal
        };
      });
      const params = {
        patternId: runSetting.id,
        fixedPointPatternSaveVOList
      };
      const res = await RunSettingServicePresenter.addRoute(params);
      if (res.data.code === 0) {
        message.success('线路数据保存成功');
        isAddDialog.value = false;
        getMapData(RunModalActiveKey.value);
      }
    } catch (error) {
      console.log(error);
      message.warning(error.message);
      isAddDialog.value = false;
      getMapData(RunModalActiveKey.value);
    }
  };

  // 保存区域数据
  const addAreaName = async () => {
    validate().then(async () => {
      const params = {
        patternId: runSetting.id,
        invalid: chooseAddAreaType === 'effective' ? 1 : 0,
        name: projectForm.areaName,
        coordinateSaveVOList: tempData
      };
      try {
        let res: any;
        if (RunModalActiveKey.value === 1) {
          //范围跑
          res = await RunSettingServicePresenter.addPatternArea(params);
        } else if (RunModalActiveKey.value === 2) {
          //定点跑
          res = await RunSettingServicePresenter.addPointPattern(params);
        }
        if (res.data.code === 0) {
          isAddDialog.value = false;
          getMapData(RunModalActiveKey.value);
        }
      } catch (e) {
        console.log(e);
        if (e?.code === 30005) {
          isRepeat = true;
          validate();
        }
      }
    });
  };

  const currentAreaId = ref<string>(''); //当前范围id

  // 点击重命名
  const redirectName = (name: string, id: string) => {
    isUpdateDialog.value = true;
    projectForm.areaName = name;
    currentAreaId.value = id;
  };

  const baseMapRef = ref(); //子组件实例
  const fnCallChild = () => {
    baseMapRef.value.deleteOverlays(); //deleteOverlays是子组件里的方法
  };

  const clearMap = () => {
    baseMapRef.value.handleClear(); //handleClear是子组件里的方法
  };

  // 取消新增-清除最后绘制的一个覆盖物
  const handleCancle = () => {
    fnCallChild();
  };

  // 修改区域名称
  const updateAreaNameOk = async () => {
    validate().then(async () => {
      const params = {
        id: currentAreaId.value,
        name: projectForm.areaName,
        patternId: runSetting.id
      };
      try {
        let res: any;
        if (RunModalActiveKey.value === 1) {
          //范围跑
          res = await RunSettingServicePresenter.updatePattern(params);
        } else if (RunModalActiveKey.value === 2) {
          //定点跑
          res = await RunSettingServicePresenter.editPointPattern(params);
        }
        // const res = await RunSettingServicePresenter.updatePattern(params);
        if (res.data.code === 0) {
          isUpdateDialog.value = false;
          getMapData(RunModalActiveKey.value);
        }
      } catch (e) {
        if (e?.code === 30005) {
          isRepeat = true;
          validate();
        }
      }
    });
  };

  // 删除区域
  const deleteArae = async () => {
    const params = {
      id: currentAreaId.value
    };
    try {
      let res: any;
      if (RunModalActiveKey.value === 1) {
        //范围跑
        res = await RunSettingServicePresenter.deletePattern(params);
      } else if (RunModalActiveKey.value === 2) {
        //定点跑
        res = await RunSettingServicePresenter.delPointPattern(params);
      }
      if (res.data.code === 0) {
        message.success('区域删除成功');
        getMapData(RunModalActiveKey.value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 删除点位
  const deletePoint = async () => {
    const params = {
      id: currentAreaId.value
    };
    try {
      const res = await RunSettingServicePresenter.delPoint(params);
      if (res.data.code === 0) {
        message.success('点位删除成功');
        getMapData(RunModalActiveKey.value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 删除连线
  const deleteLine = async () => {
    const params = {
      id: currentAreaId.value
    };
    try {
      const res = await RunSettingServicePresenter.delRoute(params);
      if (res.data.code === 0) {
        message.success('线路删除成功');
        getMapData(RunModalActiveKey.value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description: 删除数据弹窗（区域、点位、线路）
   * @param {string} name 数据名称
   * @param {string} id 数据id
   * @param {string} type 数据类型 area:区域 point:点位 line:连线
   */
  const showDeleteConfirm = (name: string, id: string, type = 'area') => {
    //删除区域
    currentAreaId.value = id;
    let deleteName = '';
    switch (type) {
      case 'area':
        deleteName = `(${name})区域`;
        break;
      default:
        deleteName = `${name}`;
        break;
    }
    Modal.confirm({
      title: '删除',
      content: `删除后无法恢复，确认要删除${deleteName}吗？`,
      onOk() {
        if (type === 'area') {
          deleteArae();
        } else if (type === 'point') {
          deletePoint();
        } else if (type === 'line') {
          deleteLine();
        }
      }
    });
  };

  return {
    isAddDialog,
    isUpdateDialog,
    baseMapRef,
    validateInfos,
    clearMap,
    handleSave,
    handleSavaPoint,
    handleSaveLine,
    handleCancle,
    addAreaName,
    redirectName,
    showDeleteConfirm,
    updateAreaNameOk
  };
};

export default defineComponent({
  components: { OpenRunSetting },
  setup() {
    const { closeAppVisible, closeOpenRun, openRunModal } = useDialogModule();

    const scopeRunList: Ref<areaItem[]> = ref([]); //区域列表数据
    const pointScopeList: Ref<areaItem[]> = ref([]); //定点跑 区域列表数据
    const pointList = ref([]); //定点跑 点位列表数据
    const lineList = ref([]); //定点跑 线路列表数据

    const drawType = ref<drawType>('effective'); //绘制类型 默认为绘制有效范围 effective

    const noListData = computed(() => {
      return (
        (drawType.value === 'effective' && pointScopeList.value.length === 0) ||
        (drawType.value === 'point' && pointList.value.length === 0) ||
        (drawType.value === 'line' && lineList.value.length === 0)
      );
    });

    const hasList = computed(() => {
      return (
        (drawType.value === 'effective' && pointScopeList.value.length) ||
        (drawType.value === 'point' && pointList.value.length) ||
        (drawType.value === 'line' && lineList.value.length) ||
        (RunModalActiveKey.value === 1 && scopeRunList.value.length)
      );
    });

    const isContent = computed(() => {
      //是否配置有效跑步模式
      return (
        runSetting.freePattern === 1 ||
        runSetting.scopePattern === 1 ||
        runSetting.fixedPointPattern === 1
      );
    });

    const resetRunSetting = () => {
      runSetting.freePattern = 0;
      runSetting.scopePattern = 0;
      runSetting.scopePercentage = 15;
      runSetting.fixedPointPattern = 0;
      runSetting.fixedPointPercentage = 15;
      runSetting.fixedPointOrder = 0;
      runSetting.fixedPointNumber = 3;
      runSetting.id = '';
    };

    const getCurrentRunSettingStr = computed(() => {
      const currentRunSettingArr = [];
      if (runSetting.freePattern === 1) {
        currentRunSettingArr.push('自由跑');
      }
      if (runSetting.scopePattern === 1) {
        currentRunSettingArr.push('范围跑');
      }
      if (runSetting.fixedPointPattern === 1) {
        currentRunSettingArr.push('定点跑');
      }
      return currentRunSettingArr.join('、');
    });

    const { schoolKey, schoolList } = useCampusInfo();

    const getCampusRunSetting = async () => {
      //查询校区跑步模式配置
      const params = {
        campusId: schoolKey.value
      };
      try {
        const {
          freePattern,
          scopePattern,
          scopePercentage,
          fixedPointPattern,
          fixedPointPercentage,
          fixedPointOrder,
          fixedPointNumber,
          id
        } = await RunSettingServicePresenter.patternInfo(params);

        runSetting.freePattern = freePattern;
        runSetting.scopePattern = scopePattern;
        runSetting.scopePercentage = scopePercentage;
        runSetting.fixedPointPattern = fixedPointPattern;
        runSetting.fixedPointPercentage = fixedPointPercentage;
        runSetting.fixedPointOrder = fixedPointOrder;
        runSetting.fixedPointNumber = fixedPointNumber;
        runSetting.id = id;
      } catch (error) {
        console.log(error);
        resetRunSetting();
      }
    };

    //切换学校
    watch(
      () => schoolKey.value,
      () => {
        getCampusRunSetting();
      }
    );

    getCampusRunSetting();

    const saveCampusRunSetting = async (data: any) => {
      //保存校区跑步模式
      const orgId = getStorageData('userInfo', 'schoolId');
      const saveParams = {
        organizationId: orgId,
        campusId: schoolKey.value,
        ...data,
        id: runSetting.id
      };

      try {
        await RunSettingServicePresenter.addPattern(saveParams);
        closeAppVisible.value = false;
        getCampusRunSetting();
      } catch (error) {
        console.log(error);
      }
    };

    // map

    const mapData: any = reactive({
      pointData: [],
      lineData: [],
      areaData: [],
      areaInvalidData: []
    });

    // 获取地图数据
    const getMapData = async (patternType: number) => {
      const params = {
        patternType,
        patternId: runSetting.id
      };
      // 没有runSetting.id则不请求
      if (!runSetting.id) return;
      const {
        areaData,
        areaInvalidData,
        pointData,
        lineData
      } = await RunSettingServicePresenter.PatternList(params);
      if (patternType === 1) {
        // 地图回显数据
        mapData.areaData = areaData.dataForMap;
        mapData.areaInvalidData = areaInvalidData.dataForMap;
        mapData.pointData = [];
        mapData.lineData = [];
        // 列表数据
        scopeRunList.value = [
          ...areaData.dataForList,
          ...areaInvalidData.dataForList
        ];
      } else if (patternType === 2) {
        // 地图回显数据
        mapData.areaData = areaData.dataForMap;
        mapData.areaInvalidData = areaInvalidData.dataForMap;
        mapData.pointData = pointData.dataForMap.flat(Infinity); //扁平化数组
        mapData.lineData = lineData.dataForMap;

        // 列表数据
        pointScopeList.value = [
          ...areaData.dataForList,
          ...areaInvalidData.dataForList
        ];
        pointList.value = pointData.dataForList.flat(Infinity); //扁平化数组
        lineList.value = lineData.dataForList;
      }
    };

    // 切换为范围跑的时候 修改drawType的值 更新数据列表
    watch(
      () => RunModalActiveKey.value,
      () => {
        if (RunModalActiveKey.value === 1) {
          drawType.value = 'effective';
        }
        getMapData(RunModalActiveKey.value);
      }
    );

    const {
      isAddDialog,
      isUpdateDialog,
      baseMapRef,
      validateInfos,
      clearMap,
      handleSave,
      handleSaveLine,
      handleSavaPoint,
      addAreaName,
      redirectName,
      showDeleteConfirm,
      updateAreaNameOk,
      handleCancle
    } = useAreaEdit(getMapData);

    watch(
      () => runSetting.id,
      newVal => {
        if (newVal !== '') {
          getMapData(RunModalActiveKey.value);
        }
      }
    );

    // 高亮显示数据
    const currentSelectMapData = reactive({
      selectType: 'point', //高亮类型 area invalid-area point line
      selectIndex: -1 //高亮索引
    });
    const activeIndex = ref(-1);

    //切换高亮数据
    const switchHeightlightArea = (index: number, type?: string) => {
      activeIndex.value = index;

      if (type) {
        currentSelectMapData.selectIndex = index;
        currentSelectMapData.selectType = type;
        return;
      }

      const EffectiveDataLength = mapData.areaData.length;
      let tempIndex = 0;
      let tempAreaType = '';

      if (index >= EffectiveDataLength) {
        tempIndex = index - EffectiveDataLength;
        tempAreaType = 'invalid-area';
      } else {
        tempIndex = index;
        tempAreaType = 'area';
      }
      currentSelectMapData.selectIndex = tempIndex;
      currentSelectMapData.selectType = tempAreaType;
    };

    const isEditState = ref(false);
    const handlequitEdit = () => {
      isEditState.value = false;
      // 退出编辑的时候清空未保存的点位或者线路
      if (drawType.value === 'point' || drawType.value === 'line') {
        clearMap();
      }
    };

    watch(
      () => drawType.value,
      () => {
        //切换定点跑类型的时候 清空未保存的点位 或 连线
        clearMap();
        // 高亮清空
        activeIndex.value = -1;
        currentSelectMapData.selectIndex = -1;
      }
    );

    const handleEditStateChange = () => {
      isEditState.value = true;
    };

    const formState = reactive({
      AreaName: ''
    });

    return {
      closeAppVisible,
      closeOpenRun,
      openRunModal,
      schoolKey,
      RunModalActiveKey,
      isContent,
      formState,
      schoolList,
      showDeleteConfirm,
      redirectName,
      isUpdateDialog,
      scopeRunList,
      pointScopeList,
      pointList,
      lineList,
      noListData,
      hasList,
      // map
      isAddDialog,
      drawType,
      mapData,
      currentSelectMapData,
      isEditState,
      handlequitEdit,
      handleEditStateChange,
      handleSave,
      handleSaveLine,
      handleSavaPoint,
      addAreaName,
      updateAreaNameOk,
      handleCancle,
      baseMapRef,
      switchHeightlightArea,
      activeIndex,
      saveCampusRunSetting,
      runSetting,
      getCurrentRunSettingStr,
      validateInfos,
      projectForm
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-radio-button-wrapper) {
  width: 100px;
  text-align: center;
}
:deep(.ant-tabs-nav-container .ant-tabs-nav-wrap) {
  background-color: #f0f2f5;
  padding: 0 20px;
}
:deep(.content_sidebar .ant-tabs-nav-wrap) {
  background-color: #fff;
}
.run_container {
  margin-top: 20px;
}
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 0px 20px 20px 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}

.App_entering {
  border-bottom: 1px solid gray;
  margin-top: 24px;
  padding-bottom: 15px;

  .App_dataEntering {
    font-weight: 600;
    margin-right: 100px;
    top: 50%;
    line-height: 35px;

    .App_update_btn {
      margin-left: 20px;
    }
  }
}
.close_run_function {
  font-weight: 600;
}
.close_run_message p {
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.content-wrap {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.content {
  text-align: center;
  .content_message {
    margin-top: 200px;
  }
  .content_btn {
    margin-top: 100px;
    margin-bottom: 100px;
  }
  .content_sidebar {
    width: 300px;
    box-shadow: 0px 0px 10px gray;
    z-index: 999;
    position: relative;

    .content_text {
      padding: 10px;
      background-color: #f0f2f5;
      border: 1px solid #d9d9d9;
    }
  }
}
.active {
  background: rgba(25, 102, 254, 0.1);
}
.content_area {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  position: relative;
  .areaname {
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .redirect {
    color: #1966fe;
    margin-right: 5px;
    cursor: pointer;
  }
  .delate {
    color: @error-color;
    cursor: pointer;
  }
  .none_area {
    position: absolute;
    top: 18px;
  }
}
.App_back_update {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.content_content {
  overflow: auto;
  max-height: calc(~'100vh - 450px - 112px');
  padding-bottom: 32px;
}
.content_right {
  display: flex;
  justify-content: flex-end;
}
.pt-100 {
  padding-top: 100px;
}
.mt-24 {
  margin-top: 24px;
}
</style>
