/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:55:05
 * @LastEditTime: 2022-07-05 09:50:09
 * @LastEditors: Author
 */
import { Card, Button } from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import TabCard from './Component/TabCard'
import NavCard from './Component/NavCard'
import './index.scss'
import welcome from '@/assets/images/home/welcome.png'
const navCardList = [
  {
    title: '作业井数量',
    num: 10,
    icon: require('@/assets/images/home/wellNum.svg').default
  },
  {
    title: '作业队伍数量',
    num: 46,
    icon: require('@/assets/images/home/teamNum.svg').default
  },
  {
    title: '设备数量',
    num: 88,
    icon: require('@/assets/images/home/deviceNum.svg').default
  },
  {
    title: '工具数量',
    num: 126,
    icon: require('@/assets/images/home/toolNum.svg').default
  }
]
function Home () {
  return (
    <>
    <CustomBreadcrumb/>
    <div className="home-container">
      <div className='card-list'>
          <Card bordered={false} className="hello-card" style={{ width: 743, height: 142 }}>
            <div className='home-container-hello-card'>
              <div className='home-container-hello-card-left'>
                <p className='title'>Hello！周小小</p>
                <p className='sub-title'>It’s good to see you</p>
              </div>
              <img className='home-container-hello-card-img' src={welcome} alt="" />
            </div>
          </Card>
           <Card title="快速开始" bordered={false} style={{ width: 417, height: 142 }}>
            <Button type="text">新增作业井</Button>
            <Button type="text">新增设备</Button>
            <Button type="text">新增工具</Button>
            <Button type="text">查看报表</Button>
          </Card>
      </div>

      <div className='card-list card-item'>
        {navCardList.map(card => <NavCard key={card.title} card={card}/> )}
      </div>

      <div className='card-list'>
        <TabCard title="作业次数"></TabCard>
        <TabCard title="施工趟次数" style={{marginLeft: 24}}></TabCard>
      </div>
    </div>
    </>
  )
}

export default Home