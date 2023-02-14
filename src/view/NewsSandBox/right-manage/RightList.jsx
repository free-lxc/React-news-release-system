import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  const confirmMethod = (key) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "你确定要删除吗！！！",
      onOk() {
        deleteMethod(key)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (key) => {
    // console.log(key)
    // 当前页面同步状态，并同步后端
    if (key.grade === 1) {
      setDataSource(dataSource.filter(item => item.id !== key.id))
      // axios.delete(`http://localhost:4000/rights/${key.id}`)
    }
    else {
      // 这个方法只能保证dataSource一层不变,但不能保证多层不变，里面的已经发生了改变
      let list = dataSource.filter(item => item.id === key.rightId)
      list[0].children = list[0].children.filter(item => item.id !== key.id)
      // 上述已经改变了dataSource里面的改变
      setDataSource([...dataSource])
      // axios.delete(`http://localhost:4000/children/${key.id}`)
    }

  }
  const switchMethod = (key) => {
    key.pagepermisson = key.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (key.grade === 1) {
      axios.patch(`http://localhost:4000/rights/${key.id}`, {
        pagepermisson: key.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:4000/children/${key.id}`, {
        pagepermisson: key.pagepermisson
      })
    }
  }
  useEffect(() => {
    axios.get("http://localhost:4000/rights?_embed=children").then(res => {
      let list = res.data
      list.forEach(item => {
        if (item.children.length === 0)
          item.children = ''
      })
      setDataSource(list)
    })
  }, [])
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (key) => {
        return <div>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(key)}>
          </Button>&nbsp;
          <Popover content={
            <div style={{ textAlign: "center" }}>
              <Switch checked={key.pagepermisson} onClick={() => {
                switchMethod(key)
              }}></Switch>
            </div>} title="页面配置项" trigger={key.pagepermisson === undefined ? "" : "click"}>
            <Button danger shape="circle" icon={<EditOutlined />} disabled={key.pagepermisson === undefined}>
            </Button>
          </Popover>
        </div>
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} />;
    </div>
  )
}
