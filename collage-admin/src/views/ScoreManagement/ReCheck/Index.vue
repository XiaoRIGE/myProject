<!--
 * @Author: lyh
 * @Date: 2021-11-09 14:13:37
 * @LastEditTime: 2022-05-05 17:15:52
 * @LastEditors: Please set LastEditors
 * @Description: 复核情况
 * @FilePath: \collage-admin\src\views\ScoreManagement\ReCheck\Index.vue
-->
<template>
  <div class="content">
    <div class="header">
      <a-form layout="inline" label-align="left">
        <a-form-item label="班级">
          <a-input-search
            v-model:value="classNameRef"
            placeholder="请输入班级名称"
            style="width: 200px"
            @search="check"
          />
        </a-form-item>
        <a-form-item label="复核状态">
          <a-select
            v-model:value="reviewStateRef"
            placeholder="请选择"
            allow-clear
            @change="reviewState"
          >
            <a-select-option :value="null">
              全部
            </a-select-option>
            <a-select-option :value="0">
              未复核
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
      <a-tooltip>
        <template v-if="isCreateAllGrade" #title>
          成绩未锁定，不可复核并生成成绩
        </template>
        <a-button
          v-if="currentSemester"
          class="btn-margin"
          type="primary"
          :disabled="isCreateAllGrade"
          @click="createAllSchoolGrade"
        >
          复核并生成全校成绩
        </a-button>
      </a-tooltip>
      <a-popover
        v-model:visible="exportPopoverVisible"
        trigger="hover"
        placement="bottom"
      >
        <template #content>
          <div class="cursor btn-item" @click="downLoad">
            附加成绩模板
          </div>
          <div class="cursor btn-item" @click="downLoadOtherGrade">
            其他成绩模板
          </div>
        </template>
        <a-button class="btn-margin" @click="exportPopoverVisible = true">
          下载成绩模板
        </a-button>
      </a-popover>

      <div v-if="currentSemester" style="display:inline">
        <a-popover
          v-if="!isLockGrade"
          v-model:visible="importPopoverVisible"
          :overlay-style="{
            width: '118px',
            height: 'auto'
          }"
          trigger="hover"
          placement="bottom"
        >
          <template #content>
            <div class="cursor btn-item">
              <ImoortFileAsync
                :show-file-dialog="showFileDialog"
                :import-service="batchImport"
                :query-condition-service="extraPointImport"
                :export-err="exportOtherErr"
                @importExcelSuccess="importExcelSuccess"
              >
                <div v-if="currentSemester" @click="handleImport">
                  导入附加成绩
                </div>
              </ImoortFileAsync>
            </div>
            <div class="cursor btn-item">
              <ImoortFileAsync
                :show-file-dialog="showFileDialog"
                :import-service="batchOtherImport"
                :query-condition-service="queryConditionService"
                :export-err="exportOtherErr"
                :import-service-params="{ semesterId }"
                @importExcelSuccess="importExcelSuccess"
              >
                <div v-if="currentSemester" @click="handleImport">
                  导入其他成绩
                </div>
              </ImoortFileAsync>
            </div>
          </template>
          <a-button class="btn-margin" @click="importPopoverVisible = true">
            批量导入成绩
          </a-button>
        </a-popover>
        <a-tooltip v-else>
          <template #title>成绩已锁定，不可导入成绩</template>
          <a-button
            :disabled="isLockGrade"
            class="btn-margin"
            @click="importPopoverVisible = true"
          >
            批量导入成绩
          </a-button>
        </a-tooltip>
      </div>

      <a-tooltip v-if="!currentSemester">
        <a-button class="btn-margin" @click="exportAllSchoolGrade">
          导出全校成绩
        </a-button>
      </a-tooltip>
      <a-tooltip v-else>
        <template v-if="isExportGrade" #title>成绩未生成，无法导出</template>
        <a-button
          class="btn-margin"
          :disabled="isExportGrade && currentSemester === 1 ? true : false"
          @click="exportAllSchoolGrade"
        >
          导出全校成绩
        </a-button>
      </a-tooltip>
      <span v-if="currentSemester" class="lock-grade">锁定成绩：</span>
      <a-switch
        v-if="currentSemester"
        v-model:checked="isLockGrade"
        checked-children="开"
        un-checked-children="关"
        @change="switchChange"
      />
    </div>
    <div class="blue-message">
      <a-alert
        v-if="isAlert && currentSemester"
        message="成绩生成流程：1.锁定成绩；2.复核并生成成绩；3.导出全校成绩。"
        type="info"
        show-icon
      />
      <a-alert
        v-if="!isAlert && currentSemester"
        :message="
          `成绩生成时间：${gradeDate}  成绩生成流程：1.锁定成绩；2.复核并生成成绩；3.导出全校成绩。`
        "
        type="info"
        show-icon
      />
    </div>

    <div>
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        row-key="courseId"
        :pagination="false"
      >
        <template #reviewStatus="{text }">
          <span v-if="text === 1" class="review-span">
            <div class="no-point">
              ·
            </div>
            已复核
          </span>
          <span v-else class="review-span">
            <div class="point">
              ·
            </div>
            未复核
          </span>
        </template>
        <template #operation="{ record}">
          <a
            v-if="record.reviewStatus === 1"
            class="table-update"
            :disabled="true"
            @click="reViewGrade(record.courseId)"
          >
            复核成绩
          </a>
          <a v-else class="table-update" @click="reViewGrade(record.courseId)">
            复核成绩
          </a>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        :hide-on-single-page="false"
        class="pagination"
        :total="totalNum"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>

  <a-modal :visible="!isShowMessage" title="正在导出" :footer="null">
    <div class="example">
      <a-spin tip="正在导出全校成绩请勿进行其他操作" />
    </div>
  </a-modal>

  <ProcessLoading
    :show-visible="showVisible"
    :get-process-service="getProcessService"
    :get-process-service-params="{ courseId }"
    :get-name="getName"
    @close="showVisible = false"
    @finish="handleFinish"
  />
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  Ref,
  ref,
  toRefs,
  watch
} from 'vue';
import { getModalHeadVNode, debounced } from '@/utils/common';
import { useStore } from 'vuex';
import { message, Modal } from 'ant-design-vue';
import { reViewServicePresenter } from '@/request/api/presenter/schoolSetting';
import { reViewServiceModal } from '@/request/api/model/schoolSetting';
import ProcessLoading from '@/components/global/ProcessLoading.vue';
import ImoortFileAsync from '@/components/global/ImportFileAsync.vue';

