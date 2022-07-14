<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    :multiple="false"
    :headers="headers"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <slot />
  </a-upload>
  <a-modal
    :visible="visible"
    :mask-closable="false"
    :keyboard="false"
    :footer="null"
    :title="title"
    width="580px"
    centered
    @cancel="importExcelCancel"
  >
    <a-progress v-if="progress" :percent="percent" />
    <a-progress v-else :percent="percent" status="exception" />
    <p class="importFileText">
      Excel表格名称，最多1行，超过省略
    </p>
    <div v-if="progress === false">
      <a-button style="margin-right:15px" @click="downLoadExcel">
        下载修正表格
      </a-button>
      <span>
        表格格式错误，点击下载修改
      </span>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export default defineComponent({
  props: {
    importService: {
      type: Function,
      required: true
    },
    exportErr: {
      type: Function,
      required: true
    },
    importServiceParams: {
      type: Object,
      required: true
    }
  },
  emits: ['import-excel-success'],
  setup(props, { emit }) {
    const visible = ref(false);
    const percent = ref(0);
    const progress = ref(true);
    const errId = ref('');
    const title = ref('正在导入');
    const fileList = ref<FileItem[]>([]);

    const beforeUpload = (file: FileItem) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const downLoadExcel = () => {
      const params = {
        key: errId.value
      };
      props.exportErr(params).then(() => {
        visible.value = false;
      });
    };

    const handleChange = (info: FileInfo) => {
      percent.value = 0;
      title.value = '正在导入';
      progress.value = true;
      visible.value = true;
      const formData = new FormData();
      fileList.value.forEach(() => {
        formData.append('file', info.file as any);
        for (const key in props.importServiceParams) {
          formData.append(key, props.importServiceParams[key]);
        }
      });
      props
        .importService(formData)
        .then((response: { message: string; data: any }) => {
          if (response.data.message === '失败') {
            errId.value = response.data.data;
            message.error(`${info.file.name} 导入失败`);
            progress.value = false;
            title.value = '导入失败';
            percent.value = 100;
            fileList.value = [];
          } else {
            fileList.value = [];
            progress.value = true;
            visible.value = false;
            title.value = '导入成功';
            percent.value = 100;
            message.success(`${info.file.name} 导入成功`);
            emit('import-excel-success', '导入成功');
          }
        })
        .catch(() => {
          message.error(`${info.file.name} 导入失败`);
          progress.value = false;
          title.value = '导入失败';
          percent.value = 100;
          fileList.value = [];
        });
    };

    const importExcelCancel = () => {
      visible.value = false;
    };

    return {
      visible,
      percent,
      importExcelCancel,
      beforeUpload,
      title,
      downLoadExcel,
      fileList,
      progress,
      headers: {
        authorization: 'authorization-text'
      },
      handleChange
    };
  }
});
</script>

<style lang="less" scoped>
.importFileText {
  margin-top: 10px;
}
</style>
