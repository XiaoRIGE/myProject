/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-22 17:08:07
 * @LastEditTime: 2022-06-22 17:23:40
 * @LastEditors: Author
 */
import { LockOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
function RestForm (props) {
  const onFinish = value => {
    if (typeof props.onFinish === 'function') {
      props.onFinish({...value, type: 'rest'})
    }
  }
  const onFinishFailed = () => {

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
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="initPassword"
            rules={[
              {
                required: true,
                message: '初始化密码不能为空!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入初始化密码"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: '新密码不能为空!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入新密码"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: '确认密码不能为空!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入确认密码"
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

export default RestForm