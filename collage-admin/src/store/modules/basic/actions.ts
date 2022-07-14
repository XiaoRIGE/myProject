import {
  BaseCourseServicePresenter,
  ActivityThemeConfigurationPresenter
} from '@/request/api/presenter/course';
import SemesterServicePresenter from '@/request/api/presenter/schoolSetting';
import { setStoreState } from '../../utils';
export default {
  //项目列表
  async updateProjectList() {
    const data = await BaseCourseServicePresenter.getProjectList();
    setStoreState('basic', 'projectList', data);
  },
  //年级列表
  async updateGradeList(option: any) {
    const { currentSemester } = option.state;

    const data = await BaseCourseServicePresenter.getGradeList({
      semesterId: currentSemester.id
    });
    setStoreState('basic', 'gradeList', data);
  },
  //校区列表
  async updateCampusList() {
    const data = await BaseCourseServicePresenter.getCampusList();
    setStoreState('basic', 'campusList', data);
  },
  // 学期下拉
  async updateSemesterList() {
    const data = await SemesterServicePresenter.getAllSemester();

    setStoreState('basic', 'semesterList', data); //设置学期下拉数据

    // const { currentSemester } = option.state;

    // && JSON.stringify(currentSemester) === '{}' 存在学期数据且没有当前学期数据
    if (data.length) {
      // 设置当前学期
      const resultArr = data.filter(item => {
        return item.current === 1;
      });
      if (resultArr.length) {
        //存在当前学期
        setStoreState('basic', 'currentSemester', resultArr[0]);
      } else {
        //不存在当前学期则取服务端返回第一项作为当前学期
        setStoreState('basic', 'currentSemester', data[0]);
      }
    }
  },

  //专题列表
  async updateSpecialList() {
    const data = await ActivityThemeConfigurationPresenter.getAllTheme();
    setStoreState('basic', 'SpecialList', data);
  }
};
