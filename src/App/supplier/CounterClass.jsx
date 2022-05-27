import React from 'react'


export default class CounterClass extends React.Component {
    showAlert = () => {
        setTimeout(() => {
            alert(this.props.count + '--from Class');
        }, 3000);
    };

    render() {
        return (
            <div>
                <p>He clicked {this.props.count} times</p>
                <button onClick={this.showAlert.bind(this)}>
                  Show count
                </button>
            </div>
        );
    }
}
