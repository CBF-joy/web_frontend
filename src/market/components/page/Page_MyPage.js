import React from 'react';

import './Page.css'

import MyPage from '../mypage/MyPage'


const Page_TokenProfile = (props) =>  {
	console.log(props)

    return (
      <div>
        <MyPage address={props.address} currentUser={props.currentUser} username={props.username}/>
      </div>
    )
  }


export default Page_TokenProfile;