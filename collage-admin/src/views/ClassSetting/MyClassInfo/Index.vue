<template>
  <h1>我的班级</h1>
  <a-button type="primary" @click="test">
    班级详情
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const router = useRouter();
    const test = () => {
      router.push({ name: 'ClassDetail' });
    };
    return {
      test
    };
  }
});
</script>

<style lang="less" scoped>

</style>
