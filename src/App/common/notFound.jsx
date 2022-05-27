import React from 'react'

export default function NotFound({history}) {
    console.log(history);

    return (
        <div>notFound
            <button onClick={()=>{history.goBack()}}>返回</button>
        </div>
    )
}
