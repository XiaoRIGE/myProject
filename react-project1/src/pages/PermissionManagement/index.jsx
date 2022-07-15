/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 14:02:59
 * @LastEditTime: 2022-06-27 10:51:34
 * @LastEditors: Author
 */
import { useState } from 'react'
import { Card, Form, Input, Button, Row, Col, Table, Divider, Popconfirm, Modal } from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
function PermissionManagement () {
  // 筛选表单
  const [ form ] = Form.useForm()

  // 新增管理员表单
  const [ personForm ] = Form.useForm()

  // 修改密码表单
  const [ updatePasswordForm ] = Form.useForm()

  // 新增管理员弹窗状态
  const [ personModalVisible, setPersonModalVisible ] = useState(false)

  // 修改密码弹窗状态
  const [ updatePasswordModalVisible, setUpdatePasswordModalVisible ] = useState(false)

  // 筛选提交
  const onFinish = value => {

  }
  // 筛选重置
  const resetFie = value => {
    console.log('resetFie')
    form.resetFields();
  }

  // 新增管理员打开弹窗
  const openManagementModal = () => {
    setPersonModalVisible(true)
  }

  // 修改密码
  const updatePwd = args => {
    setUpdatePasswordModalVisible(true)
  }

  // 删除用户
  const deletePerson = value => {

  }

  // 新增管理员弹窗确定
  const personModalOk = () => {
    personForm.validateFields().then(value => {
     console.log('values:', value)
    //  验证成功
   })
  }

  // 新增管理员弹窗取消
  const personModalCancel = () => {
    setPersonModalVisible(false)
  }

  // 修改密码弹窗确定
  const updatePwdModalOk = () => {
    updatePasswordForm.validateFields().then(value => {
     console.log('values:', value)
    //  验证成功
    })
  }

  // 修改密码弹窗取消
  const updatePwdModalCancel = () => {
    setUpdatePasswordModalVisible(false)
  }
  // 表格头部
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '权限',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render(...args) {
        return <>
         <Button  style={{padding: 0}} onClick={() => updatePwd(args)} type="text" danger>重置密码</Button>
          <Divider type="vertical" />
          <Popconfirm onConfirm={(e) => deletePerson(args, e)} title="确定删除该用户吗？" okText="删除" cancelText="取消">
            <Button style={{padding: 0}} onClick={ e=> {
              e.stopPropagation()
            }} type="text" danger>删除</Button>
          </Popconfirm>
        </>
      }
    }
  ];

    // 表格数据
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      phone: '15882719178',
      address: '10',
    },
    {
      key: '2',
      name: '胡彦祖',
      phone: '15882719178',
      age: 42,
      address: '主车 JR-ZC-001；注入头 JR-ZRT-001；防喷器 JR-FPQ-001；滚筒 JR-GT-001；防喷盒 JR-FPH-001…',
    }
  ]
  return (
    <>
      <CustomBreadcrumb title='权限管理'/>
      <Card
        className='permission-management-card-content'
        bordered={false}
        style={{margin: '0 24px'}}>
        {/* 表单查询 */}
        <Form 
          layout='inline'
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="用户名：" name='name'>
            <Input.Search onSearch={ value => onFinish(value) } placeholder="请输入" />
          </Form.Item>
          <Form.Item label="手机号：" name='phone'>
            <Input.Search onSearch={ value => onFinish(value) } placeholder="请输入" />
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

        {/* 新增管理员 */}
        <Row style={{marginBottom: 24, marginTop: 24}}>
          <Col span={24}>
            <Button type="primary" onClick={ openManagementModal }>新增管理员</Button>
          </Col>
        </Row>
        {/* 表格 */}
        <Table dataSource={dataSource} columns={columns}/>
      </Card>

      {/* 新增管理员弹窗 */}
      <Modal
        title="新增管理员"
        visible={personModalVisible}
        onOk={personModalOk}
        maskClosable={false}
        onCancel={personModalCancel}>
        <Form
          autoComplete="off"
          layout="vertical"
          form={personForm}
        >
          <Form.Item label="用户名" rules={[{required: true, message: '请输入用户名'}]} name='userName'>
            <Input placeholder='请输入用户名'></Input>
          </Form.Item>
          <Form.Item label="手机号" rules={[{required: true, message: '请输入手机号码'}]} name='phone'>
            <Input placeholder='请输入手机号'></Input>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal 
        title="重置密码" 
        visible={updatePasswordModalVisible}
        onOk={updatePwdModalOk}
        maskClosable={false}
        onCancel={updatePwdModalCancel}>
        <p style={{marginBottom: 25}}>
          赵欢欢：13522222222
        </p>
        <Form form={updatePasswordForm} layout='vertical'>
          <Form.Item name='newpassword' label="新密码" rules={[{required: true, message: '请输入新密码'}]}>
            <Input.Password placeholder='请输入新密码'/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PermissionManagement