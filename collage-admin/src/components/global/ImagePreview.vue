<template>
  <div v-if="showBannerDialog" @click="close">
    <div class="mask">
      遮罩层
    </div>
    <div class="preview-wrap">
      <img :src="props.previewImg" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    visibled: {
      type: Boolean,
      default: false
    },
    previewImg: {
      type: String,
      default: ''
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const previewImage = ref<string | undefined>('');
    const previewVisible = ref<boolean>(false);
    const showBannerDialog = computed(() => {
      return props.visibled;
    });

    const close = () => {
      emit('change-visible', 'ok');
    };

    return {
      showBannerDialog,
      close,
      previewVisible,
      previewImage,
      props
    };
  }
});
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
}
.preview-wrap {
  z-index: 1080;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    max-width: 100%;
    max-height: 700px;
    vertical-align: middle;
  }
}
</style>
