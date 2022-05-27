import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../../style/index.less'
import { Button, Form, Input, Row, Col, Select, Spin, message, DatePicker, Checkbox } from 'antd'
import { withRouter } from 'react-router-dom'
// import { Option } from 'antd/lib/mentions'
import  { UploadOutlined }  from '@ant-design/icons'
import { base64UploadApi, deptGetApi, fileUploadApi, roleApi, userInfoApi, userInfoUpdateApi } from '../../apis/userApi'
import moment from 'moment'

function UserEdit({history, location }) {
 
    const [imgLoad, setImgLoad] = useState(false), //图片上传进度spin
         [progress, setProgress] = useState(''),
        [page, setPage] = useState({
            id:'',
            name:'',
            password:'',
            photo:'',
            sex:'未知',
            address:'',
            birthday:'',
            dept:'',
            duties:'',
            phone:'',
            email:'',
            role: [],
            mark:''
        }),

         imgNode = useRef()

    const [isEdit, setIsEdit] = useState(true) //设置是否为编辑状态，如果是编辑那么就不用修改密码

    const photoUploadEvt = useCallback(function(){
        // 需要自己实现一个文件选择器，利用原理是 input type='file'
        // 动态创建一个输入框，然后设置输入框的type为file，可以自触发点击事件
        const inputEle = document.createElement('input')
        inputEle.setAttribute('type','file')
        // 它还可以监听一个onChange事件
        inputEle.addEventListener('change', function(e){

            //open(method: string, url: string , async: boolean)
            // const fd = new FormData()
            // 可以给fd添加数据对象，然后它会对添加的数据进行序列化
            // 在js中File对象就是Blob（大二进制）对象
            let file = e.target.files[0]
            // fd.append('fileName', file)
            // 进行文件上传
            //    fileUploadApi(fd, evt=>{
            //        setImgLoad(true)
            //        setProgress('上传进度：'+(evt.loaded/evt.total).toFixed(2)*100+'%')
            //    }).then(d=>{
            //        setImgLoad(false)
            //        if(d.code === 200){
            //            message.success('上传成功！')
            //        }
            //    })
            // 得到一个文件读取对象
             let fr = new FileReader()
            // 读取完成的回调
             fr.onload = function () {
                //  console.log(this);
                //  新创建一个img对象，给img对象赋值即可
                let img = new Image()
                // 因为图片加载需要时间，所以应该监听onload事件
                img.onload = function(){
                    // 可以把图片进行缩放绘制到canvas上
                    let canvas = document.createElement('canvas')
                    // 设置画布的宽度和高度
                    canvas.width = 200
                    canvas.height = 200
                    canvas.style.border = '1px solid #f0f0f0'
                    // 获取画笔
                    let ctx = canvas.getContext('2d')
                    // 把图片绘制到画布上，那么画布上的图片就会变为200x200
                    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
                    // sourceX/Y/width/height 数据源位置
                    // ctx.drawImage(img, 100, 100, 200, 200, 0, 0, 200, 200)
                    // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 200, 200)
                    // 可以获取base64字节码
                    // let res = canvas.toBlob() //toBlob(callback: BlobCallback, type?: string, quality?: any): void
                   
                    //    常用的手段是：需要对异形图片进行处理，需要做到等比缩放
                    //    先计算宽高，对比宽和高的比例，看谁大谁小
                    // 正方形
                 
                // 把图片绘制在canvas上
                let max
                let rate
                if(img.width > img.height){
                    max = img.width
                    rate = max / 200
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, (200 - img.height / rate)/2, 200, img.height / rate)
 
                } else if (img.width < img.height){
                    max = img.height
                    rate = max / 200
                    ctx.drawImage(img, 0, 0, img.width, img.height, (200 - img.width / rate)/2, 0, img.width / rate, 200)
 
                } else {
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0 , 0, 200, 200)
                }

                    let res = canvas.toDataURL() //toDataURL(type?: string, quality?: any): string 转化为base64
                    // console.log(res);
                    base64UploadApi({
                        type: 'photo',
                        data: res,
                        name: file.name
                    },evt=>{
                        setImgLoad(true)
                        setProgress('上传进度：'+(evt.loaded/evt.total).toFixed(2)*100+'%')
                    }).then(d=>{
                        if(d.code === 200){
                            setImgLoad(false)
                            message.success('上传成功')
                            setPage({...page, photo: d.data})
                            // console.log(d.data);
                        }
                    })
                    //如果盒子里面已经有子节点了
                    if(imgNode.current.hasChildNodes()){
                        let firstChild = imgNode.current.firstChild //找到第一个子节点
                        imgNode.current.removeChild(firstChild)  //删除第一个子节点
                        imgNode.current.appendChild(canvas)  //重新添加一个画布 是新上传的图片

                    } else {
                        imgNode.current.appendChild(canvas)
                    }
                } 
                img.src = this.result
             }
                 // 开始读取 -- 把文件读取为一个base64字节码
             fr.readAsDataURL(file)
        })
 
        // 自触发点击事件
        inputEle.click()
    },[page])

    // 进来就加载部门职责等selection 以及权限信息获取
    const [dept, setDept] = useState([])
    const [roleList, setRoleList] = useState([])
    useEffect(function(){
    
        //部门selec信息获取
        deptGetApi().then(d=>{
            if(d.code === 200){
                setDept(d.data)
            }
        })

        // 权限信息获取
        roleApi().then(d=>{
            if(d.code === 200){
                // console.log(d);
                setRoleList(d.data.rows.map(it=>{
                    it.label = it.name
                    it.value = it.id
                    return it
                }))
            }
        })

        // 当点击了编辑页面过来，获取用户信息
        let id = location.state?.id || ''
        if(!!id){
            userInfoApi(id).then(d=>{
                if(d.code === 200){
                    setIsEdit(false)
                    setPage(d.data)
                    formNode.setFieldsValue({
                        id: d.data.id,
                        name: d.data.name,
                        phone: d.data.phone,
                        role: d.data.role.map(it=>it)
                    })

                }
            })
        }
        
    },[])
   // 根据部门选择 渲染出来职位select框
    const positions = useMemo(function(){
        if(!page.dept){
            return []
        } else {
            return dept.find(oo=> oo.name === page.dept)?.children || []
        }
    },[page.dept])
  
