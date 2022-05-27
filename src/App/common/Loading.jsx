import React from 'react'
import './layout.less'
import {Spin}from 'antd'
export default function Loading() {
 
    return (
        // <div style={imgBox}>
        //     <img src="../../public.loading"/>
        // </div>
        // <div >
        //     <img src={require('./pageLoading.gif')} alt=""/>
        // </div>
        <div className='loading-box'>
            <Spin size='large'/>
        </div>
    )
}
