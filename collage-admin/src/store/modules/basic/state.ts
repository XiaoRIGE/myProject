import { StateType } from '@/@types';
import { Module } from 'vuex';

// 项目基础数据
const state = {
  projectList: [], //项目下拉列表
  testTypeList: [
    {
      value: 'RATING',
      label: '技评'
    },
    {
      value: 'ENUM',
      label: '数值'
    },
    {
      value: 'TIME',
      label: '时间'
    }
  ], //专项考试-测试类型列表
  scoringTypeList: [
    {
      value: 'CEILING',
      label: '向上取值'
    },
    {
      value: 'FLOOR',
      label: '向下取值'
    },
    {
      value: 'RANGE',
      label: '自动匹配'
    }
  ], //专项考试-计分方式列表
  scoringStandardList: [
    {
      value: 'SEX_UNIFIED',
      label: '统一规则'
    },
    {
      value: 'SEX_SEPARATED',
      label: '性别双规则'
    }
  ], //专项考试-计分标准列表
  gradeList: [],
  campusList: [],
  SpecialList: [], //专题列表
  semesterList: [], //学期下拉信息
  currentSemester: {}, //当前下拉选择学期
  uploadProgress: 0, //文件上传进度
  readingFile: false //是否正在读取上传文件
};
type AppStateType = typeof state;

const app: Module<AppStateType, StateType> = { namespaced: true, ...state };

export { AppStateType, state };
export default app;
