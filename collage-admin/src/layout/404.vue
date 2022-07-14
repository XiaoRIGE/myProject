<template>
  <div class="not_found">
    <img src="../assets/404.png" class="no-access-img" />
    <h1 class="center">很抱歉，你访问的页面不存在！</h1>
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
      router.go(-2);
    };
    return { handleBack };
  }
});
</script>

<style lang="less" scoped>
.not_found {
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
