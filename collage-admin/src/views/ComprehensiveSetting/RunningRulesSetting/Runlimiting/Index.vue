<template>
  <div class="test-wrap">
    <div v-if="isMileage" class="second_header">
      <div class="title">
        跑步计分模式：里程模式
      </div>
      <div>
        <a-button type="primary" @click="switchNumber">
          切换为段数
        </a-button>
      </div>
    </div>
    <div v-else class="second_header">
      <div class="title">
        跑步计分模式：段数模式
      </div>
      <div>
        <a-button type="primary" @click="switchNumberLc">
          切换为里程
        </a-button>
      </div>
      <div class="hintMessage">
        提示文案：计分模式为段数时，暂时无法开启跑步机与岗亭扫脸
      </div>
    </div>

    <div v-if="isAllSchoolSame" class="third_header">
      <div>
        学校跑步限制与目标设置：全校一致
      </div>
      <div class="header_switch_btn" @click="allSchoolDifferent">
        切换为全校不同
      </div>
    </div>
    <div v-else class="third_header">
      <div>
        学校跑步限制与目标设置：全校不同
      </div>
      <div class="header_switch_btn" @click="allSchoolSame">
        切换为全校一致
      </div>
    </div>

    <div class="content">
      <div>
        <a-table
          v-if="isMileage"
          bordered
          row-key="id"
          :data-source="dataSource"
          :loading="loadingMileage"
          :pagination="false"
          :columns="columns"
        >
          <template #gender="{ record }">
            <span v-if="record.gender === '男女一致'">
              男女一致
            </span>
            <span v-else>
              {{ record.sexStr }}
            </span>
          </template>
          <template #averagespeed="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.averageSpeedStart !== 'Invalid date'"
                class="editable-cell-text-wrapper"
              >
                {{ record.averageSpeedStart }}-{{ record.averageSpeedEnd }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #stride="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.averageCadenceStart !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.averageCadenceStart }}-{{ record.averageCadenceEnd }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #effectiverange="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.effectiveMileageStart !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.effectiveMileageStart }}~{{
                  record.effectiveMileageEnd
                }}KM
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #dailyMileage="{ text }">
            <div class="editable-cell">
              <div v-if="text !== null" class="editable-cell-text-wrapper">
                {{ text }}KM
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #weeklyMileage="{ text }">
            <div class="editable-cell">
              <div v-if="text !== null" class="editable-cell-text-wrapper">
                {{ text }}KM
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #semesterMileage="{ text }">
            <div class="editable-cell">
              <div v-if="text !== null" class="editable-cell-text-wrapper">
                {{ text }}KM
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #operation="{ record }">
            <div class="update">
              <a @click="update(record)">编辑</a>
              <a @click="clear(record)">重置</a>
            </div>
          </template>
        </a-table>

        <a-table
          v-else
          bordered
          row-key="id"
          :data-source="dataSourceNumber"
          :loading="loadingNumber"
          :pagination="false"
          :columns="columnsNumber"
        >
          <template #gender="{ record }">
            <span v-if="record.gender === '男女一致'">
              男女一致
            </span>
            <span v-else>
              {{ record.sexStr }}
            </span>
          </template>
          <template #averagespeed="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.averageSpeedStart !== 'Invalid date'"
                class="editable-cell-text-wrapper"
              >
                {{ record.averageSpeedStart }}-{{ record.averageSpeedEnd }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #stride="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.averageCadenceStart !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.averageCadenceStart }}-{{ record.averageCadenceEnd }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #effectiverange="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.effectiveParagraphMileage !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.effectiveParagraphMileage }}KM
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #mileagelimit="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.effectiveParagraphStart !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.effectiveParagraphStart }}-{{
                  record.effectiveParagraphEnd
                }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #weeklylimit="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.dailyParagraph !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.dailyParagraph }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #semestermilestone="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.weeklyParagraph !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.weeklyParagraph }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #semesterNumberTarget="{ record }">
            <div class="editable-cell">
              <div
                v-if="record.semesterParagraph !== null"
                class="editable-cell-text-wrapper"
              >
                {{ record.semesterParagraph }}
              </div>
              <div v-else class="editable-cell-text-wrapper">
                --
              </div>
            </div>
          </template>
          <template #operation="{ record }">
            <div class="update">
              <a @click="update(record)">编辑</a>
              <a @click="clear(record)">重置</a>
            </div>
          </template>
        </a-table>
      </div>
      <div class="special_setting">
        特殊跑步限制与目标设置
      </div>
    </div>
    <div class="second_content">
      <TargetTable
        :is-all-school-same="isMileage"
        :is-mileage-message="isMileageMessage"
      />
    </div>
  </div>

  <SchoolRunRestrictDialog
    :close-app-visible="showVisible"
    :who-click="whoClick"
    :is-mileage-message="isMileageMessage"
    :form-data-list="schoolTargetUpdataList.data"
    @change-visible="changeVisible"
    @update-success="updateSuccess"
  />
