// import React, { Component, PureComponent } from 'react';

// class Child extends PureComponent {
//     render() {
//         console.log('i m rendering');
//         return (
//             <div>
//                  <div>I am update every {this.props.seconds} seconds</div>
//             </div>
//         );
//     }
// }

// export default Child;

//函数组件的写法
import React ,{ memo }from 'react'

function Child( {seconds}) {
        console.log('i m rendering');

    return (
        <div>
            <div>I am update every {seconds} seconds</div>
        </div>
    )
}
export default memo(Child)
