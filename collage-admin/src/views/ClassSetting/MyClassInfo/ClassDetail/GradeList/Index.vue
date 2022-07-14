<template>
  <div class="grade-list">
    <div class="operation">
      <a-space :size="24">
        <!-- 复核成绩 -->
        <a-button
          v-if="!isApproved && isCurrentSemester && !isLocked"
          type="primary"
          :loading="loading"
          @click="handleShow"
        >
          复核成绩
        </a-button>
        <a-tooltip
          v-if="!isApproved && isCurrentSemester && isLocked"
          placement="top"
        >
          <template #title>
            <span>成绩已锁定，不可复核成绩</span>
          </template>
          <a-button disabled>复核成绩</a-button>
        </a-tooltip>
        <!-- 取消复核 -->
        <a-button
          v-if="isApproved && !isLocked && isCurrentSemester"
          type="primary"
          :loading="cancelLoading"
          @click="handleCancel"
        >
          取消复核
        </a-button>
        <a-tooltip
          v-if="isApproved && isLocked && isCurrentSemester"
          placement="top"
        >
          <template #title>
            <span>成绩已锁定，不可取消复核</span>
          </template>
          <a-button disabled>取消复核</a-button>
        </a-tooltip>

        <!-- 导出总成绩 -->
        <!-- <a-tooltip v-if="!isApproved && isCurrentSemester" placement="top">
          <template #title>
            <span>成绩未复核，无法导出</span>
          </template>
          <a-button disabled>导出总成绩</a-button>
        </a-tooltip>
        <a-button
          v-if="isApproved"
          :loading="exportLoading"
          @click="handleExport(1)"
        >
          导出总成绩
        </a-button> -->
        <!-- 导出所有成绩 -->
        <!-- <a-tooltip v-if="!isApproved" placement="top">
          <template #title>
            <span>成绩未复核，无法导出</span>
          </template>
          <a-button disabled>导出所有成绩</a-button>
        </a-tooltip>
        <a-button
          v-if="isApproved"
          :loading="exportALLLoading"
          @click="handleExport(2)"
        >
          导出所有成绩
        </a-button> -->

        <a-button :loading="downloadLoading" @click="handleDownloadTemplate">
          下载成绩模板
        </a-button>
        <ImportFileAsync
          v-if="!isApproved && isCurrentSemester && !isLocked"
          :show-file-dialog="showFileDialog"
          :import-service="importService"
          :query-condition-service="queryConditionService"
          :export-err="exportErr"
          :import-service-params="{ semesterId: currentSemesterId, courseId }"
          @import-excel-success="importSuccess"
        >
          <a-button @click="handleShowFileDialog">
            批量导入成绩
          </a-button>
        </ImportFileAsync>
        <a-tooltip
          v-if="isApproved && isCurrentSemester && !isLocked"
          placement="top"
        >
          <template #title>
            <span>成绩已复核，不可导入成绩</span>
          </template>
          <a-button disabled>批量导入成绩</a-button>
        </a-tooltip>
        <a-tooltip v-if="isLocked && isCurrentSemester" placement="top">
          <template #title>
            <span>成绩已锁定，不可导入成绩</span>
          </template>
          <a-button disabled>批量导入成绩</a-button>
        </a-tooltip>
        <!-- 导出成绩 -->
        <a-popover
          v-if="isApproved"
          v-model:visible="exportPopoverVisible"
          trigger="click"
          placement="bottom"
        >
          <template #content>
            <div class="cursor btn-item" @click="handleExport(1)">
              导出总成绩
            </div>
            <div class="cursor btn-item" @click="handleExport(2)">
              导出所有成绩
            </div>
          </template>
          <a-button
            :loading="exportLoading"
            @click="exportPopoverVisible = true"
          >
            导出成绩
          </a-button>
        </a-popover>
        <a-tooltip v-if="!isApproved" placement="top">
          <template #title>
            <span>成绩未复核，不可导出</span>
          </template>
          <a-button disabled>导出成绩</a-button>
        </a-tooltip>

        <a-button type="link" class="gray-text">
          单项成绩显示方式：
          <span class="gray-text-value">
            {{ isPercentageSysRef ? '百分制' : '小分制' }}
          </span>
        </a-button>
      </a-space>

      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.usernameOrNumber"
            placeholder="请输入学生姓名或学号"
            @search="onSearch"
          />
        </a-form-item>
      </a-form>
    </div>
    <a-alert
      v-if="isApproved && scoreGenerationTimeRef !== ''"
      :message="'成绩生成时间：' + scoreGenerationTimeRef"
      type="info"
      show-icon
    />

    <GradeTable
      ref="GradeTableref"
      class="mt-24"
      :course-id="courseId"
      :is-approved="isApproved"
      :is-locked="isLocked"
      :keyword="formState.usernameOrNumber"
    />
  </div>
  <ProcessLoading
    :show-visible="showVisible"
    :get-process-service="getProcessService"
    :get-process-service-params="{ courseId }"
    @close="showVisible = false"
    @finish="handleFinish"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import GradeTable from './GradeTable/Index.vue';
import ProcessLoading from '@/components/global/ProcessLoading.vue';
import { message, Modal } from 'ant-design-vue';
import { reViewServicePresenter } from '@/request/api/presenter/schoolSetting';
import { GradePresenter } from '@/request/api/presenter/class';
import { GradeService } from '@/request/api/model/class';
import moment from 'moment';
import { getModalHeadVNode } from '@/utils/common';
import { useStore } from 'vuex';
import ImportFileAsync from '@/components/global/ImportFileAsync.vue';
import { reViewServiceModal } from '@/request/api/model/schoolSetting';

