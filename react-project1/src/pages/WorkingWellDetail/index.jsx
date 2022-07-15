/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-23 16:47:41
 * @LastEditTime: 2022-06-23 18:05:02
 * @LastEditors: Author
 */
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Button,
  Tag,
  Row,
  Col
} from 'antd'
import './index.scss'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
function WorkingWellDetail () {
  const baseInfoList= [ // 基本信息
    [ // 第一列
      {
        label: '甲方单位：',
        value: '采气一厂',
        key: ''
      },
      {
        label: '井内介质：',
        value: '采气一厂'
      },
      {
        label: '井口压力（MPa）：',
        value: '采气一厂'
      },
      {
        label: '返排液量：',
        value: '采气一厂'
      },
      {
        label: '人工井底（m）：',
        value: '采气一厂'
      },
      {
        label: '垂深（m）：',
        value: '采气一厂'
      },
      {
        label: '焖井时间（d）：',
        value: '采气一厂'
      }
    ],
    [ // 第二列
      {
        label: '井型：',
        value: '直井'
      },
      {
        label: '井内桥塞情况：',
        value: '直井'
      },
      {
        label: '井口温度（°C）：',
        value: '直井'
      },
      {
        label: '地层压力（MPa）：',
        value: '直井'
      },
      {
        label: '造斜点（m）：',
        value: '直井'
      },
      {
        label: '井内钢球数：',
        value: '直井'
      },
      {
        label: '排液油嘴（mm）：',
        value: '直井'
      }
    ],
    [ // 第三列
      {
        label: '井内管柱：',
        value: '73mm油管'
      },
      {
        label: '井内落鱼情况：',
        value: '73mm油管'
      },
      {
        label: '地层温度（°C）：',
        value: '73mm油管'
      },
      {
        label: '钥匙个数：',
        value: '73mm油管'
      },
      {
        label: '水平段长度（m）：',
        value: '73mm油管'
      },
      {
        label: '最小通径（mm）：',
        value: '73mm油管'
      },
      {
        label: '每日排液量（m3/d）：',
        value: '73mm油管'
      }
    ]
  ]
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
      title: '作业区间',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '施工队伍',
      dataIndex: 'age',
      key: 'age',
      render(data) {
        return <>
          <span>{data}</span>
          <Tag style={{marginLeft: 8}} color="green">当前施工队</Tag>
        </>
      }
    },
    {
      title: '施工趟次数',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '操作',
      key: 'handle',
      render(...args) {
        return (
          <>
            <Button onClick={(e) => findWorkingWell(args, e)} style={{padding: 0}} type="text" danger>查看</Button>
          </>
        )
      }
    }
  ];

  const navigate = useNavigate()
  // 查看详情
  const findWorkingWell = (args, e) => {
    navigate('/operationSection')
  }
  return (
    <>
      <CustomBreadcrumb title='作业井管理'></CustomBreadcrumb>
      <Card  bordered={false} className='Working-well-detail-container' title="基本信息" style={{margin: '24px'}}>
        <Row>
          {
            baseInfoList.map((col, index) => {
              return <Col span={8} key={index}>
                {
                  col.map(item => {
                    return <Row key={item.value}>
                  <Col span={24}>
                    <p>
                      <span className='base-info-label'>{item.label}</span>
                      <span className='base-info-value'>{item.value}</span>
                    </p>
                  </Col>
                </Row>
                  })
                }
              </Col>
            })
          }
        </Row>
      </Card>
      <Card title="作业及施工趟明细" style={{margin: '24px'}}>
        <Table
          dataSource={dataSource}
          columns={columns}/>
      </Card>
    </>
  )
}

export default WorkingWellDetail 