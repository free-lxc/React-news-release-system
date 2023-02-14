import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'
export default function News() {
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category')
            .then(res => {
                setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            })
    }, [])
    return (
        <div style={{
            width: '90%',
            margin: 0
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {/* <Col span={8}>
                        <Card title="Card title" bordered hoverable>
                            <List
                                size="small"
                                dataSource={['1', '2']}
                                pagination={{
                                    pageSize: 3
                                }}
                                renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                        </Card> */}
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered hoverable>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 2
                                        }}
                                        renderItem={(item) => <List.Item>
                                            <a href={`#/detail/${item.id}`}>{item.title}</a>
                                        </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}
