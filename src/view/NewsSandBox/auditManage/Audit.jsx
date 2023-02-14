import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
const auditList = ['未审核', '审核中', '已通过', '未通过']
const colorList = ['black', 'orange', 'green', 'red']
const re = {
  "超级管理员": 1,
  "区域管理员": 2,
  "区域编辑": 3
}
const roleObj = {
  "1": "superAdmin",
  "2": "admin",
  "3": "editor"
}
export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  // 获取后台数据
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      // console.log(list)
      setDataSource(roleObj[roleId] === "superAdmin" ? list :
        [
          // 获取自己以及与自己同一地域的编辑
          ...list.filter(item => item.author === username),
          ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
        ])
    })
  }, [region, roleId, username])
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(key=> key.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.open({
        message: `通知`,
        description: `你可以到[审核管理/审核列表]中查看你的新闻的审核状态`,
        placement: "bottomRight",
        duration: 3
      });
    })
  }
  // 列表
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (key) => {
        return <div>
          <Button icon={<CheckOutlined />} shape='circle' type='primary'
            onClick={() => {
              handleAudit(key, 2, 1)
            }}></Button> &nbsp;
          <Button icon={<CloseOutlined />} shape='circle' danger
            onClick={() => {
              handleAudit(key, 3, 0)
            }}></Button>
        </div >
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} rowKey={(item => item.id)} />;
    </div>
  )
}
