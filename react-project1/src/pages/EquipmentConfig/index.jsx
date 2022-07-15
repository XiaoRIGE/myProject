/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-24 14:04:46
 * @LastEditTime: 2022-07-05 11:07:23
 * @LastEditors: Author
 */
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Divider,
  Table,
  Popconfirm,
  Drawer,
  DatePicker
 } from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { useState } from 'react'
const { Option } = Select
function EquipmentConfig () {
  // 筛选表单
  const [form] = Form.useForm()
  // 新增表单
  const [drawerForm] = Form.useForm()
  // 新增弹窗状态
  const [ equipmentWellvisible, setEquipmentWellvisible ] = useState(false)
  // 表格数据
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
    }
  ]
  // 表格删除每项
  const deleteEquipment = (...args) => {
    console.log('delete:', args)
  }
  // 表格头部
  const columns = [
    {
      title: '注入头自编号',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '主车代号',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '主车厂家',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '主车投产日期',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '主车重量（t）',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '尺寸（长宽高）',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '所在队伍',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 130,
      render(...args) {
        return <>
         <Button  style={{padding: 0}} onClick={() => openEquipment(args)} type="text" danger>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm onConfirm={(e) => deleteEquipment(args, e)} title="确定删除该设备类型吗？" okText="删除" cancelText="取消">
            <Button style={{padding: 0}} onClick={ e=> {
              e.stopPropagation()
            }} type="text" danger>删除</Button>
          </Popconfirm>
        </>
      }
    }
  ];

  // 表单列表
  const formList = [
    [
      {
        label: '主车自编号',
        key: '1',
        rules: [
          {
            required: true,
            message: '请输入主车自编号'
          }
        ]
      },
      {
        label: '主车代号',
        key: '2',
        rules:[
          {
            required: true,
            message: '请输入主车代号'
          }
        ]
      }
    ],
    [
      {
        label: '主车厂家',
        key: '3',
        rules: [
          {
            required: true,
            message: '请输入主车厂家'
          }
        ]
      },
      {
        label: '主车投产日期',
        key: '4',
        type: 'date',
        rules:[
          {
            required: true,
            message: '请选择主车投产日期'
          }
        ]
      }
    ],
    [
      {
        label: '主车重量（t）',
        key: '5',
        rules: [
          {
            required: true,
            message: '请输入主车重量'
          }
        ]
      },
      {
        label: '尺寸（长宽高）',
        key: '6',
        rules:[
          {
            required: true,
            message: '请输入尺寸（长宽高）'
          }
        ]
      }
    ],
    [
      {
        label: '所在队伍',
        key: '7',
        type: 'select',
        options: [
          {
            label: '选项一',
            value: 1
          },
          {
            label: '选项二',
            value: 2
          }
        ],
        rules: [
          {
            required: true,
            message: '请选择所在队伍'
          }
        ]
      },

    ]
  ]
  // 查询
  const onFinish = value => {
    console.log(value)
  }

  // 重置
  const resetFie = () => {
    form.resetFields();
    console.log('reset')
  }

  // 新增编辑打开弹窗
  const openEquipment = () => {
    setEquipmentWellvisible(true)
  }

  const onDrawerClose = () => {
    // 新增编辑作业弹窗关闭
    setEquipmentWellvisible(false)
  }

  // 新增编辑提交
  const submitForm = () => {
   drawerForm.validateFields().then(value => {
     console.log('values:', value)
    //  验证成功
   })
  }
  return (
    <>
      <CustomBreadcrumb title='设备配置'/>
      <Card className='equipment-card-content' bordered={false} style={{margin: '0 24px'}}>
      {/* 查询表单 */}
      <Form 
        layout='inline'
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="注入头自编号：" name='code'>
          <Input.Search onSearch={ value => onFinish(value) } placeholder="请输入" />
        </Form.Item>
        <Form.Item label="所在队伍："  name='teamName'>
          <Select style={{width: 200}} placeholder="请选择">
            <Option value='1'>队伍一</Option>
            <Option value='2'>队伍二</Option>
            <Option value='3'>队伍三</Option>
          </Select>
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
      {/* 按钮，新增设备配置，批量导入按钮，下载导入模板按钮 */}
      <Row style={{marginBottom: 24, marginTop: 24}}>
        <Col span={24}>
          <Button type="primary" onClick={ openEquipment }>新增设备</Button>
          <Button style={{margin: '0 8px'}}>批量导入</Button>
          <Button>下载标准表格</Button>
        </Col>
      </Row>
      {/* 配置表格 */}
      <Table dataSource={dataSource} columns={columns}  scroll={{ x: 1300 }}/>
      </Card>
      {/* 新增配置弹窗 */}
      <Drawer
        title="新增作业井"
        width={600}
        placement="right"
        onClose={onDrawerClose}
        maskClosable={false}
        footer={<div style={{textAlign: 'right'}}>
          <Button style={{marginRight: 8}}> 取消 </Button>
          <Button type="primary" onClick={ submitForm }>确定</Button>
        </div>}
        visible={equipmentWellvisible}>
        {/* 两列 */}
        <Form layout="vertical" form={drawerForm}>
          {
            formList.map((col, index) => {
              return <Row key={index}>
                {
                  col.map((item, index) => {
                    return <Col span={11} push={ index === 1 ? 2 : null }>
                      <Form.Item label={item.label} rules={item.rules} name={item.key}>
                        {item.type === 'select' && <Select placeholder='请选择'>
                          {
                            item.options.map(option => {
                              return <Option value={option.value}>{option.label}</Option>
                            })
                          }
                        </Select>
                        }
                        {
                          item.type === 'date' && <DatePicker style={{width: '100%'}}/>
                        }
                        {
                          !item.type && <Input placeholder='请输入'/>
                        }
                      </Form.Item>
                    </Col>
                  })
                }
              </Row>
            })
          }
        </Form>
      </Drawer>
    </>
  )
}

export default EquipmentConfig