import React, { Component } from 'react'
import Item from './Item'

export default class Material extends Component {
    state = {
        list:Array.from(Array(6),(_, i)=>{
            return {id:'ID+'+i, name:'华为手机'+i, price: Math.ceil(Math.random()*2000+5000)}
        })
    }
    // getItemMsg = (_this, msg)=>{
    //     console.log(msg);
    //     console.log(_this);
    //     // this.setState({

    //     // })
    // }
    changEvt(state, rate){
        console.log(state);
        console.log(rate);

    }
    render() {
        console.log(this.state.list);
        return (
            <div>
               {
                    <Item list={this.state.list} parent={this}  myFunc = { this.changEvt }></Item>
               }
            </div>
        )
    }
}
