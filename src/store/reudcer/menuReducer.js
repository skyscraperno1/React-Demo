import { SET_MENU_LIST } from "../types";

let cache = sessionStorage.getItem('menu-list')
cache = JSON.parse(cache)

const initState = {
    menuList: cache?.menuList || []
}

export default function(state = initState, action){
    let newState = JSON.parse(JSON.stringify(state))
    switch(action.type) {
        case SET_MENU_LIST:
            newState.menuList = action.menuList
            sessionStorage.setItem('menu-list',JSON.stringify(newState))
            return newState
        default:
            return newState
    }
}