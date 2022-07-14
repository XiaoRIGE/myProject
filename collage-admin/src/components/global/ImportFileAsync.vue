<template>
  <a-upload
    v-model:file-list="fileList"
    :open-file-dialog-on-click="showVisible"
    name="file"
    :multiple="false"
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

  <a-modal
    :visible="loadingVisible"
    title="正在导入"
    width="580px"
    :footer="null"
    centered
    @cancel="importGradeCancel"
  >
    <div class="example">
      <a-spin :tip="`正在导入中，请稍后！`" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
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
    queryConditionService: {
      //查询导入情况 轮询接口
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
    const loadingVisible = ref(false);
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

    const setTime: any = ref();
    const examineCondition = async (val: string | null) => {
      try {
        let resData = {} as any;
        if (val) {
          const requestData = {
            key: val
          };
          resData = await props.queryConditionService(requestData);
        } else {
          resData = await props.queryConditionService();
        }
        const [key] = Object.keys(resData.data.data);
        const [value] = Object.values(resData.data.data);
        //0,null 导入成功。 -1,'等待超时'。 -2,'正在导入'。 1,key 导入失败
        if (key === '1') {
          loadingVisible.value = false;
          visible.value = true;
          errId.value = value as string;
          message.error('导入失败');
          progress.value = false;
          title.value = '导入失败';
        }

        if (key === '-1') {
          loadingVisible.value = false;
          Modal.error({
            title: '导入失败',
            content: '导入超时，请重试！'
          });
        }

        if (key === '-99') {
          loadingVisible.value = false;
          Modal.error({
            title: '导入失败',
            content: '文件错误，请检查文件！'
          });
        }

        if (key === '0') {
          loadingVisible.value = false;
          visible.value = false;
          message.success('导入成功');
          emit('import-excel-success', '导入成功');
        }

        if (key === '-2') {
          visible.value = false;
          setTime.value = setTimeout(() => {
            examineCondition(val);
          }, 1000);
        }
      } catch (error) {
        message.error(error ? error : '导入失败');
        progress.value = false;
        visible.value = false;
        title.value = '导入失败';
      }
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
        .then((res: any) => {
          const keyVal = res?.data?.data?.key || null;
          clearTimeout(setTime.value);
          loadingVisible.value = true;
          examineCondition(keyVal);
        })
        .catch((error: any) => {
          message.error(error ? error?.message : '导入失败');
          progress.value = false;
          visible.value = false;
          title.value = '导入失败';
        })
        .finally(() => {
          setStoreState('basic', 'readingFile', false); //重置文件读取状态
          percent.value = 100;
          fileList.value = [];
        });
    };

    const importExcelCancel = () => {
      visible.value = false;
    };

    const importGradeCancel = () => {
      loadingVisible.value = false;
    };
    const showVisible = computed(() => {
      return props.showFileDialog;
    });

    return {
      visible,
      loadingVisible,
      percent,
      importExcelCancel,
      importGradeCancel,
      beforeUpload,
      title,
      downLoadExcel,
      fileList,
      progress,
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
.example {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>
