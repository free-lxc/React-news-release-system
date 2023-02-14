import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, notification } from 'antd'
import axios from 'axios'
const auditList = ['未审核', '审核中', '已通过', '未通过']
const colorList = ['black', 'orange', 'green', 'red']
export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  // 撤销
  const handleRevert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.open({
        message: `通知`,
        description: `你可以到草稿箱中查看你的新闻`,
        placement: "bottomRight",
        duration: 3
      });
    })
  }
  // 发布
  const handleUp = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => {
      notification.open({
        message: `通知`,
        description: `你可以到发布管理/已发布中查看你的新闻`,
        placement: "bottomRight",
        duration: 3
      });
    })
  }
  const { username } = JSON.parse(localStorage.getItem("token"))
  // 获取后台数据
  useEffect(() => {
    // 通过审核但未发布
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      let list = res.data
      // console.log(list)
      setDataSource(list)
    })
  }, [])
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
          {
            key.auditState === 1 && <Button
              onClick={() => handleRevert(key)} >
              撤销
            </Button>
          }
          {
            key.auditState === 2 && <Button
              onClick={() => handleUp(key)} danger>
              发布
            </Button>
          }
          {
            key.auditState === 3 && <Button type="primary"
              onClick={() => {
                props.history.push(`/news-manage/update/${key.id}`)
              }}>
              更新
            </Button>
          }
        </div>
      }
    },
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} rowKey={(item => item.id)} />
    </div>
  )
}
