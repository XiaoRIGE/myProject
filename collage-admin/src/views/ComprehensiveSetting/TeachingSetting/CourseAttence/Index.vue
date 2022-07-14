<!--
 * @Author: lyh
 * @Date: 2021-07-08 10:29:06
 * @LastEditTime: 2021-09-27 16:49:51
 * @LastEditors: Please set LastEditors
 * @Description: 考勤设置
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\TeachingSetting\CourseAttence\Index.vue
-->
<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <div class="test-wrap">
      <div>
        <div class="attence_modal">
          考勤模式
        </div>
        <div class="attence_modal">
          每学期要求考勤次数：
        </div>
        <div v-if="attenceBtnShow" class="attence_header">
          <span v-if="resType === 1">
            <span>固定：</span>
            <span style="margin-right:20px;color:blue;">
              {{ organizationData.data.frequency }}次
            </span>
          </span>
          <span v-else>
            <span style="margin-right:20px;">不固定</span>
          </span>
          <span>单次考勤得分=100/固定次数</span>
        </div>

        <div v-else class="attence_header">
          <a-radio-group v-model:value="radioValueFirst">
            <div>
              <a-radio class="attence_radio_first" :value="2">
                <span class="attence_fixed">不固定</span>
                <span>
                  单次考勤得分=100/教师实际考勤次数
                </span>
              </a-radio>
            </div>
            <a-radio :value="1">
              <span class="attence_fixed">
                固定
                <a-input-number
                  id="inputNumber"
                  v-model:value="fixedValue"
                  :disabled="radioValueFirst === 2"
                  :min="1"
                  :max="100"
                />
                次
              </span>
              <span>单次考勤得分=100/教师实际考勤次数</span>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div
        v-if="organizationData.data.type === 1 || radioValueFirst === 1"
        class="attence_next"
      >
        <div class="attence_modal">
          记分规则：
        </div>
        <div>
          <p>若教师开放签到次数不足，不足次数将按全勤处理；</p>
          <p>若教师开放签到次数超出，最高分不超过100分，最低分不低于0分。</p>
        </div>
        <div v-if="attenceBtnShow">
          <p v-if="organizationData.data.scoringRules === 2">
            <span style="margin-right:20px;color:black;">
              加分制
            </span>
            <span>
              从0分开始，每到一次加一次单次考勤分，最高100分。
            </span>
          </p>
          <p v-else>
            <span style="margin-right:20px;color:black;">
              扣分制
            </span>
            <span>
              从100分开始，每不到一次扣一次单次考勤分，最低0分。
            </span>
          </p>
        </div>
        <div v-else>
          <a-radio-group
            v-if="radioValueFirst === 1"
            v-model:value="radioValueTwice"
          >
            <div>
              <a-radio class="attence_radio_first" :value="1">
                <span class="attence_fixed">
                  扣分制
                </span>
                <span>
                  从100分开始，每不到一次扣一次单次考勤分，最低0分。
                </span>
              </a-radio>
            </div>
            <a-radio :value="2">
              <span class="attence_fixed">
                加分制
              </span>
              <span>从0分开始，每到一次加一次单次考勤分，最高100分。</span>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div v-if="attenceBtnShow">
        <a-button
          class="attence_redact_btn"
          type="primary"
          @click="updateAttence"
        >
          编辑
        </a-button>
      </div>
      <div v-else>
        <a-button
          class="attence_redact_btn"
          style="margin-right:20px"
          @click="attenceBtnClose"
        >
          取消
        </a-button>
        <a-button class="attence_redact_btn" @click="checkingSave">
          保存
        </a-button>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { CheckingServicesModal } from '@/request/api/model/checking';

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const attenceBtnShow = ref<boolean>(true);
  const radioStyle = reactive({
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  });

  return {
    attenceBtnShow,
    radioStyle
  };
};

export default defineComponent({
  setup() {
    const spinning = ref<boolean>(false);
    const radioValueFirst = ref<number>(1);
    const radioValueTwice = ref<number>(1);
    const fixedValue = ref<number>(0);
    const disabled = ref<boolean>(true);
    const resType = ref<number>(1);
    const organizationData = reactive({
      data: {}
    });
    const { attenceBtnShow } = useDialogModule();

    const checkingList = async function checkingList(): Promise<void> {
      spinning.value = true;
      try {
        const res = await CheckingServicesModal.CheckingList('');
        organizationData.data = res.data.data;
        resType.value = res.data.data.type;
        radioValueFirst.value = res.data.data.type;
        fixedValue.value = res.data.data.frequency;
      } catch (error) {
        console.log(error);
      } finally {
        spinning.value = false;
      }
    };

    onMounted(async () => {
      checkingList();
    });

    const updateAttence = () => {
      attenceBtnShow.value = false;
    };

    const checkingSave = async () => {
      const data = {
        type: radioValueFirst.value,
        scoringRules: radioValueTwice.value,
        frequency: fixedValue.value,
        organizationId: ''
      };
      try {
        await CheckingServicesModal.updateCheckingList(data);
        message.success('保存成功');
        attenceBtnShow.value = true;
        checkingList();
      } catch (error) {
        message.error('保存失败');
      }
    };

    const attenceBtnClose = async () => {
      attenceBtnShow.value = true;
      checkingList();
    };

    return {
      attenceBtnShow,
      radioValueFirst,
      organizationData,
      resType,
      disabled,
      checkingSave,
      radioValueTwice,
      fixedValue,
      attenceBtnClose,
      updateAttence,
      spinning
    };
  }
});
</script>

<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
.attence_modal {
  margin-bottom: 20px;
}
.attence_header {
  border-bottom: 1px solid #c3c6c9;
  padding-bottom: 35px;
}
.attence_next {
  padding-top: 35px;
  margin-bottom: 20px;
}
.attence_redact_btn {
  margin-top: 15px;
}
.attence_radio_first {
  margin-bottom: 10px;
}
.attence_fixed {
  margin-right: 20px;
}
</style>
