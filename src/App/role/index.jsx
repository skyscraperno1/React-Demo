import { Button, Form, message, Modal, Table, Popconfirm, Tag, Row, Col, Input, Checkbox } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { rolAddApi, rolDelApi, roleApi } from '../../apis/userApi'
import '../../style/index.less'
import { connect } from 'react-redux'

const mapRole = {
    C: '新增',
    R: '获取',
    U: '更新',
    D: '删除',
    A: '审批'
}


function Role({userRight, menuList}) {
    
    // 页面初始进来获取roleList
    const [roleList, setRoleList] = useState([]),
     [query, setQuery] = useState(''),
    [loading, setLoading] = useState(true)
    useEffect(function() {
        roleApi().then(d=>{
            if(d.code === 200){
                setRoleList(d.data.rows.map(it=>{
                    it.key = it.id
                    it._menu = it.menu.length
                    return it
                }))
                setLoading(false)
            } else {
                message.error('获取列表失败，'+d.message)
            }
        })
    },[query])

    //删除权限接口
    const deleteEvt = useCallback((row)=>{
       
        Modal.confirm({
            title: '删除确认',
            content: `确定要删除【${row.name}】？`,
            onOk: async ()=>{
                let result = await  rolDelApi(row.id)
                if(result.code === 200){
                    message.success('删除成功')
                    setQuery('1')  // 这里是为了改变query重新请求一遍roleList
                    // 这里这里如何重置页面
                } else {
                    message.error('删除失败，'+ result.message)
                }
            }
       })
      

    },[])

    //新增权限  这里这里 写不动了 如何判断至少要选一项，如何处理checked里面的数据
    const [show, setShow] = useState(false),
    [formList, setFormList] = useState({id:'',label:'',role:[]}),
    [formNode] = Form.useForm(),
    addEvt = useCallback(()=>{

       formNode.validateFields().then(list=>{
           setFormList(list)
            setLoading(true)
            rolAddApi().then(d=>{
                if(d.code === 200){
                    console.log(d);
                    setLoading(false)
                } else {
                    message.error('新增失败'+ d.message)
                    setLoading(false)
                }
            })    

        setShow(false)
        formNode.resetFields()
       }).catch(()=>{})
    },[])

    const columns = [
        {
            title:'编号',
            width: 60,
            dataIndex: 'id',
        }, {
            title:'名称',
            width: 60,
            dataIndex: 'name',
        }, {
            title:'菜单',
            width: 60,
            dataIndex: '_menu',
            render:(text)=><Tag color="green">共有{text}个权限</Tag>
        }, {
            title:'备注',
            width: 100,
            ellipsis: true,
            dataIndex:'remark'
        }, {
            title:'操作',
            width: 60,
            key:'opt',
            render(_row){
                return(
                    <>
                      <Button size='small' type='text'  style={{color:'rgb(0 150 136)' }}
                      onClick={()=>{
                          if(userRight.includes('U')){
                              setShow(true)
                          } else {
                            message.warn('您没有此权限，请联系管理员修改')
                          }
                      }}
                    >编辑</Button>
                       <Button type='text' siza='small' style={{color:'rgb(0 150 136)' }} onClick={deleteEvt.bind(null, _row)}>删除</Button>
                    </>
                )
            }

        },
        
    ]
    
    // modal权限框
    const nowMenu = useMemo(()=>{
        // 筛选出所有子菜单
        let subMenu =  menuList.filter(oo=> oo.parentId)
        return subMenu.map(it=>{
            it._role = it.role.split('').map(it=>{
                return mapRole[it]  //权限具体名称
            })
            it.checked = []
            return it
        })
    },[])
 
    return (
        <div className='page-container'>
            <header>
                 <Button
                     type='primary'  
                     onClick={()=>{
                     setLoading(true)
                     roleApi().then(d=>{
                        if(d.code === 200){
                            setRoleList(d.data.rows.map(it=>{
                                it.key = it.id
                                it._menu = it.menu.length
                                return it
                            }))
                            setLoading(false)
                        } else {
                            message.error('获取列表失败，'+d.message)
                        }
                    })
                 }}>查询</Button>
                 {
                    userRight.includes("C") // 有权限才显示新增
                    &&
                    <Button  onClick={()=>{setShow(true)}}>新增</Button>
                 }
            </header>
            <main className='edit-box noFooter'>
                <Table
                 columns={columns}
                 dataSource={roleList}
                 size="small"
                 loading={
                    {size:'default', tip:'数据加载中', spinning:loading}
                }
                pagination={false}
                >
                   
                </Table>
            </main>
            {/* 新增弹出框 */}
            <Modal title="新增权限" 
             visible={show}
             onOk={function(){
                 addEvt()
             }}
             onCancel={function(){
                 setShow(false)
                }}
             maskClosable={false}
             width={1000}
             >
                <Form labelCol={
                    // 需要统一设置label的宽度
                    {style:{width:'86px'}}
                }
                form={formNode}
                >
                    <Row>
                        <Col span={12}>
                          <Form.Item label='权限编码:'
                            name='id'>
                                <Input/>
                          </Form.Item>
                        </Col>
                        <Col span={12} >
                          <Form.Item label='权限名字:'
                          name='label'
                          rules={
                            [
                                {required: true, message:'请填写权限名字'}
                            ]
                          }
                          >
                                <Input/>
                          </Form.Item>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="权限菜单" name='role' >
                                {/* 这里这里 Warning: [antd: Form.Item] `children` is array of render props cannot have `name` */}
                                {
                                    nowMenu.map((it,i)=>{
                                        return (
                                            <div className='role-line-box' key={i}>
                                                <span className="label">{it.name}：</span>
                                               <Checkbox.Group 
                                                // value={it.checked} 
                                                options={it._role}
                                                onChange={e=>{
                                                  nowMenu.map((menu,idx)=>{
                                                      if(idx === i) menu.checked = e
                                                    //   console.log(menu);
                                                      return menu
                                                  })
                                                }}/>
                                            </div>
                                        )
                                    })
                                }
                             
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                          <Form.Item label='权限备注:'
                            name='remark'>
                                <Input/>
                          </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}

const mapStatetoProp = function(state){
    return {
        userRight: state.common.userRight.find(oo=> oo.id === 'SYSTEM-01-04')?.role,
        menuList: state.menu.menuList
    }
  }

export default connect(mapStatetoProp)(Role)