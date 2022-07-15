/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 14:00:32
 * @LastEditTime: 2022-06-27 15:54:30
 * @LastEditors: Author
 */
import { useState } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import TableContent from './components/TableContent'

import './index.scss'
const tabs = [
    {
      name: '一队工具库',
      key: 1
    },
    {
      name: '二队工具库',
      key: 2
    },
    {
      name: '三队工具库',
      key: 3
    },
    {
      name: '四队工具库',
      key: 4
    },
    {
      name: '五队工具库',
      key: 5
    },
    {
      name: '六队工具库',
      key: 6
    },
    {
      name: '七队工具库',
      key: 7
    },
    {
      name: '八队工具库',
      key: 8
    }
]
function ToolLibraryManagement() {
  const [ tabActive, setTabActive ] = useState(1)
  const changeTab = value => {
    setTabActive(value)
  }
  return (
    <>
      <CustomBreadcrumb>
        <p>工具库管理</p>
        <div className='tool-library-management-tags'>
          {
            tabs.map(tab => {
              return <div 
                onClick={() => changeTab(tab.key)}
                key={tab.key}
                className={tab.key === tabActive ? 'tool-library-management-tags-avtive' : ''}
                >
                <span>{tab.name}</span>
              </div>
            })
          }
        </div>
      </CustomBreadcrumb>
      {/* 子组件列表 */}
      {
        tabs.map(tab => {
          return <TableContent defaultKey={tabActive} item={tab} key={tab.key}/>
        })
      }
    </>
  )
}

export default ToolLibraryManagement

