import React from 'react'
import { withRouter } from 'react-router-dom';
function NoRight({history}) {
    return (
        <div>You have not logged.Please goback to Login page to log your account.
            <button onClick={()=>{history.goBack()}}>返回</button>
        </div>
    )
}

export default withRouter(NoRight)
