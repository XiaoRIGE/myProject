/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 14:15:52
 * @LastEditTime: 2022-07-05 10:43:28
 * @LastEditors: Author
 */
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import CustomHeader from '@/components/CustomHeader'
import Icon from '@/components/Icon'
import './index.scss'
import { baseRoutes } from '@/Router'

const { Header, Sider } = Layout;

const headerStyle = {
  height: "56px",
  backgroundColor: "#fff"
}

const siderStyle = {
  height: 'calc(100vh - 56px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '208px',
  backgroundColor: '#121212',
  boxShadow: '2px 0px 10px 0px rgba(11, 0, 41, 0.05)'
}



function Main () {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const getDefaultKey = () => {
    if (pathname === '/') return pathname;
    let curentPathname = pathname.slice(1)
    const isChild = baseRoutes.filter(route => route.path === '/')[0].children.find(route => route.path === curentPathname)
    if (isChild && isChild.activeRoute) {
      curentPathname = isChild.activeRoute
    }
    return curentPathname
  }


  const items = baseRoutes.filter(route => route.path === '/')[0].children.filter(route => !route.hiddenMenu).map( item => {
    return {
      key: item.path,
      icon: <Icon icon={item.icon}/>,
      label: item.title
    }
  })

  const menuHandleClick = (data) => {
    navigate(data.key)
  }

  return (
    <div className='main-container'>
      <Layout>
        <Header  style={headerStyle} className="header">
          <CustomHeader/>
        </Header>
        <Layout>
          <Sider 
            width={200}
            style={siderStyle}
            className="sider-content">
            <Menu
              className='jumptal-menu'
              mode="inline"
              theme="dark"
              onClick={ menuHandleClick }
              defaultSelectedKeys={getDefaultKey()}
              defaultOpenKeys={getDefaultKey()}
              items={items}
            />
          </Sider>
          <Layout className='main-container scrollbar' >
            <div className="main-container-content">
              <Outlet/>
            </div>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default Main