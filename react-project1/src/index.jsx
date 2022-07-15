/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 10:38:00
 * @LastEditTime: 2022-07-05 15:08:16
 * @LastEditors: Author
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'

import moment from 'moment'
import 'moment/locale/zh-cn'

import './index.scss'
import App from './App'

moment.locale('en')
console.log('env:', process.env)
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ConfigProvider locale={locale}>
    <App/>
  </ConfigProvider>
)