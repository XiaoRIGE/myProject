<template>
  <div class="test-wrap">
    <div class="new-project">
      <div class="header">
        <h3>
          各年级活动规则
        </h3>
        <a-button v-if="updateTime" type="primary" @click="update">
          编辑
        </a-button>
        <div v-else>
          <a-button class="cancel" @click="cancel">
            取消
          </a-button>
          <a-button type="primary" @click="save">
            保存
          </a-button>
        </div>
      </div>
      <a-spin tip="Loading..." :spinning="spinning">
        <div class="content">
          <div v-for="item in ruleList" :key="item.name" class="content-piece">
            <div class="head-portrait">
              <img src="@/assets/activity.png" />
            </div>
            <h4>{{ item.name }}</h4>
            <div>
              <span class="every_time">
                每学期需参加次数
              </span>
              <span v-if="updateTime" class="several_time">
                {{ item.time }}次
              </span>
              <a-input-number
                v-else
                v-model:value="item.time"
                class="several_input"
                :min="0"
                :max="999"
              />
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, onMounted, ref } from 'vue';
import { ActivityThemeConfigurationPresenter } from '@/request/api/presenter/course';
export default defineComponent({
  setup() {
    const ruleList = ref([
      {
        name: '大一',
        time: 0
      },
      {
        name: '大二',
        time: 0
      },
      {
        name: '大三',
        time: 0
      },
      {
        name: '大四',
        time: 0
      }
    ]);
    const updateTime = ref<boolean>(true);
    const spinning = ref<boolean>(false);

    const getGradeList = async () => {
      spinning.value = true;
      const res = await ActivityThemeConfigurationPresenter.getGradeList();
      ruleList.value[0].time = res.freshman;
      ruleList.value[1].time = res.sophomore;
      ruleList.value[2].time = res.junior;
      ruleList.value[3].time = res.senior;
    };

    onMounted(async () => {
      try {
        await getGradeList();
      } catch (error) {
        console.log(error);
      } finally {
        spinning.value = false;
      }
    });

    const update = () => {
      updateTime.value = false;
    };

    const save = async () => {
      const data = {
        freshman: ruleList.value[0].time,
        junior: ruleList.value[2].time,
        senior: ruleList.value[3].time,
        sophomore: ruleList.value[1].time
      };
      try {
        await ActivityThemeConfigurationPresenter.updateActivityNumber(data);
        updateTime.value = true;
        message.success('保存成功！');
        try {
          await getGradeList();
        } catch (error) {
          console.log(error);
        } finally {
          spinning.value = false;
        }
      } catch (error) {
        message.error('保存失败！');
      }
    };

    const cancel = async () => {
      try {
        await getGradeList();
      } catch (error) {
        console.log(error);
      } finally {
        spinning.value = false;
      }
      updateTime.value = true;
    };

    return {
      ruleList,
      update,
      save,
      cancel,
      updateTime,
      spinning
    };
  }
});
</script>

<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;

  .header {
    display: flex;
    justify-content: space-between;

    h3 {
      font-weight: 700;
    }

    .cancel {
      margin-right: 20px;
    }
  }

  .content {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .content-piece {
      width: 30%;
      position: relative;
      margin-bottom: 30px;
      padding: 20px 0 30px 60px;
      border: 1px solid #d7d7d7;

      .head-portrait {
        position: absolute;
        left: 15px;
      }

      h4 {
        font-weight: 700;
      }

      .every_time {
        margin-right: 10px;
        vertical-align: middle;
      }

      .several_time {
        font-size: 20px;
        font-weight: 700;
        vertical-align: middle;
        height: 25px;
      }

      .several_input {
        vertical-align: middle;
        height: 31px;
      }
    }
  }
}
</style>
