/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-22 14:09:39
 * @LastEditTime: 2022-06-22 17:42:22
 * @LastEditors: Author
 */
import { useState } from 'react'
import { Card, Radio, Table } from 'antd';
import './index.scss'
function TabCard (props) {
  const [ value, setValue ] = useState('1')
  const dataSource = [  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '10',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '100',
  }]
  const columns = [
    {
      title: '作业井名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '作业次数',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '队伍支数',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '施工趟次数',
      dataIndex: 'address',
      key: 'address',
    }
  ];
  return (
    <Card
      className='tab-card-content'
      style={{ width:580, ...props.style }}
      title={props.title}
      extra={<>
        <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
          <Radio.Button value="1">从高到底</Radio.Button>
          <Radio.Button value="2">从低到高</Radio.Button>
        </Radio.Group>
      </>}
    >
      <Table dataSource={dataSource} columns={columns} />
    </Card>
  )
}

export default TabCard