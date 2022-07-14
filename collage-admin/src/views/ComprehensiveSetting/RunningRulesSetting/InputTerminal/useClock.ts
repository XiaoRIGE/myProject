import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import {
  EnteringTerminalServicePresenter,
  SwitchParams
} from '@/request/api/presenter/runSettings';

export default function useClock(faceRunningStatus: { value: boolean }) {
  const handleOk = async (data: SwitchParams) => {
    const result = await EnteringTerminalServicePresenter.switch(data);
    if (result.data.code === 0) {
      faceRunningStatus.value = !faceRunningStatus.value;
    }
  };

  /**
   * 弹框操作
   * @param title
   * @param tipText
   * @param state
   */
  const showConfirm = (title: string, tipText: string, state: SwitchParams) => {
    Modal.confirm({
      title,
      content: createVNode(
        'div',
        {
          style: 'color: #999999;'
        },
        tipText
      ),
      onOk() {
        handleOk(state);
      },
      class: 'test'
    });
  };

  /**
   * 开启打开
   */
  const openClock = (params: SwitchParams): void => {
    const title = '开启岗亭打卡录入功能';
    const textTip = '开启后，学生可使用岗亭打卡跑步功能。';
    showConfirm(title, textTip, params);
  };

  /**
   * 关闭打卡功能
   */
  const closeClock = (params: SwitchParams): void => {
    const title = '关闭岗亭打卡录入功能';
    const textTip =
      '确认关闭后，学生跑步打卡可能依然会成功，但系统不处理打卡数据。';
    showConfirm(title, textTip, params);
  };

  return {
    openClock,
    closeClock,
    showConfirm
  };
}
