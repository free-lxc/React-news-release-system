import React from 'react'
import { withRouter } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios'
import './Login.css'
function Login(props) {
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
      .then(res => {
        if (res.data.length === 0) {
          message.error("用户或密码不匹配")
        } else {
          localStorage.setItem("token", JSON.stringify({
            ...res.data[0],
            time: Date.now()
          }))
          props.history.push('/')
        }
      })
  };
  return (
    <div style={{ background: 'rgb(35,39,65)', height: "100%", width: "100%" }}>
      <div className='loginForm'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default withRouter(Login)