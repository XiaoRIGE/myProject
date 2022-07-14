<template>
  <a-layout v-if="isLogin" class="lauoyt-box">
    <a-layout-sider>
      <Sidebar />
    </a-layout-sider>
    <a-layout-content class="layout-box-content">
      <a-layout-header class="header">
        <Header />
      </a-layout-header>
      <a-layout-content class="main-content">
        <!-- 面包屑方式 -->
        <!-- <a-page-header
          class="bg-white"
          :title="currentTitle"
          :sub-title="subTitle"
          :breadcrumb="{ routes }"
        /> -->
        <!-- 页头返回方式 -->
        <a-page-header class="bg-white" :title="currentTitle" @back="back">
          <template v-if="$route.meta.parentRoute" #backIcon />
          <template v-else #backIcon>
            <span />
          </template>
        </a-page-header>
        <router-view v-slot="{ Component }">
          <!-- <keep-alive>
            <component
              :is="Component"
              v-if="$route.meta.keepAlive"
              :key="$route.name"
            />
          </keep-alive> -->
          <!-- v-if="!$route.meta.keepAlive" -->
          <component :is="Component" :key="$route.name" />
        </router-view>
      </a-layout-content>
    </a-layout-content>
  </a-layout>
  <Login v-else :show-forget-pwd="showForgetPwd" />
</template>
<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import { useRoute, useRouter } from 'vue-router';
import Login from './Login.vue';
import Bus from '@/utils/bus';

interface Meta {
  title: string;
  icon?: string;
}

interface Route {
  path: string;
  breadcrumbName?: string;
  meta: Meta;
  children?: Array<{
    path: string;
    breadcrumbName: string;
    meta: Meta;
  }>;
}

export default defineComponent({
  components: {
    Header,
    Sidebar,
    Login
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const back = () => {
      router.back();
    };

    const isLogin = ref(false);

    const token = window.localStorage.getItem('accessToken');
    if (token !== null) {
      isLogin.value = true;
    }

    const showForgetPwd = ref<boolean>(false);

    onMounted(() => {
      // 订阅登录状态改变
      Bus.$on('login-state-change', (loginState: boolean) => {
        // isLogin.value = !isLogin.value;
        isLogin.value = loginState;
        showForgetPwd.value = false;
      });
      // 订阅编辑密码
      Bus.$on('edit-pwd', () => {
        showForgetPwd.value = true;
      });
    });

    const getFullMatched = (matched: any) => {
      const matchedRouter = [];
      for (let index = 0; index < matched.length; index++) {
        const currentRoute = matched[index];
        if (currentRoute?.meta?.parentRoute) {
          const parentRouteInfo: any = {
            path: currentRoute.meta.parentRoute.path,
            meta: {
              title: currentRoute.meta.parentRoute.title
            }
          };
          matchedRouter.push(parentRouteInfo);
          matchedRouter.push(currentRoute);
        } else {
          matchedRouter.push(currentRoute);
        }
      }

      return matchedRouter
        .map((item: Route) => {
          return {
            path: item.path,
            breadcrumbName: item.meta.title
          };
        })
        .filter((item: any) => {
          return item.path !== '/';
        });
    };

    const currentTitle = computed(() => {
      const { matched } = route;
      const index = matched.length - 1;
      if (matched[index]?.meta?.hideTitle) {
        return '';
      }
      return matched[index]?.meta?.title || '';
    });

    const routes = computed(() => {
      const { matched } = route;
      const baseRouteInfo = [
        {
          path: '/',
          breadcrumbName: '首页'
        }
      ];
      const fullMatchedRouter = getFullMatched(matched);
      // console.log('面包屑路由', [...baseRouteInfo, ...fullMatchedRouter]);

      return [...baseRouteInfo, ...fullMatchedRouter];
    });

    const subTitle = computed(() => {
      return route.params.headerSubTitle || '';
    });

    return {
      routes,
      isLogin,
      currentTitle,
      subTitle,
      showForgetPwd,
      back
      // loginChange
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-menu-root) {
  height: calc(~'100vh - 48px');
}
:deep(.ant-layout > .ant-layout-content) {
  min-width: 1024px;
  overflow: auto;
}
:deep(.ant-layout-sider-children) {
  margin: 0;
  padding: 0;
}
.lauoyt-box {
  // background: #fff;
  &-content {
    display: flex;
    flex-direction: column;
  }
}
.bg-white {
  background: #fff;
}
.main-content {
  background: #f0f2f5;
  overflow: auto;
  height: calc(~'100vh - 64px');
}
.header {
  background: #fff;
  padding: 0 32px;
  height: 64px;
}
:deep(.ant-layout-header) {
  position: relative;
  z-index: 999;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
}
.ant-breadcrumb {
  text-align: left;
}
</style>
