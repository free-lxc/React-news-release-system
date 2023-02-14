import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, notification } from 'antd'
const auditList = ['未审核', '审核中', '已通过', '未通过']
const colorList = ['black', 'orange', 'green', 'red']

// 提供表单
export default function AuditList(props) {
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
            title: '操作',
            render: (key) => {
                return <div>
                    {
                        props.button(key.id)
                    }
                </div>
            }
        },
    ]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} rowKey={(item => item.id)} />
        </div>
    )
}
