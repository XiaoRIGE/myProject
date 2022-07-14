<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <div v-if="schoolList.length > 0" class="test-wrap">
      <div>
        <a-radio-group v-model:value="campusRadio" button-style="solid">
          <a-radio-button
            v-for="item in schoolList"
            :key="item.id"
            :value="item.name"
            @click="schoolRadio(item)"
          >
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div v-if="isAppRunFunction" class="App_entering">
        <div class="App_dataEntering">
          App数据录入
        </div>
        <div class="App_closeApp" @click="closeApp">
          关闭APP跑步功能
        </div>
      </div>

      <div v-else>
        <div class="App_entering">
          <div class="App_dataEntering">
            App数据录入
          </div>
          <div class="App_closeApp" @click="openApp">
            开启APP跑步功能
          </div>
        </div>
        <div class="open_app_message">
          <div>通知公告：{{ infoMessage }}</div>
          <div class="update_message" @click="updateNotice">
            编辑公告
          </div>
        </div>
      </div>
      <div class="clock">
        <div class="clock-text">岗亭打卡录入</div>
        <a-button
          v-if="faceRunningStatus"
          class="clock-close"
          @click="
            closeClock({
              campusId: schoolData.data.campusId,
              campusName: schoolData.data.campusName,
              enableStatus: enableStatus,
              faceRunningStatus: false,
              id: schoolData.data.id,
              notice: infoMessage,
              organizationId: schoolData.data.organizationId
            })
          "
        >
          关闭岗亭打卡功能
        </a-button>
        <a-button
          v-else
          type="primary"
          class="clock-open"
          @click="
            openClock({
              campusId: schoolData.data.campusId,
              campusName: schoolData.data.campusName,
              enableStatus: enableStatus,
              faceRunningStatus: true,
              id: schoolData.data.id,
              notice: infoMessage,
              organizationId: schoolData.data.organizationId
            })
          "
        >
          开启岗亭打卡功能
        </a-button>
      </div>

      <TerminalDialog
        :close-app-visible="closeAppVisible"
        :message="dialogMessage"
        :school-data="schoolData"
        :campus-id="schoolData.data.campusId"
        :texttera="infoMessage"
        :face-running-status="faceRunningStatus"
        @change-visible="changeVisible"
        @change-visible-false="changeVisibleFalse"
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
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import TerminalDialog from './TerminalDialog/Index.vue';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { EnteringTerminalServicePresenter } from '@/request/api/presenter/runSettings';
import useClock from './useClock';

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const closeAppVisible = ref<boolean>(false);
  const dialogMessage = ref<string>('');

  // 展示弹窗
  const closeApp = () => {
    dialogMessage.value = '开启';
    closeAppVisible.value = true;
  };
  const openApp = () => {
    dialogMessage.value = '关闭';
    closeAppVisible.value = true;
  };
  const updateNotice = () => {
    dialogMessage.value = '编辑';
    closeAppVisible.value = true;
  };

  return {
    closeAppVisible,
    dialogMessage,
    closeApp,
    updateNotice,
    openApp
  };
};

export default defineComponent({
  components: { TerminalDialog },
  setup() {
    const {
      closeAppVisible,
      dialogMessage,
      closeApp,
      openApp,
      updateNotice
    } = useDialogModule();
    const spinning = ref<boolean>(false);
    const campusRadio = ref<string>('');
    const notification = ref<string>('');
    const infoMessage = ref<string | null>('');
    const isAppRunFunction = ref<boolean>(true);
    const faceRunningStatus = ref<boolean>(false);
    const enableStatus = ref<number>(0);
    const schoolList = ref([]);
    const schoolData = reactive({
      data: {
        id: '',
        organizationId: '',
        campusId: '',
        campusName: ''
      }
    });

    const swtichInfo = async function swtichInfo(): Promise<void> {
      spinning.value = true;
      try {
        const switchRes = await EnteringTerminalServicePresenter.searchInfo({
          campusId: schoolData.data.campusId
        });
        faceRunningStatus.value = switchRes.data.data.faceRunningStatus;
        enableStatus.value = switchRes.data.data.enableStatus;
        if (switchRes.data.code === 30004) {
          isAppRunFunction.value = true;
          infoMessage.value = '';
          schoolData.data.id = '';
          return;
        }
        if (switchRes.data.data.enableStatus === 0) {
          //开启状态
          isAppRunFunction.value = true;
        } else {
          isAppRunFunction.value = false;
        }
        infoMessage.value = switchRes.data.data.notice || '';
        schoolData.data.id = switchRes.data.data.id || '';
      } catch (error) {
        if (error && error.code === 30004) {
          isAppRunFunction.value = true;
          infoMessage.value = '';
          schoolData.data.id = '';
        }
      }
    };

    onMounted(async () => {
      try {
        const { data } = await CampusServicePresenter.queryAllCampus('');
        const schoolRes = data.data;
        schoolList.value = schoolRes;
        if (schoolRes && schoolRes.length > 0) {
          campusRadio.value = schoolRes[0].name;
          schoolData.data.organizationId = schoolRes[0].organizationId;
          schoolData.data.campusId = schoolRes[0].id;
          schoolData.data.campusName = schoolRes[0].name;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        await swtichInfo();
      } catch (error) {
        if (error.code === 30004) {
          isAppRunFunction.value = true;
        }
      } finally {
        spinning.value = false;
      }
    });

    const schoolRadio = async (data: any) => {
      //点击切换校区
      schoolData.data.organizationId = data.organizationId;
      schoolData.data.campusId = data.id;
      schoolData.data.campusName = data.name;
      try {
        await swtichInfo();
      } catch (error) {
        console.log(error);
        isAppRunFunction.value = true;
      } finally {
        spinning.value = false;
      }
    };

    const changeVisible = async (visibele: boolean) => {
      closeAppVisible.value = visibele;
      try {
        await swtichInfo();
      } catch (error) {
        console.log(error);
        isAppRunFunction.value = true;
      } finally {
        spinning.value = false;
      }
    };

    const changeVisibleFalse = (visibele: boolean) => {
      closeAppVisible.value = visibele;
    };

    return {
      closeAppVisible,
      closeApp,
      openApp,
      campusRadio,
      notification,
      isAppRunFunction,
      updateNotice,
      changeVisible,
      changeVisibleFalse,
      dialogMessage,
      schoolList,
      schoolRadio,
      schoolData,
      infoMessage,
      spinning,
      faceRunningStatus,
      enableStatus,
      ...useClock(faceRunningStatus)
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-modal-footer) {
  border-top: 5px solid red;
}
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}

.App_entering {
  border-bottom: 1px solid gray;
  display: flex;
  margin-top: 24px;
  padding-bottom: 15px;

  .App_dataEntering {
    font-weight: 600;
    margin-right: 100px;
    top: 50%;
    line-height: 35px;
  }

  .App_closeApp {
    padding: 5px 10px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
  }
}
.open_app_message {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-right: 40px;

  .update_message {
    color: blue;
    cursor: pointer;
  }
}
.mt-24 {
  margin-top: 24px;
}
.clock {
  display: flex;
  align-items: center;
  margin-top: 30px;
  &-text {
    font-weight: 600;
    margin-right: 100px;
    top: 50%;
    line-height: 35px;
  }
}
</style>
