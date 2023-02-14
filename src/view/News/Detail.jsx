import React, { useEffect, useState } from 'react'
import { Button, Descriptions, PageHeader, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios';
import moment from 'moment'
export default function Detail(props) {
  const [userInfo, setUserInfo] = useState(null)
  const [stars, setStars] = useState(null)
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(res => {
      setUserInfo({
        ...res.data,
        view: res.data.view + 1
      })
      // 同步后端
      return res.data
    }).then(res => {
      axios.patch(`/news/${props.match.params.id}?`, {
        view: res.view + 1
      })
    })
  }, [props.match.params.id])
  const handleStar = () => {
    if (!stars) {
      setUserInfo({
        ...userInfo,
        star: userInfo.star + 1
      })
      axios.patch(`/news/${props.match.params.id}?`, {
        star: userInfo.star + 1
      })
      setStars(userInfo)
    } else {
      message.error("你已经点过了！", 1)
    }
  }
  return (
    <div className="site-page-header-ghost-wrapper">
      {
        userInfo && <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={userInfo.title}
          subTitle={<div>
            {userInfo.category.title}&nbsp;&nbsp;&nbsp;
            <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
          </div>}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">{userInfo.author}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{
              userInfo.publishTime ? moment(userInfo.publishTime).format('YYYY/MM/DD H:mm:ss') : '-'
            }</Descriptions.Item>
            <Descriptions.Item label="区域">{userInfo.region}</Descriptions.Item>
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
