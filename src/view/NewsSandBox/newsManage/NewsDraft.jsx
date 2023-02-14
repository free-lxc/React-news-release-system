import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, notification } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons';
export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  // 是否删除
  const confirmMethod = (key) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "你确定要删除吗！！！",
      onOk() {
        deleteMethod(key)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  // 确认删除后
  const deleteMethod = (key) => {
    setDataSource(dataSource.filter(item => item.id !== key.id))
    axios.delete(`/news/${key.id}`)

  }
  // 上传审核
  const handleCheck = (key) => {
    axios.patch(`/news/${key.id}`, {
      auditState: 1
    }).then(res => {
      notification.open({
        message: `通知`,
        description: `你可以到审核列表中查看你的新闻`,
        placement: "bottomRight",
        duration: 3
      });
      props.history.push('/audit-manage/list')
    })
  }
  const { username } = JSON.parse(localStorage.getItem("token"))
  // 获取后台数据
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      let list = res.data
      setDataSource(list)
    })
  }, [])
  // 列表
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
      title: '操作',
      key: 'cao',
      render: (key) => {
        return <div>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(key)}>
          </Button>&nbsp;
          <Button danger shape="circle" icon={<EditOutlined />}
            onClick={() => {
              props.history.push(`/news-manage/update/${key.id}`)
            }}>
          </Button>&nbsp;
          <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />}
            onClick={() => { handleCheck(key) }}>
          </Button>
        </div>
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} rowKey={(item => item.id)} />
    </div>
  )
}
