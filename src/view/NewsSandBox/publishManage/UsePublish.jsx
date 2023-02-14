import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
// 操作数据
function UsePublish(props) {
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${props}&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }, [username, props])
    // 下线
    const handlePublish = (id) => {
        axios.patch(`/news/${id}`, {
            "publishState": 3
        }).then(res => {
            notification.open({
                message: `通知`,
                description: `你可以到【发布管理/已下线】中查看你的新闻`,
                placement: "bottomRight",
                duration: 3
            });
        })
        setDataSource(dataSource.filter(item => item.id !== id))
    }
    // 删除
    const handleSunset = (id) => {
        axios.delete(`/news/${id}`)
            .then(res => {
                notification.open({
                    message: `通知`,
                    description: `你已经删除了已下线的新闻`,
                    placement: "bottomRight",
                    duration: 3
                });
            })
        setDataSource(dataSource.filter(item => item.id !== id))
    }
    // 发布
    const handleUnPublish = (id) => {
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.open({
                message: `通知`,
                description: `你可以到【发布管理/已发布】中查看你的新闻`,
                placement: "bottomRight",
                duration: 3
            });
        })
        setDataSource(dataSource.filter(item => item.id !== id))
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleUnPublish
    }
}
export default UsePublish