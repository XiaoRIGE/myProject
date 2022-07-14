import { computed, reactive, watch } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export const useSafeExit = function useSafeExit(
  route: RouteLocationNormalizedLoaded,
  exitFunction: () => any,
  safeTime = 900
) {
  /**
   * 当前页是否为需要授权页的状态值
   */
  const IS_AUTH_PAGE = computed(() => route.meta.authentication !== false);

  /**
   * 用户操作信息
   */
  const userActionInfo = reactive({
    noActionTime: 0,
    mousePositionX: 0,
    mousePositionY: 0
  });

  let timer: NodeJS.Timeout;

  const bindMouseMove = function bindMouseMove() {
    document.onmousemove = event => {
      if (IS_AUTH_PAGE.value) {
        const newMousePositionX = event.clientX;
        const newMousePositionY = event.clientY;

        const IS_MOUSE_POSITION_X_CHANGED =
          userActionInfo.mousePositionX !== newMousePositionX;
        const IS_MOUSE_POSITION_Y_CHANGED =
          userActionInfo.mousePositionY !== newMousePositionY;

        if (IS_MOUSE_POSITION_X_CHANGED || IS_MOUSE_POSITION_Y_CHANGED) {
          userActionInfo.noActionTime = 0;
        }

        userActionInfo.mousePositionX = newMousePositionX;
        userActionInfo.mousePositionY = newMousePositionY;
      }
    };
  };

  const bind = function bind() {
    bindMouseMove();
    if (IS_AUTH_PAGE.value) {
      timer = setInterval(() => {
        userActionInfo.noActionTime++;
      }, 1000);
    }
  };

  watch(
    () => route.path,
    () => (userActionInfo.noActionTime = 0)
  );

  watch(
    () => IS_AUTH_PAGE.value,
    () => {
      if (!IS_AUTH_PAGE.value) {
        clearInterval(timer);
      } else {
        bind();
      }
    }
  );

  watch(
    () => userActionInfo.noActionTime,
    async newValue => {
      if (newValue === safeTime && IS_AUTH_PAGE.value) {
        exitFunction();
        clearInterval(timer);
        bind();
      }
    }
  );

  return {
    bind,
    IS_AUTH_PAGE
  };
};