export default defineComponent({
  components: { GradeTable, ProcessLoading, ImportFileAsync },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isApproved = ref<boolean>(false); //是否已复核
    const isLocked = ref<boolean>(false); //是否已锁定;
    const scoreGenerationTimeRef = ref<string>(''); //成绩生成时间
    const isPercentageSysRef = ref<boolean>(false); //是否为百分制

    const store = useStore();
    const isCurrentSemester = computed(
      () => store.state.basic.currentSemester.current === 1
    ); //是否当前学期

    const currentSemesterId = computed(
      () => store.state.basic.currentSemester.id
    ); //当前学期信息

    // 查询复核状态
    const getStatus = async () => {
      try {
        const params = {
          courseId: props.courseId
        };
        const {
          lockStatus,
          reviewFlag,
          scoreGenerationTime
        } = await reViewServicePresenter.getReviewStatus(params);
        isApproved.value = reviewFlag;
        isLocked.value = lockStatus;
        if (scoreGenerationTime) {
          scoreGenerationTimeRef.value = moment(scoreGenerationTime).format(
            'YYYY-MM-DD HH:mm'
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    // 查询是否为百分制
    const getSingleShowType = async () => {
      try {
        const data = await GradePresenter.getSingleShowType();
        isPercentageSysRef.value = data;
      } catch (error) {
        console.log(error);
      }
    };
    getSingleShowType();

    getStatus();

    watch(
      () => props.courseId,
      () => {
        getStatus();
      }
    );

    const showVisible = ref(false);
    const showConfirm = () => {
      showVisible.value = true;
    };

    const loading = ref<boolean>(false);
    const handleReview = async () => {
      try {
        const params = {
          courseId: props.courseId
        };
        loading.value = true;
        await reViewServicePresenter.reViewCrouse(params);
        showConfirm();
      } catch (error) {
        console.log(error);
        message.error(error?.message);
      } finally {
        loading.value = false;
      }
    };
    const handleShow = () => {
      const titleVnode = getModalHeadVNode('复核班级成绩');
      Modal.confirm({
        title: titleVnode,
        content: '复核后的成绩将发布至学生App。',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk: () => {
          handleReview();
        }
      });
    };

    const GradeTableref = ref();
    const cancelLoading = ref<boolean>(false);
    const handleCancel = async () => {
      const params = {
        courseId: props.courseId
      };
      const titleVnode = getModalHeadVNode('取消复核');
      Modal.confirm({
        title: titleVnode,
        content: '取消复核后，当前成绩将从学生App撤回。',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk: async () => {
          try {
            cancelLoading.value = true;
            await reViewServicePresenter.cancelReViewCrouse(params);
            message.success('取消复核成功！');
            // isApproved.value = false;
            // 取消复核 刷新列表（非复核状态取实时成绩）
            GradeTableref.value.initList();
            getStatus();
          } catch (error) {
            console.log(error);
            message.error(error?.message);
          } finally {
            cancelLoading.value = false;
          }
        }
      });
    };

    // 完成复核
    const handleFinish = () => {
      message.success('复核成功！');
      getStatus();
      // isApproved.value = true;
    };

    const exportLoading = ref<boolean>(false);
    const exportALLLoading = ref<boolean>(false);
    const exportPopoverVisible = ref<boolean>(false);
    const handleExport = async (type: number) => {
      try {
        const params = {
          courseId: props.courseId
        };
        exportLoading.value = true;
        if (type === 1) {
          await GradeService.exportUserTotalGrade(params);
        } else {
          await GradeService.exportUserAllGrade(params);
        }
      } catch (error) {
        console.log(error);
      } finally {
        exportLoading.value = false;
        exportPopoverVisible.value = false;
      }
    };

    const formState = reactive({
      usernameOrNumber: ''
    });

    const onSearch = () => {
      GradeTableref.value.current = 1;
      GradeTableref.value.getList();
    };

    const showFileDialog = ref<boolean>(false); //展示文件进度弹窗

    const handleShowFileDialog = () => {
      showFileDialog.value = true;
    };

    const downloadLoading = ref<boolean>(false);
    const handleDownloadTemplate = async () => {
      try {
        const params = {
          courseId: props.courseId,
          semesterId: currentSemesterId.value
        };
        downloadLoading.value = true;
        await reViewServiceModal.exportClassTemplate(params);
      } catch (error) {
        console.log(error);
      } finally {
        downloadLoading.value = false;
      }
    };

    // 导入成功回调
    const importSuccess = () => {
      onSearch();
    };

    return {
      formState,
      onSearch,
      handleShow,
      handleReview,
      handleCancel,
      handleExport,
      showVisible,
      handleFinish,
      GradeTableref,
      getProcessService: reViewServicePresenter.getReViewProgress,
      exportLoading,
      exportALLLoading,

      isApproved,
      isLocked,
      isPercentageSysRef,
      scoreGenerationTimeRef,
      cancelLoading,
      loading,
      isCurrentSemester,

      importService: reViewServiceModal.importClassGrade,
      queryConditionService: reViewServiceModal.queryClassImportResult,
      exportErr: reViewServiceModal.downloadExportErr,
      currentSemesterId,
      handleShowFileDialog,
      showFileDialog,
      handleDownloadTemplate,
      downloadLoading,
      importSuccess,

      exportPopoverVisible
    };
  }
});
</script>

<style lang="less" scoped>
.grade-list {
  background: #fff;
  padding: 16px;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .gray-text {
    color: rgba(0, 0, 0, 0.85);
    &-value {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
.mt-24 {
  margin-top: 24px;
}
.btn-item {
  line-height: 32px;
  &:nth-child(1) {
    border-bottom: 1px solid #f0f2f5;
  }
}
</style>
