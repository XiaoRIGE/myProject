/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:57:54
 * @LastEditTime: 2022-06-24 17:04:56
 * @LastEditors: Author
 */
import { Card, Popover, Table, Button, Form, Input } from 'antd';
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import './index.scss'
function OperationTeam () {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '10',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '主车 JR-ZC-001；注入头 JR-ZRT-001；防喷器 JR-FPQ-001；滚筒 JR-GT-001；防喷盒 JR-FPH-001…',
    }]
  const columns = [
    {
      title: '队伍名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '队伍代号',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '设备配套',
      dataIndex: 'address',
      key: 'address',
      render(data) {
        return <Popover placement="topRight" title='' content={data} trigger="hover">
                  <p>{data}</p>
                </Popover>
      }
    }
  ];
  const [form] = Form.useForm();

  // 查询
  const onFinish = value => {
    console.log(value)
  }

  // 重置
  const resetFie = () => {
    form.resetFields();
    console.log('reset')
  }
  return (
    <>
      <CustomBreadcrumb title='作业队伍'/>
      <Card className='tab-card-content' bordered={false} style={{margin: '0 24px'}}>
          {/* 搜索表单 */}
          <Form 
            layout='inline'
            form={form}
            style={{marginBottom: 24}}
            onFinish={onFinish}
            >
            <Form.Item label="队伍名称" name='teamName'>
              <Input.Search placeholder="请输入" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={ resetFie }>
                重置
              </Button>
            </Form.Item>
          </Form>
          {/* 表格 */}
          <Table dataSource={dataSource} columns={columns} />
      </Card>
    </>
  )
}

export default OperationTeam