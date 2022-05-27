import { userInfoApi, userRightApi } from "../../apis/userApi";
import { SET_MENU_LIST, SET_TOKEN, SET_USER_INFO } from "../types";

export function getTokenAct(token){
    return {type:SET_TOKEN, token}
}

export function getUserInfoAct(id) {
    return async function(dispatch){
        let userInfo = await userInfoApi(id)
        if( userInfo.code === 200){
            let userRole = await userRightApi(userInfo.data.role)
            if(userRole.code === 200){
                dispatch({type:SET_USER_INFO, userInfo:userInfo.data, userRight:userRole.data})
            } else {
                dispatch({type:SET_USER_INFO, userInfo:userInfo.data, userRight:[]})
            }
        } else{
            dispatch({type:SET_USER_INFO, userInfo:{}, userRight:[]})
        }
    }
}

export function getMenuAct(menuList) {
    return {type: SET_MENU_LIST, menuList }
}

