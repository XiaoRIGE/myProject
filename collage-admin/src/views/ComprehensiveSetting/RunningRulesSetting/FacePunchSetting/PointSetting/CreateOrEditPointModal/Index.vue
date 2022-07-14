<template>
  <a-modal
    v-model:visible="visibleProps"
    class="modal"
    :title="`${pointId === '' ? '新建' : '编辑'}打卡点位`"
    :width="686"
    @ok="savePoint"
  >
    <a-spin :spinning="isLoading">
      <a-form
        :model="formData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        class="modal__form"
      >
        <a-form-item label="点位名称" name="pointName">
          <a-input
            v-model:value="formData.pointName"
            placeholder="请输入点位名称"
          />
        </a-form-item>
        <a-form-item label="设备待机图" name="deviceImage">
          <div class="modal__form__device-image">
            <UploadImage
              v-model:fileList="formData.fileList"
              accept=".jpg"
              :before-upload="file => onBeforeDeviceImageUpload(file)"
            />
            <div class="modal__form__device-image__tip">
              格式：jpg，尺寸：600x1024，单张大小不超过500K
            </div>
          </div>
        </a-form-item>

        <div class="modal__form__device">
          <div class="modal__form__device__title">
            <div class="modal__form__device__title__id">
              设备序列号：
            </div>
            <div class="modal__form__device__title__account">
              账号：
            </div>
            <div class="modal__form__device__title__password">
              密码：
            </div>
            <div class="modal__form__device__title__action" />
          </div>
          <div
            v-for="(item, index) of formData.deviceList"
            :key="index"
            class="modal__form__device__form"
          >
            <div class="modal__form__device__form__id">
              <a-input v-model:value="item.serialNumber" />
            </div>
            <div class="modal__form__device__form__account">
              <a-input v-model:value="item.account" />
            </div>
            <div class="modal__form__device__form__password">
              <a-input v-model:value="item.password" />
            </div>
            <div class="modal__form__device__form__action">
              <DeleteOutlined
                v-if="formData.deviceList.length > 1"
                class="modal__form__device__form__action__delete"
                @click="() => deleteDevice(index)"
              />
            </div>
          </div>
          <div class="modal__form__device__add-device" @click="addDevice">
            <PlusOutlined color="#1966fe" />
            添加设备
          </div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import UploadImage from '@/components/global/UploadImage.vue';
import { getImageSize } from '@/utils/common';
import request from '@/request-v2/api';
import { SavePointFormData } from './types';

