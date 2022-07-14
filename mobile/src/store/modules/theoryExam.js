const theoryExam = {
  state: () => ({
    // question：null, // 题库
    // countDown: 0, // 倒计时总共时间 ms
    // remainingTime, // 剩余考试时间 ms
    questionList: [] // 本地存储的题库列表
  }),
  mutations: {
    // 存项目题库
    SET_THEORYEXAM: (state, exam) => {
      state.questionList.push(exam);
    },

    // 初始化题库
    INIT_QUESTION: (state, data) => {
      state.singleChoiceQuestionListVO = data.singleChoiceQuestionListVO;
      state.multipleChoiceQuestionListVO = data.multipleChoiceQuestionListVO;
      state.judgmentQuestionListVO = data.judgmentQuestionListVO;
    },

    // 重置倒计时(剩余时长)
    SET_REMAINING_TIME: (state, { courseId, ms }) => {
      const index = state.questionList.findIndex(
        (exam) => exam.question.courseId === courseId
      );
      state.questionList[index].remainingTime = ms;
    },

    // 重置题库答案,答题时候触发
    SET_QUESTION: (state, data) => {
      const { courseId, type, questionId, answer, answers } = data;
      // 获取当前考试的课程对应的考题库
      const index = state.questionList.findIndex(
        (exam) => exam.question.courseId === courseId
      );
      // 查找到对应的题库
      if (index > -1) {
        const menuTypes = {
          single: 'singleChoiceQuestionListVO',
          judgment: 'judgmentQuestionListVO'
        };
        if (type === 'single' || type === 'judgment') {
          const len = (
            state.questionList[index].question[menuTypes[type]] || []
          ).length;
          // 单选题 or 判断题
          for (let i = 0; i < len; i++) {
            const ele = state.questionList[index].question[menuTypes[type]][i];
            // 查找到，对应的题目，赋值新的答案
            if (ele.questionId === questionId) {
              state.questionList[index].question[menuTypes[type]][i].answer =
                answer;
              break;
            }
          }
        }
        if (type === 'multiple') {
          // 多选题，赋值新的答案
          const multipleChoiceQuestionListVO =
            state.questionList[index].question.multipleChoiceQuestionListVO;
          const len = multipleChoiceQuestionListVO.length;
          for (let i = 0; i < len; i++) {
            const ele = multipleChoiceQuestionListVO[i];
            if (ele.questionId === questionId) {
              // 找到了题目，赋值新的答案，并改变选项状态
              state.questionList[index].question.multipleChoiceQuestionListVO[
                i
              ].answer = answer;
              const answerListLen = (ele.answerList || []).length;
              for (let j = 0; j < answerListLen; j++) {
                state.questionList[index].question.multipleChoiceQuestionListVO[
                  i
                ].answerList[j].answer = answers.includes(
                  ele.answerList[j].tag
                );
              }
              break;
            }
          }
        }
      }
    },

    // 删除某个项目题库
    DELETE_THEORYEXAM: (state, courseId) => {
      const index = state.questionList.findIndex(
        (exam) => exam.question.courseId === courseId
      );
      if (index > -1) {
        state.questionList.splice(index, 1);
      }
    }
  },
  actions: {}
};

export default theoryExam;
