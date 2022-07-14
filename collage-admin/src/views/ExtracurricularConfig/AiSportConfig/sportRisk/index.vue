<template>
  <div class="test-wrap">
    <div class="flex-box">
      <p>
        <span class="title">清单内容</span>
        <span>学生在运动开始前查看的运动风险自查清单</span>
      </p>
      <div>
        <a-button v-show="!isEdit" type="primary" @click="isEdit = true">
          编辑
        </a-button>
        <div v-show="isEdit">
          <a-space :size="24">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleSave">保存</a-button>
          </a-space>
        </div>
      </div>
    </div>
    <div class="input-box">
      <!-- <a-textarea
        v-model:value="textRef"
        :maxlength="10000"
        show-count
        placeholder="请输入1000以内的文字"
        :disabled="!isEdit"
        :rows="26"
      /> -->
      <!-- :toolbar="true" -->
      <!-- :plugins="true" -->
      <Editor
        :value="textRef"
        :disabled="!isEdit"
        :toolbar="toolbarRef"
        :plugins="pluginRef"
        @input="handleChange"
      ></Editor>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AImovementPresenter } from '@/request/api/presenter/class';
import Editor from '@/components/global/Editor.vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  components: { Editor },
  setup() {
    const defaultValue = `
    如果你在这一部分中标记出了任何一个陈述，那么在运动前向你的医生或其他健康管理者咨询。你可能需要在某个经过认证的医务人员的监护下进行健身。

    你曾经有过

    病史 ：

    一次心脏病发作

    心脏手术

    心脏导管插入术

    冠状动脉成形术（PTCA）

    起搏器/可植入的心脏除颤仪/心律失常

    心脏瓣膜疾病

    心力衰竭

    心脏移植

    先天性心脏病

    症状：

    你做体力活动时有过胸部不适

    你有过原因不明的呼吸停止

    你有过头昏眼花、晕倒或者眩晕

    你服用治疗心脏病的药物

    其他健康问题

    你有哮喘或其他肺部疾病

    当短距离行走时，你的小腿有发热或抽筋感

    你有限制你体力活动的肌肉骨骼问题

    你关心运动的安全性

    你服用处方药

    如果你在这一部分中标记出了两个或更多的陈述，那么你应该在运动前向医生或其他健康管理者咨询。要由运动专业人员指导你做健身运动。`;

    const idRef = ref<string>('');
    const textRef = ref<string>(defaultValue);
    const currentRiskTextRef = ref<string>(''); //学校的当前风险清单内容（服务端值，点击取消的时候要重置为这个值）
    const isEdit = ref<boolean>(false);
    const toolbarRef =
      'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough  anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                table charmap hr pagebreak insertdatetime print preview | code selectall | indent2em lineheight formatpainter axupimgs';
    const pluginRef =
      'print preview searchreplace autolink directionality visualblocks visualchars fullscreen  code table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave';

    const getRiskText = async () => {
      try {
        const { id, text } = await AImovementPresenter.getRisk();
        idRef.value = id;
        textRef.value = text;
        currentRiskTextRef.value = text;
      } catch (error) {
        console.log(error);
      }
    };

    const handleChange = (text: string) => {
      textRef.value = text;
    };

    getRiskText();

    const handleCancel = () => {
      isEdit.value = false;
      textRef.value = currentRiskTextRef.value;
    };

    const editRisk = async () => {
      try {
        const params = {
          id: idRef.value,
          text: textRef.value
        };
        await AImovementPresenter.editRisk(params);
        message.success('编辑成功！');
        isEdit.value = false;
        currentRiskTextRef.value = textRef.value;
      } catch (error) {
        console.log(error);
        message.warning('编辑失败，请重试！');
      }
    };

    const handleSave = () => {
      editRisk();
    };
    return {
      textRef,
      isEdit,
      toolbarRef,
      pluginRef,
      handleSave,
      handleCancel,
      handleChange
    };
  }
});
</script>
<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    .title {
      font-weight: 600;
      // font-size: 16px;
      margin-right: 24px;
      top: 50%;
      line-height: 35px;
      color: #333;
    }
  }
}
</style>
