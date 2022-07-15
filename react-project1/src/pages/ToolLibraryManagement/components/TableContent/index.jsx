/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-27 14:27:11
 * @LastEditTime: 2022-06-27 16:07:38
 * @LastEditors: Author
 */
import { useState } from 'react'
import { Card, Form, Input, Button, Select, Table, Divider, Popconfirm, Drawer, Row, Col, DatePicker } from 'antd'
import './index.scss'

const { Option } = Select
function TableContent (props) {
  // 筛选表单
  const [ filterForm ] = Form.useForm()

  // 新增编辑弹窗
  const [ drawerForm ] = Form.useForm()

  // 新增编辑工具弹窗状态
  const [ showToolDrawer, setShowToolDrawer ] = useState(false)

  // 打开编辑，新增弹窗
  const openDrawer = () => {
    setShowToolDrawer(true)
  }

  // 编辑工具
  const updateTool = args => {

  }

  // 删除工具
  const deleteTool = args => {

  }

  // 关闭弹窗
  const onDrawerClose = () => {
    setShowToolDrawer(false)
  }

  // 新增编辑提交
  const submitForm = () => {
    drawerForm.validateFields().then(value => {
      console.log('values:', value)
      //  验证成功
    })
  }

  // 表格头部
  const columns = [
    {
      title: '序列号',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '名称',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '类型',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render(...args) {
        return <>
         <Button  style={{padding: 0}} onClick={() => updateTool(args)} type="text" danger>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm onConfirm={(e) => deleteTool(args, e)} title="确定删除该工具吗？" okText="删除" cancelText="取消">
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

  // 弹窗表单数据
  const formList = [
    [
      {
        label: '自编号',
        key: '1',
        rules: [
          {
            required: true,
            message: '请输入自编号'
          }
        ],
        type: 'input'
      },
      {
        label: '序列号',
        key: '2',
        rules: [
          {
            required: true,
            message: '请输入序列号'
          }
        ],
        type: 'input'
      }
    ],
    [
      {
        label: '接头名称',
        key: '3',
        rules: [
          {
            required: true,
            message: '请输入接头名称'
          }
        ],
        type: 'input'
      },
      {
        label: '类型',
        key: '4',
        rules: [
          {
            required: true,
            message: '请选择类型'
          }
        ],
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
        type: 'select'
      }
    ],
    [
      {
        label: '接头型号',
        key: '5',
        rules: [
          {
            required: true,
            message: '请输入接头型号'
          }
        ],
        type: 'input'
      },
      {
        label: '规格（外径×长度 mm×m)',
        key: '6',
        rules: [
          {
            required: true,
            message: '请输入规格'
          }
        ],
        type: 'input'
      }
    ],
    [
      {
        label: '扣扭矩值',
        key: '7',
        rules: [
          {
            required: true,
            message: '请输入扣扭矩值'
          }
        ],
        type: 'input'
      },
      {
        label: '内径（mm）',
        key: '8',
        rules: [
          {
            required: true,
            message: '请输入内径'
          }
        ],
        type: 'input'
      }
    ],
    [
      {
        label: '材质',
        key: '9',
        rules: [
          {
            required: true,
            message: '请输入材质'
          }
        ],
        type: 'input'
      },
      {
        label: '重量（kg）',
        key: '10',
        rules: [
          {
            required: true,
            message: '请输入重量'
          }
        ],
        type: 'input'
      }
    ],
    [
      {
        label: '生产厂家',
        key: '11',
        rules: [
          {
            required: true,
            message: '请输入生产厂家'
          }
        ],
        type: 'input'
      },
      {
        label: '投产日期',
        key: '12',
        rules: [
          {
            required: true,
            message: '请选择投产日期'
          }
        ],
        type: 'date'
      }
    ]
  ]

  // 获取FormItem
  const getFormItem = item => {
    if (item.type === 'input') {
      return <Input placeholder='请输入'/>
    } else if (item.type === 'select') {
      return <Select placeholder='请选择'>
              {
                item.options.map(option => {
                  return <Option key={option.value} value={option.value}>{option.label}</Option>
                })
              }
            </Select>
    } else if (item.type === 'date') {
      return <DatePicker style={{width: '100%'}}/>
    }
  }
  return (
    <div
      className="table-content"
      style={{ display: props.defaultKey === props.item.key ? 'block' : 'none' }}>
        <Card
          bordered={false}
          style={{margin: '0 24px'}}>
          {/* 搜索表单 */}
          <Form
            layout='inline'
            form={filterForm}
          >
            <Form.Item label="序列号：">
              <Input.Search placeholder='请输入'/>
            </Form.Item>
            <Form.Item label="名称：">
              <Input.Search placeholder='请输入'/>
            </Form.Item>
            <Form.Item label="类型：">
              <Select style={{width: '214px'}} placeholder='请选择'>
                <Option value='1'>选项一</Option>
                <Option value='2'>选项二</Option>
                <Option value='3'>选项三</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button
                style={{ margin: '0 8px' }}
                >
                重置
              </Button>
          </Form.Item>
          </Form>
          {/* 新增工具按钮 */}
          <Button type="primary" onClick={ openDrawer }  style={{ marginTop: 24, marginBottom: 24 }}>新增工具</Button>
          {/* 表格列表 */}
          <Table dataSource={dataSource} columns={columns}/>
        </Card>
        {/* 新增工具弹窗 */}
        <Drawer
          title='新增工具'
          width={600}
          placement="right"
          onClose={onDrawerClose}
          maskClosable={false}
          footer={<div style={{textAlign: 'right'}}>
            <Button style={{marginRight: 8}}> 取消 </Button>
            <Button type="primary" onClick={ submitForm }>确定</Button>
          </div>}
          visible={ showToolDrawer }>
          <Form
            layout='vertical'
            form={ drawerForm }
          >
            {
              formList.map((row, index) => {
                return <Row key={index}>
                  {
                    row.map((item, index) => {
                      return <Col key={item.key} span={11} push={ index === 1 ? 2 : null }>
                              <Form.Item label={item.label} rules={item.rules} name={item.key}>
                              {getFormItem(item)}
                              </Form.Item>
                      </Col>
                    })
                  }
                </Row>
              })
            }
          </Form>
        </Drawer>
      </div>
  )
}

export default TableContent