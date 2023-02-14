import React from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
const { Header } = Layout;
function TopHeader(props) {
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
  const change = () => {
    props.change()
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              {roleName}
            </a>
          ),
        },
        {
          key: '4',
          danger: true,
          label: '退出',
        },
      ]}
      onClick={() => {
        localStorage.removeItem("token")
        props.history.replace('/login')
      }}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 16,
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={change} />
          : <MenuFoldOutlined onClick={change} />
      }
      <div style={{ position: "absolute", top: "0px", right: "10px" }}>
        <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来！！！</span>
        {/* 下拉菜单 */}
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            <Avatar size="large" icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateProps = (state) => {
  const { CollapsedReducer: { isCollapsed } } = state
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  change() {
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateProps, mapDispatchToProps)(withRouter(TopHeader))