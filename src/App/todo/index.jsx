import React from 'react'

export default function Todo() {
    const list = Array.from(Array(6),(_,i)=>{
        return {id: 0+i, name:'张三'+i, time:'2022-03-0'+(i+1)}
    })
    return (
        <div>
            {
                list.map(it=>{
                    return (
                    <li key={it.id}>
                          姓名：{it.name} --- 时间：{it.time}
                    </li>
                    )
                })
            }
           
        </div>
    )
}
