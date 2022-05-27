import React, { Component } from 'react';
import Child from './Child'
class list extends Component {
    constructor(){
        super()
        this.state={
            date: new Date()
        }
    }

    componentDidMount(){
        setInterval(()=>{
            this.setState({
                date:new Date()
            })
        },1000)
    }
    render() {
        return (
            <div>
                 <Child  seconds={1}></Child>
                <div>{this.state.date.toString()}</div>
            </div>
        );
    }
}

export default list;