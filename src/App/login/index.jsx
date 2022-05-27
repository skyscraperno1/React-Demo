import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
// import { getTokenAct, getUserInfoAct } from '../../store/action/commonAct'
import { Button, Input, Checkbox, Spin , message }from 'antd'
import {UserOutlined, EyeOutlined } from '@ant-design/icons'
import { loginApi, userMenuApi } from '../../apis/userApi'
import md5 from 'crypto-js/md5'
import { getMenuAct, getTokenAct, getUserInfoAct } from '../../store/action/commonAct'
import aes from 'crypto-js/aes'
import { enc } from 'crypto-js/core'



function Login({history, dispatch}) {
    useEffect(function(){
    
      let cache = localStorage.getItem('remember-info')
      // console.log(cache)
        if(!!cache){
        try{
          cache = aes.decrypt(cache, 'fjdklsan').toString(enc.Utf8).split('&')
          setData({id: cache[0], password: cache[1], remember: true})
        }catch{}
      } 
    },[])

    const [logData, setData] = useState({id:'', password:'', remember:false})
    const loginEvt = useCallback(function(){
      setLoading(true)
      loginApi({id: logData.id, password: md5(logData.password).toString()}).then(d=>{
          if(d.code === 200){
               // 它会返回一个票据，这个票据是后边接口都需要的一个凭证
               // 这个缓存不能是异步的，因为接下来马上要获取用户信息和权限信息，都要用到token，所以它一定不能异步
               dispatch(getTokenAct(d.data.token))

               // 异步获取用户并缓存用户信息
               dispatch(getUserInfoAct(d.data.id))

               //菜单数据必须进入首页之前就要有数据，所以必须接口完成请求以后才能进行页面跳转，所以必须同步
               return userMenuApi()
          } else if(d.code >= 400 && d.code <500){
            message.error('登录失败，'+ d.message)
            setLoading(false)
          }
      }).then(d=>{
        //只有发出了请求才能进入
         if(!!d){
          if(d.code === 200){
            dispatch(getMenuAct(d.data))
            // 因为要记住密码，密码应该存在localStorage里面，所以信息应该要加密、解密
            if(!!logData.remember){
               localStorage.setItem('remember-info', aes.encrypt(logData.id+ '&' +logData.password, 'fjdklsan').toString())
            } else {
               localStorage.removeItem('remember-info')
            }
            setLoading(false)
            history.push('/home')
          }else {
            message.warn('获取菜单失败，网络请求错误')
            setLoading(false)
          }
         }
      })
    },[logData])
   
    
     const [loading, setLoading] = useState(false)
      
    return (
        <div>
             <h3>登陆页面</h3>
             <div className="login-box">
             <Spin className={loading?'loading show':'loading'} size="large"/>
               {/* -------- */}
              <Input size="large" placeholder="account" prefix={<UserOutlined />} value={logData.id} 
              rules={[{ required: true, message: '请输入用户名' }]}
              onChange={
                function(e){
                  // logDispatch({type:'id',value: e.target.value})
                  setData({...logData, id: e.target.value})
                }
              }/>
              <Input.Password size="large" placeholder="password" prefix={<EyeOutlined />} value={logData.password}
              rules={[{ required: true, message: '请出入密码' }]} 
              onChange={
                function(e){
                  setData({...logData, password: e.target.value})
                }
              }/>
              <Checkbox checked={logData.remember} 
              onChange={
                function(e){
                  setData({...logData, remember: e.target.checked})
                }
              }>记住密码</Checkbox>
              <Button type="primary"  block size='middle' 
              onClick={loginEvt} disabled={!logData.id || !logData.password || loading}
              >登陆</Button>
             </div>
        </div>
    )
}
export default connect()(Login)