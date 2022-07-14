<template>
  <div class="no_access">
    <img src="../assets/403.png" class="no-access-img" />
    <h1 class="center">对不起，你暂无该页面访问权限！</h1>
    <a-button type="primary" @click="handleBack">返回</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const router = useRouter();
    const handleBack = () => {
      router.go(-1);
    };
    return { handleBack };
  }
});
</script>

<style lang="less" scoped>
.no_access {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .no-access-img {
    margin-top: 60px;
    width: 348px;
  }
  h1 {
    margin: 30px 0;
  }
}
</style>
