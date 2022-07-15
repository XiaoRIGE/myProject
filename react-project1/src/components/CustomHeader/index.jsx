/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 16:32:21
 * @LastEditTime: 2022-07-05 10:48:14
 * @LastEditors: Author
 */
import { Avatar, Image, Popconfirm, Button } from 'antd';
import logo from '@/assets/images/log.png'
import './index.scss'
function CustomHeader () {
  const confirm = () => {
    // 退出
    alert('退出成功')
  }
  return (
    <div className='header-content'>
     <div className='header-content-left'>
        <img className='log-img' src={logo} alt="" />
        <span className='title'>中石化管理平台</span>
     </div>
     <div className='header-content-right'>
       <Avatar gap={8} src={<Image src="https://joeschmoe.io/api/v1/random" style={{ width: 28 }} />} />
       <Popconfirm
        placement="topLeft"
        title="确定退出吗?"
        onConfirm={confirm}
        okText="退出"
        cancelText="取消">
        <Button type="text">周小小</Button>
       </Popconfirm>
     </div>
    </div>
  )
}

export default CustomHeader