import './index.css'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'
import { Layout, Menu, Slider } from 'antd';
const { Sider } = Layout;
// 图表做一个映射
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <VideoCameraOutlined />,
  "/right-manage": <UploadOutlined />,
  "/audit-manage": <UserOutlined />,
  "/publish-manage": <UploadOutlined />,
  "/news-manage": <VideoCameraOutlined />
}
function SideMenu(props) {
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(['/' + props.location.pathname.split('/')[1]]);
  const [menu, setMenu] = useState([]);
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  useEffect(() => {
    axios.get("http://localhost:4000/rights?_embed=children").then(res => {
      setMenu(eval(res.data))
    })

  }, [])


  const rootSubmenuKeys = menu.map(item => {
    return item.key
  })
  const checkPage = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key)
  }
  const items = (menu) => {
    return menu.map(item => {
      if (!checkPage(item)) return
      if (!item.children) {
        return getItem(item.title, item.key, iconList[item.key])
      }
      if (item.children.length != 0) {
        return getItem(item.title, item.key, iconList[item.key], items(item.children))
      }
      else {
        return getItem(item.title, item.key, iconList[item.key])
      }
    })
  }
  let a = []
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(a);
    } else {
      a = openKeys
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", alignItems: 'center', "flexDirection": "column", overflow: "hidden" }}>
        <div className="logo" >全球新闻发布管理系统 </div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            mode="inline"
            theme="dark"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={props.location.pathname}
            onClick={(items) => {
              props.history.push(items.key)
            }}
            style={{
              width: '100%',

            }}
            items={items(menu)}
          />
        </div>
      </div >
    </Sider >
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
export default connect(mapStateProps, mapDispatchToProps)(withRouter(SideMenu))