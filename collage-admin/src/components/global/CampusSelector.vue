<template>
  <a-radio-group v-model:value="campus" button-style="solid">
    <a-radio-button v-for="item in campusList" :key="item.id" :value="item.id">
      {{ item.name }}
    </a-radio-button>
  </a-radio-group>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, computed } from 'vue';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { CampusInfo } from '@/@types';

export default defineComponent({
  props: {
    /**
     * 当前选中的校区
     */
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    /**
     * 当前选中的校区
     */
    const campus = computed({
      get: () => props.value,
      set: newValue => emit('update:value', newValue)
    });

    /**
     * 校区列表
     */
    const campusList = ref<CampusInfo[]>([]);

    /**
     * 获取校区列表
     */
    const getPageData = async () => {
      campusList.value = await CampusServicePresenter.getCampusList();
      campusList.value.map((item, index) => {
        if (index === 0) {
          campus.value = item.id;
        }
      });
    };

    onBeforeMount(async () => await getPageData());

    return {
      campus,
      campusList
    };
  }
});
</script>
