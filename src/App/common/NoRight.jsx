import React, { useCallback } from 'react'
// import { withRouter } from 'react-router-dom';
function NoRight() {
    const backEvt = useCallback(function(){
        window.history.back()
    },[])
    return (
        <div>
            <h3>您没有访问此页面的权限</h3>
            <button onClick={
               backEvt}>返回</button>
        </div>
    )
}

export default NoRight