// console.log(page.birthday);
// console.log(moment(page.birthday));

//   保存事件
    const [formNode] = Form.useForm()
    const saveEvt = useCallback(function(){
        console.log(page);

        formNode.validateFields().then(()=>{

            console.log(page);
            // 编辑状态 
            userInfoUpdateApi(page).then(d=>{
                setPage({
                    id:'',
                    name:'',
                    password:'',
                    photo:'',
                    sex:'未知',
                    address:'',
                    birthday:'',
                    dept:'',
                    duties:'',
                    phone:'',
                    email:'',
                    role:[],
                    mark:''
                })
                formNode.resetFields()
                // 上面先重置表单
                if(d.code === 200){
                    message.success('修改信息成功')
                } else {
                    message.warn('提交失败！请重试')
                }
                

                console.log(d);
            })
           
        }).catch(()=>{})
    },[page])

    return (
        <div className='page-container'>
            <header>
                <Button type='primary' onClick={saveEvt}>保存</Button>
                <Button onClick={()=>{history.goBack()}}>返回</Button> 
            </header>
            <main className='edit-box noFooter'>
                <Form labelCol={
                    // 需要统一设置label的宽度
                    {style:{width:'86px'}}
                }
                form={formNode}
                >
                    <Row gutter={12}>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户编码:'
                            name='id'
                            rules={
                                [
                                    {required: true, message:'用户编码必填'}
                                ]
                            }
                            >
                                <Input value={page.id}
                                onChange={
                                    e=>{
                                    setPage({...page, id: e.target.value})
                                    }
                                }
                                />
                            </Form.Item>
                        </Col>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户姓名:'
                            name='name'
                            rules={
                                [
                                    {required: true, message:'用户姓名必填'}
                                ]
                            }
                            >
                                <Input 
                                value={page.name}
                                onChange={
                                    e=>{
                                    setPage({...page, name: e.target.value})
                                    }
                                }
                                />
                            </Form.Item>
                        </Col>
                        {
                            isEdit
                            &&
                            <Col xd={24} md={12} lg={8} xl={6}>
                                <Form.Item label='用户密码:'
                                name='password'
                                rules={
                                    [
                                        {required: true, message:'用户密码必填'}
                                    ]
                                }
                                >
                                    <Input 
                                    value={page.password}
                                    onChange={
                                        e=>{
                                        setPage({...page, password: e.target.value})
                                        }
                                    }
                                    />
                                </Form.Item>
                            </Col>
                        }
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户头像:'>
                            <Input.Group compact >
                                {/* 需要在输入框添加style属性，减去按钮的宽度 */}
                                <Input style={{ width: 'calc(100% - 46px)' }} placeholder={'选择图片'}  value={page.photo} readOnly/>
                                <Button type="primary" onClick={ photoUploadEvt }><UploadOutlined/></Button>
                            </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户性别:'>
                                <Select value={page.sex} 
                                onChange={
                                    e=>{
                                        setPage({...page, sex: e})
                                    }
                                }>
                                      <Select.Option key={'男'} value={'男'}>男</Select.Option>
                                      <Select.Option key={'女'} value={'女'}>女</Select.Option>
                                      <Select.Option key={'未知'} value={'未知'}>未知</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户生日:'>
                                <DatePicker 
                                value={!page.birthday? '': moment(page.birthday)}
                                forma={'YYYY/MM/DD'}
                                    onChange={function(_, date){
                                        setPage({...page, birthday: date})
                                }}/>
                            </Form.Item>
                        </Col>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户部门:'>
                                <Select
                                value={page.dept}
                                onChange={
                                    e=>{
                                       setPage({...page, dept: e})
                                    }
                                }>
                                  
                                    {
                                        dept.map(it=>{
                                            return (
                                                <Select.Option key={it.name} value={it.name}>{it.name}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='用户职位:'>
                                <Select
                                value={page.duties}
                                onChange={
                                    e=>{
                                        setPage({...page, duties: e})
                                    }
                                }
                                >
                                    {
                                        positions.map(it=>{
                                            return <Select.Option key={it} value={it}>{it}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='电话号码:'
                            name='phone'
                            rules={
                                [
                                    
                                    {required: true, message:'电话号码必填'},
                                    // 这个方法要求一定要返回一个Promise
                                    {validator: function(_, v){
                                        if(/^1[3-9]{1}[0-9]{9}$/.test(v)){
                                            return Promise.resolve()
                                        } else {
                                            return Promise.reject( new Error('手机号格式不正确'))
                                        }
                                    }}
                                ]
                            }
                            >
                                <Input 
                                value={page.phone} 
                                onChange={e=>{
                                    setPage({...page, phone:e.target.value})
                                }}
                                placeholder='请输入电话号码'
                                />
                            </Form.Item>
                        </Col>
                        <Col xd={24} md={12} lg={8} xl={6}>
                            <Form.Item label='电子邮箱:' name='email'>
                                <Input 
                                value={page.email}
                                onChange={
                                    e=>{
                                        setPage({...page, email: e.target.value})
                                    }
                                }
                                />
                            </Form.Item>
                        </Col>
                        
                    </Row>
                    <Row>
                    <Col span={24}>
                            <Form.Item label='用户角色:' name='role'>
                                <Checkbox.Group  
                                options={roleList} 
                                onChange={function(e){
                                    console.log(e);
                                    setPage({...page, role:e})
                                }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {/* 显示上传图片div */}
                <div style={{width:'200px',margin:'20px auto'}} ref={imgNode}></div>
            </main>
            {
                // 图片上传进度
                <Spin 
                spinning={imgLoad}
                tip={progress}
                style={
                    {
                        position:'absolute',
                        top:'40%',
                        left:'50%',
                        marginLeft: '-15px'
                    }
                }
                ></Spin>
            }
            
        </div>
    )
}
export default withRouter(UserEdit)
