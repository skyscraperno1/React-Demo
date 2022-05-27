import React, { useState } from 'react'

export default function Button({myFunc}) {
    const [rate, setRate] = useState('.5')
    console.log('----',rate);
    return (
        <button onClick={function(){
            setRate(Math.random().toFixed(1))
            myFunc('ssss',rate)

        }}>按钮</button>
    )
}