interface queryAllSchoolListResponseList {
  courseId: string;
  courseName: string;
  organizationId: string;
  reviewStatus: number;
  page: number;
}
const dataSource = ref<queryAllSchoolListResponseList[]>([]);
const columns = [
  {
    title: '班级',
    dataIndex: 'courseName',
    key: 'courseName'
  },
  {
    title: '复核状态',
    dataIndex: 'reviewStatus',
    key: 'reviewStatus',
    slots: { customRender: 'reviewStatus' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '200px',
    slots: { customRender: 'operation' }
  }
];
export default defineComponent({
  components: { ProcessLoading, ImoortFileAsync },
  setup() {
    const allBtnState = reactive({
      isAlert: true, //alert
      isCreateAllGrade: true, //生成全校成绩
      isExportGrade: true, //导出全校成绩
      isLockGrade: false //锁定成绩
    });
    const showFileDialog: Ref<boolean> = ref(false);
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const reviewStateRef = ref<number | null>(null);
    const classNameRef = ref<string>('');
    const loading = ref<boolean>(false);
    const getName = ref<string>('');
    const gradeDate = ref<string>('');
    const exportPopoverVisible: Ref<boolean> = ref(false);
    const importPopoverVisible: Ref<boolean> = ref(false);

    const store = useStore();
    const currentSemester = computed(
      () => store.state.basic.currentSemester.current
    ); //当前学期信息
    const currentSemesterId = computed(
      () => store.state.basic.currentSemester.id
    ); //当前学期信息

    const queryState = async () => {
      try {
        const res = await reViewServicePresenter.queryAllschoolState();
        allBtnState.isLockGrade = res.lockStatus;
        gradeDate.value = res.scoreGenerationTime;

        if (res.lockStatus === false) {
          //锁定成绩为false 生成 导出禁用
          allBtnState.isCreateAllGrade = true;
        } else {
          allBtnState.isCreateAllGrade = false;
        }

        if (res.generateFlag === true) {
          //生成成绩为true
          allBtnState.isAlert = false;
        }

        if (res.generateFlag && res.lockStatus) {
          allBtnState.isExportGrade = false;
        } else {
          allBtnState.isExportGrade = true;
        }
      } catch (error) {
        console.log(error);
      }
    };
    const queryAllSchoolList = async () => {
      loading.value = true;
      const requestData = {
        semesterId: currentSemesterId.value,
        courseId: '',
        courseName: classNameRef.value,
        organizationId: '',
        reviewStatus: reviewStateRef.value,
        page: current.value
      };
      try {
        const res = await reViewServicePresenter.queryAllSchoolList(
          requestData
        );
        dataSource.value = res.reviewPageVOS;
        totalNum.value = res.total;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    queryState();
    queryAllSchoolList();

    watch(
      () => current.value,
      async () => {
        queryAllSchoolList();
      }
    );

    watch(
      () => currentSemester.value,
      () => {
        queryAllSchoolList();
      }
    );

    const loadFirstPage = () => {
      current.value = 1;
      queryAllSchoolList();
    };

    const reviewState = () => {
      loadFirstPage();
    };

    const reset = () => {
      reviewStateRef.value = null;
      classNameRef.value = '';
      loadFirstPage();
    };

    const check = async () => {
      //查询
      loadFirstPage();
    };

    const changeLock = async () => {
      try {
        const res = await reViewServicePresenter.lockAllschoolGrade();
        if (res === true) {
          message.success('锁定成绩已开启');
        } else {
          message.success('锁定成绩已关闭');
        }
        queryState();
      } catch (error) {
        Modal.error({
          title: '锁定失败',
          content: `${error.message}`
        });
        queryState();
      }
    };

    const switchChange = async () => {
      if (allBtnState.isLockGrade === false) {
        Modal.warning({
          title: '开启锁定成绩                   ',
          content: '成绩锁定后，教师将无法对班级成绩进行操作。',
          onOk() {
            changeLock();
          }
        });
      } else {
        changeLock();
      }
    };

    const downLoad = async () => {
      try {
        await reViewServiceModal.export();
        exportPopoverVisible.value = false;
      } catch (error) {
        message.error('下载失败');
      }
    };

    const downLoadOtherGrade = async () => {
      const requestData = {
        semesterId: currentSemesterId.value
      };
      try {
        await reViewServiceModal.exportOtherGrade(requestData);
        exportPopoverVisible.value = false;
      } catch (error) {
        message.error('下载失败');
      }
    };

    const win: any = window;
    const isShowMessage = ref<boolean>(true);
    const getFilePath = debounced(
      async (data: string) => {
        try {
          const requestData = {
            key: data
          };
          const getFilePathRes = await reViewServicePresenter.getFilePath(
            requestData
          );
          if (getFilePathRes === '-1') {
            isShowMessage.value = false;
            getFilePath(data);
          } else {
            win.location.href = getFilePathRes;
            isShowMessage.value = true;
            queryState();
          }
        } catch (error) {
          Modal.error({
            title: '导出失败',
            content: `${error.message}`
          });
          isShowMessage.value = true;
        }
      },
      1000,
      true
    );

    const exportAllSchoolGrade = async () => {
      let exportAllSchoolGradeRes;
      isShowMessage.value = true;
      const data = {
        semesterId: currentSemesterId.value
      };
      try {
        exportAllSchoolGradeRes = await reViewServicePresenter.exportAllSchoolGrade(
          data
        );
        getFilePath((exportAllSchoolGradeRes as unknown) as string);
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '导出失败',
          content: `${error.message}`
        });
      }
    };

    const handleImport = async () => {
      showFileDialog.value = true;
    };

    const showVisible = ref(false);
    const showConfirm = () => {
      showVisible.value = true;
    };

    const getProcessService = ref(reViewServicePresenter.getReViewProgress); //复核班级
    // reViewServicePresenter.getReViewAllSchoolProgress; //复核全校
    const reCheckAllGrade = () => {
      getProcessService.value =
        reViewServicePresenter.getReViewAllSchoolProgress;
      const titleVnode = getModalHeadVNode('复核并生成全校成绩');
      Modal.confirm({
        title: titleVnode,
        content: '复核并生成后的成绩将发布至学生App，不可对成绩进行修改。',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await reViewServicePresenter.reViewAllSchool();
            showConfirm();
          } catch (error) {
            Modal.error({
              title: '复核失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    //生成全校成绩
    const createAllSchoolGrade = async () => {
      getName.value = '复核并生成全校成绩';
      getProcessService.value =
        reViewServicePresenter.getReViewAllSchoolProgress;
      const titleVnode = getModalHeadVNode('复核并生成全校成绩');
      Modal.confirm({
        title: titleVnode,
        content: '复核后的成绩将发布至学生App。',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await reViewServicePresenter.createAllSchoolGrade();
            showConfirm();
          } catch (error) {
            console.log(error);
            message.error(error.message);
          }
        }
      });
    };

    const courseId = ref('');
    const reViewGrade = async (data: any) => {
      //复核成绩
      getName.value = '复核';
      getProcessService.value = reViewServicePresenter.getReViewProgress;
      courseId.value = data;
      const titleVnode = getModalHeadVNode('复核成绩');
      Modal.confirm({
        title: titleVnode,
        content: '复核后的成绩将发布至学生App。',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            const params = {
              courseId: data
            };
            await reViewServicePresenter.reViewCrouse(params);
            showConfirm();
          } catch (error) {
            console.log(error);
            message.error(error?.message);
          }
        }
      });
    };
    // 完成复核
    const handleFinish = () => {
      message.success('复核成功！');
      queryState();
      queryAllSchoolList();
    };

    const importExcelSuccess = async (val: any) => {
      if (val === '导入成功') {
        Modal.success({
          title: '导入成功',
          content: '需复核并生成成绩，才可查看全校最新成绩。'
        });
        queryAllSchoolList();
      }
    };

    return {
      //状态
      reviewStateRef,
      classNameRef,
      showVisible,
      loading,
      showFileDialog,
      gradeDate,
      currentSemester,
      isShowMessage,
      exportPopoverVisible,
      importPopoverVisible,
      //表单
      dataSource,
      columns,
      reViewGrade,
      //按钮状态
      ...toRefs(allBtnState),
      //事件
      reCheckAllGrade,
      downLoad,
      downLoadOtherGrade,
      handleImport,
      switchChange,
      reviewState,
      reset,
      check,
      createAllSchoolGrade,
      exportAllSchoolGrade,
      //分页
      pageSize,
      totalNum,
      current,
      //组件
      handleFinish,
      getProcessService,
      courseId,
      batchImport: reViewServiceModal.importGrade,
      batchOtherImport: reViewServiceModal.importOtherGrade,
      queryConditionService: reViewServiceModal.isQueryGradeImport,
      extraPointImport: reViewServiceModal.extraPointImport,
      exportOtherErr: reViewServiceModal.downloadExportErr,
      importExcelSuccess,
      getName,
      semesterId: currentSemesterId.value
    };
  }
});
</script>
<style lang="less" scoped>
.content {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.ant-form-horizontal) {
  margin-right: 43px;
}
:deep(.log-form-div .ant-select-selection) {
  margin-left: 5px;
}
.btn-margin {
  margin-right: 10px;
}
.btn-list {
  margin-top: 15px;
}
.lock-grade {
  font-size: 16px;
  position: relative;
  top: 2px;
}
.blue-message {
  margin-top: 16px;
  margin-bottom: 16px;
}
.review-span {
  position: relative;
  padding-left: 20px;
  .point {
    position: absolute;
    font-size: 60px;
    color: #f04134;
    top: -43px;
  }
  .no-point {
    position: absolute;
    font-size: 60px;
    color: #00a854;
    top: -43px;
  }
}
.btn-item {
  line-height: 32px;
  &:nth-child(1) {
    border-bottom: 1px solid #f0f2f5;
  }
}
.example {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>
