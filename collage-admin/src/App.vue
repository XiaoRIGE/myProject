<template>
  <a-config-provider :locale="currentLanguage">
    <app-layout />
  </a-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import AppLayout from '@/layout/AppLayout.vue';
import { Locales } from '@/i18n/index';
import { useStore } from 'vuex';
import { StateType } from '@/@types';
import { useSafeExit } from '@/hooks/useSafeExit';
import { useRoute, useRouter } from 'vue-router';
import { LoginServicePresenter } from './request/api/presenter/login';
import { setStoreState } from './store/utils';
import Bus from '@/utils/bus';

const App = defineComponent({
  components: {
    AppLayout
  },
  setup() {
    const store = useStore<StateType>();
    const currentLanguage = computed(() => Locales[store.state.app.language]);
    const route = useRoute();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await LoginServicePresenter.logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authorities');
        localStorage.removeItem('userInfo');
        setStoreState('basic', 'currentSemester', {});
        Bus.$emit('login-state-change', false);
        router.push({ name: 'Login' });
      } catch (error) {
        console.log(error);
      }
    };

    const safeExit = useSafeExit(route, handleLogout);

    onMounted(() => {
      safeExit.bind();
    });
    return {
      Locales,
      currentLanguage
    };
  }
});
export default App;
</script>

<style lang="less" scoped>
#app {
  font-family: 'PingFangSC-Regular', 'PingFang SC', 'PingFangSC-Medium',
    sans-serif;
}
</style>
