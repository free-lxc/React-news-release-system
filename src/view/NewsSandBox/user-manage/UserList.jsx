import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Popover, Switch, Form } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/User-mange/UserForm';
export default function UserList() {
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  const [open, setOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [useUpdate, setUseUpdate] = useState([])
  const [useDate, setUseDate] = useState({})
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
    axios.delete(`http://localhost:4000/users/${key.id}`)
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
    axios.get("http://localhost:4000/users?_expand=role").then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === "superAdmin" ? list :
        [
          // 获取自己以及与自己同一地域的编辑
          ...list.filter(item => item.username === username),
          ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
        ])
    })
    axios.get("http://localhost:4000/regions").then(res => {
      setRegionList(res.data)
    })
    axios.get("http://localhost:4000/roles").then(res => {
      setRoleList(res.data)
    })
  }, [])
  const onchange = (item) => {
    // console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:4000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const handleUpdate = (key) => {
    setShowOpen(true)
    setUseUpdate(key)
    setUseDate(key)
  }
  const columns = [
    {
      title: "区域",
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })), {
          text: '全球',
          value: "全球"
        }
      ],
      onFilter: (value, item) => value === '全球' ? item.region === '' : item.region === value,
      render: (region) => {
        return <b>{region ? region : '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <b>{username}</b>
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onClick={() => onchange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (key) => {
        return <div>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(key)} disabled={key.default}>
          </Button>&nbsp;
          <Popover content={
            <div style={{ textAlign: "center" }}>
              <Switch checked={key.pagepermisson} onClick={() => {
                switchMethod(key)
              }}></Switch>
            </div>} title="页面配置项" trigger={key.pagepermisson === undefined ? "" : "click"}>
            <Button danger shape="circle" icon={<EditOutlined />} disabled={key.default}
              onClick={() => handleUpdate(key)}>
            </Button>
          </Popover>
        </div>
      }
    },
  ];
  const onCreate = (values) => {
    if (values.roleId === '超级管理员') values.region = ''
    values.roleId = re[values.roleId]
    // 先提交后台，生成id
    axios.post(`http://localhost:4000/users`, {
      ...values,
      "roleState": true,
      "default": values.roleId === 1 ? true : false,
    }).then(res => {
      setDataSource([...dataSource, {
        ...res.data,
        role: roleList.filter(item => item.id === values.roleId)[0]
      }])
    })
    setOpen(false);
  };
  const showCreate = (values) => {
    setShowOpen(false)
    // console.log(values, 1)
    setDataSource(dataSource.map(item => {
      if (item.id === useDate.id) {
        item.username = values.username
        item.password = values.password
        item.region = values.region
        item.role.roleName = values.roleId
        return item
      }
      return item
    }))
    values.roleId = re[values.roleId]
    values.default = values.roleId === 1 ? true : false
    axios.patch(`http://localhost:4000/users/${useDate.id}`, {
      ...values
    })
  }
  // 新建用户信息
  const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="添加用户"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
              // alert('请改变所有的数据！！！')
            });
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} form={form} />
      </Modal >
    );
  };
  // 更改用户信息
  const ShowCreateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={showOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              // console.log('Validate Failed:', info);
              alert('请改变所有的数据！！！')
            });
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} useUpdate={useUpdate} isUpdate={true} form={form} />
      </Modal >
    );
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        添加数据
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <ShowCreateForm
        open={showOpen}
        onCreate={showCreate}
        onCancel={() => {
          setShowOpen(false)
        }}
      />
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id} />

    </div>
  )
}
