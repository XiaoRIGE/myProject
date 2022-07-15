/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:59:09
 * @LastEditTime: 2022-06-24 14:08:59
 * @LastEditors: Author
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Button,
  Divider,
  Popconfirm,
  Form,
  Input,
  Modal
} from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'


function DeviceManagement () {
  const [form] = Form.useForm();
  const navigate = useNavigate()

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
      address: '主车 JR-ZC-001',
  }
  ]
  const columns = [
    {
      title: '设备类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备数量',
      dataIndex: 'age',
      key: 'age',
    },
    {
    title: '操作',
    key: 'handle',
    render(...args) {
      return (
        <>
          <Button onClick={(e) => editDeviceWell(args, e)} style={{padding: 0}} type="text" danger>编辑</Button>
          <Divider type="vertical" />
          <Button onClick={(e) => navigate('/equipmentConfig')} style={{padding: 0}} type="text" danger>设备配置</Button>
          <Divider type="vertical" />
           <Popconfirm onConfirm={(e) => deleteWorkingWell(args, e)} title="确定删除该设备类型吗？" okText="删除" cancelText="取消">
            <Button style={{padding: 0}} onClick={ e=> {
              e.stopPropagation()
            }} type="text" danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
    }
  ];
  // 新增编辑作业井弹窗状态
  const [ deviceTypeVisible, setDeviceTypeVisible ] =useState(false)
  const editDeviceWell = (args, e) => {
    e.stopPropagation()
    console.log('编辑：', args)
    setDeviceTypeVisible(true)
  }

  // 表格编辑
  const deleteWorkingWell = (args, e) => {
    e.stopPropagation()
    console.log('delete:', args)
  }

  const resetFie = () => {
    // 重置
    form.resetFields();
  }
  const onFinish = value => {
    // 筛选
    console.log('search:', value)
  }
  const onModalClose = () => {
    // 新增编辑作业弹窗关闭
    setDeviceTypeVisible(false)
  }

  // 新增编辑提交
  const submitForm = () => {
   form.validateFields().then(value => {
     console.log('values:', value)
    //  验证成功
   })
  }
  return (
    <>
      <CustomBreadcrumb title='设备管理'/>
      <Card bordered={false} style={{margin: '0 24px'}}>
        {/* 筛选 */}
        <Form 
          layout='inline'
          form={form}
          style={{marginBottom: 24}}
          onFinish={onFinish}
          >
          <Form.Item label="设备类型" name='type' >
            <Input.Search  placeholder="请输入" onSearch={(value)=> onFinish(value)}/>
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

        {/* 新增作业 */}
        <Button
          type="primary"
          size='middle'
          onClick={()=> setDeviceTypeVisible(true)}
          style={{ marginBottom: 16, width: 120 }}>
          新增设备类型
        </Button>
        {/* 表格 */}
        <Table
          dataSource={dataSource}
          columns={columns}/>
      </Card>

      {/* 新增编辑设备类型弹窗 */}
      <Modal
        title="新增设备类型"
        cancelText="取消"
        okText="确定"
        bodyStyle={{height: 120}}
        visible={deviceTypeVisible}
        onOk={submitForm}
        onCancel={onModalClose}>
          <Form
            layout='vertical'
            form={form}
            style={{marginBottom: 24}}
            onFinish={onFinish}
          >
            <Form.Item
            label="设备类型"
            name='type'
            rules={[
              {
                required: true,
                message: '请输入设备类型'
              }
            ]}>
              <Input placeholder="请输入" />
            </Form.Item >
          </Form>
      </Modal>
    </>
  )
}

export default DeviceManagement