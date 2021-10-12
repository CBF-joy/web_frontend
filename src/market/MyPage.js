import React from 'react';
import Page from './components/page/Page_MyPage';
import Login from './components/loginform/Login';
import './components/TokenTabs.css';

const TokenProfile = (props) => {



        const { isLoggedIn, username, address, currentUser } = props;
	
        return (
            <div className='transaction-main'>
                {isLoggedIn ?<Page username={username} address={address} currentUser={currentUser}/> : <Login />}
            </div>
        )
      
    
}


export default TokenProfile;