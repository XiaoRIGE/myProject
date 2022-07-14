<template>
  <a-upload
    v-model:file-list="fileList"
    :open-file-dialog-on-click="showVisible"
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
    <a-progress v-if="progress" :percent="uploadProgress" />
    <a-progress v-else :percent="uploadProgress" status="exception" />
    <a-spin v-if="readingFile" tip="文件解析中..." class="mt-24 center" />
    <div v-if="progress === false">
      <a-button
        style="margin-right: 15px;margin-top: 24px"
        @click="downLoadExcel"
      >
        下载修正表格
      </a-button>
      <span>表格格式错误，点击下载修改</span>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { setStoreState } from '@/store/utils';

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
      default: () => {
        return {};
      }
    },
    showFileDialog: {
      type: Boolean
    }
  },
  emits: ['import-excel-success'],
  setup(props, { emit }) {
    const store = useStore();
    const uploadProgress = computed(() => store.state.basic.uploadProgress);
    const readingFile = computed(() => store.state.basic.readingFile);

    const visible = ref(false);
    const percent = ref(0);
    const progress = ref(true);
    const errId = ref('');
    const title = ref('正在导入');
    const fileList = ref<FileItem[]>([]);

    const beforeUpload = (file: FileItem) => {
      fileList.value = [...fileList.value, file];
      setStoreState('basic', 'uploadProgress', 0); //上传之前将上传进度改为0
      setStoreState('basic', 'readingFile', false); //重置文件读取状态
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
      });

      for (const key in props.importServiceParams) {
        formData.append(key, props.importServiceParams[key]);
      }
      props
        .importService(formData)
        .then((response: any) => {
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
        .catch((error: any) => {
          message.error(error ? error : '导入失败');
          progress.value = false;
          visible.value = false;
          // message.error(`${info.file.name} 导入失败`);
          title.value = '导入失败';
          // percent.value = 100;
          // fileList.value = [];
        })
        .finally(() => {
          setStoreState('basic', 'readingFile', false); //重置文件读取状态
        });
    };

    const importExcelCancel = () => {
      visible.value = false;
    };
    const showVisible = computed(() => {
      return props.showFileDialog;
    });

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
      handleChange,
      showVisible,
      uploadProgress,
      readingFile
    };
  }
});
</script>

<style lang="less" scoped>
.mt-24 {
  margin-top: 24px;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.ant-spin-text) {
    margin-left: 24px;
  }
}
</style>