</template>

<script lang="ts">
import { message, Modal } from 'ant-design-vue';
import { defineComponent, onMounted, reactive, Ref, ref, computed } from 'vue';
import TargetTable from './TargetTable/Index.vue';
import SchoolRunRestrictDialog from './SchoolRunRestrictDialog/Index.vue';
import { SchoolRunAstrictTargetSettingsServicePresenter } from '@/request/api/presenter/runSettings';
import { getModalHeadVNode } from '@/utils/common';
import { useStore } from 'vuex';
interface DataItem {
  limitGoalsInfoId: any;
  key: number;
  year: string;
  semester: string;
  gender: string;
  stride: string;
  effectiverange: string;
  mileagelimit: string;
  weeklylimit: string;
  semestermilestone: string;
}

export default defineComponent({
  components: {
    TargetTable,
    SchoolRunRestrictDialog
  },
  setup() {
    const whoClick = ref('schoolUpdate');
    const isMileage = ref<boolean>(true);
    const isMileageMessage = ref<string>('里程');
    const isAllSchoolSame = ref<boolean>(true);
    const showVisible = ref<boolean>(false);
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const loadingMileage = ref<boolean>(false);
    const loadingNumber = ref<boolean>(false);

    const schoolTargetUpdataList = reactive({
      data: {
        averagespeed: '',
        effectiverange: '',
        gender: '',
        key: 0,
        mileagelimit: '',
        semester: '',
        semestermilestone: '',
        stride: '',
        weeklylimit: '',
        year: ''
      }
    });

    const columns = [
      {
        title: '学年',
        dataIndex: 'year',
        width: '10%',
        align: 'center'
      },
      {
        title: '学期',
        dataIndex: 'semester',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        slots: { customRender: 'gender' }
      },
      {
        title: '平均配速（/公里）',
        dataIndex: 'averagespeed',
        align: 'center',
        slots: { customRender: 'averagespeed' }
      },
      {
        title: '平均步频（步/分钟）',
        dataIndex: 'stride',
        align: 'center',
        slots: { customRender: 'stride' }
      },
      {
        title: '每次有效里程',
        dataIndex: 'effectiverange',
        align: 'center',
        slots: { customRender: 'effectiverange' }
      },
      {
        title: '每日里程上限',
        dataIndex: 'dailyMileage',
        align: 'center',
        slots: { customRender: 'dailyMileage' }
      },
      {
        title: '每周里程上限',
        dataIndex: 'weeklyMileage',
        align: 'center',
        slots: { customRender: 'weeklyMileage' }
      },
      {
        title: '学期目标里程',
        dataIndex: 'semesterMileage',
        align: 'center',
        slots: { customRender: 'semesterMileage' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        align: 'center',
        slots: { customRender: 'operation' }
      }
    ];
    const columnsNumber = [
      {
        title: '学年',
        dataIndex: 'year',
        width: '10%',
        align: 'center'
      },
      {
        title: '学期',
        dataIndex: 'semester',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        slots: { customRender: 'gender' }
      },
      {
        title: '平均配速（/公里）',
        dataIndex: 'averagespeed',
        align: 'center',
        slots: { customRender: 'averagespeed' }
      },
      {
        title: '平均步频（步/分钟）',
        dataIndex: 'stride',
        align: 'center',
        slots: { customRender: 'stride' }
      },
      {
        title: '每段有效里程',
        dataIndex: 'effectiverange',
        align: 'center',
        slots: { customRender: 'effectiverange' }
      },
      {
        title: '每次有效段数',
        dataIndex: 'mileagelimit',
        align: 'center',
        slots: { customRender: 'mileagelimit' }
      },
      {
        title: '每日段数上限',
        dataIndex: 'weeklylimit',
        align: 'center',
        slots: { customRender: 'weeklylimit' }
      },
      {
        title: '每周段数上限',
        dataIndex: 'semestermilestone',
        align: 'center',
        slots: { customRender: 'semestermilestone' }
      },
      {
        title: '学期段数目标',
        dataIndex: 'semesterNumberTarget',
        align: 'center',
        slots: { customRender: 'semesterNumberTarget' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        align: 'center',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource: Ref<DataItem[]> = ref([]);
    const dataSourceNumber: Ref<DataItem[]> = ref([]);
    const requestData = {
      limitType: 0,
      scoringType: 0,
      semesterId: currentSemester.value.id
    };

    const getLimitGoalsInfo = async (requestData: any) => {
      // 获取列表详情接口
      loadingMileage.value = true;
      loadingNumber.value = true;

      try {
        const res = await SchoolRunAstrictTargetSettingsServicePresenter.limitGoalsInfo(
          requestData
        );
        dataSource.value = [];
        dataSourceNumber.value = [];
        if (res.baseVO.limitTypeStr === '全校不同') {
          isAllSchoolSame.value = false;
        } else {
          isAllSchoolSame.value = true;
        }
        if (res.baseVO.scoringType === 1) {
          //1为里程模式
          //判断当前是否全校一致（全校一致）
          isMileage.value = true;
          isMileageMessage.value = '里程';
          const resData = res.goalsInfoList;
          for (let i = 0; i < resData.length; i++) {
            const resDatalast = resData[i].lastSemesterGoalsInfoVO.sexInfoList;
            const resDatanext = resData[i].nextSemesterGoalsInfoVO.sexInfoList;
            for (let k = 0; k < resDatalast.length; k++) {
              dataSource.value.push(resDatalast[k]);
            }
            for (let k = 0; k < resDatanext.length; k++) {
              dataSource.value.push(resDatanext[k]);
            }
          }
        } else {
          //段数模式
          //判断当前是否全校一致（全校一致）
          isMileage.value = false;
          isMileageMessage.value = '段数';
          const resData = res.goalsInfoList;
          for (let i = 0; i < resData.length; i++) {
            for (
              let k = 0;
              k < resData[i].lastSemesterGoalsInfoVO.sexInfoList.length;
              k++
            ) {
              dataSourceNumber.value.push(
                resData[i].lastSemesterGoalsInfoVO.sexInfoList[k]
              );
            }
            for (
              let k = 0;
              k < resData[i].nextSemesterGoalsInfoVO.sexInfoList.length;
              k++
            ) {
              dataSourceNumber.value.push(
                resData[i].nextSemesterGoalsInfoVO.sexInfoList[k]
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '切换失败',
          content: `${error.message}`
        });
      } finally {
        loadingMileage.value = false;
        loadingNumber.value = false;
      }
    };
    onMounted(async () => {
      try {
        await getLimitGoalsInfo(requestData);
      } catch (error) {
        console.log(error);
      }
    });

    const changeVisible = (visibele: boolean) => {
      showVisible.value = visibele;
    };

    const updateSuccess = async () => {
      //dialog保存成功的回调
      requestData.scoringType = 0;
      requestData.limitType = 0;
      try {
        await getLimitGoalsInfo(requestData);
        showVisible.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    const switchNumber = () => {
      //切换为段数
      //isAllSchoolSame.value全校一致为true
      Modal.confirm({
        title: '是否确认切换跑步计分模式',
        content: '切换后原配置会保存',
        async onOk() {
          if (isAllSchoolSame.value === false) {
            //判断当前是否全校一致（全校不同）
            requestData.scoringType = 2;
            requestData.limitType = 2;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
              Modal.error({
                title: '切换失败',
                content: `${error.message}`
              });
            }
          } else {
            requestData.limitType = 1;
            requestData.scoringType = 2;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
              Modal.error({
                title: '切换失败',
                content: `${error.message}`
              });
            }
          }
        }
      });
    };

    const switchNumberLc = () => {
      //切换为里程
      Modal.confirm({
        title: '是否确认切换跑步计分模式',
        content: '切换后原配置会保存',
        async onOk() {
          if (isAllSchoolSame.value === false) {
            //判断当前是否全校一致（全校不同）
            requestData.scoringType = 1;
            requestData.limitType = 2;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
              requestData.scoringType = 0;
              requestData.limitType = 0;
              Modal.error({
                title: '切换失败',
                content: `${error.message}`
              });
            }
          } else {
            requestData.scoringType = 1;
            requestData.limitType = 1;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
              requestData.scoringType = 0;
              requestData.limitType = 0;
              Modal.error({
                title: '切换失败',
                content: `${error.message}`
              });
            }
          }
        }
      });
    };

    const allSchoolDifferent = () => {
      //切换为全校不同    requestData
      Modal.confirm({
        title: '是否确认切换为全校不同',
        content: '切换后原配置会保存',
        async onOk() {
          if (isMileage.value === true) {
            //当前为里程模式
            requestData.limitType = 2;
            requestData.scoringType = 1;
            isAllSchoolSame.value = false;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
            }
          } else {
            requestData.limitType = 2;
            requestData.scoringType = 2;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
            }
          }
        }
      });
    };

    //切换为全校一致
    const allSchoolSame = () => {
      Modal.confirm({
        title: '是否确认切换为全校一致',
        content: '切换后原配置会保存',
        async onOk() {
          if (isMileage.value === true) {
            //判断当前是否是里程模式
            requestData.scoringType = 1;
            requestData.limitType = 1;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
            }
          } else {
            requestData.scoringType = 2;
            requestData.limitType = 1;
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
            }
          }
        }
      });
    };

    const update = (data: any) => {
      //编辑
      let abcWoMen = {};
      if (isMileage.value === true) {
        isMileageMessage.value = '里程';
        for (let i = 0; i < dataSource.value.length; i++) {
          if (data.limitGoalsInfoId === dataSource.value[i].limitGoalsInfoId) {
            if (data.gender === '男女不同') {
              data.gender = data.sexStr;
            }

            if (data.gender !== dataSource.value[i].gender) {
              abcWoMen = dataSource.value[i];
            }
          }
        }
      } else {
        isMileageMessage.value = '段数';
        for (let i = 0; i < dataSourceNumber.value.length; i++) {
          if (
            data.limitGoalsInfoId === dataSourceNumber.value[i].limitGoalsInfoId
          ) {
            if (data.gender === '男女不同') {
              data.gender = data.sexStr;
            }
            if (data.gender !== dataSourceNumber.value[i].gender) {
              abcWoMen = dataSourceNumber.value[i];
            }
          }
        }
      }
      const number = JSON.stringify(abcWoMen);
      const number1 = JSON.parse(number);
      data.elsePeople = number1;

      whoClick.value = data.gender;
      schoolTargetUpdataList.data = data;
      showVisible.value = true;
    };

    const clear = (data: any) => {
      //重置
      const titleVnode = getModalHeadVNode('是否确认重置跑步限制与目标设置');
      const delateLimitRequestData = {
        limitGoalsInfoId: data.limitGoalsInfoId,
        scoringType: isMileageMessage.value === '里程' ? 1 : 2,
        sex: 0
      };
      if (data.gender === '男女一致') {
        delateLimitRequestData.sex = 0;
      } else {
        if (data.sexStr === '男') {
          delateLimitRequestData.sex = 1;
        } else {
          delateLimitRequestData.sex = 2;
        }
      }
      Modal.confirm({
        title: titleVnode,
        content: '重置后，数据恢复至默认数据',
        class: 'modal-class',
        async onOk() {
          requestData.limitType = 0;
          requestData.scoringType = 0;
          try {
            await SchoolRunAstrictTargetSettingsServicePresenter.delateLimitGoalsInfo(
              delateLimitRequestData
            );
            try {
              await getLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
            }
            message.success('重置成功');
          } catch (error) {
            Modal.error({
              title: '重置失败',
              content: `${error.message}`
            });
            console.log(error, 'error');
          }
        }
      });
    };

    return {
      showVisible,
      columns,
      columnsNumber,
      dataSource,
      dataSourceNumber,
      switchNumber,
      switchNumberLc,
      allSchoolDifferent,
      allSchoolSame,
      update,
      clear,
      changeVisible,
      updateSuccess,
      whoClick,
      schoolTargetUpdataList,
      isMileage,
      isAllSchoolSame,
      isMileageMessage,
      loadingMileage,
      loadingNumber
    };
  }
});
</script>

<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}

.second_header {
  display: flex;
  height: 100px;
  line-height: 60px;

  .title {
    margin-right: 30px;
  }
}

.third_header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid #d7d7d7;

  .header_switch_btn {
    color: #1966fe;
    cursor: pointer;
  }
}
.content {
  padding-top: 30px;
  .special_setting {
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #d7d7d7;
  }
  .update {
    display: flex;
    justify-content: space-around;
  }
}
.hintMessage {
  position: relative;
  left: -286px;
  top: 40px;
}
</style>
