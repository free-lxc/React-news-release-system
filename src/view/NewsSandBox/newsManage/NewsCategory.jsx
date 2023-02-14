import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Tag, Button, Modal, notification, Input, Form } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function NewsCategory(props) {
  const EditableContext = React.createContext(null);
  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
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
    setDataSource(dataSource.filter(item => item.id !== key.id))
    // axios.delete(`/categories/${key.id}`)
  }
  // 获取后台数据
  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })
  }, [])

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave = (row) => {
    setDataSource(dataSource.map(item => {
      if (item.id === row.id) {
        return {
          id: row.id,
          title: row.title,
          value: row.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${row.id}`, {
      title: row.title,
      value: row.title
    })
  };
  // 列表
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return id
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      render: (title) => {
        return title
      },
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (key) => {
        return <div>
          <Button icon={<DeleteOutlined />} shape='circle' danger
            onClick={() => confirmMethod(key)}></Button>
        </div >
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 6
        }} rowKey={(item => item.id)}
        components={
          {
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }
        } />;
    </div>
  )
}
