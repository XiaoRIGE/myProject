<template>
  <a-modal
    v-model:visible="showVisible"
    centered
    :mask-closable="false"
    @ok="saveAppDialog"
    @cancel="closeAppDialog"
  >
    <div class="run_function">
      <div v-if="message === '关闭'">
        <p class="close_run_function">
          确认开启跑步功能
        </p>
        <p class="close_run_message">
          开启后学生在APP中可使用跑步功能
        </p>
      </div>
      <div v-else-if="message === '开启'">
        <p class="close_run_function">
          关闭APP跑步功能
        </p>
        <p class="close_run_message">
          确认关闭后，APP数据将不再录入，并需填写告知学生消息公告。（消息公告不能为空）
        </p>
      </div>
      <div v-else>
        <p class="close_run_function close_run_function_height">
          编辑通知公告
        </p>
      </div>
      <div v-if="message === '开启' || message === '编辑'" class="log_content">
        <div class="log_span">
          <span>
            通知公告：
          </span>
        </div>
        <div class="log_text">
          <a-textarea
            v-model:value="notification"
            :oninput="(notification = notification.replace(/\s+/g, ''))"
            placeholder="请输入通知公告"
            :rows="6"
            :maxlength="200"
          />
          <span>已输入{{ notification.length }}/200</span>
          <p v-if="warningTitle" class="warning_text">
            不能输入小于10个文字
          </p>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue';
import { EnteringTerminalServicePresenter } from '@/request/api/presenter/runSettings';

export default defineComponent({
  props: {
    closeAppVisible: {
      type: Boolean
    },
    message: {
      type: String,
      default: ''
    },
    texttera: {
      type: String,
      default: ''
    },
    campusId: {
      type: String,
      required: true
    },
    schoolData: {
      type: Object,
      default: () => ({})
    },
    faceRunningStatus: {
      type: Boolean,
      required: true
    }
  },
  emits: ['change-visible', 'change-visible-false'],

  setup(props, { emit }) {
    const notification = ref<string>('');
    const warningTitle = ref<boolean>(false);
    const requestData = reactive({
      data: {
        campusId: '',
        campusName: '',
        id: '',
        organizationId: ''
      }
    });

    const showVisible = computed(() => {
      return props.closeAppVisible;
    });

    watchEffect(() => {
      requestData.data = props.schoolData.data;
      if (props.message === '编辑') {
        notification.value = props.texttera;
      } else {
        notification.value = '';
      }
    });
    const saveAppDialog = async () => {
      //保存
      const data = {
        campusId: props.campusId,
        campusName: requestData.data.campusName,
        id: requestData.data.id,
        organizationId: requestData.data.organizationId,
        enableStatus: -1,
        faceRunningStatus: false,
        notice: notification.value
      };

      if (props.message === '开启') {
        data.enableStatus = -1;
        if (notification.value.length < 10) {
          warningTitle.value = true;
          return;
        } else {
          try {
            await EnteringTerminalServicePresenter.switch(data);
            warningTitle.value = false;
            notification.value = '';
            emit('change-visible', false);
            notification.value = '';
          } catch (error) {
            console.log(error);
          }
        }
      } else if (props.message === '关闭') {
        data.enableStatus = 0;
        try {
          await EnteringTerminalServicePresenter.switch(data);
          warningTitle.value = false;
          notification.value = '';
          emit('change-visible', false);
        } catch (error) {
          console.log(error);
        }
      } else {
        data.enableStatus = -1;
        try {
          await EnteringTerminalServicePresenter.switch(data);
          warningTitle.value = false;
          notification.value = '';
          emit('change-visible', false);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const closeAppDialog = () => {
      notification.value = '';
      emit('change-visible-false', false);
    };

    return {
      notification,
      showVisible,
      saveAppDialog,
      closeAppDialog,
      warningTitle
    };
  }
});
</script>
<style lang="less" scoped>
.run_function {
  .close_run_function {
    font-weight: 600;
  }
  .close_run_function_height {
    margin-bottom: 40px;
  }
  .close_run_message {
    color: grey;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 20px;
  }
}

.log_content {
  display: flex;

  .log_span {
    width: 100px;
  }

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
.warning_text {
  color: red;
  position: absolute;
}
</style>
