import React, { Component } from 'react'
import Button from './Button';
export default class Item extends Component {
   
    constructor(){
        super()
        this.state={
            list: [],
            msg:'我是Item里面的值'
        }
    }
    componentDidMount(){
         console.log('-------',this.props);
        this.setState(this.props.list)
        console.log(this.state);

    }
    shouldComponentUpdate(newProps, newState){
        return newProps.list !== this.state.list
    }
    render() {
        return (
           <>
            {
                this.props.list.map(it=>{
                    return <div key={it.id}>id：{it.id} --- name：{it.name} price：{it.price}
                    <button onClick={this.props.myFunc.bind(this,'wwwwwwwwwwwww',this.state.msg) }>555</button>
                    <Button myFunc ={this.props.myFunc}></Button>
                    </div>
                })
            }
           </>
        )
    }
}