export default defineComponent({
  name: 'CreateOrEditPointModal',
  components: {
    DeleteOutlined,
    PlusOutlined,
    UploadImage
  },
  props: {
    /**
     * 是否展示弹窗
     */
    visible: {
      type: Boolean,
      default: true
    },

    /**
     * 校区ID
     */
    campusId: {
      type: String,
      default: '',
      required: true
    },

    /**
     * 点位ID(仅在修改时传递)
     */
    pointId: {
      type: String,
      default: ''
    }
  },
  emits: ['update:visible', 'submit'],
  setup(props, { emit }) {
    const isLoading = ref(false);

    const visibleProps = computed({
      get: () => props.visible,
      set: value => emit('update:visible', value)
    });

    /**
     * 表单数据
     */
    const formData = reactive<SavePointFormData>({
      pointName: '',
      fileList: [],
      deviceList: [
        {
          serialNumber: '',
          account: '',
          password: ''
        }
      ]
    });

    /**
     * 移除指定设备表单项
     * @param index 指定删除的序号
     */
    const deleteDevice = (index: number) =>
      formData.deviceList.splice(index, 1);

    /**
     * 追加一行设备表单项
     */
    const addDevice = () =>
      formData.deviceList.push({
        serialNumber: '',
        account: '',
        password: ''
      });

    /**
     * 图片上传前钩子函数
     * @param file 图片文件
     */
    const onBeforeDeviceImageUpload = (file: any) =>
      new Promise<void>((resolve, reject) => {
        const imageBlob = window.URL.createObjectURL(file);
        getImageSize(imageBlob).then(imageSize => {
          const IS_ILLEGAL_SIZE_RATIO =
            (imageSize.width / 600) * 1024 === imageSize.height;
          const IS_ILLEGAL_FILE_SIZE = file.size > 500;

          if (!IS_ILLEGAL_SIZE_RATIO || !IS_ILLEGAL_FILE_SIZE) {
            const ERROR_MESSAGE =
              '仅可上传分辨率600*1024，500K以内的jpg格式的图片';
            message.error(ERROR_MESSAGE);
            reject(ERROR_MESSAGE);
          } else {
            resolve();
          }
        });
      });

    /**
     * 表单验证
     */
    const checkForm = () => {
      const IS_POINT_NAME_EMPTY = formData.pointName === '';
      const IS_DEVICE_LIST_EMPTY =
        formData.deviceList
          .map(item => {
            let result = false;
            Object.values(item).forEach(value => {
              if (value === '' || value === undefined) {
                result = true;
              }
            });
            return result;
          })
          .indexOf(true) !== -1;

      console.log(IS_DEVICE_LIST_EMPTY);

      const POINT_NAME_EMPTY_ERROR_TEXT = '点位名称不能为空';
      const DEVICE_LIST_EMPTY_ERROR_TEXT = '设备配置不能为空';

      const checkList = [
        {
          isError: IS_POINT_NAME_EMPTY,
          errorText: POINT_NAME_EMPTY_ERROR_TEXT
        },
        {
          isError: IS_DEVICE_LIST_EMPTY,
          errorText: DEVICE_LIST_EMPTY_ERROR_TEXT
        }
      ];

      checkList.map(item => {
        if (item.isError === true) {
          message.error(item.errorText);
          throw new Error(item.errorText);
        }
      });
    };

    /**
     * 保存点位
     */
    const savePoint = async () => {
      checkForm();
      await request.saveFacePunchPoint(props.campusId, {
        pointId: props.pointId === '' ? undefined : props.pointId,
        pointName: formData.pointName,
        assetList: formData.fileList
          .filter(value => value.status === 'done')
          .map(item => ({
            url:
              item.uid.indexOf('uploaded-') === -1
                ? item.response.data
                : item.url
          })),
        deviceList: formData.deviceList.map(item => ({
          ...item
        }))
      });

      visibleProps.value = false;
      emit('submit');
    };

    /**
     * 加载表单数据
     */
    const loadForm = async () => {
      if (props.pointId !== '') {
        isLoading.value = true;

        const pointInfo = await request.getFacePunchPointDetail(props.pointId);
        formData.pointName = pointInfo.pointName;
        formData.deviceList = pointInfo.deviceList;
        pointInfo.assetList?.map((item, index) =>
          formData.fileList.push({
            uid: `uploaded-${index}`,
            name: `设备待机图${index}`,
            status: 'done',
            url: item.url
          })
        );

        isLoading.value = false;
      }
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
      formData.pointName = '';
      formData.fileList = [];
      formData.deviceList = [
        {
          serialNumber: '',
          account: '',
          password: ''
        }
      ];
    };

    watch(
      () => props.visible,
      newValue => {
        if (newValue === true) {
          loadForm();
        } else {
          resetForm();
        }
      }
    );

    return {
      isLoading,
      visibleProps,
      formData,
      deleteDevice,
      addDevice,
      onBeforeDeviceImageUpload,
      savePoint
    };
  }
});
</script>

<style lang="less" scoped>
.modal {
  &__form {
    &__device-image {
      &__tip {
        margin-top: -20px;
        color: gray;
        font-size: 12px;
      }
    }

    &__device {
      margin-left: calc(~'100% / 24 * 5');
      margin-top: -20px;

      &__form {
        margin-top: 5px;
      }

      &__title,
      &__form {
        display: flex;
        align-items: center;
        &__id {
          width: 39%;
        }
        &__account,
        &__password {
          width: 26%;
          margin-left: 1%;
        }
        &__action {
          width: 2%;
          margin-left: 3%;
        }
      }

      &__form {
        &__action {
          &__delete {
            cursor: pointer;
          }
        }
      }

      &__add-device {
        margin-top: 10px;
        cursor: pointer;
        color: #1966fe;
      }
    }
  }
}

:deep(.ant-upload-select-picture-card) {
  height: 146px !important;
  width: 93px !important;
}

:deep(.ant-upload-list-picture-card-container) {
  height: 146px !important;
  width: 93px !important;
}

:deep(.ant-upload-list-item-list-type-picture-card) {
  height: 146px !important;
  width: 93px !important;
}
</style>
