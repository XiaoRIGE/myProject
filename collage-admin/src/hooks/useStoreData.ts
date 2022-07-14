import { useStore } from 'vuex';
import { computed } from 'vue';

/**更新后获取最新store数据 */
export const useProjectStore = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  store.dispatch('basic/updateProjectList');
  return {
    projectList
  };
};
