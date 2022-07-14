<!--
 * @Author: lyh
 * @Date: 2021-10-26 14:34:47
 * @LastEditTime: 2022-01-10 15:47:05
 * @LastEditors: Please set LastEditors
 * @Description: 专项考试 考试设置
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\SpecialExamination\ExaminationSetting\Index.vue
-->
<template>
  <div class="test-wrap">
    <div class="header">
      <a-form layout="inline" label-align="left">
        <a-form-item label="学期选择">
          <a-select
            v-model:value="screening.chooseSemester"
            placeholder="请选择"
            allow-clear
            @change="handleChangeSemester"
          >
            <a-select-option value="大一上学期">
              大一上学期
            </a-select-option>
            <a-select-option value="大一下学期">
              大一下学期
            </a-select-option>
            <a-select-option value="大二上学期">
              大二上学期
            </a-select-option>
            <a-select-option value="大二下学期">
              大二下学期
            </a-select-option>
            <a-select-option value="大三上学期">
              大三上学期
            </a-select-option>
            <a-select-option value="大三下学期">
              大三下学期
            </a-select-option>
            <a-select-option value="大四上学期">
              大四上学期
            </a-select-option>
            <a-select-option value="大四下学期">
              大四下学期
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目">
          <a-select
            v-model:value="screening.project"
            placeholder="请选择"
            allow-clear
            @change="handleChangeProject"
          >
            <a-select-option
              v-for="item in projectList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
          <a-space :size="16">
            <a-button type="primary" @click="check">
              查询
            </a-button>
            <a-button @click="reset">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <div class="btn-list">
      <a-button class="btn-margin" type="primary" @click="addSpecial">
        新建专项配置
      </a-button>

      <import-file
        :show-file-dialog="showFileDialog"
        :import-service="batchImport"
        :export-err="exportErr"
        @importExcelSuccess="importExcelSuccess"
      >
        <a-button class="btn-margin" @click="handleImport">
          批量导入
        </a-button>
      </import-file>
      <a-button @click="downLoad">
        下载专项考试模板
      </a-button>
    </div>

    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #action="{record}">
          <a class="update" @click="update(record)">编辑</a>
          <a class="delate" @click="delate(record)">删除</a>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        class="pagination"
        :total="totalNum"
        :show-total="total => `共 ${total} 条`"
      />
    </div>

    <a-modal
      v-model:visible="visible"
      :title="`${titleRef}专项考试`"
      width="650px"
      ok-text="保存"
      @ok="handleOk"
      @cancel="cancel"
    >
      <div class="scroll-y">
        <a-form
          :model="popForm"
          layout="horizontal"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-form-item
            label="学期"
            class="form-margin-style"
            v-bind="validateInfos.semester"
          >
            <a-select
              v-model:value="popForm.semester"
              placeholder="请选择"
              allow-clear
            >
              <a-select-option value="大一上学期">
                大一上学期
              </a-select-option>
              <a-select-option value="大一下学期">
                大一下学期
              </a-select-option>
              <a-select-option value="大二上学期">
                大二上学期
              </a-select-option>
              <a-select-option value="大二下学期">
                大二下学期
              </a-select-option>
              <a-select-option value="大三上学期">
                大三上学期
              </a-select-option>
              <a-select-option value="大三下学期">
                大三下学期
              </a-select-option>
              <a-select-option value="大四上学期">
                大四上学期
              </a-select-option>
              <a-select-option value="大四下学期">
                大四下学期
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="所属项目"
            class="form-margin-style"
            v-bind="validateInfos.project"
          >
            <a-select
              v-model:value="popForm.project"
              placeholder="请选择"
              allow-clear
              @change="handleChangeSubject"
            >
              <a-select-option
                v-for="item in projectList"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>

        <a-form
          layout="inline"
          class="bottom-form"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 7 }"
        >
          <div
            v-for="(item, index) in ExumArr"
            :key="item.id"
            class="log-form-div"
          >
            <a-form-item
              class="select-form-item"
              :label="index === 0 ? '考试科目' : ''"
              :style="index !== 0 ? 'margin-left:64px' : ''"
            >
              <a-select
                v-model:value="subjectGrade[index]"
                placeholder="请选择"
                allow-clear
              >
                <a-select-option
                  v-for="price in exam"
                  :key="price.examName"
                  :value="price.examName"
                >
                  {{ price.examName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="成绩占比"
              :style="index !== 0 ? 'margin-left:5px' : ''"
            >
              <a-input-number
                id="inputNumber"
                v-model:value="item.grade"
                :min="0"
                :max="100"
                :step="0.1"
                @change="gradeChange(item.grade, index)"
              />
              %
              <svg
                v-show="ExumArr.length > 1"
                class="icon"
                aria-hidden="true"
                @click="delExumItem(index)"
              >
                <use xlink:href="#icondelete" />
              </svg>
            </a-form-item>
          </div>
          <p class="add-test" @click="addSubject">
            ＋ 添加考试科目
          </p>
          <p class="statistics">成绩占比总和：{{ countTotal }}%</p>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { ExaminationServicePresenter } from '@/request/api/presenter/examination';
import { ExaminationServicesModal } from '@/request/api/model/examination';
import { useStore } from 'vuex';
interface popForm {
  project: undefined | string;
  semester: any;
}
interface exam {
  examName: string;
  subjectId: string;
}
interface projectSettingBos {
  percentage: any;
  subjectId: string;
  subjectName: any;
}
interface requestData {
  id: string;
  projectId: string | undefined;
  projectName: string;
  projectSettingBos: projectSettingBos[];
  semesterSchool: string;
}
interface ExumArr {
  id?: string;
  grade: number;
}
interface dataSource {
  id: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  projectSettingBos: any[];
  semesterSchool: string;
}

const getStoreInfo = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  store.dispatch('basic/updateProjectList');
  return {
    projectList
  };
};

export default defineComponent({
  setup() {
    const { projectList } = getStoreInfo();
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const titleRef = ref<string>('');
    const updateRequestId = ref<string>('');
    const showFileDialog = ref<boolean>(false);
    const screening = reactive({
      //筛选条件
      chooseSemester: undefined,
      project: undefined
    });

    const popForm = reactive<popForm>({
      //弹窗学期 所属项目
      project: undefined,
      semester: undefined
    });
    const subjectGrade = ref<string[]>([]); //弹窗 考试科目

    const exam = ref<exam[]>([]);
    const ExumArr = ref<ExumArr[]>([
      //每项成绩占比
      {
        id: '1',
        grade: 0
      },
      {
        id: '2',
        grade: 0
      }
    ]);
    const dataSource = ref<dataSource[]>([]);

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        width: 140
      },
      {
        title: '学期',
        dataIndex: 'semesterSchool',
        key: 'semesterSchool',
        width: 150
      },
      {
        title: '专项科目（占专项成绩百分比）',
        dataIndex: 'projectSettingBos',
        key: 'projectSettingBos',
        customRender(text: any) {
          return text.record.projectSettingBos
            .map((item: { subjectName: string; percentage: number }) => {
              return `${item.subjectName}(${item.percentage}%)`; //使其返回数组中的一项
            })
            .join('、');
        },
        ellipsis: true
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 150,
        slots: { customRender: 'action' }
      }
    ];

    const rules = reactive({
      semester: [
        {
          required: true,
          message: '请选择学期信息'
        }
      ],
      project: [
        {
          required: true,
          message: '请选择所属项目'
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(popForm, rules);

    const getList = async () => {
      loading.value = true;
      const data = {
        projectId: screening.project === undefined ? '' : screening.project,
        semesterSchool:
          screening.chooseSemester === undefined
            ? ''
            : screening.chooseSemester,
        page: current.value,
        size: pageSize.value
      };
      try {
        const res = await ExaminationServicePresenter.queryExaminationList(
          data
        );
        dataSource.value = res.items;
        totalNum.value = res.total;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    getList();

    const loadFirstPage = () => {
      current.value = 1;
      getList();
    };

    //重置方法
    const arrReset = () => {
      resetFields();
      ExumArr.value = [
        {
          grade: 0
        },
        {
          grade: 0
        }
      ];
      subjectGrade.value = [];
    };

    //根据项目获取科目下拉
    const getProjectSubject = async (value: any) => {
      const data = {
        projectId: value
      };
      try {
        const res = await ExaminationServicePresenter.getProjectSubject(data);
        for (const i in res) {
          exam.value.push({
            examName: res[i].title,
            subjectId: res[i].id
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    //学期选择筛选change
    const handleChangeSemester = async (value: any) => {
      screening.chooseSemester = value;
      loadFirstPage();
    };

    //项目选择筛选change
    const handleChangeProject = async (value: any) => {
      screening.project = value;
      loadFirstPage();
    };

    const handleChangeSubject = async (value: any) => {
      exam.value = [];
      ExumArr.value = [
        {
          grade: 0
        },
        {
          grade: 0
        }
      ];
      subjectGrade.value = [];
      getProjectSubject(value);
    };

    //查询按钮
    const check = () => {
      loadFirstPage();
    };

    const reset = () => {
      screening.chooseSemester = undefined;
      screening.project = undefined;
      check();
    };

    watch(
      () => current.value,
      () => {
        getList();
      }
    );

    const downLoad = async () => {
      try {
        await ExaminationServicesModal.export();
      } catch (error) {
        console.log(error);
      }
    };

    //成绩占比总和
    const countTotal = computed(() => {
      let total = 0;
      ExumArr.value.forEach((item: { grade: number }) => {
        total += item.grade;
      });
      return Number(Number(total).toFixed(1));
    });

    const handleImport = () => {
      showFileDialog.value = true;
    };

    //新增
    const addSpecial = () => {
      titleRef.value = '新建';
      visible.value = true;
    };

    //修改
    const update = (data: any) => {
      titleRef.value = '编辑';
      visible.value = true;
      ExumArr.value = [];
      updateRequestId.value = data.id;

      getProjectSubject(data.projectId);

      popForm.project = data.projectId; //所属项目
      popForm.semester = data.semesterSchool; //学期

      for (const i in data.projectSettingBos) {
        const item = data.projectSettingBos[i];
        subjectGrade.value.push(item.subjectName);
        ExumArr.value.push({
          grade: item.percentage
        });
      }
    };

    const delate = (data: any) => {
      const requestData = {
        id: data.id
      };
      const titleVnode = getModalHeadVNode('确定要删除吗？');

      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          try {
            await ExaminationServicePresenter.delExamination(requestData);
            message.success('删除成功！');
            getList();
          } catch (error) {
            Modal.error({
              title: '删除失败！',
              content: `${error.message}`
            });
          }
        }
      });
    };

    //查找科目id value: 科目名称
    const checkSubjectId = (value: string) => {
      let subjectIdTest = '';
      for (const i in exam.value) {
        if (value === exam.value[i].examName) {
          subjectIdTest = exam.value[i].subjectId;
        }
      }
      return subjectIdTest;
    };

    //保存
    const handleOk = () => {
      const requestData: requestData = {
        id: updateRequestId.value,
        projectId: popForm.project,
        projectName: '',
        projectSettingBos: [],
        semesterSchool: popForm.semester
      };

      projectList.value.forEach((element: any) => {
        if (element.key === popForm.project)
          requestData.projectName = element.value;
      });

      requestData.projectSettingBos = subjectGrade.value.map(
        (item: string, index) => {
          return {
            percentage:
              ExumArr.value[index].grade === null
                ? 0
                : ExumArr.value[index].grade,
            subjectId: checkSubjectId(item),
            subjectName: item
          };
        }
      );

      requestData.projectSettingBos.filter((x: any) => {
        return x && x.subjectName !== undefined;
      });

      validate()
        .then(async () => {
          // if (countTotal.value !== 100) {
          //   Modal.error({
          //     title: '保存失败',
          //     content: '成绩占比总和必须为100%'
          //   });
          //   return;
          // }
          for (let i = 0; i < ExumArr.value.length; i++) {
            const item = ExumArr.value[i];
            if (subjectGrade.value[i] === undefined) {
              requestData.projectSettingBos.splice(i, 1);
            }
            if (item.grade !== 0 && item.grade !== null) {
              //某项成绩占比为不为0
              if (subjectGrade.value[i] === undefined) {
                //考试科目为空
                Modal.error({
                  title: '保存失败',
                  content: '如果成绩占比不为0，必须选择考试科目'
                });
                return;
              }
            }
          }

          if (titleRef.value === '编辑') {
            try {
              await ExaminationServicePresenter.updateExamination(requestData);
              visible.value = false;
              getList();
              arrReset();
              exam.value = [];
            } catch (error) {
              Modal.error({
                title: '编辑失败！',
                content: error.message
              });
            }
          } else {
            try {
              await ExaminationServicePresenter.addExamination(requestData);
              visible.value = false;
              loadFirstPage();
              arrReset();
              exam.value = [];
            } catch (error) {
              Modal.error({
                title: '添加失败！',
                content: error.message
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const cancel = () => {
      arrReset();
      exam.value = [];
    };

    //添加考试科目
    const addSubject = () => {
      ExumArr.value.push({
        grade: 0
      });
    };

    //删除一条考试科目
    const delExumItem = (index: number) => {
      ExumArr.value.splice(index, 1);
      subjectGrade.value.splice(index, 1);
    };

    const importExcelSuccess = (val: any) => {
      if (val === '导入成功') {
        getList();
      }
    };

    const gradeChange = (value: number, index: number) => {
      ExumArr.value[index].grade = Number(value.toFixed(1));
    };

    return {
      visible,
      loading,
      projectList,
      screening,
      dataSource,
      columns,
      delate,
      update,
      addSpecial,
      downLoad,
      popForm,
      subjectGrade,
      addSubject,
      handleOk,
      cancel,
      ExumArr,
      delExumItem,
      validateInfos,
      countTotal,
      exam,
      check,
      reset,
      current,
      pageSize,
      totalNum,
      titleRef,
      handleChangeSubject,
      handleChangeSemester,
      handleChangeProject,
      handleImport,
      showFileDialog,
      batchImport: ExaminationServicesModal.import,
      exportErr: ExaminationServicesModal.downloadErrTemplate,
      importExcelSuccess,
      gradeChange
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.ant-form-horizontal) {
  margin-right: 43px;
}
:deep(.log-form-div .ant-select-selection) {
  margin-left: 5px;
}
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;

  .btn-list {
    margin-top: 15px;
  }

  .check {
    margin-right: 20px;
  }

  .btn-margin {
    margin-right: 10px;
  }

  .table {
    margin-top: 24px;
  }

  .icon {
    font-size: 18px;
    color: blue;
  }

  .delate {
    color: #ff4d4f;
    margin-left: 24px;
  }
}
.bottom-form {
  margin-left: 21px;
}
.add-test {
  margin-left: 75px;
  color: #1966fe;
  cursor: pointer;
}
.statistics {
  margin-top: 20px;
  text-align: right;
  margin-right: 80px;
}
.form-margin-style {
  margin-right: 30px;
}
.icon {
  width: 20px;
  height: 20px;
  position: relative;
  top: 6px;
  cursor: pointer;
}
.scroll-y {
  max-height: 500px;
  padding-right: 20px;
  overflow-y: auto;
}

:deep(.select-form-item .ant-select) {
  width: 195px;
}
</style>
