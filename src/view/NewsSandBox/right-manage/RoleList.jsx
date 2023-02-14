import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios'
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeData, setTreeData] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentIId, setCurrentId] = useState(0)
  const { confirm } = Modal;
  useEffect(() => {
    axios.get("http://localhost:4000/roles").then(res => {
      setDataSource(res.data)
    })
    axios.get("http://localhost:4000/rights?_embed=children").then(res => {
      setTreeData(res.data)
    })
  }, [])
  const showModal = (key) => {
    setIsModalOpen(true);
    setCurrentRights(key.rights)
    setCurrentId(key.id)
  };
  const handleOk = () => {
    setIsModalOpen(false);
    // console.log(currentRights)
    // console.log(currentIId)
    setDataSource(dataSource.map(item => {
      if (item.id === currentIId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:4000/roles/${currentIId}`, {
      rights: currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checkedKeys, info) => {
    // console.log(checkedKeys)
    setCurrentRights(checkedKeys.checked)
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (key) => {
        return <div>

          <Button type="primary" shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(key)}>
          </Button>&nbsp;
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />}
            onClick={() => { showModal(key) }}>
          </Button>

        </div>
      }
    },
  ];

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
    setDataSource(dataSource.filter(item => item.id !== key.id))
    // axios.delete(`http://localhost:4000/roles/${key.id}`)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id} />;
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={currentRights}
          checkStrictly
          treeData={treeData}
        />
      </Modal>
    </div>
  )
}
