<template>
  <div class="flex-box">
    <div class="school">
      <span class="school-name">{{ userInfo.schoolName }}</span>
      <span class="school-term">
        <a-dropdown
          placement="bottomCenter"
          overlay-class-name="test-box"
          :get-popup-container="
            triggerNode => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <span class="cursor">
            {{ currentSemester.semesterInfo }}
            {{ currentSemester.current === 1 ? currentSemester.weekStr : '' }}
          </span>
          <template #overlay>
            <a-menu class="menu-ul">
              <a-menu-item
                v-for="item in semesterList"
                :key="item.id"
                :class="item.current === 1 ? 'active' : ''"
                @click="changeCurrentSemester(item)"
              >
                <span>{{ item.semesterInfo }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </span>
    </div>
    <div class="user">
      <!-- <a-dropdown placement="bottomCenter">
        <span>
          <a-avatar class="avator" :src="avatorMan" />
          <span class="user-name cursor">{{ userInfo.realName }}</span>
        </span>

        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="handleLogout">退出登录</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="handleEditPwd">修改密码</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> -->
      <a-popover placement="bottom">
        <template #content>
          <p
            class="cursor"
            style="padding:0 8px;width:90px;textAlign:center;marginBottom:0;lineHeight:32px;borderBottom:1px solid #ccc"
            @click="handleLogout"
          >
            <span class=" operationItem">退出登录</span>
          </p>
          <p
            class="cursor"
            style="padding:0 8px;width:90px;textAlign:center;marginBottom:0;lineHeight:32px"
            @click="handleEditPwd"
          >
            <span class=" operationItem">修改密码</span>
          </p>
        </template>
        <span>
          <a-avatar
            v-if="userInfo.gender === 2"
            class="avator"
            :src="avatorWoman"
          />
          <a-avatar v-else class="avator" :src="avatorMan" />
          <span class="user-name cursor">{{ userInfo.realName }}</span>
        </span>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import Bus from '@/utils/bus';
import { setStoreState } from '@/store/utils';
import { LoginServicePresenter } from '@/request/api/presenter/login';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const getStoreInfo = () => {
      const store = useStore();
      const semesterList = computed(() => store.state.basic.semesterList); //所有学期
      const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

      store.dispatch('basic/updateSemesterList');

      return {
        semesterList,
        currentSemester
      };
    };

    const router = useRouter();

    const { semesterList, currentSemester } = getStoreInfo();

    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr
      ? JSON.parse(userInfoStr)
      : { schoolName: '- -', realName: '管理员' };

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
    const handleEditPwd = async () => {
      try {
        await LoginServicePresenter.logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authorities');
        localStorage.removeItem('userInfo');
        setStoreState('basic', 'currentSemester', {});
        Bus.$emit('login-state-change', false);
        Bus.$emit('edit-pwd');
      } catch (error) {
        console.log(error);
      }
    };

    // 切换当前学期
    const changeCurrentSemester = (item: any) => {
      setStoreState('basic', 'currentSemester', item); //更新store中当前学期信息

      // 通知菜单更新(部分菜单需要隐藏)
      Bus.$emit('change-sidebar', currentSemester.value.current);
    };

    return {
      userInfo,
      avatorMan: require('../assets/man.png'),
      avatorWoman: require('../assets/woman.png'),
      handleLogout,
      handleEditPwd,
      semesterList,
      changeCurrentSemester,
      currentSemester
    };
  }
});
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .school {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    &-name {
      display: inline-block;
      margin-right: 16px;
    }
  }
  .user {
    &-name {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
  }
  :deep(.ant-avatar) {
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }
}
:deep(.test-box .active) {
  background: #e6f2ff; //#E6F2FF; #fffbe6
}
:deep(.operationItem:hover) {
  color: #1966fe;
}
:deep(.ant-dropdown-menu-vertical) {
  max-height: 266px;
  overflow: scroll;
  overflow-x: hidden;
}
</style>
