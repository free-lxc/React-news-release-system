import React, { useState, useEffect } from 'react'
import { Form, Select, Input } from 'antd'
export default function UserForm(props) {
    const roleObj = {
        "1": "superAdmin",
        "2": "admin",
        "3": "editor"
    }
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    const [isDisabled, setDisabled] = useState(false)
    const [regionData, setRegionData] = useState([])
    const [useData, setUseData] = useState([])
    const handleChange = (value) => {
        setDisabled(value === '超级管理员' ? true : false)
    };
    useEffect(() => {
        // 更新用户
        if (props.isUpdate) {
            if (roleObj[roleId] === "superAdmin") {
                setRegionData(props.regionList)
                setUseData(Array.from(props.roleList).map(item => {
                    let obj = {}
                    obj.value = item.roleName
                    obj.id = item.id
                    return obj
                }))
            } else {
                setRegionData(props.regionList.filter(item => item.title === region))
                setUseData(Array.from(props.roleList).map(item => {
                    let obj = {}
                    obj.value = item.roleName
                    obj.id = item.id
                    return obj

                }).filter(item => {
                    return item.id >= roleId
                }))
            }
        } else {
            // 新建用户
            if (roleObj[roleId] === "superAdmin") {
                setRegionData(props.regionList)
                setUseData(Array.from(props.roleList).map(item => {
                    let obj = {}
                    obj.value = item.roleName
                    obj.id = item.id
                    return obj
                }))
            } else {
                setRegionData(props.regionList.filter(item => item.title === region))
                setUseData(Array.from(props.roleList).map(item => {
                    let obj = {}
                    obj.value = item.roleName
                    obj.id = item.id
                    return obj
                }).filter(item => {
                    return item.id > roleId
                }))

            }
        }
    }, [])
    return (
        <Form
            form={props.form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
                modifier: 'public',
            }}
        >
            <Form.Item
                name="username"
                label="用户名"
                initialValue={props.useUpdate ? props.useUpdate.username : ''}
                rules={[
                    {
                        // required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input value={123}
                // defaultValue={props.useUpdate ? props.useUpdate.username : ''} 
                />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                initialValue={props.useUpdate ? props.useUpdate.password : ''}
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]} >
                <Input.Password value={123}
                // defaultValue={props.useUpdate ? props.useUpdate.password : ''} 
                />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                initialValue={props.useUpdate ? props.useUpdate.region : ''}
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    }
                ]}
            >
                <Select
                    // defaultValue="亚洲"
                    style={{
                        width: "100%",
                    }}
                    disabled={isDisabled}
                    options={
                        regionData
                    }
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                initialValue={props.useUpdate ? props.useUpdate.role.roleName : ''}
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]} >
                <Select
                    style={{
                        width: "100%",
                    }}
                    // defaultValue={props.useUpdate ? props.useUpdate.role.roleName : ''}
                    onChange={handleChange}
                    options={useData}

                >
                </Select>
            </Form.Item>
        </Form >
    )
}
