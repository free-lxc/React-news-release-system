import React, { useEffect, useState } from 'react'
import { Button, Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from 'moment'
export default function NewsPreview(props) {
    const [userInfo, setUserInfo] = useState(null)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(res => {
            setUserInfo(res.data)
        })
    }, [props.match.params.id])
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['black', 'orange', 'green', 'red']
    return (
        <div className="site-page-header-ghost-wrapper">
            {
                userInfo && <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={userInfo.title}
                    subTitle={userInfo.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{userInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间"><a>{moment(userInfo.createTime).format('YYYY/MM/DD H:mm:ss')}</a></Descriptions.Item>
                        <Descriptions.Item label="发布时间">{
                            userInfo.publishTime ? moment(userInfo.publishTime).format('YYYY/MM/DD H:mm:ss') : '-'
                        }</Descriptions.Item>
                        <Descriptions.Item label="区域">{userInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态">
                            <span style={{ color: colorList[userInfo.auditState] }}>{
                                auditList[userInfo.auditState]
                            }</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态" >
                            <span style={{ color: colorList[userInfo.publishState] }}>{
                                publishList[userInfo.publishState]
                            }</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量">{userInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{userInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">0</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
            }
            <div dangerouslySetInnerHTML={{
                __html: userInfo?.content
            }} style={{
                border: "1px solid red",
                padding: "0 24px",
                margin: "24px 0"
            }}>
            </div>
        </div>
    )
}
