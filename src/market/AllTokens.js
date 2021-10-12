import React from 'react';
import Page from './components/page/Page_AllToken';
import Login from './components/loginform/Login';

import './components/TokenTabs.css';

const AllTokens = (props) => {

    const { isLoggedIn, role, address } = props;


        return (
            <div className='transaction-main'>
                {isLoggedIn ?<Page role={role} address={address}/> : <Login />}
            </div>
        )
}


export default AllTokens;