/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:56:25
 * @LastEditTime: 2022-06-23 18:04:52
 * @LastEditors: Author
 */
import {
  Card,
  Popover,
  Table,
  Button,
  Divider,
  Popconfirm,
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col
} from 'antd'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './index.scss'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'

const { Option } = Select
function WorkingWell() {
  const [form] = Form.useForm();
  const [ drawerForm ] = Form.useForm()
  const navigate = useNavigate()
  const formRules = {
    unit: [
      {
        required: true,
        message: '请输入甲方单位'
      }
    ],
    jlgz: [
      {
        required: true,
        message: '请输入井内管柱'
      }
    ],
    jx: [
      {
        required: true,
        message: '请输入井型'
      }
    ],
    jljz: [
      {
        required: true,
        message: '请输入井内介质'
      }
    ]
  }
  const formList = {
    left: [ //左边列表
      {
        label: '甲方单位',
        type: 'input',
        prop: 'unit'
      },
      {
        label: '井内管柱',
        type: 'input',
        prop: 'jlgz'
      },
      {
        label: '井内桥塞情况',
        type: 'input',
        prop: 'jlgz1'
      },
      {
        label: '井口压力（MPa)',
        type: 'input',
        prop: 'jlgz2'
      },
      {
        label: '地层温度（°C）',
        type: 'input',
        prop: 'jlgz3'
      },
      {
        label: '地层压力（MPa)',
        type: 'input',
        prop: 'jlgz4'
      },
      {
        label: '人工井底（m)',
        type: 'input',
        prop: 'jlgz5'
      },
      {
        label: '水平段长度（m)',
        type: 'input',
        prop: 'jlgz6'
      },
      {
        label: '井内钢球数',
        type: 'input',
        prop: 'jlgz61'
      },
      {
        label: '焖井时间（d)',
        type: 'input',
        prop: 'jlgz62'
      },
      {
        label: '每日排液量（m3/d)',
        type: 'input',
        prop: 'jlgz63'
      }
    ],
    right: [ // 右侧表单
      {
        label: '井型',
        type: 'input',
        prop: 'jx'
      },
      {
        label: '井内介质',
        type: 'select',
        options: [
          {
            label: '选项一',
            value: '1'
          },
          {
            label: '选项二',
            value: '2'
          },
          {
            label: '选项三',
            value: '3'
          }
        ],
        prop: 'jljz'
      },
      {
        label: '井内落鱼情况',
        type: 'input',
        prop: 'jljz8'
      },
      {
        label: '井口温度（°C）',
        type: 'input',
        prop: 'jljz9'
      },
      {
        label: '返排液量',
        type: 'input',
        prop: 'jljz11'
      },
      {
        label: '钥匙个数',
        type: 'input',
        prop: 'jljz12'
      },
      {
        label: '造斜点（m)',
        type: 'input',
        prop: 'jljz13'
      },
      {
        label: '垂深（m)',
        type: 'input',
        prop: 'jljz13'
      },
      {
        label: '最小通径（mm)',
        type: 'input',
        prop: 'jljz131'
      },
      {
        label: '排液油嘴（mm)',
        type: 'input',
        prop: 'jljz132'
      }
    ]
  }
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
      title: '作业井名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '井内介质',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '作业次数',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '队伍支数',
      dataIndex: 'age',
      key: 'age',
      render(data) {
        return <Popover placement="right" title='' content={data} trigger="hover">
                  <p>{data}</p>
                </Popover>
      }
    },
    {
      title: '施工趟次数',
      dataIndex: 'address',
      key: 'address',
    },
    {
    title: '操作',
    key: 'handle',
    render(...args) {
      return (
        <>
          <Button onClick={(e) => editWorkingWell(args, e)} style={{padding: 0}} type="text" danger>编辑</Button>
          <Divider type="vertical" />
           <Popconfirm onConfirm={(e) => deleteWorkingWell(args, e)} title="确定删除该作业井吗？" okText="删除" cancelText="取消">
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
  const [ workingWellvisible, setWorkingWellvisible ] =useState(false)
  const editWorkingWell = (args, e) => {
    e.stopPropagation()
    console.log('编辑：', args)
    setWorkingWellvisible(true)
  }
  // 点击表格行事件,跳转详情
  const handelTableRow = (record, event) => {
    console.log(record, event)
    navigate('/workingWellDetail')
  }
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
  }
  const onDrawerClose = () => {
    // 新增编辑作业弹窗关闭
    setWorkingWellvisible(false)
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
      <CustomBreadcrumb/>
      <Card bordered={false} style={{margin: '0 24px'}}>
        {/* 筛选 */}
        <Form 
          layout='inline'
          form={form}
          style={{marginBottom: 24}}
          onFinish={onFinish}
          >
          <Form.Item label="甲方单位" name='unit' >
            <Input placeholder="请输入甲方单位" />
          </Form.Item>
          <Form.Item
            name="team"
            label="队伍"
          >
            <Select
              placeholder="请选择施工队伍"
              allowClear
              style={{width: 182}}
            >
              <Option value="male">全部队伍</Option>
              <Option value="female">队伍一</Option>
              <Option value="other">队伍二</Option>
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

        {/* 新增作业 */}
        <Button type="primary" size='middle' onClick={()=> setWorkingWellvisible(true)} style={{ marginBottom: 16, width: 102 }}>
          新增作业
        </Button>
        {/* 表格 */}
        <Table
          dataSource={dataSource}
          columns={columns}
          onRow={
            record => {
              return {
                onClick: event => handelTableRow(record, event)
              }
            }
          }/>
      </Card>

      {/* 新增编辑作业弹窗 */}
      <Drawer title="新增作业井"
        width={600}
        placement="right"
        onClose={onDrawerClose}
        maskClosable={false}
        footer={<div style={{textAlign: 'right'}}>
          <Button style={{marginRight: 8}}> 取消 </Button>
          <Button type="primary" onClick={ submitForm }>确定</Button>
        </div>}
        visible={workingWellvisible}>
        {/* 两列 */}
        <Form layout="vertical" form={drawerForm}>
          <Row>
            <Col span={11}>
              {
                formList.left.map(item => {
                  return <Row key={item.prop}>
                          <Col span={24}>
                            <Form.Item rules={formRules[item.prop] || []} label={item.label} name={item.prop}>
                              {
                                item.type === 'input' ?
                                  <Input placeholder="请输入" />
                                :
                                <Select placeholder="请选择" allowClear style={{width: '100%'}}>
                                  {
                                    item.options.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)
                                  }
                                </Select>}
                            </Form.Item>
                          </Col>
                        </Row>
                })
              }
            </Col>
            <Col span={11} push={2}>
              {
                formList.right.map(item => {
                  return <Row key={item.prop}>
                          <Col span={24}>
                            <Form.Item rules={formRules[item.prop] || []} label={item.label} name={item.prop}>
                              {
                                item.type === 'input' ?
                                  <Input placeholder="请输入" />
                                :
                                <Select placeholder="请选择" allowClear style={{width: '100%'}}>
                                  {
                                    item.options.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)
                                  }
                                </Select>}
                            </Form.Item>
                          </Col>
                        </Row>
                })
              }
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default WorkingWell