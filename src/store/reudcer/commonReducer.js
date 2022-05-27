import { SET_TOKEN, SET_USER_INFO,SET_USER_RIGHT } from "../types";
import {AES, enc } from 'crypto-js'
const KEY = 'djniodnaobuia'
let cache = sessionStorage.getItem('my-redux') 
  if(!!cache){
    try {
      cache = AES.decrypt(cache, KEY).toString(enc.Utf8)
    } catch(e) {
      console.log(e)
      sessionStorage.removeItem('my-redux')
      cache = null
    }
  } 
cache = JSON.parse(cache) 

let initState = {
    userInfo: cache?.userInfo || {},
    userRight: cache?.userRight || {},
    token: cache?.token || ''
}

const common = function(state = initState, action) {
  let newState = JSON.parse(JSON.stringify(state))
  switch(action.type) {
     
      case SET_TOKEN:
          newState.token = action.token
          sessionStorage.setItem('my-redux', AES.encrypt(JSON.stringify(newState), KEY).toString())
          return newState
      case SET_USER_INFO:
           newState.userInfo = action.userInfo
           newState.userRight = action.userRight
           sessionStorage.setItem('my-redux', AES.encrypt(JSON.stringify(newState), KEY).toString())
           return newState
      case SET_USER_RIGHT:
           newState.userRight = action.userRight
          //  sessionStorage.setItem('my-redux', AES.encrypt(JSON.stringify(newState), KEY).toString())
           return newState
      default:
           return newState
  }
}
export default common