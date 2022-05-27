import React , { useState, useEffect, useMemo, useCallback, useRef }from 'react'
import { withRouter } from 'react-router-dom'
import { Menu, Button, Dropdown, Modal, Form, Input, Checkbox, message, Popconfirm} from 'antd'
import { MailOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import './layout.less'
import { changePsdApi } from '../../apis/userApi'
import { getTokenAct } from '../../store/action/commonAct'
const { SubMenu } = Menu;
// 高阶组件
function MainLayout ({location, children, userInfo, menu, history, token, dispatch}){
    //侧边栏是否显示或隐藏
    const [collapsed,setCollapsed] = useState(false),
     [myMenu, setMyMenu] = useState([]),
     [show, setShow] = useState(false),
     [psd, setPsd] = useState({newPassword:'', confirmPassword:''}),
     [navMenu,setNav] = useState({menu:'',subMenu:''}),
    //  const formNode = useRef()
    [formNode] = Form.useForm()
    const menuClickEvt = useCallback((item)=>{
         history.push(item.path)
     },[])

     // 修改密码提交
    const submitEvt = useCallback(()=>{

        // formNode.current.validateFields().then(()=>{
        formNode.validateFields().then(()=>{
            console.log('表单校验成功');
            changePsdApi({id: userInfo.id, password:psd.newPassword }).then(d=>{
                if(d.code === 200){
                    message.success('修改成功，请使用新密码重新登录')
                    formNode.resetFields()  //重置表单
                    setShow(false)  //关闭modal
                    history.push("/login") //回到登录页面
                    dispatch(getTokenAct('')) //删除token
                } else {
                    message.warn('修改失败，请重试')
                    formNode.resetFields()
                }
            })
        }).catch(()=>{})
    },[psd,formNode])
    
    //取消修改密码
    const cancelEvt = useCallback(function(){
        if(formNode.getFieldsValue().confirmPassword || formNode.getFieldsValue().newPassword){
            if(window.confirm('是否要删除已填内容？')){
                setShow(false)
                formNode.resetFields()
            }
        } else {
            setShow(false)
        }
            
    },[])
    
    useEffect(function(){
        // 找到所有一级menu
      let newMenu = menu.filter(it=>it.parentId === '')
    //   给一级menu赋值一个children属性，下面造出二维数组有二级menu
      newMenu = newMenu.map(it=>{
          let _children = menu.filter(oo=> oo.parentId === it.id)
          it.children = _children
          return it
      })
      setMyMenu(newMenu)
    },[menu])

     //是否需要展示layout   首页就不需要
    const islayout = useMemo(()=>(location.pathname === '/login'),[location.pathname])

    // 监听当前路由，然后修改menu上的选项
    useEffect(function(){
    let secondMenu =  menu.find(oo=> oo.path === location.pathname)  // 二级菜单
    let firstMenu = menu.find(oo=> oo.id === secondMenu?.parentId)   // 一级菜单
     setNav({menu:firstMenu?.name || '', subMenu:secondMenu?.name || ''}) 
    },[location.pathname])

    return (
        <div className={collapsed? 'main-layout collapsed':'main-layout'}>
           {
            islayout
            ?
            children
            :
            <>
                <aside>
                   <div className='brand'></div>
                   <div className="menu">
                     {
                         !!navMenu.menu // 因为第一次赋值为空，当获取到navMenu的时候再给页面设置
                         &&
                         <Menu
                        defaultOpenKeys={[navMenu.menu]}
                        selectedKeys={[navMenu.subMenu]}
                        mode="inline"
                        inlineCollapsed={collapsed}
                        // theme="dark"
                        // menu渲染
                        >  
                            {
                                myMenu.map((it,i)=>{
                                    return(
                                        <SubMenu 
                                        key={it.name} icon={<MailOutlined />} title={it.name}>
                                            {
                                                it.children.map(item=>{
                                                    // 这里这里
                                                    return <Menu.Item onClick = {()=>{menuClickEvt(item)}} key={item.name}>{item.name}</Menu.Item>
                                                })
                                            }
                                        </SubMenu>
                                    )
                                })
                            }
                          
                        </Menu>
                     }  
                   </div>
                </aside>
                <article>
                    <nav className='layout-nav-box'>
                         <div className="left">
                            <Button type="primary" 
                            style={{ marginBottom: 16 }}
                            icon={
                                collapsed
                                ?
                                <MenuUnfoldOutlined />
                                :
                                <MenuFoldOutlined />
                            }
                            onClick={
                                ()=>{
                                    setCollapsed(!collapsed)
                                }
                            } 
                            >
                            </Button>
                            <span className='current-in'>当前位置：{navMenu.menu} &gt; {navMenu.subMenu}</span>
                         </div>
                         <div className="right">
                            <Dropdown 
                            overlay={
                               <ul>
                                   <li onClick={()=>{ setShow(true)}}>修改密码</li>
                                   <li onClick={()=>{
                                       history.push('/login')
                                       dispatch(getTokenAct(''))
                                     }}>退出系统</li>
                               </ul>
                                 }
                                placement="bottom"
                                 trigger={['click']}>
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                 {userInfo.name} <DownOutlined />
                                </a>
                            </Dropdown>
                            <Dropdown 
                                overlay={
                                    <i className="qrCode"></i>
                                }
                                placement="bottomRight"
                                trigger={['click']}
                                 >
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                 App下载 <DownOutlined />
                                </a>
                            </Dropdown>
                         </div>
                    </nav>
                    <main>
                        {
                         children
                        }
                    </main>
                </article>
            </>
            // 弹框修改密码部分
           }
             <Modal title="修改密码" 
             visible={show}
             onOk={function(){
                 submitEvt()
             }}
             onCancel={function(){
                 cancelEvt()
                }}
             maskClosable={false}
             >
                <Form
                labelCol={{ span: 8 }} 
                // ref={formNode}
                form={formNode}
                >
          
                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, message: '密码至少是6位!' },
                        ]}
                    >
                        <Input.Password value={psd.newPassword} onChange={
                            e=>{
                                setPsd({...psd, newPassword: e.target.value})
                            }
                        }/>
                    </Form.Item>

                    <Form.Item
                        label="新密码确认"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: '请确认新密码' },
                            { validator: function(_, v){
                                if(v === psd.newPassword){
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error('两次输入密码不一致！'))
                            }}
                        ]}
                    >
                        <Input.Password value={psd.confirmPassword} onChange={
                            e=>{
                                setPsd({...psd, confirmPassword: e.target.value})
                            }
                        }/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
const mapStatetoProp = function(state){
    return {
        menu: state.menu.menuList,
        userInfo: state.common.userInfo,
        token: state.common.token,
    }
}

export default connect(mapStatetoProp)( withRouter(MainLayout) )