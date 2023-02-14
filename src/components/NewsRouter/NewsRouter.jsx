import React, { useEffect, useState, lazy } from 'react'
import Home from '../../view/NewsSandBox/home/Home'
import UserList from '../../view/NewsSandBox/user-manage/UserList'
import RightList from '../../view/NewsSandBox/right-manage/RightList'
import RoleList from '../../view/NewsSandBox/right-manage/RoleList'
import NoPermission from '../../view/NewsSandBox/noPermission/NoPermission'
import NewsAdd from '../../view/NewsSandBox/newsManage/NewsAdd'
import NewsDraft from '../../view/NewsSandBox/newsManage/NewsDraft'
import NewsCategory from '../../view/NewsSandBox/newsManage/NewsCategory'
import Audit from '../../view/NewsSandBox/auditManage/Audit'
import AuditList from '../../view/NewsSandBox/auditManage/AuditList'
import Unpublished from '../../view/NewsSandBox/publishManage/Unpublished'
import Published from '../../view/NewsSandBox/publishManage/Published'
import Sunset from '../../view/NewsSandBox/publishManage/Sunset'
import { Redirect, Route, Switch } from 'react-router-dom'
import NewsPreview from '../../view/NewsSandBox/newsManage/NewsPreview'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import NewsUpdate from '../../view/NewsSandBox/newsManage/NewsUpdate'
const localRouterMap = {
    '/home': Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    // 新闻
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,

    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,

    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}
function NewsRouter(props) {
    const [backRouteList, setBackRouteList] = useState([])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:4000/rights"),
            axios.get("http://localhost:4000/children")
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRoute = (item) => {
        // 路由界面是否打开或删除
        return localRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        // let lx = get()
        // 是否有资格显示页面
        // console.log(lx)
        return rights.includes(item.key)
    }
    function get() {
        var data = localStorage.getItem('token');
        var dataObj = JSON.parse(data);
        // console.log(dataObj.time)
        if (new Date().getTime() - dataObj.time > 1000 * 60 * 60) {
            return false
        } else {
            return true
        }
    }
    return (
        <div>
            <Spin size="large" spinning={props.isLoading}>
                {get() ?
                    <Switch>
                        {
                            backRouteList.map(item => {
                                if (checkRoute(item) && checkUserPermission(item)) {
                                    return <Route path={item.key}
                                        key={item.key}
                                        component={localRouterMap[item.key]}
                                        exact />

                                }
                            })
                        }
                        < Redirect from='/' to='/home' exact />
                        {/* 当所有的都匹配不到时，将会匹配该页面，需要跟上面的exact搭配使用 */}
                        {
                            backRouteList.length > 0 && <Route path='*' component={NoPermission} />
                        }
                    </Switch> : <Redirect to='/login' />
                }
            </Spin>
        </div>
    )
}
const mapStateProps = (state) => {
    const { LoadingReducer: { isLoading } } = state
    return {
        isLoading
    }
}
export default connect(mapStateProps)(NewsRouter)