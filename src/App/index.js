import React, { useMemo, useState } from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import NotFound from './common/notFound'
import NoRight from './common/NoRight'
import NoLogin from './common/NoLogin'
import Login from './login'
import { connect } from 'react-redux'
// import Home from './home'
// import User from './user'
// import UserEdit from './user/userEdit'
//引入懒加载
import Loadable from 'react-loadable';
//为了简便写 这里的loading组件是小写开头
import loading from './common/Loading';
import MainLayout from './common/MainLayout'
import { message } from 'antd'


function LoaderComponent(loader){
     return Loadable({loader,loading})
 }
// 引入主要的布局
    // 四种基础权限 CRUDA create retrive update delete approve
    // const rightList =[
    //     {path:'/home',rights:['R']},
    //     {path:'/user',rights:['C','R','U','D']},
    //     {path:'/user/edit',rights:['C','R','U','D','A']}
    // ]

    // 后端还需要返回一个菜单数据，包含路由和图标等信息
    // const pathList = [
    //     {path: '/home', right: 'R'},
    //     {path: '/user', right: 'R'},
    //     {path: '/user/edit', right: 'C'}
    // ]

    const pathList = [
            {"path":"/home","right":""},
            {"path":"/project/list","right":"R"},
            {"path":"/project/edit","right":"C"},
            {"path":"/purchase/list","right":"R"},
            {"path":"/purchase/edit","right":"C"},
            {"path":"/receiving/list","right":"R"},
            {"path":"/receiving/edit","right":"C"},
            {"path":"/user/list","right":"R"},
            {"path":"/user/edit","right":"C"},
            {"path":"/role","right":"R"},
            {"path":"/material","right":"R"},
            {"path":"/supplier","right":"R"}
        ]
    

  
function App({  rightList, menuList}) {
    const token = sessionStorage.getItem('token')
    
    const routes = useMemo(function(){
        return pathList.map((it,i)=>{
            const MyComponent = LoaderComponent(() => import('.'+it.path))
            return (  
            <Route path={it.path} key={i} render={
                function({location, history}){
                    if(!!token){
                        // 根据当前路由获取当前菜单需要的权限
                        let nowPath = pathList.find(oo=> oo.path === location.pathname)
                        // 如果不需要权限直接登陆
                        if(!nowPath.right) {
                            return <MyComponent/>
                        }
                        // 需要根据路由在菜单数据中查找编码，因为权限信息是用菜单编码进行关联的
                        let nowMenu = menuList.find(oo=> oo.path === location.pathname)
                        // 根据菜单编码获取当前用户对于当前菜单的权限
                        let nowRight = rightList.find(oo=> oo.id === nowMenu.id)
                        if(!nowRight){
                            // 没有权限
                            message.warn('你没有此页面的使用权限，请联系管理员')
                            return <NoRight/>
    
                        } else {
                            //根据用户的权限和当前菜单需要的权限进行对比
                            if(nowRight.role.includes(nowPath.right)){
                                return <MyComponent/>
                            } else {
                                message.warn('你没有此页面的使用权限，请联系管理员')
                                return <NoRight/>
                            }
                        }
                    }else{
                        message.warn('没有token，请重新登陆')
                        history.push('/login')
                    }
                }}/>
            )
        })
    },[token, rightList, menuList])

    return (
       <Router>
           <MainLayout>
                <Switch>
                    <Route path='/404' component={NotFound}/>
                    <Route path='/loading' component={loading}/>
                    <Route path='/login' component={Login}/>
                    {routes}
                    <Redirect path='/' to='/login' exact/> 
                    <Redirect to='/404'/>
                </Switch>
           </MainLayout>
       </Router>
    )
}


const mapStateToProps = (state)=>  ({
    // token: state.common.token,
    rightList: state.common.userRight,
    menuList: state.menu.menuList
})

export default connect(mapStateToProps)(App)