import React, { useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.less'
import moment from 'moment'
// 调用第三方的接口不要使用封装后的axios，使用原生接口
import axios from 'axios'
import echarts from 'echarts'
import makeOptList from './barCharts'
import { collectionApi } from '../../apis/userApi'
import { message } from 'antd'
import io from 'socket.io-client'
import { makeLineOption } from './lineChart'
import makePieOption from './pieChart'

function Home({history, userInfo}) {
    // console.log(userInfo);
    //使用百度api获取当前城市
    const [city,setCity] = useState(''),
      [lndAndLat ,setLnd] = useState(''),
      [weather ,setWeather] = useState({})

    useEffect(function(){
        new window.BMapGL.Geolocation().getCurrentPosition(function(oo){
            setCity(oo?.address.city || '暂无位置信息')
            //获取维度和经度拼接 30.58104.07 根据和风天气官方文档这里我们需要传入经度小数点后两位+维度小数点后两位
            try{
                var l = (oo.longitude*1).toFixed(2)+','+(oo.latitude*1).toFixed(2)
                setLnd(l)
            }catch(e){}
        },{enableHighAccuracy:true, SDKLocation:true, timeout: 6})
    },[window.BMapGL])
    // 获取天气接口
    // https://devapi.heweather.net/v7/weather/now?location=101270101&key=8df82472137d4e7f95b18693a86bec41
    // 当页面获取到经纬度的时候 开始发送请求获取天气
    useEffect(function(){
        axios.get(`https://devapi.qweather.com/v7/weather/now?location=${lndAndLat}&key=6a8cf3d3ba034902ab59a990f158391e`)
        .then(d=>{
            setWeather(d.data.now)
        })
    },[lndAndLat])

    //获取柱状图 版块 ---------------
    const barNode = useRef()
    useEffect(function(){
       const barChart = echarts.init(barNode.current)
       
       let timer = null
       function loopRender(){
        collectionApi().then(d=>{
            barChart.setOption(makeOptList(d.data))
        }).catch(r=>{
            // console.log(r);
            console.log('网络异常，获取图表数据失败')
        })
        // 这就是长轮询 用递归处理 5s变化一次数据
        timer = setTimeout(()=>{
            loopRender()
        },5000)
       }
       loopRender()

       //重绘echats大小
       let resizeTimer = null 
       function resizeChart(){
            clearTimeout(resizeTimer)
            setTimeout(function(){
                barChart.resize()
            },1000/26)
       }
       window.addEventListener('resize',resizeChart)
       //实现离开生命周期 -- 卸载componentWillUnmount
       return function(){
           clearTimeout(timer)
           window.removeEventListener('resize',resizeChart)
       }
    },[])
    
    // 折线图版块 ---------------------
    const lineNode = useRef()
    useEffect(function(){
        const lineChart = echarts.init(lineNode.current)
        lineChart.setOption(makeLineOption())

        let resizeTimer = null 
        function resizeChart(){
             clearTimeout(resizeTimer)
             resizeTimer = setTimeout(function(){
                lineChart.resize()
             },1000/26)
        }
        window.addEventListener('resize',resizeChart)
        //实现离开生命周期 -- 卸载componentWillUnmount
        return function(){
            window.removeEventListener('resize',resizeChart)
        }
    },[])

    // pie图版块 ------------------------
    const pieNode = useRef()
    useEffect(function(){
        const pieChart = echarts.init(pieNode.current)
        const socket = io('ws://www.shuiyue.info:20000')
        socket.on('connect',function(){
            console.log('---------------连接成功');
             
            socket.emit('clientEvt', {type: 'getTodayHot'}) //发信息给后端
        })
       socket.on('serverEvt',function(d){
            
                // console.log('监听数据',d);
                pieChart.setOption(makePieOption(d))
        })
        socket.on('disconnect',function(){
            console.log('---------------断开连接');
        })
       return function(){
           // 断开连接
           socket.close()
       } 
    },[])

    // 查看是否用户有上传头像
    const [hasImg, setHasImg] = useState(false)
    useEffect(function(){
        setHasImg(/^\/photo/.test(userInfo.photo)) // 如果上传了 地址一定是以/photo开头的
    },[userInfo.photo])
    
     return (
        <div className='home-box'>
            <div className='row'>
                <div className='item'>
                    {
                        !hasImg
                        ?
                        <i className='user-img'></i>
                        :
                        <i className='user-img' style={{backgroundImage:`url(http://www.shuiyue.info:20000${userInfo.photo})`}}></i>
                    }
                    <h3>{userInfo.name} — {userInfo.dept}</h3>
                    <p>您好，欢迎登录贸易跟单系统</p>
                    <p>今天是：{moment().format('YYYY年MM月DD日')}</p>
                    {
                        //当天气和城市都获取到的时候
                        city && weather
                        ?
                        <>
                        <p>您所在的城市：{city}</p>
                        <p>天气:{weather?.text}, 温度:{weather?.temp}℃, 湿度:{weather?.humidity}</p>
                        </>
                        :
                        <>
                        <p>您所在的城市：加载中...</p>
                        <p>天气:加载中...</p>
                        </>
                    }
                </div>
                <div className='item'>
                     <div className="chart-box" ref={barNode}></div>
                </div>
            </div>
            <div className='row'>
                <div className='item' ref={pieNode}></div>
                <div className='item' ref={lineNode}></div>
            </div>
        </div>
    )
}

const mapStateToProps = state=>{
  return {
      userInfo: state.common.userInfo,
      token: state.common.token
  }
}
export default connect(mapStateToProps)(withRouter(Home))
