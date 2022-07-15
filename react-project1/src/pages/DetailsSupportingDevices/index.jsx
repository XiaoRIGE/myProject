/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-07-05 14:07:00
 * @LastEditTime: 2022-07-05 14:50:17
 * @LastEditors: Author
 */
import { useState } from 'react'
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
import './index.scss'

const { Option } = Select
function DetailsSupportingDevices () {

  // 筛选表单
  const [ filterForm ] = Form.useForm()

  // 新增编辑弹窗表单
  const [ drawerForm ] = Form.useForm()

  // 新增编辑弹窗状态
  const [ supportingVisible, setSupportingVisible ] = useState(false)

  // 筛选搜索
  const onFinish = value => {

  }

  // 筛选重置
  const resetFie = () => {

  }

  // 新增编辑装置弹窗
  const openSupportingModal = value => {
    setSupportingVisible(true)
  }

  // 新增编辑弹窗关闭
  const onDrawerClose = () => {
    setSupportingVisible(false)
  }

  // 新增编辑提交
  const submitForm = () => {
    drawerForm.validateFields().then(value => {
     console.log('values:', value)
    //  验证成功
   })
  }

  // 删除装置
  const deleteSupportingModal = value => {

  }

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
      address: '主车 JR-ZC-001',
    }
  ]

  // 表格头部
  const columns = [
    {
      title: '注入头自编号',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '注入头代号',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '注解',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '注入头厂家',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '注入头重量（t）',
      dataIndex: 'name',
      key: 'name',
      width: 229
    },
    {
      title: '注入头下推力（t）',
      dataIndex: 'age',
      key: 'age',
      width: 229
    },
    {
      title: '注入头上推力（t）',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '注入头高度（m）',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '注入头投产日期',
      dataIndex: 'name',
      key: 'name',
      width: 200
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
         <Button  style={{padding: 0}} onClick={() => openSupportingModal(args)} type="text" danger>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm onConfirm={(e) => deleteSupportingModal(args, e)} title="确定删除该装置吗？" okText="删除" cancelText="取消">
            <Button style={{padding: 0}} onClick={ e=> {
              e.stopPropagation()
            }} type="text" danger>删除</Button>
          </Popconfirm>
        </>
      }
    }
  ];

  // 新增编辑弹窗数据
  const formList = [
    [
      {
        label: '注入头自编号',
        key: '1',
        rules: [
          {
            required: true,
            message: '请输入注入头自编号'
          }
        ]
      },
      {
        label: '注入头代号',
        key: '2',
        rules:[
          {
            required: true,
            message: '请输入注入头代号'
          }
        ]
      }
    ],
    [
      {
        label: '注解',
        key: '3',
        rules: [
          {
            required: true,
            message: '请输入注解'
          }
        ]
      },
      {
        label: '注入头厂家',
        key: '4',
        // type: 'date',
        rules:[
          {
            required: true,
            message: '请输入注入头厂家'
          }
        ]
      }
    ],
    [
      {
        label: '注入头重量(t)',
        key: '5',
        rules: [
          {
            required: true,
            message: '请输入注入头重量'
          }
        ]
      },
      {
        label: '注入头下推力(t)',
        key: '6',
        rules:[
          {
            required: true,
            message: '注入头下推力'
          }
        ]
      }
    ],
    [
      {
        label: '注入头上提力(t)',
        key: '50',
        rules: [
          {
            required: true,
            message: '请输入注入头上提力'
          }
        ]
      },
      {
        label: '注入头高度(m)',
        key: '60',
        rules:[
          {
            required: true,
            message: '请输入注入头高度'
          }
        ]
      }
    ],
    [
      {
        label: '注入头投产日期',
        key: '4',
        type: 'date',
        rules:[
          {
            required: true,
            message: '请选择注入头投产日期'
          }
        ]
      },
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
      }
    ]
  ]

  return <>
    <CustomBreadcrumb title='装配配置'></CustomBreadcrumb>
    <Card
      className='detailsSupportingDevices-card-content'
      bordered={false}
      style={{margin: '0 24px'}}>
        {/* 筛选表单 */}
        <Form
          layout='inline'
          form={ filterForm }
          >
          <Form.Item label="注入头自编号：" name="code">
            <Input.Search onSearch={ value => onFinish(value) } placeholder="请输入" />
          </Form.Item>
          <Form.Item label="所在队伍：" name="team">
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
            <Button type="primary" onClick={ openSupportingModal }>新增装置</Button>
          </Col>
        </Row>

        {/* 表格内容 */}
        <Table dataSource={dataSource} columns={columns}  scroll={{ x: 1300 }}/>
      </Card>

      {/* 新增装置弹窗 */}
      <Drawer
        title="新增装置"
        width={600}
        placement="right"
        onClose={ onDrawerClose }
        maskClosable={false}
        footer={<div style={{textAlign: 'right'}}>
          <Button style={{marginRight: 8}}> 取消 </Button>
          <Button type="primary" onClick={ submitForm }>确定</Button>
        </div>}
        visible={supportingVisible}>
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
}

export default DetailsSupportingDevices