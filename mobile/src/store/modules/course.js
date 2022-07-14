const app = {
  state: () => ({
    studentCourseId: '' // 学生端选择课程后需要保存上一次选择的id
  }),
  mutations: {
    SET_STUDENT_COURSE_ID: (state, id) => {
      state.studentCourseId = id;
    }
  },
  actions: {}
};

export default app;
