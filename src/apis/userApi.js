import Ajax from './Ajax'

export function loginApi(data){
    return Ajax({
        url:'/user/login',
        method:'POST',
        data
    })
}

export function userInfoApi(id){
    return Ajax({
        url:'/user/info',
        params: {id:id}
    })
}

export function userRightApi(ids){
    return Ajax({
        url:'/role/list/byids',
        params:{ids}
    })
}

export function userMenuApi(){
    return Ajax({
        url:'/menu/list'
    })
}

export function changePsdApi(data){
    return Ajax ({
        url:'/user/update',
        method:'POST',
        data
    })
}

export const collectionApi = () => Ajax({url:'/analysis/collection'})

export function userListApi(params){
    return Ajax({
        url:'/user/list',
        params
    })
} 

export function userDelApi(id){
    return Ajax({
        url:'/user/delete/'+id,
        method:'POST',
    })
}

export function fileUploadApi(data, uploadProgress){
    return Ajax({
        url:'/file/upload/photo',
        method:'POST',
        data,
        uploadProgress
    })
}
/**
 * 
 * @param {*} data 
 * {type:存储文件夹名字,
 *  data:base64字节码, 
 * name:文件名字}
 * @returns Ajax
 */
export function base64UploadApi(data, uploadProgress){
    return Ajax({
        url:'/base64/upload',
        method:'POST',
        data,
        uploadProgress
    })
}

export function deptGetApi(){
    return Ajax({
        url:'/dept/list'
    })
}

export function roleApi(){
    return Ajax({
        url:'role/list'
    })
}

export function userInfoUpdateApi(data){
    return Ajax({
        url:'/user/update',
        method:'POST',
        data
    })
}

export function rolDelApi(id){
    return Ajax({
        url:'/role/delete/' + id,
        method:'POST',
    })

}

export function rolAddApi(data){
    return Ajax({
        url:'/role/save',
        method:'POST',
        data
    })
}