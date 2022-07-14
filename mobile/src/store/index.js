import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import modules from './modules';

Vue.use(Vuex);
// 需要持久化的数据, module:store模块名, key: 要存储的变量key 类型：Array | String | *
const storeList = [
  {
    module: 'app',
    key: ['userInfo']
  },
  {
    module: 'course',
    key: 'studentCourseId'
  },
  {
    module: 'teacherTest',
    key: 'studentList'
  },
  {
    module: 'attainability',
    key: ['selectActivityInfo']
  },
  {
    module: 'semester',
    key: 'currentSemester'
  },
  {
    module: 'cacheFile',
    key: ['activitieImages']
  },
  {
    module: 'courseSelection',
    key: 'course'
  },
  {
    module: 'theoryExam',
    key: '*' // questionList
  }
];
const getPaths = (list) =>
  list
    .filter(({ module }) => module)
    .map(({ module, key }) => {
      if (key === '*' || !key) return `${module}`;
      if (typeof key === 'string') return `${module}.${key}`;
      if (Array.isArray(key))
        return key.map((keyItem) => `${module}.${keyItem}`);
    })
    .flat();
const store = new Vuex.Store({
  modules: { ...modules },
  getters: {
    // 获取对应的项目题库
    getCurrentTheoryExam(state) {
      return (currentId) => {
        const list = state.theoryExam.questionList || [];
        return list.find((exam) => exam.question.courseId === currentId);
      };
    }
  },
  plugins: [
    createPersistedState({
      key: 'app-store',
      paths: getPaths(storeList),
      storage: {
        getItem: (key) => {
          return uni.getStorageSync(key);
        },
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key)
      }
    })
  ]
});

export default store;
