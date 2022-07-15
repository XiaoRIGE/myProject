/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-22 14:08:08
 * @LastEditTime: 2022-07-05 09:52:58
 * @LastEditors: Author
 */
import { Card } from 'antd';
import './index.scss'
function NavCard({card}) {
  return (
    <Card bordered={false} style={{ width: 278, height: 118, marginRight: 24 }}>
      <div className='nav-card-content'>
        <div className='nav-card-content-left'>
          <span className='title'>{card.title}</span>
          <p className='value-title'>{card.num}</p>
        </div>
        <div className='nav-card-content-right'>
          <img src={card.icon} alt="" />
        </div>
      </div>
    </Card>
  )
}

export default NavCard