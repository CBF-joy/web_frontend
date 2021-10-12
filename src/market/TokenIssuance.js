import React from 'react';
import Page from './components/tokenissuance/TokenIssuance';
import Login from './components/loginform/Login';

import './components/TokenTabs.css';

const TokenIssuance = (props) => {

    const { isLoggedIn, role, address } = props;


        return (
            <div className='transaction-main'>
                {isLoggedIn ?<Page isLoggedIn={isLoggedIn} role={role} address={address}/> : <Login />}
            </div>
        )
}


export default TokenIssuance;