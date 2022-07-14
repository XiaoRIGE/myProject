<template>
  <a-layout-sider width="200" style="height: 100%">
    <div class="logo">
      <!-- 強基高校LOGO -->
      <img src="../assets/logo.png" class="logo-img" />
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="false"
      :open-keys="openKeys"
      @click="handleClick"
      @openChange="onOpenChange"
    >
      <template v-for="item in routerList">
        <template v-if="!item.children && item.display">
          <a-menu-item :key="item.name">
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </template>
        <template v-if="item.children && item.display">
          <sub-menu :key="item.name" :menu-info="item" />
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  watchEffect,
  ref
} from 'vue';
import { routes } from '@/router/index';
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

const SubMenu = {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  },
  template: `
    <a-sub-menu :key="menuInfo.name" v-bind="$attrs">
      <template v-if="menuInfo.display" #title>
        <span>
          <span>{{ menuInfo.meta.title }}</span>
        </span>
      </template>
      <template v-for="item in menuInfo.children" :key="item.name">
        <template v-if="!item.children && item.display">
          <a-menu-item :key="item.name">
             <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </template>
        <template v-if="item.children">
          <sub-menu :menu-info="item" :key="item.name" />
        </template>
      </template>
    </a-sub-menu>
  `
};

export default defineComponent({
  components: {
    'sub-menu': SubMenu
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    let authoritiesList: any = [];
    authoritiesList = localStorage.getItem('authorities');
    let JsonAuthoritiesList: any[] = [];
    JsonAuthoritiesList = JSON.parse(authoritiesList);

    /**
     * @description: 动态匹配菜单是否展示
     * @param {menuList} 前端路由配置
     * @param {authoritiesLost} 服务端用户权限信息
     * @param {showldFilter} 当是否需要判断选择学期是当前学期
     * @return {*}
     */
    const shouleShow = (
      menuList: any,
      authoritiesLost: any,
      showldFilter = false
    ) => {
      menuList.forEach((element: any) => {
        authoritiesLost.forEach((item: any) => {
          if (element.name === item.name || element.meta.defaultShow) {
            element.display = true;
          }
          if (element?.children) {
            element.children.forEach((childItem: any) => {
              if (childItem.name === item.name || childItem.meta.defaultShow) {
                childItem.display = true;
              }
            });
          }
          // 选择学期不是当前学期，则过滤掉部分菜单
          if (showldFilter) {
            if (element.meta.shouldFilterWhenNotCurrentSemester) {
              element.display = false;
            }
          }
        });
      });
    };

    const routerList = reactive(JSON.parse(JSON.stringify(routes))); //路由配置

    const compare = (key: string) => {
      //路由排序通过router中的meta的sort字段
      return function(value1: any, value2: any) {
        const val1 = value1.meta[key];
        const val2 = value2.meta[key];
        return val1 - val2;
      };
    };

    const sortRouterList = routerList.sort(compare('sort')); //排序后的路由

    shouleShow(sortRouterList, JsonAuthoritiesList);

    onMounted(() => {
      // 监听切换全局学期 隐藏部分菜单项（通过路由元信息配置）
      Bus.$on('change-sidebar', (data: any) => {
        // 如果当前页面是需要过滤的子路由 则跳转到工作台
        if (route.meta.shouldFilterWhenNotCurrentSemester) {
          // router.push({ name: 'Home' });
          router.push({ name: 'Myclass' });
        }

        shouleShow(sortRouterList, JsonAuthoritiesList, data === 0);
      });
    });

    console.log('sidebar components load=>=>');

    const openKeyss = ref<string[]>([]);
    const selectedKeyss = ref<string[]>([]);

    const state = reactive({
      selectedKeys: selectedKeyss, //当前选中的菜单项 key 数组（二级菜单）
      openKeys: openKeyss //当前展开的 SubMenu 菜单项 key 数组（一级菜单）
    });

    // 刷新界面 选中当前页面对应菜单
    watchEffect(() => {
      // 如果没有选中菜单则匹配当前路由match菜单
      if (
        !state.selectedKeys.length &&
        !state.openKeys.length &&
        route.matched.length >= 2
      ) {
        const selectedKeysName: string = route.matched[0].name as string;
        const openKeysName = route.matched[1].name as string;
        if (selectedKeysName && openKeysName) {
          state.selectedKeys.push(openKeysName);
          state.openKeys.push(selectedKeysName);
        }
      }
    });

    const rootSubmenuKeysS = routerList.map((item: any) => {
      //父级菜单项
      return item.name;
    });

    const onOpenChange = (openKeys: string[]) => {
      const latestOpenKey = openKeys.find(
        key => state.openKeys.indexOf(key) === -1
      );

      if (latestOpenKey && rootSubmenuKeysS.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    const handleClick = ({ key }: { key: string }) => {
      router.push({ name: key });
    };

    return {
      routerList,
      ...toRefs(state),
      handleClick,
      onOpenChange
    };
  }
});
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  background: #303340;
  line-height: 48px;
  &-img {
    width: 106px;
    height: 25px;
  }
}
:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  text-align: left;
}
</style>
