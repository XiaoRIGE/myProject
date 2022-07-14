import ApiPrefix from '@/request/config/prefix';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
export default function useUploadAvatar(userFrom: any) {
  const accessToken = localStorage.getItem('accessToken');
  const uploadUrlHeaders = {
    Authorization: `Bearer ${accessToken}`
  };
  const loadings = ref<boolean>(false);

  const fileList = ref([]) as any;

  const uploadPlanUrl = `${process.env.VUE_APP_BASE_URL}${ApiPrefix.FASERUNNING}/facePhoto/uploadFacePhoto`;

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      loadings.value = true;
      return;
    }
    if (info.file.status === 'done') {
      userFrom.faceUrl = info.fileList[info.fileList.length - 1].response.data;
      loadings.value = false;
    }
    if (info.file.status === 'error') {
      loadings.value = false;
      message.error('upload error');
    }
  };

  return {
    uploadUrlHeaders,
    uploadPlanUrl,
    loadings,
    handleChange,
    fileList
  };
}
