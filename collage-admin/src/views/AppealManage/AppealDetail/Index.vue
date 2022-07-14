<template>
  <div class="header">
    <div class="header_top">
      <div class="name">{{ allMessage.name }} {{ allMessage.studentNum }}</div>
      <div v-if="isState">
        <a-button @click="ClickRefuse">
          拒绝
        </a-button>
        <a-button type="primary" @click="handlePass">
          通过
        </a-button>
      </div>
    </div>

    <div class="all_title">
      <p class="college">所在学院：{{ allMessage.collegeName }}</p>
      <p>年级：{{ allMessage.year }}级</p>
      <p>手机号：{{ allMessage.mobile }}</p>
      <p v-if="isState" class="state-absolute">
        申诉状态：
        <span class="pointer_blue">·</span>
        <span class="all_title_stateStr">
          {{ allMessage.handleStateStr }}
        </span>
      </p>
      <p v-if="!isState" class="state-absolute">
        申诉结果：
        <span v-if="allMessage.handleState !== 2" class="pointer">
          ·
        </span>
        <span v-else class="pointer_red">·</span>
        <span class="all_title_stateStr">
          {{ allMessage.handleStateStr }}
        </span>
      </p>
      <br />
      <p v-if="!isState">处理人：{{ allMessage.handlePersonName }}</p>
      <p v-if="!isState">处理时间：{{ allMessage.handleTime }}</p>
      <p v-if="!isState">申诉反馈：{{ allMessage.handleResult }}</p>
    </div>
  </div>
  <div v-if="allMessage.runningDetailsId" class="continer">
    <div class="title">
      跑步信息
    </div>
    <div class="text_field">
      <p>跑步方式：{{ allMessage.runningTypeName }}</p>
      <p v-if="allMessage.scoringType === 1">
        跑步总里程：{{ allMessage.totalMileage }}
      </p>
      <p v-if="allMessage.scoringType === 2">
        跑步总段数：{{ allMessage.totalMileage }}
      </p>
      <p v-if="allMessage.scoringType === 1">
        <span v-if="allMessage.operationmileage === null">
          有效里程：{{ allMessage.effectiveMileage }}km
        </span>
        <span v-else>有效里程：{{ allMessage.operationMileage }}km</span>
      </p>
      <p v-if="allMessage.scoringType === 2">
        <span v-if="allMessage.operationPart === null">
          有效段数：{{ allMessage.effectivePart }}段
        </span>
        <span v-else>有效段数：{{ allMessage.operationPart }}段</span>
      </p>
      <p>运动时长：{{ allMessage.keepTimeVal }}</p>
      <p>跑步时间：{{ allMessage.startTime }}</p>
    </div>
  </div>
  <div class="continer">
    <div class="title">
      申诉信息
    </div>
    <div class="text_field">
      <p>申诉类型：{{ allMessage.appealTypeStr }}</p>
      <p>申诉描述：{{ allMessage.appealReason }}</p>
      <p style="display:flex">
        <span>上传凭证：</span>
        <img
          v-for="(item, index) in allMessage.url"
          :key="item.id"
          alt="example"
          class="background-img"
          :src="item"
          @click="handleImage(allMessage.url[index])"
        />
      </p>
      <p>申诉时间：{{ allMessage.appealTime }}</p>
    </div>
  </div>

  <a-modal
    v-model:visible="isShowRefuseDialog"
    centered
    :mask-closable="false"
    @ok="saveAppDialog(2)"
    @cancel="closeAppDialog"
  >
    <div class="run_function">
      <div>
        <p class="close_run_function">
          拒绝申诉申请
        </p>
      </div>
      <div class="log_content">
        <div class="log_text">
          <a-form
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-form-item label="拒绝原因" v-bind="validateInfos.refuseCause">
              <a-textarea
                v-model:value="form.refuseCause"
                placeholder="请输入"
                :rows="6"
                :maxlength="1000"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </a-modal>
  <ImagePreview
    :visibled="previewImgVisible"
    :preview-img="previewImg"
    @change-visible="changePreviewImg"
  />
  <RunParticularDialog
    :visible="dialogVisible"
    :prop-data="propData.data"
    @change-visible="changeVisible"
    @refresh="refreshList"
  />
  <AddRunData
    :visible="addRunVisible"
    :dialog-data="addRunningData"
    @handle-sure="handleSure"
    @handle-close="handleClose"
  />
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ApealManageServicePresenter } from '@/request/api/presenter/apeal';
import { useForm } from '@ant-design-vue/use';
import { message } from 'ant-design-vue';
import ImagePreview from '@/components/global/ImagePreview.vue';
import RunParticularDialog from '@/views/ClassSetting/MyClassInfo/ClassDetail/RunCondition/RunningData/RunParticularDialog/Index.vue';
import AddRunData from '@/components/global/AddRunData.vue';

