/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-22 17:08:19
 * @LastEditTime: 2022-06-23 15:26:55
 * @LastEditors: Author
 */
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
function LoginForm (props) {
  const onFinish = value => {
    if (typeof props.onFinish === 'function') {
      props.onFinish(value)
    }
  }
  return (
      <Form
          name="normal_login"
          className="login-form"
          labelCol={{ span: 0 }}
          size="large"
          wrapperCol={{ span: 24 }}
          initialValues={{
          }}
          onFinish={onFinish}
        >
          <Form.Item 
            name="username"
            rules={[
              {
                required: true,
                message: '账号不能为空!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item className='pwd-tps'>
            <Button type="primary" block htmlType="submit">
              登录
            </Button>
          </Form.Item>
          <Form.Item >
            <span className='pwd-tps-text'>*密码仅支持数字和大小写字母，至少6位</span>
          </Form.Item>
        </Form>
  )
}

export default LoginForm