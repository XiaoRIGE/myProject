import { Card, Divider, Row, Col } from 'antd'
import './index.scss'
function OperationSectionCard () {
    // 施工趟详情列表，3列
  const constructionList = [
    [
      {
        key: '1',
        label: '入井时间：'
      },
      {
        key: '2',
        label: '出井时间：'
      },
      {
        key: '3',
        label: '作业井深（M）：'
      }
    ],
    [
      {
        key: '4',
        label: '消耗降阻剂（L）：'
      },
      {
        key: '5',
        label: '井口压力（MPa）：'
      },
      {
        key: '6',
        label: '注入头运转时间：'
      }
    ],
    [
      {
        key: '7',
        label: '链条运行里程（M）：'
      },
      {
        key: '8',
        label: '泵注液体：'
      },
      {
        key: '9',
        label: '泵注时间：'
      }
    ],
    [
      {
        key: '10',
        label: '循环泵压：'
      },
      {
        key: '11',
        label: '作业排量（L/min）：'
      },
      {
        key: '12',
        label: '反出物情况：'
      }
    ],
    [
      {
        key: '13',
        label: '疲劳寿命：'
      },
      {
        key: '14',
        label: '切割油管情况：'
      },
      {
        key: '15',
        label: '剩余长度：'
      }
    ],
    [
      {
        key: '16',
        label: '工具管柱：'
      },
      {
        key: '17',
        label: '遇阻井深（M）：'
      },
      {
        key: '18',
        label: '遇卡井深（M）：'
      }
    ],
    [
      {
        key: '19',
        label: '泵注酸液量（L）：'
      },
      {
        key: '20',
        label: '钻压：'
      },
      {
        key: '21',
        label: '出口排量：'
      }
    ],
    [
      {
        key: '22',
        label: '水泥浆量：'
      },
      {
        key: '23',
        label: '切割类型：'
      },
      {
        key: '24',
        label: '工作液粘度：'
      }
    ],
    [
      {
        key: '25',
        label: '工具出井情况：'
      },
      {
        key: '26',
        label: '气举方式：'
      },
      {
        key: '27',
        label: '射孔簇数：'
      }
    ],
    [
      {
        key: '28',
        label: '落鱼类型：'
      },
      {
        key: '29',
        label: '套铣进尺（M）'
      },
      {
        key: '30',
        label: '磨铣进尺（M）：'
      }
    ],
    [
      {
        key: '31',
        label: '钻磨桥塞个数：'
      },
      {
        key: '32',
        label: '冲砂进尺（M）：'
      },
      {
        key: '33',
        label: '原井内泥浆密度：'
      }
    ],
    [
      {
        key: '34',
        label: '遇阻位置：'
      },
      {
        key: '35',
        label: '设备异常情况：'
      }
    ]
  ]

  // 作业井复杂情况，3列
  const complexSituationList = [
    [
      {
        key: '1',
        label: '复杂情况类型：'
      },
      {
        key: '2',
        label: '导致原因：'
      },
      {
        key: '3',
        label: '处理耗用趟次：'
      }
    ],
    [
      {
        key: '4',
        label: '处理耗用时间（h）：'
      },
      {
        key: '5',
        label: '原因分析：'
      },
      {
        key: '6',
        label: '井内余留：'
      }
    ],
    [
      {
        key: '7',
        label: '建议与措施：'
      }
    ]
  ]
  return <Card
          className='operation-section-container'
          bordered={false}
          style={{margin: 24}}
          title="施工趟明细（2）">
          <Card type="inner" title="施工趟_01">
            {/* 物资信息 */}
            <p className='card-title'>
              <span>物资信息</span>
            </p>
            <p className='card-sub-title'>
              <span>物资名称：</span>
              <span>连续油管自编号 JR-CT-001；悬挂</span>
            </p>
            <Divider/>
            {/* 工艺信息 */}
            <p className='card-title'>
              <span>工艺信息</span>
            </p>
            <Row>
              <Col span={8} className="card-sub-title">
                <span>工艺类型：</span>
                <span>冲砂</span>
              </Col>
              <Col span={16} className="card-sub-title">
                <div className='tool-content'>
                  <span >工具名称：</span>
                  <span>外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00,外卡接头 1-WKJT-43-kk-00</span>
                </div>
              </Col>
            </Row>
            <Divider/>
            {/* 施工趟信息 */}
            <p className='card-title'>
              <span>施工趟信息</span>
            </p>
            {
              constructionList.map((row, index) => {
                return <Row key={index} style={{ marginBottom: 8 }}>
                  {
                    row.map(item => {
                      return <Col span={8} key={item.key}>
                        <span className='card-label'>{item.label}</span>
                        <span className='card-value'>{item.key}</span>
                      </Col>
                    })
                  }
                </Row>
              })
            }
            <Divider/>
            {/* 作业井复杂情况 */}
            <p className='card-title'>
              <span>作业井复杂情况</span>
            </p>
            {
              complexSituationList.map((row, index) => {
                return <Row key={index} style={{ marginBottom: 8 }}>
                  {
                    row.map(item => {
                      return <Col span={8} key={item.key}>
                        <span className='card-label'>{item.label}</span>
                        <span className='card-value'>{item.key}</span>
                      </Col>
                    })
                  }
                </Row>
              })
            }
          </Card>
        </Card>
}

export default OperationSectionCard