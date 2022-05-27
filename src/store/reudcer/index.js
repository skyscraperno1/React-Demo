import { combineReducers } from 'redux'
import common from './commonReducer'
import menu from './menuReducer'


export default combineReducers({
    common,
    menu
})