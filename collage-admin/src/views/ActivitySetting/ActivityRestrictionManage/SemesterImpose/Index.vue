<template>
  <div class="test-wrap">
    <div class="add-semester">
      <a-button
        v-if="isNowSemester"
        type="primary"
        :disabled="isDisabled"
        @click="addSemesterLimit"
      >
        新建学期限制
      </a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        bordered
        :pagination="false"
        row-key="id"
      >
        <template
          v-for="col in ['name', 'year', 'sex', 'time', 'dayTime', 'weekTime']"
          #[col]="{ text, record }"
        >
          <div v-if="['name'].includes(col)" :key="col">
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][col]"
              style="margin: -5px 0;"
              :maxlength="40"
            />
            <template v-else>
              <p :title="text" class="data-name">
                {{ text }}
              </p>
            </template>
          </div>
          <div v-if="['year'].includes(col)" :key="col">
            <a-select
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][col]"
              mode="multiple"
            >
              <a-select-option
                v-for="item in gradeList"
                :key="item.value"
                :value="Number(item.value)"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
            <template v-else>
              <span v-for="item in text" :key="item">{{ item }}&emsp;</span>
            </template>
          </div>
          <div v-if="['sex'].includes(col)" :key="col">
            <a-col :span="8">
              <a-select
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][col]"
                class="with100"
              >
                <a-select-option :value="0">
                  不限
                </a-select-option>
                <a-select-option :value="1">
                  仅男生
                </a-select-option>
                <a-select-option :value="2">
                  仅女生
                </a-select-option>
              </a-select>
              <template v-else>
                <span v-if="text === 0">
                  不限
                </span>
                <span v-if="text === 1">
                  仅男生
                </span>
                <span v-if="text === 2">
                  仅女生
                </span>
              </template>
            </a-col>
          </div>
          <div v-if="['dayTime'].includes(col)" :key="col">
            <span v-if="editableData[record.key]">
              <a-input-number
                v-model:value="editableData[record.key][col]"
                :min="0"
              />
              &emsp;
              <span v-if="editableData[record.key][col] === 0">不限</span>
            </span>

            <template v-else>
              <span v-if="text === 0">
                不限
              </span>
              <span v-else>
                {{ text }}
              </span>
            </template>
          </div>
          <div v-if="['weekTime'].includes(col)" :key="col">
            <span v-if="editableData[record.key]">
              <a-input-number
                v-model:value="editableData[record.key][col]"
                :min="0"
              />
              &emsp;
              <span v-if="editableData[record.key][col] === 0">不限</span>
            </span>

            <template v-else>
              <span v-if="text === 0">
                不限
              </span>
              <span v-else>
                {{ text }}
              </span>
            </template>
          </div>
          <div v-if="['time'].includes(col)" :key="col">
            <span v-if="editableData[record.key]">
              <a-input-number
                v-model:value="editableData[record.key][col]"
                :min="0"
              />
              &emsp;
              <span v-if="editableData[record.key][col] === 0">不限</span>
            </span>

            <template v-else>
              <span v-if="text === 0">
                不限
              </span>
              <span v-else>
                {{ text }}
              </span>
            </template>
          </div>
        </template>
        <template #operation="{ record }">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a class="action-a" @click="save(record.key)">保存</a>
              <a-popconfirm
                title="退出后不保存当前录入，确定退出编辑状态吗?"
                @confirm="cancel(record.key)"
              >
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a
                :class="isDisabled && isNowSemester ? 'notClick' : 'action-a'"
                @click="activitiesList(record.id)"
              >
                活动名单
              </a>
              <a
                v-if="isNowSemester"
                :class="isDisabled ? 'notClick' : 'action-a'"
                @click="edit(record.key)"
              >
                编辑
              </a>
              <a
                v-if="isNowSemester"
                :class="isDisabled ? 'notClick' : 'action-del'"
                @click="delate(record.key)"
              >
                删除
              </a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
  <drawerList
    :is-drawer-show="isDrawerShow"
    :limit-id="limitId"
    @change-visible="changeVisible"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  watch
} from 'vue';
import drawerList from '../DrawerList/Index.vue';
import { Modal } from 'ant-design-vue';
import { ActivityLimitManagePresenter } from '@/request/api/presenter/course';
import { useStore } from 'vuex';
import { getModalHeadVNode } from '@/utils/common';
const columns = [
  {
    title: '限制名称',
    dataIndex: 'name',
    slots: { customRender: 'name' }
  },
  {
    title: '可报年级',
    dataIndex: 'year',
    slots: { customRender: 'year' }
  },
  {
    title: '可报性别',
    dataIndex: 'sex',
    slots: { customRender: 'sex' }
  },
  {
    title: '每日次数上限',
    dataIndex: 'dayTime',
    slots: { customRender: 'dayTime' }
  },
  {
    title: '每周次数上限',
    dataIndex: 'weekTime',
    slots: { customRender: 'weekTime' }
  },
  {
    title: '学期次数上限',
    dataIndex: 'time',
    slots: { customRender: 'time' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    slots: { customRender: 'operation' }
  }
];

interface dataSource {
  id: string;
  key: any;
  name: string;
  semesterId: string;
  sex: number;
  time: number;
  year: number[];
  dayTime: number;
  weekTime: number;
}

const getStoreInfo = () => {
  const store = useStore();
  const gradeList = computed(() => store.state.basic.gradeList);

  const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

  store.dispatch('basic/updateGradeList');
  return {
    gradeList,
    currentSemester
  };
};

export default defineComponent({
  components: {
    drawerList
  },
  setup() {
    const isDisabled = ref<boolean>(false);
    const isAddList = ref<number>(0); //1添加
    const loading = ref<boolean>(false);
    const { gradeList, currentSemester } = getStoreInfo();
    const dataSource = ref<dataSource[]>([]);
    const limitId = ref<string>('');
    const isNowSemester = ref<boolean>(false); //true当前学期
    if (currentSemester.value.current === 1) {
      isNowSemester.value = true;
    }

    const getList = async () => {
      loading.value = true;

      const data = {
        semesterId: currentSemester.value.id
      };
      try {
        const res = await ActivityLimitManagePresenter.getRestriction(data);
        dataSource.value = res;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => currentSemester.value,
      () => {
        if (currentSemester.value.current !== 1) {
          try {
            getList();
            isNowSemester.value = false;
          } catch (error) {
            console.log(error);
          }
          isDisabled.value = true;
        } else {
          try {
            getList();
            isNowSemester.value = true;
          } catch (error) {
            console.log(error);
          }
          isDisabled.value = false;
        }
      }
    );

    getList();

    const editableData: UnwrapRef<Record<string, dataSource>> = reactive({});
    const edit = (key: string) => {
      editableData[key] = JSON.parse(
        JSON.stringify(dataSource.value.filter(item => key === item.key)[0])
      );
      isAddList.value = 2;
      isDisabled.value = true;
    };

    const save = async (key: string) => {
      const createData = {
        name: editableData[key].name,
        semesterId: currentSemester.value.id,
        sex: editableData[key].sex,
        time: editableData[key].time,
        year: editableData[key].year,
        dayTime: editableData[key].dayTime,
        weekTime: editableData[key].weekTime
      };

      const updateData = {
        id: editableData[key].id,
        name: editableData[key].name,
        semesterId: currentSemester.value.id,
        sex: editableData[key].sex,
        time: editableData[key].time,
        year: editableData[key].year,
        dayTime: editableData[key].dayTime,
        weekTime: editableData[key].weekTime
      };
      const updateDataNoname = {
        id: editableData[key].id,
        semesterId: currentSemester.value.id,
        sex: editableData[key].sex,
        time: editableData[key].time,
        year: editableData[key].year,
        dayTime: editableData[key].dayTime,
        weekTime: editableData[key].weekTime
      };

      if (editableData[key].name === '') {
        Modal.error({
          title: '添加失败',
          content: '限制名称不能为空'
        });
        return;
      }
      if (editableData[key].year.length === 0) {
        Modal.error({
          title: '添加失败',
          content: '可报年级不能为空'
        });
        return;
      }
      if (isAddList.value === 1) {
        //添加
        try {
          await ActivityLimitManagePresenter.create(createData);
          delete editableData[key];
          isDisabled.value = false;
          try {
            await getList();
          } catch (error) {
            console.log(error);
          } finally {
            loading.value = false;
          }
        } catch (error) {
          console.log(error);
          Modal.error({
            title: '添加失败',
            content: `${error.message}`
          });
        }
      } else {
        try {
          dataSource.value.forEach(async (element: any) => {
            //名称相同不传名称
            if (element.id === editableData[key].id) {
              if (editableData[key].name === element.name) {
                try {
                  await ActivityLimitManagePresenter.update(updateDataNoname);
                  try {
                    await getList();
                  } catch (error) {
                    console.log(error);
                  } finally {
                    loading.value = false;
                  }
                  delete editableData[key];
                  isDisabled.value = false;
                } catch (error) {
                  Modal.error({
                    title: '编辑失败',
                    content: `${error.message}`
                  });
                }
              } else {
                try {
                  await ActivityLimitManagePresenter.update(updateData);
                  try {
                    await getList();
                  } catch (error) {
                    console.log(error);
                    Modal.error({
                      title: '编辑失败',
                      content: `${error.message}`
                    });
                  } finally {
                    loading.value = false;
                  }

                  delete editableData[key];
                  isDisabled.value = false;
                } catch (error) {
                  Modal.error({
                    title: '编辑失败',
                    content: `${error.message}`
                  });
                }
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    const cancel = (key: string) => {
      if (isAddList.value === 1) {
        dataSource.value.shift();
        delete editableData[key];
        isDisabled.value = false;
      } else {
        delete editableData[key];
        isDisabled.value = false;
      }
    };

    const addSemesterLimit = () => {
      const key = (dataSource.value.length + 1).toString();
      const addDataSource = {
        id: '',
        key,
        name: '',
        semesterId: '',
        sex: 0,
        time: 0,
        year: [],
        dayTime: 0,
        weekTime: 0
      };
      dataSource.value.unshift(addDataSource);
      edit(key);
      isAddList.value = 1;
    };

    const isDrawerShow = ref<boolean>(false);
    const activitiesList = async (id: string) => {
      //活动名单
      limitId.value = id;
      isDrawerShow.value = true;
    };

    const changeVisible = (visibele: boolean) => {
      isDrawerShow.value = visibele;
    };

    const delate = (key: string) => {
      const titleVnode = getModalHeadVNode('确定要删除吗？');
      const id = JSON.parse(
        JSON.stringify(dataSource.value.filter(item => key === item.key)[0])
      );
      const data = {
        id: id.id
      };
      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          try {
            const res = await ActivityLimitManagePresenter.delate(data);
            if (res === false) {
              Modal.error({
                title: '删除失败',
                content: '当前限制存在活动不可删除'
              });
            }
            try {
              await getList();
            } catch (error) {
              console.log(error);
            } finally {
              loading.value = false;
            }
          } catch (error) {
            console.log(error);
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    return {
      isDisabled,
      dataSource,
      columns,
      addSemesterLimit,
      editableData,
      edit,
      save,
      cancel,
      activitiesList,
      isDrawerShow,
      changeVisible,
      delate,
      loading,
      limitId,
      isNowSemester,
      gradeList
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-col-8) {
  width: 100%;
}
:deep(.ant-select-enabled) {
  width: 100%;
}
:deep(.ant-input-number) {
  width: 70%;
}
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .add-semester {
    margin-bottom: 24px;
  }
  .action-a {
    margin-right: 10px;
  }
  .action-del {
    color: #eb3f2f;
  }
}
.notClick {
  pointer-events: none;
  color: rgba(0, 0, 0, 0.45);
  cursor: not-allowed;
  margin-right: 10px;
}
.error-input-message {
  border: 1px solid #eb3f2f;
}
.data-name {
  width: 170px;
  margin: 0;
  overflow: hidden;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
