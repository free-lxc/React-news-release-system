import React from 'react'
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom'
import Login from '../view/Login/Login'
import NewsSandBox from '../view/NewsSandBox/NewsSandBox'
import News from '../view/News/News'
import Detail from '../view/News/Detail'
export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/news' component={News} />
                <Route path='/detail/:id' component={Detail} />
                {/* 当没有授权时，重定向到登录界面 */}
                <Route path='/' render={() =>
                    localStorage.getItem("token") ?
                        <NewsSandBox /> :
                        <Redirect to='/login' />
                } />
            </Switch>
        </HashRouter>
    )
}
