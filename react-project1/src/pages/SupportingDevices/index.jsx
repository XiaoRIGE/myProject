/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-07-05 10:36:58
 * @LastEditTime: 2022-07-05 14:15:57
 * @LastEditors: Author
 */
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Button,
  Select,
  Table,
 } from 'antd'
import './index.scss'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'

const { Option } = Select
function SupportingDevices () {
  // 路由
  const navigate = useNavigate()

  // 筛选表单实例
  const [ form ] = Form.useForm()

  // 筛选搜索
  const onFinish = value => {

  }
  // 筛选重置
  const resetFie = () => {

  }

  // 表格点击操作
  const operationClick = args => {
    navigate('/detailsSupportingDevices')
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
      address: '主车 JR-ZC-001；注入头 JR-ZRT-001；防喷器 JR-FPQ-001；滚筒 JR-GT-001；防喷盒 JR-FPH-001…',
    }
  ]

  // 表格头部
  const columns = [
    {
      title: '装置类型',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '装置数量',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render(...args) {
        return <>
          <Button  onClick={ (args) => operationClick(args)} style={{padding: 0}}  type="text" danger>装置配置</Button>
        </>
      }
    }
  ];
  return <>
    <CustomBreadcrumb title='配套装置'/>
    <Card
      className='supporting-card-content'
      bordered={false}
      style={{margin: '0 24px'}}>
        {/* 查询表单 */}
        <Form
          layout='inline'
          form={form}
          onFinish={onFinish}
          style={{ marginBottom: 24 }}
        >
          <Form.Item label="装置类型："  name='teamName'>
            <Select style={{width: 200}} placeholder="请选择">
              <Option value='1'>装置类型一</Option>
              <Option value='2'>装置类型二</Option>
              <Option value='3'>装置类型三</Option>
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
        {/* 表格内容 */}
        <Table dataSource={dataSource} columns={columns} />
      </Card>
  </>
}

export default SupportingDevices