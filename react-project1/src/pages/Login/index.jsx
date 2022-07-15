/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:55:22
 * @LastEditTime: 2022-06-22 17:25:41
 * @LastEditors: Author
 */
import './index.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import log from '@/assets/images/log.png'
import loginBg from '@/assets/images/login/login_bg.svg'
import LoginForm from './compontnt/LoginForm'
import RestForm from './compontnt/RestForm'
function Login () {
  const navigate = useNavigate()
  const [ formState, setFormState ] = useState('login')
  const onFinish = values => {
    if (values.type === 'rest') {
      navigate('/', { replace: true })
      setFormState('login')
    } else {
      setFormState('rest')
    }
  }
  return (
    <div className="login-container">
      <div className="login-container-left">
        <div className='circular'>
          <div className='overburden'></div>
        </div>
      </div>
      <div className="login-container-right">
        <div className='content'>
          <div className='log-box'>
            <img src={log} alt="" />
          </div>
        </div>
        {/* 表单 */}
        {/* formstate === login => 登录 否则重置密码*/}
        { formState === 'login'? <LoginForm onFinish={onFinish}/> : <RestForm onFinish={onFinish}/>}
        <div className='login-footer'>
          <p>
            <span>关于我们</span>
            <span className='span'>常见问题</span>
            <span>联系客服</span>
          </p>
          <p>
            <span>©中石化</span>
          </p>
        </div>
        <img className='login-bg' src={loginBg} alt="" />
      </div>
    </div>
  )
}

export default Login