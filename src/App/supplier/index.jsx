import React from 'react'
import CounterClass from './CounterClass'
import CounterFunction from './CounterFunction'



export default class Supplier extends React.Component {
    state = {
        count : 123
    };
    render() {
        return (
            <div className="App" onClick={() => this.setState({count: 456})}>
                <CounterFunction count={this.state.count}/>
                <CounterClass count={this.state.count} />
            </div>
        );
    }
}