export default defineComponent({
  components: {
    ImagePreview,
    RunParticularDialog,
    AddRunData
  },
  setup() {
    const disposeOrPass = ref<boolean>(true); //true 已通过
    const addRunVisible = ref<boolean>(false);
    const isShowRefuseDialog = ref<boolean>(false);
    const form = reactive({
      refuseCause: ''
    });
    const route = useRoute();
    const allMessage = ref<any>([]);
    const isState = ref<boolean>(true); //true待处理
    const queryList = async () => {
      const data = {
        id: route.params.data1
      };
      try {
        const res = await ApealManageServicePresenter.apealInfo(data as any);
        allMessage.value = res;
        if (res.handleState === 0) {
          isState.value = true;
        } else {
          isState.value = false;
        }
      } catch (error) {
        console.log(error);
      }
    };
    queryList();

    const rules = reactive({
      refuseCause: [{ required: true, message: '必填' }]
    });
    const { resetFields, validate, validateInfos } = useForm(form, rules);

    const ClickRefuse = () => {
      isShowRefuseDialog.value = true;
    };

    //value  通过1  拒绝2
    const passOrDown = async (value: number) => {
      const data = {
        id: allMessage.value.id,
        result: form.refuseCause,
        state: value
      };
      try {
        const res = await ApealManageServicePresenter.passOrTurndown(data);
        if (res.data === false) {
          message.error(res.message);
          return;
        }
        if (value === 2) {
          message.success('拒绝成功');
        }
        queryList();
        isShowRefuseDialog.value = false;
        resetFields();
      } catch (error) {
        message.error(error.message);
      }
    };

    const saveAppDialog = (value: number) => {
      if (value === 2) {
        validate()
          .then(async () => {
            //state通过1拒绝2
            await passOrDown(value);
          })
          .catch(err => {
            console.log('error', err);
          });
      } else {
        passOrDown(value);
      }
    };
    const closeAppDialog = () => {
      resetFields();
    };

    const previewImgVisible = ref<boolean>(false);
    const changePreviewImg = () => {
      previewImgVisible.value = false;
    };
    const previewImg = ref<string>('');
    const handleImage = (data: any) => {
      previewImg.value = data;
      previewImgVisible.value = true;
    };

    const propData = reactive({
      data: {
        id: '',
        runningType: 0, //一范围跑 二定点跑
        userId: ''
      }
    });
    const dialogVisible = ref<boolean>(false);
    const changeVisible = (visibele: boolean) => {
      dialogVisible.value = visibele;
    };
    // 修改成功回调
    const refreshList = async () => {
      form.refuseCause = '跑步数据已更新';
      dialogVisible.value = false;
      await saveAppDialog(1);
    };

    const addRunningData = reactive({
      data: {
        id: '',
        type: 0
      }
    });
    const handlePass = () => {
      propData.data.id = allMessage.value.runningDetailsId;
      propData.data.runningType = allMessage.value.runningType;
      propData.data.userId = allMessage.value.userId;
      if (allMessage.value.runningDetailsId) {
        dialogVisible.value = true;
      } else {
        addRunningData.data.type = allMessage.value.scoringType;
        addRunningData.data.id = allMessage.value.userId;
        addRunVisible.value = true;
      }
    };
    const handleClose = () => {
      addRunVisible.value = false;
    };
    const handleSure = (value: string) => {
      addRunVisible.value = false;
      form.refuseCause = value;
      passOrDown(1);
      queryList();
    };
    return {
      isShowRefuseDialog,
      disposeOrPass,
      ClickRefuse,
      handlePass,
      form,
      allMessage,
      isState,
      saveAppDialog,
      closeAppDialog,
      validateInfos,
      rules,
      handleImage,
      previewImgVisible,
      changePreviewImg,
      previewImg,
      dialogVisible,
      changeVisible,
      refreshList,
      propData,
      addRunVisible,
      handleClose,
      handleSure,
      addRunningData
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  margin-top: 13px;
}
.header {
  background-color: #fff;
  padding: 0 25px 10px 25px;
  .header_top {
    display: flex;
    justify-content: space-between;
    button {
      margin-right: 20px;
    }
  }
  .name {
    font-weight: 650;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 10px;
  }
  .all_title {
    font-size: 14px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    .college {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state-absolute {
      position: relative;
    }
    .all_title_stateStr {
      margin-left: 18px;
    }
    .pointer {
      color: #10c700;
      font-size: 60px;
      margin-right: 6px;
      position: absolute;
      top: -41px;
    }
    .pointer_blue {
      color: #1890ff;
      font-size: 60px;
      margin-right: 6px;
      position: absolute;
      top: -41px;
    }
    .pointer_red {
      color: #ff1919;
      font-size: 60px;
      margin-right: 6px;
      position: absolute;
      top: -41px;
    }
    p {
      width: 320px;
      margin-bottom: 10px;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}

.continer {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-weight: 650;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
  .text_field {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    p {
      width: 450px;
      margin-right: 20px;
    }
    .background-img {
      width: 80px;
      height: 80px;
      margin-right: 10px;
      cursor: pointer;
      object-fit: cover;
    }
  }
}
.log_content {
  display: flex;

  .log_text {
    width: 100%;
    position: relative;

    span {
      position: absolute;
      right: 20px;
      bottom: 10px;
      color: #d9d9d9;
    }
  }
}
</style>
