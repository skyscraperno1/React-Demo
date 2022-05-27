import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input, Button, Pagination, Table, Popconfirm, message, Modal} from 'antd'
import '../../style/index.less'
import { userDelApi, userListApi } from '../../apis/userApi'
// 引入redux库，获取state中的数据
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

function List({userRight, userName, history}) {

    const columns = [
        {
            align: 'center',
            dataIndex: 'id', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            fixed: true, // 'left'
            key: 'id', // 如果dataIndex的值在columns中是唯一的，那么可以省略key属性
            title: '用户编码',
            width: 60
          },
          {
            dataIndex: 'name', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '用户名',
            width: 60
          },
          {
            dataIndex: 'dept', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '用户部门',
            width: 60
          },
          {
            dataIndex: 'duties', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '用户职位',
            width: 60
          },
          {
            dataIndex: 'phone', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '用户电话',
            width: 60
          },
          {
            dataIndex: 'email', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '用户邮箱',
            width: 60
          },
          {
            dataIndex: 'remark', // 数据项中每一列对应的key userList[{id: 'admin'}]
            ellipsis: true, // 超过宽度的文本会被省略
            title: '备注',
            width: 60
          },
          {
            key: 'opt', 
            fixed:'right',
            title: '操作',
            width: 60,
            render(_row){
                return(
                    <>
                        <Button size='small' type='text'
                        style={{color:'rgb(0 150 136)' }}
                        onClick={function(){
                            if(userRight.includes('U')){
                                // message.success('您可以编辑')
                                history.push({
                                    pathname:'/user/edit', 
                                    state: {id: _row.id}, // 路由state传参 对面用location.state接
                                    // params: {id: _row.id}, // 路由params传参 对面用location.params接 刷新不存在
                                    // query:{id: _row.id} 
                                 })
                            } else {
                                message.warn('您没有此权限，请联系管理员修改')
                            }
                        }}
                        >编辑</Button>
                        <Popconfirm placement="bottomRight"
                            title={`您确定要删除【${_row.name}】的用户信息？`}
                            onConfirm={deleteEvt.bind(null, _row)}
                            okText="Yes"
                            cancelText="No">
                            <Button type='text' siza='small' style={{color:'rgb(0 150 136)' }}>删除</Button>
                        </Popconfirm>
                        {/* <Button>删除</Button> */}
                    </>
                )
            }
          }
    ],
    [data,setData] = useState([]),
    [total,setTotal] = useState(0),  // 页面最开始为0
    [query, setQuery] = useState({name:'', page: 1, size:20}),
    [name, setName] = useState(''),
    [height, setHeight] = useState(300),
    [loading, setLoading] = useState(true), //页面最开始是在加载的
    tableNode = useRef()
   
    const deleteEvt = useCallback((_row)=>{
      console.log(_row.id);
      userDelApi(_row.id).then(d=>{
          if(d.code === 200){
            console.log(d);
            message.success('删除成功！')
            setQuery({name:'', page: 1, size:20}) // 触发页面刷新
          } else {
            message.warn('删除失败')
          }
      }).catch(r=>{
          console.log(r);
      })
    },[])

    useEffect(function(){
        setLoading(true)
        userListApi(query).then(d=>{
            if(d.code === 200){
                // Each child in a list should have a unique "key" prop.
                // 给每一个属性加上一个key
                setData(d.data.rows.map(it=>{
                    it.key = it.id
                    return it
                }))
                // 设置页面上当前条件查询的结果 
                setTotal(d.data.total)

                // 因为Vue或则React框架为了提高页面渲染的性能，在没有异步情况下的赋值，会进行一个合并，它的原理是使用防抖的原理
                // setData赋值以后，会起一个定时器，不会立刻执行渲染，当执行setTotal的时候，它会销毁之前的定时器
                setTimeout(function(){
                    setLoading(false)
                })
            }
        })
    },[query])

    useEffect(function(){
        // 防抖处理 不能一直计算
        let timer = null
        function resizeEvt(){
            clearTimeout(timer)
            timer = setTimeout(function(){
                // 获取到tableNode的高 减去 padding以及标题所占高度
                setHeight(tableNode.current.clientHeight -16 -39)
            },1000/26)
        }
        window.addEventListener('resize', resizeEvt)
        resizeEvt()
        return function(){
            window.removeEventListener('resize',resizeEvt)
        }
    },[])
    
  
    return (
        <div className='page-container'>
            <header>
                <Input size='middle' placeholder='输入用户名进行查询' onChange={e=>{setName(e.target.value)}}/>
                <Button type='primary' onClick={()=>{
                    setQuery({...query, name, page:1})
                }}>查询</Button>
                {
                    // 公司中按钮权限控制，有两种实现方式
                    // 一、按钮显示，用户点击的时候去判断权限
                    // 二、在页面渲染的时候，如果用户没有权限，则按钮直接不显示
                    userRight.includes("C")
                    &&
                    <Button onClick={()=>{ history.push('/user/edit')}}>新增</Button>
                }
                
            </header>
            <main className='edit-box' ref={tableNode}>
                <Table 
                columns={columns} 
                dataSource={data}  
                size='small'
                pagination={false}
                loading={
                    {size:'default', tip:'数据加载中', spinning:loading}
                }
                scroll={{ x:1098, y: height}} /> 
            </main>
            <footer>
            <Pagination
                size='small'
                total={total}
                current={query.page} //当前页
                pageSize={query.size} // 每一页的数据
                showTotal={t => `一共${t}条数据`}
                pageSizeOptions={[20,50,100]}
                showQuickJumper
                onChange={function(page, size){
                    setQuery({name:'', page, size})
                }}
                />
            </footer>
           
        </div>
    )
}
const mapStatetoProp = function(state){
  return {
      userRight: state.common.userRight.find(oo=> oo.id === 'SYSTEM-01-01')?.role,
      userName: state.common.userInfo.name
  }
}
export default connect(mapStatetoProp)(withRouter(List)) 
