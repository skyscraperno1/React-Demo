import axios from 'axios'
import store from '../store'
import { message } from 'antd'
const Axios = axios.create({
    baseURL: '/apis',
    timeout:9999
})

Axios.interceptors.request.use(config=>{
    // 路由是否需要拦截
    const otherUrl = ['/user/login']

    if(otherUrl.includes(config.url)){
        return config
    }

    //判断token，不存在就通用返回
    let token = store.getState().common.token
    if(!token){
        message.warning('用户票据失效，请重新登陆后再进行接口调用');
    } else {
        config.headers.token = token 
        return config
    }
})

Axios.interceptors.response.use(res=>{
    if(res.status !== 200){
        message.warning(`请求失败，错误：${res.statusText}`)
        return Promise.reject({code:500, message:'请求失败，已经被拦截'})
    }

    // if(res.data.code === 403){
    //     message.error('token已经失效，请重新登录')
    //     return Promise.reject({code: 400, message: '前端错误，已被拦截'})
    // }

    return res.data
})


/**
 * 请求进行async + await处理
 * @param {{url: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH', data: any, params: any}} req 请求对象
 * @returns 
 */
export default req =>{
    if(!req.url) throw new Error('请求没有url？')

    return new Promise(resolve=>{
        Axios.request({
            url: req.url,
            method: req.method || "GET",
            data: req.data || {},
            params: req.params || {},
            onUploadProgress: req.uploadProgress || (()=>{})
            //request(config: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> 它传一个函数进来
        }).then(d=>{
            resolve(d)
        },e=>{
            resolve(e)
        })
    })

}
