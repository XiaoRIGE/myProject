/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 14:12:32
 * @LastEditTime: 2022-07-05 14:15:46
 * @LastEditors: Author
 */

// import { lazy } from 'react'
import   { Routes, Route, HashRouter, Navigate } from 'react-router-dom'

import Login from '@/pages/Login'
import Layout from '@/Layout'
import Home from '@/pages/Home'
import WorkingWell from '@/pages/WorkingWell'
import OperationTeam from '@/pages/OperationTeam'
// const OperationTeam = lazy(() => import('@/pages/OperationTeam'))
import DeviceManagement from '@/pages/DeviceManagement'
// const DeviceManagement = lazy(() => import('@/pages/DeviceManagement'))
// const ToolLibraryManagement = lazy(() => import('@/pages/ToolLibraryManagement'))
import ToolLibraryManagement from '@/pages/ToolLibraryManagement'
// const ReportManagement = lazy(() => import('@/pages/ReportManagement'))
import ReportManagement from '@/pages/ReportManagement'
// const PermissionManagement = lazy(() => import('@/pages/PermissionManagement'))
import PermissionManagement from '@/pages/PermissionManagement'

import WorkingWellDetail from '@/pages/WorkingWellDetail'

import OperationSection from '@/pages/OperationSection'

import EquipmentConfig from '@/pages/EquipmentConfig'

import SupportingDevices from '@/pages/SupportingDevices'

import DetailsSupportingDevices from '@/pages/DetailsSupportingDevices'

export  const baseRoutes = [
  {
    title: '登录',
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        title: '首页',
        path: '/',
        icon: 'home-menu',
        component: Home
      },
      {
        title: '作业井管理',
        path: 'workingWell',
        icon: 'well-menu',
        component: WorkingWell
      },
      {
        title: '作业井详情',
        path: 'workingWellDetail',
        activeRoute: 'workingWell', //在menu中需要激活高亮的路由
        hiddenMenu: true, // 不展示在menu菜单中
        component: WorkingWellDetail
      },
      {
        title: '作业区间详情',
        path: 'operationSection',
        activeRoute: 'workingWell', //在menu中需要激活高亮的路由
        hiddenMenu: true,
        component: OperationSection
      },
      {
        title: '作业队伍',
        path: 'operationTeam',
        icon: 'team-menu',
        component: OperationTeam
      },
      {
        title: '作业设备',
        path: 'deviceManagement',
        icon: 'device-menu',
        component: DeviceManagement
      },
      {
        title: '设备配置', // 作业设备-> 设备配置
        path: 'equipmentConfig',
        activeRoute: 'deviceManagement', //在menu中需要激活高亮的路由
        hiddenMenu: true,
        component: EquipmentConfig
      },
      {
        title: '配套装置',
        path: 'supportingDevices',
        icon: 'matching-menu',
        component: SupportingDevices
      },
      {
        title: '配套配置', // 配套装置 -> 配套配置
        path: 'detailsSupportingDevices',
        activeRoute: 'supportingDevices', //在menu中需要激活高亮的路由
        hiddenMenu: true,
        component: DetailsSupportingDevices
      },
      {
        title: '工具库管理',
        path: 'toolLibraryManagement',
        icon: 'tool-menu',
        component: ToolLibraryManagement
      },
      {
        title: '报表管理',
        path: 'reportManagement',
        icon: 'report-menu',
        component: ReportManagement
      },
      {
        title: '权限管理',
        path: 'permissionManagement',
        icon: 'permission-menu',
        component: PermissionManagement
      }
    ]
  }
]
function RouteComponent () {
  return (
    <HashRouter>
      <Routes>
          {
           baseRoutes.map(route => {
             return <Route key={route.path} path={route.path} element={ route.redirect ? <Navigate to={route.redirect} /> : <route.component/>}>
                { route.children && route.children.map(child => {
                 return <Route key={child.path} path={child.path} element={ <child.component></child.component> }></Route>
               })}
             </Route>
           })
          }
        </Routes>
    </HashRouter>
  )
}

export default RouteComponent