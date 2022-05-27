import React from 'react'


export default function CounterFunction(props) {
    const { count } = props;
    const showAlert = () => {
        setTimeout(() => {
            alert(count + '--from Function');
        }, 3000);
    };
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={showAlert}>Show count</button>
        </div>
    );
}

